import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useCopy, useLocale } from "@/i18n/locale";
import { COPY } from "@shared/copy/publishing-policy";


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
