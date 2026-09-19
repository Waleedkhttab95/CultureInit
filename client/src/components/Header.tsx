import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import mainLogo from "@assets/main-logo.png";
import { Link } from "wouter";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useCopy } from "@/i18n/locale";

const COPY = {
  ar: {
    home: "الانتقال إلى الصفحة الرئيسية",
    logoAlt: "منصة الإدارة الثقافية",
    articles: "المقالات",
    resources: "الموارد",
    programs: "البرامج",
    services: "الخدمات",
    contact: "تواصل معنا",
    menu: "القائمة",
  },
  en: {
    home: "Go to homepage",
    logoAlt: "Cultural Management Platform",
    articles: "Articles",
    resources: "Resources",
    programs: "Programs",
    services: "Services",
    contact: "Contact us",
    menu: "Menu",
  },
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const c = useCopy(COPY);

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <a aria-label={c.home}>
                  <img 
                    src={mainLogo} 
                    alt={c.logoAlt} 
                    className="h-10 w-auto cursor-pointer"
                    data-testid="logo-main"
                  />
                </a>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="me-10 flex items-baseline gap-x-4">
              <Link href="/articles">
                <a
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  data-testid="link-articles"
                >
                  {c.articles}
                </a>
              </Link>
              <Link href="/resources">
                <a
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  data-testid="link-resources"
                >
                  {c.resources}
                </a>
              </Link>
              <Link href="/programs">
                <a
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  data-testid="link-programs"
                >
                  {c.programs}
                </a>
              </Link>
              <Link href="/services">
                <a
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  data-testid="link-services"
                >
                  {c.services}
                </a>
              </Link>
              <Link href="/publish-with-us">
                <a>
                  <Button size="sm" data-testid="button-contact">
                    {c.contact}
                  </Button>
                </a>
              </Link>
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 md:hidden">
            <LanguageSwitcher />
            <ThemeToggle className="h-11 w-11" />
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={c.menu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              data-testid="button-menu-toggle"
            >
              {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/articles">
                <a
                  className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                  data-testid="link-mobile-articles"
                >
                  {c.articles}
                </a>
              </Link>
              <Link href="/resources">
                <a
                  className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                  data-testid="link-mobile-resources"
                >
                  {c.resources}
                </a>
              </Link>
              <Link href="/programs">
                <a
                  className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                  data-testid="link-mobile-programs"
                >
                  {c.programs}
                </a>
              </Link>
              <Link href="/services">
                <a
                  className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                  data-testid="link-mobile-services"
                >
                  {c.services}
                </a>
              </Link>
              <Link href="/publish-with-us">
                <a onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full mt-2" size="sm" data-testid="button-mobile-contact">
                    {c.contact}
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}