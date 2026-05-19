import "dotenv/config";
import fs from "fs";
import path from "path";
import { sql } from "drizzle-orm";
import { getDb, isDbConfigured } from "./db";
import { articles } from "@shared/schema";
import { markdownLiteToHtml } from "./markdown-lite";

// One-time migration: imports the original client/src/data/articles.json into
// the DB, converting the legacy markdown-lite content to sanitized HTML.
// Safe to re-run — it does nothing if the articles table already has rows.
async function main() {
  if (!isDbConfigured()) {
    console.error("DATABASE_URL is not set. Configure it before seeding.");
    process.exit(1);
  }

  const db = getDb();

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(articles);

  if (count > 0) {
    console.log(`Articles table already has ${count} rows — skipping seed.`);
    process.exit(0);
  }

  const jsonPath = path.resolve(
    import.meta.dirname,
    "..",
    "client",
    "src",
    "data",
    "articles.json",
  );
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as Array<
    Record<string, string>
  >;

  let inserted = 0;
  for (const a of raw) {
    await db.insert(articles).values({
      slug: a.id,
      title: a.title,
      author: a.author,
      date: a.date,
      excerpt: a.excerpt,
      image: a.image,
      content: markdownLiteToHtml(a.content ?? ""),
      published: true,
    });
    inserted++;
    console.log(`  + ${a.id}`);
  }

  console.log(`Seeded ${inserted} articles.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
