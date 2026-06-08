import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState, useRef } from "react";
import whiteIcon from "@assets/white-icon.png";
import resourcesIcon from "@assets/Asset7@4x.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, FileText, User, Mail, Check } from "lucide-react";
import resourcesData from "@/data/resources.json";
import { useToast } from "@/hooks/use-toast";

export default function ResourcesPage() {
  const { toast } = useToast();
  const [parallaxY, setParallaxY] = useState(0);
  const reduceMotionRef = useRef(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [activeResource, setActiveResource] = useState<typeof resourcesData[number] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await fetch('/api/pdf/download-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      setIsSubmitted(true);

      if (activeResource) {
        const link = document.createElement('a');
        link.href = activeResource.file;
        link.download = `${activeResource.title.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setTimeout(() => {
        setIsDialogOpen(false);
        setIsSubmitted(false);
        setFormData({ name: '', email: '' });
        setActiveResource(null);
      }, 2000);
    } catch (error) {
      toast({
        title: "خطأ",
        description: 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadClick = (resource: typeof resourcesData[number]) => {
    setActiveResource(resource);
    setIsDialogOpen(true);
  };

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

        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up pt-16 sm:pt-20">
          {/* Resources Icon */}
          <div className="flex justify-center mb-8 animate-shimmer">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm p-5 shadow-lg">
              <img
                src={resourcesIcon}
                alt="الموارد"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Resources Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            الموارد
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:180ms]">
          أدلة تطبيقية وكتيبات مهنية في الإدارة الثقافية، وأدوات عملية لتصميم البرامج الثقافية.          </p>

          {/* Resource Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto animate-fade-in-up [animation-delay:240ms]">
            {resourcesData.map((resource) => (
              <div key={resource.id} className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 overflow-hidden group flex flex-col">
                <div className="h-56 overflow-hidden bg-white/5 flex items-center justify-center p-4">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-white mb-4 text-right">
                    {resource.title}
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed text-right mb-6 flex-1">
                    {resource.description}
                  </p>
                  <div className="flex justify-center">
                    <Button
                      onClick={() => handleDownloadClick(resource)}
                      size="lg"
                      className="bg-white text-[#ab2451] hover:bg-white/90 font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Download className="ml-2 h-5 w-5" />
                      تحميل الدليل
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
      <Footer />

      {/* Download Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              تحميل {activeResource?.title ?? ''}
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              يرجى تعبئة البيانات التالية لتحميل الدليل
            </DialogDescription>
          </DialogHeader>

          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                جاري تحميل الدليل...
              </h3>
              <p className="text-muted-foreground">
                شكراً لك!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  الاسم الكامل
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="أدخل اسمك الكامل"
                  required
                  className="h-12 text-base border-2 border-card-border focus:border-primary transition-colors rounded-xl"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
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
                  className="h-12 text-base border-2 border-card-border focus:border-primary transition-colors rounded-xl"
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
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري المعالجة...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    تحميل الدليل
                  </div>
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


