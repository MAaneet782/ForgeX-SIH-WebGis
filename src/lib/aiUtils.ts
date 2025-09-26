// A simple pseudo-random generator to make mock data deterministic based on claim ID
export const seededRandom = (seed: number) => {
    let state = seed;
    return () => {
        state = (state * 9301 + 49297) % 233280;
        return state / 233280;
    };
};

// Convert string to a number for seeding
export const stringToSeed = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

export const generateGroundwaterAnalysis = (claimId: string) => {
    const seed = stringToSeed(claimId + "gw"); // Use a different seed for variety
    const random = seededRandom(seed);
    const score = random() * 10;

    let status = "Poor";
    let recommendation = "Borewell digging not recommended. Focus on rainwater harvesting and surface water sources.";
    if (score > 8) {
        status = "Excellent";
        recommendation = "High potential for sustainable borewell. Aquifer depth is estimated to be shallow.";
    } else if (score > 6) {
        status = "Good";
        recommendation = "Good potential for borewell. A hydrogeological survey is recommended for optimal placement.";
    } else if (score > 4) {
        status = "Moderate";
        recommendation = "Moderate potential. Water table may be deep or seasonal. Proceed with caution.";
    }

    return {
        score: parseFloat(score.toFixed(1)),
        status,
        recommendation,
    };
};

