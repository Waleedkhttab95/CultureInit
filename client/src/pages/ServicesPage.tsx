import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useRef } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useToast } from "@/hooks/use-toast";
import whiteIcon from "@assets/white-icon.png";
import {
  Sparkles,
  BookOpen,
  Palette,
  GraduationCap,
  Check,
  Send,
  User,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Tag,
} from "lucide-react";

const PILLARS = [
  {
    id: "content",
    label: "المحتوى الثقافي",
    icon: BookOpen,
    bgClass: "bg-chart-3/20",
    textClass: "text-chart-3",
  },
  {
    id: "design",
    label: "التصميم الثقافي",
    icon: Palette,
    bgClass: "bg-chart-4/20",
    textClass: "text-chart-4",
  },
  {
    id: "education",
    label: "التعليم الثقافي",
    icon: GraduationCap,
    bgClass: "bg-chart-2/20",
    textClass: "text-chart-2",
  },
] as const;

const CONTENT_ITEMS = [
  { number: "01", text: "إعداد الدراسات والتقارير المعرفية" },
  { number: "02", text: "كتابة المقالات المتخصصة" },
  { number: "03", text: "تطوير الأدلة والموارد المعرفية" },
  { number: "04", text: "توثيق التجارب والممارسات الثقافية" },
  { number: "05", text: "إنتاج النشرات والمحتوى المهني المتخصص" },
];

const DESIGN_ITEMS = [
  { number: "01", text: "تصميم البرامج والتجارب الثقافية" },
  { number: "02", text: "تصميم المبادرات والحلول الثقافية" },
  { number: "03", text: "تصميم الأدلة المهنية والإجرائية" },
  { number: "04", text: "تصميم الحقائب التدريبية المتخصصة" },
  { number: "05", text: "تطوير النماذج والأدوات التشغيلية" },
];

const EDUCATION_ITEMS = [
  { number: "01", text: "البرامج المهنية المتخصصة" },
  { number: "02", text: "الدورات التدريبية" },
  { number: "03", text: "ورش العمل التطبيقية" },
  { number: "04", text: "برامج التأهيل والتطوير المهني" },
  { number: "05", text: "اللقاءات والجلسات المعرفية المتخصصة" },
];

const inputClass =
  "h-12 text-base bg-card border-input text-foreground placeholder:text-muted-foreground focus:border-ring rounded-xl";
const labelClass =
  "text-sm font-semibold text-foreground flex items-center gap-2";
const selectTriggerClass =
  "h-12 text-base bg-card border-input text-foreground placeholder:text-muted-foreground focus:border-ring rounded-xl [&>span]:text-foreground data-[placeholder]:text-muted-foreground";

