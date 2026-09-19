import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useCopy, useLocale } from "@/i18n/locale";

const COPY = {
  ar: {
    title: "سياسة النشر",
    stepsHeading: "خطوات النَّشر الإجرائيّة",
    items: [
      { label: "مجالات المنصة:", text: "مبادئ الإدارة الثقافية - الابتكار الثقافي - إدارة المشاريع الثقافية - إدارة الأصول الثقافية - الاستثمار الثقافي - التمويل الثقافي - الاقتصاد الثقافي - علم النفس الثقافي - التطوع الثقافي - ريادة الأعمال الثقافية - التسويق الثقافي - السياحة الثقافية - إدارة التراث، وما يتصل بها." },
      { label: "أصالة المادة المنشورة:", text: "يشترط ألا تكون المادة المقدمة للنشر منشورة سابقًا مع أي جهة أخرى، كما تؤول ملكيتها نشرًا وترجمة لمنصة الإدارة الثقافية حال نشرها على المنصة." },
      { label: "السلامة اللغوية:", text: "استيفاء سلامة اللغة وصحتها من النواحي الإملائية والنحوية والأسلوبية، والحرص على دقة نقل مقصد النص الأصل في حال كانت المادة مترجمة." },
      { label: "طول المقالة:", text: "يفضل ألا يقل عدد كلمات المقالة عن ١٠٠٠ كلمة، مع إمكانية الاستثناء وفق ما يراه محررو المنصة." },
      { label: "الملكية الفكرية:", text: "يشترط الحصول على إذن الترجمة والنشر من أصحاب الحقوق في حالة المقالات المترجمة، ويعد الإذن جزءا من متطلبات النشر." },
      { label: "جودة المحتوى:", text: "تخضع المواد المرسلة للمراجعة العلمية لضمان رصانتها وقيمتها المضافة إلى مجالها." },
      { label: "نوع المادة:", text: "أن تتسق المادة المراد نشرها مع اهتمامات منصة الإدارة الثقافية، وتتماشى مع رؤيتها العامة." },
      { label: "المراجع والمصادر:", text: "يلزم ذكر جميع المراجع في المقالات الفلسفية والعلمية وتوثيقها وفق مناهج التوثيق المعتمدة" },
      { label: "الاسم:", text: "لا تُنشر المواد إلا بالاسم الصريح للكاتب أو المترجم." },
      { label: "مواعيد النشر:", text: "يعتمد تاريخ نشر المقالة على خطة نشر منصة الإدارة الثقافية، وعادة يتراوح تاريخ النشر من أسبوع إلى 3 أشهر من تاريخ الموافقة على النشر." },
    ],
    steps: [
      "يُرسل الكاتب النص المكتوب أو المترجم إلى البريد الإلكتروني الخاص بمنصة الإدارة الثقافية",
      "ترد الإدارة الثقافية على طلب النشر عادة في غضون أسبوعين بالموافقة المبدئية أو الرفض.",
      "ترسل المشاركات المراد نشرها بـمنصة الإدارة الثقافية عبر البريد الإلكتروني بصيغتين: Word، و PDF.",
      "يرفق الكاتب نبذة تعريفيّة مختصرة من سيرته الذاتيّة، متضمّنة أبرز أعماله، وبياناته الأساسيّة.",
      "تقوم هيئة التحرير في منصة الإدارة الثقافية بالنظر في الأوراق المقدّمة، وتحديد مدى مطابقتها لقواعد النشر وأهدافه في المنصة؛ لتحديد أهليّتها للنشر. وإبلاغ الكاتب بنتيجة هذه المرحلة قبولًا أو رفضًا.",
      "في حال قبول البحث للنشر يُخطر الكاتب بذلك، ويرسل خطاب اعتذار له إن كانت نتيجة التحكيم هي الرفض، مع امتلاك أحقيّة عدم إبداء أسباب الرفض.",
      "في حال قبول البحث للنشر تؤول كافة حقوق النشر لمنصة الإدارة الثقافية بكل اللغات والقوالب الورقية والإلكترونية، ولا يجوز إعادة النشر إلا بإذنها.",
    ],
  },
  en: {
    title: "Publishing policy",
    stepsHeading: "Procedural steps for publication",
    items: [
      { label: "Platform fields:", text: "Principles of cultural management – cultural innovation – cultural project management – cultural asset management – cultural investment – cultural financing – cultural economy – cultural psychology – cultural volunteering – cultural entrepreneurship – cultural marketing – cultural tourism – heritage management, and related fields." },
      { label: "Originality of the material:", text: "The material submitted for publication must not have been published previously by any other party. Upon publication on the platform, ownership of the material, including publishing and translation rights, passes to the Cultural Management Platform." },
      { label: "Language quality:", text: "The text must be sound in spelling, grammar and style and, for translated material, must faithfully convey the intent of the original text." },
      { label: "Article length:", text: "Articles should preferably be no shorter than 1,000 words, with exceptions at the discretion of the platform's editors." },
      { label: "Intellectual property:", text: "For translated articles, permission to translate and publish must be obtained from the rights holders; this permission is a requirement for publication." },
      { label: "Content quality:", text: "Submitted material undergoes scholarly review to ensure its rigor and the value it adds to its field." },
      { label: "Type of material:", text: "The material must be consistent with the interests of the Cultural Management Platform and in line with its overall vision." },
      { label: "References and sources:", text: "All references must be cited in philosophical and scholarly articles and documented according to recognized citation methods." },
      { label: "Name:", text: "Material is published only under the explicit name of the author or translator." },
      { label: "Publication dates:", text: "The publication date depends on the Cultural Management Platform's publishing plan, and typically falls between one week and three months after approval for publication." },
    ],
    steps: [
      "The author sends the written or translated text to the Cultural Management Platform's email address.",
      "The Cultural Management Platform usually responds to a publication request within two weeks, with either preliminary approval or rejection.",
      "Contributions intended for publication on the Cultural Management Platform are sent by email in two formats: Word and PDF.",
      "The author attaches a brief biographical note, including their main works and basic details.",
      "The editorial board of the Cultural Management Platform reviews the submitted papers and assesses their conformity with the publishing rules and the platform's objectives, in order to determine their eligibility for publication, and informs the author of the outcome of this stage, whether acceptance or rejection.",
      "If the paper is accepted for publication, the author is notified. If the outcome of the review is rejection, an apology letter is sent, and the platform reserves the right not to state the reasons for rejection.",
      "If the paper is accepted for publication, all publishing rights pass to the Cultural Management Platform in all languages and in all print and electronic formats, and republication is not permitted without its permission.",
    ],
  },
};

export default function PublishingPolicyPage() {
  const { ref: mainRef, isVisible: mainVisible } = useScrollAnimation();
  const c = useCopy(COPY);
  const { dir } = useLocale();

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <SEO page="publishingPolicy" />
      <Header />
      <main
        ref={mainRef}
        className={`flex-1 py-16 transition-all duration-1000 ${
          mainVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              {c.title}
            </h1>
          </div>

          <div className="prose prose-lg max-w-none text-start" dir={dir}>
            <div className="space-y-8">
              <div className="space-y-4">
                {c.items.map((item) => (
                  <div key={item.label} className="flex gap-3 items-start">
                    <span className="text-primary font-bold mt-1">•</span>
                    <div>
                      <strong>{item.label}</strong> {item.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {c.stepsHeading}
                </h2>

                <div className="space-y-4">
                  {c.steps.map((step, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-primary font-bold mt-1 shrink-0">{i + 1})</span>
                      <div>{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
