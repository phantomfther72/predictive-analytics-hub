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
            <Route path="/housing-market/*" element={<HousingMarket />} />
            <Route path="/industry/housing-market" element={<HousingMarket />} />
            <Route 
              path="/industry/housing" 
              element={<IndustryView industry="housing" />} 
            />
            <Route 
              path="/industry/agriculture" 
              element={<IndustryView industry="agriculture" />} 
            />
            <Route 
              path="/industry/mining" 
              element={<IndustryView industry="mining" />} 
            />
            <Route 
              path="/industry/cryptocurrency" 
              element={<IndustryView industry="cryptocurrency" />} 
            />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </main>
  );
};
