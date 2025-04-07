
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bitcoin, BarChart3, TrendingUp, TrendingDown, CircleDollarSign } from "lucide-react";
import { CryptocurrencyData } from "@/types/market";
import { formatMarketCap, formatPercentChange, formatVolume } from "../utils/formatter";
import { motion } from "framer-motion";

interface MarketOverviewProps {
  data: CryptocurrencyData[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ data }) => {
  // Calculate market statistics
  const totalMarketCap = data.reduce((sum, crypto) => sum + crypto.market_cap_usd, 0);
  const totalVolume24h = data.reduce((sum, crypto) => sum + crypto.volume_24h_usd, 0);
  const topGainer = data.reduce((max, crypto) => 
    crypto.price_change_percentage_24h > (max?.price_change_percentage_24h || -Infinity) 
      ? crypto 
      : max, data[0]);
  const topLoser = data.reduce((min, crypto) => 
    crypto.price_change_percentage_24h < (min?.price_change_percentage_24h || Infinity) 
      ? crypto 
      : min, data[0]);

  // Motion variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Market Cap</p>
                <p className="text-2xl font-bold">{formatMarketCap(totalMarketCap)}</p>
              </div>
              <CircleDollarSign size={24} className="text-primary" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">24h Trading Volume</p>
                <p className="text-2xl font-bold">{formatVolume(totalVolume24h)}</p>
              </div>
              <BarChart3 size={24} className="text-primary" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Top Gainer (24h)</p>
                <p className="text-xl font-bold">{topGainer?.symbol}</p>
                <p className="text-sm font-medium text-emerald-500">
                  {formatPercentChange(topGainer?.price_change_percentage_24h || 0)}
                </p>
              </div>
              <TrendingUp size={24} className="text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Top Loser (24h)</p>
                <p className="text-xl font-bold">{topLoser?.symbol}</p>
                <p className="text-sm font-medium text-red-500">
                  {formatPercentChange(topLoser?.price_change_percentage_24h || 0)}
                </p>
              </div>
              <TrendingDown size={24} className="text-red-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default MarketOverview;
