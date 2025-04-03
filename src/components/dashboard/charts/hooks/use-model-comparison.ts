
import { useState } from 'react';

export const useModelComparison = () => {
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>(['primary']);
  
  const toggleComparisonMode = () => {
    setComparisonMode(prev => !prev);
  };

  const toggleModelSelection = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  return {
    comparisonMode,
    toggleComparisonMode,
    selectedModels,
    toggleModelSelection
  };
};
