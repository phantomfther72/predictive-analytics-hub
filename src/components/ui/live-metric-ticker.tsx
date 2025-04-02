
import React, { useState, useEffect } from "react";
import { Activity, ChevronDown } from "lucide-react";

interface MetricItem {
  id: number;
  label: string;
  value: string;
  trend: number;
  time: string;
}

export const LiveMetricTicker: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [metrics, setMetrics] = useState<MetricItem[]>([
    { id: 1, label: "S&P 500", value: "4,783.45", trend: 0.84, time: "just now" },
    { id: 2, label: "Gold", value: "$2,383.90", trend: 0.82, time: "2 min ago" },
    { id: 3, label: "Copper", value: "$4.78", trend: -1.25, time: "5 min ago" },
    { id: 4, label: "Wheat", value: "$219.42", trend: 2.14, time: "7 min ago" },
    { id: 5, label: "Housing Index", value: "342.8", trend: 0.3, time: "12 min ago" },
    { id: 6, label: "Lithium", value: "324.5", trend: -2.1, time: "15 min ago" },
  ]);
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMetricIndex = Math.floor(Math.random() * metrics.length);
      const updatedMetrics = [...metrics];
      
      // Generate a small random change
      const currentTrend = updatedMetrics[randomMetricIndex].trend;
      const randomChange = (Math.random() * 0.2 - 0.1).toFixed(2);
      const newTrend = parseFloat((currentTrend + parseFloat(randomChange)).toFixed(2));
      
      // Update the metric
      updatedMetrics[randomMetricIndex] = {
        ...updatedMetrics[randomMetricIndex],
        trend: newTrend,
        time: "just now"
      };
      
      setMetrics(updatedMetrics);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [metrics]);
  
  if (isCollapsed) {
    return (
      <div 
        className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        onClick={() => setIsCollapsed(false)}
      >
        <Activity className="h-4 w-4 text-slate-600 dark:text-slate-300" />
        <span className="text-sm font-medium">Show live market metrics</span>
        <ChevronDown className="h-4 w-4 ml-auto transform rotate-180" />
      </div>
    );
  }

  return (
    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3 shadow-sm animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-medium">Live Market Metrics</h3>
        </div>
        <button 
          onClick={() => setIsCollapsed(true)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
      
      <div className="mobile-scroll overflow-x-auto">
        <div className="inline-flex gap-4 min-w-full py-1.5">
          {metrics.map((metric) => (
            <div 
              key={metric.id} 
              className="flex flex-col items-start bg-white dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700 min-w-[150px] animate-fade-in"
            >
              <span className="text-xs text-slate-500 dark:text-slate-400">{metric.label}</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-medium">{metric.value}</span>
                <span 
                  className={`text-xs font-semibold ${
                    metric.trend >= 0 
                      ? "text-green-600 dark:text-green-400" 
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {metric.trend >= 0 ? '+' : ''}{metric.trend}%
                </span>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {metric.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
