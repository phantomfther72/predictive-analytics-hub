
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, TrendingUp, AlertTriangle, Globe, Zap, MessageSquare } from 'lucide-react';
import { NamibianHeatmap } from './NamibianHeatmap';
import { MiningDashboard } from './industry-dashboards/MiningDashboard';
import { HousingDashboard } from './industry-dashboards/HousingDashboard';
import { AgricultureDashboard } from './industry-dashboards/AgricultureDashboard';
import { MedicalDashboard } from './industry-dashboards/MedicalDashboard';
import { GreenHydrogenDashboard } from './industry-dashboards/GreenHydrogenDashboard';
import { FinancialDashboard } from './industry-dashboards/FinancialDashboard';
import { ForecastingService } from './ForecastingService';
import { LanguageToggle } from './LanguageToggle';

export const PredictivePlatformDashboard = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('overview');
  const [language, setLanguage] = useState<'en' | 'oshiwambo'>('en');

  const industries = [
    { id: 'mining', name: 'Mining', icon: '⛏️', risk: 'medium', growth: '+12.4%' },
    { id: 'housing', name: 'Housing', icon: '🏠', risk: 'low', growth: '+8.7%' },
    { id: 'agriculture', name: 'Agriculture', icon: '🌾', risk: 'high', growth: '+3.2%' },
    { id: 'medical', name: 'Medical', icon: '🧬', risk: 'medium', growth: '+15.1%' },
    { id: 'hydrogen', name: 'Green Hydrogen', icon: '🧪', risk: 'low', growth: '+24.8%' },
    { id: 'financial', name: 'Financial', icon: '💸', risk: 'medium', growth: '+6.9%' }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-500/20 rounded-xl">
                <Globe className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Predictive Pulse</h1>
                <p className="text-slate-400">Namibian Economic Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle language={language} onLanguageChange={setLanguage} />
              <Button size="sm" className="bg-green-500/20 text-green-400 border-green-500/30">
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp Bot
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-2 bg-slate-800/50 p-2">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              Overview
            </TabsTrigger>
            {industries.map((industry) => (
              <TabsTrigger 
                key={industry.id}
                value={industry.id}
                className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
              >
                <span className="mr-2">{industry.icon}</span>
                <span className="hidden sm:inline">{industry.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-8 mt-8">
            {/* Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map((industry) => (
                <Card 
                  key={industry.id}
                  className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedIndustry(industry.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{industry.icon}</div>
                        <div>
                          <CardTitle className="text-white">{industry.name}</CardTitle>
                          <CardDescription>Sector Forecast</CardDescription>
                        </div>
                      </div>
                      <Badge className={getRiskColor(industry.risk)}>
                        {industry.risk.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 font-bold">{industry.growth}</span>
                      </div>
                      <div className="text-xs text-slate-400">12M Forecast</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Namibian Heatmap */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-green-400" />
                      Namibian Economic Heatmap
                    </CardTitle>
                    <CardDescription>Regional risk levels and investment flows</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-slate-400">Low Risk</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-slate-400">Medium Risk</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-slate-400">High Risk</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <NamibianHeatmap />
              </CardContent>
            </Card>

            {/* Forecasting as a Service */}
            <ForecastingService />
          </TabsContent>

          <TabsContent value="mining"><MiningDashboard language={language} /></TabsContent>
          <TabsContent value="housing"><HousingDashboard language={language} /></TabsContent>
          <TabsContent value="agriculture"><AgricultureDashboard language={language} /></TabsContent>
          <TabsContent value="medical"><MedicalDashboard language={language} /></TabsContent>
          <TabsContent value="hydrogen"><GreenHydrogenDashboard language={language} /></TabsContent>
          <TabsContent value="financial"><FinancialDashboard language={language} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
