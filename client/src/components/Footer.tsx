import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  X,
  Linkedin,
  Instagram,
  ArrowUp
} from "lucide-react";
import whiteLogo from "@assets/white-logo.png";
import letsopsLogo from "@assets/letsops-logo.png";
import { Link } from "wouter";
import { PAGES } from "@shared/seo";
import { useCopy } from "@/i18n/locale";

const COPY = {
  ar: {
    brand: "منصة الإدارة الثقافية",
    about: PAGES.home.meta.ar.description,
    x: "تابعنا على إكس (تويتر)",
    linkedin: "تابعنا على لينكدإن",
    instagram: "تابعنا على إنستغرام",
    quickLinks: "روابط سريعة",
    articles: "المقالات",
    resources: "الموارد",
    programs: "البرامج",
    services: "الخدمات",
    publishing: "النشر",
    publishWithUs: "انشر معنا",
    policy: "سياسة النشر",
    contact: "معلومات التواصل",
    address: "الرياض، المملكة العربية السعودية",
    rights: "© 2025 منصة الإدارة الثقافية. جميع الحقوق محفوظة.",
    builtBy: "تطوير وتشغيل بواسطة",
    top: "العودة للأعلى",
  },
  en: {
    brand: "Cultural Management Platform",
    about: PAGES.home.meta.en.description,
    x: "Follow us on X (Twitter)",
    linkedin: "Follow us on LinkedIn",
    instagram: "Follow us on Instagram",
    quickLinks: "Quick links",
    articles: "Articles",
    resources: "Resources",
    programs: "Programs",
    services: "Services",
    publishing: "Publishing",
    publishWithUs: "Publish with us",
    policy: "Publishing policy",
    contact: "Contact",
    address: "Riyadh, Saudi Arabia",
    rights: "© 2025 Cultural Management Platform. All rights reserved.",
    builtBy: "Developed and operated by",
    top: "Back to top",
  },
};

export default function Footer() {
  const c = useCopy(COPY);
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('Scroll to top triggered');
  };

  const handleSocialClick = (platform: string) => {
    console.log(`${platform} social link clicked`);
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <img
                src={whiteLogo}
                alt={c.brand}
                className="h-8 w-auto mb-4"
                loading="lazy"
                data-testid="logo-footer"
              />
              <p className="text-background/80 leading-relaxed mb-6 max-w-md">
                {c.about}
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-background/80 hover:text-background hover:bg-background/10"
                  asChild
                  data-testid="link-twitter"
                >
                  <a
                    href="https://x.com/culturalmgmt?s=21&t=l9ET_F7SR5ITa2IH2yZb3A"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={c.x}
                    onClick={() => handleSocialClick('Twitter')}
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </a>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-background/80 hover:text-background hover:bg-background/10"
                  asChild
                  data-testid="link-linkedin"
                >
                  <a
                    href="https://www.linkedin.com/company/%D8%A7%D9%84%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9-%D8%A7%D9%84%D8%AB%D9%82%D8%A7%D9%81%D9%8A%D8%A9/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={c.linkedin}
                    onClick={() => handleSocialClick('LinkedIn')}
                  >
                    <Linkedin className="h-5 w-5" aria-hidden="true" />
                  </a>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-background/80 hover:text-background hover:bg-background/10"
                  asChild
                  data-testid="link-instagram"
                >
                  <a
                    href="https://www.instagram.com/cultural_management?igsh=YTBoYjNtbzd3bGw5"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={c.instagram}
                    onClick={() => handleSocialClick('Instagram')}
                  >
                    <Instagram className="h-5 w-5" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-background mb-4">{c.quickLinks}</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/articles">
                    <a className="text-background/80 hover:text-background transition-colors" data-testid="footer-link-articles">
                      {c.articles}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/resources">
                    <a className="text-background/80 hover:text-background transition-colors" data-testid="footer-link-resources">
                      {c.resources}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/programs">
                    <a className="text-background/80 hover:text-background transition-colors" data-testid="footer-link-programs">
                      {c.programs}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/services">
                    <a className="text-background/80 hover:text-background transition-colors" data-testid="footer-link-services">
                      {c.services}
                    </a>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Publishing */}
            <div>
              <h4 className="font-semibold text-background mb-4">{c.publishing}</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/publish-with-us">
                    <a className="text-background/80 hover:text-background transition-colors" data-testid="footer-link-publish-with-us">
                      {c.publishWithUs}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/publishing-policy">
                    <a
                      className="text-background/80 hover:text-background transition-colors"
                      data-testid="footer-link-publishing-policy"
                      onClick={handleScrollToTop}
                    >
                      {c.policy}
                    </a>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-background mb-4">{c.contact}</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-background/80 text-sm">{c.address}</span>
                </div>
                <a
                  href="mailto:info@cultural-managment.com"
                  className="flex items-center gap-3 text-background/80 hover:text-background transition-colors"
                  data-testid="contact-email"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm" dir="ltr">info@cultural-managment.com</span>
                </a>
                <a
                  href="tel:+966590838771"
                  className="flex items-center gap-3 text-background/80 hover:text-background transition-colors"
                  data-testid="contact-phone"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm" dir="ltr">+966 59 083 8771</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-background/20 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm text-center sm:text-start">
              {c.rights}
            </p>

            <div className="flex items-center gap-2 text-background/50 text-xs">
              <span>{c.builtBy}</span>
              <a
                href="https://letsops.co"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <img
                  src={letsopsLogo}
                  alt="Let'sOps"
                  className="h-5 w-auto"
                  loading="lazy"
                />
                <span className="text-background/70 font-medium">Let'sOps</span>
              </a>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={handleScrollToTop}
              className="text-background/80 hover:text-background hover:bg-background/10 gap-2"
              data-testid="button-scroll-top"
            >
              {c.top}
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}