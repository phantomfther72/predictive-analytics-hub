
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingFallback } from "@/components/ui/LoadingFallback";
import { ErrorFallback } from "@/components/ui/ErrorFallback";

// Critical pages loaded immediately
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";

// Lazy load secondary pages
const PredictivePlatform = lazy(() => import("./pages/PredictivePlatform"));
const Settings = lazy(() => import("./pages/Settings"));
const Profile = lazy(() => import("./pages/Profile"));

// Lazy load industry pages  
const HousingMarket = lazy(() => import("./pages/HousingMarket"));
const AgricultureMarket = lazy(() => import("./pages/AgricultureMarket"));
const MiningMarket = lazy(() => import("./pages/MiningMarket"));
const GreenHydrogenMarket = lazy(() => import("./pages/GreenHydrogenMarket"));
const FinancialMarket = lazy(() => import("./pages/FinancialMarket"));
const MedicalMarket = lazy(() => import("./pages/MedicalMarket"));
const CryptocurrencyMarket = lazy(() => import("./pages/CryptocurrencyMarket"));
const GlobalEquityPage = lazy(() => import("./pages/GlobalEquityPage"));
const OpportunitiesPage = lazy(() => import("./pages/OpportunitiesPage"));
const InvestorHub = lazy(() => import("./pages/InvestorHub"));
const Terminal = lazy(() => import("./pages/Terminal"));
const Tourism = lazy(() => import("./pages/Tourism"));
const Education = lazy(() => import("./pages/Education"));
const Infrastructure = lazy(() => import("./pages/Infrastructure"));
const MediaEntertainment = lazy(() => import("./pages/MediaEntertainment"));
const Roadmap = lazy(() => import("./pages/Roadmap"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Standalone pages */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/thank-you" element={<ThankYou />} />
              
              {/* App layout pages - Protected Routes */}
              <Route path="/dashboard/*" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="industries" element={<Dashboard />} />
                <Route path="predictions" element={<Dashboard />} />
                <Route path="analytics" element={<Dashboard />} />
                <Route path="settings" element={<Settings />} />
                <Route path="feedback" element={<Dashboard />} />
              </Route>
              
              {/* Predictive Platform - Main App */}
              <Route path="/predictive-platform" element={<AppLayout />}>
                <Route index element={
                  <Suspense fallback={<LoadingFallback />}>
                    <PredictivePlatform />
                  </Suspense>
                } />
              </Route>
              
              {/* Industry pages with app layout and lazy loading */}
              <Route path="/housing-market" element={<AppLayout />}>
                <Route index element={
                  <Suspense fallback={<LoadingFallback />}>
                    <HousingMarket />
                  </Suspense>
                } />
              </Route>
              <Route path="/agriculture-market" element={<AppLayout />}>
                <Route index element={
                  <Suspense fallback={<LoadingFallback />}>
                    <AgricultureMarket />
                  </Suspense>
                } />
              </Route>
              <Route path="/mining-market" element={<AppLayout />}>
                <Route index element={
                  <Suspense fallback={<LoadingFallback />}>
                    <MiningMarket />
                  </Suspense>
                } />
              </Route>
              <Route path="/green-hydrogen-market" element={<AppLayout />}>
                <Route index element={
                  <Suspense fallback={<LoadingFallback />}>
                    <GreenHydrogenMarket />
                  </Suspense>
                } />
              </Route>
              <Route path="/financial-market" element={<AppLayout />}>
                <Route index element={
                  <Suspense fallback={<LoadingFallback />}>
                    <FinancialMarket />
                  </Suspense>
                } />
              </Route>
              <Route path="/medical-market" element={<AppLayout />}>
                <Route index element={<Suspense fallback={<LoadingFallback />}><MedicalMarket /></Suspense>} />
              </Route>
              <Route path="/cryptocurrency-market" element={<AppLayout />}>
                <Route index element={<Suspense fallback={<LoadingFallback />}><CryptocurrencyMarket /></Suspense>} />
              </Route>
              <Route path="/global-equity" element={<AppLayout />}>
                <Route index element={<Suspense fallback={<LoadingFallback />}><GlobalEquityPage /></Suspense>} />
              </Route>
              <Route path="/opportunities" element={<AppLayout />}>
                <Route index element={<Suspense fallback={<LoadingFallback />}><OpportunitiesPage /></Suspense>} />
              </Route>
              <Route path="/investor-hub" element={<AppLayout />}>
                <Route index element={<Suspense fallback={<LoadingFallback />}><InvestorHub /></Suspense>} />
              </Route>
              <Route path="/terminal" element={<AppLayout />}>
                <Route index element={<Suspense fallback={<LoadingFallback />}><Terminal /></Suspense>} />
              </Route>
              <Route path="/profile" element={<AppLayout />}>
                <Route index element={<Suspense fallback={<LoadingFallback />}><Profile /></Suspense>} />
              </Route>
              <Route path="/settings" element={<AppLayout />}>
                <Route index element={<Suspense fallback={<LoadingFallback />}><Settings /></Suspense>} />
              </Route>
              <Route path="/tourism" element={<AppLayout />}>
                <Route index element={<Suspense fallback={<LoadingFallback />}><Tourism /></Suspense>} />
              </Route>
              <Route path="/education" element={<AppLayout />}>
                <Route index element={<Suspense fallback={<LoadingFallback />}><Education /></Suspense>} />
              </Route>
              <Route path="/infrastructure" element={<AppLayout />}>
                <Route index element={<Suspense fallback={<LoadingFallback />}><Infrastructure /></Suspense>} />
              </Route>
              <Route path="/media-entertainment" element={<AppLayout />}>
                <Route index element={<Suspense fallback={<LoadingFallback />}><MediaEntertainment /></Suspense>} />
              </Route>
              <Route path="/roadmap" element={<AppLayout />}>
                <Route index element={<Suspense fallback={<LoadingFallback />}><Roadmap /></Suspense>} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
