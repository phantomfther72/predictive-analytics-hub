
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useChartState } from "../charts/use-chart-state";
import { ModelSettings } from "../charts/types/chart-state-types";
import { Sparkles, RefreshCw, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const ModelComparisonPanel: React.FC = () => {
  const { models, toggleModelEnabled, updateModelWeight, fetchModels } = useChartState();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Calculate total weight
  const totalWeight = models.reduce((sum, model) => 
    model.enabled ? sum + model.weight : sum, 0
  );
  
  // Function to handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchModels();
      toast({
        title: "Models Refreshed",
        description: "The latest model settings have been loaded.",
      });
    } catch (error) {
      console.error("Error refreshing models:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <CardTitle>Multi-Model Comparison</CardTitle>
            <Badge variant="outline" className="ml-1">Beta</Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh models</span>
          </Button>
        </div>
        <CardDescription className="flex items-center gap-1.5">
          Compare and combine predictions from multiple statistical models
          {!isAuthenticated && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-flex items-center">
                    <Info className="h-4 w-4 text-amber-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Sign in to save your model weight preferences across sessions.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Model</span>
          <span className="text-muted-foreground">Weight</span>
        </div>
        
        {models.map((model) => (
          <div key={model.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: model.color }}
                />
                <Label htmlFor={`model-${model.id}`} className="font-medium">
                  {model.name}
                </Label>
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
                    Weighting
                  </Label>
                  <span className="text-sm font-medium">
                    {Math.round(model.weight * 100)}%
                  </span>
                </div>
                <Slider
                  id={`weight-${model.id}`}
                  min={0}
                  max={1}
                  step={0.05}
                  value={[model.weight]}
                  onValueChange={(values) => updateModelWeight(model.id, values[0])}
                  className="mb-1"
                />
              </div>
            )}
          </div>
        ))}
        
        {/* Total weight indicator */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Total Weight:</span>
            <span 
              className={`font-bold ${
                Math.abs(totalWeight - 1) < 0.01 
                  ? 'text-green-600 dark:text-green-500' 
                  : 'text-amber-600 dark:text-amber-500'
              }`}
            >
              {Math.round(totalWeight * 100)}%
            </span>
          </div>
          {Math.abs(totalWeight - 1) >= 0.01 && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-500">
              Note: For best results, weights should add up to exactly 100%.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
