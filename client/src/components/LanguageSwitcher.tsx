import { Link } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";
import { Languages } from "lucide-react";
import { ARTICLES_PATH, localePath, parseLocale, type Locale } from "@shared/seo";
import { useLocale } from "@/i18n/locale";

const COPY: Record<Locale, { label: string; aria: string }> = {
  // Each option is labelled in the language it switches TO.
  ar: { label: "English", aria: "Switch to English" },
  en: { label: "العربية", aria: "التبديل إلى العربية" },
};

/**
 * Plain, crawlable link to the same page in the other language (a real href,
 * not a button), so search engines can follow it as well as visitors.
 */
export default function LanguageSwitcher({
  className = "",
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const { locale } = useLocale();
  // Absolute location: the router inside /en is nested, so its own useLocation
  // would return the path without the /en prefix.
  const [absolute] = useBrowserLocation();
  const { path } = parseLocale(absolute);

  const target: Locale = locale === "ar" ? "en" : "ar";
  // Articles exist in Arabic only, so from an article the English link lands on
  // the English article list rather than a page that would redirect back.
  const targetPath =
    target === "en" && /^\/articles\/[^/]+$/.test(path) ? ARTICLES_PATH : path;
  const c = COPY[locale];

  // wouter v3's <Link> already renders the <a>, so props go on it directly
  // (a nested <a> would be invalid HTML and would hide the href from tests).
  return (
    <Link
      href={`~${localePath(target, targetPath)}`}
      lang={target}
      hrefLang={target}
      aria-label={c.aria}
      onClick={onNavigate}
      data-testid="link-language-switch"
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      {c.label}
    </Link>
  );
}
