
import React from "react";
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Badge } from "./badge";

interface LiveDataCardProps {
  title: string;
  value: string | number;
  delta?: number;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  className?: string;
  loading?: boolean;
}

export const LiveDataCard = ({
  title,
  value,
  delta,
  trend = "neutral",
  icon: Icon,
  className,
  loading = false
}: LiveDataCardProps) => {
  return (
    <Card 
      className={cn(
        "hover:shadow-md transition-all duration-300 overflow-hidden border-slate-200 dark:border-slate-800",
        loading && "animate-pulse",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            
            {delta !== undefined && (
              <div className="mt-1 flex items-center">
                {trend === "up" ? (
                  <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                    +{delta.toFixed(1)}%
                  </Badge>
                ) : trend === "down" ? (
                  <Badge className="bg-red-500 hover:bg-red-600 text-xs">
                    {delta.toFixed(1)}%
                  </Badge>
                ) : (
                  <Badge className="bg-slate-500 hover:bg-slate-600 text-xs">
                    {delta.toFixed(1)}%
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className={cn(
            "rounded-full p-3",
            trend === "up" ? "bg-green-100 dark:bg-green-900/20" : 
            trend === "down" ? "bg-red-100 dark:bg-red-900/20" : 
            "bg-slate-100 dark:bg-slate-800"
          )}>
            <Icon 
              className={cn(
                "h-6 w-6",
                trend === "up" ? "text-green-600 dark:text-green-400" : 
                trend === "down" ? "text-red-600 dark:text-red-400" : 
                "text-slate-600 dark:text-slate-400"
              )} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
