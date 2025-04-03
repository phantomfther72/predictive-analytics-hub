
import React from "react";
import { 
  BarChart,
  LineChart,
  User,
  Landmark,
  TrendingUp,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export const InteractiveFeatures = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-between items-center">
      <div className="flex flex-wrap gap-2">
        <Tabs defaultValue="charts" className="w-auto">
          <TabsList className="bg-muted">
            <TabsTrigger value="charts" className="flex items-center gap-1">
              <LineChart className="h-4 w-4" />
              <span className="hidden sm:inline">Charts</span>
            </TabsTrigger>
            <TabsTrigger value="tables" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              <span className="hidden sm:inline">Tables</span>
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Models</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" className="flex items-center gap-1">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="secondary" className="gap-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Collaborate</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Invite team members to collaborate</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1">
              <Landmark className="h-4 w-4" />
              <Badge variant="secondary" className="ml-1">4</Badge>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>4 active market events</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
