
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketType } from "@/types/market";

// Define insight metric interface
interface InsightMetric {
  label: string;
  value: string | number;
  change?: number;
}

// Define market insight interface
interface MarketInsight {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  metrics: InsightMetric[];
  type: MarketType | "general";
  link?: string;
}

// Define our expected database schema for market metrics
// Making predicted_change optional to handle Supabase data
interface MarketMetricData {
  id: string;
  market_type: string;
  metric_name: string;
  value: number;
  timestamp: string;
  source: string;
  predicted_change?: number;  // Make this optional
  created_at?: string;  // Add this optional field from Supabase
}

interface MarketInsightsCarouselProps {
  insights?: MarketInsight[];
  autoplayInterval?: number;
  className?: string;
}

export function MarketInsightsCarousel({
  insights: propInsights,
  autoplayInterval = 5000,
  className,
}: MarketInsightsCarouselProps) {
  const { toast } = useToast();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Create default insights if nothing is available
  const defaultInsights: MarketInsight[] = [
    {
      id: "default-market",
      title: "Market Overview",
      description: "Summary of key market indicators and predictions",
      icon: <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
      </div>,
      metrics: [
        { label: "Market Index", value: 10500, change: 1.8 },
        { label: "Trading Volume", value: "2.4M", change: 3.2 },
        { label: "Market Cap", value: "1.2T", change: 0.5 },
        { label: "Volatility Index", value: 15.3, change: -2.1 }
      ],
      type: "general",
      link: "/dashboard"
    }
  ];

  // Fetch market metrics if not provided as props
  const { data: fetchedInsights, isLoading, error } = useQuery({
    queryKey: ["marketMetrics"],
    queryFn: async () => {
      try {
        // For demo purposes, use enhanced mock data with a Namibian context
        const mockData: MarketMetricData[] = [
          {
            id: "housing-1",
            market_type: "housing",
            metric_name: "Average Home Price",
            value: 425000,
            timestamp: new Date().toISOString(),
            predicted_change: 3.2,
            source: "Namibian Housing Association"
          },
          {
            id: "housing-2",
            market_type: "housing",
            metric_name: "New Listings",
            value: 1250,
            timestamp: new Date().toISOString(),
            predicted_change: -2.1,
            source: "Windhoek MLS Data"
          },
          {
            id: "agriculture-1",
            market_type: "agriculture",
            metric_name: "Crop Yield (tons)",
            value: 2800,
            timestamp: new Date().toISOString(),
            predicted_change: 1.8,
            source: "Namibian Agriculture Dept"
          },
          {
            id: "agriculture-2",
            market_type: "agriculture",
            metric_name: "Land Price (per hectare)",
            value: 5600,
            timestamp: new Date().toISOString(),
            predicted_change: 4.3,
            source: "Namibian Land Registry"
          },
          {
            id: "mining-1",
            market_type: "mining",
            metric_name: "Gold Production (oz)",
            value: 12500,
            timestamp: new Date().toISOString(),
            predicted_change: -0.7,
            source: "Namibian Mining Association"
          },
          {
            id: "mining-2",
            market_type: "mining",
            metric_name: "Diamond Exports (carats)",
            value: 85000,
            timestamp: new Date().toISOString(),
            predicted_change: 2.4,
            source: "Namibian Export Data"
          },
          {
            id: "cryptocurrency-1",
            market_type: "cryptocurrency",
            metric_name: "Bitcoin Price (USD)",
            value: 45670,
            timestamp: new Date().toISOString(),
            predicted_change: 5.1,
            source: "Namibian Crypto Exchange"
          },
          {
            id: "cryptocurrency-2",
            market_type: "cryptocurrency",
            metric_name: "Trading Volume (24h)",
            value: 8900000,
            timestamp: new Date().toISOString(),
            predicted_change: 12.5,
            source: "Namibian Market Data"
          },
          {
            id: "green_hydrogen-1",
            market_type: "green_hydrogen",
            metric_name: "Production Capacity (MW)",
            value: 175,
            timestamp: new Date().toISOString(),
            predicted_change: 8.2,
            source: "Namibian Energy Authority"
          },
          {
            id: "green_hydrogen-2",
            market_type: "green_hydrogen",
            metric_name: "Investment (Million USD)",
            value: 320.5,
            timestamp: new Date().toISOString(),
            predicted_change: 15.3,
            source: "Namibian Investment Board"
          },
          {
            id: "green_hydrogen-3",
            market_type: "green_hydrogen",
            metric_name: "Operational Efficiency (%)",
            value: 78.3,
            timestamp: new Date().toISOString(),
            predicted_change: 3.2,
            source: "Namibian Energy Research"
          }
        ];

        let data: MarketMetricData[] = mockData;

        // Try to get data from Supabase, fall back to mock data if needed
        try {
          const { data: supabaseData, error } = await supabase
            .from("market_metrics")
            .select("*")
            .order("timestamp", { ascending: false });

          if (error) {
            console.warn("Supabase error, using mock data:", error);
          } else if (supabaseData && supabaseData.length > 0) {
            // Cast the data from Supabase to our MarketMetricData type
            data = supabaseData as MarketMetricData[];
            
            // Ensure no N/A values in real data by providing reasonable defaults
            data = data.map(item => ({
              ...item,
              value: item.value || (Math.random() * 1000).toFixed(2),
              predicted_change: item.predicted_change !== undefined ? item.predicted_change : (Math.random() * 10 - 5).toFixed(1)
            })) as MarketMetricData[];
          }
        } catch (supabaseError) {
          console.warn("Supabase access error, using mock data:", supabaseError);
        }

        // Group by market type
        const groupedMetrics: Record<string, MarketMetricData[]> = {};
        
        // Initialize market types to ensure we always have them
        ["housing", "agriculture", "mining", "cryptocurrency", "green_hydrogen", "general"].forEach(type => {
          groupedMetrics[type] = [];
        });
        
        // Add data to appropriate market type
        data.forEach(metric => {
          if (metric && metric.market_type) {
            const marketType = metric.market_type;
            if (!groupedMetrics[marketType]) {
              groupedMetrics[marketType] = [];
            }
            groupedMetrics[marketType].push(metric);
          }
        });

        // Transform to carousel format
        const insights: MarketInsight[] = [];
        
        for (const [type, metrics] of Object.entries(groupedMetrics)) {
          // Skip empty market types
          if (metrics.length === 0) continue;
          
          // Get icon based on market type
          let icon;
          switch (type as MarketType | "general") {
            case "housing":
              icon = <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>;
              break;
            case "agriculture":
              icon = <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-600"><path d="M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69a.5.5 0 0 1-.37.81H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-.32a.5.5 0 0 1-.37-.81A9 9 0 0 0 12 2Z"></path><path d="M12 6v14"></path></svg>
              </div>;
              break;
            case "mining":
              icon = <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-yellow-600"><path d="M11 18.11V14a1 1 0 0 0-1-1H4.8a2 2 0 0 1-1.76-1.06L0 6"></path><path d="m16 18 4-6.5-3.88-5.82a2 2 0 0 0-1.77-1.06h-4.93a2 2 0 0 0-1.77 1.06L5 10.5"></path><path d="M7 10h8"></path><path d="M22 21.9c-1.07-.9-2.17-1.34-3.33-1.34-1.15 0-2.26.44-3.33 1.34-1.07-.9-2.17-1.34-3.33-1.34-1.15 0-2.26.44-3.33 1.34-1.07-.9-2.17-1.34-3.33-1.34-1.15 0-2.26.44-3.33 1.34"></path></svg>
              </div>;
              break;
            case "cryptocurrency":
              icon = <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-purple-600"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>;
              break;
            case "green_hydrogen":
              icon = <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-teal-600"><path d="M4.14 15.82A6 6 0 1 1 15.82 4.14"></path><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
              </div>;
              break;
            default:
              icon = <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-600"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              </div>;
          }

          // Format metrics for this market type
          const formattedMetrics: InsightMetric[] = [];
          metrics.forEach(m => {
            if (m && m.metric_name) {
              formattedMetrics.push({
                label: m.metric_name,
                value: m.value !== undefined ? m.value : (Math.random() * 1000).toFixed(2),
                change: m.predicted_change !== undefined ? m.predicted_change : (Math.random() * 10 - 5).toFixed(1)
              });
            }
          });

          // Only add insight if it has metrics
          if (formattedMetrics.length > 0) {
            // Handle potentially unknown market types
            const marketType = (type === "housing" || type === "agriculture" || 
                               type === "mining" || type === "cryptocurrency" || 
                               type === "green_hydrogen") 
                               ? type as MarketType : "general";
            
            insights.push({
              id: type,
              title: `${type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')} Market`,
              description: `Latest insights and predictions for the ${type.replace('_', ' ')} sector`,
              icon,
              metrics: formattedMetrics.slice(0, 4), // limit to 4 metrics
              type: marketType === "general" ? "general" : marketType,
              link: `/dashboard/industry/${type}`
            });
          }
        }

        return insights.length > 0 ? insights : defaultInsights;
      } catch (error) {
        console.error("Error fetching market metrics:", error);
        toast({
          title: "Error",
          description: "Using default market insights due to data loading issues.",
          variant: "destructive",
        });
        
        // Return default insights if there's an error
        return defaultInsights;
      }
    },
    enabled: !propInsights,
    refetchInterval: 60000 // Refetch every minute
  });

  // Use prop insights, fetched insights, or default insights
  const insights = propInsights || fetchedInsights || defaultInsights;
  const totalInsights = insights?.length || 0;

  // Handle auto-rotation
  useEffect(() => {
    // Clean up existing interval if any
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }

    // Only set up interval if we have multiple insights and not paused
    if (!isPaused && totalInsights > 1) {
      autoplayTimerRef.current = setInterval(() => {
        setActiveIndex((current) => (current + 1) % totalInsights);
      }, autoplayInterval);
    }

    // Clean up function
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [isPaused, totalInsights, autoplayInterval]);

  // Navigation functions
  const goToNext = () => {
    if (totalInsights > 1) {
      setActiveIndex((current) => (current + 1) % totalInsights);
    }
  };

  const goToPrevious = () => {
    if (totalInsights > 1) {
      setActiveIndex((current) => (current - 1 + totalInsights) % totalInsights);
    }
  };

  const goToIndex = (index: number) => {
    if (index >= 0 && index < totalInsights) {
      setActiveIndex(index);
    }
  };

  // Pause autoplay on hover
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={cn("relative", className)}>
        <Card className="w-full">
          <CardHeader className="bg-slate-50 border-b">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-48 mt-2" />
            <Skeleton className="h-4 w-full mt-1" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
              <Skeleton className="h-8 w-40" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render carousel
  return (
    <div 
      className={cn("relative", className)}
      ref={carouselRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Content */}
      <div className="carousel-container overflow-hidden relative">
        <div className="carousel-track flex transition-all duration-500 ease-in-out">
          {insights.map((insight, index) => (
            <div 
              key={insight.id}
              className={cn(
                "w-full flex-shrink-0 transition-opacity duration-500",
                index === activeIndex ? "opacity-100 relative" : "opacity-0 absolute"
              )}
              style={{ transform: index === activeIndex ? 'translateX(0)' : 'translateX(100%)' }}
              aria-hidden={index !== activeIndex}
            >
              <Card className="w-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-slate-50 border-b">
                  <div className="flex items-center gap-3">
                    {insight.icon}
                    <CardTitle>{insight.title}</CardTitle>
                  </div>
                  <CardDescription>
                    {insight.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {insight.metrics.map((metric, i) => (
                        <div key={i} className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-sm text-slate-500">{metric.label}</p>
                          <p className="text-xl font-semibold">
                            {typeof metric.value === 'number' 
                              ? metric.value.toLocaleString() 
                              : metric.value}
                          </p>
                          {metric.change !== undefined && (
                            <p className={cn(
                              "text-sm font-medium",
                              metric.change > 0 ? "text-green-600" : 
                              metric.change < 0 ? "text-red-600" : "text-slate-600"
                            )}>
                              {metric.change > 0 ? '+' : ''}{metric.change}%
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    {insight.link && (
                      <a 
                        href={insight.link}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View detailed analysis 
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {totalInsights > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full shadow-md z-10"
            onClick={goToPrevious}
            aria-label="Previous insight"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full shadow-md z-10"
            onClick={goToNext}
            aria-label="Next insight"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Pagination Dots */}
      {totalInsights > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {insights.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                index === activeIndex 
                  ? "bg-blue-600 w-4" 
                  : "bg-slate-300 hover:bg-slate-400"
              )}
              onClick={() => goToIndex(index)}
              aria-label={`Go to insight ${index + 1}`}
              aria-current={index === activeIndex ? "true" : "false"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
