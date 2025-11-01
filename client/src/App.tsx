import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "@/pages/LandingPage";
import ArticlesPage from "@/pages/ArticlesPage";
import ResourcesPage from "@/pages/ResourcesPage";
import ProgramsPage from "@/pages/ProgramsPage";
import PublishingPolicyPage from "@/pages/PublishingPolicyPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/articles" component={ArticlesPage} />
      <Route path="/resources" component={ResourcesPage} />
      <Route path="/programs" component={ProgramsPage} />
      <Route path="/publishing-policy" component={PublishingPolicyPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
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
