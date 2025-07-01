
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, TrendingDown, TrendingUp } from 'lucide-react';
import { Forecast } from '@/hooks/usePredictiveData';

interface MiningRiskAssessmentProps {
  commodityData: Array<{
    commodity: string;
    production: number;
    marketValue: number;
    forecast: number;
    confidence: number;
    risk: string;
  }>;
  forecasts: Forecast[];
  selectedRegion: string;
}

export const MiningRiskAssessment: React.FC<MiningRiskAssessmentProps> = ({
  commodityData,
  forecasts,
  selectedRegion
}) => {
  const riskAnalysis = React.useMemo(() => {
    const highRiskCount = commodityData.filter(c => c.risk === 'high').length;
    const mediumRiskCount = commodityData.filter(c => c.risk === 'medium').length;
    const lowRiskCount = commodityData.filter(c => c.risk === 'low').length;
    const totalCommodities = commodityData.length;

    const overallRiskScore = (
      (highRiskCount * 3 + mediumRiskCount * 2 + lowRiskCount * 1) / 
      (totalCommodities * 3)
    ) * 100;

    const avgConfidence = forecasts.reduce((sum, f) => sum + (f.confidence_interval || 0), 0) / (forecasts.length || 1);
    
    return {
      overallRiskScore,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      totalCommodities,
      avgConfidence: avgConfidence * 100,
      riskLevel: overallRiskScore > 70 ? 'high' : overallRiskScore > 40 ? 'medium' : 'low'
    };
  }, [commodityData, forecasts]);

  const riskFactors = [
    {
      name: 'Market Volatility',
      score: 65,
      trend: 'increasing',
      description: 'Global commodity price fluctuations affecting local markets'
    },
    {
      name: 'Regulatory Changes',
      score: 45,
      trend: 'stable',
      description: 'Environmental and mining legislation developments'
    },
    {
      name: 'Infrastructure Risk',
      score: 30,
      trend: 'decreasing',
      description: 'Transportation and logistics challenges'
    },
    {
      name: 'Water Scarcity',
      score: 75,
      trend: 'increasing',
      description: 'Drought conditions affecting mining operations'
    },
    {
      name: 'Labor Disputes',
      score: 25,
      trend: 'stable',
      description: 'Industrial relations and workforce stability'
    },
    {
      name: 'Energy Costs',
      score: 55,
      trend: 'increasing',
      description: 'Rising electricity and fuel costs'
    }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 70) return 'bg-red-500/20 border-red-500/30';
    if (score >= 40) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-green-500/20 border-green-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Overall Risk Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-400" />
              Overall Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">
              {riskAnalysis.overallRiskScore.toFixed(0)}%
            </div>
            <Progress value={riskAnalysis.overallRiskScore} className="mb-2" />
            <Badge className={getRiskBgColor(riskAnalysis.overallRiskScore)}>
              {riskAnalysis.riskLevel.toUpperCase()} RISK
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-red-400">High Risk</span>
              <span className="text-white font-medium">{riskAnalysis.highRiskCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-400">Medium Risk</span>
              <span className="text-white font-medium">{riskAnalysis.mediumRiskCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-400">Low Risk</span>
              <span className="text-white font-medium">{riskAnalysis.lowRiskCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">Forecast Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">
              {riskAnalysis.avgConfidence.toFixed(0)}%
            </div>
            <Progress value={riskAnalysis.avgConfidence} className="mb-2" />
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Model Accuracy
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors Analysis */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-400" />
            Risk Factors Analysis
          </CardTitle>
          <CardDescription>
            Key risk factors affecting mining operations in {selectedRegion || 'all regions'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskFactors.map((factor) => (
              <div key={factor.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-medium">{factor.name}</span>
                    {factor.trend === 'increasing' && <TrendingUp className="h-4 w-4 text-red-400" />}
                    {factor.trend === 'decreasing' && <TrendingDown className="h-4 w-4 text-green-400" />}
                    {factor.trend === 'stable' && <div className="h-4 w-4 bg-yellow-400 rounded-full"></div>}
                  </div>
                  <span className={`font-bold ${getRiskColor(factor.score)}`}>
                    {factor.score}%
                  </span>
                </div>
                <Progress value={factor.score} className="h-2" />
                <p className="text-sm text-slate-400">{factor.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commodity-Specific Risks */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Commodity Risk Assessment</CardTitle>
          <CardDescription>Individual risk profiles for each commodity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commodityData.map((commodity) => (
              <div key={commodity.commodity} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">{commodity.commodity}</h4>
                  <Badge className={getRiskBgColor(commodity.forecast < 0 ? 80 : commodity.forecast > 5 ? 20 : 50)}>
                    {commodity.risk.toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Production Risk:</span>
                    <span className={getRiskColor(commodity.production < 100000 ? 70 : 30)}>
                      {commodity.production < 100000 ? 'High' : 'Low'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Market Risk:</span>
                    <span className={getRiskColor(Math.abs(commodity.forecast) > 10 ? 80 : 40)}>
                      {Math.abs(commodity.forecast) > 10 ? 'High' : 'Medium'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Forecast Confidence:</span>
                    <span className={getRiskColor(100 - commodity.confidence * 100)}>
                      {(commodity.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
