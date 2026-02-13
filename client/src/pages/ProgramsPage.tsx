import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useRef } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import whiteIcon from "@assets/white-icon.png";
import pdfFile from "@assets/download.pdf";
import {
  BookOpen,
  Award,
  Users,
  GraduationCap,
  TrendingUp,
  Lightbulb,
  Star,
  Megaphone,
  Headphones,
  MapPin,
  Target,
  Check,
  Send,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MessageSquare,
  Clock,
  ArrowDown,
  Sparkles,
  FileText,
  Download,
} from "lucide-react";

const COURSES = [
  {
    number: 1,
    title: "مدخل إلى الإدارة الثقافية",
    description: "فهم المنظومة الثقافية، والحوكمة، والتخطيط الاستراتيجي.",
    icon: BookOpen,
  },
  {
    number: 2,
    title: "اقتصاديات الثقافة",
    description: "نماذج التمويل، والاستدامة، والمؤشرات الاقتصادية.",
    icon: TrendingUp,
  },
  {
    number: 3,
    title: "علم النفس الثقافي",
    description: "سلوك الجمهور، وطرق التأثير، وبناء الحملات الثقافية المؤثرة.",
    icon: Lightbulb,
  },
  {
    number: 4,
    title: "الوساطة الثقافية",
    description: "إدارة العلاقة بين المنتج الثقافي والجمهور.",
    icon: Users,
  },
  {
    number: 5,
    title: "إدارة المواهب الثقافية",
    description: "تصميم برامج اكتشاف وتنمية المواهب.",
    icon: Star,
  },
  {
    number: 6,
    title: "إدارة المشاريع الثقافية",
    description: "من الفكرة إلى التنفيذ والتقييم.",
    icon: Briefcase,
  },
  {
    number: 7,
    title: "تسويق وتمويل الثقافة",
    description: "بناء خطط تسويق وشراكات ورعايات مستدامة.",
    icon: Megaphone,
  },
];

const TOOLS = [
  { label: "محاضرات تفاعلية وورش عمل", icon: Users },
  { label: "قراءة متخصصة", icon: BookOpen },
  { label: "سماع موجه", icon: Headphones },
  { label: "لقاءات خبراء", icon: Award },
  { label: "دراسات حالة", icon: FileText },
  { label: "زيارات ميدانية", icon: MapPin },
  { label: "تدريب تطبيقي", icon: Target },
];

const TIMELINE = [
  { step: 1, phase: "التسجيل", duration: "" },
  { step: 2, phase: "الفرز", duration: "" },
  { step: 3, phase: "إعلان القبول", duration: "" },
  { step: 4, phase: "لقاءات معرفية مكثفة", duration: "شهران" },
  { step: 5, phase: "تطوير مشروع التخرج", duration: "شهر" },
  { step: 6, phase: "إشراف وتحكيم وتخرج", duration: "شهران" },
];

const AUDIENCE = [
  "العاملين في الجهات الثقافية الحكومية والخاصة",
  "مديري المبادرات والبرامج الثقافية",
  "المستقلين ومؤسسي المشاريع الثقافية",
  "المهتمين بتطوير مسار مهني احترافي في الثقافة",
];

