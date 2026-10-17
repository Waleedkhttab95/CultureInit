import { desc, eq } from "drizzle-orm";
import { getDb } from "./db";
import {
  users,
  newsletterSubscribers,
  pdfDownloadRequests,
  publishRequests,
  programRegistrations,
  serviceRequests,
  type User,
  type InsertUser,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  type PdfDownloadRequest,
  type InsertPdfDownloadRequest,
  type PublishRequest,
  type InsertPublishRequest,
  type ProgramRegistration,
  type InsertProgramRegistration,
  type ServiceRequest,
  type InsertServiceRequest,
} from "@shared/schema";
import type { IStorage } from "./storage";

/**
 * Postgres-backed storage, used when DATABASE_URL is configured (see
 * isDbConfigured() in db.ts). Mirrors MemStorage's behavior but persists
 * across restarts/deploys — MemStorage loses every newsletter signup,
 * program registration, etc. on every redeploy.
 *
 * None of these tables have a uniqueness constraint on email except
 * newsletter_subscribers, so the same person can submit a form twice with
 * the same address. getXByEmail / updateXBrevoId below always target the
 * most recently created row for that email, not just "the first match" —
 * that matters because routes.ts calls create then, once Brevo responds,
 * updateXBrevoId(email, ...) to stamp the row just created.
 */
export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const rows = await getDb().select().from(users).where(eq(users.id, id)).limit(1);
    return rows[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const rows = await getDb()
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return rows[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const rows = await getDb().insert(users).values(insertUser).returning();
    return rows[0];
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const rows = await getDb()
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1);
    return rows[0];
  }

  async createNewsletterSubscriber(
    insertSubscriber: InsertNewsletterSubscriber,
  ): Promise<NewsletterSubscriber> {
    const rows = await getDb()
      .insert(newsletterSubscribers)
      .values({ email: insertSubscriber.email })
      .returning();
    return rows[0];
  }

  async updateNewsletterSubscriberBrevoId(email: string, brevoContactId: string): Promise<void> {
    // email is unique on this table, so a plain match is unambiguous.
    await getDb()
      .update(newsletterSubscribers)
      .set({ brevoContactId })
      .where(eq(newsletterSubscribers.email, email));
  }

  async getPdfDownloadRequestByEmail(email: string): Promise<PdfDownloadRequest | undefined> {
    const rows = await getDb()
      .select()
      .from(pdfDownloadRequests)
      .where(eq(pdfDownloadRequests.email, email))
      .orderBy(desc(pdfDownloadRequests.requestedAt))
      .limit(1);
    return rows[0];
  }

  async createPdfDownloadRequest(
    insertRequest: InsertPdfDownloadRequest,
  ): Promise<PdfDownloadRequest> {
    const rows = await getDb()
      .insert(pdfDownloadRequests)
      .values({ name: insertRequest.name, email: insertRequest.email })
      .returning();
    return rows[0];
  }

  async updatePdfDownloadRequestBrevoId(email: string, brevoContactId: string): Promise<void> {
    const latest = await this.getPdfDownloadRequestByEmail(email);
    if (!latest) return;
    await getDb()
      .update(pdfDownloadRequests)
      .set({ brevoContactId })
      .where(eq(pdfDownloadRequests.id, latest.id));
  }

  async getPublishRequestByEmail(email: string): Promise<PublishRequest | undefined> {
    const rows = await getDb()
      .select()
      .from(publishRequests)
      .where(eq(publishRequests.email, email))
      .orderBy(desc(publishRequests.requestedAt))
      .limit(1);
    return rows[0];
  }

  async createPublishRequest(insertRequest: InsertPublishRequest): Promise<PublishRequest> {
    const rows = await getDb()
      .insert(publishRequests)
      .values({
        name: insertRequest.name,
        email: insertRequest.email,
        title: insertRequest.title,
        message: insertRequest.message,
      })
      .returning();
    return rows[0];
  }

  async updatePublishRequestBrevoId(email: string, brevoContactId: string): Promise<void> {
    const latest = await this.getPublishRequestByEmail(email);
    if (!latest) return;
    await getDb()
      .update(publishRequests)
      .set({ brevoContactId })
      .where(eq(publishRequests.id, latest.id));
  }

  async getProgramRegistrationByEmail(email: string): Promise<ProgramRegistration | undefined> {
    const rows = await getDb()
      .select()
      .from(programRegistrations)
      .where(eq(programRegistrations.email, email))
      .orderBy(desc(programRegistrations.registeredAt))
      .limit(1);
    return rows[0];
  }

  async createProgramRegistration(
    insertReg: InsertProgramRegistration,
  ): Promise<ProgramRegistration> {
    const rows = await getDb()
      .insert(programRegistrations)
      .values({
        fullName: insertReg.fullName,
        idNumber: insertReg.idNumber,
        gender: insertReg.gender,
        phone: insertReg.phone,
        email: insertReg.email,
        city: insertReg.city,
        age: insertReg.age,
        linkedin: insertReg.linkedin || null,
        qualification: insertReg.qualification,
        major: insertReg.major,
        studyInstitution: insertReg.studyInstitution,
        organization: insertReg.organization,
        orgType: insertReg.orgType,
        yearsOfExperience: insertReg.yearsOfExperience,
        jobTitle: insertReg.jobTitle,
        worksInCulture: insertReg.worksInCulture,
        cultureExperience: insertReg.cultureExperience,
        canAttendAll: insertReg.canAttendAll,
        canDesignProject: insertReg.canDesignProject,
        hasEmployerApproval: insertReg.hasEmployerApproval,
        gapQuestion: insertReg.gapQuestion,
        initiativeQuestion: insertReg.initiativeQuestion,
        experienceQuestion: insertReg.experienceQuestion,
        resumeFileName: insertReg.resumeFileName || null,
      })
      .returning();
    return rows[0];
  }

  async updateProgramRegistrationBrevoId(email: string, brevoContactId: string): Promise<void> {
    const latest = await this.getProgramRegistrationByEmail(email);
    if (!latest) return;
    await getDb()
      .update(programRegistrations)
      .set({ brevoContactId })
      .where(eq(programRegistrations.id, latest.id));
  }

  async getServiceRequestByEmail(email: string): Promise<ServiceRequest | undefined> {
    const rows = await getDb()
      .select()
      .from(serviceRequests)
      .where(eq(serviceRequests.email, email))
      .orderBy(desc(serviceRequests.requestedAt))
      .limit(1);
    return rows[0];
  }

  async createServiceRequest(insertRequest: InsertServiceRequest): Promise<ServiceRequest> {
    const rows = await getDb()
      .insert(serviceRequests)
      .values({
        name: insertRequest.name,
        email: insertRequest.email,
        phone: insertRequest.phone,
        organization: insertRequest.organization,
        subject: insertRequest.subject,
        message: insertRequest.message,
      })
      .returning();
    return rows[0];
  }

  async updateServiceRequestBrevoId(email: string, brevoContactId: string): Promise<void> {
    const latest = await this.getServiceRequestByEmail(email);
    if (!latest) return;
    await getDb()
      .update(serviceRequests)
      .set({ brevoContactId })
      .where(eq(serviceRequests.id, latest.id));
  }
}
