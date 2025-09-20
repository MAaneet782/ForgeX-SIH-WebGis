-- Delete existing AI analysis results to ensure a clean slate for pre-population
DELETE FROM public.ai_analysis_results;

-- Insert pre-calculated AI analysis results for each mock claim
INSERT INTO public.ai_analysis_results (claim_id, analysis_data, created_at, updated_at)
VALUES
('mp-claim-001', '{
  "cropAnalysis": [
    {
      "name": "Maize",
      "sowingSeason": "Kharif (June-July)",
      "subsidyInfo": "Subsidies available under the National Mission on Oilseeds and Oil Palm.",
      "iconName": "CalendarDays",
      "potentialYield": "5-6 tons/ha",
      "recommendation": "Versatile crop with high yield potential. Good for intercropping."
    },
    {
      "name": "Pulses (Gram)",
      "sowingSeason": "Rabi (Oct-Nov)",
      "subsidyInfo": "Promoted under NFSM-Pulses with financial assistance for seeds and inputs.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "1-1.5 tons/ha",
      "recommendation": "Low water requirement, enhances soil nitrogen. Ideal for rotation."
    },
    {
      "name": "Groundnut",
      "sowingSeason": "Kharif & Rabi",
      "subsidyInfo": "MSP available. Support for seeds and mechanization under various schemes.",
      "iconName": "CalendarDays",
      "potentialYield": "1.5-2 tons/ha",
      "recommendation": "Well-drained loamy soil is perfect. Can be grown in two seasons."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "High",
    "score": 92,
    "recommendations": [
      "High probability of finding sustainable water source.",
      "Apply for subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY).",
      "Consider multi-crop cycles to maximize land usage."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Aquaculture",
      "description": "High water availability makes fish or prawn farming a viable, high-return business.",
      "iconName": "Waves"
    },
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 170.8,
      "P": 30.6,
      "K": 230.2,
      "pH": 7.3,
      "EC": 0.92,
      "OM": 1.83,
      "CaCO3": 6.1,
      "Sand": 48.5,
      "Silt": 40.1,
      "Clay": 27.3,
      "Temperature": 25,
      "Humidity": 75.6,
      "Rainfall": 175.3,
      "Mg": 110.4,
      "Fe": 18.2,
      "Zn": 0.91,
      "Mn": 6.3
    },
    "healthAssessment": {
      "overallQuality": "Excellent",
      "fertilityScore": 95,
      "strengths": [
        "Good NPK levels",
        "Optimal pH",
        "High organic matter",
        "Good drainage (high sand)"
      ],
      "deficiencies": [
        "No major deficiencies identified."
      ]
    },
    "recommendations": [
      {
        "category": "General",
        "action": "Maintain current practices",
        "details": "Your soil health is good; continue with sustainable farming methods."
      }
    ]
  }
}'::jsonb, '2023-01-15T00:00:00.000Z', NOW()),
('mp-claim-002', '{
  "cropAnalysis": [
    {
      "name": "Rice (Paddy)",
      "sowingSeason": "Kharif (June-July)",
      "subsidyInfo": "Eligible for MSP and covered under National Food Security Mission.",
      "iconName": "CalendarDays",
      "potentialYield": "4-5 tons/ha",
      "recommendation": "Ideal for water-rich areas. Use high-yielding varieties for maximum output."
    },
    {
      "name": "Wheat",
      "sowingSeason": "Rabi (Oct-Nov)",
      "subsidyInfo": "High demand crop with strong MSP support. Access to PM-KISAN benefits.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "3-4 tons/ha",
      "recommendation": "Requires well-irrigated land. Good for crop rotation with rice."
    },
    {
      "name": "Sugarcane",
      "sowingSeason": "Annual (Jan-Mar)",
      "subsidyInfo": "Fair and Remunerative Price (FRP) set by government. Subsidies for drip irrigation available.",
      "iconName": "CalendarDays",
      "potentialYield": "80-100 tons/ha",
      "recommendation": "Long-duration, water-intensive crop. Suitable for large holdings."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "Moderate",
    "score": 65,
    "recommendations": [
      "A geological survey is highly recommended before drilling.",
      "Prioritize rainwater harvesting to recharge groundwater.",
      "Explore drip irrigation schemes to conserve water."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 160.5,
      "P": 30.1,
      "K": 220.7,
      "pH": 7.1,
      "EC": 0.88,
      "OM": 1.75,
      "CaCO3": 5.8,
      "Sand": 45.2,
      "Silt": 38.9,
      "Clay": 26.5,
      "Temperature": 25,
      "Humidity": 65.8,
      "Rainfall": 125.1,
      "Mg": 105.3,
      "Fe": 17.5,
      "Zn": 0.85,
      "Mn": 6.1
    },
    "healthAssessment": {
      "overallQuality": "Excellent",
      "fertilityScore": 93,
      "strengths": [
        "Good NPK levels",
        "Optimal pH",
        "High organic matter",
        "Good drainage (high sand)"
      ],
      "deficiencies": [
        "No major deficiencies identified."
      ]
    },
    "recommendations": [
      {
        "category": "General",
        "action": "Maintain current practices",
        "details": "Your soil health is good; continue with sustainable farming methods."
      }
    ]
  }
}'::jsonb, '2023-02-20T00:00:00.000Z', NOW()),
('mp-claim-003', '{
  "cropAnalysis": [
    {
      "name": "Cashew",
      "sowingSeason": "Plantation (June-Aug)",
      "subsidyInfo": "Support available from the Directorate of Cashew and Cocoa Development.",
      "iconName": "CalendarDays",
      "potentialYield": "0.8-1 ton/ha",
      "recommendation": "High-value plantation crop well-suited for coastal areas with laterite soil."
    },
    {
      "name": "Coffee",
      "sowingSeason": "Plantation (June-July)",
      "subsidyInfo": "Subsidies and support provided by the Coffee Board of India.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "0.7-1 ton/ha (Arabica)",
      "recommendation": "Requires specific altitude and rainfall. Best for hilly regions."
    },
    {
      "name": "Rubber",
      "sowingSeason": "Plantation (June-July)",
      "subsidyInfo": "Support from the Rubber Board for new planting and replanting.",
      "iconName": "CalendarDays",
      "potentialYield": "1.5-2 tons/ha",
      "recommendation": "Long-term investment. Requires high rainfall and humidity."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "Not Recommended",
    "score": 28,
    "recommendations": [
      "High risk of borewell failure and rapid depletion.",
      "Focus on surface water conservation like ponds and check dams.",
      "Cultivate drought-resistant crops like millets."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 95.2,
      "P": 18.1,
      "K": 120.5,
      "pH": 5.7,
      "EC": 0.48,
      "OM": 1.25,
      "CaCO3": 1.3,
      "Sand": 65.5,
      "Silt": 22.1,
      "Clay": 21.3,
      "Temperature": 25,
      "Humidity": 45.2,
      "Rainfall": 65.8,
      "Mg": 78.9,
      "Fe": 28.1,
      "Zn": 0.58,
      "Mn": 3.8
    },
    "healthAssessment": {
      "overallQuality": "Poor",
      "fertilityScore": 35,
      "strengths": [
        "No major strengths identified."
      ],
      "deficiencies": [
        "Suboptimal NPK levels",
        "Suboptimal pH",
        "Low organic matter"
      ]
    },
    "recommendations": [
      {
        "category": "Nutient Management",
        "action": "Apply Nitrogen-rich fertilizers",
        "details": "Consider adding urea or compost to boost nitrogen levels for leafy growth."
      },
      {
        "category": "Nutrient Management",
        "action": "Incorporate Phosphorus supplements",
        "details": "Use diammonium phosphate (DAP) or rock phosphate to improve root development."
      },
      {
        "category": "Nutrient Management",
        "action": "Enhance Potassium content",
        "details": "Apply muriate of potash (MOP) or wood ash to support flowering and fruiting."
      },
      {
        "category": "pH Correction",
        "action": "Apply liming materials",
        "details": "Add agricultural lime to raise pH and reduce soil acidity."
      },
      {
        "category": "Water Management",
        "action": "Implement water-saving irrigation",
        "details": "Adopt drip irrigation or sprinklers and consider drought-resistant crop varieties."
      }
    ]
  }
}'::jsonb, '2023-03-10T00:00:00.000Z', NOW()),
('mp-claim-004', '{
  "cropAnalysis": [
    {
      "name": "Cotton",
      "sowingSeason": "Kharif (May-June)",
      "subsidyInfo": "Covered under the National Food Security Mission (Commercial Crops).",
      "iconName": "CalendarDays",
      "potentialYield": "1.5-2 tons/ha",
      "recommendation": "Requires a long frost-free period. Good drainage is essential."
    },
    {
      "name": "Soybean",
      "sowingSeason": "Kharif (June-July)",
      "subsidyInfo": "Eligible for MSP. Subsidies available for high-yield seeds.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "2-2.5 tons/ha",
      "recommendation": "Nitrogen-fixing crop, improves soil fertility. Intercropping is beneficial."
    },
    {
      "name": "Lentils (Masur)",
      "sowingSeason": "Rabi (Oct-Nov)",
      "subsidyInfo": "Promoted under NFSM-Pulses. Minimum Support Price (MSP) is available.",
      "iconName": "CalendarDays",
      "potentialYield": "1-1.2 tons/ha",
      "recommendation": "Drought-tolerant and suitable for rainfed areas with clay soil."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "High",
    "score": 92,
    "recommendations": [
      "High probability of finding sustainable water source.",
      "Apply for subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY).",
      "Consider multi-crop cycles to maximize land usage."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Aquaculture",
      "description": "High water availability makes fish or prawn farming a viable, high-return business.",
      "iconName": "Waves"
    },
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 115.3,
      "P": 38.2,
      "K": 210.1,
      "pH": 6.8,
      "EC": 0.75,
      "OM": 2.3,
      "CaCO3": 3.5,
      "Sand": 23.4,
      "Silt": 32.8,
      "Clay": 55.1,
      "Temperature": 25,
      "Humidity": 78.5,
      "Rainfall": 180.2,
      "Mg": 135.7,
      "Fe": 23.9,
      "Zn": 0.72,
      "Mn": 5.5
    },
    "healthAssessment": {
      "overallQuality": "Excellent",
      "fertilityScore": 98,
      "strengths": [
        "Good NPK levels",
        "Optimal pH",
        "High organic matter",
        "Good water retention (high clay)"
      ],
      "deficiencies": [
        "No major deficiencies identified."
      ]
    },
    "recommendations": [
      {
        "category": "General",
        "action": "Maintain current practices",
        "details": "Your soil health is good; continue with sustainable farming methods."
      }
    ]
  }
}'::jsonb, '2023-04-01T00:00:00.000Z', NOW()),
('mp-claim-005', '{
  "cropAnalysis": [
    {
      "name": "Rice (Paddy)",
      "sowingSeason": "Kharif (June-July)",
      "subsidyInfo": "Eligible for MSP and covered under National Food Security Mission.",
      "iconName": "CalendarDays",
      "potentialYield": "4-5 tons/ha",
      "recommendation": "Ideal for water-rich areas. Use high-yielding varieties for maximum output."
    },
    {
      "name": "Wheat",
      "sowingSeason": "Rabi (Oct-Nov)",
      "subsidyInfo": "High demand crop with strong MSP support. Access to PM-KISAN benefits.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "3-4 tons/ha",
      "recommendation": "Requires well-irrigated land. Good for crop rotation with rice."
    },
    {
      "name": "Sugarcane",
      "sowingSeason": "Annual (Jan-Mar)",
      "subsidyInfo": "Fair and Remunerative Price (FRP) set by government. Subsidies for drip irrigation available.",
      "iconName": "CalendarDays",
      "potentialYield": "80-100 tons/ha",
      "recommendation": "Long-duration, water-intensive crop. Suitable for large holdings."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "Moderate",
    "score": 65,
    "recommendations": [
      "A geological survey is highly recommended before drilling.",
      "Prioritize rainwater harvesting to recharge groundwater.",
      "Explore drip irrigation schemes to conserve water."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 165.7,
      "P": 28.9,
      "K": 215.4,
      "pH": 7.2,
      "EC": 0.9,
      "OM": 1.9,
      "CaCO3": 6.5,
      "Sand": 47.8,
      "Silt": 39.5,
      "Clay": 28.1,
      "Temperature": 25,
      "Humidity": 68.2,
      "Rainfall": 130.5,
      "Mg": 108.1,
      "Fe": 19.1,
      "Zn": 0.89,
      "Mn": 6.4
    },
    "healthAssessment": {
      "overallQuality": "Excellent",
      "fertilityScore": 94,
      "strengths": [
        "Good NPK levels",
        "Optimal pH",
        "High organic matter",
        "Good drainage (high sand)"
      ],
      "deficiencies": [
        "No major deficiencies identified."
      ]
    },
    "recommendations": [
      {
        "category": "General",
        "action": "Maintain current practices",
        "details": "Your soil health is good; continue with sustainable farming methods."
      }
    ]
  }
}'::jsonb, '2023-05-05T00:00:00.000Z', NOW()),
('mp-claim-006', '{
  "cropAnalysis": [
    {
      "name": "Maize",
      "sowingSeason": "Kharif (June-July)",
      "subsidyInfo": "Subsidies available under the National Mission on Oilseeds and Oil Palm.",
      "iconName": "CalendarDays",
      "potentialYield": "5-6 tons/ha",
      "recommendation": "Versatile crop with high yield potential. Good for intercropping."
    },
    {
      "name": "Pulses (Gram)",
      "sowingSeason": "Rabi (Oct-Nov)",
      "subsidyInfo": "Promoted under NFSM-Pulses with financial assistance for seeds and inputs.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "1-1.5 tons/ha",
      "recommendation": "Low water requirement, enhances soil nitrogen. Ideal for rotation."
    },
    {
      "name": "Groundnut",
      "sowingSeason": "Kharif & Rabi",
      "subsidyInfo": "MSP available. Support for seeds and mechanization under various schemes.",
      "iconName": "CalendarDays",
      "potentialYield": "1.5-2 tons/ha",
      "recommendation": "Well-drained loamy soil is perfect. Can be grown in two seasons."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "High",
    "score": 92,
    "recommendations": [
      "High probability of finding sustainable water source.",
      "Apply for subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY).",
      "Consider multi-crop cycles to maximize land usage."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Aquaculture",
      "description": "High water availability makes fish or prawn farming a viable, high-return business.",
      "iconName": "Waves"
    },
    {
      "name": "Eco-Tourism",
      "description": "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.",
      "iconName": "Globe"
    },
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 140.1,
      "P": 29.5,
      "K": 180.3,
      "pH": 7.0,
      "EC": 0.85,
      "OM": 2.1,
      "CaCO3": 5.5,
      "Sand": 55.1,
      "Silt": 33.2,
      "Clay": 22.5,
      "Temperature": 25,
      "Humidity": 76.8,
      "Rainfall": 160.5,
      "Mg": 100.7,
      "Fe": 16.8,
      "Zn": 0.8,
      "Mn": 6.8
    },
    "healthAssessment": {
      "overallQuality": "Excellent",
      "fertilityScore": 96,
      "strengths": [
        "Good NPK levels",
        "Optimal pH",
        "High organic matter",
        "Good drainage (high sand)"
      ],
      "deficiencies": [
        "No major deficiencies identified."
      ]
    },
    "recommendations": [
      {
        "category": "General",
        "action": "Maintain current practices",
        "details": "Your soil health is good; continue with sustainable farming methods."
      }
    ]
  }
}'::jsonb, '2023-06-12T00:00:00.000Z', NOW()),
('mp-claim-007', '{
  "cropAnalysis": [
    {
      "name": "Cotton",
      "sowingSeason": "Kharif (May-June)",
      "subsidyInfo": "Covered under the National Food Security Mission (Commercial Crops).",
      "iconName": "CalendarDays",
      "potentialYield": "1.5-2 tons/ha",
      "recommendation": "Requires a long frost-free period. Good drainage is essential."
    },
    {
      "name": "Soybean",
      "sowingSeason": "Kharif (June-July)",
      "subsidyInfo": "Eligible for MSP. Subsidies available for high-yield seeds.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "2-2.5 tons/ha",
      "recommendation": "Nitrogen-fixing crop, improves soil fertility. Intercropping is beneficial."
    },
    {
      "name": "Lentils (Masur)",
      "sowingSeason": "Rabi (Oct-Nov)",
      "subsidyInfo": "Promoted under NFSM-Pulses. Minimum Support Price (MSP) is available.",
      "iconName": "CalendarDays",
      "potentialYield": "1-1.2 tons/ha",
      "recommendation": "Drought-tolerant and suitable for rainfed areas with clay soil."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "Not Recommended",
    "score": 28,
    "recommendations": [
      "High risk of borewell failure and rapid depletion.",
      "Focus on surface water conservation like ponds and check dams.",
      "Cultivate drought-resistant crops like millets."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 105.1,
      "P": 35.5,
      "K": 200.2,
      "pH": 6.7,
      "EC": 0.7,
      "OM": 2.4,
      "CaCO3": 3.8,
      "Sand": 25.1,
      "Silt": 34.2,
      "Clay": 52.8,
      "Temperature": 25,
      "Humidity": 48.1,
      "Rainfall": 60.5,
      "Mg": 128.5,
      "Fe": 22.1,
      "Zn": 0.68,
      "Mn": 4.9
    },
    "healthAssessment": {
      "overallQuality": "Good",
      "fertilityScore": 75,
      "strengths": [
        "Good NPK levels",
        "Optimal pH",
        "High organic matter",
        "Good water retention (high clay)"
      ],
      "deficiencies": [
        "No major deficiencies identified."
      ]
    },
    "recommendations": [
      {
        "category": "General",
        "action": "Maintain current practices",
        "details": "Your soil health is good; continue with sustainable farming methods."
      }
    ]
  }
}'::jsonb, '2023-07-01T00:00:00.000Z', NOW()),
('mp-claim-008', '{
  "cropAnalysis": [
    {
      "name": "Maize",
      "sowingSeason": "Kharif (June-July)",
      "subsidyInfo": "Subsidies available under the National Mission on Oilseeds and Oil Palm.",
      "iconName": "CalendarDays",
      "potentialYield": "5-6 tons/ha",
      "recommendation": "Versatile crop with high yield potential. Good for intercropping."
    },
    {
      "name": "Pulses (Gram)",
      "sowingSeason": "Rabi (Oct-Nov)",
      "subsidyInfo": "Promoted under NFSM-Pulses with financial assistance for seeds and inputs.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "1-1.5 tons/ha",
      "recommendation": "Low water requirement, enhances soil nitrogen. Ideal for rotation."
    },
    {
      "name": "Groundnut",
      "sowingSeason": "Kharif & Rabi",
      "subsidyInfo": "MSP available. Support for seeds and mechanization under various schemes.",
      "iconName": "CalendarDays",
      "potentialYield": "1.5-2 tons/ha",
      "recommendation": "Well-drained loamy soil is perfect. Can be grown in two seasons."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "Moderate",
    "score": 65,
    "recommendations": [
      "A geological survey is highly recommended before drilling.",
      "Prioritize rainwater harvesting to recharge groundwater.",
      "Explore drip irrigation schemes to conserve water."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 135.8,
      "P": 27.1,
      "K": 170.5,
      "pH": 6.9,
      "EC": 0.78,
      "OM": 1.95,
      "CaCO3": 4.8,
      "Sand": 52.3,
      "Silt": 31.8,
      "Clay": 21.9,
      "Temperature": 25,
      "Humidity": 62.5,
      "Rainfall": 110.3,
      "Mg": 95.2,
      "Fe": 14.5,
      "Zn": 0.75,
      "Mn": 6.2
    },
    "healthAssessment": {
      "overallQuality": "Good",
      "fertilityScore": 78,
      "strengths": [
        "Good NPK levels",
        "Optimal pH",
        "High organic matter",
        "Good drainage (high sand)"
      ],
      "deficiencies": [
        "No major deficiencies identified."
      ]
    },
    "recommendations": [
      {
        "category": "General",
        "action": "Maintain current practices",
        "details": "Your soil health is good; continue with sustainable farming methods."
      }
    ]
  }
}'::jsonb, '2023-08-18T00:00:00.000Z', NOW()),
('mp-claim-009', '{
  "cropAnalysis": [
    {
      "name": "Cashew",
      "sowingSeason": "Plantation (June-Aug)",
      "subsidyInfo": "Support available from the Directorate of Cashew and Cocoa Development.",
      "iconName": "CalendarDays",
      "potentialYield": "0.8-1 ton/ha",
      "recommendation": "High-value plantation crop well-suited for coastal areas with laterite soil."
    },
    {
      "name": "Coffee",
      "sowingSeason": "Plantation (June-July)",
      "subsidyInfo": "Subsidies and support provided by the Coffee Board of India.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "0.7-1 ton/ha (Arabica)",
      "recommendation": "Requires specific altitude and rainfall. Best for hilly regions."
    },
    {
      "name": "Rubber",
      "sowingSeason": "Plantation (June-July)",
      "subsidyInfo": "Support from the Rubber Board for new planting and replanting.",
      "iconName": "CalendarDays",
      "potentialYield": "1.5-2 tons/ha",
      "recommendation": "Long-term investment. Requires high rainfall and humidity."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "Not Recommended",
    "score": 28,
    "recommendations": [
      "High risk of borewell failure and rapid depletion.",
      "Focus on surface water conservation like ponds and check dams.",
      "Cultivate drought-resistant crops like millets."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 90.1,
      "P": 17.2,
      "K": 110.4,
      "pH": 5.6,
      "EC": 0.45,
      "OM": 1.15,
      "CaCO3": 1.2,
      "Sand": 63.8,
      "Silt": 21.5,
      "Clay": 20.8,
      "Temperature": 25,
      "Humidity": 42.5,
      "Rainfall": 55.1,
      "Mg": 75.1,
      "Fe": 27.5,
      "Zn": 0.55,
      "Mn": 3.5
    },
    "healthAssessment": {
      "overallQuality": "Poor",
      "fertilityScore": 38,
      "strengths": [
        "No major strengths identified."
      ],
      "deficiencies": [
        "Suboptimal NPK levels",
        "Suboptimal pH",
        "Low organic matter"
      ]
    },
    "recommendations": [
      {
        "category": "Nutient Management",
        "action": "Apply Nitrogen-rich fertilizers",
        "details": "Consider adding urea or compost to boost nitrogen levels for leafy growth."
      },
      {
        "category": "Nutrient Management",
        "action": "Incorporate Phosphorus supplements",
        "details": "Use diammonium phosphate (DAP) or rock phosphate to improve root development."
      },
      {
        "category": "Nutrient Management",
        "action": "Enhance Potassium content",
        "details": "Apply muriate of potash (MOP) or wood ash to support flowering and fruiting."
      },
      {
        "category": "pH Correction",
        "action": "Apply liming materials",
        "details": "Add agricultural lime to raise pH and reduce soil acidity."
      },
      {
        "category": "Water Management",
        "action": "Implement water-saving irrigation",
        "details": "Adopt drip irrigation or sprinklers and consider drought-resistant crop varieties."
      }
    ]
  }
}'::jsonb, '2023-09-03T00:00:00.000Z', NOW()),
('mp-claim-010', '{
  "cropAnalysis": [
    {
      "name": "Rice (Paddy)",
      "sowingSeason": "Kharif (June-July)",
      "subsidyInfo": "Eligible for MSP and covered under National Food Security Mission.",
      "iconName": "CalendarDays",
      "potentialYield": "4-5 tons/ha",
      "recommendation": "Ideal for water-rich areas. Use high-yielding varieties for maximum output."
    },
    {
      "name": "Wheat",
      "sowingSeason": "Rabi (Oct-Nov)",
      "subsidyInfo": "High demand crop with strong MSP support. Access to PM-KISAN benefits.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "3-4 tons/ha",
      "recommendation": "Requires well-irrigated land. Good for crop rotation with rice."
    },
    {
      "name": "Sugarcane",
      "sowingSeason": "Annual (Jan-Mar)",
      "subsidyInfo": "Fair and Remunerative Price (FRP) set by government. Subsidies for drip irrigation available.",
      "iconName": "CalendarDays",
      "potentialYield": "80-100 tons/ha",
      "recommendation": "Long-duration, water-intensive crop. Suitable for large holdings."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "High",
    "score": 92,
    "recommendations": [
      "High probability of finding sustainable water source.",
      "Apply for subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY).",
      "Consider multi-crop cycles to maximize land usage."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Aquaculture",
      "description": "High water availability makes fish or prawn farming a viable, high-return business.",
      "iconName": "Waves"
    },
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 172.5,
      "P": 32.1,
      "K": 235.8,
      "pH": 7.4,
      "EC": 0.95,
      "OM": 1.9,
      "CaCO3": 6.8,
      "Sand": 49.1,
      "Silt": 41.5,
      "Clay": 28.9,
      "Temperature": 25,
      "Humidity": 77.2,
      "Rainfall": 185.1,
      "Mg": 112.8,
      "Fe": 18.9,
      "Zn": 0.93,
      "Mn": 6.5
    },
    "healthAssessment": {
      "overallQuality": "Excellent",
      "fertilityScore": 97,
      "strengths": [
        "Good NPK levels",
        "Optimal pH",
        "High organic matter",
        "Good drainage (high sand)"
      ],
      "deficiencies": [
        "No major deficiencies identified."
      ]
    },
    "recommendations": [
      {
        "category": "General",
        "action": "Maintain current practices",
        "details": "Your soil health is good; continue with sustainable farming methods."
      }
    ]
  }
}'::jsonb, '2023-10-25T00:00:00.000Z', NOW()),
('od-claim-001', '{
  "cropAnalysis": [
    {
      "name": "Rice (Paddy)",
      "sowingSeason": "Kharif (June-July)",
      "subsidyInfo": "Eligible for MSP and covered under National Food Security Mission.",
      "iconName": "CalendarDays",
      "potentialYield": "4-5 tons/ha",
      "recommendation": "Ideal for water-rich areas. Use high-yielding varieties for maximum output."
    },
    {
      "name": "Wheat",
      "sowingSeason": "Rabi (Oct-Nov)",
      "subsidyInfo": "High demand crop with strong MSP support. Access to PM-KISAN benefits.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "3-4 tons/ha",
      "recommendation": "Requires well-irrigated land. Good for crop rotation with rice."
    },
    {
      "name": "Sugarcane",
      "sowingSeason": "Annual (Jan-Mar)",
      "subsidyInfo": "Fair and Remunerative Price (FRP) set by government. Subsidies for drip irrigation available.",
      "iconName": "CalendarDays",
      "potentialYield": "80-100 tons/ha",
      "recommendation": "Long-duration, water-intensive crop. Suitable for large holdings."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "High",
    "score": 92,
    "recommendations": [
      "High probability of finding sustainable water source.",
      "Apply for subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY).",
      "Consider multi-crop cycles to maximize land usage."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Aquaculture",
      "description": "High water availability makes fish or prawn farming a viable, high-return business.",
      "iconName": "Waves"
    },
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 168.2,
      "P": 29.8,
      "K": 228.5,
      "pH": 7.1,
      "EC": 0.89,
      "OM": 1.78,
      "CaCO3": 6.3,
      "Sand": 46.5,
      "Silt": 39.8,
      "Clay": 27.8,
      "Temperature": 25,
      "Humidity": 76.1,
      "Rainfall": 178.5,
      "Mg": 109.1,
      "Fe": 18.5,
      "Zn": 0.9,
      "Mn": 6.2
    },
    "healthAssessment": {
      "overallQuality": "Excellent",
      "fertilityScore": 94,
      "strengths": [
        "Good NPK levels",
        "Optimal pH",
        "High organic matter",
        "Good drainage (high sand)"
      ],
      "deficiencies": [
        "No major deficiencies identified."
      ]
    },
    "recommendations": [
      {
        "category": "General",
        "action": "Maintain current practices",
        "details": "Your soil health is good; continue with sustainable farming methods."
      }
    ]
  }
}'::jsonb, '2023-01-20T00:00:00.000Z', NOW()),
('od-claim-002', '{
  "cropAnalysis": [
    {
      "name": "Cashew",
      "sowingSeason": "Plantation (June-Aug)",
      "subsidyInfo": "Support available from the Directorate of Cashew and Cocoa Development.",
      "iconName": "CalendarDays",
      "potentialYield": "0.8-1 ton/ha",
      "recommendation": "High-value plantation crop well-suited for coastal areas with laterite soil."
    },
    {
      "name": "Coffee",
      "sowingSeason": "Plantation (June-July)",
      "subsidyInfo": "Subsidies and support provided by the Coffee Board of India.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "0.7-1 ton/ha (Arabica)",
      "recommendation": "Requires specific altitude and rainfall. Best for hilly regions."
    },
    {
      "name": "Rubber",
      "sowingSeason": "Plantation (June-July)",
      "subsidyInfo": "Support from the Rubber Board for new planting and replanting.",
      "iconName": "CalendarDays",
      "potentialYield": "1.5-2 tons/ha",
      "recommendation": "Long-term investment. Requires high rainfall and humidity."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "Moderate",
    "score": 65,
    "recommendations": [
      "A geological survey is highly recommended before drilling.",
      "Prioritize rainwater harvesting to recharge groundwater.",
      "Explore drip irrigation schemes to conserve water."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 92.5,
      "P": 16.8,
      "K": 105.1,
      "pH": 5.8,
      "EC": 0.47,
      "OM": 1.1,
      "CaCO3": 1.1,
      "Sand": 62.1,
      "Silt": 20.9,
      "Clay": 20.1,
      "Temperature": 25,
      "Humidity": 58.5,
      "Rainfall": 90.2,
      "Mg": 72.5,
      "Fe": 26.8,
      "Zn": 0.53,
      "Mn": 3.2
    },
    "healthAssessment": {
      "overallQuality": "Poor",
      "fertilityScore": 42,
      "strengths": [
        "No major strengths identified."
      ],
      "deficiencies": [
        "Suboptimal NPK levels",
        "Suboptimal pH",
        "Low organic matter"
      ]
    },
    "recommendations": [
      {
        "category": "Nutient Management",
        "action": "Apply Nitrogen-rich fertilizers",
        "details": "Consider adding urea or compost to boost nitrogen levels for leafy growth."
      },
      {
        "category": "Nutrient Management",
        "action": "Incorporate Phosphorus supplements",
        "details": "Use diammonium phosphate (DAP) or rock phosphate to improve root development."
      },
      {
        "category": "Nutrient Management",
        "action": "Enhance Potassium content",
        "details": "Apply muriate of potash (MOP) or wood ash to support flowering and fruiting."
      },
      {
        "category": "pH Correction",
        "action": "Apply liming materials",
        "details": "Add agricultural lime to raise pH and reduce soil acidity."
      }
    ]
  }
}'::jsonb, '2023-02-25T00:00:00.000Z', NOW()),
('od-claim-003', '{
  "cropAnalysis": [
    {
      "name": "Cotton",
      "sowingSeason": "Kharif (May-June)",
      "subsidyInfo": "Covered under the National Food Security Mission (Commercial Crops).",
      "iconName": "CalendarDays",
      "potentialYield": "1.5-2 tons/ha",
      "recommendation": "Requires a long frost-free period. Good drainage is essential."
    },
    {
      "name": "Soybean",
      "sowingSeason": "Kharif (June-July)",
      "subsidyInfo": "Eligible for MSP. Subsidies available for high-yield seeds.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "2-2.5 tons/ha",
      "recommendation": "Nitrogen-fixing crop, improves soil fertility. Intercropping is beneficial."
    },
    {
      "name": "Lentils (Masur)",
      "sowingSeason": "Rabi (Oct-Nov)",
      "subsidyInfo": "Promoted under NFSM-Pulses. Minimum Support Price (MSP) is available.",
      "iconName": "CalendarDays",
      "potentialYield": "1-1.2 tons/ha",
      "recommendation": "Drought-tolerant and suitable for rainfed areas with clay soil."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "High",
    "score": 92,
    "recommendations": [
      "High probability of finding sustainable water source.",
      "Apply for subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY).",
      "Consider multi-crop cycles to maximize land usage."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Aquaculture",
      "description": "High water availability makes fish or prawn farming a viable, high-return business.",
      "iconName": "Waves"
    },
    {
      "name": "Eco-Tourism",
      "description": "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.",
      "iconName": "Globe"
    },
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 118.1,
      "P": 39.5,
      "K": 215.8,
      "pH": 6.9,
      "EC": 0.78,
      "OM": 2.45,
      "CaCO3": 3.9,
      "Sand": 24.5,
      "Silt": 33.8,
      "Clay": 56.2,
      "Temperature": 25,
      "Humidity": 79.1,
      "Rainfall": 182.5,
      "Mg": 138.1,
      "Fe": 24.8,
      "Zn": 0.75,
      "Mn": 5.8
    },
    "healthAssessment": {
      "overallQuality": "Excellent",
      "fertilityScore": 99,
      "strengths": [
        "Good NPK levels",
        "Optimal pH",
        "High organic matter",
        "Good water retention (high clay)"
      ],
      "deficiencies": [
        "No major deficiencies identified."
      ]
    },
    "recommendations": [
      {
        "category": "General",
        "action": "Maintain current practices",
        "details": "Your soil health is good; continue with sustainable farming methods."
      }
    ]
  }
}'::jsonb, '2023-03-15T00:00:00.000Z', NOW()),
('od-claim-004', '{
  "cropAnalysis": [
    {
      "name": "Maize",
      "sowingSeason": "Kharif (June-July)",
      "subsidyInfo": "Subsidies available under the National Mission on Oilseeds and Oil Palm.",
      "iconName": "CalendarDays",
      "potentialYield": "5-6 tons/ha",
      "recommendation": "Versatile crop with high yield potential. Good for intercropping."
    },
    {
      "name": "Pulses (Gram)",
      "sowingSeason": "Rabi (Oct-Nov)",
      "subsidyInfo": "Promoted under NFSM-Pulses with financial assistance for seeds and inputs.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "1-1.5 tons/ha",
      "recommendation": "Low water requirement, enhances soil nitrogen. Ideal for rotation."
    },
    {
      "name": "Groundnut",
      "sowingSeason": "Kharif & Rabi",
      "subsidyInfo": "MSP available. Support for seeds and mechanization under various schemes.",
      "iconName": "CalendarDays",
      "potentialYield": "1.5-2 tons/ha",
      "recommendation": "Well-drained loamy soil is perfect. Can be grown in two seasons."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "Not Recommended",
    "score": 28,
    "recommendations": [
      "High risk of borewell failure and rapid depletion.",
      "Focus on surface water conservation like ponds and check dams.",
      "Cultivate drought-resistant crops like millets."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 125.1,
      "P": 22.5,
      "K": 160.1,
      "pH": 6.7,
      "EC": 0.72,
      "OM": 1.9,
      "CaCO3": 4.5,
      "Sand": 53.8,
      "Silt": 32.1,
      "Clay": 21.5,
      "Temperature": 25,
      "Humidity": 45.8,
      "Rainfall": 68.2,
      "Mg": 92.1,
      "Fe": 13.8,
      "Zn": 0.7,
      "Mn": 6.5
    },
    "healthAssessment": {
      "overallQuality": "Moderate",
      "fertilityScore": 55,
      "strengths": [
        "Optimal pH",
        "High organic matter",
        "Good drainage (high sand)"
      ],
      "deficiencies": [
        "Suboptimal NPK levels"
      ]
    },
    "recommendations": [
      {
        "category": "Nutient Management",
        "action": "Apply Nitrogen-rich fertilizers",
        "details": "Consider adding urea or compost to boost nitrogen levels for leafy growth."
      },
      {
        "category": "Nutrient Management",
        "action": "Incorporate Phosphorus supplements",
        "details": "Use diammonium phosphate (DAP) or rock phosphate to improve root development."
      },
      {
        "category": "Water Management",
        "action": "Implement water-saving irrigation",
        "details": "Adopt drip irrigation or sprinklers and consider drought-resistant crop varieties."
      }
    ]
  }
}'::jsonb, '2023-04-05T00:00:00.000Z', NOW()),
('od-claim-005', '{
  "cropAnalysis": [
    {
      "name": "Rice (Paddy)",
      "sowingSeason": "Kharif (June-July)",
      "subsidyInfo": "Eligible for MSP and covered under National Food Security Mission.",
      "iconName": "CalendarDays",
      "potentialYield": "4-5 tons/ha",
      "recommendation": "Ideal for water-rich areas. Use high-yielding varieties for maximum output."
    },
    {
      "name": "Wheat",
      "sowingSeason": "Rabi (Oct-Nov)",
      "subsidyInfo": "High demand crop with strong MSP support. Access to PM-KISAN benefits.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "3-4 tons/ha",
      "recommendation": "Requires well-irrigated land. Good for crop rotation with rice."
    },
    {
      "name": "Sugarcane",
      "sowingSeason": "Annual (Jan-Mar)",
      "subsidyInfo": "Fair and Remunerative Price (FRP) set by government. Subsidies for drip irrigation available.",
      "iconName": "CalendarDays",
      "potentialYield": "80-100 tons/ha",
      "recommendation": "Long-duration, water-intensive crop. Suitable for large holdings."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "Moderate",
    "score": 65,
    "recommendations": [
      "A geological survey is highly recommended before drilling.",
      "Prioritize rainwater harvesting to recharge groundwater.",
      "Explore drip irrigation schemes to conserve water."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 162.1,
      "P": 31.5,
      "K": 222.8,
      "pH": 7.3,
      "EC": 0.91,
      "OM": 1.85,
      "CaCO3": 6.6,
      "Sand": 48.1,
      "Silt": 40.5,
      "Clay": 27.1,
      "Temperature": 25,
      "Humidity": 69.5,
      "Rainfall": 135.8,
      "Mg": 110.1,
      "Fe": 19.5,
      "Zn": 0.92,
      "Mn": 6.6
    },
    "healthAssessment": {
      "overallQuality": "Excellent",
      "fertilityScore": 95,
      "strengths": [
        "Good NPK levels",
        "Optimal pH",
        "High organic matter",
        "Good drainage (high sand)"
      ],
      "deficiencies": [
        "No major deficiencies identified."
      ]
    },
    "recommendations": [
      {
        "category": "General",
        "action": "Maintain current practices",
        "details": "Your soil health is good; continue with sustainable farming methods."
      }
    ]
  }
}'::jsonb, '2023-05-10T00:00:00.000Z', NOW()),
('od-claim-006', '{
  "cropAnalysis": [
    {
      "name": "Cashew",
      "sowingSeason": "Plantation (June-Aug)",
      "subsidyInfo": "Support available from the Directorate of Cashew and Cocoa Development.",
      "iconName": "CalendarDays",
      "potentialYield": "0.8-1 ton/ha",
      "recommendation": "High-value plantation crop well-suited for coastal areas with laterite soil."
    },
    {
      "name": "Coffee",
      "sowingSeason": "Plantation (June-July)",
      "subsidyInfo": "Subsidies and support provided by the Coffee Board of India.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "0.7-1 ton/ha (Arabica)",
      "recommendation": "Requires specific altitude and rainfall. Best for hilly regions."
    },
    {
      "name": "Rubber",
      "sowingSeason": "Plantation (June-July)",
      "subsidyInfo": "Support from the Rubber Board for new planting and replanting.",
      "iconName": "CalendarDays",
      "potentialYield": "1.5-2 tons/ha",
      "recommendation": "Long-term investment. Requires high rainfall and humidity."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "High",
    "score": 92,
    "recommendations": [
      "High probability of finding sustainable water source.",
      "Apply for subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY).",
      "Consider multi-crop cycles to maximize land usage."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Aquaculture",
      "description": "High water availability makes fish or prawn farming a viable, high-return business.",
      "iconName": "Waves"
    },
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 98.1,
      "P": 19.5,
      "K": 125.8,
      "pH": 5.9,
      "EC": 0.49,
      "OM": 1.3,
      "CaCO3": 1.4,
      "Sand": 65.1,
      "Silt": 22.8,
      "Clay": 21.9,
      "Temperature": 25,
      "Humidity": 72.5,
      "Rainfall": 155.1,
      "Mg": 80.1,
      "Fe": 29.1,
      "Zn": 0.58,
      "Mn": 3.9
    },
    "healthAssessment": {
      "overallQuality": "Good",
      "fertilityScore": 70,
      "strengths": [
        "Optimal pH",
        "Good drainage (high sand)"
      ],
      "deficiencies": [
        "Suboptimal NPK levels",
        "Low organic matter"
      ]
    },
    "recommendations": [
      {
        "category": "Nutient Management",
        "action": "Apply Nitrogen-rich fertilizers",
        "details": "Consider adding urea or compost to boost nitrogen levels for leafy growth."
      },
      {
        "category": "Nutrient Management",
        "action": "Incorporate Phosphorus supplements",
        "details": "Use diammonium phosphate (DAP) or rock phosphate to improve root development."
      },
      {
        "category": "Nutrient Management",
        "action": "Enhance Potassium content",
        "details": "Apply muriate of potash (MOP) or wood ash to support flowering and fruiting."
      }
    ]
  }
}'::jsonb, '2023-06-17T00:00:00.000Z', NOW()),
('od-claim-007', '{
  "cropAnalysis": [
    {
      "name": "Cotton",
      "sowingSeason": "Kharif (May-June)",
      "subsidyInfo": "Covered under the National Food Security Mission (Commercial Crops).",
      "iconName": "CalendarDays",
      "potentialYield": "1.5-2 tons/ha",
      "recommendation": "Requires a long frost-free period. Good drainage is essential."
    },
    {
      "name": "Soybean",
      "sowingSeason": "Kharif (June-July)",
      "subsidyInfo": "Eligible for MSP. Subsidies available for high-yield seeds.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "2-2.5 tons/ha",
      "recommendation": "Nitrogen-fixing crop, improves soil fertility. Intercropping is beneficial."
    },
    {
      "name": "Lentils (Masur)",
      "sowingSeason": "Rabi (Oct-Nov)",
      "subsidyInfo": "Promoted under NFSM-Pulses. Minimum Support Price (MSP) is available.",
      "iconName": "CalendarDays",
      "potentialYield": "1-1.2 tons/ha",
      "recommendation": "Drought-tolerant and suitable for rainfed areas with clay soil."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "Moderate",
    "score": 65,
    "recommendations": [
      "A geological survey is highly recommended before drilling.",
      "Prioritize rainwater harvesting to recharge groundwater.",
      "Explore drip irrigation schemes to conserve water."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 110.5,
      "P": 37.1,
      "K": 205.1,
      "pH": 6.8,
      "EC": 0.73,
      "OM": 2.35,
      "CaCO3": 3.7,
      "Sand": 24.1,
      "Silt": 33.5,
      "Clay": 54.8,
      "Temperature": 25,
      "Humidity": 65.1,
      "Rainfall": 120.5,
      "Mg": 130.1,
      "Fe": 23.1,
      "Zn": 0.7,
      "Mn": 5.2
    },
    "healthAssessment": {
      "overallQuality": "Good",
      "fertilityScore": 79,
      "strengths": [
        "Good NPK levels",
        "Optimal pH",
        "High organic matter",
        "Good water retention (high clay)"
      ],
      "deficiencies": [
        "No major deficiencies identified."
      ]
    },
    "recommendations": [
      {
        "category": "General",
        "action": "Maintain current practices",
        "details": "Your soil health is good; continue with sustainable farming methods."
      }
    ]
  }
}'::jsonb, '2023-07-06T00:00:00.000Z', NOW()),
('od-claim-008', '{
  "cropAnalysis": [
    {
      "name": "Cashew",
      "sowingSeason": "Plantation (June-Aug)",
      "subsidyInfo": "Support available from the Directorate of Cashew and Cocoa Development.",
      "iconName": "CalendarDays",
      "potentialYield": "0.8-1 ton/ha",
      "recommendation": "High-value plantation crop well-suited for coastal areas with laterite soil."
    },
    {
      "name": "Coffee",
      "sowingSeason": "Plantation (June-July)",
      "subsidyInfo": "Subsidies and support provided by the Coffee Board of India.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "0.7-1 ton/ha (Arabica)",
      "recommendation": "Requires specific altitude and rainfall. Best for hilly regions."
    },
    {
      "name": "Rubber",
      "sowingSeason": "Plantation (June-July)",
      "subsidyInfo": "Support from the Rubber Board for new planting and replanting.",
      "iconName": "CalendarDays",
      "potentialYield": "1.5-2 tons/ha",
      "recommendation": "Long-term investment. Requires high rainfall and humidity."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "Not Recommended",
    "score": 28,
    "recommendations": [
      "High risk of borewell failure and rapid depletion.",
      "Focus on surface water conservation like ponds and check dams.",
      "Cultivate drought-resistant crops like millets."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 88.5,
      "P": 16.1,
      "K": 102.5,
      "pH": 5.7,
      "EC": 0.46,
      "OM": 1.05,
      "CaCO3": 1.0,
      "Sand": 61.5,
      "Silt": 20.5,
      "Clay": 19.8,
      "Temperature": 25,
      "Humidity": 41.8,
      "Rainfall": 52.5,
      "Mg": 70.5,
      "Fe": 26.1,
      "Zn": 0.52,
      "Mn": 3.1
    },
    "healthAssessment": {
      "overallQuality": "Poor",
      "fertilityScore": 32,
      "strengths": [
        "No major strengths identified."
      ],
      "deficiencies": [
        "Suboptimal NPK levels",
        "Suboptimal pH",
        "Low organic matter"
      ]
    },
    "recommendations": [
      {
        "category": "Nutient Management",
        "action": "Apply Nitrogen-rich fertilizers",
        "details": "Consider adding urea or compost to boost nitrogen levels for leafy growth."
      },
      {
        "category": "Nutrient Management",
        "action": "Incorporate Phosphorus supplements",
        "details": "Use diammonium phosphate (DAP) or rock phosphate to improve root development."
      },
      {
        "category": "Nutrient Management",
        "action": "Enhance Potassium content",
        "details": "Apply muriate of potash (MOP) or wood ash to support flowering and fruiting."
      },
      {
        "category": "pH Correction",
        "action": "Apply liming materials",
        "details": "Add agricultural lime to raise pH and reduce soil acidity."
      },
      {
        "category": "Water Management",
        "action": "Implement water-saving irrigation",
        "details": "Adopt drip irrigation or sprinklers and consider drought-resistant crop varieties."
      }
    ]
  }
}'::jsonb, '2023-08-23T00:00:00.000Z', NOW()),
('od-claim-009', '{
  "cropAnalysis": [
    {
      "name": "Rice (Paddy)",
      "sowingSeason": "Kharif (June-July)",
      "subsidyInfo": "Eligible for MSP and covered under National Food Security Mission.",
      "iconName": "CalendarDays",
      "potentialYield": "4-5 tons/ha",
      "recommendation": "Ideal for water-rich areas. Use high-yielding varieties for maximum output."
    },
    {
      "name": "Wheat",
      "sowingSeason": "Rabi (Oct-Nov)",
      "subsidyInfo": "High demand crop with strong MSP support. Access to PM-KISAN benefits.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "3-4 tons/ha",
      "recommendation": "Requires well-irrigated land. Good for crop rotation with rice."
    },
    {
      "name": "Sugarcane",
      "sowingSeason": "Annual (Jan-Mar)",
      "subsidyInfo": "Fair and Remunerative Price (FRP) set by government. Subsidies for drip irrigation available.",
      "iconName": "CalendarDays",
      "potentialYield": "80-100 tons/ha",
      "recommendation": "Long-duration, water-intensive crop. Suitable for large holdings."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "High",
    "score": 92,
    "recommendations": [
      "High probability of finding sustainable water source.",
      "Apply for subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY).",
      "Consider multi-crop cycles to maximize land usage."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Aquaculture",
      "description": "High water availability makes fish or prawn farming a viable, high-return business.",
      "iconName": "Waves"
    },
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 170.1,
      "P": 30.5,
      "K": 230.1,
      "pH": 7.2,
      "EC": 0.9,
      "OM": 1.8,
      "CaCO3": 6.4,
      "Sand": 47.1,
      "Silt": 40.8,
      "Clay": 28.5,
      "Temperature": 25,
      "Humidity": 76.8,
      "Rainfall": 180.1,
      "Mg": 111.5,
      "Fe": 19.1,
      "Zn": 0.91,
      "Mn": 6.3
    },
    "healthAssessment": {
      "overallQuality": "Excellent",
      "fertilityScore": 96,
      "strengths": [
        "Good NPK levels",
        "Optimal pH",
        "High organic matter",
        "Good drainage (high sand)"
      ],
      "deficiencies": [
        "No major deficiencies identified."
      ]
    },
    "recommendations": [
      {
        "category": "General",
        "action": "Maintain current practices",
        "details": "Your soil health is good; continue with sustainable farming methods."
      }
    ]
  }
}'::jsonb, '2023-09-08T00:00:00.000Z', NOW()),
('od-claim-010', '{
  "cropAnalysis": [
    {
      "name": "Maize",
      "sowingSeason": "Kharif (June-July)",
      "subsidyInfo": "Subsidies available under the National Mission on Oilseeds and Oil Palm.",
      "iconName": "CalendarDays",
      "potentialYield": "5-6 tons/ha",
      "recommendation": "Versatile crop with high yield potential. Good for intercropping."
    },
    {
      "name": "Pulses (Gram)",
      "sowingSeason": "Rabi (Oct-Nov)",
      "subsidyInfo": "Promoted under NFSM-Pulses with financial assistance for seeds and inputs.",
      "iconName": "BadgeIndianRupee",
      "potentialYield": "1-1.5 tons/ha",
      "recommendation": "Low water requirement, enhances soil nitrogen. Ideal for rotation."
    },
    {
      "name": "Groundnut",
      "sowingSeason": "Kharif & Rabi",
      "subsidyInfo": "MSP available. Support for seeds and mechanization under various schemes.",
      "iconName": "CalendarDays",
      "potentialYield": "1.5-2 tons/ha",
      "recommendation": "Well-drained loamy soil is perfect. Can be grown in two seasons."
    }
  ],
  "waterAnalysis": {
    "borewellSuitability": "Moderate",
    "score": 65,
    "recommendations": [
      "A geological survey is highly recommended before drilling.",
      "Prioritize rainwater harvesting to recharge groundwater.",
      "Explore drip irrigation schemes to conserve water."
    ]
  },
  "economicOpportunities": [
    {
      "name": "Non-Timber Forest Products",
      "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.",
      "iconName": "Briefcase"
    },
    {
      "name": "Carbon Credits",
      "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.",
      "iconName": "DollarSign"
    }
  ],
  "soilAnalysis": {
    "parameters": {
      "N": 130.5,
      "P": 26.5,
      "K": 165.1,
      "pH": 6.9,
      "EC": 0.75,
      "OM": 1.8,
      "CaCO3": 4.7,
      "Sand": 51.5,
      "Silt": 31.5,
      "Clay": 20.8,
      "Temperature": 25,
      "Humidity": 61.8,
      "Rainfall": 105.1,
      "Mg": 90.5,
      "Fe": 14.1,
      "Zn": 0.72,
      "Mn": 6.1
    },
    "healthAssessment": {
      "overallQuality": "Good",
      "fertilityScore": 75,
      "strengths": [
        "Good NPK levels",
        "Optimal pH",
        "High organic matter",
        "Good drainage (high sand)"
      ],
      "deficiencies": [
        "No major deficiencies identified."
      ]
    },
    "recommendations": [
      {
        "category": "General",
        "action": "Maintain current practices",
        "details": "Your soil health is good; continue with sustainable farming methods."
      }
    ]
  }
}'::jsonb, '2023-10-30T00:00:00.000Z', NOW());