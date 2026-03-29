import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ServicePage from "./pages/ServicePage";
import Success from "./pages/Success";
import MobilityAssessment from "./pages/MobilityAssessment";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import RabbitHolePage from "./pages/tr/RabbitHolePage";
import NomadIncubatorPage from "./pages/tr/NomadIncubatorPage";
import DTVVizePage from "./pages/tr/DTVVizePage";
import Webhooks from "./pages/admin/system/Webhooks";
import AdminServices from "./pages/admin/AdminServices";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminLeads from "./pages/admin/AdminLeads";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import LanguageRouter from "./components/LanguageRouter";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LanguageRouter />
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
              <Route path="/residency/:slug" element={<ServicePage />} />
              <Route path="/wellness/:slug" element={<ServicePage />} />
              <Route path="/corporate-retreats/:slug" element={<ServicePage />} />
              <Route path="/expeditions/:slug" element={<ServicePage />} />
              <Route path="/success" element={<Success />} />
              <Route path="/tools/dtv-visa-calculator" element={<MobilityAssessment />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              {/* TR-specific pages */}
              <Route path="/tr" element={<Index />} />
              <Route path="/tr/rabbit-hole" element={<RabbitHolePage />} />
              <Route path="/tr/nomad-incubator" element={<NomadIncubatorPage />} />
              <Route path="/tr/dtv-vize" element={<DTVVizePage />} />
              <Route path="/tr/soft-power" element={<ServicePage />} />
              <Route path="/tr/expeditions" element={<ServicePage />} />
              <Route path="/tr/mice" element={<ServicePage />} />
              {/* Admin Routes */}
              <Route path="/admin/services" element={<AdminRoute><AdminServices /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/leads" element={<AdminRoute><AdminLeads /></AdminRoute>} />
              <Route path="/admin/system/webhooks" element={<AdminRoute><Webhooks /></AdminRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
