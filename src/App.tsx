import { lazy, Suspense, useEffect } from "react";
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
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import LanguageRouter from "./components/LanguageRouter";

// Lazy-loaded routes — split off the entry bundle
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const Success = lazy(() => import("./pages/Success"));
const MobilityAssessment = lazy(() => import("./pages/MobilityAssessment"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));

const RabbitHolePage = lazy(() => import("./pages/tr/RabbitHolePage"));
const NomadIncubatorPage = lazy(() => import("./pages/tr/NomadIncubatorPage"));
const DTVVizePage = lazy(() => import("./pages/tr/DTVVizePage"));
const SoftPowerPage = lazy(() => import("./pages/tr/SoftPowerPage"));
const MICEPage = lazy(() => import("./pages/tr/MICEPage"));
const ExpeditionsPage = lazy(() => import("./pages/tr/ExpeditionsPage"));
const VietnamPage = lazy(() => import("./pages/tr/VietnamPage"));
const CambodyaPage = lazy(() => import("./pages/tr/CambodyaPage"));

const SoftPowerPageEN = lazy(() => import("./pages/en/SoftPowerPageEN"));
const NomadIncubatorPageEN = lazy(() => import("./pages/en/NomadIncubatorPageEN"));
const DTVPageEN = lazy(() => import("./pages/en/DTVPageEN"));
const ExpeditionsPageEN = lazy(() => import("./pages/en/ExpeditionsPageEN"));
const WellnessPageEN = lazy(() => import("./pages/en/WellnessPageEN"));
const MICEPageEN = lazy(() => import("./pages/en/MICEPageEN"));
const VietnamPageEN = lazy(() => import("./pages/en/VietnamPageEN"));
const CambodiaPageEN = lazy(() => import("./pages/en/CambodiaPageEN"));

const Webhooks = lazy(() => import("./pages/admin/system/Webhooks"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));

const queryClient = new QueryClient();

/** 301-equivalent redirect preserving query params + hash */
function RedirectWithQuery({ to }: { to: string }) {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}${location.hash}`} replace />;
}

/** Idle-prefetch conversion-critical routes after first paint */
function CriticalPrefetch() {
  useEffect(() => {
    const runIdle = (cb: () => void) => {
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
      if (typeof ric === 'function') ric(cb);
      else setTimeout(cb, 50);
    };
    runIdle(() => {
      import("./pages/MobilityAssessment");
      import("./pages/Success");
    });
  }, []);
  return null;
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
            <CriticalPrefetch />
            <Suspense fallback={null}>
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
            </Suspense>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
