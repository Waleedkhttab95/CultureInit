import "dotenv/config";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "./db";
import { users } from "@shared/schema";
import { hashPassword, normalizeAdminUsername } from "./auth";

// Usage: npm run create-admin -- "email@example.com" "a-strong-password"
//
// Creates a new admin login (or resets the password if that username
// already exists). These accounts live in the `users` table in Postgres —
// requires DATABASE_URL. Any number of admins can exist at once; each logs
// in with their own username/password at /admin/login. The original single
// ADMIN_USERNAME/ADMIN_PASSWORD_HASH env-var admin (see .env.example) keeps
// working alongside these — this does not replace it.
async function main() {
  const rawUsername = process.argv[2];
  const password = process.argv[3];

  if (!rawUsername || !password) {
    console.error('Usage: npm run create-admin -- "email@example.com" "a-strong-password"');
    process.exit(1);
  }

  if (password.length < 10) {
    console.error("Refusing: choose a password of at least 10 characters.");
    process.exit(1);
  }

  if (!isDbConfigured()) {
    console.error(
      "DATABASE_URL is not set. Admin accounts are stored in Postgres — configure it first.",
    );
    process.exit(1);
  }

  // Stored and matched in one canonical form (trimmed, lowercased) so typing
  // the email with different capitalization at login can't fail to match —
  // see normalizeAdminUsername's comment in auth.ts.
  const username = normalizeAdminUsername(rawUsername);

  const db = getDb();
  const passwordHash = hashPassword(password);

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (existing.length > 0) {
    await db.update(users).set({ password: passwordHash }).where(eq(users.username, username));
    console.log(`✓ Password updated for existing admin: ${username}`);
  } else {
    await db.insert(users).values({ username, password: passwordHash });
    console.log(`✓ Admin account created: ${username}`);
  }

  console.log(`Log in at /admin/login with username "${username}" and the password you chose.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to create admin:", err);
  process.exit(1);
});
