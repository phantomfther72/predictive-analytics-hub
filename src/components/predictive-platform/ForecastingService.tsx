
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Zap, BarChart3, Download, Code } from 'lucide-react';

export const ForecastingService = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [forecastDescription, setForecastDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleForecast = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  const sampleAPIs = [
    { name: 'Basic Forecast', endpoint: '/api/forecast', price: 'N$25/call' },
    { name: 'Risk Analysis', endpoint: '/api/risk-analysis', price: 'N$45/call' },
    { name: 'Trend Prediction', endpoint: '/api/trends', price: 'N$35/call' },
    { name: 'Custom Models', endpoint: '/api/custom', price: 'N$85/call' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* FaaS Upload Interface */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="h-5 w-5 mr-2 text-green-400" />
            Forecasting-as-a-Service
          </CardTitle>
          <CardDescription>
            Upload your data (CSV/JSON) for AI-powered insights and predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-400 mb-2">Drag & drop your dataset here</p>
            <Input
              type="file"
              accept=".csv,.json"
              onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer">
                Choose File
              </Button>
            </label>
            {uploadedFile && (
              <div className="mt-2 text-sm text-green-400">
                ✓ {uploadedFile.name} uploaded
              </div>
            )}
          </div>

          <Textarea
            placeholder="Describe what you'd like to forecast (e.g., 'Predict quarterly sales trends', 'Analyze customer behavior patterns')"
            value={forecastDescription}
            onChange={(e) => setForecastDescription(e.target.value)}
            className="bg-slate-900/50 border-slate-600"
          />

          <Button 
            onClick={handleForecast}
            disabled={!uploadedFile || isProcessing}
            className="w-full bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Forecast
              </>
            )}
          </Button>

          {isProcessing && (
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
              <div className="space-y-2">
                <div className="text-sm text-slate-400">AI Analysis Progress:</div>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Data validation complete
                  </div>
                  <div className="flex items-center text-xs text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Pattern recognition in progress...
                  </div>
                  <div className="flex items-center text-xs text-slate-400">
                    <div className="w-2 h-2 bg-slate-600 rounded-full mr-2"></div>
                    Generating predictions...
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Code className="h-5 w-5 mr-2 text-green-400" />
            API Integration Hub
          </CardTitle>
          <CardDescription>
            Integrate our forecasting APIs into your business systems
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sampleAPIs.map((api, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-600">
              <div>
                <div className="font-medium text-white">{api.name}</div>
                <code className="text-xs text-slate-400">{api.endpoint}</code>
              </div>
              <div className="text-right">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {api.price}
                </Badge>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-slate-700">
            <div className="text-sm text-slate-400 mb-3">Sample API Call:</div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-600 font-mono text-xs text-slate-300">
              <div className="text-green-400">POST</div>
              <div>/api/forecast</div>
              <div className="mt-2 text-slate-400">
                {`{
  "data": [...],
  "type": "trend_analysis",
  "horizon": "6_months"
}`}
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download API Documentation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
