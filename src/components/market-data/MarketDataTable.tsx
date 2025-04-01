
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MarketMetric } from "@/types/market";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MarketDataTableProps {
  marketType: MarketMetric["market_type"];
  metrics: MarketMetric[];
}

export const MarketDataTable: React.FC<MarketDataTableProps> = ({
  marketType,
  metrics,
}) => {
  const isMobile = useIsMobile();

  const formatValue = (value: any, metricName: string): string => {
    if (typeof value === 'number') {
      // Format currency values
      if (metricName.toLowerCase().includes('price')) {
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          maximumFractionDigits: 0
        }).format(value);
      }
      // Format other numbers
      return value.toLocaleString();
    }
    return String(value);
  };

  const renderMobileRow = (metric: MarketMetric) => {
    return (
      <div key={metric.id} className="p-4 border-b last:border-b-0">
        <div className="flex justify-between items-start">
          <div className="font-medium text-slate-900">{metric.metric_name}</div>
          <div className="text-lg font-semibold text-right">
            {formatValue(metric.value, metric.metric_name)}
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-slate-500">
          <div>{metric.source}</div>
          <div>{new Date(metric.timestamp).toLocaleDateString()}</div>
        </div>
      </div>
    );
  };

  // Use a simpler layout on mobile
  if (isMobile) {
    return (
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-slate-900">
              {marketType.charAt(0).toUpperCase() + marketType.slice(1).replace('_', ' ')}{" "}
              Market Data
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Real-time market data and metrics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {metrics.map(renderMobileRow)}
        </div>
      </div>
    );
  }

  // Regular table view for desktop
  return (
    <div className="rounded-lg border bg-card overflow-x-auto">
      <Table>
        <TableCaption>
          Real-time {marketType.charAt(0).toUpperCase() + marketType.slice(1).replace('_', ' ')}{" "}
          Market Data
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Metric</TableHead>
            <TableHead className="min-w-[100px]">Value</TableHead>
            <TableHead className="min-w-[100px]">Source</TableHead>
            <TableHead className="min-w-[160px]">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric) => (
            <TableRow key={metric.id}>
              <TableCell className="font-medium">{metric.metric_name}</TableCell>
              <TableCell>{formatValue(metric.value, metric.metric_name)}</TableCell>
              <TableCell>{metric.source}</TableCell>
              <TableCell>
                {new Date(metric.timestamp).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
