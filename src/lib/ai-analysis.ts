// --- TYPE DEFINITIONS ---
// These types now reflect the data structure returned by the 'predictive-analysis' edge function.
// The 'icon' property is replaced with 'iconName' to be mapped to a component on the frontend.

export interface CropRecommendation {
  name: string;
  sowingSeason: string;
  subsidyInfo: string;
  iconName: string;
  potentialYield: string;
  marketTrend: string;
}

export interface WaterAnalysis {
  borewellSuitability: 'Excellent' | 'Moderate' | 'Low' | 'Not Recommended';
  score: number;
  recommendations: string[];
}

export interface EconomicOpportunity {
    name: string;
    description: string;
    iconName: string;
}

export interface AnalysisResult {
  cropAnalysis: CropRecommendation[];
  waterAnalysis: WaterAnalysis;
  economicOpportunities: EconomicOpportunity[];
}