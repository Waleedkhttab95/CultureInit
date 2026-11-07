import sanitizeHtml from "sanitize-html";
import { SITE_URL } from "@shared/seo";

const SITE_HOST = new URL(SITE_URL).hostname;

// A link is internal if it's relative/an in-page anchor, or an absolute URL
// that points at this site's own domain. Internal links should be dofollow
// (rel has no "nofollow") so link equity flows through the site and crawlers
// have a reason to follow them; outbound links stay nofollow.
function isInternalHref(href: string | undefined): boolean {
  if (!href) return false;
  if (href.startsWith("/") || href.startsWith("#")) return true;
  try {
    const { hostname } = new URL(href);
    return hostname === SITE_HOST || hostname === `www.${SITE_HOST}`;
  } catch {
    return false;
  }
}

// Article HTML is authored by the trusted admin via the WYSIWYG editor, but it
// is rendered to every public visitor with dangerouslySetInnerHTML. We sanitize
// on write (defense-in-depth) so a mistake, a compromised session, or a future
// multi-author setup can never lead to stored XSS.
const options: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4",
    "p", "br", "hr",
    "strong", "b", "em", "i", "u", "s",
    "ul", "ol", "li",
    "blockquote",
    "a",
    "code", "pre",
    "figure", "figcaption", "img",
    "span",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "title"],
    span: ["style"],
    "*": ["dir"],
  },
  // Relative URLs are allowed so images can point at /attached_assets and
  // /uploads served by this same server.
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesAppliedToAttributes: ["href", "src"],
  allowProtocolRelative: false,
  // Only allow a conservative inline-style allowlist (text alignment used by
  // the RTL editor); strip everything else.
  allowedStyles: {
    "*": {
      "text-align": [/^(left|right|center|justify)$/],
    },
  },
  transformTags: {
    // Force safe link behavior regardless of what the editor emitted.
    // nofollow is dropped for internal links only — see isInternalHref.
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        target: "_blank",
        rel: isInternalHref(attribs.href)
          ? "noopener noreferrer"
          : "noopener noreferrer nofollow",
      },
    }),
  },
  disallowedTagsMode: "discard",
};

export function sanitizeArticleHtml(dirty: string): string {
  return sanitizeHtml(dirty, options);
}
