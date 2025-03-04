
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
      {displayData.map((item) => {
        // Safe access to properties with default values
        const cropType = item.crop_type || "Unknown Crop";
        const region = item.region || "Unknown Region";
        const cultivatedAcreage = typeof item.cultivated_acreage === 'number' ? item.cultivated_acreage : 0;
        const fertilizerUsage = typeof item.fertilizer_usage_kg_ha === 'number' ? item.fertilizer_usage_kg_ha : 0;
        const exportVolume = typeof item.export_volume_tons === 'number' ? item.export_volume_tons : 0;
        const importVolume = typeof item.import_volume_tons === 'number' ? item.import_volume_tons : 0;
        const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleDateString() : "N/A";
        
        return (
          <Card key={item.id || Math.random()} className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>{cropType}</CardTitle>
              <CardDescription>Region: {region}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Cultivated Area</p>
                    <p className="font-medium">
                      {cultivatedAcreage.toLocaleString()} acres
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fertilizer Usage</p>
                    <p className="font-medium">
                      {fertilizerUsage} kg/ha
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Export/Import</p>
                  <p className="font-medium">
                    Export: {exportVolume.toLocaleString()} tons / 
                    Import: {importVolume.toLocaleString()} tons
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{timestamp}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
