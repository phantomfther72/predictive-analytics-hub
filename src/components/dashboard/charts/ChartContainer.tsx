
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Download, Maximize2, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
}

export const ChartContainer = ({
  id,
  title,
  description,
  children,
  className,
  isLoading,
  isEmpty,
}: ChartContainerProps) => {
  return (
    <div key={id} data-grid-id={id} className={cn("chart-container", className)}>
      <Card className="h-full overflow-hidden bg-card text-card-foreground">
        <CardHeader className="px-6 py-4 bg-card border-b flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {description && (
              <CardDescription className="text-sm text-muted-foreground">
                {description}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Download Chart</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Maximize2 className="h-4 w-4" />
                <span>Expand</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          <div className="h-[350px] w-full px-6 pb-6">{children}</div>
        </CardContent>
      </Card>
    </div>
  );
};
