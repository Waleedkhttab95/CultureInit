import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2 } from "lucide-react";
import { useCopy, useServerMessage } from "@/i18n/locale";

const COPY = {
  ar: {
    errorTitle: "خطأ",
    enterEmail: "يرجى إدخال بريدك الإلكتروني",
    successTitle: "تم الاشتراك بنجاح!",
    successBody: "شكراً لاشتراكك في نشرتنا الإخبارية",
    failed: "حدث خطأ أثناء الاشتراك",
    network: "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى",
    heading: "اشترك في نشرتنا الإخبارية",
    intro:
      "احصل على آخر التحديثات والمقالات والموارد المتعلقة بالإدارة الثقافية مباشرة في بريدك الإلكتروني",
    placeholder: "أدخل بريدك الإلكتروني",
    submitting: "جاري الاشتراك...",
    submit: "اشترك الآن",
    privacy: "نحترم خصوصيتك. لن نشارك بريدك الإلكتروني مع أي جهة خارجية.",
  },
  en: {
    errorTitle: "Error",
    enterEmail: "Please enter your email address",
    successTitle: "You're subscribed!",
    successBody: "Thank you for subscribing to our newsletter",
    failed: "Something went wrong while subscribing",
    network: "A connection error occurred. Please try again",
    heading: "Subscribe to our newsletter",
    intro:
      "Get the latest updates, articles and resources on cultural management delivered straight to your inbox",
    placeholder: "Enter your email address",
    submitting: "Subscribing...",
    submit: "Subscribe now",
    privacy: "We respect your privacy. We will never share your email with any third party.",
  },
};

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const c = useCopy(COPY);
  const serverMessage = useServerMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: c.errorTitle,
        description: c.enterEmail,
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
          title: c.successTitle,
          description: c.successBody,
        });
        setEmail("");
      } else {
        toast({
          title: c.errorTitle,
          description: serverMessage(data.message, c.failed),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: c.errorTitle,
        description: c.network,
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
          {c.heading}
        </h2>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {c.intro}
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder={c.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="flex-1 text-start"
              required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="sm:w-auto w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {c.submitting}
                </>
              ) : (
                c.submit
              )}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            {c.privacy}
          </p>
        </form>
      </div>
    </section>
  );
}
