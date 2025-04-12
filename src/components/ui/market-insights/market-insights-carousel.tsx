
import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "../badge";
import { MarketInsight } from "./types";
import { generateMockInsights } from "./utils";
import { AnimatePresence, motion } from "framer-motion";

interface MarketInsightsCarouselProps {
  insights?: MarketInsight[];
  autoplayInterval?: number;
  className?: string;
  onInsightClick?: (insight: MarketInsight) => void;
}

export function MarketInsightsCarousel({
  insights: propInsights,
  autoplayInterval = 5000,
  className,
  onInsightClick,
}: MarketInsightsCarouselProps) {
  // Use provided insights or generate mock data
  const [insights] = useState<MarketInsight[]>(
    propInsights || generateMockInsights(6)
  );
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const nextInsight = useCallback(() => {
    setActiveIndex((current) => (current + 1) % insights.length);
  }, [insights.length]);
  
  const prevInsight = useCallback(() => {
    setActiveIndex((current) => (current - 1 + insights.length) % insights.length);
  }, [insights.length]);
  
  // Autoplay functionality
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      nextInsight();
    }, autoplayInterval);
    
    return () => clearInterval(interval);
  }, [nextInsight, autoplayInterval, isPaused]);
  
  const handleInsightClick = (insight: MarketInsight) => {
    if (onInsightClick) {
      onInsightClick(insight);
    }
  };
  
  if (!insights.length) {
    return null;
  }
  
  const currentInsight = insights[activeIndex];
  
  return (
    <div 
      className={cn(
        "relative rounded-xl p-6 shadow-md bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 w-full text-white",
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute top-3 right-3 flex gap-1 z-10">
        {insights.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              activeIndex === index 
                ? "bg-teal-500 dark:bg-teal-400 w-4" 
                : "bg-slate-300 dark:bg-slate-600"
            )}
            aria-label={`Go to insight ${index + 1}`}
          />
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="min-h-[180px] flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start mb-2">
              <Badge 
                className={cn(
                  "px-2.5 py-0.5 text-xs font-medium",
                  currentInsight.industryType === "financial" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                  currentInsight.industryType === "housing" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
                  currentInsight.industryType === "mining" && "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
                  currentInsight.industryType === "agriculture" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                  currentInsight.industryType === "green_hydrogen" && "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
                  currentInsight.industryType === "medical" && "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                )}
              >
                {currentInsight.industryLabel}
              </Badge>
              
              {currentInsight.predictedChange && (
                <Badge 
                  variant={currentInsight.predictedChange > 0 ? "default" : "destructive"}
                  className="ml-2"
                >
                  {currentInsight.predictedChange > 0 ? '+' : ''}
                  {currentInsight.predictedChange.toFixed(1)}%
                </Badge>
              )}
            </div>
            
            <h3 className="text-lg font-semibold mb-2 text-white">{currentInsight.title}</h3>
            <p className="text-sm text-slate-300 dark:text-slate-300 mb-4">{currentInsight.description}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 dark:text-slate-400">
              {currentInsight.timestamp ? new Date(currentInsight.timestamp).toLocaleString() : "Just now"}
            </span>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm text-teal-400 hover:text-teal-300 dark:text-teal-400 p-0 h-auto"
              onClick={() => handleInsightClick(currentInsight)}
            >
              View Details →
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-y-0 left-0 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-slate-800/80 dark:bg-slate-700/80 text-white dark:text-slate-200 shadow-sm hover:bg-slate-700 dark:hover:bg-slate-600"
          onClick={prevInsight}
          aria-label="Previous insight"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="absolute inset-y-0 right-0 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-slate-800/80 dark:bg-slate-700/80 text-white dark:text-slate-200 shadow-sm hover:bg-slate-700 dark:hover:bg-slate-600"
          onClick={nextInsight}
          aria-label="Next insight"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
