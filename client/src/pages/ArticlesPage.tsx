import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import articlesIcon from "@assets/Asset13@4x.png";
import { fetchArticles, type PublicArticle } from "@/lib/articles";
import { useCopy } from "@/i18n/locale";
import ArticleCard from "@/components/ArticleCard";
import { COPY } from "@shared/copy/articles";


export default function ArticlesPage() {
  const c = useCopy(COPY);
  const [parallaxY, setParallaxY] = useState(0);
  const reduceMotionRef = useRef(false);

  const { data: articles, isLoading, isError } = useQuery<PublicArticle[]>({
    queryKey: ["articles"],
    queryFn: () => fetchArticles(),
  });

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
      <SEO page="articles" />
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 to-background overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 p-4">
              <img
                src={articlesIcon}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {c.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {c.intro}
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <main className="flex-1 py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && (
            <p className="text-center text-muted-foreground">{c.loading}</p>
          )}
          {isError && (
            <p className="text-center text-muted-foreground">
              {c.error}
            </p>
          )}
          {!isLoading && !isError && articles?.length === 0 && (
            <p className="text-center text-muted-foreground">
              {c.empty}
            </p>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(articles ?? []).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


