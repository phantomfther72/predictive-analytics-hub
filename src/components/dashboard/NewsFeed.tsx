
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: "financial" | "housing" | "mining" | "general";
}

export const NewsFeed = () => {
  const { toast } = useToast();

  const { data: newsItems, isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      // Simulated API call - replace with actual news API integration
      const mockNews: NewsItem[] = [
        {
          id: "1",
          title: "Namibian Mining Sector Shows Strong Growth in Q1",
          summary: "Export volumes increase by 15% year-over-year, driven by uranium and diamond production.",
          source: "Mining Weekly",
          url: "#",
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          category: "mining"
        },
        {
          id: "2",
          title: "Housing Market Trends: Windhoek Prices Continue to Rise",
          summary: "Average property prices in the capital show 8% increase amid growing demand.",
          source: "Property News Namibia",
          url: "#",
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          category: "housing"
        },
        {
          id: "3",
          title: "Cryptocurrency Adoption Growing in Southern Africa",
          summary: "Regional financial institutions report increased interest in digital assets.",
          source: "Crypto Daily",
          url: "#",
          publishedAt: new Date(Date.now() - 10800000).toISOString(),
          category: "financial"
        }
      ];
      
      return mockNews;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  if (error) {
    toast({
      title: "Error loading news",
      description: "Failed to fetch latest news updates. Please try again later.",
      variant: "destructive",
    });
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Latest News</CardTitle>
        <CardDescription>Market updates and industry insights</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {newsItems?.map((item) => (
              <div
                key={item.id}
                className="group border-b border-slate-100 last:border-0 pb-4 last:pb-0"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-slate-900 group-hover:text-slate-700">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {item.summary}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(item.publishedAt)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
