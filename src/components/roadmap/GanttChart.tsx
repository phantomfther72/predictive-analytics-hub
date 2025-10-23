import { useEffect, useRef, useState } from "react";
import Gantt from "frappe-gantt";
import { Milestone } from "@/hooks/useMilestones";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GanttChartProps {
  milestones: Milestone[];
  onMilestoneClick: (milestone: Milestone) => void;
  viewMode: "Day" | "Week" | "Month";
}

export const GanttChart = ({ milestones, onMilestoneClick, viewMode }: GanttChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!containerRef.current || milestones.length === 0 || isUpdating) return;

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
        view_mode: viewMode,
        bar_height: 30,
        bar_corner_radius: 3,
        arrow_curve: 5,
        padding: 18,
        date_format: "YYYY-MM-DD",
        language: "en",
        on_date_change: async (task: any, start: Date, end: Date) => {
          setIsUpdating(true);
          try {
            const { error } = await supabase
              .from("milestones")
              .update({
                start_date: start.toISOString().split("T")[0],
                end_date: end.toISOString().split("T")[0],
              })
              .eq("id", task.id);

            if (error) throw error;
            toast.success("Milestone dates updated");
          } catch (error) {
            console.error("Error updating milestone:", error);
            toast.error("Failed to update milestone dates");
          } finally {
            setIsUpdating(false);
          }
        },
        on_progress_change: async (task: any, progress: number) => {
          setIsUpdating(true);
          try {
            const { error } = await supabase
              .from("milestones")
              .update({ progress })
              .eq("id", task.id);

            if (error) throw error;
            toast.success("Progress updated");
          } catch (error) {
            console.error("Error updating progress:", error);
            toast.error("Failed to update progress");
          } finally {
            setIsUpdating(false);
          }
        },
        on_click: (task: any) => {
          const milestone = milestones.find((m) => m.id === task.id);
          if (milestone) {
            onMilestoneClick(milestone);
          }
        },
        custom_popup_html: (task: any) => {
          const milestone = milestones.find((m) => m.id === task.id);
          if (!milestone) return "";

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
                <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium" style="background-color: ${
                  milestone.status === "Completed"
                    ? "#4ade80"
                    : milestone.status === "In Progress"
                    ? "#facc15"
                    : "#93c5fd"
                }; color: ${milestone.status === "In Progress" ? "#000" : "#fff"}">
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
              <div style="font-size: 11px; color: hsl(var(--muted-foreground)); margin-top: 8px;">
                Click to edit • Drag to reschedule
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
  }, [milestones, viewMode, onMilestoneClick, isUpdating]);

  return (
    <div className="gantt-container w-full overflow-x-auto">
      <style>{`
        /* Base Frappe Gantt Styles */
        .gantt {
          width: 100%;
          overflow-x: auto;
          font-family: var(--font-sans);
        }
        
        .gantt svg {
          width: 100%;
          overflow: visible;
        }
        
        .gantt .grid-background {
          fill: none;
        }
        
        .gantt .grid-header {
          fill: hsl(var(--muted));
          stroke: hsl(var(--border));
          stroke-width: 1.4;
        }
        
        .gantt .grid-row {
          fill: hsl(var(--background));
        }
        
        .gantt .grid-row:nth-child(even) {
          fill: hsl(var(--muted) / 0.3);
        }
        
        .gantt .row-line {
          stroke: hsl(var(--border));
        }
        
        .gantt .tick {
          stroke: hsl(var(--border));
          stroke-width: 0.2;
        }
        
        .gantt .tick.thick {
          stroke: hsl(var(--border));
          stroke-width: 0.4;
        }
        
        .gantt .today-highlight {
          fill: hsl(var(--primary) / 0.1);
          opacity: 0.5;
        }
        
        /* Custom color variables - Exact colors from requirements */
        .gantt-container {
          --gantt-bar-planned: #93c5fd;
          --gantt-bar-in-progress: #facc15;
          --gantt-bar-completed: #4ade80;
        }
        
        /* Bar styling */
        .gantt .bar-wrapper {
          cursor: pointer;
        }
        
        .gantt .bar {
          fill: var(--gantt-bar-planned);
          stroke: transparent;
          stroke-width: 0;
          transition: fill 0.3s ease;
          rx: 3;
          ry: 3;
        }
        
        .gantt .bar-wrapper:hover .bar {
          opacity: 0.9;
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
        
        .gantt .bar-label {
          fill: hsl(var(--foreground));
          font-size: 12px;
          font-weight: 500;
        }
        
        .gantt .bar-wrapper:hover .bar-label {
          fill: hsl(var(--foreground));
        }
        
        /* Handle styling */
        .gantt .handle {
          fill: rgba(255, 255, 255, 0.6);
          cursor: ew-resize;
          opacity: 0;
        }
        
        .gantt .bar-wrapper:hover .handle {
          opacity: 1;
        }
        
        /* Arrow styling */
        .gantt .arrow {
          fill: none;
          stroke: hsl(var(--muted-foreground));
          stroke-width: 1.4;
        }
        
        /* Text styling */
        .gantt text {
          fill: hsl(var(--foreground));
          font-family: var(--font-sans);
          font-size: 12px;
          user-select: none;
        }
        
        .gantt .upper-text,
        .gantt .lower-text {
          font-size: 12px;
          text-anchor: middle;
        }
        
        /* Popup styling */
        .gantt-popup-wrapper {
          position: absolute;
          z-index: 1000;
        }
        
        .gantt-popup {
          background: hsl(var(--popover));
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
          padding: 12px;
          min-width: 280px;
        }
        
        .gantt .pointer {
          fill: hsl(var(--popover));
          stroke: hsl(var(--border));
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .gantt text {
            font-size: 11px;
          }
          
          .gantt .bar {
            height: 24px !important;
          }
          
          .gantt .bar-label {
            font-size: 11px;
          }
        }
      `}</style>
      <div ref={containerRef} className="min-h-[400px]" />
    </div>
  );
};
