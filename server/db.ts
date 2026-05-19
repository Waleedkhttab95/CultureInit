import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

// Neon's serverless driver needs a WebSocket implementation in Node.
neonConfig.webSocketConstructor = ws;

let pool: Pool | undefined;
let dbInstance: NeonDatabase<typeof schema> | undefined;

/**
 * Whether a database connection string is configured. The public site and
 * the existing contact/registration forms keep working without one; only the
 * article CMS (admin + DB-backed article reads) requires it.
 */
export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function ensurePool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. The article CMS requires a Postgres (Neon) database.",
    );
  }
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

/** Shared pg-compatible pool, reused by Drizzle and the session store. */
export function getPool(): Pool {
  return ensurePool();
}

/** Lazily-created Drizzle client. Throws a clear error if DATABASE_URL is unset. */
export function getDb(): NeonDatabase<typeof schema> {
  if (!dbInstance) {
    dbInstance = drizzle(ensurePool(), { schema });
  }
  return dbInstance;
}
