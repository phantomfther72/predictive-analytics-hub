
import React from "react";
import { GlobalEquityDashboard } from "@/components/global-equity/GlobalEquityDashboard";

const GlobalEquityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <GlobalEquityDashboard />
      </div>
    </div>
  );
};

export default GlobalEquityPage;
