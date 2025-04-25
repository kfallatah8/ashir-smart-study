
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./hooks/use-language";
import Index from "./pages/Index";
import StudyZone from "./pages/StudyZone";
import Documents from "./pages/Documents";
import Achievements from "./pages/Achievements";
import Leaderboards from "./pages/Leaderboards";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Create a new query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/study" element={<StudyZone />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
