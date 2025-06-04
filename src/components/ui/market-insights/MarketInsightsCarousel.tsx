
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarketInsight } from "./types";
import { useDemoMode } from "@/hooks/useDemoMode";

// Enhanced demo insights with more variety and realistic data
const demoInsights: MarketInsight[] = [
  {
    id: "crypto-btc-surge",
    title: "Bitcoin Breaks $42K Resistance",
    description: "Strong institutional buying momentum pushes BTC to new quarterly highs with increased volume.",
    industryType: "financial",
    marketValue: 42750.50,
    changePercentage: 5.8,
    changeDirection: "up",
    confidence: 0.78,
    timeframe: "24h",
    source: "CryptoAnalytics",
    tags: ["cryptocurrency", "institutional", "breakout"],
    sparklineData: [39500, 40200, 41100, 40800, 41500, 42100, 42750],
    insights: [
      "Institutional buying accelerating",
      "Technical resistance broken at $41.5K",
      "Volume increasing significantly"
    ]
  },
  {
    id: "housing-austin-boom",
    title: "Austin Housing Market Surge",
    description: "Tech migration drives 18.7% price appreciation with inventory shortages creating bidding wars.",
    industryType: "housing",
    marketValue: 485000,
    changePercentage: 18.7,
    changeDirection: "up", 
    confidence: 0.76,
    timeframe: "YoY",
    source: "Regional MLS",
    tags: ["regional", "tech-migration", "supply-shortage"],
    sparklineData: [410000, 425000, 440000, 455000, 470000, 478000, 485000],
    insights: [
      "Tech companies relocating to Austin",
      "New construction lagging demand",
      "Premium on move-in ready homes"
    ]
  },
  {
    id: "mining-lithium-boom", 
    title: "Lithium Demand Explosion",
    description: "EV battery production drives unprecedented 35.2% growth in lithium mining valuations.",
    industryType: "mining",
    marketValue: 8900000000,
    changePercentage: 35.2,
    changeDirection: "up",
    confidence: 0.84,
    timeframe: "Q4",
    source: "Mining Intelligence",
    tags: ["ev-batteries", "rare-earth", "green-transition"],
    sparklineData: [6200000000, 6800000000, 7400000000, 7900000000, 8350000000, 8650000000, 8900000000],
    insights: [
      "Tesla and GM securing supply deals",
      "New mines coming online in 2024",
      "Price per ton up 280% YoY"
    ]
  },
  {
    id: "hydrogen-europe-mandates",
    title: "Green Hydrogen Acceleration",
    description: "European mandates drive 28.5% growth in hydrogen production capacity investments.",
    industryType: "green_hydrogen", 
    marketValue: 450000000,
    changePercentage: 28.5,
    changeDirection: "up",
    confidence: 0.85,
    timeframe: "Q4",
    source: "EnergyTransition",
    tags: ["european-mandate", "clean-energy", "infrastructure"],
    sparklineData: [320000000, 340000000, 370000000, 395000000, 420000000, 435000000, 450000000],
    insights: [
      "EU REPowerEU plan accelerating adoption",
      "Production costs dropping 15% annually",
      "Steel industry piloting hydrogen use"
    ]
  },
  {
    id: "agriculture-agtech-funding",
    title: "AgTech Investment Surge", 
    description: "Climate-smart agriculture attracts record venture capital with precision farming innovations.",
    industryType: "agriculture",
    marketValue: 2500000000,
    changePercentage: 45.8,
    changeDirection: "up",
    confidence: 0.72,
    timeframe: "YoY",
    source: "AgInvest Weekly",
    tags: ["precision-farming", "climate-tech", "venture-capital"],
    sparklineData: [1200000000, 1450000000, 1700000000, 1950000000, 2200000000, 2350000000, 2500000000],
    insights: [
      "Drought-resistant crops gaining traction",
      "AI-powered yield optimization",
      "Carbon credit opportunities emerging"
    ]
  },
  {
    id: "medical-telemedicine-growth",
    title: "Telemedicine Platform Expansion",
    description: "Rural healthcare access drives 38.5% growth in virtual consultation platforms.",
    industryType: "medical",
    marketValue: 4200000000,
    changePercentage: 38.5,
    changeDirection: "up",
    confidence: 0.68,
    timeframe: "Q4",
    source: "HealthTech Analytics",
    tags: ["rural-healthcare", "virtual-care", "accessibility"],
    sparklineData: [2800000000, 3100000000, 3400000000, 3700000000, 3950000000, 4080000000, 4200000000],
    insights: [
      "Medicare expanding coverage",
      "AI diagnostics improving accuracy",
      "Provider shortage driving adoption"
    ]
  }
];

interface MarketInsightsCarouselProps {
  autoplayInterval?: number;
  className?: string;
  onInsightClick?: (insight: MarketInsight) => void;
}

export const MarketInsightsCarousel: React.FC<MarketInsightsCarouselProps> = ({
  autoplayInterval = 5000,
  className,
  onInsightClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { isDemoMode } = useDemoMode();
  
  const insights = isDemoMode ? demoInsights : [];

  useEffect(() => {
    if (!isAutoPlaying || insights.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, autoplayInterval, insights.length]);

  const nextInsight = () => {
    setCurrentIndex((prev) => (prev + 1) % insights.length);
    setIsAutoPlaying(false);
  };

  const prevInsight = () => {
    setCurrentIndex((prev) => (prev - 1 + insights.length) % insights.length);
    setIsAutoPlaying(false);
  };

  const handleInsightClick = (insight: MarketInsight) => {
    onInsightClick?.(insight);
  };

  if (insights.length === 0) {
    return (
      <div className={cn("bg-slate-100 dark:bg-slate-800 rounded-xl p-8 text-center", className)}>
        <p className="text-slate-600 dark:text-slate-400">
          {isDemoMode ? "Demo insights loading..." : "No market insights available"}
        </p>
      </div>
    );
  }

  const currentInsight = insights[currentIndex];

  return (
    <div className={cn("relative", className)}>
      <Card className="overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600">
        <CardContent className="p-0">
          <div className="relative">
            {/* Main insight content */}
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="outline" className="capitalize font-medium">
                      {currentInsight.industryType.replace('_', ' ')}
                    </Badge>
                    <Badge 
                      variant={currentInsight.changeDirection === 'up' ? 'default' : 'destructive'}
                      className="flex items-center gap-1"
                    >
                      {currentInsight.changeDirection === 'up' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      +{currentInsight.changePercentage}%
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {currentInsight.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                    {currentInsight.description}
                  </p>
                </div>
              </div>

              {/* Key insights */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Key Insights:
                </h4>
                <div className="space-y-2">
                  {currentInsight.insights.map((insight, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                      {insight}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions and metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span>Source: {currentInsight.source}</span>
                  <span>Confidence: {Math.round(currentInsight.confidence * 100)}%</span>
                  <span>{currentInsight.timeframe}</span>
                </div>
                
                <Button 
                  size="sm"
                  onClick={() => handleInsightClick(currentInsight)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Explore <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Navigation controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevInsight}
                className="h-8 w-8 p-0 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextInsight}
                className="h-8 w-8 p-0 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carousel indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {insights.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlaying(false);
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex
                ? "bg-blue-600 w-6"
                : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
            )}
          />
        ))}
      </div>
    </div>
  );
};