export default function ServicesPage() {
  const [parallaxY, setParallaxY] = useState(0);
  const reduceMotionRef = useRef(false);
  const { toast } = useToast();

  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { ref: designRef, isVisible: designVisible } = useScrollAnimation();
  const { ref: educationRef, isVisible: educationVisible } = useScrollAnimation();
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        reduceMotionRef.current = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
      } catch {}
    }

    if (reduceMotionRef.current) return;

    let frameId: number | null = null;
    const maxShift = 24;

    const onScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || 0;
        const shift = Math.max(-maxShift, Math.min(maxShift, scrollY * 0.06));
        setParallaxY(shift);
        frameId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }));
  };

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/service-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);

        setTimeout(() => {
          setIsSubmitted(false);
          setIsSubmitting(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            organization: "",
            subject: "",
            message: "",
          });
        }, 3000);
      } else {
        toast({
          title: "خطأ",
          description: data.message || "حدث خطأ أثناء إرسال البيانات",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Header />
      <main>
        {/* ===== HERO SECTION ===== */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate">
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(120% 60% at 50% 40%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.25) 100%), radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "100% 100%, 2px 2px",
              mixBlendMode: "soft-light",
            }}
          />

          <div
            className="absolute inset-0 z-[1] pointer-events-none flex items-center justify-start pl-8 sm:pl-12 lg:pl-20"
            style={{ transform: `translateY(${parallaxY}px)` }}
          >
            <img
              src={whiteIcon}
              alt=""
              aria-hidden="true"
              className="select-none opacity-[0.06] w-[35vw] max-w-[450px] animate-fade-in-down-soft [animation-delay:150ms] motion-reduce:animate-none"
            />
          </div>

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-20" />

          <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 sm:py-32">
            <div className="inline-block mb-8 animate-fade-in-down">
              <span className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium bg-primary/15 text-primary border border-primary/30 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 ml-2" />
                المساهمة في بناء القدرات الثقافية
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
              الخدمات
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:120ms]">
              نرافق الجهات والأفراد العاملين في القطاع الثقافي عبر ثلاثة مسارات
              متكاملة: المحتوى، والتصميم، والتعليم.
            </p>

            {/* Pillar quick-nav */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto animate-fade-in-up [animation-delay:240ms]">
              {PILLARS.map((pillar) => (
                <button
                  key={pillar.id}
                  onClick={() => scrollToId(pillar.id)}
                  className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-full ${pillar.bgClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <pillar.icon className={`h-6 w-6 ${pillar.textClass}`} />
                  </div>
                  <span className="text-white/90 text-sm font-semibold leading-snug">
                    {pillar.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:360ms]">
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-300"
                onClick={() => scrollToId("service-request-form")}
              >
                اطلب الخدمة
              </Button>
            </div>
          </div>
        </section>

        {/* ===== 01 — المحتوى الثقافي ===== */}
        <section
          id="content"
          ref={contentRef}
          className={`scroll-mt-16 py-20 sm:py-28 bg-background transition-all duration-1000 ${
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start">
              <div>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-chart-3 bg-chart-3/10 px-4 py-1.5 rounded-full mb-6">
                  الخدمة 01
                </span>
                <div className="w-16 h-16 rounded-2xl bg-chart-3/10 flex items-center justify-center mb-6">
                  <BookOpen className="h-8 w-8 text-chart-3" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-5">
                  المحتوى الثقافي
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  نُنتج محتوى معرفيًا متخصصًا يسهم في تطوير الممارسات المهنية في
                  القطاع الثقافي، من خلال إعداد المقالات والدراسات والتقارير
                  والأدلة والموارد المرجعية. وتركز الخدمة على نقل المعرفة،
                  وتوثيق التجارب، وتحويل الخبرات والممارسات إلى محتوى مهني
                  يدعم التعلم واتخاذ القرار وتطوير العمل الثقافي.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-5">
                  تشمل الخدمة:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CONTENT_ITEMS.map((item) => (
                    <div
                      key={item.number}
                      className="group p-6 rounded-xl bg-card border border-card-border hover:border-chart-3/40 hover:shadow-lg transition-all duration-300"
                    >
                      <span className="block text-3xl font-bold text-chart-3/25 group-hover:text-chart-3/40 transition-colors mb-3">
                        {item.number}
                      </span>
                      <h4 className="text-base font-bold text-foreground leading-relaxed">
                        {item.text}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 02 — التصميم الثقافي ===== */}
        <section
          id="design"
          ref={designRef}
          className={`scroll-mt-16 py-20 sm:py-28 bg-card transition-all duration-1000 ${
            designVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-start">
              <div className="order-2 lg:order-1">
                <h3 className="text-lg font-bold text-foreground mb-5">
                  تشمل الخدمة:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DESIGN_ITEMS.map((item) => (
                    <div
                      key={item.number}
                      className="group p-6 rounded-xl bg-background border border-card-border hover:border-chart-4/40 hover:shadow-lg transition-all duration-300"
                    >
                      <span className="block text-3xl font-bold text-chart-4/25 group-hover:text-chart-4/40 transition-colors mb-3">
                        {item.number}
                      </span>
                      <h4 className="text-base font-bold text-foreground leading-relaxed">
                        {item.text}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-chart-4 bg-chart-4/10 px-4 py-1.5 rounded-full mb-6">
                  الخدمة 02
                </span>
                <div className="w-16 h-16 rounded-2xl bg-chart-4/10 flex items-center justify-center mb-6">
                  <Palette className="h-8 w-8 text-chart-4" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-5">
                  التصميم الثقافي
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  نساعد الجهات على تحويل الأفكار والطموحات الثقافية إلى برامج
                  ومبادرات ومنتجات قابلة للتنفيذ والأثر. تشمل الخدمة تصميم
                  البرامج الثقافية والفعاليات النوعية، وتطوير المبادرات
                  والحلول الثقافية، وإعداد الأدلة المهنية والحقائب التدريبية،
                  وبناء النماذج التشغيلية التي تضمن وضوح الرؤية وجودة التنفيذ
                  واستدامة النتائج.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 03 — التعليم الثقافي ===== */}
        <section
          id="education"
          ref={educationRef}
          className={`scroll-mt-16 py-20 sm:py-28 bg-surface-warm transition-all duration-1000 ${
            educationVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-14">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-chart-2 bg-chart-2/10 px-4 py-1.5 rounded-full mb-6">
                الخدمة 03
              </span>
              <div className="w-16 h-16 rounded-2xl bg-chart-2/10 flex items-center justify-center mb-6">
                <GraduationCap className="h-8 w-8 text-chart-2" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-5">
                التعليم الثقافي
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                نعمل على تنمية القدرات المهنية للعاملين في القطاع الثقافي من
                خلال برامج تدريبية متخصصة وتجارب تعليمية تطبيقية تربط المعرفة
                بالممارسة. وتركز الخدمة على تأهيل الأفراد والفرق وتمكينهم من
                اكتساب المهارات والأدوات اللازمة لإدارة المشاريع والبرامج
                والمبادرات الثقافية بكفاءة واحترافية.
              </p>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-8">
              تشمل الخدمة:
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {EDUCATION_ITEMS.map((item) => (
                <div
                  key={item.number}
                  className="group p-6 rounded-xl bg-background border border-card-border hover:border-chart-2/40 hover:shadow-lg transition-all duration-300"
                >
                  <span className="block text-3xl font-bold text-chart-2/25 group-hover:text-chart-2/40 transition-colors mb-3">
                    {item.number}
                  </span>
                  <h4 className="text-base font-bold text-foreground leading-relaxed">
                    {item.text}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== نموذج طلب الخدمات ===== */}
        <section
          id="service-request-form"
          ref={formRef}
          className={`scroll-mt-16 py-20 sm:py-28 bg-background transition-all duration-1000 ${
            formVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card border border-card-border rounded-2xl p-8 lg:p-12">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  نموذج طلب الخدمات
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                  عرّفنا بطلبك وسيتواصل معك فريقنا لمناقشة التفاصيل والخطوات
                  القادمة
                </p>
              </div>

              {isSubmitted ? (
                <div className="max-w-md mx-auto text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-chart-2/10 rounded-full mb-6 motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:fade-in motion-safe:duration-500">
                    <Check className="h-10 w-10 text-chart-2" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    تم إرسال طلبك بنجاح!
                  </h3>
                  <p className="text-muted-foreground">
                    شكراً لك، سنتواصل معك قريباً
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className={labelClass}>
                        <User className="h-4 w-4 text-primary" />
                        الاسم
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="أدخل اسمك"
                        required
                        className={inputClass}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className={labelClass}>
                        <Mail className="h-4 w-4 text-primary" />
                        البريد الإلكتروني
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="أدخل بريدك الإلكتروني"
                        required
                        className={inputClass}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className={labelClass}>
                        <Phone className="h-4 w-4 text-primary" />
                        رقم الجوال
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="05xxxxxxxx"
                        required
                        className={inputClass}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization" className={labelClass}>
                        <Building2 className="h-4 w-4 text-primary" />
                        اسم الجهة
                      </Label>
                      <Input
                        id="organization"
                        name="organization"
                        type="text"
                        value={formData.organization}
                        onChange={handleInputChange}
                        placeholder="أدخل اسم جهتك"
                        required
                        className={inputClass}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className={labelClass}>
                      <Tag className="h-4 w-4 text-primary" />
                      الموضوع
                    </Label>
                    <Select
                      value={formData.subject}
                      onValueChange={handleSubjectChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={selectTriggerClass} id="subject">
                        <SelectValue placeholder="اختر الخدمة المطلوبة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="المحتوى الثقافي">المحتوى الثقافي</SelectItem>
                        <SelectItem value="التصميم الثقافي">التصميم الثقافي</SelectItem>
                        <SelectItem value="التعليم الثقافي">التعليم الثقافي</SelectItem>
                        <SelectItem value="أخرى">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className={labelClass}>
                      <MessageSquare className="h-4 w-4 text-primary" />
                      الطلب
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="صف طلبك أو احتياجك بالتفصيل"
                      required
                      rows={5}
                      className="text-base bg-card border-input text-foreground placeholder:text-muted-foreground focus:border-ring rounded-xl resize-none"
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-xl shadow-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        جاري الإرسال...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        إرسال الطلب
                      </div>
                    )}
                  </Button>
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
