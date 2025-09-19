import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import heroImage from "@assets/generated_images/Modern_Arabic_library_hero_72133ecf.png";

export default function HeroSection() {
  const handleExplore = () => {
    console.log('Explore initiative triggered');
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleJoinUs = () => {
    console.log('Join us triggered');
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(255, 151, 26, 0.15) 0%, rgba(28, 147, 127, 0.15) 100%), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Animated badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 hover-elevate">
          <Sparkles className="h-4 w-4 text-primary" />
          منصة معرفية متخصصة
        </div>

        {/* Logo in Hero */}
        <div className="flex justify-center mb-8">
          <img 
            src="/attached_assets/02 الشعار الرئيسي أبيض_1758304639238.png" 
            alt="مبادرة الإدارة الثقافية" 
            className="h-16 sm:h-20 lg:h-24 w-auto"
            data-testid="logo-hero"
          />
        </div>

        {/* Main heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          منصة معرفية متخصصة في 
          <span className="block text-primary">الإدارة الثقافية</span>
        </h1>

        {/* Description */}
        <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          منصة معرفية متخصصة في نشر وتعزيز مفاهيم الإدارة الثقافية، تستهدف الممارسين والمهتمين والجهات العاملة في القطاع الثقافي
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
        </div>

        {/* Stats or badges */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
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
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-chart-2/10 rounded-full blur-2xl"></div>
    </section>
  );
}