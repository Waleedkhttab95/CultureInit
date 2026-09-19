import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DIR, type Locale } from "@shared/seo";

interface LocaleValue {
  locale: Locale;
  dir: "rtl" | "ltr";
  isEn: boolean;
}

const LocaleContext = createContext<LocaleValue>({
  locale: "ar",
  dir: "rtl",
  isEn: false,
});

/**
 * Provides the active UI language. The locale is decided by the URL prefix in
 * App.tsx (`/en/...` → English, everything else → Arabic), never by state, so
 * every URL has exactly one language — which is what search engines expect.
 */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const value = useMemo<LocaleValue>(
    () => ({ locale, dir: DIR[locale], isEn: locale === "en" }),
    [locale],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleValue {
  return useContext(LocaleContext);
}

/** Picks the copy for the active locale: `const c = useCopy(COPY)`. */
export function useCopy<T extends Record<Locale, unknown>>(copy: T): T[Locale] {
  return copy[useLocale().locale];
}

/**
 * Article pages exist in Arabic only. `~` makes the link absolute so it is not
 * rewritten to `/en/articles/...` when rendered inside the English router.
 */
export function articleHref(slug: string): string {
  return `~/articles/${encodeURIComponent(slug)}`;
}

/** Guide landing pages are Arabic-only too, so the link is absolute (see articleHref). */
export function resourceHref(id: string): string {
  return `~/resources/${encodeURIComponent(id)}`;
}

/**
 * The API's validation messages are Arabic-only. Arabic visitors see them as
 * before; English visitors get the localized fallback instead of Arabic text.
 */
export function useServerMessage(): (message: string | undefined, fallback: string) => string {
  const { isEn } = useLocale();
  return (message, fallback) => (isEn ? fallback : message || fallback);
}

/**
 * Key-by-source translation for long forms: `t("نص عربي")` returns the Arabic
 * unchanged, or its English entry on /en. A missing entry falls back to the
 * Arabic text rather than breaking the page.
 */
export function useT(en: Record<string, string>): (ar: string) => string {
  const { isEn } = useLocale();
  return (ar) => (isEn ? en[ar] ?? ar : ar);
}
