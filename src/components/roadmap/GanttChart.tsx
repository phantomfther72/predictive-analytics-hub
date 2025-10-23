import { useEffect, useRef } from "react";
import Gantt from "frappe-gantt";
import { Milestone } from "@/hooks/useMilestones";
import "frappe-gantt/dist/frappe-gantt.css";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface GanttChartProps {
  milestones: Milestone[];
}

export const GanttChart = ({ milestones }: GanttChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || milestones.length === 0) return;

    // Transform milestones to Frappe Gantt format
    const tasks = milestones.map((milestone) => ({
      id: milestone.id,
      name: milestone.title,
      start: milestone.start_date,
      end: milestone.end_date,
      progress: milestone.progress,
      custom_class: `status-${milestone.status.toLowerCase().replace(" ", "-")}`,
    }));

    // Destroy existing instance
    if (ganttInstance.current) {
      ganttInstance.current = null;
    }

    // Clear container
    containerRef.current.innerHTML = "";

    // Create new Gantt instance
    try {
      ganttInstance.current = new Gantt(containerRef.current, tasks, {
        view_mode: "Month",
        bar_height: 30,
        bar_corner_radius: 3,
        arrow_curve: 5,
        padding: 18,
        date_format: "YYYY-MM-DD",
        language: "en",
        custom_popup_html: (task: any) => {
          const milestone = milestones.find((m) => m.id === task.id);
          if (!milestone) return "";

          const statusColors = {
            Planned: "bg-blue-500",
            "In Progress": "bg-yellow-500",
            Completed: "bg-green-500",
          };

          return `
            <div class="gantt-popup" style="padding: 12px; min-width: 280px;">
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px; color: hsl(var(--foreground));">
                ${milestone.title}
              </div>
              ${
                milestone.description
                  ? `<div style="font-size: 13px; color: hsl(var(--muted-foreground)); margin-bottom: 8px;">
                      ${milestone.description}
                    </div>`
                  : ""
              }
              <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  statusColors[milestone.status]
                } text-white">
                  ${milestone.status}
                </span>
              </div>
              <div style="font-size: 12px; color: hsl(var(--muted-foreground)); margin-bottom: 4px;">
                <strong>Start:</strong> ${new Date(milestone.start_date).toLocaleDateString()}
              </div>
              <div style="font-size: 12px; color: hsl(var(--muted-foreground)); margin-bottom: 8px;">
                <strong>End:</strong> ${new Date(milestone.end_date).toLocaleDateString()}
              </div>
              <div style="margin-bottom: 4px;">
                <div style="font-size: 12px; color: hsl(var(--muted-foreground)); margin-bottom: 4px;">
                  <strong>Progress:</strong> ${milestone.progress}%
                </div>
                <div style="width: 100%; height: 8px; background-color: hsl(var(--muted)); border-radius: 4px; overflow: hidden;">
                  <div style="width: ${milestone.progress}%; height: 100%; background-color: hsl(var(--primary)); transition: width 0.3s ease;"></div>
                </div>
              </div>
            </div>
          `;
        },
      });
    } catch (error) {
      console.error("Error creating Gantt chart:", error);
    }

    return () => {
      if (ganttInstance.current) {
        ganttInstance.current = null;
      }
    };
  }, [milestones]);

  return (
    <div className="gantt-container w-full overflow-x-auto">
      <style>{`
        .gantt-container {
          --gantt-bar-planned: hsl(var(--primary));
          --gantt-bar-in-progress: hsl(45 93% 47%);
          --gantt-bar-completed: hsl(142 76% 36%);
        }
        
        .gantt .bar {
          fill: var(--gantt-bar-planned);
        }
        
        .gantt .status-planned .bar {
          fill: var(--gantt-bar-planned);
        }
        
        .gantt .status-in-progress .bar {
          fill: var(--gantt-bar-in-progress);
        }
        
        .gantt .status-completed .bar {
          fill: var(--gantt-bar-completed);
        }
        
        .gantt .bar-progress {
          fill: rgba(255, 255, 255, 0.3);
        }
        
        .gantt-popup {
          background: hsl(var(--popover));
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        }
        
        .gantt .grid-header {
          fill: hsl(var(--muted));
          stroke: hsl(var(--border));
        }
        
        .gantt .grid-row {
          fill: hsl(var(--background));
        }
        
        .gantt .grid-row:nth-child(even) {
          fill: hsl(var(--muted) / 0.3);
        }
        
        .gantt .tick {
          stroke: hsl(var(--border));
        }
        
        .gantt .tick.thick {
          stroke: hsl(var(--border));
        }
        
        .gantt .today-highlight {
          fill: hsl(var(--primary) / 0.1);
        }
        
        .gantt text {
          fill: hsl(var(--foreground));
          font-family: var(--font-sans);
        }
        
        @media (max-width: 768px) {
          .gantt text {
            font-size: 11px;
          }
          .gantt .bar {
            height: 24px !important;
          }
        }
      `}</style>
      <div ref={containerRef} className="min-h-[400px]" />
    </div>
  );
};
