
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Industries from "@/components/Industries";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import MarketDataTables from "@/components/MarketDataTables";
import { MarketInsightsCarousel } from "@/components/ui/market-insights-carousel";
import { ArrowRight, Leaf, Zap } from "lucide-react";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Latest Market Insights</h2>
        
        {/* Market Insights Carousel */}
        <div className="mb-12">
          <MarketInsightsCarousel 
            autoplayInterval={7000} 
            className="max-w-5xl mx-auto"
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
