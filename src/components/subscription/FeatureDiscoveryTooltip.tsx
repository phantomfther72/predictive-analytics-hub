
import React, { useState, useRef, useEffect } from "react";
import { Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FeatureDiscoveryTooltipProps {
  feature: string;
  description: string;
  position?: "top" | "right" | "bottom" | "left";
  requiredTier: string;
  onDismiss: () => void;
}

export const FeatureDiscoveryTooltip: React.FC<FeatureDiscoveryTooltipProps> = ({
  feature,
  description,
  position = "bottom",
  requiredTier,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        handleDismiss();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const positionClasses = {
    top: "bottom-full mb-2",
    right: "left-full ml-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
  };
  
  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };
  
  if (!isVisible) return null;
  
  return (
    <div 
      ref={tooltipRef}
      className={`absolute z-50 w-64 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg shadow-lg text-white p-4 animate-fade-in ${positionClasses[position]}`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 text-white/70 hover:text-white hover:bg-white/10"
        onClick={handleDismiss}
      >
        <X size={14} />
      </Button>
      
      <div className="flex items-start gap-3">
        <div className="bg-white/20 rounded-full p-2 mt-1">
          <Lightbulb size={16} className="text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-sm">{feature}</h4>
          <p className="text-xs text-white/90 mt-1 mb-2">{description}</p>
          <Button 
            size="sm" 
            variant="secondary" 
            className="w-full text-xs bg-white/20 hover:bg-white/30 text-white border-0"
            onClick={() => navigate("/pricing")}
          >
            Upgrade to {requiredTier}
          </Button>
        </div>
      </div>
    </div>
  );
};
