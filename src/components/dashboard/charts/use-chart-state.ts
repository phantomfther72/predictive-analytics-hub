
import { useState, useCallback } from "react";
import { useChartCore } from "./hooks/use-chart-core";
import { useSimulation } from "./hooks/use-simulation";
import { useAnnotations } from "./hooks/use-annotations";
import { useModelComparison } from "./hooks/use-model-comparison";
import { useVoiceCommands } from "./hooks/use-voice-commands";

// Re-export types with explicit 'export type' syntax for isolatedModules
export type { SimulationParameter, ChartAnnotation, ModelSettings } from "./types/chart-state-types";

export const useChartState = () => {
  // Core chart state
  const {
    selectedDataset,
    setSelectedDataset,
    selectedMetric,
    setSelectedMetric,
    timeRange,
    setTimeRange,
    chartData,
    isLoading,
  } = useChartCore();

  // Simulation mode state
  const {
    simulationMode,
    simulationParams,
    toggleSimulationMode,
    updateSimulationParam,
  } = useSimulation();

  // Annotations state
  const {
    annotations,
    selectedAnnotation,
    setSelectedAnnotation,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    addReplyToAnnotation,
  } = useAnnotations();

  // Model comparison state
  const {
    modelSettings,
    updateModelSetting,
    toggleModelVisibility,
    resetModelSettings,
  } = useModelComparison();

  // Voice command state
  const {
    isListening,
    toggleVoiceListening,
    lastVoiceCommand,
    commandResult,
  } = useVoiceCommands();

  // Modal states
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const toggleAnnotationModal = useCallback(() => {
    setShowAnnotationModal((prev) => !prev);
  }, []);

  const toggleShareModal = useCallback(() => {
    setShowShareModal((prev) => !prev);
  }, []);

  return {
    // Core chart state
    selectedDataset,
    setSelectedDataset,
    selectedMetric,
    setSelectedMetric,
    timeRange,
    setTimeRange,
    chartData,
    isLoading,

    // Simulation state
    simulationMode,
    simulationParams,
    toggleSimulationMode,
    updateSimulationParam,

    // Annotations state
    annotations,
    selectedAnnotation,
    setSelectedAnnotation,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    addReplyToAnnotation,

    // Model comparison state
    modelSettings,
    updateModelSetting,
    toggleModelVisibility,
    resetModelSettings,

    // Voice commands state
    isListening,
    toggleVoiceListening,
    lastVoiceCommand,
    commandResult,

    // Modal states
    showAnnotationModal,
    setShowAnnotationModal,
    toggleAnnotationModal,
    showShareModal,
    setShowShareModal,
    toggleShareModal,
  };
};
