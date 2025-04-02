
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChartAnnotation } from '../types/chart-types';

export const useAnnotations = () => {
  const [annotations, setAnnotations] = useState<ChartAnnotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);

  const addAnnotation = useCallback((chartId: string, x: number, y: number, content: string, author: string) => {
    const newAnnotation: ChartAnnotation = {
      id: uuidv4(),
      chartId,
      x,
      y,
      text: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
      content,
      author,
      timestamp: new Date(),
      replies: [],
    };
    setAnnotations(prev => [...prev, newAnnotation]);
    return newAnnotation.id;
  }, []);

  const addReplyToAnnotation = useCallback((annotationId: string, content: string, author: string) => {
    setAnnotations(prev =>
      prev.map(annotation => {
        if (annotation.id === annotationId) {
          return {
            ...annotation,
            replies: [
              ...annotation.replies,
              {
                id: uuidv4(),
                author,
                content,
                timestamp: new Date(),
              },
            ],
          };
        }
        return annotation;
      })
    );
  }, []);

  return {
    annotations,
    selectedAnnotation,
    setSelectedAnnotation,
    addAnnotation,
    addReplyToAnnotation,
  };
};
