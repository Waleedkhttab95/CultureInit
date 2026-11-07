import "dotenv/config";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "./db";
import { articles } from "@shared/schema";
import { sanitizeArticleHtml } from "./sanitize";

// One-time backfill: re-sanitizes every stored article's content with the
// current rules in sanitize.ts (e.g. internal links now dofollow — see
// isInternalHref there). sanitizeArticleHtml only runs when an article is
// created/updated through the admin editor, so already-published articles
// keep whatever HTML was baked in at save time; a sanitizer rule change
// doesn't reach them until this runs. Safe to re-run — articles whose
// content doesn't change are skipped and left untouched (updatedAt included).
async function main() {
  if (!isDbConfigured()) {
    console.error("DATABASE_URL is not set. Configure it before running this.");
    process.exit(1);
  }

  const db = getDb();
  const rows = await db.select().from(articles);

  let changed = 0;
  for (const row of rows) {
    const resanitized = sanitizeArticleHtml(row.content);
    if (resanitized === row.content) continue;
    await db.update(articles).set({ content: resanitized }).where(eq(articles.id, row.id));
    changed++;
    console.log(`  ~ [${row.site}] ${row.slug}`);
  }

  console.log(`Re-sanitized ${changed} of ${rows.length} articles.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
