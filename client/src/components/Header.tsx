import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import mainLogo from "@assets/main-logo.png";
import { Link } from "wouter";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <a aria-label="Go to homepage">
                  <img 
                    src={mainLogo} 
                    alt="منصة الإدارة الثقافية" 
                    className="h-10 w-auto cursor-pointer"
                    data-testid="logo-main"
                  />
                </a>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 space-x-reverse">
              <Link href="/articles">
                <a
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  data-testid="link-articles"
                >
                  المقالات
                </a>
              </Link>
              <Link href="/resources">
                <a
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  data-testid="link-resources"
                >
                  الموارد
                </a>
              </Link>
              <Link href="/programs">
                <a
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  data-testid="link-programs"
                >
                  البرامج
                </a>
              </Link>
              <Link href="/publish-with-us">
                <a>
                  <Button size="sm" data-testid="button-contact">
                    تواصل معنا
                  </Button>
                </a>
              </Link>
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="القائمة"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              data-testid="button-menu-toggle"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                  المقالات
                </a>
              </Link>
              <Link href="/resources">
                <a
                  className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                  data-testid="link-mobile-resources"
                >
                  الموارد
                </a>
              </Link>
              <Link href="/programs">
                <a
                  className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                  data-testid="link-mobile-programs"
                >
                  البرامج
                </a>
              </Link>
              <Link href="/publish-with-us">
                <a onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full mt-2" size="sm" data-testid="button-mobile-contact">
                    تواصل معنا
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