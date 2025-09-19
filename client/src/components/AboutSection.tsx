import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Eye, MessageSquare, CheckCircle } from "lucide-react";
import initiativeIcon from "@assets/icon.png";

export default function AboutSection() {
  //todo: remove mock functionality - these will be real data from the initiative content
  const visionMissionData = [
    {
      icon: Eye,
      title: "الرؤية",
      description: "أن تصبح المنصة المرجع العربي الأول في مجال الإدارة الثقافية، ومصدراً موثوقاً للمعرفة والأدوات التي تدعم ممارسي الثقافة وصناع القرار.",
      color: "text-primary"
    },
    {
      icon: MessageSquare,
      title: "الرسالة", 
      description: "تمكين القطاع الثقافي العربي من خلال توفير محتوى علمي وتطبيقي في الإدارة الثقافية، يربط بين المعرفة النظرية وأدوات الممارسة العملية، ويسهم في بناء كفاءات ثقافية قادرة على إدارة البرامج والمشاريع بكفاءة وابتكار.",
      color: "text-chart-2"
    },
    {
      icon: Target,
      title: "الهدف",
      description: "بناء مجتمع معرفي يربط بين الممارسين والخبراء والمؤسسات الثقافية، مع توفير موارد عملية وبرامج تدريبية متخصصة.",
      color: "text-chart-3"
    }
  ];

  const objectives = [
    "تعزيز المحتوى العربي في مجال الإدارة الثقافية وتوطينه وفقاً للاحتياجات المحلية",
    "توفير موارد عملية (أدلة، كتيبات، نماذج تطبيقية) تساعد الممارسين في عملهم اليومي", 
    "إطلاق برامج تدريبية وتفاعلية لتطوير مهارات العاملين في القطاع الثقافي",
    "نشر المعرفة المتخصصة من خلال مقالات ودراسات وأبحاث مهنية",
    "بناء مجتمع معرفي يربط بين الممارسين والخبراء والمؤسسات الثقافية"
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-background to-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <img 
              src={initiativeIcon} 
              alt="أيقونة المبادرة" 
              className="h-16 w-16"
              data-testid="icon-initiative"
            />
          </div>
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            تعريف المبادرة
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            منصة معرفية متخصصة في الإدارة الثقافية
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            تنطلق المنصة من الرياض لتخاطب السعودية والعالم العربي، وتؤسس لمراجع عربية مهنية في وقت يشهد فيه القطاع الثقافي توسعاً واهتماماً متزايداً
          </p>
        </div>

        {/* Vision, Mission, Goals Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {visionMissionData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card key={index} className="group hover-elevate transition-all duration-300 border-card-border">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 rounded-full ${item.color.replace('text-', 'bg-')}/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-8 w-8 ${item.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-center">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Objectives Section */}
        <div className="bg-card border border-card-border rounded-lg p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            الأهداف الاستراتيجية
          </h3>
          <div className="grid gap-4">
            {objectives.map((objective, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 p-4 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-200" />
                </div>
                <p className="text-foreground leading-relaxed">
                  {objective}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}