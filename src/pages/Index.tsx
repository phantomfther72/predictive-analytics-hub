
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Industries from "@/components/Industries";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import MarketDataTables from "@/components/MarketDataTables";
import { MarketInsightsCarousel } from "@/components/ui/market-insights/index";
import { MarketInsight } from "@/components/ui/market-insights/types";
import { ArrowRight, Leaf, Zap } from "lucide-react";

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
      default:
        // For any other type, go to dashboard with industry view
        navigate(`/dashboard/industry/${insight.industryType}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <div id="market-data" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Latest Market Insights</h2>
        
        {/* Market Insights Carousel */}
        <div className="mb-12">
          <MarketInsightsCarousel 
            autoplayInterval={7000} 
            className="max-w-5xl mx-auto"
            onInsightClick={handleInsightClick}
          />
        </div>

        <MarketDataTables />
      </div>
      <Features />
      <Industries />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
