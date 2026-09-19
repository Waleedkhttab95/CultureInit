import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useCopy } from "@/i18n/locale";
import { Link } from "wouter";
import whiteIcon from "@assets/white-icon.png";
import pdfFile from "@assets/program-guide-batch-2.pdf";
import pearsonLogo from "@assets/pearson-logo.jpg";
import cmprBadge from "@assets/cmp-accreditation-logo.png";
import aljaziraLogo from "@assets/aljazira-bank-logo.jpeg";
import kaplLogo from "@assets/kapl-library-logo.webp";
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

const COPY = {
  ar: {
    badge: "الدفعة الثانية – أول شهادة مهنية متخصصة في الإدارة الثقافية في المملكة",
    programName: "ممارس الإدارة الثقافية",
    heroSub: "برنامج تأهيلي عملي لتطوير مهارات تصميم وإدارة المشاريع والمنظمات الثقافية.",
    bullets: ["7 مقررات معرفية وتطبيقية متكاملة", "مشروع تخرج بإشراف وتحكيم مهني", "لقاءات خبراء", "شهادة مهنية معتمدة"],
    apply: "قدّم طلبك الآن",
    guide: "تحميل الدليل التعريفي",
    whyH: "لماذا هذا البرنامج؟",
    quote: "القطاع الثقافي ينمو؛ فهل تنمو أدواتك معه؟",
    why1: "مع توسع المبادرات الثقافية في المملكة، تزداد الحاجة إلى كوادر قادرة على إدارة الثقافة باحترافية، وليس بالشغف وحده.",
    why2a: "صُمم برنامج ",
    why2b: "ممارس الإدارة الثقافية",
    why2c: " لسد الفجوة بين الإبداع والإدارة، وبين الفكرة والاستدامة.",
    whoH: "لمن هذا البرنامج؟",
    whoSub: "صُمم للممارسين الحقيقيين في القطاع الثقافي والفاعلين فيه.",
    audience: ["العاملين في الجهات الثقافية الحكومية والخاصة و غير الربحية", "مديري المبادرات والبرامج الثقافية", "المستقلين ومؤسسي المشاريع الثقافية", "المهتمين بتطوير مسار مهني احترافي في الثقافة"],
    learnH: "ماذا ستتعلم؟",
    learnSub: "7 مقررات معرفية وتطبيقية",
    courses: [
      { title: "مدخل إلى الإدارة الثقافية", description: "فهم المنظومة الثقافية، والحوكمة، والتخطيط الاستراتيجي." },
      { title: "اقتصاديات الثقافة", description: "نماذج التمويل، والاستدامة، والمؤشرات الاقتصادية." },
      { title: "علم النفس الثقافي", description: "سلوك الجمهور، وطرق التأثير، وبناء الحملات الثقافية المؤثرة." },
      { title: "إدارة المشاريع الثقافية", description: "من الفكرة إلى التنفيذ والتقييم." },
      { title: "تسويق وتمويل الثقافة", description: "بناء خطط تسويق وشراكات ورعايات مستدامة." },
      { title: "الوساطة الثقافية", description: "إدارة العلاقة بين المنتج الثقافي والجمهور." },
      { title: "إدارة المواهب الثقافية", description: "تصميم برامج اكتشاف وتنمية المواهب." },
    ],
    gradH: "مشروع التخرج",
    gradP: "يقوم المشارك بتقديم مشروع تخرج تطبيقي يوظف فيه معارفه ومهاراته التي اكتسبها من البرنامج.",
    toolsH: "أدوات البرنامج",
    toolsSub: "تجربة تعليمية تطبيقية متكاملة",
    tools: ["محاضرات تفاعلية وورش عمل", "قراءة متخصصة", "سماع موجه", "لقاءات خبراء", "دراسات حالة", "تدريب تطبيقي"],
    timeH: "الجدول الزمني للبرنامج",
    timeline: [
      { phase: "فتح التسجيل", date: "8 سبتمبر" },
      { phase: "إغلاق التسجيل", date: "22 سبتمبر" },
      { phase: "فرز الطلبات والمقابلات", date: "22 سبتمبر – 6 أكتوبر" },
      { phase: "استكمال السداد وتأكيد القبول", date: "7 – 12 أكتوبر" },
      { phase: "مرحلة المقررات", date: "أكتوبر – نوفمبر" },
      { phase: "مناقشة مشاريع التخرج", date: "12 ديسمبر" },
      { phase: "الحفل الختامي", date: "30 ديسمبر" },
    ],
    caption: "جدول مواد البرنامج والأساتذة ومواعيدها",
    thCourse: "المقرر",
    thInstructor: "الأستاذ",
    thDate: "التاريخ",
    fridaySat: "الجمعة والسبت",
    inPerson: "حضوريًا في الرياض",
    schedule: [
      { name: "مدخل إلى الإدارة الثقافية", instructor: "طارق الخواجي", date: "16-17 أكتوبر" },
      { name: "اقتصاديات الثقافة", instructor: "د. علي الحازمي", date: "23-24 أكتوبر" },
      { name: "الوساطة الثقافية", instructor: "عبد الرحمن لاهي", date: "30-31 أكتوبر" },
      { name: "إدارة المشاريع الثقافية", instructor: "عبدالكريم الخليفي", date: "6-7 نوفمبر" },
      { name: "تسويق وتمويل الثقافة", instructor: "تركي عبدالرحمن الخلف", date: "13-14 نوفمبر" },
      { name: "علم النفس الثقافي", instructor: "د. هيلة السليم", date: "20-21 نوفمبر" },
      { name: "إدارة المواهب الثقافية", instructor: "د. علا العلوان", date: "27-28 نوفمبر" },
    ],
    duration: "مدة البرنامج: أكتوبر – ديسمبر 2026",
    accH: "اعتماد البرنامج",
    accP: "البرنامج معتمد من منظمة بيرسون البريطانية، لضمان توافق البرنامج مع معايير الجودة العالمية في التعليم المهني، وتعزيز فرص الاعتراف الدولي بالشهادة.",
    badgeAlt: "شارة ممارس الإدارة الثقافية المعتمدة — Cultural Management Practitioner (CMPr)",
    partnersH: "شركاء البرنامج",
    strategic: "الشريك الاستراتيجي",
    hosting: "شريك الاستضافة",
    aljaziraAlt: "بنك الجزيرة",
    kaplAlt: "مكتبة الملك عبدالعزيز العامة",
    ctaH: "قدّم طلبك الآن",
    ctaP: "سجّل الآن وانضم للدفعة الثانية من قادة الإدارة الثقافية",
    ctaBtn: "سجّل الآن",
  },
  en: {
    badge: "Second cohort – the first specialized professional certificate in cultural management in the Kingdom",
    programName: "Cultural Management Practitioner",
    heroSub: "A hands-on qualification program that builds the skills to design and manage cultural projects and organizations.",
    bullets: ["7 integrated knowledge and practical courses", "A graduation project with professional supervision and evaluation", "Expert meetings", "An accredited professional certificate"],
    apply: "Apply now",
    guide: "Download the program guide (Arabic)",
    whyH: "Why this program?",
    quote: "The cultural sector is growing — are your tools growing with it?",
    why1: "As cultural initiatives expand across the Kingdom, the need grows for professionals who can manage culture with expertise, not passion alone.",
    why2a: "The ",
    why2b: "Cultural Management Practitioner",
    why2c: " program was designed to bridge the gap between creativity and management, and between an idea and its sustainability.",
    whoH: "Who is this program for?",
    whoSub: "Designed for real practitioners in the cultural sector and those active in it.",
    audience: ["Professionals working in government, private and non-profit cultural organizations", "Managers of cultural initiatives and programs", "Freelancers and founders of cultural projects", "Anyone looking to build a professional career in culture"],
    learnH: "What will you learn?",
    learnSub: "7 knowledge and practical courses",
    courses: [
      { title: "Introduction to Cultural Management", description: "Understanding the cultural ecosystem, governance and strategic planning." },
      { title: "Economics of Culture", description: "Funding models, sustainability and economic indicators." },
      { title: "Cultural Psychology", description: "Audience behavior, methods of influence and building impactful cultural campaigns." },
      { title: "Cultural Project Management", description: "From idea to implementation and evaluation." },
      { title: "Marketing and Financing Culture", description: "Building sustainable marketing plans, partnerships and sponsorships." },
      { title: "Cultural Mediation", description: "Managing the relationship between the cultural product and the audience." },
      { title: "Cultural Talent Management", description: "Designing talent discovery and development programs." },
    ],
    gradH: "Graduation project",
    gradP: "Participants deliver an applied graduation project in which they put into practice the knowledge and skills gained from the program.",
    toolsH: "Program tools",
    toolsSub: "An integrated, applied learning experience",
    tools: ["Interactive lectures and workshops", "Specialized reading", "Guided listening", "Expert meetings", "Case studies", "Applied training"],
    timeH: "Program timeline",
    timeline: [
      { phase: "Registration opens", date: "8 September" },
      { phase: "Registration closes", date: "22 September" },
      { phase: "Application screening and interviews", date: "22 September – 6 October" },
      { phase: "Payment completion and confirmation of admission", date: "7 – 12 October" },
      { phase: "Courses phase", date: "October – November" },
      { phase: "Graduation project defense", date: "12 December" },
      { phase: "Closing ceremony", date: "30 December" },
    ],
    caption: "Table of program courses, instructors and dates",
    thCourse: "Course",
    thInstructor: "Instructor",
    thDate: "Date",
    fridaySat: "Friday and Saturday",
    inPerson: "In person in Riyadh",
    schedule: [
      { name: "Introduction to Cultural Management", instructor: "طارق الخواجي", date: "16–17 October" },
      { name: "Economics of Culture", instructor: "د. علي الحازمي", date: "23–24 October" },
      { name: "Cultural Mediation", instructor: "عبد الرحمن لاهي", date: "30–31 October" },
      { name: "Cultural Project Management", instructor: "عبدالكريم الخليفي", date: "6–7 November" },
      { name: "Marketing and Financing Culture", instructor: "تركي عبدالرحمن الخلف", date: "13–14 November" },
      { name: "Cultural Psychology", instructor: "د. هيلة السليم", date: "20–21 November" },
      { name: "Cultural Talent Management", instructor: "د. علا العلوان", date: "27–28 November" },
    ],
    duration: "Program duration: October – December 2026",
    accH: "Program accreditation",
    accP: "The program is accredited by the British organization Pearson, ensuring alignment with global quality standards in professional education and improving the chances of international recognition of the certificate.",
    badgeAlt: "Accredited Cultural Management Practitioner (CMPr) badge",
    partnersH: "Program partners",
    strategic: "Strategic partner",
    hosting: "Hosting partner",
    aljaziraAlt: "Bank AlJazira",
    kaplAlt: "King Abdulaziz Public Library",
    ctaH: "Apply now",
    ctaP: "Register now and join the second cohort of cultural management leaders",
    ctaBtn: "Register now",
  },
};

