
import { useState, useCallback, useEffect } from "react";

export const useVoiceCommands = (
  toggleModelEnabled: (modelId: string) => void,
  toggleSimulationMode: () => void
) => {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceCommandHistory, setVoiceCommandHistory] = useState<string[]>([]);
  const [lastRecognizedCommand, setLastRecognizedCommand] = useState<string | null>(null);

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
    voiceEnabled,
    toggleVoiceCommands,
    voiceCommandHistory,
    lastRecognizedCommand,
    processVoiceCommand
  };
};
