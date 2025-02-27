
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [page, setPage] = useState(0);

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
        },
        {
          id: "4",
          title: "New Mining Regulations Expected to Boost Investment",
          summary: "Government announces streamlined permitting process for exploration activities.",
          source: "Africa Mining Review",
          url: "#",
          publishedAt: new Date(Date.now() - 14400000).toISOString(),
          category: "mining"
        },
        {
          id: "5",
          title: "Central Bank Announces Interest Rate Decision",
          summary: "Rates held steady at 4.5% as inflation shows signs of stabilizing.",
          source: "Financial Times",
          url: "#",
          publishedAt: new Date(Date.now() - 18000000).toISOString(),
          category: "financial"
        },
        {
          id: "6",
          title: "Green Building Initiatives Transform Housing Market",
          summary: "Sustainable construction practices gain popularity among developers and homebuyers.",
          source: "Architecture Today",
          url: "#",
          publishedAt: new Date(Date.now() - 21600000).toISOString(),
          category: "housing"
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

  // Filter news items based on active filter
  const filteredNews = activeFilter
    ? newsItems?.filter(item => item.category === activeFilter)
    : newsItems;

  // Pagination
  const itemsPerPage = 3;
  const totalPages = filteredNews ? Math.ceil(filteredNews.length / itemsPerPage) : 0;
  const displayedNews = filteredNews?.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const nextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  // Get unique categories for filter
  const categories = React.useMemo(() => {
    if (!newsItems) return [];
    return Array.from(new Set(newsItems.map(item => item.category)));
  }, [newsItems]);

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Latest News</CardTitle>
        <CardDescription>Market updates and industry insights</CardDescription>
        
        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant={activeFilter === null ? "secondary" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(null)}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={activeFilter === category ? "secondary" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        )}
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
        ) : displayedNews && displayedNews.length > 0 ? (
          <div className="space-y-4">
            {displayedNews.map((item) => (
              <div
                key={item.id}
                className="group border-b border-slate-100 last:border-0 pb-4 last:pb-0"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 group-hover:text-slate-700">
                        {item.title}
                      </h4>
                      <Badge variant="outline" className="text-xs capitalize">
                        {item.category}
                      </Badge>
                    </div>
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
        ) : (
          <div className="py-8 text-center text-slate-500">
            <p>No news articles found.</p>
            {activeFilter && (
              <Button 
                variant="link" 
                onClick={() => setActiveFilter(null)}
                className="mt-2"
              >
                Clear filter
              </Button>
            )}
          </div>
        )}
      </CardContent>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <CardFooter className="flex justify-between items-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevPage}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="text-sm text-slate-500">
            Page {page + 1} of {totalPages}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextPage}
            disabled={page === totalPages - 1}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
