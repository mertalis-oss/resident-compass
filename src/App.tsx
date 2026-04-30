import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import SoftPowerPage from "./pages/tr/SoftPowerPage";
import MICEPage from "./pages/tr/MICEPage";
import ExpeditionsPage from "./pages/tr/ExpeditionsPage";
import Webhooks from "./pages/admin/system/Webhooks";
import AdminServices from "./pages/admin/AdminServices";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminCustomers from "./pages/admin/AdminCustomers";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import LanguageRouter from "./components/LanguageRouter";
import SoftPowerPageEN from "./pages/en/SoftPowerPageEN";
import NomadIncubatorPageEN from "./pages/en/NomadIncubatorPageEN";
import DTVPageEN from "./pages/en/DTVPageEN";
import ExpeditionsPageEN from "./pages/en/ExpeditionsPageEN";
import WellnessPageEN from "./pages/en/WellnessPageEN";
import MICEPageEN from "./pages/en/MICEPageEN";
import VietnamPageEN from "./pages/en/VietnamPageEN";
import VietnamPage from "./pages/tr/VietnamPage";
import CambodyaPage from "./pages/tr/CambodyaPage";
import CambodiaPageEN from "./pages/en/CambodiaPageEN";

const queryClient = new QueryClient();

/** 301-equivalent redirect preserving query params + hash */
function RedirectWithQuery({ to }: { to: string }) {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}${location.hash}`} replace />;
}

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
              {/* EN category pages — exact routes above catch-alls */}
              <Route path="/visas/thailand-dtv" element={<DTVPageEN />} />
              <Route path="/visas/soft-power" element={<SoftPowerPageEN />} />
              <Route path="/relocation/nomad-incubator" element={<NomadIncubatorPageEN />} />
              <Route path="/experiences/expeditions" element={<ExpeditionsPageEN />} />
              <Route path="/experiences/wellness" element={<WellnessPageEN />} />
              <Route path="/corporate/mice" element={<MICEPageEN />} />
              <Route path="/destinations/vietnam" element={<VietnamPageEN />} />
              <Route path="/destinations/cambodia" element={<CambodiaPageEN />} />

              {/* 301-equivalent redirects from old paths */}
              <Route path="/residency/soft-power" element={<RedirectWithQuery to="/visas/soft-power" />} />
              <Route
                path="/residency/nomad-incubator"
                element={<RedirectWithQuery to="/relocation/nomad-incubator" />}
              />

              {/* Dynamic single-service catch-alls */}
              <Route path="/residency/:slug" element={<ServicePage />} />
              <Route path="/wellness/:slug" element={<ServicePage />} />
              <Route path="/corporate-retreats/:slug" element={<ServicePage />} />
              <Route path="/expeditions/:slug" element={<ServicePage />} />
              <Route path="/success" element={<Success />} />
              <Route path="/checkout/advisory" element={<MobilityAssessment />} />
              <Route path="/tools/dtv-visa-calculator" element={<MobilityAssessment />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />

              {/* TR-specific pages */}
              <Route path="/tr" element={<Index />} />
              <Route path="/tr/rabbit-hole" element={<RabbitHolePage />} />
              <Route path="/tr/vietnam" element={<VietnamPage />} />
              <Route path="/tr/cambodia" element={<CambodyaPage />} />

              {/* TR canonical URLs per sitemap */}
              <Route path="/vizeler/dtv-vize" element={<DTVVizePage />} />
              <Route path="/vizeler/soft-power" element={<SoftPowerPage />} />
              <Route path="/yerlesim/nomad-incubator" element={<NomadIncubatorPage />} />
              <Route path="/deneyimler/expeditions" element={<ExpeditionsPage />} />
              <Route path="/deneyimler/mice" element={<MICEPage />} />

              {/* Old /tr/* URLs → 301 redirect to canonical TR URLs */}
              <Route path="/tr/dtv-vize" element={<RedirectWithQuery to="/vizeler/dtv-vize" />} />
              <Route path="/tr/soft-power" element={<RedirectWithQuery to="/vizeler/soft-power" />} />
              <Route path="/tr/nomad-incubator" element={<RedirectWithQuery to="/yerlesim/nomad-incubator" />} />
              <Route path="/tr/expeditions" element={<RedirectWithQuery to="/deneyimler/expeditions" />} />
              <Route path="/tr/mice" element={<RedirectWithQuery to="/deneyimler/mice" />} />

              {/* Admin Routes */}
              <Route
                path="/admin/services"
                element={
                  <AdminRoute>
                    <AdminServices />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/leads"
                element={
                  <AdminRoute>
                    <AdminLeads />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/customers"
                element={
                  <AdminRoute>
                    <AdminCustomers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/system/webhooks"
                element={
                  <AdminRoute>
                    <Webhooks />
                  </AdminRoute>
                }
              />

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
