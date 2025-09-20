// --- TYPE DEFINITIONS ---
// These types now reflect the data structure returned by the 'predictive-analysis' edge function.
// The 'icon' property is replaced with 'iconName' to be mapped to a component on the frontend.

export interface CropRecommendation {
  name: string;
  sowingSeason: string;
  subsidyInfo: string;
  iconName: string;
  potentialYield: string;
  recommendation: string;
}

export interface WaterAnalysis {
  borewellSuitability: 'Excellent' | 'Moderate' | 'Low' | 'Not Recommended' | 'Unknown';
  score: number;
  recommendations: string[];
}

export interface EconomicOpportunity {
    name: string;
    description: string;
    iconName: string;
}

export interface SoilParameters {
  N: number; // Nitrogen (ppm)
  P: number; // Phosphorus (ppm)
  K: number; // Potassium (ppm)
  pH: number; // pH level
  EC: number; // Electrical Conductivity (mS/cm)
  OM: number; // Organic Matter (%)
  CaCO3: number; // Calcium Carbonate (%)
  Sand: number; // Sand (%)
  Silt: number; // Silt (%)
  Clay: number; // Clay (%)
  Temperature: number; // Temperature (°C)
  Humidity: number; // Humidity (%)
  Rainfall: number; // Rainfall (mm)
  Mg: number; // Magnesium (ppm)
  Fe: number; // Iron (ppm)
  Zn: number; // Zinc (ppm)
  Mn: number; // Manganese (ppm)
}

export interface SoilHealthAssessment {
  overallQuality: string; // e.g., "Good", "Moderate", "Poor"
  fertilityScore: number; // e.g., 0-100
  strengths: string[];
  deficiencies: string[];
}

export interface SoilRecommendation {
  category: string; // e.g., "Nutrient Management", "pH Correction"
  action: string;
  details: string;
}

export interface SoilAnalysis {
  parameters: SoilParameters;
  healthAssessment: SoilHealthAssessment;
  recommendations: SoilRecommendation[];
}

export interface AnalysisResult {
  cropAnalysis: CropRecommendation[];
  waterAnalysis: WaterAnalysis;
  economicOpportunities: EconomicOpportunity[];
  soilAnalysis: SoilAnalysis; // New field for soil analysis
}