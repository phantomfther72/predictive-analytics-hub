import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, TrendingUp, AlertTriangle, Activity, Users, Calculator } from 'lucide-react';
import { namibiaRegions, NamibiaRegion } from './namibia-data';
import { NamibiaMap } from './NamibiaMap';
import { RegionTooltip } from './RegionTooltip';
import { cn } from '@/lib/utils';

interface NamibiaHeatmapProps {
  selectedIndustry?: string;
  selectedMetric?: string;
  data?: any[];
}

export const NamibiaHeatmap: React.FC<NamibiaHeatmapProps> = ({ 
  selectedIndustry = 'all', 
  selectedMetric = 'growth',
  data = []
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'absolute' | 'percapita'>('absolute');
  const [dataType, setDataType] = useState<'growth' | 'risk' | 'investment'>('growth');
  const [showNoData, setShowNoData] = useState(true);

  // Process data with proper region mapping
  const processedRegions = useMemo(() => {
    return namibiaRegions.map(region => {
      // Find matching data using alias mapping
      const regionData = data.find(d => {
        const normalizedDataRegion = d.region?.toLowerCase().replace(/[^a-z]/g, '');
        const normalizedRegionName = region.name.toLowerCase().replace(/[^a-z]/g, '');
        const normalizedRegionCode = region.code.toLowerCase();
        
        return normalizedDataRegion === normalizedRegionName || 
               normalizedDataRegion === normalizedRegionCode ||
               region.aliases?.some(alias => 
                 alias.toLowerCase().replace(/[^a-z]/g, '') === normalizedDataRegion
               );
      });

      // Calculate metrics based on data or use defaults
      let value = 0;
      let hasData = false;

      if (regionData) {
        hasData = true;
        switch (dataType) {
          case 'growth':
            value = regionData.growth_rate || regionData.forecast || 0;
            break;
          case 'risk':
            value = regionData.risk_score || (regionData.risk === 'high' ? 3 : regionData.risk === 'medium' ? 2 : 1);
            break;
          case 'investment':
            value = regionData.investment_volume || regionData.investment || 0;
            break;
          default:
            value = 0;
        }

        // Apply per capita normalization if needed
        if (viewMode === 'percapita' && region.population > 0) {
          value = (value / region.population) * 100000; // Per 100k people
        }
      }

      return {
        ...region,
        value,
        hasData,
        rawData: regionData
      };
    });
  }, [data, dataType, viewMode]);

  // Calculate color scale bounds
  const { minValue, maxValue, medianValue } = useMemo(() => {
    const values = processedRegions.filter(r => r.hasData).map(r => r.value);
    if (values.length === 0) return { minValue: 0, maxValue: 100, medianValue: 50 };
    
    const sorted = [...values].sort((a, b) => a - b);
    return {
      minValue: Math.min(...values),
      maxValue: Math.max(...values),
      medianValue: sorted[Math.floor(sorted.length / 2)]
    };
  }, [processedRegions]);

  // Color scale function (colorblind-safe)
  const getRegionColor = (region: typeof processedRegions[0]) => {
    if (!region.hasData && showNoData) {
      return 'hsl(var(--muted))'; // No data pattern
    }
    
    const { value } = region;
    const range = maxValue - minValue;
    const normalized = range > 0 ? (value - minValue) / range : 0.5;
    
    // Colorblind-safe sequential scale (blue to yellow)
    if (normalized < 0.2) return 'hsl(220, 85%, 70%)';
    if (normalized < 0.4) return 'hsl(200, 70%, 60%)';
    if (normalized < 0.6) return 'hsl(180, 60%, 50%)';
    if (normalized < 0.8) return 'hsl(60, 70%, 55%)';
    return 'hsl(45, 90%, 50%)';
  };

  const selectedRegionData = processedRegions.find(r => r.code === selectedRegion);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Namibia Regional Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {/* Data Type Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Metric:</span>
              <div className="flex gap-1">
                {[
                  { key: 'growth', label: 'Growth', icon: TrendingUp },
                  { key: 'risk', label: 'Risk', icon: AlertTriangle },
                  { key: 'investment', label: 'Investment', icon: Activity }
                ].map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    variant={dataType === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDataType(key as any)}
                    className={cn(
                      "h-8",
                      dataType === key && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Normalization Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">View:</span>
              <div className="flex gap-1">
                <Button
                  variant={viewMode === 'absolute' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('absolute')}
                  className="h-8"
                >
                  <Calculator className="h-3 w-3 mr-1" />
                  Absolute
                </Button>
                <Button
                  variant={viewMode === 'percapita' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('percapita')}
                  className="h-8"
                >
                  <Users className="h-3 w-3 mr-1" />
                  Per Capita
                </Button>
              </div>
            </div>

            {/* No Data Toggle */}
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-sm font-medium text-muted-foreground">
                Show regions with no data:
              </label>
              <input
                type="checkbox"
                checked={showNoData}
                onChange={(e) => setShowNoData(e.target.checked)}
                className="h-4 w-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[16/10] overflow-hidden rounded-lg">
            <NamibiaMap
              regions={processedRegions}
              selectedRegion={selectedRegion}
              onRegionClick={setSelectedRegion}
              getRegionColor={getRegionColor}
              showLabels={true}
            />
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="text-xs font-medium mb-2">
                {dataType === 'growth' && 'Growth Rate (%)'}
                {dataType === 'risk' && 'Risk Level'}
                {dataType === 'investment' && viewMode === 'percapita' 
                  ? 'Investment per 100k pop' 
                  : 'Investment Volume'}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-20 h-3 bg-gradient-to-r from-[hsl(220,85%,70%)] via-[hsl(180,60%,50%)] to-[hsl(45,90%,50%)] rounded" />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>{minValue.toFixed(1)}</span>
                <span>{medianValue.toFixed(1)}</span>
                <span>{maxValue.toFixed(1)}</span>
              </div>
              {showNoData && (
                <div className="flex items-center gap-2 mt-2 text-[10px]">
                  <div className="w-3 h-3 bg-muted rounded" />
                  <span className="text-muted-foreground">No data</span>
                </div>
              )}
            </div>

            {/* Region Details Tooltip */}
            {selectedRegionData && (
              <RegionTooltip
                region={selectedRegionData}
                dataType={dataType}
                viewMode={viewMode}
                onClose={() => setSelectedRegion(null)}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Validation (Dev Mode) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-muted/50 border-muted">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono">Data Validation</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-[10px] overflow-auto max-h-32">
              {JSON.stringify({
                totalRegions: namibiaRegions.length,
                regionsWithData: processedRegions.filter(r => r.hasData).length,
                missingData: processedRegions.filter(r => !r.hasData).map(r => r.name),
                range: { min: minValue, median: medianValue, max: maxValue }
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};