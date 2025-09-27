import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import programsIcon from "@assets/generated_images/Training_programs_icon_dbf1faef.png";

type Program = {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText?: string;
};

const programs: Program[] = [
  {
    id: "p1",
    title: "أساسيات الإدارة الثقافية",
    description:
      "برنامج تمهيدي يعرّف المشاركين على المفاهيم والأطر الأساسية في الإدارة الثقافية وتطبيقاتها العملية.",
    image: programsIcon,
    buttonText: "سجل الآن",
  },
  {
    id: "p2",
    title: "تصميم البرامج الثقافية",
    description:
      "ورشة عملية لتصميم وتنفيذ البرامج الثقافية من مرحلة التحليل وحتى التقييم، مع قوالب تطبيقية.",
    image: programsIcon,
    buttonText: "سجل الآن",
  },
  {
    id: "p3",
    title: "قياس الأثر والتقييم",
    description:
      "منهجيات وأدوات قياس الأثر للمشاريع الثقافية وبناء مؤشرات الأداء المناسبة.",
    image: programsIcon,
    buttonText: "سجل الآن",
  },
];

export default function ProgramsPage() {
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
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              البرامج
            </h1>
            <p className="text-muted-foreground mt-3">
              ورش عمل ودورات متخصصة لتطوير المهارات في الإدارة الثقافية
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Card
                key={program.id}
                className="group relative overflow-hidden border-card-border hover-elevate transition-all duration-500 hover:shadow-lg bg-gradient-to-br from-chart-3/20 to-chart-3/5"
              >
                <CardHeader className="p-0">
                  <div className="relative w-full h-40 overflow-hidden">
                    <img
                      src={program.image}
                      alt={`${program.title} image`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <CardTitle className="text-xl font-bold text-foreground">
                    {program.title}
                  </CardTitle>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {program.description}
                  </p>
                  <Button className="w-full mt-2 bg-chart-3 hover:bg-chart-3/90 text-white border-0" data-testid={`button-program-${program.id}`}>
                    {program.buttonText || "انضم الآن"}
                  </Button>
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


