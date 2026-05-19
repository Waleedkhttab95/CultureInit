import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "@/pages/LandingPage";
import ArticlesPage from "@/pages/ArticlesPage";
import ArticleDetailPage from "@/pages/ArticleDetailPage";
import ResourcesPage from "@/pages/ResourcesPage";
import ProgramsPage from "@/pages/ProgramsPage";
import ProgramRegistrationPage from "@/pages/ProgramRegistrationPage";
import PublishingPolicyPage from "@/pages/PublishingPolicyPage";
import PublishWithUsPage from "@/pages/PublishWithUsPage";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminArticleEditor from "@/pages/admin/AdminArticleEditor";
import RequireAdmin from "@/components/admin/RequireAdmin";

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
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
