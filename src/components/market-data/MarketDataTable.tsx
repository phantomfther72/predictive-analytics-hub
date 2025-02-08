
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

interface MarketDataTableProps {
  marketType: MarketMetric["market_type"];
  metrics: MarketMetric[];
}

export const MarketDataTable: React.FC<MarketDataTableProps> = ({
  marketType,
  metrics,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="rounded-lg border bg-card overflow-x-auto">
      <Table>
        <TableCaption>
          Real-time {marketType.charAt(0).toUpperCase() + marketType.slice(1)}{" "}
          Market Data
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Metric</TableHead>
            <TableHead className="min-w-[100px]">Value</TableHead>
            {!isMobile && (
              <>
                <TableHead className="min-w-[100px]">Source</TableHead>
                <TableHead className="min-w-[160px]">Last Updated</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric) => (
            <TableRow key={metric.id}>
              <TableCell className="font-medium">{metric.metric_name}</TableCell>
              <TableCell>{metric.value.toLocaleString()}</TableCell>
              {!isMobile && (
                <>
                  <TableCell>{metric.source}</TableCell>
                  <TableCell>
                    {new Date(metric.timestamp).toLocaleString()}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
