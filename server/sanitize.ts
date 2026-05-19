import sanitizeHtml from "sanitize-html";

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
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer nofollow",
      target: "_blank",
    }),
  },
  disallowedTagsMode: "discard",
};

export function sanitizeArticleHtml(dirty: string): string {
  return sanitizeHtml(dirty, options);
}
