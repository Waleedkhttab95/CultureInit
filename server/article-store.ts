import fs from "fs";
import path from "path";
import { and, desc, eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "./db";
import { articles, type Article, type InsertArticle, type UpdateArticle } from "@shared/schema";
import { sanitizeArticleHtml } from "./sanitize";
import { markdownLiteToHtml } from "./markdown-lite";

// ---- Public read path with graceful degradation -------------------------
// If DATABASE_URL is not configured yet (e.g. during the Render env setup),
// the public site still serves the original bundled articles so it never
// goes down mid-migration. Once the DB is configured + seeded it is the
// single source of truth.

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
      slug: a.id,
      title: a.title,
      author: a.author,
      date: a.date,
      excerpt: a.excerpt,
      image: a.image,
      content: markdownLiteToHtml(a.content ?? ""),
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

export async function listPublishedArticles(): Promise<Article[]> {
  if (!isDbConfigured()) {
    return loadJsonFallback();
  }
  return getDb()
    .select()
    .from(articles)
    .where(eq(articles.published, true))
    .orderBy(desc(articles.date));
}

export async function getPublishedArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  if (!isDbConfigured()) {
    return loadJsonFallback().find((a) => a.slug === slug);
  }
  const rows = await getDb()
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.published, true)))
    .limit(1);
  return rows[0];
}

// ---- Admin reads/writes (DB required) -----------------------------------

export async function listAllArticles(): Promise<Article[]> {
  return getDb().select().from(articles).orderBy(desc(articles.createdAt));
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  const rows = await getDb()
    .select()
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);
  return rows[0];
}

async function isSlugTaken(slug: string, exceptId?: string): Promise<boolean> {
  const rows = await getDb()
    .select({ id: articles.id })
    .from(articles)
    .where(eq(articles.slug, slug));
  return rows.some((r) => r.id !== exceptId);
}

async function uniqueSlug(desired: string, exceptId?: string): Promise<string> {
  let slug = desired;
  let n = 2;
  while (await isSlugTaken(slug, exceptId)) {
    slug = `${desired}-${n++}`;
  }
  return slug;
}

export async function createArticle(input: InsertArticle): Promise<Article> {
  const desiredSlug = slugify(input.slug || input.title);
  const slug = await uniqueSlug(desiredSlug);
  const rows = await getDb()
    .insert(articles)
    .values({
      slug,
      title: input.title,
      author: input.author,
      date: input.date,
      excerpt: input.excerpt,
      image: input.image,
      content: sanitizeArticleHtml(input.content),
      published: input.published ?? true,
    })
    .returning();
  return rows[0];
}

export async function updateArticle(
  id: string,
  input: UpdateArticle,
): Promise<Article | undefined> {
  const patch: Record<string, unknown> = { updatedAt: new Date() };

  if (input.title !== undefined) patch.title = input.title;
  if (input.author !== undefined) patch.author = input.author;
  if (input.date !== undefined) patch.date = input.date;
  if (input.excerpt !== undefined) patch.excerpt = input.excerpt;
  if (input.image !== undefined) patch.image = input.image;
  if (input.content !== undefined) {
    patch.content = sanitizeArticleHtml(input.content);
  }
  if (input.published !== undefined) patch.published = input.published;
  if (input.slug !== undefined && input.slug !== "") {
    patch.slug = await uniqueSlug(slugify(input.slug), id);
  }

  const rows = await getDb()
    .update(articles)
    .set(patch)
    .where(eq(articles.id, id))
    .returning();
  return rows[0];
}

export async function deleteArticle(id: string): Promise<boolean> {
  const rows = await getDb()
    .delete(articles)
    .where(eq(articles.id, id))
    .returning({ id: articles.id });
  return rows.length > 0;
}