const COURSE_ICONS = [BookOpen, TrendingUp, Lightbulb, Briefcase, Megaphone, Users, Star];
const TOOL_ICONS = [Users, BookOpen, Headphones, Award, FileText, Target];
const BULLET_ICONS = [BookOpen, Award, Users, GraduationCap];

export default function ProgramsPage() {
  const c = useCopy(COPY);
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
      <SEO page="programs" />
      <Header />
      <main>
        {/* ===== HERO SECTION ===== */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate">
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
            className="absolute inset-0 z-[1] pointer-events-none flex items-center justify-start pe-8 sm:pe-12 lg:pe-20"
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
            {/* Badge */}
            <div className="inline-block mb-8 animate-fade-in-down">
              <span className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium bg-primary/15 text-primary border border-primary/30 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 me-2" />
                {c.badge}
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
              {c.programName}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl lg:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:120ms]">
              {c.heroSub}
            </p>

            {/* Quick bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto animate-fade-in-up [animation-delay:240ms]">
              {c.bullets.map((text, i) => ({ icon: BULLET_ICONS[i], text })).map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <item.icon className="h-6 w-6 text-primary" />
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
                className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link href="/programs/register">{c.apply}</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg font-semibold border-2 border-white/30 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                asChild
              >
                <a href={pdfFile} download="دليل الدفعة الثانية لبرنامج ممارس الإدارة الثقافية.pdf">
                  <Download className="h-5 w-5" />
                  {c.guide}
                </a>
              </Button>
            </div>
          </div>

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
              {c.whyH}
            </h2>

            <blockquote className="relative text-2xl sm:text-3xl font-bold text-primary leading-relaxed mb-10 px-8">
              <span className="absolute top-0 start-0 text-6xl text-primary/20 leading-none select-none">
                &ldquo;
              </span>
              {c.quote}
              <span className="absolute bottom-0 end-0 text-6xl text-primary/20 leading-none select-none">
                &rdquo;
              </span>
            </blockquote>

            <div className="space-y-4 max-w-3xl mx-auto">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {c.why1}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {c.why2a}&ldquo;{c.why2b}&rdquo;{c.why2c}
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
                {c.whoH}
              </h2>
              <p className="text-lg text-primary font-semibold">
                {c.whoSub}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {c.audience.map((item, i) => (
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
                {c.learnH}
              </h2>
              <p className="text-lg text-muted-foreground">
                {c.learnSub}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {c.courses.map((course, idx) => (
                <div
                  key={idx}
                  className="group relative p-6 rounded-xl bg-card border border-card-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate flex items-center justify-center">
                      {(() => { const Icon = COURSE_ICONS[idx]; return <Icon className="h-6 w-6 text-primary" />; })()}
                    </div>
                    <span className="text-sm font-bold text-muted-foreground">
                      {String(idx + 1).padStart(2, "0")}
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
            <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-slate to-slate-light text-slate-foreground text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{c.gradH}</h3>
              <p className="text-white/80 leading-relaxed">
                {c.gradP}
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
                {c.toolsH}
              </h2>
              <p className="text-lg text-muted-foreground">
                {c.toolsSub}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {c.tools.map((label, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-4 p-6 rounded-xl bg-background border border-card-border hover:border-primary/30 hover:shadow-md transition-all duration-300 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    {(() => { const Icon = TOOL_ICONS[i]; return <Icon className="h-7 w-7 text-primary" />; })()}
                  </div>
                  <span className="text-foreground font-medium text-sm leading-snug">
                    {label}
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
                {c.timeH}
              </h2>
            </div>

            {/* Vertical timeline */}
            <div className="relative pe-8 sm:pe-0 sm:max-w-2xl sm:mx-auto">
              <div className="absolute end-[1.15rem] sm:end-auto sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-card-border" />

              <div className="space-y-8">
                {c.timeline.map((item, stepIdx) => (
                  <div key={stepIdx}>
                    <div className="relative flex items-start gap-4 sm:gap-6">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-slate flex items-center justify-center text-slate-foreground font-bold text-sm sm:text-lg z-10 border-4 border-background">
                        {stepIdx + 1}
                      </div>
                      <div className="pt-1 sm:pt-2 flex-1">
                        <h4 className="text-foreground font-bold text-base sm:text-lg">
                          {item.phase}
                        </h4>
                        <span className="inline-block mt-1 text-xs sm:text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
                          {item.date}
                        </span>
                      </div>
                    </div>

                    {/* Courses schedule nested under "مرحلة المقررات" */}
                    {stepIdx === 4 && (
                      <div className="relative z-10 mt-5 pe-14 sm:pe-20">
                        <div className="overflow-x-auto rounded-xl border border-card-border bg-background">
                          <table className="w-full text-sm min-w-[480px]">
                            <caption className="sr-only">
                              {c.caption}
                            </caption>
                            <thead>
                              <tr className="bg-slate text-slate-foreground">
                                <th scope="col" className="py-3 px-4 text-start font-semibold">{c.thCourse}</th>
                                <th scope="col" className="py-3 px-4 text-start font-semibold">{c.thInstructor}</th>
                                <th scope="col" className="py-3 px-4 text-start font-semibold whitespace-nowrap">{c.thDate}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {c.schedule.map((course, idx) => (
                                <tr
                                  key={idx}
                                  className={idx % 2 === 0 ? "bg-background" : "bg-slate/[0.03]"}
                                >
                                  <td className="py-3 px-4 text-foreground font-medium">
                                    {course.name}
                                  </td>
                                  <td lang="ar" className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                                    {course.instructor}
                                  </td>
                                  <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                                    {idx === 0 && (
                                      <span className="block text-primary text-xs font-medium mb-1">
                                        {c.fridaySat}
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
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{c.inPerson}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Duration note */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate/5 border border-slate/10">
                <Clock className="h-5 w-5 text-slate" />
                <span className="text-foreground font-semibold">
                  {c.duration}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ACCREDITATION ===== */}
        <section
          ref={accreditationRef}
          className={`py-20 sm:py-28 bg-surface-warm transition-all duration-1000 ${
            accreditationVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              {c.accH}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              {c.accP}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              <div className="inline-flex items-center justify-center bg-white rounded-2xl px-10 py-6 shadow-sm border border-slate/10">
                <img
                  src={pearsonLogo}
                  alt="Pearson"
                  className="h-12 sm:h-16 w-auto"
                  loading="lazy"
                />
              </div>
              <img
                src={cmprBadge}
                alt={c.badgeAlt}
                className="h-28 sm:h-36 w-auto"
                loading="lazy"
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
              {c.partnersH}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-14 sm:gap-20">
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-semibold text-primary">{c.strategic}</span>
                <img
                  src={aljaziraLogo}
                  alt={c.aljaziraAlt}
                  className="h-40 sm:h-52 w-auto"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-semibold text-primary">{c.hosting}</span>
                <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate/10">
                  <img
                    src={kaplLogo}
                    alt={c.kaplAlt}
                    className="h-12 sm:h-16 w-auto"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section
          ref={ctaRef}
          className={`py-20 sm:py-28 bg-slate transition-all duration-1000 ${
            ctaVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {c.ctaH}
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              {c.ctaP}
            </p>
            <Button
              size="lg"
              className="h-14 px-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link href="/programs/register">
                <Send className="h-5 w-5" />
                {c.ctaBtn}
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
