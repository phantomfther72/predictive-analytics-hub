
import React, { useState, useEffect, useCallback } from "react";
import { MarketMetric } from "@/types/market";
import PredictionBadge from "./PredictionBadge";
import PredictionTooltip from "./PredictionTooltip";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DynamicMarketAlertsProps {
  metrics: MarketMetric[];
  autoplayInterval?: number;
  className?: string;
}

const DynamicMarketAlerts: React.FC<DynamicMarketAlertsProps> = ({
  metrics,
  autoplayInterval = 6000,
  className
}) => {
  const [activeAlertIndex, setActiveAlertIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const nextAlert = useCallback(() => {
    if (metrics.length <= 1) return;
    setActiveAlertIndex(current => (current + 1) % metrics.length);
  }, [metrics.length]);
  
  const prevAlert = useCallback(() => {
    if (metrics.length <= 1) return;
    setActiveAlertIndex(current => (current - 1 + metrics.length) % metrics.length);
  }, [metrics.length]);
  
  // Auto-cycle through alerts
  useEffect(() => {
    if (isPaused || metrics.length <= 1) return;
    
    const interval = setInterval(() => {
      nextAlert();
    }, autoplayInterval);
    
    return () => clearInterval(interval);
  }, [nextAlert, autoplayInterval, isPaused, metrics.length]);
  
  if (!metrics.length) {
    return (
      <div className={cn("bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-6", className)}>
        <h3 className="text-xl font-semibold mb-4">Market Alerts</h3>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-slate-500">No market alerts available at this time.</p>
        </div>
      </div>
    );
  }
  
  const currentMetric = metrics[activeAlertIndex];
  const predictionFactors = currentMetric.prediction_factors || {
    market_trend: 0.7,
    volatility: 0.3,
    sentiment: 0.5
  };
  
  return (
    <div className={cn("bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-6", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Market Alerts</h3>
        
        <div className="flex items-center gap-1">
          {metrics.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveAlertIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-200",
                index === activeAlertIndex 
                  ? "bg-blue-600 dark:bg-blue-400" 
                  : "bg-slate-300 dark:bg-slate-600"
              )}
              aria-label={`Go to alert ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div 
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAlertIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-gray-600">
                {currentMetric.metric_name}
              </p>
              {currentMetric.predicted_change !== undefined && (
                <PredictionBadge
                  value={currentMetric.predicted_change}
                  confidence={currentMetric.prediction_confidence}
                  size="sm"
                />
              )}
            </div>
            <p className="text-lg font-bold mt-1">
              {typeof currentMetric.value === 'number' ? currentMetric.value.toLocaleString() : currentMetric.value}
            </p>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 mt-1">{currentMetric.source}</p>
              <p className="text-xs text-gray-500">
                {currentMetric.timestamp ? new Date(currentMetric.timestamp).toLocaleString() : "Updated recently"}
              </p>
            </div>
            
            {currentMetric.predicted_change !== undefined && (
              <PredictionTooltip
                predictedChange={currentMetric.predicted_change}
                predictionConfidence={currentMetric.prediction_confidence}
                factors={predictionFactors}
                explanation="This prediction is based on historical data patterns and current market conditions."
                variant="pill"
                size="sm"
                className="mt-2"
              />
            )}
          </motion.div>
        </AnimatePresence>
        
        {metrics.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 h-7 w-7 rounded-full bg-white/90 text-slate-700 shadow-sm hover:bg-white"
              onClick={prevAlert}
              aria-label="Previous alert"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 h-7 w-7 rounded-full bg-white/90 text-slate-700 shadow-sm hover:bg-white"
              onClick={nextAlert}
              aria-label="Next alert"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      
      {metrics.length > 1 && (
        <div className="flex justify-center mt-3">
          <Button 
            variant="link" 
            size="sm" 
            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 p-0 h-auto"
          >
            View All Alerts
          </Button>
        </div>
      )}
    </div>
  );
};

export default DynamicMarketAlerts;
