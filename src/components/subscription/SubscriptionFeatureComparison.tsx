
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Minus, Info } from "lucide-react";
import { SubscriptionFeature, SubscriptionTier } from "@/types/subscription";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SubscriptionFeatureComparisonProps {
  features: SubscriptionFeature[];
}

export const SubscriptionFeatureComparison: React.FC<SubscriptionFeatureComparisonProps> = ({
  features,
}) => {
  const tiers: SubscriptionTier[] = ["free", "standard", "premium", "enterprise", "investor"];
  const tierLabels: Record<SubscriptionTier, string> = {
    free: "Free",
    standard: "Standard",
    premium: "Premium",
    enterprise: "Enterprise",
    investor: "Private Investor"
  };

  return (
    <div className="w-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Feature Comparison</h2>
      
      <Table className="border-collapse border border-slate-200 dark:border-slate-700">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Feature</TableHead>
            {tiers.map(tier => (
              <TableHead key={tier} className="text-center">
                {tierLabels[tier]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map(feature => (
            <TableRow key={feature.id} className={feature.highlight ? "bg-slate-50 dark:bg-slate-800/50" : ""}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <span>{feature.name}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={14} className="text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{feature.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
              {tiers.map(tier => (
                <TableCell key={tier} className="text-center">
                  {feature.tiers.includes(tier) ? (
                    <Check className="mx-auto text-green-500" size={18} />
                  ) : (
                    <Minus className="mx-auto text-slate-300 dark:text-slate-600" size={18} />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
