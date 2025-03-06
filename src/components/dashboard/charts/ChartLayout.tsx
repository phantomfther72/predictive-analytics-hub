
import React, { useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Layout } from "./types/chart-types";

interface ChartLayoutProps {
  children: React.ReactNode;
  layout?: Layout;
  onLayoutChange?: (newLayout: string[]) => void;
}

export function ChartLayout({ children, onLayoutChange }: ChartLayoutProps) {
  const [items, setItems] = useState(React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return child.props.id;
    }
    return null;
  }).filter(Boolean));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id.toString());
      const newIndex = items.indexOf(over.id.toString());

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onLayoutChange?.(newItems);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid gap-6">
          {children}
        </div>
      </SortableContext>
    </DndContext>
  );
}
