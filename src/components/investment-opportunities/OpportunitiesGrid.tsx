
import React, { useState, useEffect, useMemo } from "react";
import { InvestmentOpportunity } from "@/types/investment";
import { useInvestmentOpportunities } from "@/hooks/useInvestmentOpportunities";
import { OpportunityCard } from "./OpportunityCard";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const INDUSTRIES = [
  "All Industries", 
  "Green Hydrogen", 
  "Agriculture", 
  "Mining", 
  "Medical", 
  "Housing", 
  "Financial"
];

const RISK_LEVELS = ["All Risks", "Low", "Medium", "High"];

export const OpportunitiesGrid: React.FC = () => {
  const { data: opportunities, isLoading, error } = useInvestmentOpportunities();
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("All Risks");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedAsset, setSelectedAsset] = useState("All Asset Types");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    if (error) {
      console.error("Error loading opportunities:", error);
      toast({
        title: "Error",
        description: "Failed to load investment opportunities. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    console.log("Opportunities loaded:", opportunities?.length || 0);
  }, [opportunities]);

  const regionOptions = useMemo(() => {
    const unique = Array.from(new Set((opportunities || []).map(o => o.region)));
    return ["All Regions", ...unique.sort()];
  }, [opportunities]);

  const assetOptions = useMemo(() => {
    const unique = Array.from(new Set((opportunities || []).map(o => o.asset_type.replace('_', ' '))));
    return ["All Asset Types", ...unique.sort()];
  }, [opportunities]);

  const filteredOpportunities = opportunities?.filter(opportunity => {
    const industryName = opportunity.industry_type.replace('_', ' ');
    const matchesIndustry = selectedIndustry === "All Industries" || 
      industryName.toLowerCase() === selectedIndustry.toLowerCase();
    
    const matchesRiskLevel = selectedRiskLevel === "All Risks" || 
      opportunity.risk_level.toLowerCase() === selectedRiskLevel.toLowerCase();

    const matchesRegion = selectedRegion === "All Regions" || 
      opportunity.region === selectedRegion;

    const assetName = opportunity.asset_type.replace('_', ' ');
    const matchesAsset = selectedAsset === "All Asset Types" ||
      assetName.toLowerCase() === selectedAsset.toLowerCase();
    
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesIndustry && matchesRiskLevel && matchesRegion && matchesAsset && matchesSearch;
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Investment Opportunities
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Discover curated investment opportunities across diverse industries with AI-driven insights
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
              <div className="flex items-center gap-2 min-w-0">
                <Filter className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="w-full sm:w-48 h-12 border-slate-300 dark:border-slate-600">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map(industry => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Select value={selectedRiskLevel} onValueChange={setSelectedRiskLevel}>
                <SelectTrigger className="w-full sm:w-40 h-12 border-slate-300 dark:border-slate-600">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  {RISK_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-full sm:w-40 h-12 border-slate-300 dark:border-slate-600">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {regionOptions.map(region => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger className="w-full sm:w-48 h-12 border-slate-300 dark:border-slate-600">
                  <SelectValue placeholder="Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  {assetOptions.map(asset => (
                    <SelectItem key={asset} value={asset}>
                      {asset}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          {opportunities && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing {filteredOpportunities.length} of {opportunities.length} opportunities
              </p>
            </div>
          )}
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
              Loading investment opportunities...
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Please wait while we fetch the latest data
            </p>
          </div>
        ) : opportunities && opportunities.length > 0 ? (
          <>
            {filteredOpportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {filteredOpportunities.map(opportunity => (
                  <OpportunityCard 
                    key={opportunity.id} 
                    opportunity={opportunity} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No opportunities found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Try adjusting your filters or search terms to find more opportunities.
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No opportunities available
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Investment opportunities are being updated. Please check back later.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
