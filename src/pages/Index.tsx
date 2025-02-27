
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Industries from "@/components/Industries";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import MarketDataTables from "@/components/MarketDataTables";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Zap } from "lucide-react";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Latest Market Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Agriculture Insights Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-slate-50 border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle>Agriculture Market</CardTitle>
              </div>
              <CardDescription>
                Crop yields, weather impacts, and global agricultural trends
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">Avg. Yield</p>
                    <p className="text-xl font-semibold">6.8 tons/ha</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">Market Price</p>
                    <p className="text-xl font-semibold">$342/ton</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">Rainfall</p>
                    <p className="text-xl font-semibold">68mm</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">Growth Prediction</p>
                    <p className="text-xl font-semibold text-green-600">+3.2%</p>
                  </div>
                </div>
                <Link 
                  to="/dashboard/industry/agriculture" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  View detailed analysis <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Green Hydrogen Insights Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-slate-50 border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-cyan-600" />
                </div>
                <CardTitle>Green Hydrogen</CardTitle>
              </div>
              <CardDescription>
                Production capacity, market demand, and efficiency metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">Production</p>
                    <p className="text-xl font-semibold">4,250 MW</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">Market Demand</p>
                    <p className="text-xl font-semibold">2,830 tons</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">Efficiency</p>
                    <p className="text-xl font-semibold">76.4%</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">Growth</p>
                    <p className="text-xl font-semibold text-green-600">+8.7%</p>
                  </div>
                </div>
                <Link 
                  to="/dashboard/charts" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Explore green energy trends <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
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
