// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define a more comprehensive Claim type for scheme eligibility analysis
interface ClaimForSchemes {
  id: string;
  holderName: string;
  village: string;
  district: string;
  state: string;
  area: number; // in acres
  status: 'Approved' | 'Pending' | 'Rejected';
  estimatedCropValue: number; // in INR
  // Mocked additional properties for scheme eligibility
  isForestDweller: boolean;
  isBelowPovertyLine: boolean;
  isTaxpayer: boolean;
  isInstitutionalLandholder: boolean;
  isGovernmentEmployee: boolean;
  hasPuccaHouse: boolean; // For PMAY-G
  isSCST: boolean; // For PMAY-G
  isMinority: boolean; // For PMAY-G
  isScheduledArea: boolean; // For PESA (based on district/state)
}

interface SchemeDetail {
  name: string;
  url: string;
  isEligible: boolean;
  eligibilityConditions: string[];
  keyBenefits: string[];
  verificationProcess: string[];
  intendedCoverage: string;
  reason: string; // Short reason for eligibility/ineligibility
}

const calculateEligibility = (claim: ClaimForSchemes): SchemeDetail[] => {
  const schemes: SchemeDetail[] = [];

  // --- PM-KISAN ---
  let pmKisanEligible = false;
  let pmKisanReason = "";
  if (claim.status === 'Approved' && !claim.isInstitutionalLandholder && !claim.isTaxpayer && !claim.isGovernmentEmployee) {
    pmKisanEligible = true;
    pmKisanReason = "Claim approved, not an institutional landholder, taxpayer, or government employee.";
  } else {
    if (claim.status !== 'Approved') pmKisanReason += "Claim not approved. ";
    if (claim.isInstitutionalLandholder) pmKisanReason += "Is an institutional landholder. ";
    if (claim.isTaxpayer) pmKisanReason += "Is a taxpayer. ";
    if (claim.isGovernmentEmployee) pmKisanReason += "Is a government employee. ";
    if (pmKisanReason === "") pmKisanReason = "Not eligible based on unknown criteria."; // Fallback
  }

  schemes.push({
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    url: "https://pmkisan.gov.in/",
    isEligible: pmKisanEligible,
    eligibilityConditions: [
      "Applicant is a landholding farmer family (implied by approved claim).",
      "Not an institutional landholder.",
      "Not a taxpayer in higher income bracket.",
      "Not a government employee/pensioner/professional/elected representative."
    ],
    keyBenefits: [
      "₹6,000/year financial assistance.",
      "Paid in 3 equal installments of ₹2,000."
    ],
    verificationProcess: [
      "Data cross-checked through state/UT agriculture department.",
      "Aadhaar-linked bank account verification.",
      "Income tax data verification for exclusions."
    ],
    intendedCoverage: "All landholding farmer families across the country.",
    reason: pmKisanReason.trim()
  });

  // --- DAJGUA (Dadi Amma Jagriti Yojana - assumed tribal/forest dweller scheme) ---
  let dajguaEligible = false;
  let dajguaReason = "";
  if (claim.isForestDweller && claim.status === 'Approved' && claim.area < 10) { // Example criteria
    dajguaEligible = true;
    dajguaReason = "Recognized forest dweller with approved claim and suitable land area.";
  } else {
    if (!claim.isForestDweller) dajguaReason += "Not identified as a forest dweller. ";
    if (claim.status !== 'Approved') dajguaReason += "Claim not approved. ";
    if (claim.area >= 10) dajguaReason += "Land area exceeds scheme limits. ";
    if (dajguaReason === "") dajguaReason = "Not eligible based on unknown criteria.";
  }

  schemes.push({
    name: "Dadi Amma Jagriti Yojana (DAJGUA)",
    url: "#", // Placeholder URL
    isEligible: dajguaEligible,
    eligibilityConditions: [
      "Applicant is a recognized forest dweller.",
      "Holds an approved FRA Patta (implied by approved claim).",
      "Land area within specified limits (e.g., < 10 acres)."
    ],
    keyBenefits: [
      "Livelihood support and skill development.",
      "Small grants for sustainable forest-based activities."
    ],
    verificationProcess: [
      "FRA Patta verification.",
      "Local Gram Sabha/community verification."
    ],
    intendedCoverage: "Forest-dwelling communities and FRA Patta holders.",
    reason: dajguaReason.trim()
  });

  // --- PMAY-G (Pradhan Mantri Awaas Yojana - Gramin) ---
  let pmaygEligible = false;
  let pmaygReason = "";
  if (claim.isBelowPovertyLine && !claim.hasPuccaHouse && (claim.isSCST || claim.isMinority || claim.isForestDweller)) { // Simplified criteria
    pmaygEligible = true;
    pmaygReason = "Below poverty line, no pucca house, and belongs to a vulnerable group.";
  } else {
    if (!claim.isBelowPovertyLine) pmaygReason += "Not identified as Below Poverty Line. ";
    if (claim.hasPuccaHouse) pmaygReason += "Already owns a pucca house. ";
    if (!(claim.isSCST || claim.isMinority || claim.isForestDweller)) pmaygReason += "Does not belong to a target vulnerable group. ";
    if (pmaygReason === "") pmaygReason = "Not eligible based on unknown criteria.";
  }

  schemes.push({
    name: "Pradhan Mantri Awaas Yojana - Gramin (PMAY-G)",
    url: "https://pmayg.nic.in/",
    isEligible: pmaygEligible,
    eligibilityConditions: [
      "Household is houseless or lives in a kutcha house.",
      "Belongs to SC/ST, Minorities, or other vulnerable groups (including FRA beneficiaries).",
      "Income criteria (e.g., identified in SECC 2011 data)."
    ],
    keyBenefits: [
      "Financial assistance for construction of a pucca house.",
      "Up to ₹1.20 lakh in plain areas and ₹1.30 lakh in hilly/difficult areas.",
      "Additional support for toilets (SBM-G) and 90 days of unskilled labor wages (MGNREGA)."
    ],
    verificationProcess: [
      "SECC 2011 data for identification.",
      "Aadhaar seeding for beneficiary authentication.",
      "Geo-tagging of houses at various stages of construction."
    ],
    intendedCoverage: "Rural households who are houseless or living in dilapidated houses.",
    reason: pmaygReason.trim()
  });

  // --- PESA (Panchayats Extension to Scheduled Areas Act, 1996) ---
  let pesaEligible = false;
  let pesaReason = "";
  if (claim.isScheduledArea && claim.isForestDweller) { // Simplified criteria
    pesaEligible = true;
    pesaReason = "Resides in a Scheduled Area and is a forest dweller.";
  } else {
    if (!claim.isScheduledArea) pesaReason += "Does not reside in a Scheduled Area. ";
    if (!claim.isForestDweller) pesaReason += "Not identified as a forest dweller. ";
    if (pesaReason === "") pesaReason = "Not eligible based on unknown criteria.";
  }

  schemes.push({
    name: "Panchayats Extension to Scheduled Areas Act (PESA), 1996",
    url: "https://tribal.nic.in/PESA.aspx",
    isEligible: pesaEligible,
    eligibilityConditions: [
      "Resides in a Scheduled Area (as per Fifth Schedule of Constitution).",
      "Community/individual forest rights recognized under FRA."
    ],
    keyBenefits: [
      "Empowerment of Gram Sabhas in Scheduled Areas.",
      "Control over natural resources, minor forest produce, land alienation, minor water bodies.",
      "Mandatory consultation for land acquisition and rehabilitation."
    ],
    verificationProcess: [
      "Geographical location within a Scheduled Area.",
      "Gram Sabha resolution and recognition of rights."
    ],
    intendedCoverage: "Tribal communities in Scheduled Areas of 10 states.",
    reason: pesaReason.trim()
  });

  // --- PMJAY (Pradhan Mantri Jan Arogya Yojana - Ayushman Bharat) ---
  let pmjayEligible = false;
  let pmjayReason = "";
  if (claim.isBelowPovertyLine || claim.isForestDweller) { // Simplified criteria for vulnerable groups
    pmjayEligible = true;
    pmjayReason = "Identified as Below Poverty Line or a forest dweller.";
  } else {
    if (!claim.isBelowPovertyLine) pmjayReason += "Not identified as Below Poverty Line. ";
    if (!claim.isForestDweller) pmjayReason += "Not identified as a forest dweller. ";
    if (pmjayReason === "") pmjayReason = "Not eligible based on unknown criteria.";
  }

  schemes.push({
    name: "Pradhan Mantri Jan Arogya Yojana (PMJAY)",
    url: "https://pmjay.gov.in/",
    isEligible: pmjayEligible,
    eligibilityConditions: [
      "Deprived rural families (D1, D2, D3, D4, D5, D7 categories as per SECC 2011).",
      "Urban workers' families (11 occupational categories).",
      "No cap on family size or age."
    ],
    keyBenefits: [
      "Health cover of ₹5 lakh per family per year.",
      "Covers secondary and tertiary care hospitalization.",
      "Cashless and paperless access to services."
    ],
    verificationProcess: [
      "SECC 2011 data for rural beneficiaries.",
      "RSBY (Rashtriya Swasthya Bima Yojana) active families.",
      "Aadhaar-based identification at empanelled hospitals."
    ],
    intendedCoverage: "Approximately 10.74 crore poor and vulnerable families (around 50 crore beneficiaries).",
    reason: pmjayReason.trim()
  });

  return schemes;
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

    if (!claim || typeof claim.status === 'undefined' || typeof claim.area === 'undefined') {
      return new Response(JSON.stringify({ error: 'Invalid claim data provided.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Simulate processing time for a real model
    // await new Promise(resolve => setTimeout(resolve, 1500)); // REMOVED DELAY

    // --- Mocking additional claim properties for detailed eligibility ---
    // In a real application, these would come from a user profile or other data sources.
    const augmentedClaim: ClaimForSchemes = {
      ...claim,
      isForestDweller: claim.holderName.toLowerCase().includes('bhil') || claim.holderName.toLowerCase().includes('gond') || claim.village.toLowerCase().includes('forest'),
      isBelowPovertyLine: claim.estimatedCropValue < 10000, // Example: low crop value implies BPL
      isTaxpayer: claim.estimatedCropValue > 50000, // Example: high crop value implies taxpayer
      isInstitutionalLandholder: claim.area > 50, // Example: very large area
      isGovernmentEmployee: claim.holderName.toLowerCase().includes('officer'),
      hasPuccaHouse: claim.holderName.toLowerCase().includes('singh') && claim.village.toLowerCase().includes('urban'), // Example
      isSCST: claim.holderName.toLowerCase().includes('bhil') || claim.holderName.toLowerCase().includes('gond'),
      isMinority: claim.holderName.toLowerCase().includes('khan'),
      isScheduledArea: claim.district.toLowerCase().includes('mandla') || claim.state.toLowerCase().includes('odisha'), // Example
    };
    // --- End Mocking ---

    const eligibilityData = calculateEligibility(augmentedClaim);

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