
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SimulationParams } from "../charts/hooks/use-simulation";

interface SimulationPanelProps {
  simulationMode: boolean;
  toggleSimulationMode: () => void;
  simulationParameters: Array<{
    id: string;
    name: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit: string;
  }>;
  updateSimulationParameter: (parameterId: string, value: number) => void;
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({
  simulationMode,
  toggleSimulationMode,
  simulationParameters,
  updateSimulationParameter
}) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Simulation</CardTitle>
            <CardDescription>Adjust market parameters</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="simulation-toggle" className="text-sm cursor-pointer">
              {simulationMode ? "Enabled" : "Disabled"}
            </Label>
            <Switch
              id="simulation-toggle"
              checked={simulationMode}
              onCheckedChange={toggleSimulationMode}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className={simulationMode ? "" : "opacity-50 pointer-events-none"}>
        <div className="space-y-5">
          {simulationParameters.map(param => (
            <div key={param.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor={`param-${param.id}`} className="text-sm">
                  {param.name}
                </Label>
                <span className="text-sm font-medium">
                  {param.value}
                  {param.unit}
                </span>
              </div>
              <Slider
                id={`param-${param.id}`}
                min={param.min}
                max={param.max}
                step={param.step}
                value={[param.value]}
                onValueChange={values => updateSimulationParameter(param.id, values[0])}
                className={simulationMode ? "" : ""}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
