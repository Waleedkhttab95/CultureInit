import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertNewsletterSubscriberSchema, insertPdfDownloadRequestSchema, insertPublishRequestSchema, insertProgramRegistrationSchema, insertArticleSchema, updateArticleSchema, ARTICLE_SITES, type ArticleSite } from "@shared/schema";
import { addContactToBrevo, isBrevoConfigured, sendEmail } from "./brevo";
import { appendRegistrationToSheet, initSheetHeaders, isGoogleSheetsConfigured } from "./google-sheets";
import { fromZodError } from "zod-validation-error";
import { isDbConfigured } from "./db";
import {
  requireAuth,
  requireCsrf,
  verifyAdminCredentials,
  getOrCreateCsrfToken,
  loginRateLimiter,
  adminRateLimiter,
} from "./auth";
import {
  listPublishedArticles,
  getPublishedArticleBySlug,
  listAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "./article-store";

const uploadsDir = "/uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

// Image uploads for the article editor. Filenames are randomized (the
// original name is never used in the path) and restricted by extension
// and MIME type, with a conservative size cap.
const ALLOWED_IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
const imageUpload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `img-${unique}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const okExt = ALLOWED_IMAGE_EXT.includes(ext);
    const okMime = /^image\/(jpe?g|png|webp|gif|avif)$/.test(file.mimetype);
    cb(null, okExt && okMime);
  },
});

// The article CMS requires a database; surface a clear error if it is not
// configured yet rather than throwing an opaque 500.
const requireDb = (_req: any, res: any, next: any) => {
  if (!isDbConfigured()) {
    return res.status(503).json({
      error: "Database not configured. Set DATABASE_URL to use the CMS.",
    });
  }
  next();
};

// Resolve the requested site from a query/body value, defaulting to the
// Cultural Initiative site so existing callers (the cultural site itself,
// which omits the param) keep working unchanged.
function resolveSite(value: unknown): ArticleSite {
  return ARTICLE_SITES.includes(value as ArticleSite)
    ? (value as ArticleSite)
    : "cultural";
}

// The public article API is read cross-origin by the write-community site
// (a separate domain), so allow simple GET requests from any origin. These
// endpoints expose only already-public, published articles.
const publicReadCors: import("express").RequestHandler = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
};

// When a write-community article changes, the (statically built) write-community
// site needs to rebuild to pick it up. If a deploy hook URL is configured we
// ping it; failures are logged but never block the admin response.
function triggerWriteCommunityRebuild(reason: string): void {
  const hook = process.env.WRITE_COMMUNITY_DEPLOY_HOOK_URL;
  if (!hook) return;
  void fetch(hook, { method: "POST" })
    .then((r) =>
      console.log(`[deploy-hook] write-community rebuild (${reason}): ${r.status}`),
    )
    .catch((err) =>
      console.error(`[deploy-hook] write-community rebuild failed (${reason}):`, err),
    );
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ---- Public article API ------------------------------------------------
  // Falls back to the bundled articles.json when no DB is configured, so the
  // cultural site never goes down (see article-store.ts). The optional `site`
  // query param selects which site's articles to return (defaults to
  // "cultural"); write-community fetches with `?site=write-community`.
  app.options("/api/articles", publicReadCors);
  app.options("/api/articles/:slug", publicReadCors);

  app.get("/api/articles", publicReadCors, async (req, res) => {
    try {
      const list = await listPublishedArticles(resolveSite(req.query.site));
      res.json(list);
    } catch (error) {
      console.error("List articles error:", error);
      res.status(500).json({ error: "Failed to load articles" });
    }
  });

  app.get("/api/articles/:slug", publicReadCors, async (req, res) => {
    try {
      const article = await getPublishedArticleBySlug(
        req.params.slug,
        resolveSite(req.query.site),
      );
      if (!article) return res.status(404).json({ error: "Article not found" });
      res.json(article);
    } catch (error) {
      console.error("Get article error:", error);
      res.status(500).json({ error: "Failed to load article" });
    }
  });

  // ---- Admin auth --------------------------------------------------------
  app.post("/api/admin/login", loginRateLimiter, (req, res) => {
    const username = typeof req.body?.username === "string" ? req.body.username : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";

    if (!verifyAdminCredentials(username, password)) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Regenerate the session on login to prevent session fixation.
    req.session.regenerate((err) => {
      if (err) {
        console.error("Session regenerate error:", err);
        return res.status(500).json({ error: "Login failed" });
      }
      req.session.isAdmin = true;
      const csrfToken = getOrCreateCsrfToken(req as any);
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error("Session save error:", saveErr);
          return res.status(500).json({ error: "Login failed" });
        }
        res.json({ authenticated: true, csrfToken });
      });
    });
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.clearCookie("ci.sid");
      res.json({ success: true });
    });
  });

  // Session probe + CSRF token issuer. The client calls this on load to
  // decide whether to show the admin UI, and to get the CSRF token.
  app.get("/api/admin/me", (req, res) => {
    if (!req.session?.isAdmin) {
      return res.status(401).json({ authenticated: false });
    }
    res.json({ authenticated: true, csrfToken: getOrCreateCsrfToken(req as any) });
  });

  // ---- Admin article CRUD (auth + DB required) --------------------------
  app.get("/api/admin/articles", requireAuth, requireDb, async (req, res) => {
    try {
      res.json(await listAllArticles(resolveSite(req.query.site)));
    } catch (error) {
      console.error("Admin list articles error:", error);
      res.status(500).json({ error: "Failed to load articles" });
    }
  });

  app.get("/api/admin/articles/:id", requireAuth, requireDb, async (req, res) => {
    try {
      const article = await getArticleById(req.params.id);
      if (!article) return res.status(404).json({ error: "Article not found" });
      res.json(article);
    } catch (error) {
      console.error("Admin get article error:", error);
      res.status(500).json({ error: "Failed to load article" });
    }
  });

  app.post(
    "/api/admin/articles",
    adminRateLimiter,
    requireAuth,
    requireCsrf,
    requireDb,
    async (req, res) => {
      const result = insertArticleSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: "Validation failed",
          message: fromZodError(result.error).message,
        });
      }
      try {
        const created = await createArticle(result.data);
        if (created.site === "write-community") {
          triggerWriteCommunityRebuild("create");
        }
        res.status(201).json(created);
      } catch (error) {
        console.error("Create article error:", error);
        res.status(500).json({ error: "Failed to create article" });
      }
    },
  );

  app.put(
    "/api/admin/articles/:id",
    adminRateLimiter,
    requireAuth,
    requireCsrf,
    requireDb,
    async (req, res) => {
      const result = updateArticleSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: "Validation failed",
          message: fromZodError(result.error).message,
        });
      }
      try {
        const updated = await updateArticle(req.params.id, result.data);
        if (!updated) return res.status(404).json({ error: "Article not found" });
        if (updated.site === "write-community") {
          triggerWriteCommunityRebuild("update");
        }
        res.json(updated);
      } catch (error) {
        console.error("Update article error:", error);
        res.status(500).json({ error: "Failed to update article" });
      }
    },
  );

  app.delete(
    "/api/admin/articles/:id",
    adminRateLimiter,
    requireAuth,
    requireCsrf,
    requireDb,
    async (req, res) => {
      try {
        const deleted = await deleteArticle(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Article not found" });
        if (deleted.site === "write-community") {
          triggerWriteCommunityRebuild("delete");
        }
        res.json({ success: true });
      } catch (error) {
        console.error("Delete article error:", error);
        res.status(500).json({ error: "Failed to delete article" });
      }
    },
  );

  // Editor image upload.
  app.post(
    "/api/admin/images",
    adminRateLimiter,
    requireAuth,
    requireCsrf,
    imageUpload.single("image"),
    (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: "No valid image uploaded" });
      }
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      res.status(201).json({ url: `${baseUrl}/uploads/${req.file.filename}` });
    },
  );

  // Admin endpoint: list all uploaded CVs (now authentication-protected —
  // this previously leaked applicant PII to anyone).
  app.get("/api/admin/uploads", requireAuth, async (req, res) => {
    try {
      const files = fs.readdirSync(uploadsDir).filter(f => !f.startsWith("."));
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const fileList = files.map(f => ({
        filename: f,
        url: `${baseUrl}/uploads/${f}`,
        uploadedAt: new Date(parseInt(f.split("-")[0])).toISOString(),
      }));
      fileList.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
      res.json(fileList);
    } catch (error) {
      res.status(500).json({ error: "Failed to list uploads" });
    }
  });

  // Newsletter subscription / Contact form endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      // Validate request body
      const result = insertNewsletterSubscriberSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          error: "Validation failed",
          message: validationError.message
        });
      }

      const { email } = result.data;
      const name = req.body.name; // Optional name field from contact form

      // Check if email already exists
      const existingSubscriber = await storage.getNewsletterSubscriberByEmail(email);
      if (existingSubscriber) {
        return res.status(409).json({
          error: "Already subscribed",
          message: "This email is already subscribed to our newsletter"
        });
      }

      // Save to database
      const subscriber = await storage.createNewsletterSubscriber({ email });

      // Add to Brevo if configured
      if (await isBrevoConfigured()) {
        console.log("Brevo is configured, attempting to add contact...");
        console.log("Email:", email);
        console.log("Name:", name);
        console.log("List ID:", process.env.BREVO_LIST_ID);

        try {
          const attributes: Record<string, string> = {
            SIGNUP_SOURCE: 'website_contact_form',
            SIGNUP_DATE: new Date().toISOString(),
          };

          // Add name if provided
          if (name) {
            attributes.NAME = name;
          }

          console.log("Attributes:", attributes);

          const brevoResponse = await addContactToBrevo({
            email,
            listIds: process.env.BREVO_LIST_ID ? [parseInt(process.env.BREVO_LIST_ID)] : [],
            attributes,
          });

          if (brevoResponse) {
            console.log("✅ Brevo contact added successfully! Response:", brevoResponse);
            await storage.updateNewsletterSubscriberBrevoId(email, brevoResponse.id.toString());
          } else {
            console.log("⚠️ Brevo response was null/undefined");
          }
        } catch (brevoError: any) {
          console.error("❌ Brevo integration error:", brevoError);
          console.error("Error details:", brevoError.response?.body || brevoError.message);
          // Don't fail the request if Brevo fails
        }
      } else {
        console.log("⚠️ Brevo is NOT configured - skipping Brevo integration");
      }

      return res.status(201).json({
        success: true,
        message: "Successfully subscribed to newsletter",
        subscriber: {
          id: subscriber.id,
          email: subscriber.email,
        }
      });

    } catch (error) {
      console.error("Newsletter subscription error:", error);
      return res.status(500).json({
        error: "Internal server error",
        message: "Failed to subscribe to newsletter"
      });
    }
  });

  // PDF download request endpoint
  app.post("/api/pdf/download-request", async (req, res) => {
    try {
      // Validate request body
      const result = insertPdfDownloadRequestSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          error: "Validation failed",
          message: validationError.message
        });
      }

      const { name, email } = result.data;

      // Save to database
      const request = await storage.createPdfDownloadRequest({ name, email });

      // Add to Brevo if configured
      if (await isBrevoConfigured()) {
        try {
          const brevoResponse = await addContactToBrevo({
            email,
            listIds: process.env.BREVO_PDF_LIST_ID ? [parseInt(process.env.BREVO_PDF_LIST_ID)] : [],
            attributes: {
              NAME: name,
              SIGNUP_SOURCE: 'pdf_download',
              SIGNUP_DATE: new Date().toISOString(),
            },
          });

          if (brevoResponse) {
            await storage.updatePdfDownloadRequestBrevoId(email, brevoResponse.id.toString());
          }
        } catch (brevoError) {
          console.error("Brevo integration error:", brevoError);
          // Don't fail the request if Brevo fails
        }
      }

      return res.status(201).json({
        success: true,
        message: "Request processed successfully",
        request: {
          id: request.id,
          name: request.name,
          email: request.email,
        }
      });

    } catch (error) {
      console.error("PDF download request error:", error);
      return res.status(500).json({
        error: "Internal server error",
        message: "Failed to process PDF download request"
      });
    }
  });

  // Publish request endpoint
  app.post("/api/publish-request", async (req, res) => {
    try {
      // Validate request body
      const result = insertPublishRequestSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          error: "Validation failed",
          message: validationError.message
        });
      }

      const { name, email, title, message } = result.data;

      // Save to database
      const request = await storage.createPublishRequest({ name, email, title, message });

      // Send email notification
      if (await isBrevoConfigured()) {
        const recipientEmail = process.env.ADMIN_EMAIL || 'admin@culturalinitiative.com';

        await sendEmail({
          to: [{ email: recipientEmail }],
          subject: `طلب نشر جديد: ${title}`,
          htmlContent: `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
              <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin-bottom: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
                  طلب نشر جديد
                </h2>

                <div style="margin-bottom: 20px;">
                  <p style="margin: 10px 0; color: #4b5563;">
                    <strong style="color: #1f2937;">الاسم:</strong> ${name}
                  </p>
                  <p style="margin: 10px 0; color: #4b5563;">
                    <strong style="color: #1f2937;">البريد الإلكتروني:</strong> ${email}
                  </p>
                  <p style="margin: 10px 0; color: #4b5563;">
                    <strong style="color: #1f2937;">العنوان:</strong> ${title}
                  </p>
                </div>

                <div style="background-color: #f3f4f6; border-radius: 6px; padding: 15px; margin-top: 20px;">
                  <p style="margin: 0 0 10px 0; color: #1f2937; font-weight: bold;">الرسالة:</p>
                  <p style="margin: 0; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    تم إرسال هذه الرسالة من نموذج "انشر معنا" في موقع مبادرة الإدارة الثقافية
                  </p>
                </div>
              </div>
            </div>
          `,
          textContent: `
طلب نشر جديد

الاسم: ${name}
البريد الإلكتروني: ${email}
العنوان: ${title}

الرسالة:
${message}

---
تم إرسال هذه الرسالة من نموذج "انشر معنا" في موقع مبادرة الإدارة الثقافية
          `
        });
      }

      // Add to Brevo contact list if configured
      if (await isBrevoConfigured()) {
        try {
          const brevoResponse = await addContactToBrevo({
            email,
            listIds: process.env.BREVO_PUBLISH_LIST_ID ? [parseInt(process.env.BREVO_PUBLISH_LIST_ID)] : [],
            attributes: {
              NAME: name,
              SIGNUP_SOURCE: 'publish_with_us',
              SIGNUP_DATE: new Date().toISOString(),
              PUBLISH_TITLE: title,
              PUBLISH_MESSAGE: message,
            },
          });

          if (brevoResponse) {
            await storage.updatePublishRequestBrevoId(email, brevoResponse.id.toString());
          }
        } catch (brevoError) {
          console.error("Brevo integration error:", brevoError);
          // Don't fail the request if Brevo fails
        }
      }

      return res.status(201).json({
        success: true,
        message: "Request processed successfully",
        request: {
          id: request.id,
          name: request.name,
          email: request.email,
          title: request.title,
          message: request.message,
        }
      });

    } catch (error) {
      console.error("Publish request error:", error);
      return res.status(500).json({
        error: "Internal server error",
        message: "Failed to process publish request"
      });
    }
  });

  // Program registration endpoint
  app.post("/api/program/register", upload.single("resume"), async (req, res) => {
    try {
      const body = { ...req.body };
      let resumeUrl: string | undefined;

      if (req.file) {
        body.resumeFileName = req.file.filename;
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        resumeUrl = `${baseUrl}/uploads/${req.file.filename}`;
      }

      const result = insertProgramRegistrationSchema.safeParse(body);

      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          error: "Validation failed",
          message: validationError.message
        });
      }

      const data = result.data;
      const registration = await storage.createProgramRegistration(data);

      // Save to Google Sheets
      if (await isGoogleSheetsConfigured()) {
        try {
          await appendRegistrationToSheet(data, resumeUrl);
        } catch (sheetError) {
          console.error("Google Sheets error:", sheetError);
        }
      }

      // Send email notification
      if (await isBrevoConfigured()) {
        const recipientEmail = process.env.ADMIN_EMAIL || 'admin@culturalinitiative.com';

        const genderLabel = data.gender === "male" ? "ذكر" : "أنثى";
        const orgTypeLabels: Record<string, string> = { government: "حكومية", private: "خاصة", nonprofit: "غير ربحية", freelance: "مستقل" };
        const worksInCultureLabels: Record<string, string> = { yes: "نعم", no: "لا", partial: "بشكل جزئي" };

        await sendEmail({
          to: [{ email: recipientEmail }],
          subject: `طلب تسجيل جديد في برنامج ممارس الإدارة الثقافية: ${data.fullName}`,
          htmlContent: `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
              <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin-bottom: 20px; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">
                  طلب تسجيل جديد — ممارس الإدارة الثقافية
                </h2>

                <h3 style="color: #d4a574; margin-top: 20px;">البيانات الأساسية</h3>
                <p style="margin: 8px 0; color: #4b5563;"><strong>الاسم:</strong> ${data.fullName}</p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>رقم الهوية:</strong> ${data.idNumber}</p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>الجنس:</strong> ${genderLabel}</p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>الجوال:</strong> ${data.phone}</p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>البريد:</strong> ${data.email}</p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>المدينة:</strong> ${data.city}</p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>العمر:</strong> ${data.age}</p>
                ${data.linkedin ? `<p style="margin: 8px 0; color: #4b5563;"><strong>LinkedIn:</strong> ${data.linkedin}</p>` : ""}

                <h3 style="color: #d4a574; margin-top: 20px;">الخلفية التعليمية والمهنية</h3>
                <p style="margin: 8px 0; color: #4b5563;"><strong>المؤهل:</strong> ${data.qualification}</p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>التخصص:</strong> ${data.major}</p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>جهة الدراسة:</strong> ${data.studyInstitution}</p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>جهة العمل:</strong> ${data.organization}</p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>نوع الجهة:</strong> ${orgTypeLabels[data.orgType] || data.orgType}</p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>سنوات الخبرة:</strong> ${data.yearsOfExperience}</p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>المسمى الوظيفي:</strong> ${data.jobTitle}</p>
                ${data.resumeFileName ? `<p style="margin: 8px 0; color: #4b5563;"><strong>السيرة الذاتية:</strong> ${data.resumeFileName}</p>` : ""}

                <h3 style="color: #d4a574; margin-top: 20px;">الخبرة الثقافية</h3>
                <p style="margin: 8px 0; color: #4b5563;"><strong>يعمل في قطاع ثقافي:</strong> ${worksInCultureLabels[data.worksInCulture] || data.worksInCulture}</p>
                <div style="background-color: #f3f4f6; border-radius: 6px; padding: 15px; margin: 10px 0;">
                  <p style="margin: 0; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${data.cultureExperience}</p>
                </div>

                <h3 style="color: #d4a574; margin-top: 20px;">الالتزام</h3>
                <p style="margin: 8px 0; color: #4b5563;"><strong>حضور اللقاءات:</strong> ${data.canAttendAll === "yes" ? "نعم" : "لا"}</p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>مشروع التخرج:</strong> ${data.canDesignProject === "yes" ? "نعم" : "لا"}</p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>موافقة جهة العمل:</strong> ${data.hasEmployerApproval === "yes" ? "نعم" : data.hasEmployerApproval === "na" ? "لا ينطبق" : "لا"}</p>

                <h3 style="color: #d4a574; margin-top: 20px;">الأسئلة التقييمية</h3>
                <p style="margin: 8px 0; color: #1f2937; font-weight: bold;">أبرز فجوة في إدارة المشاريع الثقافية:</p>
                <div style="background-color: #f3f4f6; border-radius: 6px; padding: 15px; margin: 10px 0;">
                  <p style="margin: 0; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${data.gapQuestion}</p>
                </div>
                <p style="margin: 8px 0; color: #1f2937; font-weight: bold;">عناصر بناء مبادرة ثقافية:</p>
                <div style="background-color: #f3f4f6; border-radius: 6px; padding: 15px; margin: 10px 0;">
                  <p style="margin: 0; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${data.initiativeQuestion}</p>
                </div>
                <p style="margin: 8px 0; color: #1f2937; font-weight: bold;">تجربة فشل أو نجاح مهني:</p>
                <div style="background-color: #f3f4f6; border-radius: 6px; padding: 15px; margin: 10px 0;">
                  <p style="margin: 0; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${data.experienceQuestion}</p>
                </div>
              </div>
            </div>
          `,
          textContent: `طلب تسجيل جديد — ممارس الإدارة الثقافية\n\nالاسم: ${data.fullName}\nالبريد: ${data.email}\nالجوال: ${data.phone}\nجهة العمل: ${data.organization}\nالمسمى: ${data.jobTitle}`
        });

        try {
          const brevoResponse = await addContactToBrevo({
            email: data.email,
            listIds: process.env.BREVO_PROGRAM_LIST_ID ? [parseInt(process.env.BREVO_PROGRAM_LIST_ID)] : [],
            attributes: {
              NAME: data.fullName,
              PHONE: data.phone,
              ORGANIZATION: data.organization,
              JOB_TITLE: data.jobTitle,
              SIGNUP_SOURCE: 'program_registration',
              SIGNUP_DATE: new Date().toISOString(),
            },
          });

          if (brevoResponse) {
            await storage.updateProgramRegistrationBrevoId(data.email, brevoResponse.id.toString());
          }
        } catch (brevoError) {
          console.error("Brevo integration error:", brevoError);
        }
      }

      return res.status(201).json({
        success: true,
        message: "Registration submitted successfully",
        registration: {
          id: registration.id,
          fullName: registration.fullName,
          email: registration.email,
        }
      });

    } catch (error) {
      console.error("Program registration error:", error);
      return res.status(500).json({
        error: "Internal server error",
        message: "Failed to process registration"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
