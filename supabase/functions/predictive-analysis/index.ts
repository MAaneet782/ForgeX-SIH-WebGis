// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define a more comprehensive Claim type for scheme eligibility analysis
interface Claim {
  id: string; // Added id for linking to analysis results
  holderName: string; // Added for mock data check
  village: string; // Added for mock data check
  district: string; // Added for mock data check
  state: string; // Added for mock data check
  area: number; // in acres
  status: 'Approved' | 'Pending' | 'Rejected';
  estimatedCropValue: number; // in INR
  soilType: 'Alluvial' | 'Clay' | 'Loamy' | 'Laterite' | 'Unknown'; // Added 'Unknown'
  waterAvailability: 'High' | 'Medium' | 'Low' | 'Unknown'; // Added 'Unknown'
}

// --- SIMULATED PREDICTIVE MODELS (moved from frontend) ---

const getCropAnalysis = (soilType: Claim['soilType']) => {
  switch (soilType) {
    case 'Alluvial':
      return [
        { name: 'Rice (Paddy)', sowingSeason: 'Kharif (June-July)', subsidyInfo: 'Eligible for MSP and covered under National Food Security Mission.', iconName: 'CalendarDays', potentialYield: '4-5 tons/ha', recommendation: 'Ideal for water-rich areas. Use high-yielding varieties for maximum output.' },
        { name: 'Wheat', sowingSeason: 'Rabi (Oct-Nov)', subsidyInfo: 'High demand crop with strong MSP support. Access to PM-KISAN benefits.', iconName: 'BadgeIndianRupee', potentialYield: '3-4 tons/ha', recommendation: 'Requires well-irrigated land. Good for crop rotation with rice.' },
        { name: 'Sugarcane', sowingSeason: 'Annual (Jan-Mar)', subsidyInfo: 'Fair and Remunerative Price (FRP) set by government. Subsidies for drip irrigation available.', iconName: 'CalendarDays', potentialYield: '80-100 tons/ha', recommendation: 'Long-duration, water-intensive crop. Suitable for large holdings.' },
      ];
    case 'Clay':
      return [
        { name: 'Cotton', sowingSeason: 'Kharif (May-June)', subsidyInfo: 'Covered under the National Food Security Mission (Commercial Crops).', iconName: 'CalendarDays', potentialYield: '1.5-2 tons/ha', recommendation: 'Requires a long frost-free period. Good drainage is essential.' },
        { name: 'Soybean', sowingSeason: 'Kharif (June-July)', subsidyInfo: 'Eligible for MSP. Subsidies available for high-yield seeds.', iconName: 'BadgeIndianRupee', potentialYield: '2-2.5 tons/ha', recommendation: 'Nitrogen-fixing crop, improves soil fertility. Intercropping is beneficial.' },
        { name: 'Lentils (Masur)', sowingSeason: 'Rabi (Oct-Nov)', subsidyInfo: 'Promoted under NFSM-Pulses. Minimum Support Price (MSP) is available.', iconName: 'CalendarDays', potentialYield: '1-1.2 tons/ha', recommendation: 'Drought-tolerant and suitable for rainfed areas with clay soil.' },
      ];
    case 'Loamy':
      return [
        { name: 'Maize', sowingSeason: 'Kharif (June-July)', subsidyInfo: 'Subsidies available under the National Mission on Oilseeds and Oil Palm.', iconName: 'CalendarDays', potentialYield: '5-6 tons/ha', recommendation: 'Versatile crop with high yield potential. Good for intercropping.' },
        { name: 'Pulses (Gram)', sowingSeason: 'Rabi (Oct-Nov)', subsidyInfo: 'Promoted under NFSM-Pulses with financial assistance for seeds and inputs.', iconName: 'BadgeIndianRupee', potentialYield: '1-1.5 tons/ha', recommendation: 'Low water requirement, enhances soil nitrogen. Ideal for rotation.' },
        { name: 'Groundnut', sowingSeason: 'Kharif & Rabi', subsidyInfo: 'MSP available. Support for seeds and mechanization under various schemes.', iconName: 'CalendarDays', potentialYield: '1.5-2 tons/ha', recommendation: 'Well-drained loamy soil is perfect. Can be grown in two seasons.' },
      ];
    case 'Laterite':
        return [
        { name: 'Cashew', sowingSeason: 'Plantation (June-Aug)', subsidyInfo: 'Support available from the Directorate of Cashew and Cocoa Development.', iconName: 'CalendarDays', potentialYield: '0.8-1 ton/ha', recommendation: 'High-value plantation crop well-suited for coastal areas with laterite soil.' },
        { name: 'Coffee', sowingSeason: 'Plantation (June-July)', subsidyInfo: 'Subsidies and support provided by the Coffee Board of India.', iconName: 'BadgeIndianRupee', potentialYield: '0.7-1 ton/ha (Arabica)', recommendation: 'Requires specific altitude and rainfall. Best for hilly regions.' },
        { name: 'Rubber', sowingSeason: 'Plantation (June-July)', subsidyInfo: 'Support from the Rubber Board for new planting and replanting.', iconName: 'CalendarDays', potentialYield: '1.5-2 tons/ha', recommendation: 'Long-term investment. Requires high rainfall and humidity.' },
      ];
    case 'Unknown': // Handle 'Unknown' soil type gracefully
      return [{ name: 'General Crops', sowingSeason: 'Varies', subsidyInfo: 'General agricultural support schemes may apply.', iconName: 'Leaf', potentialYield: 'Varies', recommendation: 'Conduct soil testing for specific recommendations.' }];
    default:
      return [];
  }
};

