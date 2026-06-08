import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import RequireAdmin from "@/components/admin/RequireAdmin";

// Code-split routes so the heavy editor (TipTap) and admin bundle stay out of
// the initial download for public visitors.
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const ArticlesPage = lazy(() => import("@/pages/ArticlesPage"));
const ArticleDetailPage = lazy(() => import("@/pages/ArticleDetailPage"));
const ResourcesPage = lazy(() => import("@/pages/ResourcesPage"));
const ProgramsPage = lazy(() => import("@/pages/ProgramsPage"));
const ProgramRegistrationPage = lazy(() => import("@/pages/ProgramRegistrationPage"));
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

function Router() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/articles" component={ArticlesPage} />
        <Route path="/articles/:id" component={ArticleDetailPage} />
        <Route path="/resources" component={ResourcesPage} />
        <Route path="/programs" component={ProgramsPage} />
        <Route path="/programs/register" component={ProgramRegistrationPage} />
        <Route path="/publishing-policy" component={PublishingPolicyPage} />
        <Route path="/publish-with-us" component={PublishWithUsPage} />
        {/* Admin CMS */}
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
