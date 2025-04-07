
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CryptocurrencyData } from "@/types/market";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { 
  formatCryptoPrice, 
  formatMarketCap, 
  formatPercentChange, 
  formatVolume, 
  formatSupply, 
  getColorForChange 
} from "../utils/formatter";
import PredictionBadge from "@/components/market-data/PredictionBadge";

interface CryptoTableProps {
  data: CryptocurrencyData[];
  sortField: string;
  sortDirection: "asc" | "desc";
}

const CryptoTable: React.FC<CryptoTableProps> = ({
  data,
  sortField,
  sortDirection
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Cryptocurrencies</CardTitle>
        <CardDescription>
          Market data sorted by {sortField.replace('_', ' ')} ({sortDirection === 'asc' ? 'ascending' : 'descending'})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left font-medium p-4">#</th>
                <th className="text-left font-medium p-4">Name</th>
                <th className="text-right font-medium p-4">Price</th>
                <th className="text-right font-medium p-4">24h %</th>
                <th className="text-right font-medium p-4">Market Cap</th>
                <th className="text-right font-medium p-4">Volume (24h)</th>
                <th className="text-right font-medium p-4">Supply</th>
                <th className="text-right font-medium p-4">Prediction</th>
              </tr>
            </thead>
            <tbody>
              {data.map((crypto, index) => (
                <motion.tr 
                  key={crypto.id}
                  className="border-b hover:bg-muted/50 cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {crypto.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{crypto.name}</div>
                        <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium">
                    {formatCryptoPrice(crypto.current_price_usd)}
                  </td>
                  <td className={`p-4 text-right font-medium ${getColorForChange(crypto.price_change_percentage_24h)}`}>
                    <div className="flex items-center justify-end gap-1">
                      {crypto.price_change_percentage_24h > 0 ? 
                        <ChevronUp size={16} /> : 
                        <ChevronDown size={16} />
                      }
                      {formatPercentChange(crypto.price_change_percentage_24h)}
                    </div>
                  </td>
                  <td className="p-4 text-right">{formatMarketCap(crypto.market_cap_usd)}</td>
                  <td className="p-4 text-right">{formatVolume(crypto.volume_24h_usd)}</td>
                  <td className="p-4 text-right">{formatSupply(crypto.circulating_supply)}</td>
                  <td className="p-4 text-right">
                    <PredictionBadge 
                      value={crypto.predicted_change} 
                      confidence={crypto.prediction_confidence}
                      factors={crypto.prediction_factors}
                      size="sm"
                    />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoTable;
