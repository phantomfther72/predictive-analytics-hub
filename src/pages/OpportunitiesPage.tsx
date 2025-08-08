
import React from "react";
import { OpportunitiesGrid } from "@/components/investment-opportunities/OpportunitiesGrid";
import { DemoModeToggle } from "@/components/DemoModeToggle";

const OpportunitiesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header with Demo Toggle */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4" role="heading" aria-level={1}>
            Investment Opportunities
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            Discover curated investment opportunities across diverse industries with AI-driven insights
          </p>
          
          {/* Demo Mode Toggle */}
          <div className="flex justify-center mb-6">
            <DemoModeToggle />
          </div>
        </div>

        <OpportunitiesGrid />
      </div>
    </div>
  );
};

export default OpportunitiesPage;
