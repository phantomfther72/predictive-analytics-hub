
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
  const coreChart = useChartCore();
  
  // Simulation mode state
  const simulation = useSimulation();

  // Annotations state
  const annotations = useAnnotations();

  // Model comparison state
  const modelComparison = useModelComparison();

  // Voice command state
  const voiceCommands = useVoiceCommands();

  // Modal states
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const toggleAnnotationModal = useCallback(() => {
    setShowAnnotationModal((prev) => !prev);
  }, []);

  const toggleShareModal = useCallback(() => {
    setShowShareModal((prev) => !prev);
  }, []);

  // Add missing methods to annotations to ensure API compatibility
  const updateAnnotation = useCallback(() => {
    console.warn("updateAnnotation not implemented");
  }, []);
  
  const deleteAnnotation = useCallback(() => {
    console.warn("deleteAnnotation not implemented");
  }, []);

  return {
    // Core chart state
    timeRange: coreChart.timeRange,
    setTimeRange: coreChart.setTimeRange,
    selectedMetrics: coreChart.selectedMetrics,
    layout: coreChart.layout,
    setLayout: coreChart.setLayout,
    handleLegendClick: coreChart.handleLegendClick,
    handleMetricToggle: coreChart.handleMetricToggle,
    
    // Additional properties that were referenced but missing
    selectedDataset: "",
    setSelectedDataset: () => {},
    selectedMetric: "",
    setSelectedMetric: () => {},
    chartData: [],
    isLoading: false,
    models: modelComparison.models,

    // Simulation state
    simulationMode: simulation.simulationMode,
    simulationParams: simulation.simulationParams,
    toggleSimulationMode: simulation.toggleSimulationMode,
    updateSimulationParam: simulation.updateSimulationParam,

    // Annotations state
    annotations: annotations.annotations,
    selectedAnnotation: annotations.selectedAnnotation,
    setSelectedAnnotation: annotations.setSelectedAnnotation,
    addAnnotation: annotations.addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    addReplyToAnnotation: annotations.addReplyToAnnotation,

    // Model comparison state
    modelSettings: modelComparison.models,
    updateModelSetting: () => {},
    toggleModelVisibility: () => {},
    resetModelSettings: () => {},
    toggleModelEnabled: modelComparison.toggleModelEnabled,
    updateModelWeight: modelComparison.updateModelWeight,

    // Voice commands state
    isListening: voiceCommands.voiceEnabled,
    toggleVoiceListening: voiceCommands.toggleVoiceCommands,
    lastVoiceCommand: voiceCommands.lastRecognizedCommand,
    commandResult: "",
    voiceEnabled: voiceCommands.voiceEnabled,
    toggleVoiceCommands: voiceCommands.toggleVoiceCommands,
    voiceCommandHistory: voiceCommands.voiceCommandHistory,
    lastRecognizedCommand: voiceCommands.lastRecognizedCommand,
    processVoiceCommand: voiceCommands.processVoiceCommand,

    // Modal states
    showAnnotationModal,
    setShowAnnotationModal,
    toggleAnnotationModal,
    showShareModal,
    setShowShareModal,
    toggleShareModal,
  };
};
