
import { useState, useCallback, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Payload } from "recharts/types/component/DefaultLegendContent";

export interface SimulationParameter {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export interface ChartAnnotation {
  id: string;
  chartId: string;
  x: number;
  y: number;
  content: string;
  author: string;
  timestamp: Date;
  replies: {
    id: string;
    author: string;
    content: string;
    timestamp: Date;
  }[];
}

export interface ModelSettings {
  id: string;
  name: string;
  enabled: boolean;
  weight: number;
  color: string;
}

export const useChartState = () => {
  const [timeRange, setTimeRange] = useState(1);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "current_price",
    "volume",
    "avg_price_usd",
    "listings_active",
    "market_value_usd",
    "production_mt"
  ]);
  
  const [layout, setLayout] = useLocalStorage<string[]>("chart-layout", [
    "financial",
    "housing",
    "mining",
    "agriculture",
    "green-hydrogen"
  ]);

  // Simulation mode state
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationParams, setSimulationParams] = useState<SimulationParameter[]>([
    { id: "volume", name: "Trading Volume", value: 100, min: 0, max: 200, step: 5, unit: "%" },
    { id: "sentiment", name: "Market Sentiment", value: 50, min: 0, max: 100, step: 1, unit: "%" },
    { id: "volatility", name: "Volatility", value: 30, min: 0, max: 100, step: 1, unit: "%" },
    { id: "interest_rate", name: "Interest Rate", value: 3.5, min: 0, max: 10, step: 0.25, unit: "%" },
  ]);

  // Collaborative features state
  const [annotations, setAnnotations] = useState<ChartAnnotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);

  // Multi-model comparison state
  const [models, setModels] = useState<ModelSettings[]>([
    { id: "primary", name: "Primary Model", enabled: true, weight: 1.0, color: "#3b82f6" },
    { id: "optimistic", name: "Optimistic Model", enabled: false, weight: 0.7, color: "#10b981" },
    { id: "pessimistic", name: "Pessimistic Model", enabled: false, weight: 0.7, color: "#ef4444" },
    { id: "seasonal", name: "Seasonal Model", enabled: false, weight: 0.5, color: "#8b5cf6" },
    { id: "regional", name: "Regional Model", enabled: false, weight: 0.6, color: "#f59e0b" },
  ]);

  // Voice command state
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceCommandHistory, setVoiceCommandHistory] = useState<string[]>([]);
  const [lastRecognizedCommand, setLastRecognizedCommand] = useState<string | null>(null);

  const handleMetricToggle = useCallback((metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  }, []);

  const handleLegendClick = useCallback((data: Payload) => {
    if (data.dataKey) {
      handleMetricToggle(data.dataKey.toString());
    }
  }, [handleMetricToggle]);

  const toggleSimulationMode = useCallback(() => {
    setSimulationMode(prev => !prev);
  }, []);

  const updateSimulationParam = useCallback((id: string, value: number) => {
    setSimulationParams(prev => 
      prev.map(param => 
        param.id === id 
          ? { ...param, value } 
          : param
      )
    );
  }, []);

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

  const toggleModelEnabled = useCallback((modelId: string) => {
    setModels(prev => 
      prev.map(model => 
        model.id === modelId
          ? { ...model, enabled: !model.enabled }
          : model
      )
    );
  }, []);

  const updateModelWeight = useCallback((modelId: string, weight: number) => {
    setModels(prev => 
      prev.map(model => 
        model.id === modelId
          ? { ...model, weight: Math.min(Math.max(weight, 0), 1) }
          : model
      )
    );
  }, []);

  const toggleVoiceCommands = useCallback(() => {
    setVoiceEnabled(prev => !prev);
  }, []);

  const processVoiceCommand = useCallback((command: string) => {
    setVoiceCommandHistory(prev => [...prev, command]);
    setLastRecognizedCommand(command);
    
    // Simple command handling example
    if (command.includes("show optimistic")) {
      toggleModelEnabled("optimistic");
    } else if (command.includes("hide pessimistic")) {
      toggleModelEnabled("pessimistic");
    } else if (command.includes("simulation mode")) {
      toggleSimulationMode();
    }
  }, [toggleModelEnabled, toggleSimulationMode]);

  useEffect(() => {
    // Mock effect for voice recognition - in a real implementation
    // this would connect to the browser's SpeechRecognition API
    let recognitionInterval: NodeJS.Timeout | null = null;
    
    if (voiceEnabled) {
      // Mock recognition of random commands for demo purposes
      const mockCommands = [
        "show optimistic model",
        "increase sentiment to 75 percent",
        "compare all models",
        "zoom in on last month",
        "highlight volatility factors"
      ];
      
      recognitionInterval = setInterval(() => {
        // For demo only - in production this would be triggered by actual speech recognition
        if (Math.random() > 0.9) {
          const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
          processVoiceCommand(randomCommand);
        }
      }, 10000);
    }
    
    return () => {
      if (recognitionInterval) {
        clearInterval(recognitionInterval);
      }
    };
  }, [voiceEnabled, processVoiceCommand]);

  return {
    timeRange,
    setTimeRange,
    selectedMetrics,
    layout,
    setLayout,
    handleLegendClick,
    handleMetricToggle,
    
    // Simulation features
    simulationMode,
    toggleSimulationMode,
    simulationParams,
    updateSimulationParam,
    
    // Collaborative features
    annotations,
    selectedAnnotation,
    setSelectedAnnotation,
    addAnnotation,
    addReplyToAnnotation,
    
    // Multi-model comparison
    models,
    toggleModelEnabled,
    updateModelWeight,
    
    // Voice commands
    voiceEnabled,
    toggleVoiceCommands,
    voiceCommandHistory,
    lastRecognizedCommand,
    processVoiceCommand
  };
};
