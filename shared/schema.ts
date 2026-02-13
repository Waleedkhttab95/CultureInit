import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
  brevoContactId: text("brevo_contact_id"),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).pick({
  email: true,
}).extend({
  email: z.string().email("Invalid email address"),
});

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

export const pdfDownloadRequests = pgTable("pdf_download_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  requestedAt: timestamp("requested_at").notNull().defaultNow(),
  brevoContactId: text("brevo_contact_id"),
});

export const insertPdfDownloadRequestSchema = createInsertSchema(pdfDownloadRequests).pick({
  name: true,
  email: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export type InsertPdfDownloadRequest = z.infer<typeof insertPdfDownloadRequestSchema>;
export type PdfDownloadRequest = typeof pdfDownloadRequests.$inferSelect;

export const publishRequests = pgTable("publish_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  requestedAt: timestamp("requested_at").notNull().defaultNow(),
  brevoContactId: text("brevo_contact_id"),
});

export const insertPublishRequestSchema = createInsertSchema(publishRequests).pick({
  name: true,
  email: true,
  title: true,
  message: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type InsertPublishRequest = z.infer<typeof insertPublishRequestSchema>;
export type PublishRequest = typeof publishRequests.$inferSelect;

export const programRegistrations = pgTable("program_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  organization: text("organization").notNull(),
  jobTitle: text("job_title").notNull(),
  reason: text("reason").notNull(),
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
  brevoContactId: text("brevo_contact_id"),
});

export const insertProgramRegistrationSchema = createInsertSchema(programRegistrations).pick({
  name: true,
  email: true,
  phone: true,
  organization: true,
  jobTitle: true,
  reason: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(9, "Phone number must be at least 9 characters"),
  organization: z.string().min(2, "Organization must be at least 2 characters"),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
});

export type InsertProgramRegistration = z.infer<typeof insertProgramRegistrationSchema>;
export type ProgramRegistration = typeof programRegistrations.$inferSelect;
