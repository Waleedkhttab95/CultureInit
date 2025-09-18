import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import articlesIcon from "@assets/generated_images/Articles_content_icon_27152365.png";
import resourcesIcon from "@assets/generated_images/Resources_tools_icon_9fa4568c.png";  
import programsIcon from "@assets/generated_images/Training_programs_icon_dbf1faef.png";

export default function TracksSection() {
  //todo: remove mock functionality - these will be real data from the initiative content
  const tracks = [
    {
      icon: articlesIcon,
      title: "المقالات",
      subtitle: "Articles",
      description: "مقالات تحليلية ومترجمة عن مفاهيم الإدارة الثقافية، واستعراض تجارب عربية وعالمية في إدارة البرامج الثقافية، ومقالات رأي حول التحديات والسياسات الثقافية.",
      features: [
        "مقالات تحليلية متخصصة",
        "تجارب عربية وعالمية",
        "مقالات رأي وتحليلات",
        "ترجمات نوعية"
      ],
      color: "from-primary/20 to-primary/5",
      buttonColor: "bg-primary hover:bg-primary/90"
    },
    {
      icon: resourcesIcon,
      title: "الموارد",
      subtitle: "Resources", 
      description: "أدلة تطبيقية وكتيبات مبسطة في الإدارة الثقافية، مع ترجمات أو تلخيصات لأدلة عالمية في المجال، وأدوات عملية مثل قوالب تصميم البرامج الثقافية.",
      features: [
        "أدلة تطبيقية",
        "كتيبات مبسطة",
        "قوالب البرامج الثقافية",
        "نماذج قياس الأثر"
      ],
      color: "from-chart-2/20 to-chart-2/5",
      buttonColor: "bg-chart-2 hover:bg-chart-2/90"
    },
    {
      icon: programsIcon,
      title: "البرامج",
      subtitle: "Programs",
      description: "ورش عمل تدريبية قصيرة في موضوعات محددة، ولقاءات حوارية مع خبراء محليين ودوليين، ودورات متقدمة في الإدارة الثقافية والتخطيط الاستراتيجي.",
      features: [
        "ورش عمل تدريبية",
        "لقاءات مع الخبراء", 
        "دورات متقدمة",
        "التخطيط الاستراتيجي"
      ],
      color: "from-chart-3/20 to-chart-3/5",
      buttonColor: "bg-chart-3 hover:bg-chart-3/90"
    }
  ];

  const handleTrackClick = (trackTitle: string) => {
    console.log(`${trackTitle} track clicked`);
  };

  return (
    <section id="tracks" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            المسارات الرئيسية
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            ثلاثة مسارات متكاملة لتطوير الإدارة الثقافية
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نقدم محتوى متنوع ومتخصص يلبي احتياجات جميع المهتمين بالقطاع الثقافي
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {tracks.map((track, index) => (
            <Card 
              key={index} 
              className={`group relative overflow-hidden border-card-border hover-elevate transition-all duration-500 hover:shadow-lg bg-gradient-to-br ${track.color}`}
            >
              <CardHeader className="text-center pb-4">
                {/* Track Icon */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white p-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={track.icon} 
                    alt={`${track.title} icon`}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <CardTitle className="text-xl font-bold text-foreground mb-2">
                  {track.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground font-medium">
                  {track.subtitle}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {track.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {track.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full mt-6 text-white ${track.buttonColor} border-0`}
                  onClick={() => handleTrackClick(track.title)}
                  data-testid={`button-track-${index}`}
                >
                  استكشف {track.title}
                  <ArrowLeft className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>

              {/* Decorative Elements */}
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-colors duration-500"></div>
              <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/5 rounded-full blur-lg"></div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 py-6 text-lg"
            data-testid="button-all-tracks"
          >
            اكتشف جميع المسارات
            <ArrowLeft className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}