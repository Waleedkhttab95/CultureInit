import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import whiteIcon from "@assets/white-icon.png";
import pdfFile from "@assets/program-brochure.pdf";
import pearsonLogo from "@assets/pearson-logo.jpg";
import aljaziraLogo from "@assets/aljazira-bank-logo.jpeg";
import alrajhiLogo from "@assets/alrajhi-humanitarian-logo.png";
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
  Briefcase,
  Clock,
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
    title: "إدارة المشاريع الثقافية",
    description: "من الفكرة إلى التنفيذ والتقييم.",
    icon: Briefcase,
  },
  {
    number: 5,
    title: "تسويق وتمويل الثقافة",
    description: "بناء خطط تسويق وشراكات ورعايات مستدامة.",
    icon: Megaphone,
  },
  {
    number: 6,
    title: "الوساطة الثقافية",
    description: "إدارة العلاقة بين المنتج الثقافي والجمهور.",
    icon: Users,
  },
  {
    number: 7,
    title: "إدارة المواهب الثقافية",
    description: "تصميم برامج اكتشاف وتنمية المواهب.",
    icon: Star,
  },
 
  
];

const TOOLS = [
  { label: "محاضرات تفاعلية وورش عمل", icon: Users },
  { label: "قراءة متخصصة", icon: BookOpen },
  { label: "سماع موجه", icon: Headphones },
  { label: "لقاءات خبراء", icon: Award },
  { label: "دراسات حالة", icon: FileText },
  { label: "تدريب تطبيقي", icon: Target },
];

const TIMELINE_STEPS = [
  { step: 1, phase: "التسجيل", date: "1 مارس – 4 أبريل" },
  { step: 2, phase: "الفرز", date: "5 أبريل – 10 أبريل" },
  { step: 3, phase: "المقابلات", date: "12 أبريل – 23 أبريل" },
  { step: 4, phase: "إعلان المقبولين", date: "26 أبريل" },
  { step: 5, phase: "مرحلة المقررات", date: "مايو – يونيو", hasCourses: true },
  { step: 6, phase: "تطوير مشروع التخرج", date: "يوليو" },
  { step: 7, phase: "التحكيم والتخرج", date: "أغسطس" },
];

const COURSES_SCHEDULE = [
  { name: "مدخل الإدارة الثقافية", date: "8-9 مايو" },
  { name: "اقتصاديات الثقافة", date: "15-16 مايو" },
  { name: "علم النفس الثقافي", date: "22-23 مايو" },
  { name: "إدارة المشاريع الثقافية", date: "5-6 يونيو" },
  { name: "تسويق وتمويل الثقافة", date: "12-13 يونيو" },
  { name: "الوساطة الثقافية", date: "19-20 يونيو" },
  { name: "إدارة المواهب الثقافية", date: "26-27 يونيو" },
];

