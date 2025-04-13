
import React from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Industries from "@/components/Industries";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import MarketDataTables from "@/components/MarketDataTables";
import { MarketInsight } from "@/components/ui/market-insights/types";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

const Index: React.FC = () => {
  const navigate = useNavigate();

  const handleInsightClick = (insight: MarketInsight) => {
    // Navigate to the appropriate industry page based on the insight type
    switch(insight.industryType) {
      case "housing":
        navigate("/housing-market");
        break;
      case "agriculture":
        navigate("/agriculture-market");
        break;
      case "mining":
        navigate("/mining-market");
        break;
      case "green_hydrogen":
        navigate("/green-hydrogen-market");
        break;
      case "financial":
        navigate("/financial-market");
        break;
      case "medical":
        navigate("/medical-market");
        break;
      default:
        // For any other type, go to dashboard with industry view
        navigate(`/dashboard/industry/${insight.industryType}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <div id="market-data" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Market Data</h2>
          <Button 
            onClick={() => navigate('/dashboard/opportunities')} 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-teal-600"
          >
            <Briefcase className="h-5 w-5" />
            Explore Investment Opportunities
          </Button>
        </div>
        {/* Market Data Tables component will handle all market data including insights */}
        <MarketDataTables onInsightClick={handleInsightClick} />
      </div>
      <Features />
      <Industries />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default Index;
