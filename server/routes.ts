import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNewsletterSubscriberSchema, insertPdfDownloadRequestSchema } from "@shared/schema";
import { addContactToBrevo, isBrevoConfigured } from "./brevo";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);

  return httpServer;
}
