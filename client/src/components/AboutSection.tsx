import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MessageSquare } from "lucide-react";
import initiativeIcon from "@assets/icon.png";
import whiteIcon from "@assets/white-icon.png";
import asset2 from "@assets/Asset2@4x.png";
import asset6 from "@assets/Asset6@4x.png";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function AboutSection() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
  
  //todo: replace with CMS-driven content
  const visionMissionData = [
    {
      icon: Eye,
      title: "الرؤية",
      description:
        "أن تصبح المنصة المرجع العربي الأول في الإدارة الثقافية، ومصدراً موثوقاً للمعرفة والأدوات التي تدعم الممارسين وصناع القرار.",
      accent: "from-primary/20 via-primary/10 to-transparent",
      ring: "ring-primary/25",
      backgroundImage: asset2
    },
    {
      icon: MessageSquare,
      title: "الرسالة",
      description:
        "تمكين القطاع الثقافي العربي عبر محتوى علمي وتطبيقي يربط النظرية بالممارسة، ويبني كفاءات قادرة على إدارة البرامج والمشاريع بكفاءة وابتكار.",
      accent: "from-chart-2/20 via-chart-2/10 to-transparent",
      ring: "ring-chart-2/25",
      backgroundImage: asset6
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className={`py-20 bg-gradient-to-br from-background to-secondary/20 transition-all duration-1000 ${
        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative background accents */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -start-24 h-64 w-64 rounded-full bg-gradient-to-br from-primary/15 to-transparent blur-3xl" />
          <div className="absolute -bottom-16 -end-16 h-64 w-64 rounded-full bg-gradient-to-tr from-chart-2/15 to-transparent blur-3xl" />
        </div>

        {/* Section Header */}
        <div className="relative text-center mb-14">
          <div className="flex justify-center mb-4">
            <img
              src={initiativeIcon}
              alt="أيقونة المبادرة"
              className="h-14 w-14"
              data-testid="icon-initiative"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
            الرؤية والرسالة
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            ننطلق من الرياض إلى العالم العربي لنقدّم مرجعاً مهنياً متكاملاً في الإدارة الثقافية.
          </p>
        </div>

        {/* Vision & Mission - modern split cards */}
        <div className="relative grid md:grid-cols-2 gap-6 items-stretch">
          {visionMissionData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="group relative h-full"
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${item.accent} opacity-80 rounded-2xl blur-xl group-hover:opacity-100 transition-opacity`} />
                <Card className={`relative h-full flex flex-col backdrop-blur supports-[backdrop-filter]:bg-card/70 border border-card-border ring-1 ${item.ring} overflow-hidden rounded-2xl transition-all duration-300 group-hover:translate-y-[-2px] group-hover:shadow-xl`}>
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 flex items-start justify-start pointer-events-none z-0"
                  >
                    <img
                      src={item.backgroundImage}
                      alt=""
                      className="w-1/2 h-1/2 object-contain opacity-40"
                    />
                  </div>

                  <CardHeader className="relative pb-2 text-center z-10">
                    <div className="flex items-center justify-center">
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-background/70 border border-card-border shadow-sm group-hover:scale-105 transition-transform">
                        <IconComponent className="h-7 w-7 text-foreground" />
                      </span>
                    </div>
                    <CardTitle className="mt-4 text-2xl font-extrabold text-foreground">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative flex-1 z-10">
                    <p className="text-foreground/90 leading-relaxed text-center text-base sm:text-lg">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}