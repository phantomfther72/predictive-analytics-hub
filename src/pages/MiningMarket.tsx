
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMiningSectorData } from "@/components/dashboard/tables/useMiningSectorData";
import { MiningMarketDashboard } from "@/components/mining-market/MiningMarketDashboard";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const MiningMarket: React.FC = () => {
  const { data: miningData, isLoading, error } = useMiningSectorData();
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error loading data",
        description: "Failed to fetch mining sector data. Please try again later.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Namibian Mining Sector Dashboard</h1>
      
      {error && (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load mining sector data. Please try again later.
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[250px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[100px]" />
            ))}
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : (
        <MiningMarketDashboard data={miningData || []} />
      )}
    </div>
  );
};

export default MiningMarket;
