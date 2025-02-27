
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

interface MarketInsight {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  metrics: {
    label: string;
    value: string | number;
    change?: number;
  }[];
  type: MarketType;
  link?: string;
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

  // Fetch market metrics if not provided as props
  const { data: fetchedInsights, isLoading, error } = useQuery({
    queryKey: ["marketMetrics"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("market_metrics")
          .select("*")
          .order("timestamp", { ascending: false });

        if (error) {
          throw error;
        }

        // Group by market type and transform into carousel format
        const groupedMetrics: Record<string, any[]> = {};
        data.forEach(metric => {
          if (!groupedMetrics[metric.market_type]) {
            groupedMetrics[metric.market_type] = [];
          }
          groupedMetrics[metric.market_type].push(metric);
        });

        // Map to carousel format
        return Object.entries(groupedMetrics).map(([type, metrics]) => {
          // Get icon based on market type
          let icon;
          switch (type as MarketType) {
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
            default:
              icon = <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-600"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              </div>;
          }

          // Format metrics from this market type
          const formattedMetrics = metrics.map(m => ({
            label: m.metric_name,
            value: m.value,
            change: m.predicted_change || undefined
          })).slice(0, 4); // limit to 4 metrics per card

          return {
            id: type,
            title: `${type.charAt(0).toUpperCase() + type.slice(1)} Market`,
            description: `Latest insights and predictions for the ${type} sector`,
            icon,
            metrics: formattedMetrics,
            type: type as MarketType,
            link: `/dashboard/industry/${type}`
          };
        });
      } catch (error) {
        console.error("Error fetching market metrics:", error);
        toast({
          title: "Error",
          description: "Failed to load market insights. Please try again later.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !propInsights,
    refetchInterval: 60000 // Refetch every minute
  });

  const insights = propInsights || fetchedInsights;
  const totalInsights = insights?.length || 0;

  // Handle auto-rotation
  useEffect(() => {
    if (!isPaused && totalInsights > 1) {
      autoplayTimerRef.current = setInterval(() => {
        setActiveIndex((current) => (current + 1) % totalInsights);
      }, autoplayInterval);
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isPaused, totalInsights, autoplayInterval]);

  // Navigation functions
  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % totalInsights);
  };

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + totalInsights) % totalInsights);
  };

  const goToIndex = (index: number) => {
    setActiveIndex(index);
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

  // Render error state
  if (error || !insights || insights.length === 0) {
    return (
      <div className={cn("relative", className)}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Market Insights Unavailable</CardTitle>
            <CardDescription>
              We're unable to load the latest market insights at this time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500">
              Please check your connection and try again. If the problem persists, our team has been notified.
            </p>
            <Button 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
