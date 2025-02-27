
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { PlayCircle, Rewind, Save } from "lucide-react";
import { useChartState } from "../charts/use-chart-state";
import { useToast } from "@/components/ui/use-toast";

export const SimulationPanel: React.FC = () => {
  const { simulationMode, toggleSimulationMode, simulationParams, updateSimulationParam } = useChartState();
  const { toast } = useToast();

  const handleRunSimulation = () => {
    toast({
      title: "Simulation Started",
      description: "Your market simulation is now running with the current parameters.",
    });
  };

  const handleResetParameters = () => {
    toast({
      title: "Parameters Reset",
      description: "All simulation parameters have been reset to their default values.",
    });
  };

  const handleSaveScenario = () => {
    toast({
      title: "Scenario Saved",
      description: "Your market simulation scenario has been saved for future reference.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Market Simulation
          <Button 
            variant={simulationMode ? "secondary" : "outline"} 
            size="sm"
            onClick={toggleSimulationMode}
          >
            {simulationMode ? "Exit Simulation" : "Enter Simulation Mode"}
          </Button>
        </CardTitle>
        <CardDescription>
          Adjust parameters to simulate different market conditions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {simulationParams.map((param) => (
            <div key={param.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`param-${param.id}`}>{param.name}</Label>
                <span className="text-sm font-medium">
                  {param.value}{param.unit}
                </span>
              </div>
              <Slider
                id={`param-${param.id}`}
                min={param.min}
                max={param.max}
                step={param.step}
                value={[param.value]}
                onValueChange={(values) => updateSimulationParam(param.id, values[0])}
              />
            </div>
          ))}

          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleResetParameters}
              className="flex items-center gap-1"
            >
              <Rewind className="w-4 h-4" />
              Reset
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSaveScenario}
              className="flex items-center gap-1"
            >
              <Save className="w-4 h-4" />
              Save Scenario
            </Button>
            
            <Button 
              onClick={handleRunSimulation}
              className="flex items-center gap-1"
            >
              <PlayCircle className="w-4 h-4" />
              Run Simulation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
