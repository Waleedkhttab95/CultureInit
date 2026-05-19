import { sanitizeArticleHtml } from "./sanitize";

// Converts the legacy "markdown-lite" format used by the original
// articles.json into HTML, matching exactly how ArticleDetailPage used to
// render it (## -> h2, ### -> h3, **bold** -> strong, ![alt](src) -> figure,
// blank line -> paragraph). Used by the one-time seed and by the public
// JSON fallback so all article content renders uniformly as HTML.

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Escapes text, then turns **bold** spans into <strong>.
function renderInline(text: string): string {
  return text
    .split(/(\*\*.*?\*\*)/g)
    .map((part) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return `<strong>${escapeHtml(part.slice(2, -2))}</strong>`;
      }
      return escapeHtml(part);
    })
    .join("");
}

export function markdownLiteToHtml(content: string): string {
  const blocks = content.split("\n\n");
  const html = blocks
    .map((block) => {
      if (block.startsWith("## ")) {
        return `<h2>${renderInline(block.replace("## ", ""))}</h2>`;
      }
      if (block.startsWith("### ")) {
        return `<h3>${renderInline(block.replace("### ", ""))}</h3>`;
      }

      const imageMatch = block.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imageMatch) {
        const [, alt, src] = imageMatch;
        const caption = alt
          ? `<figcaption>${escapeHtml(alt)}</figcaption>`
          : "";
        return `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(
          alt,
        )}" />${caption}</figure>`;
      }

      return `<p>${renderInline(block)}</p>`;
    })
    .join("\n");

  // Run through the same sanitizer that admin-authored content uses.
  return sanitizeArticleHtml(html);
}
