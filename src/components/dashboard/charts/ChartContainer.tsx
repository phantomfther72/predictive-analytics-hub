
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Move } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

interface ChartContainerProps {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
  onExport?: () => void;
}

export function ChartContainer({ id, title, description, children, onExport }: ChartContainerProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className="hover:shadow-lg transition-shadow duration-300"
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-move"
            {...attributes}
            {...listeners}
          >
            <Move className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[400px]">
        {children}
      </CardContent>
    </Card>
  );
}
