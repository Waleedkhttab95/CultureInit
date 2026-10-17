import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ArticleCard from "@/components/ArticleCard";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchArticles, type PublicArticle } from "@/lib/articles";
import { Button } from "@/components/ui/button";
import { BackArrow } from "@/components/DirectionalIcons";
import {
  ARTICLES_PATH,
  BRAND,
  absoluteUrl,
  breadcrumbLd,
  tagPagePath,
  tagSlug,
} from "@shared/seo";

/**
 * /articles/tag/:tag — every published article carrying a tag that slugifies
 * to :tag. Arabic only, like article detail pages; the server already 301s
 * /en/articles/tag/:tag here (see server/seo.ts), so this component never
 * renders in the English router.
 */
export default function ArticleTagPage() {
  const params = useParams();
  const tagParam = params.tag as string;

  const { data: articles, isLoading, isError } = useQuery<PublicArticle[]>({
    queryKey: ["articles", "tag", tagParam],
    queryFn: () => fetchArticles({ tagSlug: tagParam }),
  });

  // The tag label as an author actually typed it — first match wins, same
  // rule the server uses, so the heading matches what was server-rendered.
  const label = (articles ?? []).flatMap((a) => a.tags ?? []).find((t) => tagSlug(t) === tagParam);

  if (!isLoading && (isError || !label)) {
    return (
      <div className="min-h-screen bg-background font-sans flex flex-col">
        <SEO notFound locale="ar" />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">لا توجد مقالات بهذا الوسم</h1>
            <Link href="/articles">
              <Button>العودة إلى المقالات</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const url = label ? absoluteUrl("ar", tagPagePath(tagParam)) : undefined;

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      {label && (
        <SEO
          locale="ar"
          title={`مقالات عن ${label}`}
          description={`مقالات منصة الإدارة الثقافية المصنّفة تحت وسم «${label}».`}
          path={tagPagePath(tagParam)}
          alternates={false}
          jsonLd={[
            breadcrumbLd([
              { name: BRAND.ar, url: absoluteUrl("ar", "/") },
              { name: "المقالات", url: absoluteUrl("ar", ARTICLES_PATH) },
              { name: label, url: url! },
            ]),
          ]}
        />
      )}
      <Header />

      <section className="relative py-16 bg-gradient-to-br from-primary/10 to-background overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/articles">
            <Button variant="ghost" className="mb-4 gap-2">
              <BackArrow className="h-4 w-4" />
              كل المقالات
            </Button>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            مقالات عن {label ?? "..."}
          </h1>
        </div>
      </section>

      <main className="flex-1 py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && <p className="text-center text-muted-foreground">جارٍ التحميل...</p>}
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
