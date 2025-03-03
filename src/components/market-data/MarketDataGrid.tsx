
import React from "react";
import { useNavigate } from "react-router-dom";
import MarketCard from "./MarketCard";
import type { MarketMetric } from "@/types/market";

interface MarketDataGridProps {
  groupedMetrics: Record<string, MarketMetric[]>;
}

const MarketDataGrid: React.FC<MarketDataGridProps> = ({ groupedMetrics }) => {
  const navigate = useNavigate();

  const handleMarketClick = (marketType: string) => {
    switch (marketType) {
      case 'housing':
        navigate('/housing-market');
        break;
      case 'agriculture':
        navigate('/agriculture-market');
        break;
      case 'mining':
        navigate('/mining-market');
        break;
      case 'green_hydrogen':
        navigate('/green-hydrogen-market');
        break;
      case 'cryptocurrency':
        navigate('/financial-market');
        break;
      default:
        console.log(`No route defined for ${marketType}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(groupedMetrics || {}).map(([marketType, metrics]) => (
        <MarketCard 
          key={marketType}
          marketType={marketType}
          metrics={metrics}
          onCardClick={() => handleMarketClick(marketType)}
          isClickable={true}
        />
      ))}
    </div>
  );
};

export default MarketDataGrid;
