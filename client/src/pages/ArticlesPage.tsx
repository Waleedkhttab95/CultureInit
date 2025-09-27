import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

type Article = {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
};

const mockArticles: Article[] = [
  {
    id: "1",
    title: "مقدمة في الإدارة الثقافية",
    excerpt:
      "تعريفات أساسية ومفاهيم تمهيدية لفهم الإدارة الثقافية وأدوارها في تنمية القطاع.",
    tag: "مفاهيم أساسية",
  },
  {
    id: "2",
    title: "تصميم البرامج الثقافية: من الفكرة إلى التنفيذ",
    excerpt:
      "إطار عملي لتصميم البرامج الثقافية مع أمثلة من السياقات العربية.",
    tag: "تصميم البرامج",
  },
  {
    id: "3",
    title: "قياس الأثر في المشاريع الثقافية",
    excerpt:
      "مبادئ وأدوات لقياس الأثر وتقييم الأداء في مبادرات الثقافة والفنون.",
    tag: "قياس الأثر",
  },
];

export default function ArticlesPage() {
  const { ref: mainRef, isVisible: mainVisible } = useScrollAnimation();
  
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main 
        ref={mainRef}
        className={`py-16 transition-all duration-1000 ${
          mainVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* <Badge variant="secondary" className="mb-4 px-4 py-2">
              المقالات
            </Badge> */}
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
               المقالات
            </h1>
            <p className="text-muted-foreground mt-3">
              مقالات تحليلية ومترجمة عن مفاهيم الإدارة الثقافية، واستعراض تجارب عربية وعالمية في إدارة البرامج الثقافية، ومقالات رأي حول التحديات والسياسات الثقافية.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockArticles.map((article) => (
              <Card key={article.id} className="border-card-border hover-elevate transition-all">
                <CardHeader>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <Badge variant="outline">{article.tag}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {article.excerpt}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


