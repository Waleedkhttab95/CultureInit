import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import whiteIcon from "@assets/white-icon.png";
import articlesIcon from "@assets/Asset13@4x.png";
import articlesData from "@/data/articles.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, ArrowLeft } from "lucide-react";

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

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 to-background overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 p-4">
              <img
                src={articlesIcon}
                alt="المقالات"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            المقالات
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          مقالات تعريفية وتحليلية عن مفاهيم الإدارة الثقافية، وتجارب عربية وعالمية في إدارة البرامج الثقافية.          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <main className="flex-1 py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articlesData.map((article) => (
              <Link key={article.id} href={`/articles/${article.id}`}>
                <Card className="cursor-pointer hover-elevate transition-all duration-300 border-card-border h-full group overflow-hidden">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground leading-tight line-clamp-2 text-right">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 text-right leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(article.date).toLocaleDateString('ar-SA')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{article.author}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-primary text-sm font-semibold">
                      <span>اقرأ المزيد</span>
                      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


