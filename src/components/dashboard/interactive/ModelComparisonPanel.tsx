
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModelSettings } from "../charts/types/chart-state-types";
import { Separator } from "@/components/ui/separator";

interface ModelComparisonPanelProps {
  models: ModelSettings[];
  toggleModelEnabled: (modelId: string) => void;
  updateModelWeight: (modelId: string, weight: number) => void;
  isLoading?: boolean;
}

export const ModelComparisonPanel: React.FC<ModelComparisonPanelProps> = ({
  models,
  toggleModelEnabled,
  updateModelWeight,
  isLoading = false,
}) => {
  // Calculate total weight to ensure it's 100%
  const totalWeight = models
    .filter(model => model.enabled)
    .reduce((sum, model) => sum + model.weight, 0);

  // Format weight as percentage
  const formatWeight = (weight: number) => `${Math.round(weight * 100)}%`;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Model Weights</CardTitle>
            <CardDescription>Adjust model influence on predictions</CardDescription>
          </div>
          {isLoading && (
            <Badge variant="outline" className="bg-slate-100 text-slate-500">
              Syncing...
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress bar showing distribution of weights */}
          <div className="flex gap-0.5 h-2 mb-2 overflow-hidden rounded">
            {models
              .filter(model => model.enabled && model.weight > 0)
              .map(model => (
                <div
                  key={`progress-${model.id}`}
                  className="h-full transition-all duration-300 ease-in-out"
                  style={{
                    backgroundColor: model.color,
                    width: `${(model.weight / Math.max(totalWeight, 0.01)) * 100}%`
                  }}
                  title={`${model.name}: ${formatWeight(model.weight)}`}
                />
              ))}
          </div>

          {/* Total weight indicator */}
          <div className="text-xs text-right text-slate-500">
            Total: {formatWeight(totalWeight)}
            {Math.abs(totalWeight - 1) > 0.01 && (
              <span className="ml-1 text-amber-600">
                (not 100%)
              </span>
            )}
          </div>

          <Separator className="my-3" />

          {/* Model weight sliders */}
          <div className="space-y-6">
            {models.map(model => (
              <div key={model.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: model.color }}
                    ></div>
                    <Label htmlFor={`model-${model.id}`} className="text-sm font-medium">
                      {model.name}
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium w-12 text-right">
                      {formatWeight(model.weight)}
                    </span>
                    <Switch
                      id={`model-toggle-${model.id}`}
                      checked={model.enabled}
                      onCheckedChange={() => toggleModelEnabled(model.id)}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>
                </div>

                <Slider
                  id={`model-${model.id}`}
                  disabled={!model.enabled}
                  min={0}
                  max={1}
                  step={0.01}
                  value={[model.weight]}
                  onValueChange={([value]) => updateModelWeight(model.id, value)}
                  className={model.enabled ? "" : "opacity-50"}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
