import {
  ARTICLES_PATH,
  BRAND,
  DIR,
  NOT_FOUND_META,
  OG_IMAGE,
  OG_IMAGE_SIZE,
  OG_LOCALE,
  PAGES,
  RESOURCES_PATH,
  SITE_URL,
  TWITTER_HANDLE,
  absoluteAsset,
  absoluteUrl,
  alternatesFor,
  articleLd,
  articleSlugFromPath,
  breadcrumbLd,
  findPage,
  localePath,
  organizationLd,
  pageBreadcrumbs,
  parseLocale,
  resourceIdFromPath,
  resourceLd,
  truncateDescription,
  websiteLd,
  type Alternate,
  type JsonLd,
  type Locale,
  type PageKey,
} from "@shared/seo";
import type { Article } from "@shared/schema";
import { getPublishedArticleBySlug, listPublishedArticles } from "./article-store";
import resourcesData from "../client/src/data/resources.json";

interface ResourceEntry {
  id: string;
  title: string;
  description: string;
  image: string;
  file: string;
}
// Bundled at build time (esbuild inlines the JSON), same file the Resources page reads.
const RESOURCES = resourcesData as ResourceEntry[];

// Markers in client/index.html. Everything between them is regenerated per
// request so crawlers and social scrapers (which mostly do not run JS) get the
// right title/description/canonical/OG/JSON-LD for the URL they asked for.
const HEAD_START = "<!--seo:start-->";
const HEAD_END = "<!--seo:end-->";
const NOSCRIPT_MARKER = "<!--seo:noscript-->";

export interface PageHead {
  status: number;
  /** When set, respond with a 301 to this path instead of rendering. */
  redirect?: string;
  locale: Locale;
  head: string;
  /** Crawler-readable fallback content, rendered inside <noscript>. */
  noscript: string;
}

// ---- HTML helpers --------------------------------------------------------

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// `<` is escaped so CMS-authored text can never close the <script> element.
function jsonLdTag(data: JsonLd): string {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json" data-seo>${json}</script>`;
}

interface HeadInput {
  locale: Locale;
  title: string;
  description: string;
  robots: string;
  /** Omitted for 404 / admin pages, which must not declare a canonical. */
  canonical?: string;
  alternates?: Alternate[];
  image?: string;
  ogType?: "website" | "article";
  article?: { published: string; modified?: string; author: string };
  jsonLd?: JsonLd[];
}

