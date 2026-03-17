import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ServicePage from "./pages/ServicePage";
import MobilityAssessment from "./pages/MobilityAssessment";
import DTVPage from "./pages/DTVPage";
import WellnessPage from "./pages/WellnessPage";
import AdventurePage from "./pages/AdventurePage";
import MICEPage from "./pages/MICEPage";
import Webhooks from "./pages/admin/system/Webhooks";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* Showcase-style editorial pages */}
            <Route path="/dtv-vize" element={<DTVPage />} />
            <Route path="/wellness" element={<WellnessPage />} />
            <Route path="/adventure" element={<AdventurePage />} />
            <Route path="/mice" element={<MICEPage />} />
            {/* Legacy service routes */}
            <Route path="/residency/:slug" element={<ServicePage />} />
            <Route path="/wellness/:slug" element={<ServicePage />} />
            <Route path="/corporate-retreats/:slug" element={<ServicePage />} />
            <Route path="/expeditions/:slug" element={<ServicePage />} />
            {/* Tools */}
            <Route path="/tools/dtv-visa-calculator" element={<MobilityAssessment />} />
            {/* Admin */}
            <Route path="/admin/system/webhooks" element={<Webhooks />} />
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
