
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
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
import { Briefcase, ArrowRight } from "lucide-react";

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
      <Navbar />
      
      {/* Hero & Core Sections */}
      <Hero />
      <InteractiveOverview />
      <ComparisonSection />
      <FundBuilderTeaser />
      <NamibiaFirst />
      <TrustLayer />
      
      {/* Enhanced Market Data Section */}
      <section id="market-data" className="bg-slate-900 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900 to-teal-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Live Market Intelligence
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              AI-powered insights and real-time analytics across Namibian industries
            </p>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={() => navigate('/dashboard')} 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <ArrowRight className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
              Launch Platform
            </Button>
            <Button 
              onClick={() => navigate('/opportunities')} 
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300"
            >
              <Briefcase className="h-5 w-5 mr-2" />
              Investment Opportunities
            </Button>
          </div>

          {/* Market Data Tables */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
            <MarketDataTables onInsightClick={handleInsightClick} />
          </div>
        </div>
      </section>

      {/* Enhanced sections */}
      <Features />
      <Industries />
      <Testimonials />
      
      {/* FAQ Section */}
      <section id="faq" className="bg-slate-800 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-300">
              Everything you need to know about PredictivePulse
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "How accurate are the AI predictions?",
                answer: "Our AI models achieve 85-94% accuracy across different industries, with confidence scores provided for each prediction to help you make informed decisions."
              },
              {
                question: "What industries do you cover?",
                answer: "We provide comprehensive analytics for Mining, Housing, Agriculture, Green Hydrogen, Financial Services, and Medical sectors in Namibia."
              },
              {
                question: "How often is the data updated?",
                answer: "Our platform updates predictions every 6 hours and integrates real-time market data to ensure you have the most current insights."
              },
              {
                question: "Can I export data and reports?",
                answer: "Yes, Analyst and Admin users can export data in multiple formats including CSV, PDF reports, and API access for integration."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-6 hover:bg-slate-700/70 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-slate-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
