import { ArrowLeft, ArrowRight, type LucideProps } from "lucide-react";
import { useLocale } from "@/i18n/locale";

/** Points the way reading proceeds: ← in Arabic (RTL), → in English (LTR). */
export function ForwardArrow(props: LucideProps) {
  const { isEn } = useLocale();
  return isEn ? <ArrowRight {...props} /> : <ArrowLeft {...props} />;
}

/** Points back toward where the reader came from: → in Arabic, ← in English. */
export function BackArrow(props: LucideProps) {
  const { isEn } = useLocale();
  return isEn ? <ArrowLeft {...props} /> : <ArrowRight {...props} />;
}
