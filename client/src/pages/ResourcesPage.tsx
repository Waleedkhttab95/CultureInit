import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

type ResourceItem = {
  id: string;
  name: string;
  description: string;
  href: string;
};

// For now, link to files stored in attached_assets; in a real app, fetch from API/CMS
const resources: ResourceItem[] = [
  {
    id: "r1",
    name: "إدارة الثقافة - ملف الهوية (PDF)",
    description: "الهوية البصرية للمبادرة بصيغة PDF.",
    href: "/attached_assets/%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D8%AB%D9%82%D8%A7%D9%81%D8%A9%20-%20%D9%85%D9%84%D9%81%20%D8%A7%D9%84%D9%87%D9%88%D9%8A%D8%A9_1758220028970.pdf",
  },
  {
    id: "r2",
    name: "مبادرة الإدارة الثقافية (PDF)",
    description: "نظرة عامة على المبادرة والمحتويات.",
    href: "/attached_assets/%D9%85%D8%A8%D8%A7%D8%AF%D8%B1%D8%A9%20%D8%A7%D9%84%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D8%AB%D9%82%D8%A7%D9%81%D9%8A%D8%A9_1758220073802.pdf",
  },
  {
    id: "r3",
    name: "شعار المبادرة - أبيض (PNG)",
    description: "نسخة بيضاء من شعار المبادرة.",
    href: "/attached_assets/white-logo.png",
  },
];

export default function ResourcesPage() {
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
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              الموارد
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              ملفات قابلة للتنزيل
            </h1>
            <p className="text-muted-foreground mt-3">
              أدلة تطبيقية وكتيبات مبسطة في الإدارة الثقافية، مع ترجمات أو تلخيصات لأدلة عالمية في المجال، وأدوات عملية مثل قوالب تصميم البرامج الثقافية.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
              <Card key={res.id} className="border-card-border hover-elevate transition-all">
                <CardHeader>
                  <CardTitle className="text-lg">{res.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {res.description}
                  </p>
                  <a
                    href={res.href}
                    download
                    className="inline-flex items-center justify-center text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    تنزيل
                  </a>
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


