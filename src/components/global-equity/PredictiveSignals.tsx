
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";
import { GlobalEquityData } from "@/types/global-equity";

interface PredictiveSignalsProps {
  data: GlobalEquityData[];
}

interface AISignal {
  id: string;
  type: 'bullish' | 'bearish' | 'neutral';
  strength: 'weak' | 'moderate' | 'strong';
  asset: string;
  confidence: number;
  timeframe: string;
  description: string;
  factors: string[];
  created_at: string;
  priority: 'low' | 'medium' | 'high';
}

export const PredictiveSignals: React.FC<PredictiveSignalsProps> = ({ data }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '1d' | '1w' | '1m'>('1d');

  // Generate mock AI signals based on the data
  const generateSignals = (): AISignal[] => {
    const signals: AISignal[] = [];
    
    data.forEach((asset, index) => {
      if (asset.predicted_change) {
        signals.push({
          id: `signal-${asset.symbol}-${index}`,
          type: asset.predicted_change > 0 ? 'bullish' : 'bearish',
          strength: Math.abs(asset.predicted_change) > 5 ? 'strong' : 
                   Math.abs(asset.predicted_change) > 2 ? 'moderate' : 'weak',
          asset: asset.symbol,
          confidence: asset.prediction_confidence * 100,
          timeframe: selectedTimeframe,
          description: asset.prediction_explanation || `AI predicts ${asset.predicted_change > 0 ? 'upward' : 'downward'} movement`,
          factors: [
            'Technical momentum',
            'Market sentiment',
            'Volume analysis',
            'Fundamental indicators'
          ],
          created_at: new Date().toISOString(),
          priority: Math.abs(asset.predicted_change) > 5 ? 'high' : 
                   Math.abs(asset.predicted_change) > 2 ? 'medium' : 'low'
        });
      }
    });

    // Add some macro signals
    signals.push({
      id: 'macro-oil-surge',
      type: 'bullish',
      strength: 'strong',
      asset: 'Oil & Gas',
      confidence: 84,
      timeframe: selectedTimeframe,
      description: 'Geopolitical tensions and supply constraints driving oil prices higher',
      factors: ['OPEC+ production cuts', 'Geopolitical tensions', 'Inventory drawdowns', 'Demand recovery'],
      created_at: new Date().toISOString(),
      priority: 'high'
    });

    signals.push({
      id: 'macro-namibia-growth',
      type: 'bullish',
      strength: 'moderate',
      asset: 'Namibian Markets',
      confidence: 72,
      timeframe: selectedTimeframe,
      description: 'Namibian economic indicators showing positive momentum in mining and renewable energy sectors',
      factors: ['Mining sector growth', 'Green hydrogen investments', 'Infrastructure development', 'Tourism recovery'],
      created_at: new Date().toISOString(),
      priority: 'medium'
    });

    return signals.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const signals = generateSignals();

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Target className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSignalColor = (type: string) => {
    switch (type) {
      case 'bullish': return 'text-green-600 bg-green-50 border-green-200';
      case 'bearish': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-purple-600 bg-purple-50';
      case 'moderate': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Predictive Signals
              </CardTitle>
              <CardDescription>
                Real-time AI-generated trading signals and market insights
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Live AI
              </Badge>
              <Badge variant="secondary">
                {signals.length} Active
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signals" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signals">Active Signals</TabsTrigger>
              <TabsTrigger value="trends">Market Trends</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="signals" className="space-y-6">
              {/* Timeframe Selector */}
              <div className="flex gap-2">
                {(['1h', '1d', '1w', '1m'] as const).map((timeframe) => (
                  <Button
                    key={timeframe}
                    variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTimeframe(timeframe)}
                  >
                    {timeframe}
                  </Button>
                ))}
              </div>

              {/* Signals List */}
              <div className="space-y-4">
                {signals.map((signal) => (
                  <Card key={signal.id} className={`border-l-4 ${getSignalColor(signal.type)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          {/* Signal Header */}
                          <div className="flex items-center gap-3">
                            {getSignalIcon(signal.type)}
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{signal.asset}</span>
                              <Badge className={getSignalColor(signal.type)}>
                                {signal.type}
                              </Badge>
                              <Badge className={getStrengthColor(signal.strength)}>
                                {signal.strength}
                              </Badge>
                            </div>
                            {getPriorityIcon(signal.priority)}
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground">
                            {signal.description}
                          </p>

                          {/* Confidence and Factors */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium">Confidence</span>
                                <span className="text-xs">{signal.confidence.toFixed(0)}%</span>
                              </div>
                              <Progress value={signal.confidence} className="h-2" />
                            </div>
                            
                            <div>
                              <span className="text-xs font-medium">Key Factors</span>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {signal.factors.slice(0, 3).map((factor, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {factor}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline">
                            Details
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-teal-600">
                            Trade
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Global Market Sentiment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Global Market Sentiment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Bullish Sentiment</span>
                      <span className="text-green-600 font-semibold">68%</span>
                    </div>
                    <Progress value={68} className="h-3" />
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="text-green-600 font-semibold">45%</div>
                        <div className="text-muted-foreground">Strong Buy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-600 font-semibold">23%</div>
                        <div className="text-muted-foreground">Buy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-600 font-semibold">32%</div>
                        <div className="text-muted-foreground">Hold/Sell</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Volatility Index */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Market Volatility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>VIX Equivalent</span>
                      <span className="text-yellow-600 font-semibold">24.5</span>
                    </div>
                    <Progress value={61} className="h-3" />
                    
                    <div className="text-sm text-muted-foreground">
                      <p>Moderate volatility levels. Consider protective strategies for high-risk positions.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily AI Insight */}
                <Card className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Today's AI Market Insight
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">
                      "Oil and gas sectors showing strong momentum driven by geopolitical tensions and supply constraints. 
                      Namibian mining sector benefits from global commodity demand. Consider defensive positioning in 
                      traditional equities as interest rate uncertainties persist."
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Generated by PredictivePulse AI</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Performing Predictions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Best Performing Predictions</CardTitle>
                    <CardDescription>Last 30 days accuracy</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { asset: 'Oil', accuracy: 89, prediction: '+12.5%', actual: '+11.8%' },
                      { asset: 'Gold', accuracy: 84, prediction: '-3.2%', actual: '-2.9%' },
                      { asset: 'AAPL', accuracy: 76, prediction: '+5.1%', actual: '+4.8%' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="flex-1">
                          <div className="font-medium">{item.asset}</div>
                          <div className="text-xs text-muted-foreground">
                            Predicted: {item.prediction} | Actual: {item.actual}
                          </div>
                        </div>
                        <Badge variant="outline">{item.accuracy}%</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