function renderHead(i: HeadInput): string {
  const image = i.image ?? OG_IMAGE;
  const isDefaultImage = image === OG_IMAGE;
  const lines: string[] = [
    `<title>${esc(i.title)}</title>`,
    `<meta name="description" content="${esc(i.description)}" />`,
    `<meta name="robots" content="${i.robots}" />`,
  ];
  if (i.canonical) lines.push(`<link rel="canonical" href="${esc(i.canonical)}" />`);
  for (const alt of i.alternates ?? []) {
    lines.push(`<link rel="alternate" hreflang="${alt.hreflang}" href="${esc(alt.href)}" />`);
  }

  lines.push(
    `<meta property="og:type" content="${i.ogType ?? "website"}" />`,
    `<meta property="og:site_name" content="${esc(BRAND[i.locale])}" />`,
    `<meta property="og:locale" content="${OG_LOCALE[i.locale]}" />`,
  );
  if (i.alternates?.length) {
    const other: Locale = i.locale === "ar" ? "en" : "ar";
    lines.push(`<meta property="og:locale:alternate" content="${OG_LOCALE[other]}" />`);
  }
  if (i.canonical) lines.push(`<meta property="og:url" content="${esc(i.canonical)}" />`);
  lines.push(
    `<meta property="og:title" content="${esc(i.title)}" />`,
    `<meta property="og:description" content="${esc(i.description)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
  );
  if (isDefaultImage) {
    lines.push(
      `<meta property="og:image:width" content="${OG_IMAGE_SIZE.width}" />`,
      `<meta property="og:image:height" content="${OG_IMAGE_SIZE.height}" />`,
    );
  }
  if (i.article) {
    lines.push(
      `<meta property="article:published_time" content="${esc(i.article.published)}" />`,
      `<meta property="article:author" content="${esc(i.article.author)}" />`,
    );
    if (i.article.modified) {
      lines.push(`<meta property="article:modified_time" content="${esc(i.article.modified)}" />`);
    }
  }

  lines.push(
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="${TWITTER_HANDLE}" />`,
    `<meta name="twitter:title" content="${esc(i.title)}" />`,
    `<meta name="twitter:description" content="${esc(i.description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
  );

  for (const ld of i.jsonLd ?? []) lines.push(jsonLdTag(ld));
  return lines.map((l) => `    ${l}`).join("\n");
}

// ---- Crawler-readable fallback (<noscript>) -------------------------------

const NAV_LABELS: Record<Locale, Array<[PageKey, string]>> = {
  ar: [
    ["home", "الرئيسية"],
    ["articles", "المقالات"],
    ["resources", "الموارد"],
    ["programs", "البرامج"],
    ["services", "الخدمات"],
    ["publishWithUs", "انشر معنا"],
    ["publishingPolicy", "سياسة النشر"],
  ],
  en: [
    ["home", "Home"],
    ["articles", "Articles"],
    ["resources", "Resources"],
    ["programs", "Programs"],
    ["services", "Services"],
    ["publishWithUs", "Publish with us"],
    ["publishingPolicy", "Publishing policy"],
  ],
};

function navHtml(locale: Locale): string {
  const links = NAV_LABELS[locale]
    .map(([key, label]) => `<li><a href="${localePath(locale, PAGES[key].path)}">${esc(label)}</a></li>`)
    .join("");
  return `<nav><ul>${links}</ul></nav>`;
}

function wrapNoscript(locale: Locale, body: string): string {
  return `<noscript><div lang="${locale}" dir="${DIR[locale]}">${body}${navHtml(locale)}</div></noscript>`;
}

function pageNoscript(locale: Locale, title: string, description: string, extra = ""): string {
  return wrapNoscript(locale, `<h1>${esc(title)}</h1><p>${esc(description)}</p>${extra}`);
}

function articleNoscript(a: Article): string {
  // `content` is sanitized HTML (see sanitize.ts) — safe to embed as-is.
  return wrapNoscript(
    "ar",
    `<article><h1>${esc(a.title)}</h1><p>${esc(a.author)} — ${esc(a.date)}</p>` +
      `<p>${esc(a.excerpt)}</p>${a.content}</article>`,
  );
}

function articleListHtml(list: Article[]): string {
  const items = list
    .map((a) => `<li><a href="${ARTICLES_PATH}/${encodeURIComponent(a.slug)}">${esc(a.title)}</a></li>`)
    .join("");
  return `<ul>${items}</ul>`;
}

// ---- Route resolution ----------------------------------------------------

function robotsFor(index: boolean): string {
  return index ? "index, follow, max-image-preview:large" : "noindex, follow";
}

function notFound(locale: Locale): PageHead {
  const meta = NOT_FOUND_META[locale];
  return {
    status: 404,
    locale,
    head: renderHead({
      locale,
      title: meta.title,
      description: meta.description,
      robots: "noindex, follow",
    }),
    noscript: pageNoscript(locale, meta.title, meta.description),
  };
}

export async function resolveHead(rawPathname: string): Promise<PageHead> {
  // Collapse duplicate/trailing slashes so /articles/ and /articles are one URL.
  const cleaned = rawPathname.replace(/\/{2,}/g, "/");
  const { locale, path } = parseLocale(cleaned);
  const canonicalPath = localePath(locale, path);
  // "/articles/" and "//articles" are the same page as "/articles": one URL each.
  if (rawPathname !== canonicalPath) {
    return { status: 301, redirect: canonicalPath, locale, head: "", noscript: "" };
  }

  // Admin CMS: never indexed, Arabic-only.
  if (path === "/admin" || path.startsWith("/admin/")) {
    if (locale === "en") return notFound(locale);
    const meta = NOT_FOUND_META.ar;
    return {
      status: 200,
      locale,
      head: renderHead({
        locale,
        title: `إدارة المحتوى | ${BRAND.ar}`,
        description: meta.description,
        robots: "noindex, nofollow",
      }),
      noscript: "",
    };
  }

  // Static pages.
  const page = findPage(path);
  if (page) {
    const { key, def } = page;
    const meta = def.meta[locale];
    const ld: JsonLd[] = [];
    if (key === "home") ld.push(organizationLd(locale), websiteLd(locale));
    const crumbs = pageBreadcrumbs(locale, key);
    if (crumbs && def.index) ld.push(crumbs);

    let extra = "";
    if (key === "articles") {
      try {
        extra = articleListHtml(await listPublishedArticles("cultural"));
      } catch (err) {
        console.error("[seo] failed to list articles for noscript:", err);
      }
    }
    if (key === "resources") {
      extra = `<ul>${RESOURCES.map(
        (r) => `<li><a href="${RESOURCES_PATH}/${encodeURIComponent(r.id)}">${esc(r.title)}</a></li>`,
      ).join("")}</ul>`;
    }

    return {
      status: 200,
      locale,
      head: renderHead({
        locale,
        title: meta.title,
        description: meta.description,
        robots: robotsFor(def.index),
        canonical: absoluteUrl(locale, def.path),
        alternates: def.index ? alternatesFor(def.path) : undefined,
        jsonLd: ld,
      }),
      noscript: pageNoscript(locale, meta.title, meta.description, extra),
    };
  }

  // Article detail. Articles exist in Arabic only, so the English path 301s to
  // the Arabic URL rather than serving duplicate Arabic content under /en.
  const slug = articleSlugFromPath(path);
  if (slug) {
    if (locale === "en") {
      return {
        status: 301,
        redirect: `${ARTICLES_PATH}/${encodeURIComponent(slug)}`,
        locale,
        head: "",
        noscript: "",
      };
    }

    let article: Article | undefined;
    try {
      article = await getPublishedArticleBySlug(slug);
      if (!article) {
        // Slugs are case-sensitive; fold near-duplicates (e.g. "Systems-…" vs
        // "systems-…") into the stored spelling with a permanent redirect.
        const lower = slug.toLowerCase();
        const match = (await listPublishedArticles("cultural")).find(
          (a) => a.slug.toLowerCase() === lower,
        );
        if (match && match.slug !== slug) {
          return {
            status: 301,
            redirect: `${ARTICLES_PATH}/${encodeURIComponent(match.slug)}`,
            locale,
            head: "",
            noscript: "",
          };
        }
      }
    } catch (err) {
      // DB hiccup: serve the app shell (200) rather than a false 404, and let
      // the client fetch retry. Default head keeps the page valid.
      console.error("[seo] article lookup failed:", err);
      return { status: 200, locale, head: "", noscript: "" };
    }

    if (!article) return notFound("ar");

    const url = absoluteUrl("ar", `${ARTICLES_PATH}/${article.slug}`);
    const modified =
      article.updatedAt instanceof Date ? article.updatedAt.toISOString() : undefined;
    return {
      status: 200,
      locale: "ar",
      head: renderHead({
        locale: "ar",
        title: `${article.title} | ${BRAND.ar}`,
        description: truncateDescription(article.excerpt),
        robots: robotsFor(true),
        canonical: url,
        image: absoluteAsset(article.image),
        ogType: "article",
        article: { published: article.date, modified, author: article.author },
        jsonLd: [
          articleLd({
            slug: article.slug,
            title: article.title,
            author: article.author,
            date: article.date,
            excerpt: article.excerpt,
            image: article.image,
            modified,
          }),
          breadcrumbLd([
            { name: BRAND.ar, url: absoluteUrl("ar", "/") },
            { name: "المقالات", url: absoluteUrl("ar", ARTICLES_PATH) },
            { name: article.title, url },
          ]),
        ],
      }),
      noscript: articleNoscript(article),
    };
  }

  // Guide landing pages. Like articles they are Arabic-only content, so the
  // English path redirects to the Arabic URL instead of duplicating it.
  const resourceId = resourceIdFromPath(path);
  if (resourceId) {
    if (locale === "en") {
      return {
        status: 301,
        redirect: `${RESOURCES_PATH}/${encodeURIComponent(resourceId)}`,
        locale,
        head: "",
        noscript: "",
      };
    }
    const resource = RESOURCES.find((r) => r.id === resourceId);
    if (!resource) return notFound("ar");

    const url = absoluteUrl("ar", `${RESOURCES_PATH}/${resource.id}`);
    return {
      status: 200,
      locale: "ar",
      head: renderHead({
        locale: "ar",
        title: `${resource.title} | ${BRAND.ar}`,
        description: truncateDescription(resource.description),
        robots: robotsFor(true),
        canonical: url,
        image: absoluteAsset(resource.image),
        jsonLd: [
          resourceLd(resource),
          breadcrumbLd([
            { name: BRAND.ar, url: absoluteUrl("ar", "/") },
            { name: "الموارد", url: absoluteUrl("ar", RESOURCES_PATH) },
            { name: resource.title, url },
          ]),
        ],
      }),
      noscript: pageNoscript("ar", resource.title, resource.description),
    };
  }

  return notFound(locale);
}

// ---- Template injection ----------------------------------------------------

export function injectHead(template: string, result: PageHead): string {
  let html = template.replace(
    /<html\b[^>]*>/i,
    `<html lang="${result.locale}" dir="${DIR[result.locale]}">`,
  );

  // An empty head means "keep the defaults baked into index.html".
  if (result.head) {
    const start = html.indexOf(HEAD_START);
    const end = html.indexOf(HEAD_END);
    if (start !== -1 && end > start) {
      html = `${html.slice(0, start)}${HEAD_START}\n${result.head}\n    ${html.slice(end)}`;
    } else {
      html = html.replace("</head>", `${result.head}\n  </head>`);
    }
  }

  return html.replace(NOSCRIPT_MARKER, result.noscript);
}

// ---- Sitemap ---------------------------------------------------------------

function xmlEsc(value: string): string {
  return esc(value).replace(/'/g, "&apos;");
}

function lastmodOf(article: Article): string {
  const d = article.updatedAt instanceof Date ? article.updatedAt : new Date(article.date);
  return (Number.isNaN(d.getTime()) ? new Date(article.date) : d).toISOString().slice(0, 10);
}

export async function buildSitemap(): Promise<string> {
  let list: Article[] = [];
  try {
    list = await listPublishedArticles("cultural");
  } catch (err) {
    console.error("[sitemap] failed to load articles:", err);
  }

  const newest = list.map(lastmodOf).sort().pop();
  const today = new Date().toISOString().slice(0, 10);
  const urls: string[] = [];

  const alternateLinks = (path: string) =>
    alternatesFor(path)
      .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${xmlEsc(a.href)}"/>`)
      .join("\n");

  for (const key of Object.keys(PAGES) as PageKey[]) {
    const def = PAGES[key];
    if (!def.index) continue;
    // The listing changes whenever an article does; other pages change rarely,
    // so they are not stamped with "today" (that would be a false freshness signal).
    const lastmod = key === "articles" || key === "home" ? newest ?? today : undefined;
    for (const locale of ["ar", "en"] as const) {
      urls.push(
        [
          "  <url>",
          `    <loc>${xmlEsc(absoluteUrl(locale, def.path))}</loc>`,
          lastmod ? `    <lastmod>${lastmod}</lastmod>` : "",
          `    <changefreq>${def.changefreq}</changefreq>`,
          `    <priority>${def.priority.toFixed(1)}</priority>`,
          alternateLinks(def.path),
          "  </url>",
        ]
          .filter(Boolean)
          .join("\n"),
      );
    }
  }

  for (const a of list) {
    urls.push(
      [
        "  <url>",
        `    <loc>${xmlEsc(`${SITE_URL}${ARTICLES_PATH}/${encodeURIComponent(a.slug)}`)}</loc>`,
        `    <lastmod>${lastmodOf(a)}</lastmod>`,
        "    <changefreq>monthly</changefreq>",
        "    <priority>0.7</priority>",
        "  </url>",
      ].join("\n"),
    );
  }

  for (const r of RESOURCES) {
    urls.push(
      [
        "  <url>",
        `    <loc>${xmlEsc(`${SITE_URL}${RESOURCES_PATH}/${encodeURIComponent(r.id)}`)}</loc>`,
        "    <changefreq>monthly</changefreq>",
        "    <priority>0.7</priority>",
        "  </url>",
      ].join("\n"),
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
}
