// Single source of truth for SEO: locales, per-page metadata, URL helpers and
// JSON-LD builders. Imported by BOTH the Express server (which injects the
// <head> into index.html so crawlers/scrapers see real tags) and the client
// <SEO> component (which keeps the head in sync during SPA navigation).
// Keep this file free of Node/DOM APIs.

export const SITE_URL = "https://cultural-managment.com";

export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ar";

export const DIR: Record<Locale, "rtl" | "ltr"> = { ar: "rtl", en: "ltr" };
export const OG_LOCALE: Record<Locale, string> = { ar: "ar_SA", en: "en_US" };

export const BRAND: Record<Locale, string> = {
  ar: "منصة الإدارة الثقافية",
  en: "Cultural Management Platform",
};

export const OG_IMAGE = `${SITE_URL}/og-image.png`;
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
export const LOGO_URL = `${SITE_URL}/icon.png`;
export const TWITTER_HANDLE = "@culturalmgmt";

// ---- Static pages --------------------------------------------------------

export type ChangeFreq = "daily" | "weekly" | "monthly";

export interface PageMeta {
  title: string;
  description: string;
}

export interface PageDef {
  /** Locale-less path, e.g. "/articles". */
  path: string;
  /** false → rendered with noindex,follow and left out of the sitemap. */
  index: boolean;
  changefreq: ChangeFreq;
  priority: number;
  meta: Record<Locale, PageMeta>;
}

export const PAGES = {
  home: {
    path: "/",
    index: true,
    changefreq: "weekly",
    priority: 1.0,
    meta: {
      ar: {
        title: "منصة الإدارة الثقافية | معرفة وبرامج وخدمات للقطاع الثقافي",
        description:
          "منصة معرفية متخصصة في نشر وتعزيز مفاهيم الإدارة الثقافية، تستهدف الممارسين والمهتمين والجهات العاملة في القطاع الثقافي.",
      },
      en: {
        title: "Cultural Management Platform | Knowledge, Programs & Services",
        description:
          "A specialist knowledge platform advancing cultural management, serving practitioners, enthusiasts and organizations across the cultural sector.",
      },
    },
  },
  articles: {
    path: "/articles",
    index: true,
    changefreq: "weekly",
    priority: 0.9,
    meta: {
      ar: {
        title: "المقالات | منصة الإدارة الثقافية",
        description:
          "مقالات تعريفية وتحليلية عن مفاهيم الإدارة الثقافية، وتجارب عربية وعالمية في إدارة البرامج الثقافية.",
      },
      en: {
        title: "Cultural Management Articles | Cultural Management Platform",
        description:
          "Introductory and analytical articles on cultural management, with Arab and international experiences in running cultural programs. Articles are published in Arabic.",
      },
    },
  },
  resources: {
    path: "/resources",
    index: true,
    changefreq: "monthly",
    priority: 0.8,
    meta: {
      ar: {
        title: "الموارد | منصة الإدارة الثقافية",
        description:
          "أدلة تطبيقية وكتيبات مهنية في الإدارة الثقافية، وأدوات عملية لتصميم البرامج الثقافية.",
      },
      en: {
        title: "Resources | Cultural Management Platform",
        description:
          "Practical guides and professional handbooks in cultural management, plus hands-on tools for designing cultural programs.",
      },
    },
  },
  programs: {
    path: "/programs",
    index: true,
    changefreq: "monthly",
    priority: 0.8,
    meta: {
      ar: {
        title: "ممارس الإدارة الثقافية | برنامج تأهيلي عملي",
        description:
          "برنامج تأهيلي عملي لتطوير مهارات تصميم وإدارة المشاريع والمنظمات الثقافية. اطّلع على محاور البرنامج وسجّل الآن.",
      },
      en: {
        title: "Cultural Management Practitioner Program | Hands-On Training",
        description:
          "A hands-on qualification program that builds the skills to design and manage cultural projects and organizations. Explore the curriculum and register.",
      },
    },
  },
  services: {
    path: "/services",
    index: true,
    changefreq: "monthly",
    priority: 0.8,
    meta: {
      ar: {
        title: "الخدمات | منصة الإدارة الثقافية",
        description:
          "نرافق الجهات والأفراد العاملين في القطاع الثقافي عبر ثلاثة مسارات متكاملة: المحتوى، والتصميم، والتعليم.",
      },
      en: {
        title: "Services | Cultural Management Platform",
        description:
          "We support organizations and individuals in the cultural sector through three integrated tracks: content, design and education.",
      },
    },
  },
  publishWithUs: {
    path: "/publish-with-us",
    index: true,
    changefreq: "monthly",
    priority: 0.7,
    meta: {
      ar: {
        title: "انشر معنا | منصة الإدارة الثقافية",
        description:
          "شارك مقالك أو محتواك المعرفي في الإدارة الثقافية. اترك بياناتك وسنتواصل معك لمراجعة طلبك.",
      },
      en: {
        title: "Publish With Us | Cultural Management Platform",
        description:
          "Share your article or knowledge content on cultural management. Leave your details and we will get back to you to review your request.",
      },
    },
  },
  publishingPolicy: {
    path: "/publishing-policy",
    index: true,
    changefreq: "monthly",
    priority: 0.5,
    meta: {
      ar: {
        title: "سياسة النشر | منصة الإدارة الثقافية",
        description:
          "شروط النشر في منصة الإدارة الثقافية: أصالة المادة، والسلامة اللغوية، والملكية الفكرية، والمراجعة العلمية، وخطوات النشر.",
      },
      en: {
        title: "Publishing Policy | Cultural Management Platform",
        description:
          "Publishing requirements on the Cultural Management Platform: originality, language quality, intellectual property, scientific review and the submission steps.",
      },
    },
  },
  // Transactional form — useful to visitors, not a search landing page.
  programRegister: {
    path: "/programs/register",
    index: false,
    changefreq: "monthly",
    priority: 0.3,
    meta: {
      ar: {
        title: "نموذج التسجيل | ممارس الإدارة الثقافية",
        description: "نموذج التسجيل في برنامج ممارس الإدارة الثقافية.",
      },
      en: {
        title: "Registration | Cultural Management Practitioner Program",
        description: "Registration form for the Cultural Management Practitioner program.",
      },
    },
  },
} as const satisfies Record<string, PageDef>;

