
import React, { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
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

  const filteredOpportunities = opportunities?.filter(opportunity => {
    const industryName = opportunity.industry_type.replace('_', ' ');
    const matchesIndustry = selectedIndustry === "All Industries" || 
      industryName.toLowerCase() === selectedIndustry.toLowerCase().replace(' ', '_');
    
    const matchesRiskLevel = selectedRiskLevel === "All Risks" || 
      opportunity.risk_level.toLowerCase() === selectedRiskLevel.toLowerCase();
    
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesIndustry && matchesRiskLevel && matchesSearch;
  }) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Investment Opportunities</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input 
          placeholder="Search opportunities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-md"
        />
        <div className="flex gap-4 w-full">
          <Select 
            value={selectedIndustry} 
            onValueChange={setSelectedIndustry}
          >
            <SelectTrigger className="flex-1">
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

          <Select 
            value={selectedRiskLevel} 
            onValueChange={setSelectedRiskLevel}
          >
            <SelectTrigger className="flex-1">
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
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <span className="ml-3 text-lg">Loading investment opportunities...</span>
        </div>
      ) : (
        <>
          {opportunities && opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map(opportunity => (
                <OpportunityCard 
                  key={opportunity.id} 
                  opportunity={opportunity} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              No investment opportunities found. Please check back later.
            </div>
          )}

          {opportunities && opportunities.length > 0 && filteredOpportunities.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              No opportunities found matching your filters.
            </div>
          )}
        </>
      )}
    </div>
  );
};
