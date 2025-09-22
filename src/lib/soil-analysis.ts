import type { Claim } from "@/types"; // Updated import

// --- Type Definitions ---
export interface SoilComposition {
  N: number; // Nitrogen (ppm)
  P: number; // Phosphorus (ppm)
  K: number; // Potassium (ppm)
  pH: number;
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

export interface SoilHealthAssessmentResult {
  overallScore: number; // 0-100
  status: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
  strengths: string[];
  deficiencies: string[];
}

export interface SoilHealthRecommendation {
  title: string;
  description: string;
}

export interface SoilCropRecommendation {
  name: string;
  suitability: 'High' | 'Medium' | 'Low';
  reason: string;
}

// --- Simulated Data Generation ---
export const getSoilCompositionData = (claim: Claim): SoilComposition => {
  // Simulate data based on soilType and waterAvailability
  let N = 30 + Math.random() * 40; // 30-70 ppm
  let P = 10 + Math.random() * 20; // 10-30 ppm
  let K = 100 + Math.random() * 100; // 100-200 ppm
  let pH = 6.0 + Math.random() * 1.5; // 6.0-7.5
  let EC = 0.5 + Math.random() * 1.0; // 0.5-1.5 mS/cm
  let OM = 0.8 + Math.random() * 1.5; // 0.8-2.3 %
  let CaCO3 = 1.0 + Math.random() * 5.0; // 1.0-6.0 %
  let Sand = 30 + Math.random() * 40; // 30-70 %
  let Silt = 15 + Math.random() * 25; // 15-40 %
  let Clay = 10 + Math.random() * 20; // 10-30 %
  let Temperature = 25 + Math.random() * 10; // 25-35 °C
  let Humidity = 60 + Math.random() * 20; // 60-80 %
  let Rainfall = 50 + Math.random() * 150; // 50-200 mm
  let Mg = 50 + Math.random() * 50; // 50-100 ppm
  let Fe = 5 + Math.random() * 10; // 5-15 ppm
  let Zn = 0.5 + Math.random() * 1.5; // 0.5-2.0 ppm
  let Mn = 2 + Math.random() * 5; // 2-7 ppm

  if (claim.soilType === 'Alluvial') {
    N *= 1.2; P *= 1.1; K *= 1.1; pH = 6.5 + Math.random() * 0.5; OM *= 1.5; Sand = 40 + Math.random() * 20; Silt = 30 + Math.random() * 10; Clay = 20 + Math.random() * 5;
  } else if (claim.soilType === 'Clay') {
    N *= 1.1; P *= 1.2; K *= 1.3; pH = 7.0 + Math.random() * 0.8; OM *= 1.2; Sand = 20 + Math.random() * 10; Silt = 25 + Math.random() * 10; Clay = 40 + Math.random() * 15;
  } else if (claim.soilType === 'Laterite') {
    N *= 0.8; P *= 0.7; K *= 0.8; pH = 5.5 + Math.random() * 0.5; OM *= 0.9; Sand = 50 + Math.random() * 15; Silt = 15 + Math.random() * 10; Clay = 15 + Math.random() * 10;
  }

  if (claim.waterAvailability === 'Low') {
    Humidity *= 0.8; Rainfall *= 0.5; EC *= 1.2; // Higher EC in dry conditions
  } else if (claim.waterAvailability === 'High') {
    Humidity *= 1.1; Rainfall *= 1.5; EC *= 0.9;
  }

  return {
    N: parseFloat(N.toFixed(1)), P: parseFloat(P.toFixed(1)), K: parseFloat(K.toFixed(1)),
    pH: parseFloat(pH.toFixed(1)), EC: parseFloat(EC.toFixed(2)), OM: parseFloat(OM.toFixed(1)),
    CaCO3: parseFloat(CaCO3.toFixed(1)), Sand: parseFloat(Sand.toFixed(0)), Silt: parseFloat(Silt.toFixed(0)),
    Clay: parseFloat(Clay.toFixed(0)), Temperature: parseFloat(Temperature.toFixed(1)),
    Humidity: parseFloat(Humidity.toFixed(1)), Rainfall: parseFloat(Rainfall.toFixed(1)),
    Mg: parseFloat(Mg.toFixed(1)), Fe: parseFloat(Fe.toFixed(1)), Zn: parseFloat(Zn.toFixed(2)), Mn: parseFloat(Mn.toFixed(1)),
  };
};

/**
 * Simulates a soil health assessment based on composition data.
 */
export const getSoilHealthAssessment = (composition: SoilComposition): SoilHealthAssessmentResult => {
  let score = 0;
  const strengths: string[] = [];
  const deficiencies: string[] = [];

  // NPK
  if (composition.N > 50) { score += 10; strengths.push('High Nitrogen'); } else if (composition.N < 30) { deficiencies.push('Low Nitrogen'); }
  if (composition.P > 20) { score += 10; strengths.push('Adequate Phosphorus'); } else if (composition.P < 15) { deficiencies.push('Low Phosphorus'); }
  if (composition.K > 150) { score += 10; strengths.push('High Potassium'); } else if (composition.K < 120) { deficiencies.push('Low Potassium'); }

  // pH
  if (composition.pH >= 6.0 && composition.pH <= 7.0) { score += 15; strengths.push('Optimal pH'); } else { deficiencies.push('Suboptimal pH'); }

  // OM
  if (composition.OM > 1.5) { score += 15; strengths.push('Good Organic Matter'); } else if (composition.OM < 1.0) { deficiencies.push('Low Organic Matter'); }

  // EC
  if (composition.EC < 1.0) { score += 10; strengths.push('Low Salinity'); } else { deficiencies.push('High Salinity'); }

  // Texture (Sand, Silt, Clay) - simplified for assessment
  if (composition.Sand < 70 && composition.Silt > 15 && composition.Clay > 10) { score += 10; strengths.push('Balanced Soil Texture'); } else { deficiencies.push('Imbalanced Soil Texture'); }

  // Micro-nutrients
  if (composition.Fe > 8) { strengths.push('Adequate Iron'); } else if (composition.Fe < 6) { deficiencies.push('Low Iron'); }
  if (composition.Zn > 1.0) { strengths.push('Adequate Zinc'); } else if (composition.Zn < 0.8) { deficiencies.push('Low Zinc'); }
  if (composition.Mg > 70) { strengths.push('Adequate Magnesium'); } else if (composition.Mg < 60) { deficiencies.push('Low Magnesium'); }

  let status: SoilHealthAssessmentResult['status'] = 'Poor';
  if (score > 75) status = 'Excellent';
  else if (score > 55) status = 'Good';
  else if (score > 35) status = 'Moderate';

  return {
    overallScore: Math.min(score, 100), // Cap score at 100
    status,
    strengths,
    deficiencies,
  };
};

/**
 * Generates actionable recommendations based on soil deficiencies.
 */
export const getSoilHealthRecommendations = (composition: SoilComposition, assessment: SoilHealthAssessmentResult): SoilHealthRecommendation[] => {
  const recommendations: SoilHealthRecommendation[] = [];

  if (assessment.deficiencies.includes('Low Nitrogen')) {
    recommendations.push({ title: 'Nitrogen Fertilization', description: 'Apply nitrogen-rich organic fertilizers like composted manure or urea in split doses.' });
  }
  if (assessment.deficiencies.includes('Low Phosphorus')) {
    recommendations.push({ title: 'Phosphorus Supplementation', description: 'Incorporate rock phosphate or bone meal to improve phosphorus availability, especially during planting.' });
  }
  if (assessment.deficiencies.includes('Low Potassium')) {
    recommendations.push({ title: 'Potassium Enrichment', description: 'Use potassium sulfate or wood ash to boost potassium levels, crucial for plant vigor and disease resistance.' });
  }
  if (assessment.deficiencies.includes('Suboptimal pH')) {
    if (composition.pH < 6.0) {
      recommendations.push({ title: 'Lime Application (Acidic Soil)', description: 'Apply agricultural lime to raise pH, improving nutrient availability for most crops.' });
    } else if (composition.pH > 7.0) {
      recommendations.push({ title: 'Sulfur Application (Alkaline Soil)', description: 'Incorporate elemental sulfur or gypsum to lower pH, enhancing micronutrient uptake.' });
    }
  }
  if (assessment.deficiencies.includes('Low Organic Matter')) {
    recommendations.push({ title: 'Increase Organic Matter', description: 'Regularly add compost, farmyard manure, or practice cover cropping to build soil organic carbon.' });
  }
  if (assessment.deficiencies.includes('High Salinity')) {
    recommendations.push({ title: 'Salinity Management', description: 'Improve drainage, leach salts with good quality water, and consider salt-tolerant crops.' });
  }
  if (assessment.deficiencies.includes('Imbalanced Soil Texture')) {
    recommendations.push({ title: 'Texture Improvement', description: 'Incorporate organic matter to improve aggregation in clayey soils or water retention in sandy soils.' });
  }
  if (assessment.deficiencies.includes('Low Iron')) {
    recommendations.push({ title: 'Iron Supplementation', description: 'Apply iron chelates or ferrous sulfate, especially in alkaline soils where iron availability is low.' });
  }
  if (assessment.deficiencies.includes('Low Zinc')) {
    recommendations.push({ title: 'Zinc Application', description: 'Use zinc sulfate or zinc chelates, critical for enzyme activity and plant growth.' });
  }
  if (assessment.deficiencies.includes('Low Magnesium')) {
    recommendations.push({ title: 'Magnesium Supplementation', description: 'Apply Epsom salts (magnesium sulfate) or dolomitic lime to correct magnesium deficiencies.' });
  }

  if (recommendations.length === 0) {
    recommendations.push({ title: 'Maintain Good Practices', description: 'Your soil health is good. Continue with balanced fertilization, crop rotation, and organic matter addition.' });
  }

  return recommendations;
};

/**
 * Provides crop recommendations based on soil composition and health.
 */
export const getSoilCropRecommendations = (claim: Claim, composition: SoilComposition, assessment: SoilHealthAssessmentResult): SoilCropRecommendation[] => {
  const recommendations: SoilCropRecommendation[] = [];

  // General recommendations based on soil type (can be refined with more parameters)
  if (claim.soilType === 'Alluvial' || (composition.Sand < 50 && composition.Clay > 20)) {
    recommendations.push({ name: 'Rice (Paddy)', suitability: 'High', reason: 'Thrives in heavy, water-retentive soils.' });
  }

  if (claim.soilType === 'Clay' || (composition.Clay > 30 && composition.OM > 1.2)) {
    recommendations.push({ name: 'Cotton', suitability: 'Medium', reason: 'Requires deep, clayey soils with good moisture retention.' });
    recommendations.push({ name: 'Soybean', suitability: 'High', reason: 'Performs well in fertile, well-drained clayey to loamy soils.' });
  }

  if (claim.soilType === 'Loamy' || (composition.Sand > 30 && composition.Silt > 20 && composition.Clay > 15)) {
    recommendations.push({ name: 'Pulses (Gram)', suitability: 'High', reason: 'Prefers well-drained loamy to sandy-loam soils.' });
    recommendations.push({ name: 'Vegetables (e.g., Tomato, Potato)', suitability: 'High', reason: 'Most vegetables prefer fertile, well-drained loamy soils.' });
  }

  if (claim.soilType === 'Laterite' || (composition.pH < 6.0 && composition.Fe > 10)) {
    recommendations.push({ name: 'Cashew', suitability: 'High', reason: 'Tolerant to acidic, lateritic soils.' });
    recommendations.push({ name: 'Coffee', suitability: 'High', reason: 'Prefers acidic soils with good drainage.' });
  }

  // Adjust suitability based on deficiencies
  if (assessment.deficiencies.includes('Low Nitrogen') || assessment.deficiencies.includes('Low Phosphorus')) {
    recommendations.forEach(rec => {
      if (rec.name === 'Maize' || rec.name === 'Wheat' || rec.name === 'Rice (Paddy)') {
        rec.suitability = 'Medium';
        rec.reason += ' (requires nutrient correction)';
      }
    });
  }
  if (assessment.deficiencies.includes('Suboptimal pH')) {
    recommendations.forEach(rec => {
      if (rec.suitability === 'High') {
        rec.suitability = 'Medium';
        rec.reason += ' (pH adjustment needed)';
      }
    });
  }
  if (claim.waterAvailability === 'Low') {
    recommendations.push({ name: 'Millets (Sorghum, Pearl Millet)', suitability: 'High', reason: 'Drought-tolerant crops suitable for low water availability.' });
    recommendations.push({ name: 'Groundnut', suitability: 'Medium', reason: 'Relatively drought-tolerant, but benefits from some irrigation.' });
  }

  // Filter out duplicates and prioritize 'High' suitability
  const uniqueRecommendations = Array.from(new Map(recommendations.map(item => [item.name, item])).values());
  uniqueRecommendations.sort((a, b) => {
    const suitabilityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return suitabilityOrder[b.suitability] - suitabilityOrder[a.suitability];
  });

  return uniqueRecommendations;
};