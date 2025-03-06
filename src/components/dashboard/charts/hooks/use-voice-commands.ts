
import { useState } from 'react';

export const useVoiceCommands = () => {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceCommandHistory, setVoiceCommandHistory] = useState<string[]>([]);
  const [lastRecognizedCommand, setLastRecognizedCommand] = useState<string | null>(null);

  const toggleVoiceCommands = () => {
    setVoiceEnabled(prev => !prev);
  };

  const processVoiceCommand = (command: string) => {
    setVoiceCommandHistory(prev => [...prev, command]);
    setLastRecognizedCommand(command);
  };

  return {
    voiceEnabled,
    toggleVoiceCommands,
    voiceCommandHistory,
    lastRecognizedCommand,
    processVoiceCommand,
  };
};
