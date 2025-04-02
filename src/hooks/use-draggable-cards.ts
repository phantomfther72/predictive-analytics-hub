
import { useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export const useDraggableCards = (initialItems: string[]) => {
  const [items, setItems] = useState<string[]>(initialItems);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = items.indexOf(active.id.toString());
      const overIndex = items.indexOf(over.id.toString());
      
      if (activeIndex !== -1 && overIndex !== -1) {
        setItems(arrayMove(items, activeIndex, overIndex));
      }
    }
  };

  const handleReorderCards = (newOrder: string[]) => {
    setItems(newOrder);
  };

  return {
    items,
    handleDragEnd,
    handleReorderCards
  };
};
