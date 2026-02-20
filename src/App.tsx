import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import MyLeaves from "./pages/MyLeaves";
import TeamCalendar from "./pages/TeamCalendar";
import ProjectDeadlines from "./pages/ProjectDeadlines";
import WorkloadAnalyzer from "./pages/WorkloadAnalyzer";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/my-leaves" element={<MyLeaves />} />
              <Route path="/team-calendar" element={<TeamCalendar />} />
              <Route path="/project-deadlines" element={<ProjectDeadlines />} />
              <Route path="/workload" element={<WorkloadAnalyzer />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
