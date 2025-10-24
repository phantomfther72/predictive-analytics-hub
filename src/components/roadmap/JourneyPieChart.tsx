import { useMemo } from "react";
import { Milestone } from "@/hooks/useMilestones";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface JourneyPieChartProps {
  milestones: Milestone[];
  onMilestoneClick: (milestone: Milestone) => void;
}

const PHASE_COLORS: Record<string, string> = {
  "Idea Conception": "hsl(217, 91%, 60%)", // #60a5fa blue
  "Research & Validation": "hsl(142, 71%, 45%)", // #34d399 green
  "MVP Build": "hsl(45, 93%, 47%)", // #fbbf24 amber
  "MVP Development": "hsl(45, 93%, 47%)", // #fbbf24 amber
  "Integration": "hsl(38, 92%, 50%)", // #f59e0b orange
  "Integration & Security": "hsl(38, 92%, 50%)", // #f59e0b orange
  "Pitch Readiness": "hsl(160, 84%, 39%)", // #10b981 teal
  "Future Expansion": "hsl(220, 9%, 46%)", // #9ca3af gray
};

const getPhaseColor = (title: string): string => {
  const matchedKey = Object.keys(PHASE_COLORS).find(key => 
    title.toLowerCase().includes(key.toLowerCase())
  );
  return matchedKey ? PHASE_COLORS[matchedKey] : "hsl(217, 91%, 60%)";
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="font-semibold text-card-foreground text-sm mb-2">{data.name}</h3>
        <p className="text-xs text-muted-foreground mb-3">{data.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress:</span>
            <span className="font-semibold text-foreground">{data.progress}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-semibold text-foreground">{data.status}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            <div>{new Date(data.start_date).toLocaleDateString()} - {new Date(data.end_date).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ milestones }: { milestones: Milestone[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {milestones.map((milestone) => (
        <div key={milestone.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
          <div 
            className="w-4 h-4 rounded-full flex-shrink-0 mt-1" 
            style={{ backgroundColor: getPhaseColor(milestone.title) }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium text-foreground truncate">
                {milestone.title}
              </h4>
              <span className="text-xs font-semibold text-muted-foreground ml-2">
                {milestone.progress}%
              </span>
            </div>
            <Progress value={milestone.progress} className="h-1.5 mb-2" />
            <p className="text-xs text-muted-foreground line-clamp-2">
              {milestone.description || "No description available"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const JourneyPieChart = ({ milestones, onMilestoneClick }: JourneyPieChartProps) => {
  const chartData = useMemo(() => {
    return milestones.map((milestone) => ({
      name: milestone.title,
      value: milestone.progress || 1,
      progress: milestone.progress,
      status: milestone.status,
      description: milestone.description,
      start_date: milestone.start_date,
      end_date: milestone.end_date,
      color: getPhaseColor(milestone.title),
      milestone: milestone,
    }));
  }, [milestones]);

  const overallCompletion = useMemo(() => {
    if (milestones.length === 0) return 0;
    const totalProgress = milestones.reduce((sum, m) => sum + m.progress, 0);
    return Math.round(totalProgress / milestones.length);
  }, [milestones]);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Predictive Pulse Journey Overview</span>
          <div className="text-sm font-normal text-muted-foreground">
            Overall: <span className="text-2xl font-bold text-primary ml-2">{overallCompletion}%</span>
          </div>
        </CardTitle>
        <CardDescription>
          Evolution from conception to current phase — visualized by progress across key milestones
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="w-full h-[400px] sm:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius="80%"
                innerRadius="40%"
                fill="#8884d8"
                dataKey="value"
                onClick={(data) => onMilestoneClick(data.milestone)}
                className="cursor-pointer outline-none focus:outline-none"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="transition-opacity hover:opacity-80 outline-none focus:outline-none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <CustomLegend milestones={milestones} />
      </CardContent>
    </Card>
  );
};
