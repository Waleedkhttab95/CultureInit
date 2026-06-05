// One-off extractor: reads the write-community hardcoded articles object from
// its Next.js page, converts plain-text content to sanitized-friendly HTML
// paragraphs, derives an excerpt, and writes a reproducible JSON seed file.
import fs from "fs";
import path from "path";

const PAGE = process.argv[2] ||
  path.join(process.env.HOME, "Documents/write-community/app/articles/[slug]/page.tsx");
const OUT = process.argv[3] ||
  path.join(process.cwd(), "server", "write-community-articles.json");

const src = fs.readFileSync(PAGE, "utf-8");

// Slice out the `const articles = { ... };` object literal.
const start = src.indexOf("const articles = {");
if (start === -1) throw new Error("articles object not found");
const braceStart = src.indexOf("{", start);
let depth = 0, i = braceStart, end = -1;
let inStr = null;
for (; i < src.length; i++) {
  const ch = src[i];
  const prev = src[i - 1];
  if (inStr) {
    if (ch === inStr && prev !== "\\") inStr = null;
    continue;
  }
  if (ch === "'" || ch === '"' || ch === "`") { inStr = ch; continue; }
  if (ch === "{") depth++;
  else if (ch === "}") { depth--; if (depth === 0) { end = i; break; } }
}
if (end === -1) throw new Error("could not match closing brace");
const objText = src.slice(braceStart, end + 1);

// Safe: object literal contains only string/template values.
const articles = eval("(" + objText + ")");

function escapeHtml(t) {
  return t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Plain text -> HTML: blank-line separated blocks become <p>, single newlines
// inside a block become <br/>. Matches how the old site rendered (\n\n split).
function toHtml(text) {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => `<p>${escapeHtml(b).replace(/\n/g, "<br/>")}</p>`)
    .join("\n");
}

function excerptFrom(text) {
  const first = text.replace(/\r\n/g, "\n").split(/\n{2,}/).map(s => s.trim()).filter(Boolean)[0] || "";
  const flat = first.replace(/\s+/g, " ").trim();
  if (flat.length <= 280) return flat;
  return flat.slice(0, 279).trimEnd() + "…";
}

const out = Object.entries(articles).map(([slug, a]) => ({
  slug,
  title: a.title,
  author: (a.author || "").trim(),
  date: a.date,
  category: a.category || null,
  image: a.image,
  excerpt: excerptFrom(a.content || ""),
  content: toHtml(a.content || ""),
}));

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n", "utf-8");
console.log(`Wrote ${out.length} articles to ${OUT}`);
