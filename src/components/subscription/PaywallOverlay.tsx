
import React from "react";
import { LockIcon, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PaywallOverlayProps {
  featureName: string;
  description?: string;
  requiredTier: string;
  children?: React.ReactNode;
}

export const PaywallOverlay: React.FC<PaywallOverlayProps> = ({
  featureName,
  description,
  requiredTier,
  children,
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="relative w-full h-full">
      {/* Blurred content */}
      <div className="absolute inset-0 overflow-hidden blur-sm opacity-30">
        {children}
      </div>
      
      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/70 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg text-center p-6">
        <div className="max-w-md space-y-4">
          <div className="bg-teal-500/20 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
            <LockIcon size={24} />
          </div>
          
          <h3 className="text-xl font-bold text-white">{featureName}</h3>
          
          <p className="text-slate-200">
            {description || `This feature is available exclusively with our ${requiredTier} plan and above.`}
          </p>
          
          <div className="pt-2">
            <Button 
              onClick={() => navigate("/pricing")}
              className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white border-0"
            >
              Upgrade Now <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
