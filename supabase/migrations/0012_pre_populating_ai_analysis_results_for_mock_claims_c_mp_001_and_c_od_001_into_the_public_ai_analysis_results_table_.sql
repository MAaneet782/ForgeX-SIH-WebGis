INSERT INTO public.ai_analysis_results (claim_id, analysis_data, created_at, updated_at)
VALUES
(
    'C-MP-001',
    '{
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
            "borewellSuitability": "Excellent",
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
                "N": 180.5, "P": 30.2, "K": 230.1, "pH": 7.2, "EC": 0.95, "OM": 1.8, "CaCO3": 6.1,
                "Sand": 45.3, "Silt": 38.7, "Clay": 27.1, "Temperature": 25.0, "Humidity": 75.5,
                "Rainfall": 175.2, "Mg": 110.8, "Fe": 18.5, "Zn": 0.9, "Mn": 6.2
            },
            "healthAssessment": {
                "overallQuality": "Excellent",
                "fertilityScore": 95,
                "strengths": ["Good NPK levels", "Optimal pH", "High organic matter", "Good drainage (high sand)"],
                "deficiencies": ["No major deficiencies identified."]
            },
            "recommendations": [
                {"category": "General", "action": "Maintain current practices", "details": "Your soil health is good; continue with sustainable farming methods."}
            ]
        }
    }',
    NOW(),
    NOW()
),
(
    'C-OD-001',
    '{
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
            "borewellSuitability": "Excellent",
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
                "N": 170.1, "P": 28.5, "K": 210.3, "pH": 7.1, "EC": 0.88, "OM": 1.6, "CaCO3": 5.5,
                "Sand": 42.1, "Silt": 36.5, "Clay": 26.8, "Temperature": 26.0, "Humidity": 72.1,
                "Rainfall": 160.5, "Mg": 105.0, "Fe": 16.7, "Zn": 0.85, "Mn": 5.8
            },
            "healthAssessment": {
                "overallQuality": "Excellent",
                "fertilityScore": 93,
                "strengths": ["Good NPK levels", "Optimal pH", "High organic matter", "Good water retention (high clay)"],
                "deficiencies": ["No major deficiencies identified."]
            },
            "recommendations": [
                {"category": "General", "action": "Maintain current practices", "details": "Your soil health is good; continue with sustainable farming methods."}
            ]
        }
    }',
    NOW(),
    NOW()
);