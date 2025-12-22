import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams, Link } from "wouter";
import articlesData from "@/data/articles.json";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = params.id;

  const article = articlesData.find((a) => a.id === articleId);

  if (!article) {
    return (
      <div className="min-h-screen bg-background font-sans flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              المقال غير موجود
            </h1>
            <Link href="/articles">
              <Button>العودة إلى المقالات</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Header />

      <main className="flex-1 py-12 bg-background">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/articles">
            <Button variant="ghost" className="mb-8 gap-2">
              <ArrowRight className="h-4 w-4" />
              العودة إلى المقالات
            </Button>
          </Link>

          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight text-right">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-medium">{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(article.date).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-video overflow-hidden rounded-2xl bg-muted mb-2">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-muted-foreground text-right mb-8">
              *حقوق الصور محفوظة بالتعاون مع منصة The stock.
            </p>
          </div>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-right prose-p:text-justify prose-p:leading-relaxed prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 prose-p:mb-4 prose-strong:text-foreground prose-strong:font-bold"
            style={{ direction: 'rtl' }}
          >
            {article.content.split('\n\n').map((paragraph, index) => {
              // Handle headings
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-right">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-right">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }

              // Handle bold text with **
              const renderText = (text: string) => {
                const parts = text.split(/(\*\*.*?\*\*)/g);
                return parts.map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                  }
                  return part;
                });
              };

              // Regular paragraph
              return (
                <p key={index} className="text-justify">
                  {renderText(paragraph)}
                </p>
              );
            })}
          </div>

          {/* Back to Articles Button */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground text-center mb-6 mt-4">
              *الآراء والأفكار الواردة في المقالات تمثّل وِجهة نَظر كتّابها فقط.
            </p>
            <Link href="/articles">
              <Button size="lg" className="gap-2">
                <ArrowRight className="h-5 w-5" />
                العودة إلى جميع المقالات
              </Button>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
