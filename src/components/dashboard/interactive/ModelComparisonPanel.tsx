
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useChartState, ModelSettings } from "../charts/use-chart-state";

export const ModelComparisonPanel: React.FC = () => {
  const { models, toggleModelEnabled, updateModelWeight } = useChartState();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Multi-Model Comparison
          <Badge variant="outline" className="ml-2">Beta</Badge>
        </CardTitle>
        <CardDescription>
          Compare predictions from multiple statistical models
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {models.map((model) => (
          <div key={model.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: model.color }}
                />
                <Label htmlFor={`model-${model.id}`}>{model.name}</Label>
              </div>
              <Switch
                id={`model-${model.id}`}
                checked={model.enabled}
                onCheckedChange={() => toggleModelEnabled(model.id)}
              />
            </div>
            {model.enabled && (
              <div className="pl-6 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`weight-${model.id}`} className="text-sm text-muted-foreground">
                    Weighting: {Math.round(model.weight * 100)}%
                  </Label>
                </div>
                <Slider
                  id={`weight-${model.id}`}
                  min={0}
                  max={1}
                  step={0.05}
                  value={[model.weight]}
                  onValueChange={(values) => updateModelWeight(model.id, values[0])}
                />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
