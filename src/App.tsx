
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
              <Route path="/" element={<Index />} />
              <Route path="/dashboard/*" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="industries" element={<Dashboard />} />
                <Route path="predictions" element={<Dashboard />} />
                <Route path="analytics" element={<Dashboard />} />
                <Route path="admin" element={<Dashboard />} />
                <Route path="settings" element={<Dashboard />} />
              </Route>
              <Route path="/global-equity" element={<GlobalEquityPage />} />
              <Route path="/predictive-platform" element={<PredictivePlatform />} />
              <Route path="/housing-market" element={<HousingMarket />} />
              <Route path="/agriculture-market" element={<AgricultureMarket />} />
              <Route path="/mining-market" element={<MiningMarket />} />
              <Route path="/green-hydrogen-market" element={<GreenHydrogenMarket />} />
              <Route path="/financial-market" element={<FinancialMarket />} />
              <Route path="/medical-market" element={<MedicalMarket />} />
              <Route path="/cryptocurrency-market" element={<CryptocurrencyMarket />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/opportunities" element={<OpportunitiesPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
