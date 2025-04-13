
import React, { useState } from "react";
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
  const { data: opportunities, isLoading } = useInvestmentOpportunities();
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("All Risks");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOpportunities = opportunities?.filter(opportunity => {
    const matchesIndustry = selectedIndustry === "All Industries" || 
      opportunity.industry_type.replace('_', ' ').toLowerCase() === selectedIndustry.toLowerCase().replace(' ', '_');
    
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map(opportunity => (
              <OpportunityCard 
                key={opportunity.id} 
                opportunity={opportunity} 
              />
            ))}
          </div>

          {filteredOpportunities.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              No opportunities found matching your filters.
            </div>
          )}
        </>
      )}
    </div>
  );
};
