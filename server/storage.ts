import { type User, type InsertUser, type NewsletterSubscriber, type InsertNewsletterSubscriber, type PdfDownloadRequest, type InsertPdfDownloadRequest, type PublishRequest, type InsertPublishRequest, type ProgramRegistration, type InsertProgramRegistration } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  updateNewsletterSubscriberBrevoId(email: string, brevoContactId: string): Promise<void>;
  getPdfDownloadRequestByEmail(email: string): Promise<PdfDownloadRequest | undefined>;
  createPdfDownloadRequest(request: InsertPdfDownloadRequest): Promise<PdfDownloadRequest>;
  updatePdfDownloadRequestBrevoId(email: string, brevoContactId: string): Promise<void>;
  getPublishRequestByEmail(email: string): Promise<PublishRequest | undefined>;
  createPublishRequest(request: InsertPublishRequest): Promise<PublishRequest>;
  updatePublishRequestBrevoId(email: string, brevoContactId: string): Promise<void>;
  getProgramRegistrationByEmail(email: string): Promise<ProgramRegistration | undefined>;
  createProgramRegistration(registration: InsertProgramRegistration): Promise<ProgramRegistration>;
  updateProgramRegistrationBrevoId(email: string, brevoContactId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private newsletterSubscribers: Map<string, NewsletterSubscriber>;
  private pdfDownloadRequests: Map<string, PdfDownloadRequest>;
  private publishRequests: Map<string, PublishRequest>;
  private programRegistrations: Map<string, ProgramRegistration>;

  constructor() {
    this.users = new Map();
    this.newsletterSubscribers = new Map();
    this.pdfDownloadRequests = new Map();
    this.publishRequests = new Map();
    this.programRegistrations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    return Array.from(this.newsletterSubscribers.values()).find(
      (subscriber) => subscriber.email === email,
    );
  }

  async createNewsletterSubscriber(insertSubscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const id = randomUUID();
    const subscriber: NewsletterSubscriber = {
      id,
      email: insertSubscriber.email,
      subscribedAt: new Date(),
      brevoContactId: null,
    };
    this.newsletterSubscribers.set(id, subscriber);
    return subscriber;
  }

  async updateNewsletterSubscriberBrevoId(email: string, brevoContactId: string): Promise<void> {
    const subscriber = await this.getNewsletterSubscriberByEmail(email);
    if (subscriber) {
      subscriber.brevoContactId = brevoContactId;
      this.newsletterSubscribers.set(subscriber.id, subscriber);
    }
  }

  async getPdfDownloadRequestByEmail(email: string): Promise<PdfDownloadRequest | undefined> {
    return Array.from(this.pdfDownloadRequests.values()).find(
      (request) => request.email === email,
    );
  }

  async createPdfDownloadRequest(insertRequest: InsertPdfDownloadRequest): Promise<PdfDownloadRequest> {
    const id = randomUUID();
    const request: PdfDownloadRequest = {
      id,
      name: insertRequest.name,
      email: insertRequest.email,
      requestedAt: new Date(),
      brevoContactId: null,
    };
    this.pdfDownloadRequests.set(id, request);
    return request;
  }

  async updatePdfDownloadRequestBrevoId(email: string, brevoContactId: string): Promise<void> {
    const request = await this.getPdfDownloadRequestByEmail(email);
    if (request) {
      request.brevoContactId = brevoContactId;
      this.pdfDownloadRequests.set(request.id, request);
    }
  }

  async getPublishRequestByEmail(email: string): Promise<PublishRequest | undefined> {
    return Array.from(this.publishRequests.values()).find(
      (request) => request.email === email,
    );
  }

  async createPublishRequest(insertRequest: InsertPublishRequest): Promise<PublishRequest> {
    const id = randomUUID();
    const request: PublishRequest = {
      id,
      name: insertRequest.name,
      email: insertRequest.email,
      title: insertRequest.title,
      message: insertRequest.message,
      requestedAt: new Date(),
      brevoContactId: null,
    };
    this.publishRequests.set(id, request);
    return request;
  }

  async updatePublishRequestBrevoId(email: string, brevoContactId: string): Promise<void> {
    const request = await this.getPublishRequestByEmail(email);
    if (request) {
      request.brevoContactId = brevoContactId;
      this.publishRequests.set(request.id, request);
    }
  }

  async getProgramRegistrationByEmail(email: string): Promise<ProgramRegistration | undefined> {
    return Array.from(this.programRegistrations.values()).find(
      (reg) => reg.email === email,
    );
  }

  async createProgramRegistration(insertReg: InsertProgramRegistration): Promise<ProgramRegistration> {
    const id = randomUUID();
    const registration: ProgramRegistration = {
      id,
      name: insertReg.name,
      email: insertReg.email,
      phone: insertReg.phone,
      organization: insertReg.organization,
      jobTitle: insertReg.jobTitle,
      reason: insertReg.reason,
      registeredAt: new Date(),
      brevoContactId: null,
    };
    this.programRegistrations.set(id, registration);
    return registration;
  }

  async updateProgramRegistrationBrevoId(email: string, brevoContactId: string): Promise<void> {
    const reg = await this.getProgramRegistrationByEmail(email);
    if (reg) {
      reg.brevoContactId = brevoContactId;
      this.programRegistrations.set(reg.id, reg);
    }
  }
}

export const storage = new MemStorage();