export type PageKey = keyof typeof PAGES;

export const NOT_FOUND_META: Record<Locale, PageMeta> = {
  ar: {
    title: "الصفحة غير موجودة | منصة الإدارة الثقافية",
    description: "عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.",
  },
  en: {
    title: "Page not found | Cultural Management Platform",
    description: "Sorry, the page you are looking for does not exist or has been moved.",
  },
};

export const ARTICLES_PATH = "/articles";
export const RESOURCES_PATH = "/resources";

// ---- Locale + URL helpers ------------------------------------------------

function normalizePath(path: string): string {
  if (!path) return "/";
  let p = path.startsWith("/") ? path : `/${path}`;
  if (p.length > 1 && p.endsWith("/")) p = p.replace(/\/+$/, "") || "/";
  return p;
}

/** Splits "/en/articles" into { locale: "en", path: "/articles" }. */
export function parseLocale(pathname: string): { locale: Locale; path: string } {
  const p = normalizePath(pathname);
  if (p === "/en") return { locale: "en", path: "/" };
  if (p.startsWith("/en/")) return { locale: "en", path: normalizePath(p.slice(3)) };
  return { locale: "ar", path: p };
}

/** "/articles" + "en" → "/en/articles"; Arabic (default) stays un-prefixed. */
export function localePath(locale: Locale, path: string): string {
  const p = normalizePath(path);
  if (locale === "ar") return p;
  return p === "/" ? "/en" : `/en${p}`;
}

export function absoluteUrl(locale: Locale, path: string): string {
  return `${SITE_URL}${localePath(locale, path)}`;
}