const getWaterAnalysis = (waterAvailability: Claim['waterAvailability']) => {
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
    case 'Unknown': // Handle 'Unknown' water availability gracefully
        return { borewellSuitability: 'Unknown', score: 50, recommendations: ["Water availability data is unknown. Conduct a site survey."] };
    default:
        return { borewellSuitwellity: 'Low', score: 0, recommendations: [] };
  }
};

const getEconomicOpportunities = (claim: Claim) => {
    const opportunities = [];
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

// --- NEW: Soil Analysis Logic ---
interface SoilParameters {
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

interface SoilHealthAssessment {
  overallQuality: string;
  fertilityScore: number;
  strengths: string[];
  deficiencies: string[];
}

interface SoilRecommendation {
  category: string;
  action: string;
  details: string;
}

const getSoilAnalysis = (claim: Claim) => {
  // Mock soil parameters based on soilType and waterAvailability
  let N = 0, P = 0, K = 0, pH = 0, EC = 0, OM = 0, CaCO3 = 0, Sand = 0, Silt = 0, Clay = 0;
  let Temperature = 25, Humidity = 60, Rainfall = 100; // Default environmental
  let Mg = 0, Fe = 0, Zn = 0, Mn = 0;

  switch (claim.soilType) {
    case 'Alluvial':
      N = 150 + Math.random() * 50; P = 25 + Math.random() * 10; K = 200 + Math.random() * 50;
      pH = 7.0 + Math.random() * 0.5; EC = 0.8 + Math.random() * 0.2; OM = 1.5 + Math.random() * 0.5;
      CaCO3 = 5 + Math.random() * 2; Sand = 40 + Math.random() * 10; Silt = 35 + Math.random() * 10; Clay = 25 + Math.random() * 5;
      Mg = 100 + Math.random() * 20; Fe = 15 + Math.random() * 5; Zn = 0.8 + Math.random() * 0.2; Mn = 5 + Math.random() * 2;
      break;
    case 'Clay':
      N = 100 + Math.random() * 40; P = 30 + Math.random() * 10; K = 180 + Math.random() * 40;
      pH = 6.5 + Math.random() * 0.5; EC = 0.6 + Math.random() * 0.2; OM = 2.0 + Math.random() * 0.5;
      CaCO3 = 3 + Math.random() * 1; Sand = 20 + Math.random() * 5; Silt = 30 + Math.random() * 5; Clay = 50 + Math.random() * 10;
      Mg = 120 + Math.random() * 20; Fe = 20 + Math.random() * 5; Zn = 0.6 + Math.random() * 0.2; Mn = 4 + Math.random() * 2;
      break;
    case 'Loamy':
      N = 120 + Math.random() * 40; P = 20 + Math.random() * 10; K = 150 + Math.random() * 40;
      pH = 6.8 + Math.random() * 0.5; EC = 0.7 + Math.random() * 0.2; OM = 1.8 + Math.random() * 0.5;
      CaCO3 = 4 + Math.random() * 2; Sand = 50 + Math.random() * 10; Silt = 30 + Math.random() * 5; Clay = 20 + Math.random() * 5;
      Mg = 90 + Math.random() * 20; Fe = 12 + Math.random() * 5; Zn = 0.7 + Math.random() * 0.2; Mn = 6 + Math.random() * 2;
      break;
    case 'Laterite':
      N = 80 + Math.random() * 30; P = 15 + Math.random() * 5; K = 100 + Math.random() * 30;
      pH = 5.5 + Math.random() * 0.5; EC = 0.4 + Math.random() * 0.1; OM = 1.0 + Math.random() * 0.3;
      CaCO3 = 1 + Math.random() * 0.5; Sand = 60 + Math.random() * 10; Silt = 20 + Math.random() * 5; Clay = 20 + Math.random() * 5;
      Mg = 70 + Math.random() * 15; Fe = 25 + Math.random() * 5; Zn = 0.5 + Math.random() * 0.1; Mn = 3 + Math.random() * 1;
      break;
    case 'Unknown': // Default for unknown soil type
      N = 100 + Math.random() * 50; P = 20 + Math.random() * 10; K = 150 + Math.random() * 50;
      pH = 6.5 + Math.random() * 1.0; EC = 0.6 + Math.random() * 0.3; OM = 1.2 + Math.random() * 0.5;
      CaCO3 = 3 + Math.random() * 2; Sand = 40 + Math.random() * 20; Silt = 30 + Math.random() * 10; Clay = 30 + Math.random() * 10;
      Mg = 90 + Math.random() * 30; Fe = 15 + Math.random() * 10; Zn = 0.7 + Math.random() * 0.3; Mn = 5 + Math.random() * 3;
      break;
  }

  // Adjust environmental factors based on water availability
  if (claim.waterAvailability === 'High') {
    Rainfall = 150 + Math.random() * 50; Humidity = 70 + Math.random() * 10;
  } else if (claim.waterAvailability === 'Low') {
    Rainfall = 50 + Math.random() * 20; Humidity = 40 + Math.random() * 10;
  } else if (claim.waterAvailability === 'Unknown') {
    Rainfall = 100 + Math.random() * 50; Humidity = 60 + Math.random() * 15;
  }

  const parameters: SoilParameters = {
    N: parseFloat(N.toFixed(1)), P: parseFloat(P.toFixed(1)), K: parseFloat(K.toFixed(1)),
    pH: parseFloat(pH.toFixed(1)), EC: parseFloat(EC.toFixed(2)), OM: parseFloat(OM.toFixed(2)),
    CaCO3: parseFloat(CaCO3.toFixed(2)), Sand: parseFloat(Sand.toFixed(1)), Silt: parseFloat(Silt.toFixed(1)), Clay: parseFloat(Clay.toFixed(1)),
    Temperature: parseFloat(Temperature.toFixed(1)), Humidity: parseFloat(Humidity.toFixed(1)), Rainfall: parseFloat(Rainfall.toFixed(1)),
    Mg: parseFloat(Mg.toFixed(1)), Fe: parseFloat(Fe.toFixed(1)), Zn: parseFloat(Zn.toFixed(2)), Mn: parseFloat(Mn.toFixed(2)),
  };

  // --- Soil Health Assessment ---
  let overallQuality = "Moderate";
  let fertilityScore = 60;
  const strengths: string[] = [];
  const deficiencies: string[] = [];

  if (parameters.N > 150 && parameters.P > 25 && parameters.K > 180) strengths.push("Good NPK levels");
  else deficiencies.push("Suboptimal NPK levels");

  if (parameters.pH >= 6.0 && parameters.pH <= 7.5) strengths.push("Optimal pH");
  else deficiencies.push("Suboptimal pH");

  if (parameters.OM > 1.5) strengths.push("High organic matter");
  else deficiencies.push("Low organic matter");

  if (parameters.Clay > 30) strengths.push("Good water retention (high clay)");
  if (parameters.Sand > 50) strengths.push("Good drainage (high sand)");

  if (deficiencies.length === 0) {
    overallQuality = "Excellent";
    fertilityScore = 90 + Math.random() * 10;
  } else if (deficiencies.length <= 2) {
    overallQuality = "Good";
    fertilityScore = 70 + Math.random() * 10;
  } else if (deficiencies.length <= 4) {
    overallQuality = "Moderate";
    fertilityScore = 50 + Math.random() * 10;
  } else {
    overallQuality = "Poor";
    fertilityScore = 30 + Math.random() * 10;
  }

  const healthAssessment: SoilHealthAssessment = {
    overallQuality,
    fertilityScore: parseFloat(fertilityScore.toFixed(0)),
    strengths: strengths.length > 0 ? strengths : ["No major strengths identified."],
    deficiencies: deficiencies.length > 0 ? deficiencies : ["No major deficiencies identified."],
  };

  // --- Actionable Recommendations ---
  const recommendations: SoilRecommendation[] = [];

  if (parameters.N < 100) recommendations.push({ category: "Nutient Management", action: "Apply Nitrogen-rich fertilizers", details: "Consider adding urea or compost to boost nitrogen levels for leafy growth." });
  if (parameters.P < 20) recommendations.push({ category: "Nutrient Management", action: "Incorporate Phosphorus supplements", details: "Use diammonium phosphate (DAP) or rock phosphate to improve root development." });
  if (parameters.K < 120) recommendations.push({ category: "Nutrient Management", action: "Enhance Potassium content", details: "Apply muriate of potash (MOP) or wood ash to support flowering and fruiting." });
  if (parameters.pH < 6.0) recommendations.push({ category: "pH Correction", action: "Apply liming materials", details: "Add agricultural lime to raise pH and reduce soil acidity." });
  if (parameters.pH > 7.5) recommendations.push({ category: "pH Correction", action: "Use acidifying agents", details: "Incorporate elemental sulfur or organic matter to lower pH." });
  if (claim.waterAvailability === 'Low') recommendations.push({ category: "Water Management", action: "Implement water-saving irrigation", details: "Adopt drip irrigation or sprinklers and consider drought-resistant crop varieties." });
  if (parameters.Fe < 10) recommendations.push({ category: "Micronutrient Supplement", action: "Apply Iron chelates", details: "Address iron deficiency with foliar sprays or soil application of iron chelates." });
  if (parameters.Zn < 0.6) recommendations.push({ category: "Micronutrient Supplement", action: "Supplement Zinc", details: "Use zinc sulfate or zinc chelate to correct zinc deficiency, crucial for enzyme activity." });

  if (recommendations.length === 0) {
    recommendations.push({ category: "General", action: "Maintain current practices", details: "Your soil health is good; continue with sustainable farming methods." });
  }

  return {
    parameters,
    healthAssessment,
    recommendations,
  };
};


const runPredictiveAnalysis = (claim: Claim) => {
  return {
    cropAnalysis: getCropAnalysis(claim.soilType),
    waterAnalysis: getWaterAnalysis(claim.waterAvailability),
    economicOpportunities: getEconomicOpportunities(claim),
    soilAnalysis: getSoilAnalysis(claim), // Include new soil analysis
  };
};


serve(async (req) => {
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

    if (!claim || !claim.id) {
      return new Response(JSON.stringify({ error: 'Missing claim data or claim ID in request body.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Ensure claim object has all necessary properties for analysis, including 'Unknown' types
    const fullClaim: Claim = {
      id: claim.id,
      holderName: claim.holderName || 'Unknown',
      village: claim.village || 'Unknown',
      district: claim.district || 'Unknown',
      state: claim.state || 'Unknown',
      area: claim.area || 0,
      status: claim.status || 'Pending',
      estimatedCropValue: claim.estimatedCropValue || 0,
      soilType: claim.soilType || 'Unknown',
      waterAvailability: claim.waterAvailability || 'Unknown',
    };

    const analysisResults = runPredictiveAnalysis(fullClaim);

    // Always upsert the analysis results to the database
    const { error: upsertError } = await supabaseClient
      .from('ai_analysis_results')
      .upsert(
        {
          claim_id: fullClaim.id,
          analysis_data: analysisResults,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'claim_id' }
      );

    if (upsertError) {
      console.error('Error upserting AI analysis results:', upsertError);
    }

    return new Response(
      JSON.stringify(analysisResults),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})