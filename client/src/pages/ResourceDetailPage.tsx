import { useState } from "react";
import { Link, useParams } from "wouter";
import { Download, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { BackArrow } from "@/components/DirectionalIcons";
import ResourceDownloadDialog from "@/components/ResourceDownloadDialog";
import resourcesData from "@/data/resources.json";
import {
  BRAND,
  RESOURCES_PATH,
  absoluteAsset,
  absoluteUrl,
  breadcrumbLd,
  resourceLd,
  truncateDescription,
} from "@shared/seo";
import { resourceHref } from "@/i18n/locale";

// Guides are Arabic-only content (like articles), so this page always renders
// in Arabic — the server 301s /en/resources/:id here.
export default function ResourceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const resource = resourcesData.find((r) => r.id === id);
  const [open, setOpen] = useState(false);

  if (!resource) {
    return (
      <div className="min-h-screen bg-background font-sans flex flex-col">
        <SEO notFound locale="ar" />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">الدليل غير موجود</h1>
            <Link href="/resources">
              <Button>العودة إلى الموارد</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const others = resourcesData.filter((r) => r.id !== resource.id);
  const url = absoluteUrl("ar", `${RESOURCES_PATH}/${resource.id}`);

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <SEO
        locale="ar"
        title={`${resource.title} | ${BRAND.ar}`}
        description={truncateDescription(resource.description)}
        path={`${RESOURCES_PATH}/${resource.id}`}
        image={absoluteAsset(resource.image)}
        alternates={false}
        jsonLd={[
          resourceLd(resource),
          breadcrumbLd([
            { name: BRAND.ar, url: absoluteUrl("ar", "/") },
            { name: "الموارد", url: absoluteUrl("ar", RESOURCES_PATH) },
            { name: resource.title, url },
          ]),
        ]}
      />
      <Header />

      <main className="flex-1 bg-gradient-to-br from-primary/10 via-background to-background py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/resources">
            <Button variant="ghost" className="mb-8 gap-2">
              <BackArrow className="h-4 w-4" />
              العودة إلى الموارد
            </Button>
          </Link>

          <article className="grid md:grid-cols-[minmax(0,320px)_1fr] gap-10 items-start">
            <div className="rounded-2xl bg-card border border-card-border p-6 shadow-sm">
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full max-h-[420px] object-contain"
              />
            </div>

            <div>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-5">
                <FileText className="h-4 w-4" aria-hidden="true" />
                دليل PDF
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 leading-tight">
                {resource.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {resource.description}
              </p>
              <Button
                size="lg"
                onClick={() => setOpen(true)}
                className="h-14 px-8 text-lg font-semibold rounded-xl shadow-sm"
                data-testid="button-download-guide"
              >
                <Download className="h-5 w-5" />
                تحميل الدليل
              </Button>
            </div>
          </article>

          {others.length > 0 && (
            <section className="mt-16 pt-10 border-t border-border" aria-labelledby="more-guides">
              <h2 id="more-guides" className="text-2xl font-bold text-foreground mb-6">
                أدلة أخرى
              </h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {others.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={resourceHref(r.id)}
                      className="block p-5 rounded-xl bg-card border border-card-border hover:border-primary/40 hover:shadow-md transition-all duration-300 font-semibold text-foreground"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>

      <Footer />

      <ResourceDownloadDialog resource={resource} open={open} onOpenChange={setOpen} />
    </div>
  );
}
