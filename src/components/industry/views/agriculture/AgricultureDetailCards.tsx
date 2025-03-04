
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AgricultureMarketData } from "@/types/market";

interface AgricultureDetailCardsProps {
  data: AgricultureMarketData[];
}

export const AgricultureDetailCards: React.FC<AgricultureDetailCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.slice(0, 4).map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.crop_type}</CardTitle>
            <CardDescription>Region: {item.region}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Cultivated Area</p>
                  <p className="font-medium">{item.cultivated_acreage.toLocaleString()} acres</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fertilizer Usage</p>
                  <p className="font-medium">{item.fertilizer_usage_kg_ha} kg/ha</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Export/Import</p>
                <p className="font-medium">
                  Export: {item.export_volume_tons.toLocaleString()} tons / 
                  Import: {item.import_volume_tons.toLocaleString()} tons
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{new Date(item.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
