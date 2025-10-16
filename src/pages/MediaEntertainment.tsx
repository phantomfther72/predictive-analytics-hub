import React from "react";
import { MediaEntertainmentDashboard } from "@/components/media-entertainment/MediaEntertainmentDashboard";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const MediaEntertainment: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error loading data",
        description: "Failed to fetch media & entertainment sector data. Please try again later.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  return (
    <div className="w-full space-y-6">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-2">
          Media & Entertainment Sector
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Real-time insights and predictions for the media and entertainment industry
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load media & entertainment sector data. Please try again later.
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
        <MediaEntertainmentDashboard />
      )}
    </div>
  );
};

export default MediaEntertainment;