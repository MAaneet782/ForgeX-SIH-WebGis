INSERT INTO public.ai_analysis_results (claim_id, analysis_data, created_at, updated_at)
VALUES
('C-MP-001', '{
    "cropAnalysis": [
        { "name": "Maize", "sowingSeason": "Kharif (June-July)", "subsidyInfo": "Subsidies available under the National Mission on Oilseeds and Oil Palm.", "iconName": "CalendarDays", "potentialYield": "5-6 tons/ha", "recommendation": "Versatile crop with high yield potential. Good for intercropping." },
        { "name": "Pulses (Gram)", "sowingSeason": "Rabi (Oct-Nov)", "subsidyInfo": "Promoted under NFSM-Pulses with financial assistance for seeds and inputs.", "iconName": "BadgeIndianRupee", "potentialYield": "1-1.5 tons/ha", "recommendation": "Low water requirement, enhances soil nitrogen. Ideal for rotation." },
        { "name": "Groundnut", "sowingSeason": "Kharif & Rabi", "subsidyInfo": "MSP available. Support for seeds and mechanization under various schemes.", "iconName": "CalendarDays", "potentialYield": "1.5-2 tons/ha", "recommendation": "Well-drained loamy soil is perfect. Can be grown in two seasons." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Excellent", "score": 92,
        "recommendations": ["High probability of finding sustainable water source.", "Apply for subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY).", "Consider multi-crop cycles to maximize land usage."]
    },
    "economicOpportunities": [
        { "name": "Aquaculture", "description": "High water availability makes fish or prawn farming a viable, high-return business.", "iconName": "Waves" },
        { "name": "Eco-Tourism", "description": "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.", "iconName": "Globe" },
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 180.5, "P": 30.2, "K": 230.1, "pH": 7.2, "EC": 0.95, "OM": 1.8, "CaCO3": 6.1, "Sand": 45.3, "Silt": 38.7, "Clay": 27.1, "Temperature": 25.0, "Humidity": 75.5, "Rainfall": 175.2, "Mg": 110.8, "Fe": 18.5, "Zn": 0.9, "Mn": 6.2 },
        "healthAssessment": { "overallQuality": "Excellent", "fertilityScore": 95, "strengths": ["Good NPK levels", "Optimal pH", "High organic matter", "Good drainage (high sand)"], "deficiencies": ["No major deficiencies identified."] },
        "recommendations": [{ "category": "General", "action": "Maintain current practices", "details": "Your soil health is good; continue with sustainable farming methods." }]
    }
}', NOW(), NOW()),
('C-MP-002', '{
    "cropAnalysis": [
        { "name": "Rice (Paddy)", "sowingSeason": "Kharif (June-July)", "subsidyInfo": "Eligible for MSP and covered under National Food Security Mission.", "iconName": "CalendarDays", "potentialYield": "4-5 tons/ha", "recommendation": "Ideal for water-rich areas. Use high-yielding varieties for maximum output." },
        { "name": "Wheat", "sowingSeason": "Rabi (Oct-Nov)", "subsidyInfo": "High demand crop with strong MSP support. Access to PM-KISAN benefits.", "iconName": "BadgeIndianRupee", "potentialYield": "3-4 tons/ha", "recommendation": "Requires well-irrigated land. Good for crop rotation with rice." },
        { "name": "Sugarcane", "sowingSeason": "Annual (Jan-Mar)", "subsidyInfo": "Fair and Remunerative Price (FRP) set by government. Subsidies for drip irrigation available.", "iconName": "CalendarDays", "potentialYield": "80-100 tons/ha", "recommendation": "Long-duration, water-intensive crop. Suitable for large holdings." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Moderate", "score": 65,
        "recommendations": ["A geological survey is highly recommended before drilling.", "Prioritize rainwater harvesting to recharge groundwater.", "Explore drip irrigation schemes to conserve water."]
    },
    "economicOpportunities": [
        { "name": "Eco-Tourism", "description": "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.", "iconName": "Globe" },
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 170.1, "P": 28.5, "K": 210.3, "pH": 7.1, "EC": 0.88, "OM": 1.6, "CaCO3": 5.5, "Sand": 42.1, "Silt": 36.5, "Clay": 26.8, "Temperature": 25.0, "Humidity": 65.0, "Rainfall": 100.0, "Mg": 105.0, "Fe": 16.7, "Zn": 0.85, "Mn": 5.8 },
        "healthAssessment": { "overallQuality": "Good", "fertilityScore": 78, "strengths": ["Good NPK levels", "Optimal pH", "High organic matter", "Good water retention (high clay)"], "deficiencies": ["No major deficiencies identified."] },
        "recommendations": [{ "category": "General", "action": "Maintain current practices", "details": "Your soil health is good; continue with sustainable farming methods." }]
    }
}', NOW(), NOW()),
('C-MP-003', '{
    "cropAnalysis": [
        { "name": "Cashew", "sowingSeason": "Plantation (June-Aug)", "subsidyInfo": "Support available from the Directorate of Cashew and Cocoa Development.", "iconName": "CalendarDays", "potentialYield": "0.8-1 ton/ha", "recommendation": "High-value plantation crop well-suited for coastal areas with laterite soil." },
        { "name": "Coffee", "sowingSeason": "Plantation (June-July)", "subsidyInfo": "Subsidies and support provided by the Coffee Board of India.", "iconName": "BadgeIndianRupee", "potentialYield": "0.7-1 ton/ha (Arabica)", "recommendation": "Requires specific altitude and rainfall. Best for hilly regions." },
        { "name": "Rubber", "sowingSeason": "Plantation (June-July)", "subsidyInfo": "Support from the Rubber Board for new planting and replanting.", "iconName": "CalendarDays", "potentialYield": "1.5-2 tons/ha", "recommendation": "Long-term investment. Requires high rainfall and humidity." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Not Recommended", "score": 28,
        "recommendations": ["High risk of borewell failure and rapid depletion.", "Focus on surface water conservation like ponds and check dams.", "Cultivate drought-resistant crops like millets."]
    },
    "economicOpportunities": [
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 95.1, "P": 18.2, "K": 115.3, "pH": 5.7, "EC": 0.45, "OM": 1.1, "CaCO3": 1.2, "Sand": 65.3, "Silt": 22.7, "Clay": 18.1, "Temperature": 25.0, "Humidity": 45.5, "Rainfall": 60.2, "Mg": 75.8, "Fe": 28.5, "Zn": 0.55, "Mn": 3.2 },
        "healthAssessment": { "overallQuality": "Poor", "fertilityScore": 35, "strengths": ["Good drainage (high sand)"], "deficiencies": ["Suboptimal NPK levels", "Suboptimal pH", "Low organic matter"] },
        "recommendations": [{ "category": "Nutient Management", "action": "Apply Nitrogen-rich fertilizers", "details": "Consider adding urea or compost to boost nitrogen levels for leafy growth." }, { "category": "Nutrient Management", "action": "Incorporate Phosphorus supplements", "details": "Use diammonium phosphate (DAP) or rock phosphate to improve root development." }, { "category": "Nutrient Management", "action": "Enhance Potassium content", "details": "Apply muriate of potash (MOP) or wood ash to support flowering and fruiting." }, { "category": "pH Correction", "action": "Apply liming materials", "details": "Add agricultural lime to raise pH and reduce soil acidity." }, { "category": "Water Management", "action": "Implement water-saving irrigation", "details": "Adopt drip irrigation or sprinklers and consider drought-resistant crop varieties." }]
    }
}', NOW(), NOW()),
('C-MP-004', '{
    "cropAnalysis": [
        { "name": "Cotton", "sowingSeason": "Kharif (May-June)", "subsidyInfo": "Covered under the National Food Security Mission (Commercial Crops).", "iconName": "CalendarDays", "potentialYield": "1.5-2 tons/ha", "recommendation": "Requires a long frost-free period. Good drainage is essential." },
        { "name": "Soybean", "sowingSeason": "Kharif (June-July)", "subsidyInfo": "Eligible for MSP. Subsidies available for high-yield seeds.", "iconName": "BadgeIndianRupee", "potentialYield": "2-2.5 tons/ha", "recommendation": "Nitrogen-fixing crop, improves soil fertility. Intercropping is beneficial." },
        { "name": "Lentils (Masur)", "sowingSeason": "Rabi (Oct-Nov)", "subsidyInfo": "Promoted under NFSM-Pulses. Minimum Support Price (MSP) is available.", "iconName": "CalendarDays", "potentialYield": "1-1.2 tons/ha", "recommendation": "Drought-tolerant and suitable for rainfed areas with clay soil." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Excellent", "score": 92,
        "recommendations": ["High probability of finding sustainable water source.", "Apply for subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY).", "Consider multi-crop cycles to maximize land usage."]
    },
    "economicOpportunities": [
        { "name": "Aquaculture", "description": "High water availability makes fish or prawn farming a viable, high-return business.", "iconName": "Waves" },
        { "name": "Eco-Tourism", "description": "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.", "iconName": "Globe" },
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 120.1, "P": 35.2, "K": 200.3, "pH": 6.7, "EC": 0.75, "OM": 2.3, "CaCO3": 3.5, "Sand": 22.3, "Silt": 32.7, "Clay": 55.1, "Temperature": 25.0, "Humidity": 75.5, "Rainfall": 175.2, "Mg": 130.8, "Fe": 22.5, "Zn": 0.7, "Mn": 4.2 },
        "healthAssessment": { "overallQuality": "Excellent", "fertilityScore": 90, "strengths": ["Good NPK levels", "Optimal pH", "High organic matter", "Good water retention (high clay)"], "deficiencies": ["No major deficiencies identified."] },
        "recommendations": [{ "category": "General", "action": "Maintain current practices", "details": "Your soil health is good; continue with sustainable farming methods." }]
    }
}', NOW(), NOW()),
('C-MP-005', '{
    "cropAnalysis": [
        { "name": "Rice (Paddy)", "sowingSeason": "Kharif (June-July)", "subsidyInfo": "Eligible for MSP and covered under National Food Security Mission.", "iconName": "CalendarDays", "potentialYield": "4-5 tons/ha", "recommendation": "Ideal for water-rich areas. Use high-yielding varieties for maximum output." },
        { "name": "Wheat", "sowingSeason": "Rabi (Oct-Nov)", "subsidyInfo": "High demand crop with strong MSP support. Access to PM-KISAN benefits.", "iconName": "BadgeIndianRupee", "potentialYield": "3-4 tons/ha", "recommendation": "Requires well-irrigated land. Good for crop rotation with rice." },
        { "name": "Sugarcane", "sowingSeason": "Annual (Jan-Mar)", "subsidyInfo": "Fair and Remunerative Price (FRP) set by government. Subsidies for drip irrigation available.", "iconName": "CalendarDays", "potentialYield": "80-100 tons/ha", "recommendation": "Long-duration, water-intensive crop. Suitable for large holdings." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Moderate", "score": 65,
        "recommendations": ["A geological survey is highly recommended before drilling.", "Prioritize rainwater harvesting to recharge groundwater.", "Explore drip irrigation schemes to conserve water."]
    },
    "economicOpportunities": [
        { "name": "Eco-Tourism", "description": "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.", "iconName": "Globe" },
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 170.1, "P": 28.5, "K": 210.3, "pH": 7.1, "EC": 0.88, "OM": 1.6, "CaCO3": 5.5, "Sand": 42.1, "Silt": 36.5, "Clay": 26.8, "Temperature": 25.0, "Humidity": 65.0, "Rainfall": 100.0, "Mg": 105.0, "Fe": 16.7, "Zn": 0.85, "Mn": 5.8 },
        "healthAssessment": { "overallQuality": "Good", "fertilityScore": 78, "strengths": ["Good NPK levels", "Optimal pH", "High organic matter", "Good water retention (high clay)"], "deficiencies": ["No major deficiencies identified."] },
        "recommendations": [{ "category": "General", "action": "Maintain current practices", "details": "Your soil health is good; continue with sustainable farming methods." }]
    }
}', NOW(), NOW()),
('C-MP-006', '{
    "cropAnalysis": [
        { "name": "Maize", "sowingSeason": "Kharif (June-July)", "subsidyInfo": "Subsidies available under the National Mission on Oilseeds and Oil Palm.", "iconName": "CalendarDays", "potentialYield": "5-6 tons/ha", "recommendation": "Versatile crop with high yield potential. Good for intercropping." },
        { "name": "Pulses (Gram)", "sowingSeason": "Rabi (Oct-Nov)", "subsidyInfo": "Promoted under NFSM-Pulses with financial assistance for seeds and inputs.", "iconName": "BadgeIndianRupee", "potentialYield": "1-1.5 tons/ha", "recommendation": "Low water requirement, enhances soil nitrogen. Ideal for rotation." },
        { "name": "Groundnut", "sowingSeason": "Kharif & Rabi", "subsidyInfo": "MSP available. Support for seeds and mechanization under various schemes.", "iconName": "CalendarDays", "potentialYield": "1.5-2 tons/ha", "recommendation": "Well-drained loamy soil is perfect. Can be grown in two seasons." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Excellent", "score": 92,
        "recommendations": ["High probability of finding sustainable water source.", "Apply for subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY).", "Consider multi-crop cycles to maximize land usage."]
    },
    "economicOpportunities": [
        { "name": "Aquaculture", "description": "High water availability makes fish or prawn farming a viable, high-return business.", "iconName": "Waves" },
        { "name": "Eco-Tourism", "description": "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.", "iconName": "Globe" },
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 180.5, "P": 30.2, "K": 230.1, "pH": 7.2, "EC": 0.95, "OM": 1.8, "CaCO3": 6.1, "Sand": 45.3, "Silt": 38.7, "Clay": 27.1, "Temperature": 25.0, "Humidity": 75.5, "Rainfall": 175.2, "Mg": 110.8, "Fe": 18.5, "Zn": 0.9, "Mn": 6.2 },
        "healthAssessment": { "overallQuality": "Excellent", "fertilityScore": 95, "strengths": ["Good NPK levels", "Optimal pH", "High organic matter", "Good drainage (high sand)"], "deficiencies": ["No major deficiencies identified."] },
        "recommendations": [{ "category": "General", "action": "Maintain current practices", "details": "Your soil health is good; continue with sustainable farming methods." }]
    }
}', NOW(), NOW()),
('C-MP-007', '{
    "cropAnalysis": [
        { "name": "Cotton", "sowingSeason": "Kharif (May-June)", "subsidyInfo": "Covered under the National Food Security Mission (Commercial Crops).", "iconName": "CalendarDays", "potentialYield": "1.5-2 tons/ha", "recommendation": "Requires a long frost-free period. Good drainage is essential." },
        { "name": "Soybean", "sowingSeason": "Kharif (June-July)", "subsidyInfo": "Eligible for MSP. Subsidies available for high-yield seeds.", "iconName": "BadgeIndianRupee", "potentialYield": "2-2.5 tons/ha", "recommendation": "Nitrogen-fixing crop, improves soil fertility. Intercropping is beneficial." },
        { "name": "Lentils (Masur)", "sowingSeason": "Rabi (Oct-Nov)", "subsidyInfo": "Promoted under NFSM-Pulses. Minimum Support Price (MSP) is available.", "iconName": "CalendarDays", "potentialYield": "1-1.2 tons/ha", "recommendation": "Drought-tolerant and suitable for rainfed areas with clay soil." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Not Recommended", "score": 28,
        "recommendations": ["High risk of borewell failure and rapid depletion.", "Focus on surface water conservation like ponds and check dams.", "Cultivate drought-resistant crops like millets."]
    },
    "economicOpportunities": [
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 120.1, "P": 35.2, "K": 200.3, "pH": 6.7, "EC": 0.75, "OM": 2.3, "CaCO3": 3.5, "Sand": 22.3, "Silt": 32.7, "Clay": 55.1, "Temperature": 25.0, "Humidity": 45.5, "Rainfall": 60.2, "Mg": 130.8, "Fe": 22.5, "Zn": 0.7, "Mn": 4.2 },
        "healthAssessment": { "overallQuality": "Poor", "fertilityScore": 35, "strengths": ["Good water retention (high clay)"], "deficiencies": ["Suboptimal NPK levels", "Suboptimal pH", "Low organic matter"] },
        "recommendations": [{ "category": "Nutient Management", "action": "Apply Nitrogen-rich fertilizers", "details": "Consider adding urea or compost to boost nitrogen levels for leafy growth." }, { "category": "Nutrient Management", "action": "Incorporate Phosphorus supplements", "details": "Use diammonium phosphate (DAP) or rock phosphate to improve root development." }, { "category": "Nutrient Management", "action": "Enhance Potassium content", "details": "Apply muriate of potash (MOP) or wood ash to support flowering and fruiting." }, { "category": "pH Correction", "action": "Apply liming materials", "details": "Add agricultural lime to raise pH and reduce soil acidity." }, { "category": "Water Management", "action": "Implement water-saving irrigation", "details": "Adopt drip irrigation or sprinklers and consider drought-resistant crop varieties." }]
    }
}', NOW(), NOW()),
('C-MP-008', '{
    "cropAnalysis": [
        { "name": "Maize", "sowingSeason": "Kharif (June-July)", "subsidyInfo": "Subsidies available under the National Mission on Oilseeds and Oil Palm.", "iconName": "CalendarDays", "potentialYield": "5-6 tons/ha", "recommendation": "Versatile crop with high yield potential. Good for intercropping." },
        { "name": "Pulses (Gram)", "sowingSeason": "Rabi (Oct-Nov)", "subsidyInfo": "Promoted under NFSM-Pulses with financial assistance for seeds and inputs.", "iconName": "BadgeIndianRupee", "potentialYield": "1-1.5 tons/ha", "recommendation": "Low water requirement, enhances soil nitrogen. Ideal for rotation." },
        { "name": "Groundnut", "sowingSeason": "Kharif & Rabi", "subsidyInfo": "MSP available. Support for seeds and mechanization under various schemes.", "iconName": "CalendarDays", "potentialYield": "1.5-2 tons/ha", "recommendation": "Well-drained loamy soil is perfect. Can be grown in two seasons." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Moderate", "score": 65,
        "recommendations": ["A geological survey is highly recommended before drilling.", "Prioritize rainwater harvesting to recharge groundwater.", "Explore drip irrigation schemes to conserve water."]
    },
    "economicOpportunities": [
        { "name": "Eco-Tourism", "description": "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.", "iconName": "Globe" },
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 170.1, "P": 28.5, "K": 210.3, "pH": 7.1, "EC": 0.88, "OM": 1.6, "CaCO3": 5.5, "Sand": 42.1, "Silt": 36.5, "Clay": 26.8, "Temperature": 25.0, "Humidity": 65.0, "Rainfall": 100.0, "Mg": 105.0, "Fe": 16.7, "Zn": 0.85, "Mn": 5.8 },
        "healthAssessment": { "overallQuality": "Good", "fertilityScore": 78, "strengths": ["Good NPK levels", "Optimal pH", "High organic matter", "Good water retention (high clay)"], "deficiencies": ["No major deficiencies identified."] },
        "recommendations": [{ "category": "General", "action": "Maintain current practices", "details": "Your soil health is good; continue with sustainable farming methods." }]
    }
}', NOW(), NOW()),
('C-MP-009', '{
    "cropAnalysis": [
        { "name": "Cashew", "sowingSeason": "Plantation (June-Aug)", "subsidyInfo": "Support available from the Directorate of Cashew and Cocoa Development.", "iconName": "CalendarDays", "potentialYield": "0.8-1 ton/ha", "recommendation": "High-value plantation crop well-suited for coastal areas with laterite soil." },
        { "name": "Coffee", "sowingSeason": "Plantation (June-July)", "subsidyInfo": "Subsidies and support provided by the Coffee Board of India.", "iconName": "BadgeIndianRupee", "potentialYield": "0.7-1 ton/ha (Arabica)", "recommendation": "Requires specific altitude and rainfall. Best for hilly regions." },
        { "name": "Rubber", "sowingSeason": "Plantation (June-July)", "subsidyInfo": "Support from the Rubber Board for new planting and replanting.", "iconName": "CalendarDays", "potentialYield": "1.5-2 tons/ha", "recommendation": "Long-term investment. Requires high rainfall and humidity." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Not Recommended", "score": 28,
        "recommendations": ["High risk of borewell failure and rapid depletion.", "Focus on surface water conservation like ponds and check dams.", "Cultivate drought-resistant crops like millets."]
    },
    "economicOpportunities": [
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 95.1, "P": 18.2, "K": 115.3, "pH": 5.7, "EC": 0.45, "OM": 1.1, "CaCO3": 1.2, "Sand": 65.3, "Silt": 22.7, "Clay": 18.1, "Temperature": 25.0, "Humidity": 45.5, "Rainfall": 60.2, "Mg": 75.8, "Fe": 28.5, "Zn": 0.55, "Mn": 3.2 },
        "healthAssessment": { "overallQuality": "Poor", "fertilityScore": 35, "strengths": ["Good drainage (high sand)"], "deficiencies": ["Suboptimal NPK levels", "Suboptimal pH", "Low organic matter"] },
        "recommendations": [{ "category": "Nutient Management", "action": "Apply Nitrogen-rich fertilizers", "details": "Consider adding urea or compost to boost nitrogen levels for leafy growth." }, { "category": "Nutrient Management", "action": "Incorporate Phosphorus supplements", "details": "Use diammonium phosphate (DAP) or rock phosphate to improve root development." }, { "category": "Nutrient Management", "action": "Enhance Potassium content", "details": "Apply muriate of potash (MOP) or wood ash to support flowering and fruiting." }, { "category": "pH Correction", "action": "Apply liming materials", "details": "Add agricultural lime to raise pH and reduce soil acidity." }, { "category": "Water Management", "action": "Implement water-saving irrigation", "details": "Adopt drip irrigation or sprinklers and consider drought-resistant crop varieties." }]
    }
}', NOW(), NOW()),
('C-MP-010', '{
    "cropAnalysis": [
        { "name": "Rice (Paddy)", "sowingSeason": "Kharif (June-July)", "subsidyInfo": "Eligible for MSP and covered under National Food Security Mission.", "iconName": "CalendarDays", "potentialYield": "4-5 tons/ha", "recommendation": "Ideal for water-rich areas. Use high-yielding varieties for maximum output." },
        { "name": "Wheat", "sowingSeason": "Rabi (Oct-Nov)", "subsidyInfo": "High demand crop with strong MSP support. Access to PM-KISAN benefits.", "iconName": "BadgeIndianRupee", "potentialYield": "3-4 tons/ha", "recommendation": "Requires well-irrigated land. Good for crop rotation with rice." },
        { "name": "Sugarcane", "sowingSeason": "Annual (Jan-Mar)", "subsidyInfo": "Fair and Remunerative Price (FRP) set by government. Subsidies for drip irrigation available.", "iconName": "CalendarDays", "potentialYield": "80-100 tons/ha", "recommendation": "Long-duration, water-intensive crop. Suitable for large holdings." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Excellent", "score": 92,
        "recommendations": ["High probability of finding sustainable water source.", "Apply for subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY).", "Consider multi-crop cycles to maximize land usage."]
    },
    "economicOpportunities": [
        { "name": "Aquaculture", "description": "High water availability makes fish or prawn farming a viable, high-return business.", "iconName": "Waves" },
        { "name": "Eco-Tourism", "description": "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.", "iconName": "Globe" },
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 180.5, "P": 30.2, "K": 230.1, "pH": 7.2, "EC": 0.95, "OM": 1.8, "CaCO3": 6.1, "Sand": 45.3, "Silt": 38.7, "Clay": 27.1, "Temperature": 25.0, "Humidity": 75.5, "Rainfall": 175.2, "Mg": 110.8, "Fe": 18.5, "Zn": 0.9, "Mn": 6.2 },
        "healthAssessment": { "overallQuality": "Excellent", "fertilityScore": 95, "strengths": ["Good NPK levels", "Optimal pH", "High organic matter", "Good drainage (high sand)"], "deficiencies": ["No major deficiencies identified."] },
        "recommendations": [{ "category": "General", "action": "Maintain current practices", "details": "Your soil health is good; continue with sustainable farming methods." }]
    }
}', NOW(), NOW()),
('C-OD-001', '{
    "cropAnalysis": [
        { "name": "Rice (Paddy)", "sowingSeason": "Kharif (June-July)", "subsidyInfo": "Eligible for MSP and covered under National Food Security Mission.", "iconName": "CalendarDays", "potentialYield": "4-5 tons/ha", "recommendation": "Ideal for water-rich areas. Use high-yielding varieties for maximum output." },
        { "name": "Wheat", "sowingSeason": "Rabi (Oct-Nov)", "subsidyInfo": "High demand crop with strong MSP support. Access to PM-KISAN benefits.", "iconName": "BadgeIndianRupee", "potentialYield": "3-4 tons/ha", "recommendation": "Requires well-irrigated land. Good for crop rotation with rice." },
        { "name": "Sugarcane", "sowingSeason": "Annual (Jan-Mar)", "subsidyInfo": "Fair and Remunerative Price (FRP) set by government. Subsidies for drip irrigation available.", "iconName": "CalendarDays", "potentialYield": "80-100 tons/ha", "recommendation": "Long-duration, water-intensive crop. Suitable for large holdings." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Excellent", "score": 92,
        "recommendations": ["High probability of finding sustainable water source.", "Apply for subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY).", "Consider multi-crop cycles to maximize land usage."]
    },
    "economicOpportunities": [
        { "name": "Aquaculture", "description": "High water availability makes fish or prawn farming a viable, high-return business.", "iconName": "Waves" },
        { "name": "Eco-Tourism", "description": "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.", "iconName": "Globe" },
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 170.1, "P": 28.5, "K": 210.3, "pH": 7.1, "EC": 0.88, "OM": 1.6, "CaCO3": 5.5, "Sand": 42.1, "Silt": 36.5, "Clay": 26.8, "Temperature": 26.0, "Humidity": 72.1, "Rainfall": 160.5, "Mg": 105.0, "Fe": 16.7, "Zn": 0.85, "Mn": 5.8 },
        "healthAssessment": { "overallQuality": "Excellent", "fertilityScore": 93, "strengths": ["Good NPK levels", "Optimal pH", "High organic matter", "Good water retention (high clay)"], "deficiencies": ["No major deficiencies identified."] },
        "recommendations": [{ "category": "General", "action": "Maintain current practices", "details": "Your soil health is good; continue with sustainable farming methods." }]
    }
}', NOW(), NOW()),
('C-OD-002', '{
    "cropAnalysis": [
        { "name": "Cashew", "sowingSeason": "Plantation (June-Aug)", "subsidyInfo": "Support available from the Directorate of Cashew and Cocoa Development.", "iconName": "CalendarDays", "potentialYield": "0.8-1 ton/ha", "recommendation": "High-value plantation crop well-suited for coastal areas with laterite soil." },
        { "name": "Coffee", "sowingSeason": "Plantation (June-July)", "subsidyInfo": "Subsidies and support provided by the Coffee Board of India.", "iconName": "BadgeIndianRupee", "potentialYield": "0.7-1 ton/ha (Arabica)", "recommendation": "Requires specific altitude and rainfall. Best for hilly regions." },
        { "name": "Rubber", "sowingSeason": "Plantation (June-July)", "subsidyInfo": "Support from the Rubber Board for new planting and replanting.", "iconName": "CalendarDays", "potentialYield": "1.5-2 tons/ha", "recommendation": "Long-term investment. Requires high rainfall and humidity." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Moderate", "score": 65,
        "recommendations": ["A geological survey is highly recommended before drilling.", "Prioritize rainwater harvesting to recharge groundwater.", "Explore drip irrigation schemes to conserve water."]
    },
    "economicOpportunities": [
        { "name": "Eco-Tourism", "description": "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.", "iconName": "Globe" },
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 95.1, "P": 18.2, "K": 115.3, "pH": 5.7, "EC": 0.45, "OM": 1.1, "CaCO3": 1.2, "Sand": 65.3, "Silt": 22.7, "Clay": 18.1, "Temperature": 25.0, "Humidity": 65.0, "Rainfall": 100.0, "Mg": 75.8, "Fe": 28.5, "Zn": 0.55, "Mn": 3.2 },
        "healthAssessment": { "overallQuality": "Poor", "fertilityScore": 35, "strengths": ["Good drainage (high sand)"], "deficiencies": ["Suboptimal NPK levels", "Suboptimal pH", "Low organic matter"] },
        "recommendations": [{ "category": "Nutient Management", "action": "Apply Nitrogen-rich fertilizers", "details": "Consider adding urea or compost to boost nitrogen levels for leafy growth." }, { "category": "Nutrient Management", "action": "Incorporate Phosphorus supplements", "details": "Use diammonium phosphate (DAP) or rock phosphate to improve root development." }, { "category": "Nutrient Management", "action": "Enhance Potassium content", "details": "Apply muriate of potash (MOP) or wood ash to support flowering and fruiting." }, { "category": "pH Correction", "action": "Apply liming materials", "details": "Add agricultural lime to raise pH and reduce soil acidity." }, { "category": "Water Management", "action": "Implement water-saving irrigation", "details": "Adopt drip irrigation or sprinklers and consider drought-resistant crop varieties." }]
    }
}', NOW(), NOW()),
('C-OD-003', '{
    "cropAnalysis": [
        { "name": "Cotton", "sowingSeason": "Kharif (May-June)", "subsidyInfo": "Covered under the National Food Security Mission (Commercial Crops).", "iconName": "CalendarDays", "potentialYield": "1.5-2 tons/ha", "recommendation": "Requires a long frost-free period. Good drainage is essential." },
        { "name": "Soybean", "sowingSeason": "Kharif (June-July)", "subsidyInfo": "Eligible for MSP. Subsidies available for high-yield seeds.", "iconName": "BadgeIndianRupee", "potentialYield": "2-2.5 tons/ha", "recommendation": "Nitrogen-fixing crop, improves soil fertility. Intercropping is beneficial." },
        { "name": "Lentils (Masur)", "sowingSeason": "Rabi (Oct-Nov)", "subsidyInfo": "Promoted under NFSM-Pulses. Minimum Support Price (MSP) is available.", "iconName": "CalendarDays", "potentialYield": "1-1.2 tons/ha", "recommendation": "Drought-tolerant and suitable for rainfed areas with clay soil." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Excellent", "score": 92,
        "recommendations": ["High probability of finding sustainable water source.", "Apply for subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY).", "Consider multi-crop cycles to maximize land usage."]
    },
    "economicOpportunities": [
        { "name": "Aquaculture", "description": "High water availability makes fish or prawn farming a viable, high-return business.", "iconName": "Waves" },
        { "name": "Eco-Tourism", "description": "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.", "iconName": "Globe" },
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 120.1, "P": 35.2, "K": 200.3, "pH": 6.7, "EC": 0.75, "OM": 2.3, "CaCO3": 3.5, "Sand": 22.3, "Silt": 32.7, "Clay": 55.1, "Temperature": 25.0, "Humidity": 75.5, "Rainfall": 175.2, "Mg": 130.8, "Fe": 22.5, "Zn": 0.7, "Mn": 4.2 },
        "healthAssessment": { "overallQuality": "Excellent", "fertilityScore": 90, "strengths": ["Good NPK levels", "Optimal pH", "High organic matter", "Good water retention (high clay)"], "deficiencies": ["No major deficiencies identified."] },
        "recommendations": [{ "category": "General", "action": "Maintain current practices", "details": "Your soil health is good; continue with sustainable farming methods." }]
    }
}', NOW(), NOW()),
('C-OD-004', '{
    "cropAnalysis": [
        { "name": "Maize", "sowingSeason": "Kharif (June-July)", "subsidyInfo": "Subsidies available under the National Mission on Oilseeds and Oil Palm.", "iconName": "CalendarDays", "potentialYield": "5-6 tons/ha", "recommendation": "Versatile crop with high yield potential. Good for intercropping." },
        { "name": "Pulses (Gram)", "sowingSeason": "Rabi (Oct-Nov)", "subsidyInfo": "Promoted under NFSM-Pulses with financial assistance for seeds and inputs.", "iconName": "BadgeIndianRupee", "potentialYield": "1-1.5 tons/ha", "recommendation": "Low water requirement, enhances soil nitrogen. Ideal for rotation." },
        { "name": "Groundnut", "sowingSeason": "Kharif & Rabi", "subsidyInfo": "MSP available. Support for seeds and mechanization under various schemes.", "iconName": "CalendarDays", "potentialYield": "1.5-2 tons/ha", "recommendation": "Well-drained loamy soil is perfect. Can be grown in two seasons." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Not Recommended", "score": 28,
        "recommendations": ["High risk of borewell failure and rapid depletion.", "Focus on surface water conservation like ponds and check dams.", "Cultivate drought-resistant crops like millets."]
    },
    "economicOpportunities": [
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 170.1, "P": 28.5, "K": 210.3, "pH": 7.1, "EC": 0.88, "OM": 1.6, "CaCO3": 5.5, "Sand": 42.1, "Silt": 36.5, "Clay": 26.8, "Temperature": 25.0, "Humidity": 45.5, "Rainfall": 60.2, "Mg": 105.0, "Fe": 16.7, "Zn": 0.85, "Mn": 5.8 },
        "healthAssessment": { "overallQuality": "Poor", "fertilityScore": 35, "strengths": ["Good water retention (high clay)"], "deficiencies": ["Suboptimal NPK levels", "Suboptimal pH", "Low organic matter"] },
        "recommendations": [{ "category": "Nutient Management", "action": "Apply Nitrogen-rich fertilizers", "details": "Consider adding urea or compost to boost nitrogen levels for leafy growth." }, { "category": "Nutrient Management", "action": "Incorporate Phosphorus supplements", "details": "Use diammonium phosphate (DAP) or rock phosphate to improve root development." }, { "category": "Nutrient Management", "action": "Enhance Potassium content", "details": "Apply muriate of potash (MOP) or wood ash to support flowering and fruiting." }, { "category": "pH Correction", "action": "Apply liming materials", "details": "Add agricultural lime to raise pH and reduce soil acidity." }, { "category": "Water Management", "action": "Implement water-saving irrigation", "details": "Adopt drip irrigation or sprinklers and consider drought-resistant crop varieties." }]
    }
}', NOW(), NOW()),
('C-OD-005', '{
    "cropAnalysis": [
        { "name": "Rice (Paddy)", "sowingSeason": "Kharif (June-July)", "subsidyInfo": "Eligible for MSP and covered under National Food Security Mission.", "iconName": "CalendarDays", "potentialYield": "4-5 tons/ha", "recommendation": "Ideal for water-rich areas. Use high-yielding varieties for maximum output." },
        { "name": "Wheat", "sowingSeason": "Rabi (Oct-Nov)", "subsidyInfo": "High demand crop with strong MSP support. Access to PM-KISAN benefits.", "iconName": "BadgeIndianRupee", "potentialYield": "3-4 tons/ha", "recommendation": "Requires well-irrigated land. Good for crop rotation with rice." },
        { "name": "Sugarcane", "sowingSeason": "Annual (Jan-Mar)", "subsidyInfo": "Fair and Remunerative Price (FRP) set by government. Subsidies for drip irrigation available.", "iconName": "CalendarDays", "potentialYield": "80-100 tons/ha", "recommendation": "Long-duration, water-intensive crop. Suitable for large holdings." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Moderate", "score": 65,
        "recommendations": ["A geological survey is highly recommended before drilling.", "Prioritize rainwater harvesting to recharge groundwater.", "Explore drip irrigation schemes to conserve water."]
    },
    "economicOpportunities": [
        { "name": "Eco-Tourism", "description": "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.", "iconName": "Globe" },
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 170.1, "P": 28.5, "K": 210.3, "pH": 7.1, "EC": 0.88, "OM": 1.6, "CaCO3": 5.5, "Sand": 42.1, "Silt": 36.5, "Clay": 26.8, "Temperature": 25.0, "Humidity": 65.0, "Rainfall": 100.0, "Mg": 105.0, "Fe": 16.7, "Zn": 0.85, "Mn": 5.8 },
        "healthAssessment": { "overallQuality": "Good", "fertilityScore": 78, "strengths": ["Good NPK levels", "Optimal pH", "High organic matter", "Good water retention (high clay)"], "deficiencies": ["No major deficiencies identified."] },
        "recommendations": [{ "category": "General", "action": "Maintain current practices", "details": "Your soil health is good; continue with sustainable farming methods." }]
    }
}', NOW(), NOW()),
('C-OD-006', '{
    "cropAnalysis": [
        { "name": "Cashew", "sowingSeason": "Plantation (June-Aug)", "subsidyInfo": "Support available from the Directorate of Cashew and Cocoa Development.", "iconName": "CalendarDays", "potentialYield": "0.8-1 ton/ha", "recommendation": "High-value plantation crop well-suited for coastal areas with laterite soil." },
        { "name": "Coffee", "sowingSeason": "Plantation (June-July)", "subsidyInfo": "Subsidies and support provided by the Coffee Board of India.", "iconName": "BadgeIndianRupee", "potentialYield": "0.7-1 ton/ha (Arabica)", "recommendation": "Requires specific altitude and rainfall. Best for hilly regions." },
        { "name": "Rubber", "sowingSeason": "Plantation (June-July)", "subsidyInfo": "Support from the Rubber Board for new planting and replanting.", "iconName": "CalendarDays", "potentialYield": "1.5-2 tons/ha", "recommendation": "Long-term investment. Requires high rainfall and humidity." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Excellent", "score": 92,
        "recommendations": ["High probability of finding sustainable water source.", "Apply for subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY).", "Consider multi-crop cycles to maximize land usage."]
    },
    "economicOpportunities": [
        { "name": "Aquaculture", "description": "High water availability makes fish or prawn farming a viable, high-return business.", "iconName": "Waves" },
        { "name": "Eco-Tourism", "description": "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.", "iconName": "Globe" },
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 95.1, "P": 18.2, "K": 115.3, "pH": 5.7, "EC": 0.45, "OM": 1.1, "CaCO3": 1.2, "Sand": 65.3, "Silt": 22.7, "Clay": 18.1, "Temperature": 25.0, "Humidity": 75.5, "Rainfall": 175.2, "Mg": 75.8, "Fe": 28.5, "Zn": 0.55, "Mn": 3.2 },
        "healthAssessment": { "overallQuality": "Excellent", "fertilityScore": 95, "strengths": ["Good drainage (high sand)"], "deficiencies": ["No major deficiencies identified."] },
        "recommendations": [{ "category": "General", "action": "Maintain current practices", "details": "Your soil health is good; continue with sustainable farming methods." }]
    }
}', NOW(), NOW()),
('C-OD-007', '{
    "cropAnalysis": [
        { "name": "Cotton", "sowingSeason": "Kharif (May-June)", "subsidyInfo": "Covered under the National Food Security Mission (Commercial Crops).", "iconName": "CalendarDays", "potentialYield": "1.5-2 tons/ha", "recommendation": "Requires a long frost-free period. Good drainage is essential." },
        { "name": "Soybean", "sowingSeason": "Kharif (June-July)", "subsidyInfo": "Eligible for MSP. Subsidies available for high-yield seeds.", "iconName": "BadgeIndianRupee", "potentialYield": "2-2.5 tons/ha", "recommendation": "Nitrogen-fixing crop, improves soil fertility. Intercropping is beneficial." },
        { "name": "Lentils (Masur)", "sowingSeason": "Rabi (Oct-Nov)", "subsidyInfo": "Promoted under NFSM-Pulses. Minimum Support Price (MSP) is available.", "iconName": "CalendarDays", "potentialYield": "1-1.2 tons/ha", "recommendation": "Drought-tolerant and suitable for rainfed areas with clay soil." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Moderate", "score": 65,
        "recommendations": ["A geological survey is highly recommended before drilling.", "Prioritize rainwater harvesting to recharge groundwater.", "Explore drip irrigation schemes to conserve water."]
    },
    "economicOpportunities": [
        { "name": "Eco-Tourism", "description": "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.", "iconName": "Globe" },
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 120.1, "P": 35.2, "K": 200.3, "pH": 6.7, "EC": 0.75, "OM": 2.3, "CaCO3": 3.5, "Sand": 22.3, "Silt": 32.7, "Clay": 55.1, "Temperature": 25.0, "Humidity": 65.0, "Rainfall": 100.0, "Mg": 130.8, "Fe": 22.5, "Zn": 0.7, "Mn": 4.2 },
        "healthAssessment": { "overallQuality": "Good", "fertilityScore": 78, "strengths": ["Good NPK levels", "Optimal pH", "High organic matter", "Good water retention (high clay)"], "deficiencies": ["No major deficiencies identified."] },
        "recommendations": [{ "category": "General", "action": "Maintain current practices", "details": "Your soil health is good; continue with sustainable farming methods." }]
    }
}', NOW(), NOW()),
('C-OD-008', '{
    "cropAnalysis": [
        { "name": "Cashew", "sowingSeason": "Plantation (June-Aug)", "subsidyInfo": "Support available from the Directorate of Cashew and Cocoa Development.", "iconName": "CalendarDays", "potentialYield": "0.8-1 ton/ha", "recommendation": "High-value plantation crop well-suited for coastal areas with laterite soil." },
        { "name": "Coffee", "sowingSeason": "Plantation (June-July)", "subsidyInfo": "Subsidies and support provided by the Coffee Board of India.", "iconName": "BadgeIndianRupee", "potentialYield": "0.7-1 ton/ha (Arabica)", "recommendation": "Requires specific altitude and rainfall. Best for hilly regions." },
        { "name": "Rubber", "sowingSeason": "Plantation (June-July)", "subsidyInfo": "Support from the Rubber Board for new planting and replanting.", "iconName": "CalendarDays", "potentialYield": "1.5-2 tons/ha", "recommendation": "Long-term investment. Requires high rainfall and humidity." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Not Recommended", "score": 28,
        "recommendations": ["High risk of borewell failure and rapid depletion.", "Focus on surface water conservation like ponds and check dams.", "Cultivate drought-resistant crops like millets."]
    },
    "economicOpportunities": [
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 95.1, "P": 18.2, "K": 115.3, "pH": 5.7, "EC": 0.45, "OM": 1.1, "CaCO3": 1.2, "Sand": 65.3, "Silt": 22.7, "Clay": 18.1, "Temperature": 25.0, "Humidity": 45.5, "Rainfall": 60.2, "Mg": 75.8, "Fe": 28.5, "Zn": 0.55, "Mn": 3.2 },
        "healthAssessment": { "overallQuality": "Poor", "fertilityScore": 35, "strengths": ["Good drainage (high sand)"], "deficiencies": ["Suboptimal NPK levels", "Suboptimal pH", "Low organic matter"] },
        "recommendations": [{ "category": "Nutient Management", "action": "Apply Nitrogen-rich fertilizers", "details": "Consider adding urea or compost to boost nitrogen levels for leafy growth." }, { "category": "Nutrient Management", "action": "Incorporate Phosphorus supplements", "details": "Use diammonium phosphate (DAP) or rock phosphate to improve root development." }, { "category": "Nutrient Management", "action": "Enhance Potassium content", "details": "Apply muriate of potash (MOP) or wood ash to support flowering and fruiting." }, { "category": "pH Correction", "action": "Apply liming materials", "details": "Add agricultural lime to raise pH and reduce soil acidity." }, { "category": "Water Management", "action": "Implement water-saving irrigation", "details": "Adopt drip irrigation or sprinklers and consider drought-resistant crop varieties." }]
    }
}', NOW(), NOW()),
('C-OD-009', '{
    "cropAnalysis": [
        { "name": "Rice (Paddy)", "sowingSeason": "Kharif (June-July)", "subsidyInfo": "Eligible for MSP and covered under National Food Security Mission.", "iconName": "CalendarDays", "potentialYield": "4-5 tons/ha", "recommendation": "Ideal for water-rich areas. Use high-yielding varieties for maximum output." },
        { "name": "Wheat", "sowingSeason": "Rabi (Oct-Nov)", "subsidyInfo": "High demand crop with strong MSP support. Access to PM-KISAN benefits.", "iconName": "BadgeIndianRupee", "potentialYield": "3-4 tons/ha", "recommendation": "Requires well-irrigated land. Good for crop rotation with rice." },
        { "name": "Sugarcane", "sowingSeason": "Annual (Jan-Mar)", "subsidyInfo": "Fair and Remunerative Price (FRP) set by government. Subsidies for drip irrigation available.", "iconName": "CalendarDays", "potentialYield": "80-100 tons/ha", "recommendation": "Long-duration, water-intensive crop. Suitable for large holdings." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Excellent", "score": 92,
        "recommendations": ["High probability of finding sustainable water source.", "Apply for subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY).", "Consider multi-crop cycles to maximize land usage."]
    },
    "economicOpportunities": [
        { "name": "Aquaculture", "description": "High water availability makes fish or prawn farming a viable, high-return business.", "iconName": "Waves" },
        { "name": "Eco-Tourism", "description": "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.", "iconName": "Globe" },
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 170.1, "P": 28.5, "K": 210.3, "pH": 7.1, "EC": 0.88, "OM": 1.6, "CaCO3": 5.5, "Sand": 42.1, "Silt": 36.5, "Clay": 26.8, "Temperature": 26.0, "Humidity": 72.1, "Rainfall": 160.5, "Mg": 105.0, "Fe": 16.7, "Zn": 0.85, "Mn": 5.8 },
        "healthAssessment": { "overallQuality": "Excellent", "fertilityScore": 93, "strengths": ["Good NPK levels", "Optimal pH", "High organic matter", "Good water retention (high clay)"], "deficiencies": ["No major deficiencies identified."] },
        "recommendations": [{ "category": "General", "action": "Maintain current practices", "details": "Your soil health is good; continue with sustainable farming methods." }]
    }
}', NOW(), NOW()),
('C-OD-010', '{
    "cropAnalysis": [
        { "name": "Maize", "sowingSeason": "Kharif (June-July)", "subsidyInfo": "Subsidies available under the National Mission on Oilseeds and Oil Palm.", "iconName": "CalendarDays", "potentialYield": "5-6 tons/ha", "recommendation": "Versatile crop with high yield potential. Good for intercropping." },
        { "name": "Pulses (Gram)", "sowingSeason": "Rabi (Oct-Nov)", "subsidyInfo": "Promoted under NFSM-Pulses with financial assistance for seeds and inputs.", "iconName": "BadgeIndianRupee", "potentialYield": "1-1.5 tons/ha", "recommendation": "Low water requirement, enhances soil nitrogen. Ideal for rotation." },
        { "name": "Groundnut", "sowingSeason": "Kharif & Rabi", "subsidyInfo": "MSP available. Support for seeds and mechanization under various schemes.", "iconName": "CalendarDays", "potentialYield": "1.5-2 tons/ha", "recommendation": "Well-drained loamy soil is perfect. Can be grown in two seasons." }
    ],
    "waterAnalysis": {
        "borewellSuitability": "Moderate", "score": 65,
        "recommendations": ["A geological survey is highly recommended before drilling.", "Prioritize rainwater harvesting to recharge groundwater.", "Explore drip irrigation schemes to conserve water."]
    },
    "economicOpportunities": [
        { "name": "Eco-Tourism", "description": "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.", "iconName": "Globe" },
        { "name": "Non-Timber Forest Products", "description": "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", "iconName": "Briefcase" },
        { "name": "Carbon Credits", "description": "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", "iconName": "DollarSign" }
    ],
    "soilAnalysis": {
        "parameters": { "N": 170.1, "P": 28.5, "K": 210.3, "pH": 7.1, "EC": 0.88, "OM": 1.6, "CaCO3": 5.5, "Sand": 42.1, "Silt": 36.5, "Clay": 26.8, "Temperature": 25.0, "Humidity": 65.0, "Rainfall": 100.0, "Mg": 105.0, "Fe": 16.7, "Zn": 0.85, "Mn": 5.8 },
        "healthAssessment": { "overallQuality": "Good", "fertilityScore": 78, "strengths": ["Good NPK levels", "Optimal pH", "High organic matter", "Good water retention (high clay)"], "deficiencies": ["No major deficiencies identified."] },
        "recommendations": [{ "category": "General", "action": "Maintain current practices", "details": "Your soil health is good; continue with sustainable farming methods." }]
    }
}', NOW(), NOW())
ON CONFLICT (claim_id) DO UPDATE
SET
  analysis_data = EXCLUDED.analysis_data,
  updated_at = EXCLUDED.updated_at;