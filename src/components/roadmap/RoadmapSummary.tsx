import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Milestone } from "@/hooks/useMilestones";
import { Calendar, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { useMemo } from "react";

interface RoadmapSummaryProps {
  milestones: Milestone[];
}

export const RoadmapSummary = ({ milestones }: RoadmapSummaryProps) => {
  const stats = useMemo(() => {
    const total = milestones.length;
    const completed = milestones.filter((m) => m.status === "Completed").length;
    const inProgress = milestones.filter((m) => m.status === "In Progress").length;
    const planned = milestones.filter((m) => m.status === "Planned").length;
    
    const totalProgress =
      milestones.reduce((sum, m) => sum + m.progress, 0) / total;
    
    const now = new Date();
    const upcoming = milestones
      .filter(
        (m) =>
          (m.status === "Planned" || m.status === "In Progress") &&
          new Date(m.start_date) >= now
      )
      .sort(
        (a, b) =>
          new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      )
      .slice(0, 3);
    
    const overdue = milestones.filter(
      (m) =>
        m.status !== "Completed" &&
        new Date(m.end_date) < now
    );

    return {
      total,
      completed,
      inProgress,
      planned,
      totalProgress: Math.round(totalProgress),
      upcoming,
      overdue: overdue.length,
    };
  }, [milestones]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overall Progress */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-card-foreground">
            Overall Progress
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl sm:text-3xl font-bold text-foreground">
            {stats.totalProgress}%
          </div>
          <Progress value={stats.totalProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {stats.completed} of {stats.total} milestones completed
          </p>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-card-foreground">
            Status Breakdown
          </CardTitle>
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completed</span>
            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
              {stats.completed}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">In Progress</span>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
              {stats.inProgress}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Planned</span>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/20">
              {stats.planned}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-card-foreground">
            Next Up
          </CardTitle>
          <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
        </CardHeader>
        <CardContent className="space-y-2">
          {stats.upcoming.length > 0 ? (
            stats.upcoming.map((milestone) => (
              <div key={milestone.id} className="text-xs space-y-1">
                <p className="font-medium text-foreground truncate">
                  {milestone.title}
                </p>
                <p className="text-muted-foreground">
                  {new Date(milestone.start_date).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">
              No upcoming milestones
            </p>
          )}
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-card-foreground">
            Alerts
          </CardTitle>
          <Clock className="h-5 w-5 text-destructive flex-shrink-0" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl sm:text-3xl font-bold text-foreground">
            {stats.overdue}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.overdue === 0
              ? "All milestones on track"
              : `${stats.overdue} milestone${stats.overdue > 1 ? "s" : ""} overdue`}
          </p>
          {stats.inProgress > 0 && (
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20 text-xs">
              {stats.inProgress} in progress
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
