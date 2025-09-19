import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                src="/attached_assets/00 الشعار الرئيسي_1758304639237.png" 
                alt="مبادرة الإدارة الثقافية" 
                className="h-10 w-auto"
                data-testid="logo-main"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 space-x-reverse">
              <a
                href="#about"
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid="link-about"
              >
                حول المبادرة
              </a>
              <a
                href="#tracks"
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid="link-tracks"
              >
                المسارات
              </a>
              <a
                href="#audience"
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid="link-audience"
              >
                الجمهور المستهدف
              </a>
              <Button size="sm" data-testid="button-contact">
                تواصل معنا
              </Button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-menu-toggle"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#about"
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
                data-testid="link-mobile-about"
              >
                حول المبادرة
              </a>
              <a
                href="#tracks"
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
                data-testid="link-mobile-tracks"
              >
                المسارات
              </a>
              <a
                href="#audience"
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
                data-testid="link-mobile-audience"
              >
                الجمهور المستهدف
              </a>
              <Button className="w-full mt-2" size="sm" data-testid="button-mobile-contact">
                تواصل معنا
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}