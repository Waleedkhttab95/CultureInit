import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Accessible light/dark toggle. Crossfades the sun/moon icons using only
 * transform + opacity (no layout animation, no bounce) per the motion guidelines.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid rendering the wrong icon before the theme is resolved on the client.
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      data-testid="button-theme-toggle"
      className={className}
    >
      {mounted ? (
        <span className="relative inline-flex h-5 w-5 items-center justify-center">
          <Sun
            className="absolute h-5 w-5 transition-all duration-300 ease-out rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0"
            aria-hidden="true"
          />
          <Moon
            className="absolute h-5 w-5 transition-all duration-300 ease-out rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100"
            aria-hidden="true"
          />
        </span>
      ) : (
        // Reserve space so layout doesn't shift once mounted.
        <span className="inline-flex h-5 w-5" aria-hidden="true" />
      )}
    </Button>
  );
}
