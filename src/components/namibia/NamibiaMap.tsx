import React from 'react';
import { cn } from '@/lib/utils';

interface NamibiaMapProps {
  regions: any[];
  selectedRegion: string | null;
  onRegionClick: (regionCode: string | null) => void;
  getRegionColor: (region: any) => string;
  showLabels?: boolean;
}

export const NamibiaMap: React.FC<NamibiaMapProps> = ({
  regions,
  selectedRegion,
  onRegionClick,
  getRegionColor,
  showLabels = true
}) => {
  // Simplified SVG paths for Namibia regions
  // This is a simplified representation - in production, use actual GeoJSON/TopoJSON
  const regionPaths = {
    KH: "M 220 280 L 260 280 L 260 320 L 220 320 Z", // Khomas
    ER: "M 140 240 L 180 240 L 180 300 L 140 300 Z", // Erongo
    ON: "M 200 100 L 240 100 L 240 140 L 200 140 Z", // Oshana
    KE: "M 320 120 L 360 120 L 360 160 L 320 160 Z", // Kavango East
    ZA: "M 380 120 L 420 120 L 420 160 L 380 160 Z", // Zambezi
    KA: "M 120 380 L 200 380 L 200 440 L 120 440 Z", // ǁKaras
    OD: "M 240 220 L 300 220 L 300 280 L 240 280 Z", // Otjozondjupa
    KU: "M 100 140 L 160 140 L 160 200 L 100 200 Z", // Kunene
    OM: "M 160 80 L 200 80 L 200 120 L 160 120 Z", // Omusati
    OH: "M 220 80 L 260 80 L 260 120 L 220 120 Z", // Ohangwena
    OS: "M 260 120 L 300 120 L 300 160 L 260 160 Z", // Oshikoto
    HA: "M 200 340 L 240 340 L 240 380 L 200 380 Z", // Hardap
    OE: "M 300 260 L 340 260 L 340 300 L 300 300 Z", // Omaheke
    KW: "M 280 100 L 320 100 L 320 140 L 280 140 Z", // Kavango West
  };

  return (
    <svg
      viewBox="0 0 500 500"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background */}
      <rect width="500" height="500" fill="hsl(var(--background))" />
      
      {/* Ocean/Border */}
      <path
        d="M 0 0 L 500 0 L 500 500 L 0 500 Z M 80 60 L 80 460 L 440 460 L 440 60 Z"
        fill="hsl(var(--muted))"
        opacity="0.1"
      />

      {/* Regions */}
      <g>
        {regions.map((region) => {
          const path = regionPaths[region.code];
          if (!path) return null;

          const isSelected = selectedRegion === region.code;
          const color = getRegionColor(region);
          
          return (
            <g key={region.code}>
              {/* Region shape */}
              <path
                d={path}
                fill={color}
                stroke="hsl(var(--border))"
                strokeWidth={isSelected ? 2 : 1}
                opacity={isSelected ? 1 : 0.9}
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  "hover:opacity-100 hover:stroke-2"
                )}
                onClick={() => onRegionClick(region.code === selectedRegion ? null : region.code)}
              >
                <title>{`${region.name}: ${region.value?.toFixed(1) || 'No data'}`}</title>
              </path>

              {/* No data pattern */}
              {!region.hasData && (
                <pattern
                  id={`nodata-${region.code}`}
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="8"
                    y2="8"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                  <line
                    x1="8"
                    y1="0"
                    x2="0"
                    y2="8"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                </pattern>
              )}

              {/* Labels */}
              {showLabels && (
                <text
                  x={parseInt(path.match(/M (\d+)/)?.[1] || '0') + 20}
                  y={parseInt(path.match(/M \d+ (\d+)/)?.[1] || '0') + 30}
                  className="pointer-events-none select-none"
                  fill="hsl(var(--foreground))"
                  fontSize="10"
                  fontWeight={isSelected ? "600" : "400"}
                  textAnchor="middle"
                >
                  {region.code}
                </text>
              )}
            </g>
          );
        })}
      </g>

      {/* Country name */}
      <text
        x="250"
        y="30"
        className="pointer-events-none select-none"
        fill="hsl(var(--foreground))"
        fontSize="16"
        fontWeight="600"
        textAnchor="middle"
      >
        NAMIBIA
      </text>

      {/* Scale indicator */}
      <g transform="translate(20, 460)">
        <line
          x1="0"
          y1="0"
          x2="50"
          y2="0"
          stroke="hsl(var(--foreground))"
          strokeWidth="1"
        />
        <text
          x="25"
          y="15"
          fill="hsl(var(--muted-foreground))"
          fontSize="8"
          textAnchor="middle"
        >
          200 km
        </text>
      </g>

      {/* North arrow */}
      <g transform="translate(460, 20)">
        <path
          d="M 0 10 L 5 0 L 10 10 L 5 7 Z"
          fill="hsl(var(--foreground))"
        />
        <text
          x="5"
          y="20"
          fill="hsl(var(--muted-foreground))"
          fontSize="10"
          textAnchor="middle"
        >
          N
        </text>
      </g>
    </svg>
  );
};