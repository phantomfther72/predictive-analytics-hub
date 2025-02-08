
import React from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardOverview } from "./DashboardOverview";
import { DashboardCharts } from "./DashboardCharts";
import { DashboardTables } from "./DashboardTables";
import { DashboardProfile } from "./DashboardProfile";
import { useIsMobile } from "@/hooks/use-mobile";

export const DashboardContent = () => {
  const isMobile = useIsMobile();
  
  return (
    <main className={`flex-1 ${isMobile ? 'space-y-6' : 'container space-y-8'}`}>
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/charts" element={<DashboardCharts />} />
        <Route path="/tables" element={<DashboardTables />} />
        <Route path="/profile" element={<DashboardProfile />} />
      </Routes>
    </main>
  );
};
