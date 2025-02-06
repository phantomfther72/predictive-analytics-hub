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

interface MarketDataTableProps {
  marketType: MarketMetric["market_type"];
  metrics: MarketMetric[];
}

export const MarketDataTable: React.FC<MarketDataTableProps> = ({
  marketType,
  metrics,
}) => {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableCaption>
          Real-time {marketType.charAt(0).toUpperCase() + marketType.slice(1)}{" "}
          Market Data
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric) => (
            <TableRow key={metric.id}>
              <TableCell className="font-medium">{metric.metric_name}</TableCell>
              <TableCell>{metric.value.toLocaleString()}</TableCell>
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