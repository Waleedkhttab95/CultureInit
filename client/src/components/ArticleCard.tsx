import { Link } from "wouter";
import { Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForwardArrow } from "@/components/DirectionalIcons";
import { articleHref, useLocale, useCopy } from "@/i18n/locale";
import { COPY } from "@shared/copy/articles";
import type { PublicArticle } from "@/lib/articles";

/** Shared by ArticlesPage and ArticleTagPage so the two listings can't drift. */
export default function ArticleCard({ article }: { article: PublicArticle }) {
  const c = useCopy(COPY);
  const { isEn } = useLocale();

  return (
    <Link href={articleHref(article.slug)}>
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
  );
}
