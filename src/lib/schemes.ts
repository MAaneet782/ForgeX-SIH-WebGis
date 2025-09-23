export interface Scheme {
  name: string;
  eligibility: string[];
  overview: string;
  benefits: string[];
}

export const schemes: Scheme[] = [
  {
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    eligibility: ["Landholding farmer families"],
    overview: "Scheme to provide benefits to farmers’ families to support their financial needs for inputs related to agriculture and other activities.",
    benefits: ["₹6,000 per year in 3 equal instalments"],
  },
  {
    name: "Dharti Aaba Janjatiya Gram Utkarsh Abhiyan (DAJGUA)",
    eligibility: [
      "Tribal-majority villages: those with population ≥ 500 and at least 50% tribal residents.",
      "Villages in Aspirational Districts with tribal population ≥ 50.",
    ],
    overview: "Aims for the holistic and sustainable development of tribal areas by bridging gaps in infrastructure, healthcare, education, and livelihoods.",
    benefits: [
      "Coverage: 63,843 villages, 549 districts, 2,911 blocks in 30 States/UTs.",
      "Beneficiaries: 5+ crore tribal people over 5 years.",
      "Benefits: Housing (₹1.5 lakh), health cover (₹5 lakh), scholarships, pensions, MSP, stipends, insurance, financial inclusion.",
    ],
  },
  {
    name: "Pradhan Mantri Awaas Yojana – Gramin (PMAY-G)",
    eligibility: [
      "Rural households that are homeless or living in kutcha/dilapidated houses.",
      "Selection of beneficiaries done using Socio-Economic and Caste Census (SECC) 2011 data, verified by Gram Sabha.",
      "Priority given to SC/STs, minorities, freed bonded labourers, and destitute families.",
    ],
    overview: "Launched in 2016 to provide pucca houses with basic amenities to all eligible rural households.",
    benefits: [
      "Financial Assistance: ₹1.20 lakh in plain areas, ₹1.30 lakh in hilly/difficult areas.",
      "Toilet construction: ₹12,000 via SBM-G.",
      "MGNREGS wages: 90–95 person-days of unskilled labour.",
    ],
  },
  {
    name: "Panchayats (Extension to Scheduled Areas) Act, 1996 (PESA)",
    eligibility: ["Applies to Scheduled Areas as defined under the Fifth Schedule of the Constitution."],
    overview: "Aims to bring local self-governance (Panchayati Raj) to tribal/scheduled areas, respecting tribal traditions and customs.",
    benefits: [
      "Gram Sabhas empowered to approve development plans & identify beneficiaries.",
      "Control over minor forest produce, land alienation, and local markets.",
      "Management of natural resources per tribal customs.",
    ],
  },
  {
    name: "Pradhan Mantri Jan Arogya Yojana (PMJAY)",
    eligibility: [
      "SC and ST households",
      "Families with no individual between 16 and 59 years",
      "Landless households who work as casual manual labourers",
    ],
    overview: "Plans to make secondary and tertiary healthcare completely cashless for the underprivileged section of society.",
    benefits: ["Health coverage of ₹5 lakh per family per year.", "Post-discharge care and medication expenses.", "Multi-surgical coverage."],
  },
  {
    name: "Forest Rights Act, 2006 (FRA)",
    eligibility: [
      "Forest-dwelling Scheduled Tribes (STs) residing in forests before 13 December 2005.",
      "Other Traditional Forest Dwellers (OTFDs) who have resided in forest land for at least three generations (75 years) prior to 2005.",
    ],
    overview: "To recognise and vest forest rights and occupation in forest land for forest-dwelling communities.",
    benefits: [
      "Granting of title deeds over forest land.",
      "Rights to use, collect, and profit from minor forest produce.",
      "Rights to habitat and traditional livelihood (grazing, fishing, etc.).",
    ],
  },
];