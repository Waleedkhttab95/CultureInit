import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import articlesIcon from "@assets/Asset13@4x.png";
import { fetchArticles, type PublicArticle } from "@/lib/articles";
import { articleHref, useCopy, useLocale } from "@/i18n/locale";
import { PAGES } from "@shared/seo";
import { ForwardArrow } from "@/components/DirectionalIcons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";

const COPY = {
  ar: {
    title: "المقالات",
    intro: PAGES.articles.meta.ar.description,
    loading: "جارٍ التحميل...",
    error: "تعذّر تحميل المقالات. حاول لاحقًا.",
    empty: "لا توجد مقالات منشورة حاليًا.",
    readMore: "اقرأ المزيد",
  },
  en: {
    title: "Articles",
    intro: PAGES.articles.meta.en.description,
    loading: "Loading...",
    error: "We couldn't load the articles. Please try again later.",
    empty: "No articles have been published yet.",
    readMore: "Read more",
  },
};

export default function ArticlesPage() {
  const c = useCopy(COPY);
  const { isEn } = useLocale();
  const [parallaxY, setParallaxY] = useState(0);
  const reduceMotionRef = useRef(false);

  const { data: articles, isLoading, isError } = useQuery<PublicArticle[]>({
    queryKey: ["articles"],
    queryFn: fetchArticles,
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
              <Link key={article.id} href={articleHref(article.slug)}>
                <Card className="cursor-pointer hover-elevate transition-all duration-300 border-card-border h-full group overflow-hidden">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle lang="ar" dir="rtl" className="text-xl font-bold text-foreground leading-tight line-clamp-2 text-start">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p lang="ar" dir="rtl" className="text-muted-foreground text-sm mb-4 line-clamp-3 text-start leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {isEn
                            ? new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                            : new Date(article.date).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span lang="ar">{article.author}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-primary text-sm font-semibold">
                      <span>{c.readMore}</span>
                      <ForwardArrow className="h-4 w-4 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1 transition-transform" />
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


