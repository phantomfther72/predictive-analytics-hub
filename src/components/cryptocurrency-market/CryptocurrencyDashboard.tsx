
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CryptocurrencyChart } from "@/components/dashboard/charts/cryptocurrency";
import { CryptocurrencyData } from "@/types/market";
import { formatCryptoPrice, formatMarketCap, formatPercentChange, formatVolume, formatSupply, getColorForChange } from "./utils/formatter";
import { Bitcoin, ChevronDown, ChevronUp, DollarSign, BarChart3, TrendingUp, TrendingDown, Search, Filter, RefreshCw, CircleDollarSign, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import PredictionBadge from "@/components/market-data/PredictionBadge";
import type { Payload } from "recharts/types/component/DefaultLegendContent";
import { motion } from "framer-motion";

interface CryptocurrencyDashboardProps {
  data: CryptocurrencyData[];
}

export const CryptocurrencyDashboard: React.FC<CryptocurrencyDashboardProps> = ({ 
  data 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("market_cap_usd");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["current_price_usd", "market_cap_usd", "price_change_percentage_24h"]);
  const [timeRange, setTimeRange] = useState<string>("24h");
  const [activeTab, setActiveTab] = useState<string>("overview");

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

  // Filter and sort data
  const filteredData = data
    .filter(crypto => 
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const fieldA = a[sortField as keyof CryptocurrencyData];
      const fieldB = b[sortField as keyof CryptocurrencyData];
      
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
      
      // Default sort for non-numeric fields
      return sortDirection === 'asc' 
        ? String(fieldA).localeCompare(String(fieldB))
        : String(fieldB).localeCompare(String(fieldA));
    });

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric) 
        : [...prev, metric]
    );
  };

  const handleLegendClick = (data: Payload) => {
    if (data && data.dataKey) {
      toggleMetric(String(data.dataKey));
    }
  };

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
    <div className="space-y-6">
      {/* Market Overview Stats */}
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

      {/* Filter Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cryptocurrency..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-8"
              />
            </div>
            
            <div className="flex gap-2 items-center w-full md:w-auto">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market_cap_usd">Market Cap</SelectItem>
                  <SelectItem value="current_price_usd">Price</SelectItem>
                  <SelectItem value="price_change_percentage_24h">24h Change</SelectItem>
                  <SelectItem value="volume_24h_usd">Volume</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={toggleSortDirection}>
                {sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
              
              <Button variant="outline" size="icon" className="md:hidden">
                <Filter size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="markets">Markets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Main Chart */}
            <Card className="bg-slate-50 dark:bg-slate-900 border-0 shadow-md">
              <CardHeader>
                <CardTitle>Cryptocurrency Market Comparison</CardTitle>
                <CardDescription>
                  Compare key metrics across different cryptocurrencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CryptocurrencyChart 
                  data={filteredData.slice(0, 10)}
                  selectedMetrics={selectedMetrics}
                  onLegendClick={handleLegendClick}
                  timeRange={timeRange}
                />
              </CardContent>
            </Card>
            
            {/* Cryptocurrency Table */}
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
                      {filteredData.map((crypto, index) => (
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
          </div>
        </TabsContent>
        
        <TabsContent value="charts">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Charts</CardTitle>
              <CardDescription>
                Interactive charts and technical analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-10">
                <p className="text-muted-foreground">Advanced charts coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="markets">
          <Card>
            <CardHeader>
              <CardTitle>Markets & Exchanges</CardTitle>
              <CardDescription>
                Trading pairs and exchange information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-10">
                <p className="text-muted-foreground">Market details coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
