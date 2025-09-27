import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import heroImage from "@assets/generated_images/Modern_Arabic_library_hero_72133ecf.png";
import whiteLogo from "@assets/white-logo.png";
import whiteIcon from "@assets/white-icon.png";

export default function HeroSection() {
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
  const handleExplore = () => {
    console.log('Explore initiative triggered');
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleJoinUs = () => {
    console.log('Join us triggered');
  };

  const handleScrollDown = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        // backgroundImage: `linear-gradient(135deg, rgba(255, 151, 26, 0.15) 0%, rgba(28, 147, 127, 0.15) 100%), url(${heroImage})`,
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
        {/* Animated badge */}
        {/* <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 hover-elevate">
          <Sparkles className="h-4 w-4 text-primary" />
          منصة معرفية متخصصة
        </div> */}

        {/* Logo in Hero */}
        <div className="flex justify-center mb-8 animate-shimmer">
          <img 
            src={whiteLogo} 
            alt="مبادرة الإدارة الثقافية" 
            className="h-16 sm:h-20 lg:h-24 w-auto"
            data-testid="logo-hero"
          />
        </div>

        {/* Main heading */}
        {/* <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          منصة معرفية متخصصة في 
          <span className="block text-primary">الإدارة الثقافية</span>
        </h1> */}

        {/* Description */}
        <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:120ms]">
          منصة معرفية متخصصة في نشر وتعزيز مفاهيم الإدارة الثقافية، تستهدف الممارسين والمهتمين والجهات العاملة في القطاع الثقافي
        </p>

        {/* CTA Buttons */}
        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary"
            onClick={handleExplore}
            data-testid="button-explore"
          >
            استكشف المبادرة
            <ArrowLeft className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
            onClick={handleJoinUs}
            data-testid="button-join"
          >
            انضم إلينا
          </Button>
        </div> */}

        {/* Stats or badges */}
        {/* <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">3</div>
            <div className="text-white/80">مسارات رئيسية</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">المعرفة</div>
            <div className="text-white/80">محتوى عربي رصين</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">التطوير</div>
            <div className="text-white/80">برامج تدريبية</div>
          </div>
        </div> */}
      </div>

      {/* Scroll Down Arrow */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <button
          onClick={handleScrollDown}
          className="group flex items-center justify-center text-white/80 hover:text-white transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 animate-bounce-slow">
            <ChevronDown className="h-5 w-5" />
          </div>
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-chart-2/10 rounded-full blur-2xl"></div>
    </section>
  );
}