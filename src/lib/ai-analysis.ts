import type { Claim } from "@/data/mockClaims";
import { Waves, Globe, Briefcase, DollarSign, CalendarDays, BadgeIndianRupee } from "lucide-react";

// --- TYPE DEFINITIONS ---
export interface CropRecommendation {
  name: string;
  sowingSeason: string;
  subsidyInfo: string;
  iconName: string; // Changed from icon: React.ElementType
}

export interface WaterAnalysis {
  borewellSuitability: 'Excellent' | 'Moderate' | 'Low' | 'Not Recommended';
  score: number;
  recommendations: string[];
}

export interface EconomicOpportunity {
    name: string;
    description: string;
    iconName: string; // Changed from icon: React.ElementType
}

export interface AnalysisResult {
  cropAnalysis: CropRecommendation[];
  waterAnalysis: WaterAnalysis;
  economicOpportunities: EconomicOpportunity[];
}


// --- SIMULATED PREDICTIVE MODELS ---

/**
 * Simulates a model that analyzes soil type to recommend crops, sowing times, and relevant subsidies.
 */
const getCropAnalysis = (soilType: Claim['soilType']): CropRecommendation[] => {
  switch (soilType) {
    case 'Alluvial':
      return [
        { name: 'Rice (Paddy)', sowingSeason: 'Kharif (June-July)', subsidyInfo: 'Eligible for MSP and covered under National Food Security Mission.', iconName: 'CalendarDays' },
        { name: 'Wheat', sowingSeason: 'Rabi (Oct-Nov)', subsidyInfo: 'High demand crop with strong MSP support. Access to PM-KISAN benefits.', iconName: 'BadgeIndianRupee' },
      ];
    case 'Clay':
      return [
        { name: 'Cotton', sowingSeason: 'Kharif (May-June)', subsidyInfo: 'Covered under the National Food Security Mission (Commercial Crops).', iconName: 'CalendarDays' },
        { name: 'Soybean', sowingSeason: 'Kharif (June-July)', subsidyInfo: 'Eligible for MSP. Subsidies available for high-yield seeds.', iconName: 'BadgeIndianRupee' },
      ];
    case 'Loamy':
      return [
        { name: 'Maize', sowingSeason: 'Kharif (June-July)', subsidyInfo: 'Subsidies available under the National Mission on Oilseeds and Oil Palm.', iconName: 'CalendarDays' },
        { name: 'Pulses (Gram)', sowingSeason: 'Rabi (Oct-Nov)', subsidyInfo: 'Promoted under NFSM-Pulses with financial assistance for seeds and inputs.', iconName: 'BadgeIndianRupee' },
      ];
    case 'Laterite':
        return [
        { name: 'Cashew', sowingSeason: 'Plantation (June-Aug)', subsidyInfo: 'Support available from the Directorate of Cashew and Cocoa Development.', iconName: 'CalendarDays' },
        { name: 'Coffee', sowingSeason: 'Plantation (June-July)', subsidyInfo: 'Subsidies and support provided by the Coffee Board of India.', iconName: 'BadgeIndianRupee' },
      ];
    default:
      return [];
  }
};

/**
 * Simulates a model that assesses water availability to determine borewell suitability.
 */
const getWaterAnalysis = (waterAvailability: Claim['waterAvailability']): WaterAnalysis => {
  switch (waterAvailability) {
    case 'High':
      return {
        borewellSuitability: 'Excellent',
        score: 92,
        recommendations: [
            "High probability of finding sustainable water source.",
            "Apply for subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY).",
            "Consider multi-crop cycles to maximize land usage."
        ],
      };
    case 'Medium':
      return {
        borewellSuitability: 'Moderate',
        score: 65,
        recommendations: [
            "A geological survey is highly recommended before drilling.",
            "Prioritize rainwater harvesting to recharge groundwater.",
            "Explore drip irrigation schemes to conserve water."
        ],
      };
    case 'Low':
      return {
        borewellSuitability: 'Not Recommended',
        score: 28,
        recommendations: [
            "High risk of borewell failure and rapid depletion.",
            "Focus on surface water conservation like ponds and check dams.",
            "Cultivate drought-resistant crops like millets."
        ],
      };
    default:
        return { borewellSuitability: 'Low', score: 0, recommendations: [] };
  }
};

/**
 * Simulates a model for identifying economic opportunities based on land assets.
 */
const getEconomicOpportunities = (claim: Claim): EconomicOpportunity[] => {
    const opportunities: EconomicOpportunity[] = [];
    if (claim.waterAvailability === 'High') {
        opportunities.push({ name: "Aquaculture", description: "High water availability makes fish or prawn farming a viable, high-return business.", iconName: 'Waves' });
    }
    if (claim.area > 5) {
        opportunities.push({ name: "Eco-Tourism", description: "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.", iconName: 'Globe' });
    }
    opportunities.push({ name: "Non-Timber Forest Products", description: "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", iconName: 'Briefcase' });
    opportunities.push({ name: "Carbon Credits", description: "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", iconName: 'DollarSign' });
    return opportunities;
}


/**
 * Main function to run all predictive models and return a consolidated analysis.
 */
export const runPredictiveAnalysis = (claim: Claim): AnalysisResult => {
  return {
    cropAnalysis: getCropAnalysis(claim.soilType),
    waterAnalysis: getWaterAnalysis(claim.waterAvailability),
    economicOpportunities: getEconomicOpportunities(claim),
  };
};