
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import GlobalEquityPage from "./pages/GlobalEquityPage";
import PredictivePlatform from "./pages/PredictivePlatform";
import HousingMarket from "./pages/HousingMarket";
import AgricultureMarket from "./pages/AgricultureMarket";
import MiningMarket from "./pages/MiningMarket";
import GreenHydrogenMarket from "./pages/GreenHydrogenMarket";
import FinancialMarket from "./pages/FinancialMarket";
import MedicalMarket from "./pages/MedicalMarket";
import CryptocurrencyMarket from "./pages/CryptocurrencyMarket";
import Auth from "./pages/Auth";
import Pricing from "./pages/Pricing";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import NotFound from "./pages/NotFound";

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
              
              {/* App layout pages - Protected Routes */}
              <Route path="/dashboard/*" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="industries" element={<Dashboard />} />
                <Route path="predictions" element={<Dashboard />} />
                <Route path="analytics" element={<Dashboard />} />
                <Route path="settings" element={<Dashboard />} />
                <Route path="feedback" element={<Dashboard />} />
              </Route>
              
              {/* Predictive Platform - Main App */}
              <Route path="/predictive-platform" element={<AppLayout />}>
                <Route index element={<PredictivePlatform />} />
              </Route>
              
              {/* Industry pages with app layout */}
              <Route path="/housing-market" element={<AppLayout />}>
                <Route index element={<HousingMarket />} />
              </Route>
              <Route path="/agriculture-market" element={<AppLayout />}>
                <Route index element={<AgricultureMarket />} />
              </Route>
              <Route path="/mining-market" element={<AppLayout />}>
                <Route index element={<MiningMarket />} />
              </Route>
              <Route path="/green-hydrogen-market" element={<AppLayout />}>
                <Route index element={<GreenHydrogenMarket />} />
              </Route>
              <Route path="/financial-market" element={<AppLayout />}>
                <Route index element={<FinancialMarket />} />
              </Route>
              <Route path="/medical-market" element={<AppLayout />}>
                <Route index element={<MedicalMarket />} />
              </Route>
              <Route path="/cryptocurrency-market" element={<AppLayout />}>
                <Route index element={<CryptocurrencyMarket />} />
              </Route>
              <Route path="/global-equity" element={<AppLayout />}>
                <Route index element={<GlobalEquityPage />} />
              </Route>
              <Route path="/opportunities" element={<AppLayout />}>
                <Route index element={<OpportunitiesPage />} />
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
