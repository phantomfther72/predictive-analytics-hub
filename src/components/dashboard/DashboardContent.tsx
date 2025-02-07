import React from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardOverview } from "./DashboardOverview";
import { DashboardCharts } from "./DashboardCharts";
import { DashboardTables } from "./DashboardTables";
import { DashboardProfile } from "./DashboardProfile";

export const DashboardContent = () => {
  return (
    <main className="flex-1 container py-6">
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/charts" element={<DashboardCharts />} />
        <Route path="/tables" element={<DashboardTables />} />
        <Route path="/profile" element={<DashboardProfile />} />
      </Routes>
    </main>
  );
};