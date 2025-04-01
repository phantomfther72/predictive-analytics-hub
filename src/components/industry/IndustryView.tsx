
import React from "react";
import { MarketType } from "@/types/market";
import { AgricultureView } from "./views/AgricultureView";
import { MiningView } from "./views/MiningView";
import { GreenHydrogenView } from "./views/GreenHydrogenView";
import { GenericIndustryView } from "./views/GenericIndustryView";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface IndustryViewProps {
  industry: MarketType;
}

export const IndustryView: React.FC<IndustryViewProps> = ({ industry }) => {
  const navigate = useNavigate();
  
  // Function to navigate to full market page
  const navigateToMarketPage = () => {
    // Map industry type to route
    const routes: Record<string, string> = {
      "housing": "/housing-market",
      "agriculture": "/agriculture-market",
      "mining": "/mining-market",
      "green_hydrogen": "/green-hydrogen-market",
      "financial": "/financial-market"
    };
    
    const industryStr = String(industry);
    if (routes[industryStr]) {
      navigate(routes[industryStr]);
    }
  };
  
  console.log("IndustryView rendering with industry:", industry);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="text-slate-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        {/* Show button to full market page if available */}
        {["housing", "agriculture", "mining", "green_hydrogen", "financial"].includes(String(industry)) && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={navigateToMarketPage}
            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 border-teal-200"
          >
            View Full Dashboard
          </Button>
        )}
      </div>
      
      {/* Render appropriate view based on industry type */}
      {(() => {
        console.log("Determining view for industry:", String(industry));
        switch (String(industry)) {
          case "agriculture":
            return <AgricultureView />;
          case "mining":
            return <MiningView />;
          case "green_hydrogen":
            return <GreenHydrogenView />;
          default:
            console.log("Rendering GenericIndustryView for", String(industry));
            return <GenericIndustryView industry={industry} />;
        }
      })()}
    </div>
  );
};
