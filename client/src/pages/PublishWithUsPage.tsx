import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  User,
  Mail,
  Send,
  Check,
  FileText,
  MessageSquare
} from "lucide-react";

export default function PublishWithUsPage() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/publish-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          title: formData.title,
          message: formData.message
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', email: '', title: '', message: '' });
        }, 3000);
      } else {
        toast({
          title: "خطأ",
          description: data.message || 'حدث خطأ أثناء إرسال البيانات',
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main>
        <section
          ref={sectionRef}
          className={`py-20 bg-gradient-to-br from-secondary/30 to-background transition-all duration-1000 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Contact Form Section */}
            <div className="bg-card border border-card-border rounded-2xl p-8 lg:p-12">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  انشر معنا
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                  اترك بياناتك ومحتواك وسنتواصل معك قريباً لمراجعة طلبك
                </p>
              </div>

              {isSubmitted ? (
                <div className="max-w-md mx-auto text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  <h5 className="text-xl font-bold text-foreground mb-2">
                    تم إرسال طلبك بنجاح!
                  </h5>
                  <p className="text-muted-foreground">
                    شكراً لك، سنتواصل معك قريباً
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                  <div className="bg-gradient-to-br from-background to-accent/20 rounded-2xl p-8 border border-card-border shadow-lg">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          الاسم الثلاثي
                        </Label>
                        <div className="relative">
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="أدخل اسمك الثلاثي"
                            required
                            className="h-12 pl-4 pr-4 text-base border-2 border-card-border focus:border-primary transition-colors rounded-xl"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          البريد الإلكتروني
                        </Label>
                        <div className="relative">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="أدخل بريدك الإلكتروني"
                            required
                            className="h-12 pl-4 pr-4 text-base border-2 border-card-border focus:border-primary transition-colors rounded-xl"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          العنوان
                        </Label>
                        <div className="relative">
                          <Input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="أدخل عنوان المحتوى"
                            required
                            className="h-12 pl-4 pr-4 text-base border-2 border-card-border focus:border-primary transition-colors rounded-xl"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          الرسالة
                        </Label>
                        <div className="relative">
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="اكتب رسالتك أو وصف المحتوى"
                            required
                            rows={6}
                            className="pl-4 pr-4 pt-3 text-base border-2 border-card-border focus:border-primary transition-colors rounded-xl resize-none"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-xl shadow-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            جاري الإرسال...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Send className="h-5 w-5" />
                            إرسال الطلب
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
