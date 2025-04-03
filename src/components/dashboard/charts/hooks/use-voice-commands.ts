
import { useState, useEffect, useCallback } from 'react';

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supportsSpeechRecognition, setSupportsSpeechRecognition] = useState(false);

  // Check if the browser supports speech recognition
  useEffect(() => {
    const hasApi = 
      'webkitSpeechRecognition' in window || 
      'SpeechRecognition' in window;
    
    setSupportsSpeechRecognition(hasApi);
  }, []);

  const startListening = useCallback(() => {
    if (!supportsSpeechRecognition) return;
    
    setIsListening(true);
    setTranscript('');
    
    // This is just a mock implementation since we're not actually integrating
    // with the SpeechRecognition API in this example
    console.log("Voice commands: Started listening");
    
    // In a real implementation, we would set up the SpeechRecognition here
  }, [supportsSpeechRecognition]);

  const stopListening = useCallback(() => {
    if (!supportsSpeechRecognition) return;
    
    setIsListening(false);
    console.log("Voice commands: Stopped listening");
    
    // In a real implementation, we would stop the SpeechRecognition here
  }, [supportsSpeechRecognition]);

  const processCommand = useCallback((command: string) => {
    // Example command processing
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('show financial')) {
      return 'financial';
    } else if (lowerCommand.includes('show housing')) {
      return 'housing';
    }
    // Add more command processing logic as needed
    
    return null;
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    transcript,
    supportsSpeechRecognition,
    processCommand
  };
};
