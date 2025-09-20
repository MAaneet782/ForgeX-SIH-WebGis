// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// --- Start of simulated src/lib/ai-analysis.ts content ---
// This content is duplicated here because Edge Functions operate in isolation
// and cannot directly import from your local project files.

// --- TYPE DEFINITIONS ---
interface ClaimForAnalysis {
  id: string;
  holderName: string;
  village: string;
  district: string;
  state: string;
  area: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  documentName?: string;
  soilType: 'Alluvial' | 'Clay' | 'Loamy' | 'Laterite';
  waterAvailability: 'High' | 'Medium' | 'Low';
  estimatedCropValue: number; // in INR
  geometry?: any; // GeoJSON.Geometry;
  created_at: string;
}

export interface CropRecommendation {
  name: string;
  sowingSeason: string;
  subsidyInfo: string;
  iconName: string;
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

export interface SoilComposition {
  n: number; // Nitrogen (ppm)
  p: number; // Phosphorus (ppm)
  k: number; // Potassium (ppm)
  pH: number;
  ec: number; // Electrical Conductivity (mS/cm)
  om: number; // Organic Matter (%)
  caco3: number; // Calcium Carbonate (%)
  sand: number; // Sand (%)
  silt: number; // Silt (%)
  clay: number; // Clay (%)
  temperature: number; // Temperature (°C)
  humidity: number; // Humidity (%)
  rainfall: number; // Rainfall (mm)
  mg: number; // Magnesium (ppm)
  fe: number; // Iron (ppm)
  zn: number; // Zinc (ppm)
  mn: number; // Manganese (ppm)
}

export interface SoilHealthAssessment {
  overallScore: number; // e.g., 0-100
  fertilityRating: 'Poor' | 'Moderate' | 'Good' | 'Excellent';
  strengths: string[];
  deficiencies: string[];
}

export interface SoilRecommendations {
  healthImprovement: string[];
  cropSuitability: string[];
}

export interface SoilAnalysis {
  composition: SoilComposition;
  healthAssessment: SoilHealthAssessment;
  recommendations: SoilRecommendations;
}

export interface AnalysisResult {
  cropAnalysis: CropRecommendation[];
  waterAnalysis: WaterAnalysis;
  economicOpportunities: EconomicOpportunity[];
  soilAnalysis: SoilAnalysis; // New soil analysis section
}


// --- SIMULATED PREDICTIVE MODELS ---

/**
 * Simulates a model that analyzes soil type to recommend crops, sowing times, and relevant subsidies.
 */
const getCropAnalysis = (soilType: ClaimForAnalysis['soilType']): CropRecommendation[] => {
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
const getWaterAnalysis = (waterAvailability: ClaimForAnalysis['waterAvailability']): WaterAnalysis => {
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
const getEconomicOpportunities = (claim: ClaimForAnalysis): EconomicOpportunity[] => {
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
 * Simulates a comprehensive soil analysis based on claim data.
 */
const getSoilAnalysis = (claim: ClaimForAnalysis): SoilAnalysis => {
  let n, p, k, pH, ec, om, caco3, sand, silt, clay, temp, humidity, rainfall, mg, fe, zn, mn;
  let fertilityRating: SoilHealthAssessment['fertilityRating'] = 'Moderate';
  let strengths: string[] = [];
  let deficiencies: string[] = [];
  let healthImprovement: string[] = [];
  let cropSuitability: string[] = [];

  // Base values, adjusted by soilType and waterAvailability
  n = 120 + Math.random() * 40 - 20; // ppm
  p = 25 + Math.random() * 10 - 5; // ppm
  k = 180 + Math.random() * 60 - 30; // ppm
  pH = 6.5 + Math.random() * 1 - 0.5;
  ec = 0.8 + Math.random() * 0.4 - 0.2; // mS/cm
  om = 1.5 + Math.random() * 1 - 0.5; // %
  caco3 = 2 + Math.random() * 2 - 1; // %
  sand = 40 + Math.random() * 20 - 10; // %
  silt = 30 + Math.random() * 15 - 7.5; // %
  clay = 30 + Math.random() * 15 - 7.5; // %
  temp = 28 + Math.random() * 5 - 2.5; // °C
  humidity = 70 + Math.random() * 10 - 5; // %
  rainfall = 1200 + Math.random() * 400 - 200; // mm
  mg = 150 + Math.random() * 50 - 25; // ppm
  fe = 80 + Math.random() * 20 - 10; // ppm
  zn = 1.5 + Math.random() * 0.5 - 0.25; // ppm
  mn = 10 + Math.random() * 4 - 2; // ppm

  // Adjustments based on soil type
  switch (claim.soilType) {
    case 'Alluvial':
      n += 20; p += 5; k += 30; om += 0.5; sand -= 10; silt += 5; clay += 5;
      strengths.push("Good nutrient retention and water holding capacity.");
      deficiencies.push("Can be prone to waterlogging if drainage is poor.");
      healthImprovement.push("Ensure proper drainage and consider green manure.");
      cropSuitability.push("Rice, Wheat, Sugarcane, Jute.");
      break;
    case 'Clay':
      n += 10; p += 2; k += 10; om += 0.2; sand -= 20; silt += 10; clay += 10; pH += 0.3;
      strengths.push("High water and nutrient retention.");
      deficiencies.push("Poor aeration, slow drainage, can become hard when dry.");
      healthImprovement.push("Incorporate organic matter to improve structure and aeration.");
      cropSuitability.push("Cotton, Sugarcane, Rice, Oilseeds.");
      break;
    case 'Loamy':
      n += 15; p += 7; k += 20; om += 0.7; sand += 5; silt += 5; clay -= 10; pH -= 0.2;
      strengths.push("Excellent balance of water retention, drainage, and aeration.");
      deficiencies.push("May require regular nutrient replenishment.");
      healthImprovement.push("Regular application of balanced fertilizers and compost.");
      cropSuitability.push("Maize, Pulses, Vegetables, Fruits.");
      break;
    case 'Laterite':
      n -= 30; p -= 10; k -= 40; om -= 0.8; pH -= 0.5; fe += 20; mn += 5;
      strengths.push("Good for specific plantation crops.");
      deficiencies.push("Low fertility, acidic, poor water retention.");
      healthImprovement.push("Lime application to correct pH, heavy organic matter addition.");
      cropSuitability.push("Cashew, Coffee, Tea, Rubber.");
      break;
  }

  // Adjustments based on water availability
  switch (claim.waterAvailability) {
    case 'High':
      humidity += 5; rainfall += 100;
      strengths.push("Ample moisture for most crops.");
      healthImprovement.push("Monitor for waterlogging, ensure good drainage.");
      break;
    case 'Medium':
      humidity += 0; rainfall += 0;
      strengths.push("Adequate moisture with proper management.");
      healthImprovement.push("Implement efficient irrigation techniques (e.g., drip irrigation).");
      break;
    case 'Low':
      humidity -= 10; rainfall -= 200;
      deficiencies.push("Insufficient moisture, drought-prone.");
      healthImprovement.push("Focus on drought-resistant crops, water harvesting, mulching.");
      break;
  }

  // General health assessment based on parameters
  let score = 0;
  if (pH >= 6.0 && pH <= 7.5) score += 20; else if (pH >= 5.5 && pH <= 8.0) score += 10;
  if (om >= 1.5) score += 20; else if (om >= 0.5) score += 10;
  if (n > 100 && p > 20 && k > 150) score += 30; else if (n > 50 && p > 10 && k > 75) score += 15;
  if (ec < 1.0) score += 10; // Low EC is generally good
  if (sand > 20 && clay > 10 && silt > 10) score += 10; // Balanced texture
  if (score > 80) fertilityRating = 'Excellent';
  else if (score > 60) fertilityRating = 'Good';
  else if (score > 40) fertilityRating = 'Moderate';
  else fertilityRating = 'Poor';

  if (pH < 6.0) deficiencies.push("Acidity (low pH)");
  if (pH > 7.5) deficiencies.push("Alkalinity (high pH)");
  if (om < 1.0) deficiencies.push("Low organic matter");
  if (n < 100) deficiencies.push("Nitrogen deficiency");
  if (p < 20) deficiencies.push("Phosphorus deficiency");
  if (k < 150) deficiencies.push("Potassium deficiency");
  if (ec > 1.5) deficiencies.push("High salinity (high EC)");

  if (deficiencies.length === 0) strengths.push("Well-balanced nutrient profile.");
  if (strengths.length === 0) strengths.push("No major strengths identified, but no critical issues.");

  return {
    composition: {
      n: parseFloat(n.toFixed(1)),
      p: parseFloat(p.toFixed(1)),
      k: parseFloat(k.toFixed(1)),
      pH: parseFloat(pH.toFixed(1)),
      ec: parseFloat(ec.toFixed(2)),
      om: parseFloat(om.toFixed(1)),
      caco3: parseFloat(caco3.toFixed(1)),
      sand: parseFloat(sand.toFixed(1)),
      silt: parseFloat(silt.toFixed(1)),
      clay: parseFloat(clay.toFixed(1)),
      temperature: parseFloat(temp.toFixed(1)),
      humidity: parseFloat(humidity.toFixed(1)),
      rainfall: parseFloat(rainfall.toFixed(1)),
      mg: parseFloat(mg.toFixed(1)),
      fe: parseFloat(fe.toFixed(1)),
      zn: parseFloat(zn.toFixed(2)),
      mn: parseFloat(mn.toFixed(1)),
    },
    healthAssessment: {
      overallScore: Math.min(100, Math.max(0, Math.round(score))),
      fertilityRating,
      strengths: Array.from(new Set(strengths)), // Remove duplicates
      deficiencies: Array.from(new Set(deficiencies)), // Remove duplicates
    },
    recommendations: {
      healthImprovement: Array.from(new Set(healthImprovement)), // Remove duplicates
      cropSuitability: Array.from(new Set(cropSuitability)), // Remove duplicates
    },
  };
};


/**
 * Main function to run all predictive models and return a consolidated analysis.
 */
export const runPredictiveAnalysis = (claim: ClaimForAnalysis): AnalysisResult => {
  return {
    cropAnalysis: getCropAnalysis(claim.soilType),
    waterAnalysis: getWaterAnalysis(claim.waterAvailability),
    economicOpportunities: getEconomicOpportunities(claim),
    soilAnalysis: getSoilAnalysis(claim), // Include soil analysis
  };
};

// --- End of simulated src/lib/ai-analysis.ts content ---


serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // --- JWT Authentication ---
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response('Unauthorized: Missing Authorization header', { status: 401, headers: corsHeaders })
  }

  const token = authHeader.replace('Bearer ', '')
  const supabaseClient = createClient(
    // @ts-ignore
    Deno.env.get('SUPABASE_URL') ?? '',
    // @ts-ignore
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )

  const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

  if (authError || !user) {
    return new Response('Unauthorized: Invalid or expired token', { status: 401, headers: corsHeaders })
  }
  // --- End JWT Authentication ---

  try {
    const { claim } = await req.json();

    if (!claim || !claim.id || typeof claim.soilType === 'undefined' || typeof claim.waterAvailability === 'undefined') {
      return new Response(JSON.stringify({ error: 'Invalid claim data or missing claim ID/soilType/waterAvailability provided.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // 1. Try to fetch from Supabase cache first
    const { data: cachedData, error: fetchError } = await supabaseClient
      .from('ai_analysis_results')
      .select('analysis_data')
      .eq('claim_id', claim.id)
      .single();

    if (cachedData && cachedData.analysis_data) {
      console.log("AI analysis found in Supabase cache:", cachedData.analysis_data);
      return new Response(
        JSON.stringify(cachedData.analysis_data), // Return the raw analysis_data
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. If not in cache or error fetching cache, compute eligibility
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means 'no rows found'
      console.warn("Error fetching AI analysis from cache, computing:", fetchError.message);
    } else if (fetchError && fetchError.code === 'PGRST116') {
      console.log("AI analysis not found in Supabase cache, computing.");
    } else {
      console.log("No cached data, computing AI analysis.");
    }

    // Compute the analysis using the simulated local logic
    const analysisData = runPredictiveAnalysis(claim);

    // Always upsert the analysis results to the database
    const { error: upsertError } = await supabaseClient
      .from('ai_analysis_results')
      .upsert(
        {
          claim_id: claim.id,
          analysis_data: analysisData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'claim_id' }
      );

    if (upsertError) {
      console.error('Error upserting AI analysis results:', upsertError);
    }

    return new Response(
      JSON.stringify(analysisData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})