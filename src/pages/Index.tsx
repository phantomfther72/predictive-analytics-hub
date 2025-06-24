
import React from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import InteractiveOverview from "@/components/InteractiveOverview";
import ComparisonSection from "@/components/ComparisonSection";
import FundBuilderTeaser from "@/components/FundBuilderTeaser";
import NamibiaFirst from "@/components/NamibiaFirst";
import TrustLayer from "@/components/TrustLayer";
import FinalCTA from "@/components/FinalCTA";
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
    <div className="min-h-screen bg-black">
      {/* New Bold Sections */}
      <Hero />
      <InteractiveOverview />
      <ComparisonSection />
      <FundBuilderTeaser />
      <NamibiaFirst />
      <TrustLayer />
      <FinalCTA />
      
      {/* Legacy Market Data Section - Kept for compatibility */}
      <section id="market-data" className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Live Market Data & Insights
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Real-time analytics and AI-driven predictions across multiple industries
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mb-12">
            <Button 
              onClick={() => navigate('/dashboard/opportunities')} 
              size="lg"
              className="bg-gradient-to-r from-green-400 to-emerald-300 hover:from-green-300 hover:to-emerald-200 text-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Briefcase className="h-5 w-5 mr-2" />
              Explore Investment Opportunities
            </Button>
          </div>

          {/* Market Data Tables with improved container */}
          <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
            <MarketDataTables onInsightClick={handleInsightClick} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
