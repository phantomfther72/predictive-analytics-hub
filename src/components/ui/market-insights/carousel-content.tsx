
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { MetricCard } from "./metric-card";
import type { MarketInsight } from "./types";
import { useNavigate } from "react-router-dom";

interface CarouselContentProps {
  activeInsight: MarketInsight;
  handlePrevious: () => void;
  handleNext: () => void;
  activeIndex: number;
  totalInsights: number;
  onInsightClick?: (insight: MarketInsight) => void;
}

export const CarouselContent: React.FC<CarouselContentProps> = ({ 
  activeInsight, 
  handlePrevious, 
  handleNext, 
  activeIndex, 
  totalInsights,
  onInsightClick
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (onInsightClick) {
      onInsightClick(activeInsight);
    } else {
      // Default navigation based on industry type
      navigate(`/dashboard/industry/${activeInsight.industryType}`);
    }
  };

  return (
    <div className="relative">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold">{activeInsight.title}</h3>
            <p className="text-gray-500">{activeInsight.description}</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="h-8 w-8"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {activeInsight.metrics.map((metric, idx) => (
            <MetricCard key={idx} metric={metric} />
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleViewDetails}
            variant="outline" 
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
          >
            View Details
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{
            width: `${(activeIndex / (totalInsights - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
