import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-foreground">٤٠٤ — الصفحة غير موجودة</h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
          </p>

          <a
            href="/"
            className="mt-6 inline-flex items-center justify-center min-h-11 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground border border-primary-border hover-elevate active-elevate-2"
          >
            العودة للصفحة الرئيسية
          </a>
        </CardContent>
      </Card>
    </main>
  );
}
