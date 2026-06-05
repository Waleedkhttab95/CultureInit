import fs from "fs";
import path from "path";
import { and, desc, eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "./db";
import {
  articles,
  type Article,
  type InsertArticle,
  type UpdateArticle,
  type ArticleSite,
} from "@shared/schema";
import { sanitizeArticleHtml } from "./sanitize";
import { markdownLiteToHtml } from "./markdown-lite";

// ---- Public read path with graceful degradation -------------------------
// If DATABASE_URL is not configured yet (e.g. during the Render env setup),
// the cultural site still serves the original bundled articles so it never
// goes down mid-migration. Once the DB is configured + seeded it is the
// single source of truth. The write-community site has no JSON fallback —
// its articles live only in the DB.

let jsonFallbackCache: Article[] | null = null;

function loadJsonFallback(): Article[] {
  if (jsonFallbackCache) return jsonFallbackCache;
  try {
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
    jsonFallbackCache = raw.map((a) => ({
      id: a.id,
      site: "cultural",
      slug: a.id,
      title: a.title,
      author: a.author,
      date: a.date,
      excerpt: a.excerpt,
      image: a.image,
      content: markdownLiteToHtml(a.content ?? ""),
      category: null,
      published: true,
      createdAt: new Date(a.date),
      updatedAt: new Date(a.date),
    }));
  } catch {
    jsonFallbackCache = [];
  }
  return jsonFallbackCache;
}

function slugify(input: string): string {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
  // Arabic titles can slugify to empty — fall back to a random suffix.
  return base || `article-${Math.random().toString(36).slice(2, 8)}`;
}

// ---- Public reads -------------------------------------------------------

export async function listPublishedArticles(
  site: ArticleSite = "cultural",
): Promise<Article[]> {
  if (!isDbConfigured()) {
    return site === "cultural" ? loadJsonFallback() : [];
  }
  return getDb()
    .select()
    .from(articles)
    .where(and(eq(articles.site, site), eq(articles.published, true)))
    .orderBy(desc(articles.date));
}

export async function getPublishedArticleBySlug(
  slug: string,
  site: ArticleSite = "cultural",
): Promise<Article | undefined> {
  if (!isDbConfigured()) {
    return site === "cultural"
      ? loadJsonFallback().find((a) => a.slug === slug)
      : undefined;
  }
  const rows = await getDb()
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.site, site),
        eq(articles.slug, slug),
        eq(articles.published, true),
      ),
    )
    .limit(1);
  return rows[0];
}

// ---- Admin reads/writes (DB required) -----------------------------------

export async function listAllArticles(
  site: ArticleSite = "cultural",
): Promise<Article[]> {
  return getDb()
    .select()
    .from(articles)
    .where(eq(articles.site, site))
    .orderBy(desc(articles.createdAt));
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  const rows = await getDb()
    .select()
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);
  return rows[0];
}

async function isSlugTaken(
  site: ArticleSite,
  slug: string,
  exceptId?: string,
): Promise<boolean> {
  const rows = await getDb()
    .select({ id: articles.id })
    .from(articles)
    .where(and(eq(articles.site, site), eq(articles.slug, slug)));
  return rows.some((r) => r.id !== exceptId);
}

async function uniqueSlug(
  site: ArticleSite,
  desired: string,
  exceptId?: string,
): Promise<string> {
  let slug = desired;
  let n = 2;
  while (await isSlugTaken(site, slug, exceptId)) {
    slug = `${desired}-${n++}`;
  }
  return slug;
}

export async function createArticle(input: InsertArticle): Promise<Article> {
  const site: ArticleSite = input.site ?? "cultural";
  const desiredSlug = slugify(input.slug || input.title);
  const slug = await uniqueSlug(site, desiredSlug);
  const rows = await getDb()
    .insert(articles)
    .values({
      site,
      slug,
      title: input.title,
      author: input.author,
      date: input.date,
      excerpt: input.excerpt,
      image: input.image,
      content: sanitizeArticleHtml(input.content),
      category: input.category ?? null,
      published: input.published ?? true,
    })
    .returning();
  return rows[0];
}

export async function updateArticle(
  id: string,
  input: UpdateArticle,
): Promise<Article | undefined> {
  // Slug uniqueness is scoped to the article's own site, so we need to know
  // which site this row belongs to before regenerating the slug.
  const current = await getArticleById(id);
  if (!current) return undefined;

  const patch: Record<string, unknown> = { updatedAt: new Date() };

  if (input.title !== undefined) patch.title = input.title;
  if (input.author !== undefined) patch.author = input.author;
  if (input.date !== undefined) patch.date = input.date;
  if (input.excerpt !== undefined) patch.excerpt = input.excerpt;
  if (input.image !== undefined) patch.image = input.image;
  if (input.category !== undefined) patch.category = input.category ?? null;
  if (input.content !== undefined) {
    patch.content = sanitizeArticleHtml(input.content);
  }
  if (input.published !== undefined) patch.published = input.published;
  if (input.slug !== undefined && input.slug !== "") {
    patch.slug = await uniqueSlug(
      current.site as ArticleSite,
      slugify(input.slug),
      id,
    );
  }

  const rows = await getDb()
    .update(articles)
    .set(patch)
    .where(eq(articles.id, id))
    .returning();
  return rows[0];
}

export async function deleteArticle(
  id: string,
): Promise<{ site: ArticleSite } | undefined> {
  const rows = await getDb()
    .delete(articles)
    .where(eq(articles.id, id))
    .returning({ site: articles.site });
  return rows[0] ? { site: rows[0].site as ArticleSite } : undefined;
}
