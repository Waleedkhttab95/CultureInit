import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState, useRef } from "react";
import whiteIcon from "@assets/white-icon.png";
import articlesIcon from "@assets/Asset13@4x.png";

export default function ArticlesPage() {
  const [parallaxY, setParallaxY] = useState(0);
  const reduceMotionRef = useRef(false);

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

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Header />
      <main
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: '#ab2451',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
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
          className="absolute inset-0 z-10 pointer-events-none flex items-center justify-start pl-8 sm:pl-12 lg:pl-20"
          style={{ transform: `translateY(${parallaxY}px)` }}
        >
          <img
            src={whiteIcon}
            alt="Background watermark icon"
            className="select-none opacity-10 mix-blend-soft-light w-[35vw] max-w-[450px] drop-shadow-[0_0_24px_rgba(255,255,255,0.25)] animate-fade-in-down-soft [animation-delay:150ms] motion-reduce:animate-none"
          />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          {/* Articles Icon */}
          <div className="flex justify-center mb-8 animate-shimmer">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm p-5 shadow-lg">
              <img
                src={articlesIcon}
                alt="المقالات"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Coming Soon Message */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            قريباً
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:120ms]">
            المقالات
          </p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:180ms]">
            مقالات تحليلية ومترجمة عن مفاهيم الإدارة الثقافية، واستعراض تجارب عربية وعالمية في إدارة البرامج الثقافية
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-chart-2/10 rounded-full blur-2xl"></div>
      </main>
      <Footer />
    </div>
  );
}


