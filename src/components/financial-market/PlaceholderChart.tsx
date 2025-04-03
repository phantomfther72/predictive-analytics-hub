
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { CHART_COLORS } from "../dashboard/charts/chart-constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { Info } from "lucide-react";

interface PlaceholderChartProps {
  title: string;
  description?: string;
  comingSoon?: boolean;
}

export const PlaceholderChart: React.FC<PlaceholderChartProps> = ({ 
  title, 
  description = "More data will be available soon", 
  comingSoon = true 
}) => {
  const isMobile = useIsMobile();
  
  // Generate some placeholder data for visual appeal
  const generatePlaceholderData = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      name: `Point ${i + 1}`,
      value: Math.floor(Math.random() * 100) + 20,
      forecast: Math.floor(Math.random() * 100) + 30
    }));
  };

  const placeholderData = React.useMemo(() => generatePlaceholderData(), []);

  return (
    <Card className="bg-slate-950/50 border-slate-800 shadow-lg animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white font-poppins tracking-tight">{title}</CardTitle>
            {description && <CardDescription className="text-slate-400">{description}</CardDescription>}
          </div>
          {comingSoon && (
            <div className="bg-blue-600/20 px-2 py-1 rounded text-xs font-medium text-blue-400 flex items-center">
              <Info size={12} className="mr-1" />
              Coming Soon
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className={`h-[${isMobile ? '300px' : '400px'}]`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={placeholderData}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
            <XAxis stroke={CHART_COLORS.text} />
            <YAxis stroke={CHART_COLORS.text} />
            <Legend />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a2234', 
                border: '1px solid #2a3649', 
                color: 'white',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              name="Simulated Data" 
              stroke={CHART_COLORS.primary} 
              strokeWidth={2} 
              dot={false}
              animationDuration={1200}
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              name="Forecast" 
              stroke={CHART_COLORS.prediction} 
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
