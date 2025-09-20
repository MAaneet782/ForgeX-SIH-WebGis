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
  isPhysicallyChallenged: boolean; // For PMJAY, NSAP
  isBPLHousehold: boolean; // For NSAP
  isWidow: boolean; // For NSAP
  isElderly: boolean; // For NSAP
  isManualScavenger: boolean; // For PMJAY
  isLandlessCasualLaborer: boolean; // For PMJAY
  isPVTG: boolean; // For EMRS, Skill Development
  isMinorForestProduceCollector: boolean; // For Van Dhan Scheme
  isYouth: boolean; // For Skill Development
}

interface SchemeDetail {
  name: string;
  url: string;
  isEligible: boolean;
  eligibilityConditions: string[];
  schemeOverview: string; // New field
  keyBenefits: string[];
  verificationProcess: string[];
  intendedCoverage: string;
  reason: string; // Short reason for eligibility/ineligibility
}

const calculateEligibility = (claim: ClaimForSchemes): SchemeDetail[] => {
  const schemes: SchemeDetail[] = [];

  // --- 1) Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) ---
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
      "Landholding farmer families.",
      "Not an institutional landholder.",
      "Not a taxpayer in higher income bracket.",
      "Not a government employee/pensioner/professional/elected representative."
    ],
    schemeOverview: "Scheme to provide benefits to farmers’ families to support their financial needs for inputs related to agriculture and other activities.",
    keyBenefits: [
      "₹6,000 per year financial assistance.",
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

  // --- 2) Dharti Aaba Janjatiya Gram Utkarsh Abhiyan (DAJGUA) ---
  let dajguaEligible = false;
  let dajguaReason = "";
  const isTribalMajorityVillage = claim.village.toLowerCase().includes('tribal') || claim.isScheduledArea; // Mock logic
  const isInAspirationalDistrict = claim.district.toLowerCase().includes('mandla') || claim.district.toLowerCase().includes('koraput'); // Mock logic

  if ((isTribalMajorityVillage && claim.area > 0) || (isInAspirationalDistrict && claim.isForestDweller)) {
    dajguaEligible = true;
    dajguaReason = "Resides in a tribal-majority or aspirational district with tribal population.";
  } else {
    if (!isTribalMajorityVillage && !isInAspirationalDistrict) dajguaReason += "Not in a tribal-majority village or aspirational district. ";
    if (!claim.isForestDweller && isInAspirationalDistrict) dajguaReason += "Not identified as a forest dweller in an aspirational district. ";
    if (dajguaReason === "") dajguaReason = "Not eligible based on unknown criteria.";
  }

  schemes.push({
    name: "Dharti Aaba Janjatiya Gram Utkarsh Abhiyan (DAJGUA)",
    url: "#", // Placeholder URL
    isEligible: dajguaEligible,
    eligibilityConditions: [
      "Tribal-majority villages (population ≥ 500 and at least 50% tribal residents).",
      "Villages in Aspirational Districts with tribal population ≥ 50."
    ],
    schemeOverview: "Aims for the holistic and sustainable development of tribal areas by bridging gaps in infrastructure, healthcare, education, and livelihoods. Ensures inclusive growth through convergence of Government schemes, empowering tribal communities in saturation mode.",
    keyBenefits: [
      "Housing (₹1.5 lakh).",
      "Health cover (₹5 lakh).",
      "Scholarships, pensions, MSP, stipends, insurance, financial inclusion."
    ],
    verificationProcess: [
      "Village demographic data verification.",
      "Aspirational District identification.",
      "Beneficiary identification through Gram Sabha."
    ],
    intendedCoverage: "63,843 villages, 549 districts, 2,911 blocks in 30 States/UTs, 5+ crore tribal people over 5 years.",
    reason: dajguaReason.trim()
  });

  // --- 3) Pradhan Mantri Awaas Yojana – Gramin (PMAY-G) ---
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
      "Rural households that are homeless or living in kutcha/dilapidated houses.",
      "Selection of beneficiaries done using Socio-Economic and Caste Census (SECC) 2011 data, verified by Gram Sabha.",
      "Priority given to SC/STs, minorities, freed bonded labourers, and destitute families."
    ],
    schemeOverview: "Launched in 2016 to replace Indira Awaas Yojana. Objective: provide pucca houses with basic amenities to all eligible rural households. Target: 2.95 crore houses by 2024 in rural India.",
    keyBenefits: [
      "Financial Assistance: ₹1.20 lakh in plain areas, ₹1.30 lakh in hilly/difficult/IAP districts.",
      "Toilet construction: ₹12,000 via SBM-G.",
      "MGNREGS wages: 90–95 person-days of unskilled labour for construction."
    ],
    verificationProcess: [
      "SECC 2011 data for identification.",
      "Aadhaar seeding for beneficiary authentication.",
      "Geo-tagging of houses at various stages of construction."
    ],
    intendedCoverage: "Rural households across all States & UTs, total 2.95 crore families targeted.",
    reason: pmaygReason.trim()
  });

  // --- 4) Panchayats (Extension to Scheduled Areas) Act, 1996 (PESA) ---
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
    name: "Panchayats (Extension to Scheduled Areas) Act, 1996 (PESA)",
    url: "https://tribal.nic.in/PESA.aspx",
    isEligible: pesaEligible,
    eligibilityConditions: [
      "The Act applies to Scheduled Areas as defined under the Fifth Schedule of the Constitution of India.",
      "Scheduled Areas are those areas identified by the President (in consultation with the Governor of the state) as needing special protection for tribal communities."
    ],
    schemeOverview: "Enacted in 1996 to extend the provisions of Part IX (Panchayats) of the Constitution to Scheduled Areas with certain modifications. Aims to bring local self-governance (Panchayati Raj) to tribal / scheduled areas, but in a way that respects tribal traditions, customs, and management of community resources.",
    keyBenefits: [
      "Gram Sabhas empowered to approve development plans & identify beneficiaries.",
      "Control minor forest produce, land alienation, and local markets.",
      "Manage natural resources per tribal customs."
    ],
    verificationProcess: [
      "Geographical location within a Scheduled Area.",
      "Gram Sabha resolution and recognition of rights."
    ],
    intendedCoverage: "Tribal communities in Scheduled Areas of 10 states.",
    reason: pesaReason.trim()
  });

  // --- 5) Pradhan Mantri Jan Arogya Yojana (PMJAY) ---
  let pmjayEligible = false;
  let pmjayReason = "";
  if (claim.isSCST || claim.isBelowPovertyLine || claim.isPhysicallyChallenged || claim.isManualScavenger || claim.isLandlessCasualLaborer) { // Simplified criteria for vulnerable groups
    pmjayEligible = true;
    pmjayReason = "Identified as SC/ST, Below Poverty Line, physically challenged, manual scavenger, or landless casual laborer.";
  } else {
    if (!claim.isSCST) pmjayReason += "Not identified as SC/ST. ";
    if (!claim.isBelowPovertyLine) pmjayReason += "Not identified as Below Poverty Line. ";
    if (!claim.isPhysicallyChallenged) pmjayReason += "Not identified as physically challenged. ";
    if (!claim.isManualScavenger) pmjayReason += "Not identified as manual scavenger. ";
    if (!claim.isLandlessCasualLaborer) pmjayReason += "Not identified as landless casual laborer. ";
    if (pmjayReason === "") pmjayReason = "Not eligible based on unknown criteria.";
  }

  schemes.push({
    name: "Pradhan Mantri Jan Arogya Yojana (PMJAY)",
    url: "https://pmjay.gov.in/",
    isEligible: pmjayEligible,
    eligibilityConditions: [
      "SC and ST households.",
      "Beggars.",
      "Families with no individual between 16 and 59 years.",
      "Families having at least one physically challenged member and no able-bodied adult member.",
      "Legally released bonded labourers.",
      "Manual scavenger families.",
      "Landless households who make a living by working as casual manual labourers."
    ],
    schemeOverview: "Plans to make secondary and tertiary healthcare completely cashless for the underprivileged section of society.",
    keyBenefits: [
      "Health cover of ₹5 lakh per family per year.",
      "Comprehensive Coverage – encompasses 27 specialty areas.",
      "Post-discharge care – Coverage for post-discharge care and medication expenses.",
      "Multi-surgical coverage - Provides financial support for multiple surgeries.",
      "Critical illness coverage - Extends financial assistance for the treatment of critical illnesses."
    ],
    verificationProcess: [
      "SECC 2011 data for rural beneficiaries.",
      "RSBY (Rashtriya Swasthya Bima Yojana) active families.",
      "Aadhaar-based identification at empanelled hospitals."
    ],
    intendedCoverage: "Approximately 10.74 crore poor and vulnerable families (around 50 crore beneficiaries).",
    reason: pmjayReason.trim()
  });

  // --- 6) Forest Rights Act, 2006 (FRA) ---
  let fraEligible = false;
  let fraReason = "";
  if (claim.isForestDweller && claim.status === 'Approved') { // Simplified: already has an approved claim implies FRA recognition
    fraEligible = true;
    fraReason = "Identified as a forest dweller with an approved claim, implying FRA recognition.";
  } else {
    if (!claim.isForestDweller) fraReason += "Not identified as a forest dweller. ";
    if (claim.status !== 'Approved') fraReason += "Claim not approved. ";
    if (fraReason === "") fraReason = "Not eligible based on unknown criteria.";
  }

  schemes.push({
    name: "Forest Rights Act, 2006 (FRA)",
    url: "https://tribal.nic.in/FRA.aspx",
    isEligible: fraEligible,
    eligibilityConditions: [
      "Forest-dwelling Scheduled Tribes (STs) who were residing in forests before 13 December 2005 and depending on forests for livelihood.",
      "Other Traditional Forest Dwellers (OTFDs): those (or their communities) who have resided in forest land for at least three generations (about 75 years) prior to 2005, depending on forest resources.",
      "Claims verified by Gram Sabha → SDLC → DLC."
    ],
    schemeOverview: "Enacted in 2006, came into force in 2007. Purpose: to recognise and vest forest rights and occupation in forest land for forest-dwelling STs and OTFDs, whose rights were not acknowledged earlier. Empowers Gram Sabhas as custodians of forest governance. Aims to correct the “historical injustice” faced by forest-dwelling communities.",
    keyBenefits: [
      "Land Tenure Security: Up to 4 hectares for habitation & self-cultivation.",
      "Community Rights: Access to minor forest produce, grazing, water bodies.",
      "CFR Rights: Right to conserve, manage & regenerate forests.",
      "Livelihood Security: Links to government schemes, improved incomes."
    ],
    verificationProcess: [
      "Gram Sabha verification.",
      "Sub-Divisional Level Committee (SDLC) approval.",
      "District Level Committee (DLC) approval."
    ],
    intendedCoverage: "Potentially benefits 150+ million people across 40 million hectares of forest land.",
    reason: fraReason.trim()
  });

  // --- 7) Tribal Forest Dwellers Empowerment Scheme (NSTFDC) ---
  let nstfdcEligible = false;
  let nstfdcReason = "";
  if (fraEligible && claim.status === 'Approved') { // Depends on FRA eligibility and approved claim
    nstfdcEligible = true;
    nstfdcReason = "Eligible under FRA with an approved claim, making them eligible for financial assistance.";
  } else {
    if (!fraEligible) nstfdcReason += "Not eligible under FRA. ";
    if (claim.status !== 'Approved') nstfdcReason += "Claim not approved. ";
    if (nstfdcReason === "") nstfdcReason = "Not eligible based on unknown criteria.";
  }

  schemes.push({
    name: "Tribal Forest Dwellers Empowerment Scheme (NSTFDC)",
    url: "https://nstfdc.nic.in/",
    isEligible: nstfdcEligible,
    eligibilityConditions: [
      "Must be a Scheduled Tribe who has received land rights under the Forest Rights Act, 2006 (i.e., individual has title deed / forest land entitlement under FRA).",
      "Only beneficiaries with such vested land rights are eligible for assistance under this scheme."
    ],
    schemeOverview: "A scheme by NSTFDC (National Scheduled Tribes Finance & Development Corporation) under Ministry of Tribal Affairs. Objective: generate awareness, provide training, assist in marketing linkage, and give concessional financial assistance to forest dwelling STs to utilize their lands productively.",
    keyBenefits: [
      "Financial assistance (loan) under concessional terms through NSTFDC to beneficiaries.",
      "Scheme covers projects costing up to ₹1 lakh with loan up to 90% of the cost.",
      "Interest rate is concessional — about 6% per annum."
    ],
    verificationProcess: [
      "Verification of FRA title deed/entitlement.",
      "NSTFDC application process."
    ],
    intendedCoverage: "Forest dwelling STs with vested land rights under FRA.",
    reason: nstfdcReason.trim()
  });

  // --- 8) Van Dhan Scheme ---
  let vanDhanEligible = false;
  let vanDhanReason = "";
  if (claim.isForestDweller && claim.isMinorForestProduceCollector) { // Mock logic
    vanDhanEligible = true;
    vanDhanReason = "Identified as a forest dweller and involved in Minor Forest Produce collection.";
  } else {
    if (!claim.isForestDweller) vanDhanReason += "Not identified as a forest dweller. ";
    if (!claim.isMinorForestProduceCollector) vanDhanReason += "Not involved in Minor Forest Produce collection. ";
    if (vanDhanReason === "") vanDhanReason = "Not eligible based on unknown criteria.";
  }

  schemes.push({
    name: "Van Dhan Scheme",
    url: "https://trifed.tribal.gov.in/schemes/van-dhan-yojana",
    isEligible: vanDhanEligible,
    eligibilityConditions: [
      "Tribal / forest-dwelling persons involved in collection of Minor Forest Produce (MFP).",
      "Organised into Self-Help Groups (SHGs). Local SHGs or groups of forest gatherers."
    ],
    schemeOverview: "Launched: 14 April 2018 by the Ministry of Tribal Affairs & TRIFED. Purpose: improve tribal incomes by value-addition of forest products, better market access, reduce dependence on middle-men. Implemented via Van Dhan Vikas Kendras (VDVKs) at district / village level, using clusters of SHGs.",
    keyBenefits: [
      "TRIFED provides about ₹15 lakh for tools/equipment / infrastructure / training etc. for each Van Dhan Vikas Kendra (≈ 300 tribal members).",
      "Provided training in sustainable harvesting, primary processing, packaging, branding, marketing.",
      "Working capital / value addition support so tribal producers can process and sell MFPs at better prices."
    ],
    verificationProcess: [
      "Verification of MFP collection activity.",
      "SHG membership verification."
    ],
    intendedCoverage: "Tribal communities involved in MFP collection.",
    reason: vanDhanReason.trim()
  });

  // --- 9) Eklavya Model Residential Schools (EMRS) ---
  let emrsEligible = false;
  let emrsReason = "";
  const isSTStudent = claim.isSCST || claim.isPVTG; // Mock logic for student
  const isEligibleBlock = claim.district.toLowerCase().includes('dindori') || claim.district.toLowerCase().includes('mayurbhanj'); // Mock logic for block

  if (isSTStudent && isEligibleBlock) {
    emrsEligible = true;
    emrsReason = "Belongs to ST/PVTG and resides in an eligible tribal block.";
  } else {
    if (!isSTStudent) emrsReason += "Not identified as ST/PVTG. ";
    if (!isEligibleBlock) emrsReason += "Does not reside in an eligible tribal block. ";
    if (emrsReason === "") emrsReason = "Not eligible based on unknown criteria.";
  }

  schemes.push({
    name: "Eklavya Model Residential Schools (EMRS)",
    url: "https://emrs.tribal.gov.in/",
    isEligible: emrsEligible,
    eligibilityConditions: [
      "Students belonging to Scheduled Tribes (STs) (including PVTGs) from tribal / remote areas.",
      "The block (administrative unit) should have ≥ 50% ST population and at least 20,000 tribal persons, for sanctioning EMRS in that block."
    ],
    schemeOverview: "Started in 1997-98 by Ministry of Tribal Affairs. Residential schools providing free education from Class VI to XII, with meals, boarding, lodging, and other facilities. Goal: ensure quality education for ST children in remote and tribal dominated areas; provide equitable educational access.",
    keyBenefits: [
      "Infrastructure (capital) grants to build the school: ≈ ₹37.80 crore in plain areas and ≈ ₹48 crore in Northeast / hilly / Left-Wing Extremism affected / difficult areas.",
      "Recurring cost: ₹1,09,000 per student per year as operating cost.",
      "Non-recurring grants (once every 5 years) for essential items (furniture, labs, hostels etc.): up to ₹20 lakh per school."
    ],
    verificationProcess: [
      "ST/PVTG status verification.",
      "Residency in eligible block verification.",
      "Admission test."
    ],
    intendedCoverage: "Every eligible block to have an EMRS. Target number of EMRSs = 728 by 2026.",
    reason: emrsReason.trim()
  });

  // --- 10) National Social Assistance Programme (NSAP) ---
  let nsapEligible = false;
  let nsapReason = "";
  if (claim.isBPLHousehold && (claim.isElderly || claim.isWidow || claim.isPhysicallyChallenged)) {
    nsapEligible = true;
    nsapReason = "Belongs to BPL household and is elderly, a widow, or physically challenged.";
  } else {
    if (!claim.isBPLHousehold) nsapReason += "Not identified as a BPL household. ";
    if (!claim.isElderly && !claim.isWidow && !claim.isPhysicallyChallenged) nsapReason += "Does not meet age/status/disability criteria. ";
    if (nsapReason === "") nsapReason = "Not eligible based on unknown criteria.";
  }

  schemes.push({
    name: "National Social Assistance Programme (NSAP)",
    url: "https://nsap.nic.in/",
    isEligible: nsapEligible,
    eligibilityConditions: [
      "Below Poverty Line (BPL) households.",
      "Old Age: 60+ years; Widow: 40–79 years; Disability: 18–79 years with ≥80% disability.",
      "National Family Benefit Scheme (NFBS): BPL family losing primary breadwinner (18–59 years).",
      "Annapurna: 65+ years not covered under pension."
    ],
    schemeOverview: "Launched in 1995, Central Sector Scheme. Provides minimum social security to elderly, widows, disabled persons, and bereaved families. Includes: Indira Gandhi National Old Age Pension Scheme (IGNOAPS), Indira Gandhi National Widow Pension Scheme (IGNWPS), Indira Gandhi National Disability Pension Scheme (IGNDPS), National Family Benefit Scheme (NFBS), Annapurna Scheme.",
    keyBenefits: [
      "Pensions: ₹200–₹500/month (varies by scheme/age).",
      "Widow/Disability pensions: ₹300/month.",
      "NFBS: ₹20,000 one-time assistance.",
      "Annapurna: 10 kg free food grains/month."
    ],
    verificationProcess: [
      "BPL status verification.",
      "Age, widowhood, or disability certificate verification."
    ],
    intendedCoverage: "~29 million beneficiaries.",
    reason: nsapReason.trim()
  });

  // --- 11) Skill Development Schemes under Ministry of Tribal Affairs (like Vocational Training Centres, NSTFDC schemes) ---
  let skillDevEligible = false;
  let skillDevReason = "";
  if (claim.isSCST || claim.isPVTG || claim.isYouth) { // Mock logic
    skillDevEligible = true;
    skillDevReason = "Identified as ST/PVTG youth, eligible for skill development.";
  } else {
    if (!claim.isSCST && !claim.isPVTG) skillDevReason += "Not identified as ST/PVTG. ";
    if (!claim.isYouth) skillDevReason += "Not identified as youth. ";
    if (skillDevReason === "") skillDevReason = "Not eligible based on unknown criteria.";
  }

  schemes.push({
    name: "Skill Development Schemes under Ministry of Tribal Affairs",
    url: "https://tribal.nic.in/schemes/skill-development", // Placeholder URL
    isEligible: skillDevEligible,
    eligibilityConditions: [
      "Scheduled Tribe (ST) youth, including Particularly Vulnerable Tribal Groups (PVTGs).",
      "Priority to remote, backward, and extremist-affected areas."
    ],
    schemeOverview: "Central Sector Scheme by Ministry of Tribal Affairs. Aims to upgrade skills of tribal youth in both modern and traditional trades through Vocational Training Centres (VTCs). Goal: employability and self-employment.",
    keyBenefits: [
      "Training in up to 5 trades per VTC, with ~20 trainees per trade.",
      "Stipend ~₹700/month per trainee, support for boarding/lodging, tools, raw materials.",
      "Non-recurring grants (once every 5 years) for essential items (furniture, labs, hostels etc.): up to ₹20 lakh per school."
    ],
    verificationProcess: [
      "ST/PVTG status verification.",
      "Age verification for youth category.",
      "Residency in priority areas."
    ],
    intendedCoverage: "ST youth in remote and backward areas.",
    reason: skillDevReason.trim()
  });

  // --- 12) FRA 2006 (Detailed) ---
  // This is a duplicate of scheme 6, but with more detailed overview and benefits as provided.
  // I'll keep it separate for now, but in a real app, you'd consolidate.
  let fra2Eligible = false;
  let fra2Reason = "";
  if (claim.isForestDweller && claim.status === 'Approved') { // Simplified: already has an approved claim implies FRA recognition
    fra2Eligible = true;
    fra2Reason = "Identified as a forest dweller with an approved claim, implying FRA recognition.";
  } else {
    if (!claim.isForestDweller) fra2Reason += "Not identified as a forest dweller. ";
    if (claim.status !== 'Approved') fra2Reason += "Claim not approved. ";
    if (fra2Reason === "") fra2Reason = "Not eligible based on unknown criteria.";
  }

  schemes.push({
    name: "Forest Rights Act, 2006 (FRA) - Detailed",
    url: "https://tribal.nic.in/FRA.aspx",
    isEligible: fra2Eligible,
    eligibilityConditions: [
      "Scheduled Tribes (STs): Must be residing in forests before 13th December 2005.",
      "Other Traditional Forest Dwellers (OTFDs): Must prove 75 years of continuous residence before 2005.",
      "Claims verified by Gram Sabha → SDLC → DLC."
    ],
    schemeOverview: "Recognizes and vests Individual Forest Rights (IFR), Community Rights (CR), and Community Forest Resource Rights (CFR). Empowers Gram Sabhas as custodians of forest governance. Aims to correct the “historical injustice” faced by forest-dwelling communities.",
    keyBenefits: [
      "Land Tenure Security: Up to 4 hectares for habitation & self-cultivation.",
      "Community Rights: Access to minor forest produce, grazing, water bodies.",
      "CFR Rights: Right to conserve, manage & regenerate forests.",
      "Livelihood Security: Links to government schemes, improved incomes."
    ],
    verificationProcess: [
      "Gram Sabha verification.",
      "Sub-Divisional Level Committee (SDLC) approval.",
      "District Level Committee (DLC) approval."
    ],
    intendedCoverage: "Potentially benefits 150+ million people across 40 million hectares of forest land.",
    reason: fra2Reason.trim()
  });


  return schemes;
};

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

    if (!claim || typeof claim.status === 'undefined' || typeof claim.area === 'undefined') {
      return new Response(JSON.stringify({ error: 'Invalid claim data provided.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // --- Mocking additional claim properties for detailed eligibility ---
    // In a real application, these would come from a user profile or other data sources.
    const augmentedClaim: ClaimForSchemes = {
      ...claim,
      isForestDweller: claim.holderName.toLowerCase().includes('bhil') || claim.holderName.toLowerCase().includes('gond') || claim.village.toLowerCase().includes('forest') || claim.state.toLowerCase().includes('odisha'),
      isBelowPovertyLine: claim.estimatedCropValue < 10000 || claim.holderName.toLowerCase().includes('bpl'), // Example: low crop value implies BPL
      isTaxpayer: claim.estimatedCropValue > 50000, // Example: high crop value implies taxpayer
      isInstitutionalLandholder: claim.area > 50, // Example: very large area
      isGovernmentEmployee: claim.holderName.toLowerCase().includes('officer'),
      hasPuccaHouse: claim.holderName.toLowerCase().includes('singh') && claim.village.toLowerCase().includes('urban'), // Example
      isSCST: claim.holderName.toLowerCase().includes('bhil') || claim.holderName.toLowerCase().includes('gond') || claim.holderName.toLowerCase().includes('murmu') || claim.holderName.toLowerCase().includes('soren'),
      isMinority: claim.holderName.toLowerCase().includes('khan'),
      isScheduledArea: claim.district.toLowerCase().includes('dindori') || claim.state.toLowerCase().includes('odisha') || claim.district.toLowerCase().includes('koraput') || claim.district.toLowerCase().includes('mayurbhanj'), // Example
      isPhysicallyChallenged: claim.holderName.toLowerCase().includes('divyang'),
      isBPLHousehold: claim.estimatedCropValue < 10000,
      isWidow: claim.holderName.toLowerCase().includes('devi') && claim.holderName.toLowerCase().includes('widow'),
      isElderly: claim.holderName.toLowerCase().includes('dadi') || claim.holderName.toLowerCase().includes('baba') || claim.holderName.toLowerCase().includes('old'),
      isManualScavenger: claim.holderName.toLowerCase().includes('safai'),
      isLandlessCasualLaborer: claim.area === 0 || claim.holderName.toLowerCase().includes('mazdoor'),
      isPVTG: claim.holderName.toLowerCase().includes('baiga') || claim.holderName.toLowerCase().includes('birhor'),
      isMinorForestProduceCollector: claim.village.toLowerCase().includes('forest') || claim.holderName.toLowerCase().includes('gatherer'),
      isYouth: claim.holderName.toLowerCase().includes('kumar') || claim.holderName.toLowerCase().includes('kumari'),
    };
    // --- End Mocking ---

    const eligibilityData = calculateEligibility(augmentedClaim);

    // Always upsert the analysis results to the database
    const { error: upsertError } = await supabaseClient
      .from('scheme_eligibility_results')
      .upsert(
        {
          claim_id: augmentedClaim.id,
          eligibility_data: eligibilityData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'claim_id' }
      );

    if (upsertError) {
      console.error('Error upserting scheme eligibility results:', upsertError);
    }

    return new Response(
      JSON.stringify({ schemes: eligibilityData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})