const AUDIENCE = [
  "العاملين في الجهات الثقافية الحكومية والخاصة و غير الربحية",
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
  const { ref: accreditationRef, isVisible: accreditationVisible } = useScrollAnimation();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();
  const { ref: partnersRef, isVisible: partnersVisible } = useScrollAnimation();

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
            الثقافية.
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
                  text: "لقاءات خبراء",
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
                size="lg"
                disabled
                className="h-14 px-8 text-lg font-semibold bg-white/20 text-white/70 rounded-xl cursor-not-allowed"
              >
                تم إغلاق التسجيل
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
                صُمم للممارسين الحقيقيين في القطاع الثقافي والفاعلين فيه.
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

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
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
                الجدول الزمني للبرنامج
              </h2>
            </div>

            {/* Vertical timeline */}
            <div className="relative pr-8 sm:pr-0 sm:max-w-2xl sm:mx-auto">
              <div className="absolute right-[1.15rem] sm:right-auto sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-card-border" />

              <div className="space-y-8">
                {TIMELINE_STEPS.map((item) => (
                  <div key={item.step}>
                    <div className="relative flex items-start gap-4 sm:gap-6">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#0f172a] flex items-center justify-center text-white font-bold text-sm sm:text-lg z-10 border-4 border-background">
                        {item.step}
                      </div>
                      <div className="pt-1 sm:pt-2 flex-1">
                        <h4 className="text-foreground font-bold text-base sm:text-lg">
                          {item.phase}
                        </h4>
                        <span className="inline-block mt-1 text-xs sm:text-sm text-[#d4a574] font-medium bg-[#d4a574]/10 px-3 py-1 rounded-full">
                          {item.date}
                        </span>
                      </div>
                    </div>

                    {/* Courses table for step 5 */}
                    {item.hasCourses && (
                      <div className="mt-6 mr-14 sm:mr-20">
                        <div className="overflow-hidden rounded-xl border border-card-border">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-[#0f172a] text-white">
                                <th className="py-3 px-4 text-right font-semibold">المادة</th>
                                <th className="py-3 px-4 text-right font-semibold">التاريخ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {COURSES_SCHEDULE.map((course, idx) => (
                                <tr
                                  key={idx}
                                  className={idx % 2 === 0 ? "bg-background" : "bg-[#0f172a]/[0.03]"}
                                >
                                  <td className="py-3 px-4 text-foreground font-medium">
                                    {course.name}
                                  </td>
                                  <td className="py-3 px-4 text-muted-foreground">
                                    {idx === 0 && (
                                      <span className="block text-[#d4a574] text-xs font-medium mb-1">
                                        الجمعة والسبت
                                      </span>
                                    )}
                                    {course.date}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-[#d4a574]" />
                          <span>حضوريًا في الرياض</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Duration note */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#0f172a]/5 border border-[#0f172a]/10">
                <Clock className="h-5 w-5 text-[#0f172a]" />
                <span className="text-foreground font-semibold">
                  مدة البرنامج: مايو – أغسطس 2026
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ACCREDITATION ===== */}
        <section
          ref={accreditationRef}
          className={`py-20 sm:py-28 bg-[#f8f6f3] transition-all duration-1000 ${
            accreditationVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              اعتماد البرنامج
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              البرنامج معتمد من منظمة بيرسون البريطانية، لضمان توافق البرنامج مع
              معايير الجودة العالمية في التعليم المهني، وتعزيز فرص الاعتراف
              الدولي بالشهادة.
            </p>
            <div className="inline-flex items-center justify-center bg-white rounded-2xl px-10 py-6 shadow-sm border border-[#0f172a]/5">
              <img
                src={pearsonLogo}
                alt="Pearson"
                className="h-12 sm:h-16 w-auto"
              />
            </div>
          </div>
        </section>

        {/* ===== PARTNERS ===== */}
        <section
          ref={partnersRef}
          className={`py-20 sm:py-28 bg-background transition-all duration-1000 ${
            partnersVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-14">
              شركاء البرنامج
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-14 sm:gap-20">
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-semibold text-[#d4a574]">الشريك الاستراتيجي</span>
                <img
                  src={aljaziraLogo}
                  alt="بنك الجزيرة"
                  className="h-40 sm:h-52 w-auto"
                />
              </div>
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-semibold text-[#d4a574]">الشريك الماسي</span>
                <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-[#0f172a]/5">
                  <img
                    src={alrajhiLogo}
                    alt="الراجحي الإنسانية"
                    className="h-10 sm:h-12 w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section
          ref={ctaRef}
          className={`py-20 sm:py-28 transition-all duration-1000 ${
            ctaVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          style={{ backgroundColor: "#0f172a" }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              تم إغلاق التسجيل
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              شكراً لاهتمامكم، تم إغلاق باب التسجيل في البرنامج. ترقبوا البرامج القادمة
            </p>
            <Button
              size="lg"
              disabled
              className="h-14 px-12 text-lg font-semibold bg-white/20 text-white/70 rounded-xl cursor-not-allowed"
            >
              التسجيل مغلق
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
