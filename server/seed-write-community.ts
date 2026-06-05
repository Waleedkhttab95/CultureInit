import "dotenv/config";
import fs from "fs";
import path from "path";
import { and, eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "./db";
import { articles } from "@shared/schema";
import { sanitizeArticleHtml } from "./sanitize";

// One-time migration: imports the original hardcoded مجتمع الكتابة
// (write-community) articles into the CMS database under site="write-community".
// The source data was extracted from the write-community project into
// server/write-community-articles.json (content already converted to HTML).
//
// Idempotent: only inserts articles whose slug does not already exist for the
// write-community site, so it is safe to re-run.

interface SeedArticle {
  slug: string;
  title: string;
  author: string;
  date: string;
  category: string | null;
  image: string;
  excerpt: string;
  content: string;
}

async function main() {
  if (!isDbConfigured()) {
    console.error("DATABASE_URL is not set. Configure it before seeding.");
    process.exit(1);
  }

  const db = getDb();

  const jsonPath = path.resolve(
    import.meta.dirname,
    "write-community-articles.json",
  );
  const seed = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as SeedArticle[];

  let inserted = 0;
  let skipped = 0;
  for (const a of seed) {
    const existing = await db
      .select({ id: articles.id })
      .from(articles)
      .where(and(eq(articles.site, "write-community"), eq(articles.slug, a.slug)))
      .limit(1);

    if (existing.length > 0) {
      skipped++;
      console.log(`  = ${a.slug} (exists, skipped)`);
      continue;
    }

    await db.insert(articles).values({
      site: "write-community",
      slug: a.slug,
      title: a.title,
      author: a.author,
      date: a.date,
      excerpt: a.excerpt,
      image: a.image,
      content: sanitizeArticleHtml(a.content),
      category: a.category,
      published: true,
    });
    inserted++;
    console.log(`  + ${a.slug}`);
  }

  console.log(
    `Done. Inserted ${inserted} write-community articles, skipped ${skipped}.`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
