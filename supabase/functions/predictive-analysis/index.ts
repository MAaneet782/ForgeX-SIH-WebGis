// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// --- TYPE DEFINITIONS (subset of frontend types) ---
type Claim = {
  soilType: 'Alluvial' | 'Clay' | 'Loamy' | 'Laterite';
  waterAvailability: 'High' | 'Medium' | 'Low';
  area: number;
};

// --- SIMULATED PREDICTIVE MODELS (moved from frontend) ---

const getCropAnalysis = (soilType: Claim['soilType']) => {
  switch (soilType) {
    case 'Alluvial':
      return [
        { name: 'Rice (Paddy)', sowingSeason: 'Kharif (June-July)', subsidyInfo: 'Eligible for MSP and covered under National Food Security Mission.', iconName: 'CalendarDays', potentialYield: '4-5 tons/ha', marketTrend: 'Stable demand, government procurement ensures price stability.' },
        { name: 'Wheat', sowingSeason: 'Rabi (Oct-Nov)', subsidyInfo: 'High demand crop with strong MSP support. Access to PM-KISAN benefits.', iconName: 'BadgeIndianRupee', potentialYield: '3-4 tons/ha', marketTrend: 'Consistently high demand, especially for high-quality grains.' },
      ];
    case 'Clay':
      return [
        { name: 'Cotton', sowingSeason: 'Kharif (May-June)', subsidyInfo: 'Covered under the National Food Security Mission (Commercial Crops).', iconName: 'CalendarDays', potentialYield: '1.5-2 tons/ha', marketTrend: 'Prices linked to international markets; can be volatile but profitable.' },
        { name: 'Soybean', sowingSeason: 'Kharif (June-July)', subsidyInfo: 'Eligible for MSP. Subsidies available for high-yield seeds.', iconName: 'BadgeIndianRupee', potentialYield: '2-2.5 tons/ha', marketTrend: 'Growing demand in food processing and animal feed industries.' },
      ];
    case 'Loamy':
      return [
        { name: 'Maize', sowingSeason: 'Kharif (June-July)', subsidyInfo: 'Subsidies available under the National Mission on Oilseeds and Oil Palm.', iconName: 'CalendarDays', potentialYield: '5-6 tons/ha', marketTrend: 'Strong demand from poultry and starch industries.' },
        { name: 'Pulses (Gram)', sowingSeason: 'Rabi (Oct-Nov)', subsidyInfo: 'Promoted under NFSM-Pulses with financial assistance for seeds and inputs.', iconName: 'BadgeIndianRupee', potentialYield: '1-1.5 tons/ha', marketTrend: 'High domestic demand, government focus on increasing production.' },
      ];
    case 'Laterite':
        return [
        { name: 'Cashew', sowingSeason: 'Plantation (June-Aug)', subsidyInfo: 'Support available from the Directorate of Cashew and Cocoa Development.', iconName: 'CalendarDays', potentialYield: '0.8-1 ton/ha', marketTrend: 'High-value crop with strong export potential.' },
        { name: 'Coffee', sowingSeason: 'Plantation (June-July)', subsidyInfo: 'Subsidies and support provided by the Coffee Board of India.', iconName: 'BadgeIndianRupee', potentialYield: '0.7-1 ton/ha (Arabica)', marketTrend: 'Premium prices for quality beans in global markets.' },
      ];
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
    default:
        return { borewellSuitability: 'Low', score: 0, recommendations: [] };
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

const runPredictiveAnalysis = (claim: Claim) => {
  return {
    cropAnalysis: getCropAnalysis(claim.soilType),
    waterAnalysis: getWaterAnalysis(claim.waterAvailability),
    economicOpportunities: getEconomicOpportunities(claim),
  };
};


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { claim } = await req.json();

    if (!claim) {
      return new Response(JSON.stringify({ error: 'Missing claim data in request body.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Simulate processing time for a real model
    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysisResults = runPredictiveAnalysis(claim);

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