export const generateAiAnalysis = (claimId: string) => {
    const seed = stringToSeed(claimId);
    const random = seededRandom(seed);

    const soilParams = {
        N: (random() * 100 + 20).toFixed(2), P: (random() * 50 + 5).toFixed(2), K: (random() * 200 + 50).toFixed(2),
        pH: (random() * 3 + 5.5).toFixed(2), EC: (random() * 1.5 + 0.2).toFixed(2), OM: (random() * 2 + 0.5).toFixed(2),
        CaCO3: (random() * 10).toFixed(2), Sand: (random() * 40 + 30).toFixed(2), Silt: (random() * 30 + 10).toFixed(2),
        Clay: (random() * 30 + 10).toFixed(2), Temperature: (random() * 15 + 20).toFixed(2), Humidity: (random() * 50 + 40).toFixed(2),
        Rainfall: (random() * 1000 + 500).toFixed(2), Mg: (random() * 100 + 30).toFixed(2), Fe: (random() * 10 + 2).toFixed(2),
        Zn: (random() * 5 + 0.5).toFixed(2), Mn: (random() * 10 + 1).toFixed(2),
    };

    // Corrected health score calculation
    const omScore = (parseFloat(soilParams.OM) / 2.5) * 40;
    const phScore = (1 - (Math.abs(6.5 - parseFloat(soilParams.pH)) / 2.5)) * 30;
    const nScore = (parseFloat(soilParams.N) / 120) * 30;
    const healthScore = Math.min(100, omScore + phScore + nScore);

    const soilHealth = healthScore > 75 ? 'Good' : healthScore > 50 ? 'Moderate' : 'Poor';

    const recommendations = [
        parseFloat(soilParams.OM) < 1.5 && "Incorporate organic matter like compost or manure.",
        parseFloat(soilParams.pH) < 6.0 && "Apply lime to raise soil pH.",
        parseFloat(soilParams.pH) > 7.5 && "Apply sulfur or organic amendments to lower soil pH.",
        parseFloat(soilParams.N) < 50 && "Use nitrogen-rich fertilizers or plant cover crops.",
        parseFloat(soilParams.P) < 15 && "Add phosphate fertilizers or bone meal.",
        parseFloat(soilParams.K) < 100 && "Apply potash fertilizers or wood ash.",
    ].filter(Boolean) as string[];

    const cropRecommendations = [
        { 
            name: 'Maize', 
            season: 'Kharif', 
            notes: 'Versatile crop with high yield potential. Sensitive to waterlogging in early stages.', 
            suitability: parseFloat(soilParams.OM) > 1.0 && parseFloat(soilParams.pH) > 5.8, 
            subsidy: { scheme: "NFSM", details: "50% subsidy on hybrid seeds." },
            yield: `${(random() * 5 + 15).toFixed(1)} quintals/acre`,
            water_need: 'Moderate (450-650mm)',
            profit_potential: `₹${(random() * 5000 + 15000).toLocaleString('en-IN', { maximumFractionDigits: 0 })} / acre`,
            sowing_window: 'June - July'
        },
        { 
            name: 'Pulses (Gram)', 
            season: 'Rabi', 
            notes: 'Low water requirement, enhances soil nitrogen through fixation. Ideal for crop rotation.', 
            suitability: parseFloat(soilParams.Rainfall) < 1000, 
            subsidy: { scheme: "NFSM-Pulses", details: "Subsidies on seeds and micronutrients." },
            yield: `${(random() * 4 + 8).toFixed(1)} quintals/acre`,
            water_need: 'Low (200-300mm)',
            profit_potential: `₹${(random() * 6000 + 18000).toLocaleString('en-IN', { maximumFractionDigits: 0 })} / acre`,
            sowing_window: 'October - November'
        },
        { 
            name: 'Soybean', 
            season: 'Kharif', 
            notes: 'Good source of protein and oil. Requires well-drained soil.', 
            suitability: parseFloat(soilParams.Clay) > 20, 
            subsidy: { scheme: "NMOOP", details: "Financial assistance for quality seeds." },
            yield: `${(random() * 6 + 10).toFixed(1)} quintals/acre`,
            water_need: 'Moderate (450-700mm)',
            profit_potential: `₹${(random() * 7000 + 20000).toLocaleString('en-IN', { maximumFractionDigits: 0 })} / acre`,
            sowing_window: 'June - July'
        },
        { 
            name: 'Wheat', 
            season: 'Rabi', 
            notes: 'Requires well-drained loamy soils and cooler temperatures during growth.', 
            suitability: parseFloat(soilParams.Temperature) < 30, 
            subsidy: { scheme: "NFSM", details: "Support for farm machinery and water management." },
            yield: `${(random() * 8 + 12).toFixed(1)} quintals/acre`,
            water_need: 'High (500-700mm)',
            profit_potential: `₹${(random() * 5000 + 12000).toLocaleString('en-IN', { maximumFractionDigits: 0 })} / acre`,
            sowing_window: 'November'
        },
        { 
            name: 'Cotton', 
            season: 'Kharif', 
            notes: 'Best for black cotton soil, requires a long frost-free period.', 
            suitability: parseFloat(soilParams.Clay) > 35, 
            subsidy: { scheme: "Cotton Development Programme", details: "Assistance for pest management." },
            yield: `${(random() * 3 + 5).toFixed(1)} quintals/acre`,
            water_need: 'High (700-1200mm)',
            profit_potential: `₹${(random() * 10000 + 25000).toLocaleString('en-IN', { maximumFractionDigits: 0 })} / acre`,
            sowing_window: 'May - June'
        },
        { 
            name: 'Millets (Jowar)', 
            season: 'Kharif/Rabi', 
            notes: 'Drought-resistant and suitable for arid regions. Highly nutritious.', 
            suitability: parseFloat(soilParams.Rainfall) < 800, 
            subsidy: { scheme: "Initiative for Nutritional Security", details: "Distribution of free seed minikits." },
            yield: `${(random() * 5 + 10).toFixed(1)} quintals/acre`,
            water_need: 'Very Low (250-400mm)',
            profit_potential: `₹${(random() * 4000 + 8000).toLocaleString('en-IN', { maximumFractionDigits: 0 })} / acre`,
            sowing_window: 'June-July (Kharif), Oct-Nov (Rabi)'
        },
    ].filter(crop => crop.suitability);

    return {
        soilComposition: soilParams,
        soilHealth: { status: soilHealth, score: healthScore.toFixed(2) },
        improvementRecommendations: recommendations,
        cropRecommendations: cropRecommendations.length > 0 ? cropRecommendations : [{ 
            name: 'Millet', 
            season: 'Varies', 
            notes: 'Hardy crop suitable for marginal lands.', 
            suitability: true, 
            subsidy: { scheme: "N/A", details: "No specific subsidy found." },
            yield: `${(random() * 5 + 10).toFixed(1)} quintals/acre`,
            water_need: 'Very Low (250-400mm)',
            profit_potential: `₹${(random() * 4000 + 8000).toLocaleString('en-IN', { maximumFractionDigits: 0 })} / acre`,
            sowing_window: 'June-July (Kharif), Oct-Nov (Rabi)'
        }],
    };
};