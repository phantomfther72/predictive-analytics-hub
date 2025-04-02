import React from "react";
import { cn } from "@/lib/utils";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Layout } from "../charts/types/chart-types";

const ReactGridLayout = WidthProvider(Responsive);

interface ChartLayoutProps {
  children: React.ReactNode;
  className?: string;
  onLayoutChange: (layout: string[]) => void;
}

export const ChartLayout: React.FC<ChartLayoutProps> = ({ children, className, onLayoutChange }) => {
  // Define default layouts for different breakpoints
  const defaultLayouts = {
    lg: [
      { i: 'financial', x: 0, y: 0, w: 6, h: 1, static: false },
      { i: 'housing', x: 6, y: 0, w: 6, h: 1, static: false },
      { i: 'mining', x: 0, y: 1, w: 6, h: 1, static: false },
      { i: 'agriculture', x: 6, y: 1, w: 6, h: 1, static: false },
      { i: 'green-hydrogen', x: 3, y: 2, w: 6, h: 1, static: false },
    ],
    md: [
      { i: 'financial', x: 0, y: 0, w: 4, h: 1, static: false },
      { i: 'housing', x: 4, y: 0, w: 4, h: 1, static: false },
      { i: 'mining', x: 0, y: 1, w: 4, h: 1, static: false },
      { i: 'agriculture', x: 4, y: 1, w: 4, h: 1, static: false },
      { i: 'green-hydrogen', x: 2, y: 2, w: 4, h: 1, static: false },
    ],
    sm: [
      { i: 'financial', x: 0, y: 0, w: 2, h: 1, static: false },
      { i: 'housing', x: 0, y: 1, w: 2, h: 1, static: false },
      { i: 'mining', x: 0, y: 2, w: 2, h: 1, static: false },
      { i: 'agriculture', x: 0, y: 3, w: 2, h: 1, static: false },
      { i: 'green-hydrogen', x: 0, y: 4, w: 2, h: 1, static: false },
    ],
    xs: [
      { i: 'financial', x: 0, y: 0, w: 1, h: 1, static: false },
      { i: 'housing', x: 0, y: 1, w: 1, h: 1, static: false },
      { i: 'mining', x: 0, y: 2, w: 1, h: 1, static: false },
      { i: 'agriculture', x: 0, y: 3, w: 1, h: 1, static: false },
      { i: 'green-hydrogen', x: 0, y: 4, w: 1, h: 1, static: false },
    ],
  };

  const handleLayoutsChange = (newLayouts: { [key: string]: Layout[] }) => {
    // Extract the layout for the current breakpoint (e.g., 'lg', 'md', etc.)
    const currentLayout = newLayouts['lg'] || newLayouts['md'] || newLayouts['sm'] || newLayouts['xs'];
  
    // Check if currentLayout is defined and is an array
    if (Array.isArray(currentLayout)) {
      // Extract the order of chart IDs from the layout
      const newLayoutOrder = currentLayout.map(item => item.i);
      
      // Call the onLayoutChange prop with the new layout order
      onLayoutChange(newLayoutOrder);
    } else {
      console.warn("Current layout is not an array:", currentLayout);
    }
  };

  return (
    <ReactGridLayout
      className={cn("layout", className)}
      layouts={defaultLayouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 8, sm: 2, xs: 1, xxs: 1 }}
      rowHeight={350}
      onLayoutsChange={handleLayoutsChange}
    >
      {children}
    </ReactGridLayout>
  );
};
