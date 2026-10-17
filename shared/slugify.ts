// ASCII slugification shared by the server and the client. Used for article
// slugs (server/article-store.ts) and for tag slugs (shared/seo.ts, rendered
// as links on the client) — both need the exact same output for a given
// input, or a link generated on one side won't resolve on the other.

// Map Arabic letters/digits to Latin so slugs are always URL-safe ASCII.
// The write-community site is a Next.js static export: a non-ASCII slug yields
// an HTML file whose on-disk name never matches the browser's percent-encoded
// request path, so the article 404s on read even though it lists fine.
const ARABIC_TRANSLITERATION: Record<string, string> = {
  ا: "a", أ: "a", إ: "a", آ: "a", ٱ: "a", ء: "", ئ: "a", ؤ: "w", ى: "a", ة: "h",
  ب: "b", ت: "t", ث: "th", ج: "j", ح: "h", خ: "kh", د: "d", ذ: "dh", ر: "r",
  ز: "z", س: "s", ش: "sh", ص: "s", ض: "d", ط: "t", ظ: "z", ع: "a", غ: "gh",
  ف: "f", ق: "q", ك: "k", ل: "l", م: "m", ن: "n", ه: "h", و: "w", ي: "y",
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6",
  "٧": "7", "٨": "8", "٩": "9",
};

export function transliterateArabic(input: string): string {
  let out = "";
  for (const ch of input) {
    // Drop Arabic diacritics (tashkeel, U+064B–U+0652) entirely.
    if (ch >= "ً" && ch <= "ْ") continue;
    out += ARABIC_TRANSLITERATION[ch] ?? ch;
  }
  return out;
}

/** Plain ASCII slug: lowercase letters/digits/hyphens, no fallback. */
export function slugify(input: string, maxLen = 180): string {
  return transliterateArabic(input)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLen);
}
