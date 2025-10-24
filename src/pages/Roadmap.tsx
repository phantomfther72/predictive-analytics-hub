import { useState } from "react";
import { useMilestones, Milestone } from "@/hooks/useMilestones";
import { JourneyPieChart } from "@/components/roadmap/JourneyPieChart";
import { RoadmapSummary } from "@/components/roadmap/RoadmapSummary";
import { MilestoneEditDialog } from "@/components/roadmap/MilestoneEditDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Target } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Roadmap = () => {
  const { milestones, isLoading, error } = useMilestones();
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="w-full space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Target className="h-8 w-8 text-primary flex-shrink-0" />
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
            Project Roadmap
          </h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base">
          Track PredictivePulse development milestones and progress toward launch
        </p>
      </div>

      {/* Summary Panel */}
      {!isLoading && !error && milestones.length > 0 && (
        <RoadmapSummary milestones={milestones} />
      )}

      {/* Journey Pie Chart */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[600px] w-full" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading roadmap</AlertTitle>
          <AlertDescription>
            {error.message || "Failed to load milestones. Please try again later."}
          </AlertDescription>
        </Alert>
      ) : milestones.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No milestones found</AlertTitle>
          <AlertDescription>
            No project milestones have been created yet.
          </AlertDescription>
        </Alert>
      ) : (
        <JourneyPieChart 
          milestones={milestones} 
          onMilestoneClick={handleMilestoneClick}
        />
      )}

      <MilestoneEditDialog
        milestone={selectedMilestone}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};

export default Roadmap;
