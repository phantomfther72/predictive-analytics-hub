
import { useState, useCallback } from "react";
import { ChartAnnotation } from "../types/chart-state-types";

export const useAnnotations = () => {
  const [annotations, setAnnotations] = useState<ChartAnnotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);

  const addAnnotation = useCallback((chartId: string, x: number, y: number, content: string, author: string) => {
    const newAnnotation: ChartAnnotation = {
      id: Date.now().toString(),
      chartId,
      x,
      y,
      content,
      author,
      timestamp: new Date(),
      replies: []
    };
    
    setAnnotations(prev => [...prev, newAnnotation]);
    return newAnnotation.id;
  }, []);

  const addReplyToAnnotation = useCallback((annotationId: string, content: string, author: string) => {
    setAnnotations(prev => 
      prev.map(annotation => 
        annotation.id === annotationId
          ? {
              ...annotation,
              replies: [
                ...annotation.replies,
                {
                  id: Date.now().toString(),
                  author,
                  content,
                  timestamp: new Date()
                }
              ]
            }
          : annotation
      )
    );
  }, []);

  return {
    annotations,
    selectedAnnotation,
    setSelectedAnnotation,
    addAnnotation,
    addReplyToAnnotation
  };
};
