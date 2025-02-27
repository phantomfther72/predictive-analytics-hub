
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelComparisonPanel } from "./interactive/ModelComparisonPanel";
import { SimulationPanel } from "./interactive/SimulationPanel";
import { CollaborationPanel } from "./interactive/CollaborationPanel";
import { VoiceCommandPanel } from "./interactive/VoiceCommandPanel";
import { BarChart, LineChart, Users, Mic } from "lucide-react";

export const InteractiveFeatures: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Interactive Analysis Tools</h2>
      
      <Tabs defaultValue="models">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="models" className="flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            <span className="hidden sm:inline">Model Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="simulation" className="flex items-center gap-2">
            <LineChart className="w-4 h-4" />
            <span className="hidden sm:inline">What-If Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Collaboration</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">Voice Commands</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="models">
          <ModelComparisonPanel />
        </TabsContent>
        
        <TabsContent value="simulation">
          <SimulationPanel />
        </TabsContent>
        
        <TabsContent value="collaboration">
          <CollaborationPanel />
        </TabsContent>
        
        <TabsContent value="voice">
          <VoiceCommandPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};
