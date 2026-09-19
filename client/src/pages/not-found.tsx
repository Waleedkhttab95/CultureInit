import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/SEO";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useCopy } from "@/i18n/locale";

const COPY = {
  ar: {
    title: "٤٠٤ — الصفحة غير موجودة",
    body: "عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.",
    home: "العودة للصفحة الرئيسية",
  },
  en: {
    title: "404 — Page not found",
    body: "Sorry, the page you are looking for does not exist or has been moved.",
    home: "Back to the homepage",
  },
};

export default function NotFound() {
  const c = useCopy(COPY);
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background">
      <SEO notFound />
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-foreground">{c.title}</h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {c.body}
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center min-h-11 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground border border-primary-border hover-elevate active-elevate-2"
          >
            {c.home}
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
