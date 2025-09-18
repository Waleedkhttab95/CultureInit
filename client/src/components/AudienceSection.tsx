import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Search, 
  TrendingUp, 
  Target,
  CheckCircle,
  Sparkles
} from "lucide-react";

export default function AudienceSection() {
  //todo: remove mock functionality - these will be real data from the initiative content
  const audiences = [
    {
      icon: Building2,
      title: "العاملون في الوزارات والهيئات",
      description: "موظفو الوزارات والهيئات الثقافية الذين يحتاجون إلى تطوير مهاراتهم في الإدارة الثقافية",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Users,
      title: "مدراء البرامج والمشاريع",
      description: "القائمون على إدارة البرامج والمشاريع في الجمعيات والجهات الثقافية",
      color: "text-chart-2", 
      bgColor: "bg-chart-2/10"
    },
    {
      icon: GraduationCap,
      title: "الشباب المهتمون",
      description: "الشباب المهتمون بالعمل الثقافي ويرغبون في تطوير مهاراتهم المهنية",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10"
    },
    {
      icon: Search,
      title: "الباحثون والطلاب",
      description: "الباحثون والطلاب في مجالات الثقافة والإدارة والدراسات الثقافية",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10"
    }
  ];

  const values = [
    {
      icon: TrendingUp,
      title: "سد الفجوة المعرفية",
      description: "سد فجوة معرفية كبيرة في المحتوى العربي حول الإدارة الثقافية"
    },
    {
      icon: Target,
      title: "تعزيز الكفاءات المحلية",
      description: "تعزيز الكفاءات المحلية بما يتماشى مع رؤية السعودية 2030 والتحولات الثقافية"
    },
    {
      icon: CheckCircle,
      title: "موارد عملية",
      description: "تقديم موارد عملية بدلاً من التنظير المجرد"
    },
    {
      icon: Sparkles,
      title: "الاحترافية والاستدامة",
      description: "تمكين القطاع الثقافي من أدوات تساعده في الاحترافية والاستدامة"
    }
  ];

  const handleJoinAudience = () => {
    console.log('Join audience triggered');
  };

  return (
    <section id="audience" className="py-20 bg-gradient-to-br from-secondary/30 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            الجمهور المستهدف
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            لمن هذه المبادرة؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نستهدف جميع العاملين والمهتمين بالقطاع الثقافي من مختلف المستويات والتخصصات
          </p>
        </div>

        {/* Target Audience Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {audiences.map((audience, index) => {
            const IconComponent = audience.icon;
            return (
              <Card 
                key={index} 
                className="text-center hover-elevate transition-all duration-300 border-card-border group"
              >
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-full ${audience.bgColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-8 w-8 ${audience.color}`} />
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground leading-tight">
                    {audience.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {audience.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Added Value Section */}
        <div className="bg-card border border-card-border rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              القيمة المضافة
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              ما الذي تقدمه مبادرة الإدارة الثقافية للمجتمع والقطاع الثقافي؟
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-6 rounded-xl hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {value.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg"
              onClick={handleJoinAudience}
              data-testid="button-join-audience"
            >
              انضم إلى مجتمعنا المعرفي
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}