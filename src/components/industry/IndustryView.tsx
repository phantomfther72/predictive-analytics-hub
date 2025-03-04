
import React from "react";
import { MarketType } from "@/types/market";
import { AgricultureView } from "./views/AgricultureView";
import { MiningView } from "./views/MiningView";
import { GreenHydrogenView } from "./views/GreenHydrogenView";
import { GenericIndustryView } from "./views/GenericIndustryView";

interface IndustryViewProps {
  industry: MarketType;
}

export const IndustryView: React.FC<IndustryViewProps> = ({ industry }) => {
  // Render appropriate view based on industry type
  switch (industry) {
    case "agriculture":
      return <AgricultureView />;
    case "mining":
      return <MiningView />;
    case "green_hydrogen":
      return <GreenHydrogenView />;
    default:
      return <GenericIndustryView industry={industry} />;
  }
};
