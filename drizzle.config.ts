import { defineConfig } from "drizzle-kit";

// DATABASE_URL is optional - the app uses in-memory storage by default
// Only needed if you want to use a real PostgreSQL database
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://localhost:5432/placeholder";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
