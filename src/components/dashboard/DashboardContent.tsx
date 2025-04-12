
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { DashboardOverview } from "./DashboardOverview";
import { DashboardCharts } from "./DashboardCharts";
import { DashboardTables } from "./DashboardTables";
import { DashboardProfile } from "./DashboardProfile";
import { IndustryView } from "@/components/industry/IndustryView";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import HousingMarket from "@/pages/HousingMarket";
import AgricultureMarket from "@/pages/AgricultureMarket";
import MiningMarket from "@/pages/MiningMarket";
import GreenHydrogenMarket from "@/pages/GreenHydrogenMarket";
import FinancialMarket from "@/pages/FinancialMarket";
import CryptocurrencyMarket from "@/pages/CryptocurrencyMarket";
import MedicalMarket from "@/pages/MedicalMarket";
import NotFound from "@/pages/NotFound";
import { MarketType } from "@/types/market";

export const DashboardContent = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  return (
    <main className={`flex-1 ${isMobile ? 'space-y-6' : 'container space-y-8'}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/charts" element={<DashboardCharts />} />
            <Route path="/tables" element={<DashboardTables />} />
            <Route path="/profile" element={<DashboardProfile />} />
            
            {/* Industry routes - consistent naming pattern */}
            <Route path="/industry/:industryType" element={<IndustryViewWrapper />} />
            
            {/* Catch-all route for dashboard - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

// Wrapper component to extract the industry parameter
const IndustryViewWrapper = () => {
  const location = useLocation();
  const industryType = location.pathname.split('/').pop() as MarketType;
  
  return <IndustryView industry={industryType} />;
};
