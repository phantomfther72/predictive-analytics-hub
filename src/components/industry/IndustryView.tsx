
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface IndustryViewProps {
  industry: "housing" | "agriculture" | "mining" | "cryptocurrency";
}

export const IndustryView: React.FC<IndustryViewProps> = ({ industry }) => {
  const { data: insights, isLoading } = useQuery({
    queryKey: ["industry-insights", industry],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("industry_insights")
        .select("*")
        .eq("industry", industry)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold capitalize">{industry} Market Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights?.map((insight) => (
          <Card key={insight.id}>
            <CardHeader>
              <CardTitle>{insight.metric_name}</CardTitle>
              <CardDescription>Source: {insight.source}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">
                  {insight.value} {insight.unit}
                </p>
                {insight.trend_percentage && (
                  <p className={`text-sm ${insight.trend_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {insight.trend_percentage >= 0 ? '↑' : '↓'} {Math.abs(insight.trend_percentage)}% change
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
