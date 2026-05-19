import {
  scryptSync,
  randomBytes,
  timingSafeEqual,
} from "crypto";
import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import createMemoryStore from "memorystore";
import rateLimit from "express-rate-limit";
import { getPool, isDbConfigured } from "./db";

// Session shape (module augmentation so req.session is typed).
declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
    csrfToken?: string;
  }
}

// ---- Password hashing (node:crypto scrypt, zero extra deps) --------------

const SCRYPT_KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  if (salt.length === 0 || expected.length === 0) return false;
  const actual = scryptSync(password, salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// ---- Admin credential check ---------------------------------------------

export function verifyAdminCredentials(
  username: string,
  password: string,
): boolean {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUser || !expectedHash) {
    console.warn(
      "[auth] ADMIN_USERNAME / ADMIN_PASSWORD_HASH are not set — admin login is disabled.",
    );
    return false;
  }
  // Compare username in constant time too, and always run the password
  // hash to avoid leaking which field was wrong via timing.
  const userOk =
    Buffer.byteLength(username) === Buffer.byteLength(expectedUser) &&
    timingSafeEqual(Buffer.from(username), Buffer.from(expectedUser));
  const passOk = verifyPassword(password, expectedHash);
  return userOk && passOk;
}

// ---- Session middleware --------------------------------------------------

export function buildSessionMiddleware(): RequestHandler {
  const isProd = process.env.NODE_ENV === "production";

  let secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (isProd) {
      console.warn(
        "[auth] SESSION_SECRET is not set in production — sessions will not survive restarts. Set it on Render.",
      );
    }
    secret = randomBytes(32).toString("hex");
  }

  let store: session.Store;
  if (isDbConfigured()) {
    const PgStore = connectPgSimple(session);
    store = new PgStore({
      pool: getPool() as unknown as any,
      tableName: "session",
      createTableIfMissing: true,
    });
  } else {
    const MemoryStore = createMemoryStore(session);
    store = new MemoryStore({ checkPeriod: 24 * 60 * 60 * 1000 });
  }

  return session({
    name: "ci.sid",
    secret,
    store,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: "strict",
      secure: isProd,
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
    },
  });
}

// ---- Auth guard ----------------------------------------------------------

export const requireAuth: RequestHandler = (req, res, next) => {
  if (req.session?.isAdmin) return next();
  return res.status(401).json({ error: "Unauthorized" });
};

// ---- CSRF (double-submit, session-bound) --------------------------------

export function getOrCreateCsrfToken(req: {
  session: { csrfToken?: string };
}): string {
  if (!req.session.csrfToken) {
    req.session.csrfToken = randomBytes(32).toString("hex");
  }
  return req.session.csrfToken;
}

// Applied to state-changing admin routes. The token is issued via
// GET /api/admin/me and must be echoed back in the X-CSRF-Token header.
// Combined with SameSite=Strict cookies this blocks cross-site requests.
export const requireCsrf: RequestHandler = (req, res, next) => {
  const sessionToken = req.session?.csrfToken;
  const headerToken = req.get("x-csrf-token");
  if (
    !sessionToken ||
    !headerToken ||
    sessionToken.length !== headerToken.length ||
    !timingSafeEqual(Buffer.from(sessionToken), Buffer.from(headerToken))
  ) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  next();
};

// ---- Rate limiters -------------------------------------------------------

// Aggressive limiter for the login endpoint (brute-force protection).
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." },
});

// Broader limiter for the rest of the admin write surface.
export const adminRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
