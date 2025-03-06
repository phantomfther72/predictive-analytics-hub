
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CarouselContent } from "./carousel-content";
import { processMarketMetrics, generateDemoInsights } from "./utils";
import type { MarketInsight, MarketInsightsCarouselProps } from "./types";
import { useNavigate } from "react-router-dom";

export function MarketInsightsCarousel({
  autoplayInterval = 5000,
  className = "",
  onInsightClick,
}: MarketInsightsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMarketData();
  }, []);

  useEffect(() => {
    if (!autoplayInterval || isPaused || insights.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % insights.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplayInterval, insights.length, isPaused]);

  const fetchMarketData = async () => {
    try {
      // Try to fetch from Supabase first
      const { data: marketMetrics, error } = await supabase
        .from("market_metrics")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        throw error;
      }

      // Process the data if we have it
      if (marketMetrics && marketMetrics.length > 0) {
        const processedInsights = processMarketMetrics(marketMetrics);
        setInsights(processedInsights);
      } else {
        // Fallback to demo data if no real data
        setInsights(generateDemoInsights());
      }
    } catch (error) {
      console.error("Error fetching market data:", error);
      toast({
        title: "Data Fetch Error",
        description: "Using demo data instead of live data.",
        variant: "destructive",
      });
      
      // Use demo data on error
      setInsights(generateDemoInsights());
    }
  };

  const handlePrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? insights.length - 1 : current - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % insights.length);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleInsightClick = (insight: MarketInsight) => {
    if (onInsightClick) {
      onInsightClick(insight);
    } else {
      // Default navigation
      navigate(`/dashboard/industry/${insight.industryType}`);
    }
  };

  if (!insights.length) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardContent className="p-6">
          <div className="h-40 flex items-center justify-center">
            <p>Loading market insights...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeInsight = insights[activeIndex];

  return (
    <Card
      className={`overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-0">
        <CarouselContent
          activeInsight={activeInsight}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          activeIndex={activeIndex}
          totalInsights={insights.length}
          onInsightClick={handleInsightClick}
        />
      </CardContent>
    </Card>
  );
}
