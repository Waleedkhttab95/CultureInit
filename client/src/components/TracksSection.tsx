import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ForwardArrow } from "@/components/DirectionalIcons";
import { useLocation } from "wouter";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import articlesIcon from "@assets/Asset13@4x.png";
import resourcesIcon from "@assets/Asset7@4x.png";  
import programsIcon from "@assets/Asset25@4x.png";
import { useCopy } from "@/i18n/locale";

const COPY = {
  ar: {
    badge: "المسارات الرئيسية",
    heading: "ثلاثة مسارات متكاملة لتطوير الإدارة الثقافية",
    intro: "نقدم محتوى متنوعًا ومتخصصًا يلبي احتياجات الفاعلين بالقطاع الثقافي",
    explore: (title: string) => `استكشف ${title}`,
    articles: {
      title: "المقالات",
      description:
        "مقالات تعريفية وتحليلية عن مفاهيم الإدارة الثقافية، وتجارب عربية وعالمية في إدارة البرامج الثقافية.",
    },
    resources: {
      title: "الموارد",
      description:
        "أدلة تطبيقية وكتيبات مهنية في الإدارة الثقافية، وأدوات عملية لتصميم البرامج الثقافية.",
    },
    programs: {
      title: "البرامج",
      description:
        "ورش عمل تدريبية قصيرة، وبرامج تأهيلية، وحوارات إثرائية في موضوعات الإدارة الثقافية.",
    },
  },
  en: {
    badge: "Core tracks",
    heading: "Three integrated tracks to advance cultural management",
    intro: "Diverse, specialized content that meets the needs of professionals across the cultural sector.",
    explore: (title: string) => `Explore ${title}`,
    articles: {
      title: "Articles",
      description:
        "Introductory and analytical articles on cultural management concepts, plus Arab and international experiences in running cultural programs.",
    },
    resources: {
      title: "Resources",
      description:
        "Practical guides and professional handbooks in cultural management, with hands-on tools for designing cultural programs.",
    },
    programs: {
      title: "Programs",
      description:
        "Short training workshops, qualification programs and enriching dialogues on cultural management topics.",
    },
  },
};

export default function TracksSection() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
  
  const c = useCopy(COPY);

  // Icons are decorative (the card title already names the track).
  const tracks = [
    {
      icon: programsIcon,
      href: "/articles",
      ...c.articles,
      color: "from-primary/20 to-primary/5",
    },
    {
      icon: articlesIcon,
      href: "/resources",
      ...c.resources,
      color: "from-chart-2/20 to-chart-2/5",
    },
    {
      icon: resourcesIcon,
      href: "/programs",
      ...c.programs,
      color: "from-chart-3/20 to-chart-3/5",
    },
  ];

  const [, navigate] = useLocation();

  return (
    <section 
      ref={sectionRef}
      id="tracks" 
      className={`py-20 bg-background transition-all duration-1000 ${
        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            {c.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {c.heading}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {c.intro}
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {tracks.map((track, index) => (
            <Card
              key={index}
              className={`group relative overflow-hidden border-card-border hover-elevate transition-all duration-500 hover:shadow-lg bg-gradient-to-br ${track.color} h-full flex flex-col`}
            >
              <CardHeader className="text-center pb-4">
                {/* Track Icon */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white p-4 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={track.icon}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                
                <CardTitle className="text-xl font-bold text-foreground mb-2">
                  {track.title}
                </CardTitle>
                {/* <p className="text-sm text-muted-foreground font-medium">
                  {track.subtitle}
                </p> */}
              </CardHeader>

              <CardContent className="flex-1 flex flex-col space-y-4">
                {/* Description */}
                <p className="text-muted-foreground leading-relaxed text-sm flex-1 rtl:text-justify ltr:text-start">
                  {track.description}
                </p>

                {/* CTA Button */}
                <Button
                  className="w-full mt-6 bg-foreground text-background hover:bg-foreground/90 border-0"
                  onClick={() => navigate(track.href)}
                  data-testid={`button-track-${index}`}
                >
                  {c.explore(track.title)}
                  <ForwardArrow className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        {/* <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 py-6 text-lg"
            data-testid="button-all-tracks"
          >
            اكتشف جميع المسارات
            <ArrowLeft className="ml-2 h-5 w-5" />
          </Button>
        </div> */}
      </div>
    </section>
  );
}