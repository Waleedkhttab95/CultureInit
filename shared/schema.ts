import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
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
  fullName: text("full_name").notNull(),
  idNumber: text("id_number").notNull(),
  gender: text("gender").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  city: text("city").notNull(),
  age: text("age").notNull(),
  linkedin: text("linkedin"),
  qualification: text("qualification").notNull(),
  major: text("major").notNull(),
  studyInstitution: text("study_institution").notNull(),
  organization: text("organization").notNull(),
  orgType: text("org_type").notNull(),
  yearsOfExperience: text("years_of_experience").notNull(),
  jobTitle: text("job_title").notNull(),
  worksInCulture: text("works_in_culture").notNull(),
  cultureExperience: text("culture_experience").notNull(),
  canAttendAll: text("can_attend_all").notNull(),
  canDesignProject: text("can_design_project").notNull(),
  hasEmployerApproval: text("has_employer_approval").notNull(),
  gapQuestion: text("gap_question").notNull(),
  initiativeQuestion: text("initiative_question").notNull(),
  experienceQuestion: text("experience_question").notNull(),
  resumeFileName: text("resume_file_name"),
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
  brevoContactId: text("brevo_contact_id"),
});

export const insertProgramRegistrationSchema = z.object({
  fullName: z.string().min(2, "الاسم مطلوب"),
  idNumber: z.string().min(5, "رقم الهوية مطلوب"),
  gender: z.string().min(1, "الجنس مطلوب"),
  phone: z.string().min(9, "رقم الجوال مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  city: z.string().min(2, "المدينة مطلوبة"),
  age: z.string().min(1, "العمر مطلوب"),
  linkedin: z.string().optional().default(""),
  qualification: z.string().min(1, "المؤهل العلمي مطلوب"),
  major: z.string().min(2, "التخصص مطلوب"),
  studyInstitution: z.string().min(2, "جهة الدراسة مطلوبة"),
  organization: z.string().min(2, "جهة العمل مطلوبة"),
  orgType: z.string().min(1, "نوع جهة العمل مطلوب"),
  yearsOfExperience: z.string().min(1, "عدد سنوات الخبرة مطلوب"),
  jobTitle: z.string().min(2, "المسمى الوظيفي مطلوب"),
  worksInCulture: z.string().min(1, "مطلوب"),
  cultureExperience: z.string().min(10, "صف خبرتك في المجال الثقافي"),
  canAttendAll: z.string().min(1, "مطلوب"),
  canDesignProject: z.string().min(1, "مطلوب"),
  hasEmployerApproval: z.string().min(1, "مطلوب"),
  gapQuestion: z.string().min(10, "الإجابة مطلوبة"),
  initiativeQuestion: z.string().min(10, "الإجابة مطلوبة"),
  experienceQuestion: z.string().min(10, "الإجابة مطلوبة"),
  resumeFileName: z.string().optional(),
});

export type InsertProgramRegistration = z.infer<typeof insertProgramRegistrationSchema>;
export type ProgramRegistration = typeof programRegistrations.$inferSelect;

// Articles managed via the admin CMS.
// `content` holds sanitized HTML produced by the WYSIWYG editor.
// `date` is kept as a string ("YYYY-MM-DD") to match the existing
// articles.json data and the frontend's `new Date(article.date)` usage.
export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  date: text("date").notNull(),
  excerpt: text("excerpt").notNull(),
  image: text("image").notNull(),
  content: text("content").notNull(),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Slugs are used directly in URLs (/articles/:slug), so restrict to a
// safe, predictable character set. Empty is allowed on create — the
// server will auto-generate from the title when omitted.
const slugField = z
  .string()
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i, "Slug may only contain letters, numbers and hyphens")
  .optional();

export const insertArticleSchema = z.object({
  slug: slugField,
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(300),
  author: z.string().trim().min(2, "Author is required").max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  excerpt: z.string().trim().min(10, "Excerpt must be at least 10 characters").max(600),
  image: z.string().trim().min(1, "Image is required").max(500),
  content: z.string().min(1, "Content is required"),
  published: z.boolean().optional().default(true),
});

// All fields optional for partial updates; same constraints when present.
export const updateArticleSchema = insertArticleSchema.partial();

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type UpdateArticle = z.infer<typeof updateArticleSchema>;
export type Article = typeof articles.$inferSelect;
