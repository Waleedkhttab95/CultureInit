import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { useEffect, useState, useRef } from "react";
import whiteIcon from "@assets/white-icon.png";
import resourcesIcon from "@assets/Asset7@4x.png";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Link } from "wouter";
import ResourceDownloadDialog from "@/components/ResourceDownloadDialog";
import resourcesData from "@/data/resources.json";
import { PAGES } from "@shared/seo";
import { useCopy, resourceHref } from "@/i18n/locale";

const COPY = {
  ar: {
    title: "الموارد",
    intro: PAGES.resources.meta.ar.description,
    arabicNote: "",
    download: "تحميل الدليل",
  },
  en: {
    title: "Resources",
    intro: PAGES.resources.meta.en.description,
    arabicNote: "Our guides are published in Arabic.",
    download: "Download the guide",
  },
};

export default function ResourcesPage() {
  const c = useCopy(COPY);
  const [parallaxY, setParallaxY] = useState(0);
  const reduceMotionRef = useRef(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeResource, setActiveResource] = useState<typeof resourcesData[number] | null>(null);

  useEffect(() => {
    // Respect reduced motion
    if (typeof window !== 'undefined') {
      try {
        reduceMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      } catch {}
    }

    if (reduceMotionRef.current) return;

    let frameId: number | null = null;
    const maxShift = 24; // px

    const onScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || 0;
        const shift = Math.max(-maxShift, Math.min(maxShift, scrollY * 0.06));
        setParallaxY(shift);
        frameId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleDownloadClick = (resource: typeof resourcesData[number]) => {
    setActiveResource(resource);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <SEO page="resources" />
      <Header />
      <main
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          // Brand hero gradient: identity orange → cultural green, driven by design tokens.
          backgroundImage:
            'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--chart-2)) 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>

        {/* Subtle vignette + grain overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(120% 60% at 50% 40%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.25) 100%), radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "100% 100%, 2px 2px",
            mixBlendMode: "soft-light",
          }}
        />

        {/* White logo watermark as background */}
        <div
          className="absolute inset-0 z-10 pointer-events-none flex items-center justify-start pe-8 sm:pe-12 lg:pe-20"
          style={{ transform: `translateY(${parallaxY}px)` }}
        >
          <img
            src={whiteIcon}
            alt=""
            aria-hidden="true"
            className="select-none opacity-10 mix-blend-soft-light w-[35vw] max-w-[450px] drop-shadow-[0_0_24px_rgba(255,255,255,0.25)] animate-fade-in-down-soft [animation-delay:150ms] motion-reduce:animate-none"
          />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up pt-16 sm:pt-20">
          {/* Resources Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-white/15 p-5 shadow-md">
              <img
                src={resourcesIcon}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Resources Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {c.title}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:180ms]">
            {c.intro}
            {c.arabicNote && <span className="mt-2 block text-base text-white/70">{c.arabicNote}</span>}
          </p>

          {/* Resource Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto animate-fade-in-up [animation-delay:240ms]">
            {resourcesData.map((resource) => (
              <div key={resource.id} className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/15 hover:bg-white/15 transition-all duration-300 overflow-hidden group flex flex-col">
                <div className="h-56 overflow-hidden bg-white/5 flex items-center justify-center p-4">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 lang="ar" dir="rtl" className="text-xl font-bold text-white mb-4 text-start">
                    <Link
                      href={resourceHref(resource.id)}
                      className="hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-sm"
                    >
                      {resource.title}
                    </Link>
                  </h3>
                  <p lang="ar" dir="rtl" className="text-white/90 text-sm leading-relaxed text-start mb-6 flex-1">
                    {resource.description}
                  </p>
                  <div className="flex justify-center">
                    <Button
                      onClick={() => handleDownloadClick(resource)}
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Download className="h-5 w-5" />
                      {c.download}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
      <Footer />

      <ResourceDownloadDialog
        resource={activeResource}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}


