
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MarketDataSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
};

export default MarketDataSkeleton;
