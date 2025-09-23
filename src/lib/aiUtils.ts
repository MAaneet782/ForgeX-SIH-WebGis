// A simple pseudo-random generator to make mock data deterministic based on claim ID
const seededRandom = (seed: number) => {
    let state = seed;
    return () => {
        state = (state * 9301 + 49297) % 233280;
        return state / 233280;
    };
};

// Convert string to a number for seeding
const stringToSeed = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

export const generateAiAnalysis = (claimId: string) => {
    const seed = stringToSeed(claimId);
    const random = seededRandom(seed);

    const soilParams = {
        N: (random() * 100 + 20).toFixed(2), // ppm
        P: (random() * 50 + 5).toFixed(2), // ppm
        K: (random() * 200 + 50).toFixed(2), // ppm
        pH: (random() * 3 + 5.5).toFixed(2),
        EC: (random() * 1.5 + 0.2).toFixed(2), // mS/cm
        OM: (random() * 2 + 0.5).toFixed(2), // %
        CaCO3: (random() * 10).toFixed(2), // %
        Sand: (random() * 40 + 30).toFixed(2), // %
        Silt: (random() * 30 + 10).toFixed(2), // %
        Clay: (random() * 30 + 10).toFixed(2), // %
        Temperature: (random() * 15 + 20).toFixed(2), // °C
        Humidity: (random() * 50 + 40).toFixed(2), // %
        Rainfall: (random() * 1000 + 500).toFixed(2), // mm
        Mg: (random() * 100 + 30).toFixed(2), // ppm
        Fe: (random() * 10 + 2).toFixed(2), // ppm
        Zn: (random() * 5 + 0.5).toFixed(2), // ppm
        Mn: (random() * 10 + 1).toFixed(2), // ppm
    };

    const healthScore = (parseFloat(soilParams.OM) / 2.5) * 40 + (6.5 - Math.abs(6.5 - parseFloat(soilParams.pH))) * 30 + (parseFloat(soilParams.N) / 120) * 30;
    const soilHealth = healthScore > 75 ? 'Good' : healthScore > 50 ? 'Moderate' : 'Poor';

    const recommendations = [
        parseFloat(soilParams.OM) < 1.5 && "Incorporate organic matter like compost or manure to improve soil structure and fertility.",
        parseFloat(soilParams.pH) < 6.0 && "Apply lime to raise soil pH and improve nutrient availability.",
        parseFloat(soilParams.pH) > 7.5 && "Apply sulfur or organic amendments to lower soil pH.",
        parseFloat(soilParams.N) < 50 && "Use nitrogen-rich fertilizers or plant nitrogen-fixing cover crops.",
        parseFloat(soilParams.P) < 15 && "Add phosphate fertilizers or bone meal.",
        parseFloat(soilParams.K) < 100 && "Apply potash fertilizers or wood ash.",
    ].filter(Boolean) as string[];

    const cropRecommendations = [
        {
            name: 'Maize',
            season: 'Kharif (June-July)',
            notes: 'Versatile crop with high yield potential. Good for intercropping.',
            suitability: parseFloat(soilParams.OM) > 1.0 && parseFloat(soilParams.pH) > 5.8 && parseFloat(soilParams.pH) < 7.0,
        },
        {
            name: 'Pulses (Gram)',
            season: 'Rabi (Oct-Nov)',
            notes: 'Low water requirement, enhances soil nitrogen. Ideal for rotation.',
            suitability: parseFloat(soilParams.Rainfall) < 1000 && parseFloat(soilParams.Sand) > 40,
        },
        {
            name: 'Soybean',
            season: 'Kharif (June-July)',
            notes: 'Good source of protein and oil. Improves soil fertility.',
            suitability: parseFloat(soilParams.Clay) > 20 && parseFloat(soilParams.OM) > 1.2,
        },
        {
            name: 'Wheat',
            season: 'Rabi (Nov-Dec)',
            notes: 'Requires well-drained loamy soils and cooler temperatures.',
            suitability: parseFloat(soilParams.Temperature) < 30 && parseFloat(soilParams.Silt) > 20,
        }
    ].filter(crop => crop.suitability);

    return {
        soilComposition: soilParams,
        soilHealth: {
            status: soilHealth,
            score: healthScore.toFixed(2),
        },
        improvementRecommendations: recommendations,
        cropRecommendations: cropRecommendations.length > 0 ? cropRecommendations : [{ name: 'Millet', season: 'Varies', notes: 'Hardy crop suitable for marginal lands.', suitability: true }],
    };
};