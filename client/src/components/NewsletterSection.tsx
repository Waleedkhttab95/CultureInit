import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2 } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال بريدك الإلكتروني",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "تم الاشتراك بنجاح!",
          description: "شكراً لاشتراكك في نشرتنا الإخبارية",
        });
        setEmail("");
      } else {
        toast({
          title: "خطأ",
          description: data.message || "حدث خطأ أثناء الاشتراك",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-primary/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <Mail className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          اشترك في نشرتنا الإخبارية
        </h2>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          احصل على آخر التحديثات والمقالات والموارد المتعلقة بالإدارة الثقافية مباشرة في بريدك الإلكتروني
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="flex-1 text-right"
              required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="sm:w-auto w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الاشتراك...
                </>
              ) : (
                "اشترك الآن"
              )}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            نحترم خصوصيتك. لن نشارك بريدك الإلكتروني مع أي جهة خارجية.
          </p>
        </form>
      </div>
    </section>
  );
}
