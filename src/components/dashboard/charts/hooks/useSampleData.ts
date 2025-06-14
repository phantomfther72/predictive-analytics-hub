
// Central mock/sample data provider for PredictivePulse—injects rich Namibian market data
import { sampleMarketModelData } from "@/utils/sampleMarketModelData";

export function useSampleData(sector: "financial" | "housing" | "mining" | "agriculture" | "hydrogen") {
  switch (sector) {
    case "financial": return sampleMarketModelData.financial ?? [];
    case "housing": return sampleMarketModelData.housing ?? [];
    case "mining": return sampleMarketModelData.mining ?? [];
    case "agriculture": return sampleMarketModelData.agriculture ?? [];
    case "hydrogen": return sampleMarketModelData.hydrogen ?? [];
    default: return [];
  }
}
