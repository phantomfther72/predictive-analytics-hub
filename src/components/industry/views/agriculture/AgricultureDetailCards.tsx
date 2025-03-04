
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AgricultureMarketData } from "@/types/market";
import { Skeleton } from "@/components/ui/skeleton";

interface AgricultureDetailCardsProps {
  data: AgricultureMarketData[];
}

export const AgricultureDetailCards: React.FC<AgricultureDetailCardsProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
              <CardDescription>Loading...</CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[150px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Use slice safely - if there are less than 4 items, it will return all available items
  const displayData = data.slice(0, Math.min(4, data.length));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {displayData.map((item) => (
        <Card key={item.id || Math.random()} className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>{item.crop_type || "Unknown Crop"}</CardTitle>
            <CardDescription>Region: {item.region || "Unknown Region"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Cultivated Area</p>
                  <p className="font-medium">
                    {item.cultivated_acreage !== undefined && item.cultivated_acreage !== null 
                      ? item.cultivated_acreage.toLocaleString() 
                      : "N/A"} acres
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fertilizer Usage</p>
                  <p className="font-medium">
                    {item.fertilizer_usage_kg_ha !== undefined && item.fertilizer_usage_kg_ha !== null
                      ? item.fertilizer_usage_kg_ha
                      : "N/A"} kg/ha
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Export/Import</p>
                <p className="font-medium">
                  Export: {item.export_volume_tons !== undefined && item.export_volume_tons !== null
                    ? item.export_volume_tons.toLocaleString() 
                    : "N/A"} tons / 
                  Import: {item.import_volume_tons !== undefined && item.import_volume_tons !== null
                    ? item.import_volume_tons.toLocaleString() 
                    : "N/A"} tons
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {item.timestamp 
                    ? new Date(item.timestamp).toLocaleDateString() 
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
