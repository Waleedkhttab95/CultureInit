import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertNewsletterSubscriberSchema, insertPdfDownloadRequestSchema, insertPublishRequestSchema, insertProgramRegistrationSchema } from "@shared/schema";
import { addContactToBrevo, isBrevoConfigured, sendEmail } from "./brevo";
import { appendRegistrationToSheet, initSheetHeaders, isGoogleSheetsConfigured, uploadFileToDrive } from "./google-sheets";
import { fromZodError } from "zod-validation-error";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin endpoint: list all uploaded CVs
  app.get("/api/admin/uploads", async (req, res) => {
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
      let resumeLink: string | undefined;

      // Upload CV to Google Drive
      if (req.file) {
        body.resumeFileName = req.file.originalname;
        try {
          const fileBuffer = fs.readFileSync(req.file.path);
          const driveLink = await uploadFileToDrive(
            fileBuffer,
            req.file.originalname,
            req.file.mimetype
          );
          if (driveLink) {
            resumeLink = driveLink;
          }
        } catch (driveError) {
          console.error("Google Drive upload error:", driveError);
        }
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
          await appendRegistrationToSheet(data, resumeLink);
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
