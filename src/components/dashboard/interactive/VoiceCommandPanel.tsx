
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff } from "lucide-react";
import { useChartState } from "../charts/use-chart-state";
import { ScrollArea } from "@/components/ui/scroll-area";

export const VoiceCommandPanel: React.FC = () => {
  const { 
    isListening, 
    startListening: startListeningFromHook,
    stopListening: stopListeningFromHook,
    supportsSpeechRecognition,
    processCommand
  } = useChartState();
  
  // Local state for UI purposes
  const [listening, setListening] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  const startListening = () => {
    if (!supportsSpeechRecognition) return;
    
    setListening(true);
    startListeningFromHook();
    
    // For demo purposes, we'll simulate a recognized command
    setTimeout(() => {
      const demoCommand = "Show the optimistic model prediction";
      handleProcessCommand(demoCommand);
    }, 2000);
  };

  const stopListening = () => {
    setListening(false);
    stopListeningFromHook();
  };

  const handleProcessCommand = (command: string) => {
    setLastCommand(command);
    setCommandHistory(prev => [...prev, command]);
    processCommand(command);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Voice Commands
          <Badge variant="outline" className="ml-2">Experimental</Badge>
        </CardTitle>
        <CardDescription>
          Control charts using natural language
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!supportsSpeechRecognition ? (
          <div className="py-4 text-center text-muted-foreground">
            <p>Voice recognition is not supported in your browser.</p>
            <p className="text-sm mt-2">Try using Chrome or Edge for this feature.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Button
                variant={listening ? "destructive" : "outline"}
                size="lg"
                className="rounded-full w-16 h-16 flex items-center justify-center"
                onClick={listening ? stopListening : startListening}
              >
                {listening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>
            </div>
            
            {lastCommand && (
              <div className="mt-4 p-3 bg-muted rounded-md text-center">
                <p className="text-sm text-muted-foreground mb-1">Last recognized command:</p>
                <p className="font-medium">{lastCommand}</p>
              </div>
            )}
            
            {commandHistory.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Command History</h4>
                <ScrollArea className="h-[120px]">
                  <ul className="space-y-2">
                    {[...commandHistory].reverse().map((command, index) => (
                      <li key={index} className="text-sm p-2 bg-muted/50 rounded">
                        {command}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            )}
            
            <div className="mt-4 text-xs text-muted-foreground">
              <p className="font-medium mb-1">Try saying:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>"Show optimistic model"</li>
                <li>"Compare all models"</li>
                <li>"Zoom in on last quarter"</li>
                <li>"Enter simulation mode"</li>
                <li>"Increase sentiment to 75%"</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
