import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/use-admin-auth";

// Client-side guard. Server routes independently enforce auth, so this is
// purely UX — it redirects unauthenticated visitors to the login screen.
export default function RequireAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAdminAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/admin/login");
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        جارٍ التحميل...
      </div>
    );
  }
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
