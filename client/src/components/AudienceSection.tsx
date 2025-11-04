import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Search, 
  TrendingUp, 
  Target,
  CheckCircle,
  Sparkles,
  User,
  Mail,
  Send,
  Check
} from "lucide-react";

export default function AudienceSection() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
  
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
      description: "تعزيز الكفاءات المحلية بما يتماشى مع التطلعات الوطنية والتحولات الثقافية"
    },
    {
      icon: CheckCircle,
      title: "موارد عملية",
      description: "تجاوز التنظير المجرد إلى تقديم موارد عملية وأدوات تمكينية"
    },
    {
      icon: Sparkles,
      title: "الاحترافية والاستدامة",
      description: "تمكين القطاع الثقافي من أدوات تساعده على الاحترافية والاستدامة"
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '' });
    }, 3000);
  };

  return (
    <section 
      ref={sectionRef}
      id="audience" 
      className={`py-20 bg-gradient-to-br from-secondary/30 to-background transition-all duration-1000 ${
        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {/* <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            الجمهور المستهدف
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            لمن هذه المبادرة؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نستهدف جميع العاملين والمهتمين بالقطاع الثقافي من مختلف المستويات والتخصصات
          </p>
        </div> */}

        {/* Target Audience Cards */}
        {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
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
        </div> */}

        {/* Added Value Section */}
        <div className="bg-card border border-card-border rounded-2xl p-8 lg:p-12 mb-8">
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
        </div>

        {/* Contact Form Section */}
        <div className="bg-card border border-card-border rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              انضم إلى مجتمعنا المعرفي
            </h4>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              اترك بياناتك وسنتواصل معك قريباً لنشاركك أحدث المحتويات والبرامج
            </p>
          </div>

          {isSubmitted ? (
            <div className="max-w-md mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h5 className="text-xl font-bold text-foreground mb-2">
                تم إرسال طلبك بنجاح!
              </h5>
              <p className="text-muted-foreground">
                شكراً لك، سنتواصل معك قريباً
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <div className="bg-gradient-to-br from-background to-accent/20 rounded-2xl p-8 border border-card-border shadow-lg">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      الاسم الكامل
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="أدخل اسمك الكامل"
                        required
                        className="h-12 pl-4 pr-4 text-base border-2 border-card-border focus:border-primary transition-colors rounded-xl"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      البريد الإلكتروني
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="أدخل بريدك الإلكتروني"
                        required
                        className="h-12 pl-4 pr-4 text-base border-2 border-card-border focus:border-primary transition-colors rounded-xl"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    data-testid="button-submit-form"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        جاري الإرسال...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        انضم الآن
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}