/** Makes a stored image path ("/attached_assets/x.jpg") absolute for OG tags. */
export function absoluteAsset(src: string | undefined | null): string {
  if (!src) return OG_IMAGE;
  if (/^https?:\/\//i.test(src)) return src;
  return `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
}

export interface Alternate {
  hreflang: string;
  href: string;
}

/** hreflang set for a page that exists in both languages (incl. x-default). */
export function alternatesFor(path: string): Alternate[] {
  return [
    { hreflang: "ar", href: absoluteUrl("ar", path) },
    { hreflang: "en", href: absoluteUrl("en", path) },
    { hreflang: "x-default", href: absoluteUrl("ar", path) },
  ];
}

export function findPage(path: string): { key: PageKey; def: PageDef } | undefined {
  const p = normalizePath(path);
  for (const key of Object.keys(PAGES) as PageKey[]) {
    if (PAGES[key].path === p) return { key, def: PAGES[key] };
  }
  return undefined;
}

export function articleSlugFromPath(path: string): string | undefined {
  const m = /^\/articles\/([^/]+)$/.exec(normalizePath(path));
  if (!m) return undefined;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return undefined;
  }
}

export function resourceIdFromPath(path: string): string | undefined {
  const m = /^\/resources\/([^/]+)$/.exec(normalizePath(path));
  if (!m) return undefined;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return undefined;
  }
}

/** Trims to a search-snippet friendly length without cutting mid-word. */
export function truncateDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

// ---- JSON-LD -------------------------------------------------------------

export type JsonLd = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export function organizationLd(locale: Locale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: BRAND[locale],
    alternateName: locale === "ar" ? BRAND.en : BRAND.ar,
    url: SITE_URL,
    logo: LOGO_URL,
    description: PAGES.home.meta[locale].description,
    address: {
      "@type": "PostalAddress",
      addressLocality: locale === "ar" ? "الرياض" : "Riyadh",
      addressCountry: "SA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+966-55-339-2905",
      contactType: "customer service",
      email: "info@cultural-managment.com",
      availableLanguage: ["ar", "en"],
    },
    sameAs: [
      "https://x.com/culturalmgmt",
      "https://www.instagram.com/cultural_management",
      "https://www.linkedin.com/company/الإدارة-الثقافية/",
    ],
  };
}

export function websiteLd(locale: Locale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE_URL,
    name: BRAND[locale],
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbLd(items: Array<{ name: string; url: string }>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface ArticleLdInput {
  slug: string;
  title: string;
  author: string;
  /** YYYY-MM-DD */
  date: string;
  excerpt: string;
  image: string;
  /** ISO timestamp of last edit, when known. */
  modified?: string;
}

export function articleLd(a: ArticleLdInput): JsonLd {
  const url = absoluteUrl("ar", `${ARTICLES_PATH}/${a.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: a.title.slice(0, 110),
    description: truncateDescription(a.excerpt),
    image: [absoluteAsset(a.image)],
    datePublished: a.date,
    dateModified: a.modified ?? a.date,
    inLanguage: "ar",
    author: { "@type": "Person", name: a.author },
    publisher: { "@id": ORG_ID },
  };
}

export function pageBreadcrumbs(locale: Locale, key: PageKey): JsonLd | undefined {
  if (key === "home") return undefined;
  return breadcrumbLd([
    { name: BRAND[locale], url: absoluteUrl(locale, "/") },
    { name: PAGES[key].meta[locale].title.split("|")[0].trim(), url: absoluteUrl(locale, PAGES[key].path) },
  ]);
}

export interface ResourceLdInput {
  id: string;
  title: string;
  description: string;
  image: string;
}

/**
 * A downloadable guide. Deliberately has no `contentUrl`: the PDF sits behind
 * a name + email form, and publishing its URL here would hand it to crawlers.
 */
export function resourceLd(r: ResourceLdInput): JsonLd {
  const url = absoluteUrl("ar", `${RESOURCES_PATH}/${r.id}`);
  return {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    "@id": `${url}#document`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    name: r.title,
    description: truncateDescription(r.description),
    image: [absoluteAsset(r.image)],
    inLanguage: "ar",
    encodingFormat: "application/pdf",
    isAccessibleForFree: true,
    publisher: { "@id": ORG_ID },
  };
}
