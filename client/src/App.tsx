import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import RequireAdmin from "@/components/admin/RequireAdmin";
import { LocaleProvider } from "@/i18n/locale";

// Code-split routes so the heavy editor (TipTap) and admin bundle stay out of
// the initial download for public visitors.
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const ArticlesPage = lazy(() => import("@/pages/ArticlesPage"));
const ArticleDetailPage = lazy(() => import("@/pages/ArticleDetailPage"));
const ResourcesPage = lazy(() => import("@/pages/ResourcesPage"));
const ResourceDetailPage = lazy(() => import("@/pages/ResourceDetailPage"));
const ProgramsPage = lazy(() => import("@/pages/ProgramsPage"));
const ProgramRegistrationPage = lazy(() => import("@/pages/ProgramRegistrationPage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const PublishingPolicyPage = lazy(() => import("@/pages/PublishingPolicyPage"));
const PublishWithUsPage = lazy(() => import("@/pages/PublishWithUsPage"));
const NotFound = lazy(() => import("@/pages/not-found"));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminArticleEditor = lazy(() => import("@/pages/admin/AdminArticleEditor"));

function RouteFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background"
      role="status"
      aria-label="جارٍ التحميل"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

// Component to scroll to top on route change
function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

// The public routes. Rendered twice: once un-prefixed (Arabic) and once nested
// under /en (English). Inside the nested router wouter prefixes every
// <Link href="/x"> with /en automatically, so components stay locale-agnostic.
function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/articles" component={ArticlesPage} />
        <Route path="/articles/:id" component={ArticleDetailPage} />
        <Route path="/resources" component={ResourcesPage} />
        <Route path="/resources/:id" component={ResourceDetailPage} />
        <Route path="/programs" component={ProgramsPage} />
        <Route path="/programs/register" component={ProgramRegistrationPage} />
        <Route path="/services" component={ServicesPage} />
        <Route path="/publishing-policy" component={PublishingPolicyPage} />
        <Route path="/publish-with-us" component={PublishWithUsPage} />
        {/* Admin CMS (Arabic only) */}
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/articles/new">
          <RequireAdmin>
            <AdminArticleEditor />
          </RequireAdmin>
        </Route>
        <Route path="/admin/articles/:id/edit">
          <RequireAdmin>
            <AdminArticleEditor />
          </RequireAdmin>
        </Route>
        <Route path="/admin">
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        </Route>
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/en" nest>
          <LocaleProvider locale="en">
            <AppRoutes />
          </LocaleProvider>
        </Route>
        <Route>
          <LocaleProvider locale="ar">
            <AppRoutes />
          </LocaleProvider>
        </Route>
      </Switch>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
