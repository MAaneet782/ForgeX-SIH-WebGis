// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Claim {
  status: 'Approved' | 'Pending' | 'Rejected';
  area: number;
}

const calculateEligibility = (claim: Claim) => {
  return [
    {
      name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      url: "https://pmkisan.gov.in/",
      isEligible: claim.status === 'Approved' && claim.area < 5,
      reason: claim.status !== 'Approved' ? "Claim not approved." : claim.area >= 5 ? "Area exceeds 5 acre limit." : "All criteria met.",
    },
    {
      name: "National Food Security Mission",
      url: "https://www.nfsm.gov.in/",
      isEligible: claim.status === 'Approved',
      reason: claim.status === 'Approved' ? "Claim is approved." : "Claim not approved.",
    },
    {
      name: "Rashtriya Krishi Vikas Yojana (RKVY)",
      url: "https://rkvy.nic.in/",
      isEligible: claim.area > 2,
      reason: claim.area > 2 ? "Area is above the 2 acre minimum." : "Area is 2 acres or less.",
    },
  ];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { claim } = await req.json();

    if (!claim || typeof claim.status === 'undefined' || typeof claim.area === 'undefined') {
      return new Response(JSON.stringify({ error: 'Invalid claim data provided.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const eligibilityData = calculateEligibility(claim);

    return new Response(
      JSON.stringify({ schemes: eligibilityData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})