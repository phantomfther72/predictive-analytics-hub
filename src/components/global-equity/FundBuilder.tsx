
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Briefcase, 
  Target, 
  TrendingUp, 
  Shield, 
  Settings, 
  BarChart3,
  DollarSign,
  AlertTriangle
} from "lucide-react";
import { FundStrategy } from "@/types/global-equity";

export const FundBuilder: React.FC = () => {
  const [fundName, setFundName] = useState('');
  const [fundDescription, setFundDescription] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [initialCapital, setInitialCapital] = useState<number>(10000);
  const [autoRebalance, setAutoRebalance] = useState(true);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');

  // Predefined strategies
  const strategies: FundStrategy[] = [
    {
      id: 'momentum-global',
      name: 'Global Momentum',
      type: 'momentum',
      description: 'Captures upward price trends across global markets with AI-enhanced entry/exit signals',
      risk_level: 'high',
      expected_return: 18.5,
      max_drawdown: 25,
      rebalance_frequency: 'weekly',
      asset_allocation: [
        { asset_class: 'equity', target_percentage: 70, min_percentage: 60, max_percentage: 80 },
        { asset_class: 'commodity', target_percentage: 20, min_percentage: 10, max_percentage: 30 },
        { asset_class: 'crypto', target_percentage: 10, min_percentage: 5, max_percentage: 15 }
      ]
    },
    {
      id: 'esg-balanced',
      name: 'ESG Balanced Growth',
      type: 'esg',
      description: 'Sustainable investing with focus on environmental, social, and governance criteria',
      risk_level: 'medium',
      expected_return: 12.3,
      max_drawdown: 15,
      rebalance_frequency: 'monthly',
      asset_allocation: [
        { asset_class: 'equity', target_percentage: 60, min_percentage: 50, max_percentage: 70 },
        { asset_class: 'fixed_income', target_percentage: 30, min_percentage: 20, max_percentage: 40 },
        { asset_class: 'real_estate', target_percentage: 10, min_percentage: 5, max_percentage: 15 }
      ]
    },
    {
      id: 'commodity-hedge',
      name: 'Commodity Hedge Fund',
      type: 'hybrid',
      description: 'Hedged exposure to commodities with AI-driven arbitrage opportunities',
      risk_level: 'high',
      expected_return: 22.1,
      max_drawdown: 30,
      rebalance_frequency: 'daily',
      asset_allocation: [
        { asset_class: 'commodity', target_percentage: 60, min_percentage: 50, max_percentage: 70 },
        { asset_class: 'equity', target_percentage: 30, min_percentage: 20, max_percentage: 40 },
        { asset_class: 'fixed_income', target_percentage: 10, min_percentage: 5, max_percentage: 15 }
      ]
    }
  ];

  const selectedStrategyData = strategies.find(s => s.id === selectedStrategy);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const validateForm = () => {
    return fundName.length > 0 && selectedStrategy.length > 0 && initialCapital >= 1000;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Fund-in-a-Box Builder
          </CardTitle>
          <CardDescription>
            Create your own AI-powered investment fund with custom strategies and automatic rebalancing
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
              <TabsTrigger value="allocation">Allocation</TabsTrigger>
              <TabsTrigger value="review">Review & Launch</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fund-name">Fund Name</Label>
                    <Input
                      id="fund-name"
                      placeholder="My AI Growth Fund"
                      value={fundName}
                      onChange={(e) => setFundName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="initial-capital">Initial Capital (USD)</Label>
                    <Input
                      id="initial-capital"
                      type="number"
                      min="1000"
                      placeholder="10000"
                      value={initialCapital}
                      onChange={(e) => setInitialCapital(Number(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum: $1,000
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="risk-level">Risk Tolerance</Label>
                    <Select value={riskLevel} onValueChange={(value: 'low' | 'medium' | 'high') => setRiskLevel(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Conservative (Low Risk)</SelectItem>
                        <SelectItem value="medium">Balanced (Medium Risk)</SelectItem>
                        <SelectItem value="high">Aggressive (High Risk)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fund-description">Description (Optional)</Label>
                    <Textarea
                      id="fund-description"
                      placeholder="Describe your investment goals and strategy..."
                      value={fundDescription}
                      onChange={(e) => setFundDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-rebalance">Auto-Rebalancing</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically rebalance portfolio based on strategy
                      </p>
                    </div>
                    <Switch
                      id="auto-rebalance"
                      checked={autoRebalance}
                      onCheckedChange={setAutoRebalance}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="strategy" className="space-y-6">
              <div>
                <Label>Choose Investment Strategy</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {strategies.map((strategy) => (
                    <Card 
                      key={strategy.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedStrategy === strategy.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
                      }`}
                      onClick={() => setSelectedStrategy(strategy.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{strategy.name}</CardTitle>
                          <Badge className={getRiskColor(strategy.risk_level)}>
                            {strategy.risk_level} risk
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">
                          {strategy.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Expected Return</div>
                            <div className="font-semibold text-green-600">
                              {strategy.expected_return}% p.a.
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Max Drawdown</div>
                            <div className="font-semibold text-red-600">
                              -{strategy.max_drawdown}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="text-xs text-muted-foreground mb-2">
                            Rebalances {strategy.rebalance_frequency}
                          </div>
                          <div className="space-y-1">
                            {strategy.asset_allocation.map((allocation, index) => (
                              <div key={index} className="flex items-center justify-between text-xs">
                                <span className="capitalize">{allocation.asset_class.replace('_', ' ')}</span>
                                <span>{allocation.target_percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="allocation" className="space-y-6">
              {selectedStrategyData && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Asset Allocation: {selectedStrategyData.name}
                      </CardTitle>
                      <CardDescription>
                        Detailed breakdown of your fund's asset allocation strategy
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {selectedStrategyData.asset_allocation.map((allocation, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">
                              {allocation.asset_class.replace('_', ' ')}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {allocation.min_percentage}% - {allocation.max_percentage}%
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>Target: {allocation.target_percentage}%</span>
                            </div>
                            <Progress value={allocation.target_percentage} className="h-2" />
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                              AI-Powered Optimization
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                              Our AI will continuously monitor market conditions and adjust allocations within 
                              the specified ranges to optimize risk-adjusted returns.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="review" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Review & Launch Fund
                  </CardTitle>
                  <CardDescription>
                    Review your fund configuration before launching
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Fund Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Fund Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span>{fundName || 'Unnamed Fund'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Strategy:</span>
                          <span>{selectedStrategyData?.name || 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Initial Capital:</span>
                          <span>${initialCapital.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Risk Level:</span>
                          <Badge className={getRiskColor(selectedStrategyData?.risk_level || 'medium')}>
                            {selectedStrategyData?.risk_level || 'medium'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Auto-Rebalance:</span>
                          <span>{autoRebalance ? 'Enabled' : 'Disabled'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Expected Performance</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expected Return:</span>
                          <span className="text-green-600 font-semibold">
                            {selectedStrategyData?.expected_return || 0}% p.a.
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Max Drawdown:</span>
                          <span className="text-red-600 font-semibold">
                            -{selectedStrategyData?.max_drawdown || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rebalancing:</span>
                          <span>{selectedStrategyData?.rebalance_frequency || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Validation & Launch */}
                  <div className="border-t pt-6">
                    {!validateForm() && (
                      <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg mb-4">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-700 dark:text-yellow-200">
                          Please complete all required fields before launching your fund.
                        </span>
                      </div>
                    )}
                    
                    <div className="flex gap-4">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600"
                        disabled={!validateForm()}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Launch Fund
                      </Button>
                      <Button variant="outline">
                        Save as Draft
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
