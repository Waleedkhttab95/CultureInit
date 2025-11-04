import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function PublishingPolicyPage() {
  const { ref: mainRef, isVisible: mainVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
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
              سياسة النشر
            </h1>
          </div>

          <div className="prose prose-lg max-w-none text-right" dir="rtl">
            {/* Publishing Policy Content */}
            <div className="space-y-8">
              {/* Bullet Points Section */}
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <span className="text-primary font-bold mt-1">•</span>
                  <div>
                    <strong>أصالة المادة المنشورة:</strong> يشترط ألا تكون المادة المقدمة للنشر منشورة سابقًا مع أي جهة أخرى، كما تؤول ملكيتها نشرًا وترجمة لمنصة الإدارة الثقافية حال نشرها على المنصة.
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-primary font-bold mt-1">•</span>
                  <div>
                    <strong>السلامة اللغوية:</strong> استيفاء سلامة اللغة وصحتها من النواحي الإملائية والنحوية والأسلوبية، والحرص على دقة نقل مقصد النص الأصل في حال كانت المادة مترجمة.
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-primary font-bold mt-1">•</span>
                  <div>
                    <strong>طول المقالة:</strong> يفضل ألا يقل عدد كلمات المقالة عن ١٠٠٠ كلمة، مع إمكانية الاستثناء وفق ما يراه محررو المنصة.
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-primary font-bold mt-1">•</span>
                  <div>
                    <strong>الملكية الفكرية:</strong> يشترط الحصول على إذن الترجمة والنشر من أصحاب الحقوق في حالة المقالات المترجمة، ويعد الإذن جزءا من متطلبات النشر.
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-primary font-bold mt-1">•</span>
                  <div>
                    <strong>جودة المحتوى:</strong> تخضع المواد المرسلة للمراجعة العلمية لضمان رصانتها وقيمتها المضافة إلى مجالها.
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-primary font-bold mt-1">•</span>
                  <div>
                    <strong>تحرير النص:</strong> يجب اتباع الخطوط العامة المقررة من منصة الإدارة الثقافية في تنسيق النص وتحريره (يرجى تحميل دليل الإدارة الثقافية لأسلوب التحرير والترجمة).
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-primary font-bold mt-1">•</span>
                  <div>
                    <strong>نوع المادة:</strong> أن تتسق المادة المراد نشرها مع اهتمامات منصة الإدارة الثقافية، وتتماشى مع رؤيتها العامة.
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-primary font-bold mt-1">•</span>
                  <div>
                    <strong>المراجع والمصادر:</strong> يلزم ذكر جميع المراجع في المقالات الفلسفية والعلمية وتوثيقها وفق منهج التوثيق المعتمد من منصة الإدارة الثقافية (الدليل)
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-primary font-bold mt-1">•</span>
                  <div>
                    <strong>الاسم:</strong> لا تُنشر المواد إلا بالاسم الثلاثي الصريح للكاتب أو المترجم.
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-primary font-bold mt-1">•</span>
                  <div>
                    <strong>مواعيد النشر:</strong> يعتمد تاريخ نشر المقالة على خطة نشر منصة الإدارة الثقافية، وعادة يتراوح تاريخ النشر من أسبوع إلى 3 أشهر من تاريخ الموافقة على النشر.
                  </div>
                </div>
              </div>

              {/* Procedural Steps Section */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  خطوات النَّشر الإجرائيّة
                </h2>

                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <span className="text-primary font-bold mt-1 shrink-0">1)</span>
                    <div>
                      يُرسل الكاتب النص المكتوب أو المترجم إلى البريد الإلكتروني الخاص بمنصة الإدارة الثقافية
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="text-primary font-bold mt-1 shrink-0">2)</span>
                    <div>
                      ترد الإدارة الثقافية على طلب النشر عادة في غضون أسبوعين بالموافقة المبدئية أو الرفض.
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="text-primary font-bold mt-1 shrink-0">3)</span>
                    <div>
                      ترسل المشاركات المراد نشرها بـمنصة الإدارة الثقافية عبر البريد الإلكتروني بصيغتين: Word، و PDF.
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="text-primary font-bold mt-1 shrink-0">4)</span>
                    <div>
                      يرفق الباحث نبذة تعريفيّة مختصرة من سيرته الذاتيّة، متضمّنة أبرز أعماله، وبياناته الأساسيّة.
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="text-primary font-bold mt-1 shrink-0">5)</span>
                    <div>
                      تقوم هيئة التحرير في منصة الإدارة الثقافية بالنظر في الأوراق المقدّمة، وتحديد مدى مطابقتها لقواعد النشر وأهدافه في المنصة؛ لتحديد أهليّتها للنشر. وإبلاغ الباحث بنتيجة هذه المرحلة قبولًا أو رفضًا.
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="text-primary font-bold mt-1 shrink-0">6)</span>
                    <div>
                      تقوم منصة الإدارة الثقافية بتكليف المُحكّمين المناسبين من أولي الخبرة والكفاءة، وفقًا للموضوع المقدّم.
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="text-primary font-bold mt-1 shrink-0">7)</span>
                    <div>
                      في حال قبول البحث للنشر يُخطر الباحث بذلك، ويرسل خطاب اعتذار له إن كانت نتيجة التحكيم هي الرفض، مع امتلاك أحقيّة عدم إبداء أسباب الرفض.
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="text-primary font-bold mt-1 shrink-0">8)</span>
                    <div>
                      في حال قبول البحث للنشر تؤول كافة حقوق النشر لمنصة الإدارة الثقافية بكل اللغات والقوالب الورقية والإلكترونية، ولا يجوز إعادة النشر إلا بإذنها.
                    </div>
                  </div>
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
