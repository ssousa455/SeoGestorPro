import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/pages/dashboard";
import MyProjects from "@/pages/my-projects";
import ClientProjects from "@/pages/client-projects";
import KeywordAnalysis from "@/pages/keyword-analysis";
import Clusters from "@/pages/clusters";
import SeoImprovements from "@/pages/seo-improvements";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import Help from "@/pages/help";
import { useEffect, useState } from "react";

function Router() {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location]);

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Overlay for sidebar on mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex flex-col w-full min-h-screen">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-6 md:pl-[15.5rem] pt-16">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/meus-projetos" component={MyProjects} />
            <Route path="/projetos-clientes" component={ClientProjects} />
            <Route path="/analise-keywords" component={KeywordAnalysis} />
            <Route path="/clusters" component={Clusters} />
            <Route path="/melhorias-seo" component={SeoImprovements} />
            <Route path="/relatorios" component={Reports} />
            <Route path="/configuracoes" component={Settings} />
            <Route path="/ajuda" component={Help} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
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
