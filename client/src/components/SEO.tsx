import { useEffect } from "react";
import {
  BRAND,
  DIR,
  NOT_FOUND_META,
  OG_IMAGE,
  OG_LOCALE,
  PAGES,
  TWITTER_HANDLE,
  absoluteUrl,
  alternatesFor,
  organizationLd,
  pageBreadcrumbs,
  websiteLd,
  type JsonLd,
  type Locale,
  type PageKey,
} from "@shared/seo";
import { useLocale } from "@/i18n/locale";

// The server already renders the correct <head> for the URL that was
// requested (server/seo.ts). This component keeps it correct while the visitor
// navigates inside the SPA, using the same data from shared/seo.ts.

interface SEOProps {
  /** A static page from shared/seo.ts — supplies title, description, canonical. */
  page?: PageKey;
  /** Overrides for dynamic pages (e.g. an article). */
  title?: string;
  description?: string;
  /** Locale-less path used for the canonical URL. */
  path?: string;
  /** Pins the page to one language (articles are Arabic-only). */
  locale?: Locale;
  image?: string;
  type?: "website" | "article";
  article?: { published: string; modified?: string; author: string };
  /** Renders `noindex` (admin, 404, error states). */
  noindex?: boolean;
  /** Emit hreflang for pages that exist in both languages. */
  alternates?: boolean;
  notFound?: boolean;
  jsonLd?: JsonLd[];
}

function setMeta(attr: "name" | "property", key: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (content === null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>(
    `link[rel="${rel}"]:not([hreflang])`,
  );
  if (href === null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function SEO(props: SEOProps) {
  const ctx = useLocale();
  const locale = props.locale ?? ctx.locale;
  const def = props.page ? PAGES[props.page] : undefined;

  const fallback = props.notFound ? NOT_FOUND_META[locale] : def?.meta[locale];
  const title = props.title ?? fallback?.title ?? BRAND[locale];
  const description = props.description ?? fallback?.description ?? "";
  const path = props.path ?? def?.path;
  const noindex = props.noindex || props.notFound || (def ? !def.index : false);
  const wantsAlternates = props.alternates ?? (def?.index ?? false);
  const canonical = !props.notFound && path ? absoluteUrl(locale, path) : null;
  const image = props.image ?? OG_IMAGE;
  const type = props.type ?? "website";

  const jsonLd =
    props.jsonLd ??
    (props.page === "home"
      ? [organizationLd(locale), websiteLd(locale)]
      : props.page && def?.index
        ? [pageBreadcrumbs(locale, props.page)].filter((x): x is JsonLd => !!x)
        : []);
  const jsonLdKey = JSON.stringify(jsonLd);
  const articleKey = props.article ? JSON.stringify(props.article) : "";

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = DIR[locale];

    document.title = title;
    setMeta("name", "description", description);
    setMeta(
      "name",
      "robots",
      noindex ? "noindex, follow" : "index, follow, max-image-preview:large",
    );
    setLink("canonical", canonical);

    // hreflang alternates
    document.head
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((el) => el.remove());
    if (wantsAlternates && path && !noindex) {
      for (const alt of alternatesFor(path)) {
        const el = document.createElement("link");
        el.rel = "alternate";
        el.hreflang = alt.hreflang;
        el.href = alt.href;
        document.head.appendChild(el);
      }
    }

    // Open Graph
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", BRAND[locale]);
    setMeta("property", "og:locale", OG_LOCALE[locale]);
    setMeta(
      "property",
      "og:locale:alternate",
      wantsAlternates && !noindex ? OG_LOCALE[locale === "ar" ? "en" : "ar"] : null,
    );
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", image);
    // Dimensions only describe the default card, not arbitrary article images.
    const isDefaultImage = image === OG_IMAGE;
    setMeta("property", "og:image:width", isDefaultImage ? "1200" : null);
    setMeta("property", "og:image:height", isDefaultImage ? "630" : null);

    const article = articleKey ? JSON.parse(articleKey) : null;
    setMeta("property", "article:published_time", article?.published ?? null);
    setMeta("property", "article:modified_time", article?.modified ?? null);
    setMeta("property", "article:author", article?.author ?? null);

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:site", TWITTER_HANDLE);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    // Remove legacy tags emitted by older builds
    setMeta("name", "title", null);
    setMeta("name", "keywords", null);
    setMeta("property", "twitter:url", null);
    setMeta("property", "twitter:title", null);
    setMeta("property", "twitter:description", null);
    setMeta("property", "twitter:image", null);

    // JSON-LD: replace whatever the server (or previous page) emitted.
    document.head
      .querySelectorAll('script[type="application/ld+json"][data-seo]')
      .forEach((el) => el.remove());
    for (const data of JSON.parse(jsonLdKey) as JsonLd[]) {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.setAttribute("data-seo", "");
      el.textContent = JSON.stringify(data).replace(/</g, "\\u003c");
      document.head.appendChild(el);
    }
  }, [
    locale,
    title,
    description,
    canonical,
    noindex,
    wantsAlternates,
    path,
    image,
    type,
    articleKey,
    jsonLdKey,
  ]);

  return null;
}