export default function ProgramsPage() {
  const [parallaxY, setParallaxY] = useState(0);
  const reduceMotionRef = useRef(false);

  const { ref: whyRef, isVisible: whyVisible } = useScrollAnimation();
  const { ref: whoRef, isVisible: whoVisible } = useScrollAnimation();
  const { ref: learnRef, isVisible: learnVisible } = useScrollAnimation();
  const { ref: toolsRef, isVisible: toolsVisible } = useScrollAnimation();
  const { ref: timelineRef, isVisible: timelineVisible } = useScrollAnimation();
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    jobTitle: "",
    reason: "",
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

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/program/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            organization: "",
            jobTitle: "",
            reason: "",
          });
        }, 3000);
      } else {
        const data = await response.json();
        alert(data.message || "حدث خطأ أثناء إرسال البيانات");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Header />
      <main>
        {/* ===== HERO SECTION ===== */}
        <section
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#0f172a" }}
        >
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

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4a574] to-transparent z-20" />

          <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 sm:py-32">
            {/* Badge */}
            <div className="inline-block mb-8 animate-fade-in-down">
              <span className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium bg-[#d4a574]/15 text-[#d4a574] border border-[#d4a574]/30 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 ml-2" />
                الدفعة الرائدة – أول شهادة مهنية متخصصة في الإدارة الثقافية في
                المملكة
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
              ممارس الإدارة الثقافية
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl lg:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:120ms]">
              برنامج تأهيلي عملي لتطوير مهارات تصميم وإدارة المشاريع والمنظمات
              الثقافية وفق أعلى الممارسات العالمية.
            </p>

            {/* Quick bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto animate-fade-in-up [animation-delay:240ms]">
              {[
                {
                  icon: BookOpen,
                  text: "7 مقررات معرفية وتطبيقية متكاملة",
                },
                {
                  icon: Award,
                  text: "مشروع تخرج بإشراف وتحكيم مهني",
                },
                {
                  icon: Users,
                  text: "لقاءات خبراء وزيارات ميدانية",
                },
                {
                  icon: GraduationCap,
                  text: "شهادة مهنية معتمدة",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <item.icon className="h-6 w-6 text-[#d4a574]" />
                  <span className="text-white/90 text-sm leading-snug">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:360ms]">
              <Button
                onClick={scrollToForm}
                size="lg"
                className="h-14 px-8 text-lg font-semibold bg-[#d4a574] hover:bg-[#c49564] text-[#0f172a] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <ArrowDown className="h-5 w-5" />
                قدّم طلبك الآن
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg font-semibold border-2 border-white/30 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                asChild
              >
                <a href={pdfFile} download="دليل_ممارس_الإدارة_الثقافية.pdf">
                  <Download className="h-5 w-5" />
                  تحميل الدليل التعريفي
                </a>
              </Button>
            </div>
          </div>

          <div className="absolute top-20 right-20 w-64 h-64 bg-[#d4a574]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-400/5 rounded-full blur-3xl" />
        </section>

        {/* ===== WHY THIS PROGRAM ===== */}
        <section
          ref={whyRef}
          className={`py-20 sm:py-28 bg-background transition-all duration-1000 ${
            whyVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-10">
              لماذا هذا البرنامج؟
            </h2>

            <blockquote className="relative text-2xl sm:text-3xl font-bold text-primary leading-relaxed mb-10 px-8">
              <span className="absolute top-0 right-0 text-6xl text-primary/20 leading-none select-none">
                &ldquo;
              </span>
              القطاع الثقافي ينمو؛ فهل تنمو أدواتك معه؟
              <span className="absolute bottom-0 left-0 text-6xl text-primary/20 leading-none select-none">
                &rdquo;
              </span>
            </blockquote>

            <div className="space-y-4 max-w-3xl mx-auto">
              <p className="text-lg text-muted-foreground leading-relaxed">
                مع توسع المبادرات الثقافية في المملكة، تزداد الحاجة إلى كوادر
                قادرة على إدارة الثقافة باحترافية، وليس بالشغف وحده.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                صُمم برنامج &ldquo;ممارس الإدارة الثقافية&rdquo; لسد الفجوة بين
                الإبداع والإدارة، وبين الفكرة والاستدامة.
              </p>
            </div>
          </div>
        </section>

        {/* ===== WHO IS THIS FOR ===== */}
        <section
          ref={whoRef}
          className={`py-20 sm:py-28 bg-card transition-all duration-1000 ${
            whoVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                لمن هذا البرنامج؟
              </h2>
              <p className="text-lg text-primary font-semibold">
                صُمم للممارسين الحقيقيين في القطاع الثقافي والفاعلين فيه!
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {AUDIENCE.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-6 rounded-xl bg-background border border-card-border hover:border-primary/30 transition-colors duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-foreground text-lg leading-relaxed pt-1.5">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== WHAT WILL YOU LEARN ===== */}
        <section
          ref={learnRef}
          className={`py-20 sm:py-28 bg-background transition-all duration-1000 ${
            learnVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                ماذا ستتعلم؟
              </h2>
              <p className="text-lg text-muted-foreground">
                7 مقررات معرفية وتطبيقية
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {COURSES.map((course) => (
                <div
                  key={course.number}
                  className="group relative p-6 rounded-xl bg-card border border-card-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#0f172a] flex items-center justify-center">
                      <course.icon className="h-6 w-6 text-[#d4a574]" />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground">
                      {course.number.toString().padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {course.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Graduation Project */}
            <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#d4a574]/20 mb-6">
                <Award className="h-8 w-8 text-[#d4a574]" />
              </div>
              <h3 className="text-xl font-bold mb-3">مشروع التخرج</h3>
              <p className="text-white/80 leading-relaxed">
                يقوم المشارك بتقديم مشروع تخرج تطبيقي يوظف فيه معارفه ومهاراته
                التي اكتسبها من البرنامج.
              </p>
            </div>
          </div>
        </section>

        {/* ===== PROGRAM TOOLS ===== */}
        <section
          ref={toolsRef}
          className={`py-20 sm:py-28 bg-card transition-all duration-1000 ${
            toolsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                أدوات البرنامج
              </h2>
              <p className="text-lg text-muted-foreground">
                تجربة تعليمية تطبيقية متكاملة
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {TOOLS.map((tool, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-4 p-6 rounded-xl bg-background border border-card-border hover:border-primary/30 hover:shadow-md transition-all duration-300 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <tool.icon className="h-7 w-7 text-primary" />
                  </div>
                  <span className="text-foreground font-medium text-sm leading-snug">
                    {tool.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TIMELINE ===== */}
        <section
          ref={timelineRef}
          className={`py-20 sm:py-28 bg-background transition-all duration-1000 ${
            timelineVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                مسار البرنامج الزمني
              </h2>
            </div>

            {/* Desktop timeline */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute top-8 right-0 left-0 h-0.5 bg-card-border" />

                <div className="grid grid-cols-6 gap-4">
                  {TIMELINE.map((item) => (
                    <div
                      key={item.step}
                      className="relative flex flex-col items-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#0f172a] flex items-center justify-center text-white font-bold text-lg z-10 border-4 border-background">
                        {item.step}
                      </div>
                      <h4 className="mt-4 text-foreground font-bold text-center text-sm">
                        {item.phase}
                      </h4>
                      {item.duration && (
                        <span className="mt-2 text-xs text-[#d4a574] font-medium bg-[#d4a574]/10 px-3 py-1 rounded-full">
                          {item.duration}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile timeline */}
            <div className="lg:hidden">
              <div className="relative pr-8">
                <div className="absolute right-[1.15rem] top-0 bottom-0 w-0.5 bg-card-border" />

                <div className="space-y-8">
                  {TIMELINE.map((item) => (
                    <div
                      key={item.step}
                      className="relative flex items-start gap-6"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0f172a] flex items-center justify-center text-white font-bold text-sm z-10 border-4 border-background">
                        {item.step}
                      </div>
                      <div className="pt-1">
                        <h4 className="text-foreground font-bold">
                          {item.phase}
                        </h4>
                        {item.duration && (
                          <span className="inline-block mt-1 text-xs text-[#d4a574] font-medium bg-[#d4a574]/10 px-3 py-1 rounded-full">
                            {item.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Duration note */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#0f172a]/5 border border-[#0f172a]/10">
                <Clock className="h-5 w-5 text-[#0f172a]" />
                <span className="text-foreground font-semibold">
                  مدة البرنامج: تقريبًا 5–6 أشهر
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== REGISTRATION FORM ===== */}
        <section
          ref={formRef}
          id="registration"
          className={`py-20 sm:py-28 transition-all duration-1000 ${
            formVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          style={{ backgroundColor: "#0f172a" }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                قدّم طلبك الآن
              </h2>
              <p className="text-white/70">
                سجّل بياناتك وسنتواصل معك قريباً
              </p>
            </div>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6 animate-bounce">
                  <Check className="h-10 w-10 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  تم إرسال طلبك بنجاح!
                </h3>
                <p className="text-white/70">
                  شكراً لك، سنتواصل معك قريباً
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-name"
                      className="text-sm font-semibold text-white/90 flex items-center gap-2"
                    >
                      <User className="h-4 w-4 text-[#d4a574]" />
                      الاسم الكامل
                    </Label>
                    <Input
                      id="reg-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="أدخل اسمك الكامل"
                      required
                      className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#d4a574] rounded-xl"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-email"
                      className="text-sm font-semibold text-white/90 flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4 text-[#d4a574]" />
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="reg-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                      className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#d4a574] rounded-xl"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-phone"
                      className="text-sm font-semibold text-white/90 flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4 text-[#d4a574]" />
                      رقم الجوال
                    </Label>
                    <Input
                      id="reg-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="05xxxxxxxx"
                      required
                      className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#d4a574] rounded-xl"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Organization */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-organization"
                      className="text-sm font-semibold text-white/90 flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4 text-[#d4a574]" />
                      جهة العمل
                    </Label>
                    <Input
                      id="reg-organization"
                      name="organization"
                      type="text"
                      value={formData.organization}
                      onChange={handleInputChange}
                      placeholder="أدخل جهة عملك"
                      required
                      className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#d4a574] rounded-xl"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Job Title */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-jobTitle"
                      className="text-sm font-semibold text-white/90 flex items-center gap-2"
                    >
                      <Briefcase className="h-4 w-4 text-[#d4a574]" />
                      المسمى الوظيفي
                    </Label>
                    <Input
                      id="reg-jobTitle"
                      name="jobTitle"
                      type="text"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="أدخل مسماك الوظيفي"
                      required
                      className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#d4a574] rounded-xl"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Reason */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-reason"
                      className="text-sm font-semibold text-white/90 flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4 text-[#d4a574]" />
                      لماذا ترغب بالانضمام؟
                    </Label>
                    <Textarea
                      id="reg-reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      placeholder="اكتب سبب رغبتك بالانضمام للبرنامج"
                      required
                      rows={4}
                      className="text-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#d4a574] rounded-xl resize-none"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-lg font-semibold bg-[#d4a574] hover:bg-[#c49564] text-[#0f172a] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-[#0f172a]/30 border-t-[#0f172a] rounded-full animate-spin" />
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
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
