
// Animated placeholder fallback for charts with no data or errors.
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
export const ChartFallback = ({ title = "No Data Available", message = "Market data cannot be displayed right now.", isError = false }) => (
  <div className="flex flex-col items-center justify-center h-72 w-full bg-slate-800/90 rounded-lg animate-fade-in">
    <div className="mb-2">
      {isError ? <AlertTriangle className="w-8 h-8 text-red-400 animate-pulse" /> : <Skeleton className="w-14 h-14 rounded-full" />}
    </div>
    <span className="font-semibold text-lg text-white">{title}</span>
    <span className="text-sm text-teal-200 mt-1">{message}</span>
  </div>
);
