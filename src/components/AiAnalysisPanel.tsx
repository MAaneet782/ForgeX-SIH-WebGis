import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Claim } from "@/data/mockClaims";
import { Leaf, Sprout, Droplets, Waves, DollarSign, Briefcase, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface AiAnalysisPanelProps {
  claim: Claim;
}

// --- AI Simulation Logic ---

const getSoilAnalysis = (soilType: Claim['soilType']) => {
  switch (soilType) {
    case 'Alluvial':
      return {
        description: "Highly fertile and rich in humus. Excellent for a wide variety of crops.",
        crops: ["Rice", "Wheat", "Sugarcane", "Jute"],
      };
    case 'Clay':
      return {
        description: "Good water retention, rich in minerals. Can be heavy and requires good drainage.",
        crops: ["Cotton", "Soybean", "Paddy", "Lentils"],
      };
    case 'Loamy':
      return {
        description: "Balanced mixture of sand, silt, and clay. Considered ideal for most crops.",
        crops: ["Maize", "Vegetables", "Pulses", "Oilseeds"],
      };
    case 'Laterite':
      return {
        description: "Rich in iron and aluminum. Suitable for specific plantation crops with proper management.",
        crops: ["Cashew", "Tea", "Coffee", "Rubber"],
      };
  }
};

const getWaterAnalysis = (waterAvailability: Claim['waterAvailability']) => {
  switch (waterAvailability) {
    case 'High':
      return {
        description: "Abundant water resources. Ideal for water-intensive agriculture and aquaculture.",
        recommendations: ["Consider applying for a borewell permit", "Explore multi-crop cycles", "Potential for fish farming"],
      };
    case 'Medium':
      return {
        description: "Sufficient water for one or two crop cycles. Conservation is recommended.",
        recommendations: ["Implement rainwater harvesting", "Use drip irrigation to maximize efficiency", "Choose moderately water-intensive crops"],
      };
    case 'Low':
      return {
        description: "Water is scarce. Focus on drought-resistant crops and aggressive conservation.",
        recommendations: ["Prioritize building check dams or ponds", "Cultivate millets and other hardy crops", "Explore dryland farming techniques"],
      };
  }
};

const getEconomicOpportunities = (claim: Claim) => {
    const opportunities = [];
    if (claim.waterAvailability === 'High') {
        opportunities.push({ name: "Aquaculture", description: "High water availability makes fish or prawn farming a viable, high-return business.", icon: Waves });
    }
    if (claim.area > 5) {
        opportunities.push({ name: "Eco-Tourism", description: "Larger plots in scenic areas can be developed for sustainable tourism, offering homestays or guided tours.", icon: Globe });
    }
    opportunities.push({ name: "Non-Timber Forest Products", description: "Sustainable harvesting of local products like honey, medicinal herbs, or bamboo.", icon: Briefcase });
    opportunities.push({ name: "Carbon Credits", description: "By practicing agroforestry, you can sequester carbon and potentially sell carbon credits on the market.", icon: DollarSign });
    return opportunities;
}

// --- Skeleton Component ---

const AiAnalysisSkeleton = () => (
  <Card>
    <CardHeader>
      <CardTitle>AI-Powered Predictive Analysis</CardTitle>
      <CardDescription>Actionable insights to maximize the value of your land asset.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <Skeleton className="h-6 w-1/2 mb-3" />
        <Skeleton className="h-4 w-full mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <Skeleton className="h-6 w-1/2 mb-3" />
        <Skeleton className="h-4 w-full mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <ul className="list-disc list-inside text-sm space-y-2">
            <li><Skeleton className="h-4 w-4/5" /></li>
            <li><Skeleton className="h-4 w-3/5" /></li>
            <li><Skeleton className="h-4 w-4/5" /></li>
          </ul>
        </div>
      </div>
      <Separator />
      <div>
        <Skeleton className="h-6 w-1/2 mb-3" />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 p-3 rounded-lg">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="w-full space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 rounded-lg">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="w-full space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);


// --- Main Component ---

const AiAnalysisPanel = ({ claim }: AiAnalysisPanelProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Simulate AI processing time

    return () => clearTimeout(timer);
  }, [claim]);

  if (isLoading) {
    return <AiAnalysisSkeleton />;
  }

  const soilData = getSoilAnalysis(claim.soilType);
  const waterData = getWaterAnalysis(claim.waterAvailability);
  const economicData = getEconomicOpportunities(claim);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Predictive Analysis</CardTitle>
        <CardDescription>Actionable insights to maximize the value of your land asset.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Soil & Crop Section */}
        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center"><Sprout className="mr-2 h-5 w-5 text-green-600" /> Soil & Crop Analysis</h3>
          <p className="text-sm text-muted-foreground mb-3">
            <span className="font-medium text-foreground">{claim.soilType} Soil:</span> {soilData.description}
          </p>
          <div className="space-y-2">
            <h4 className="font-medium">Recommended Crops:</h4>
            <div className="flex flex-wrap gap-2">
              {soilData.crops.map(crop => (
                <div key={crop} className="flex items-center bg-muted p-2 rounded-md">
                  <Leaf className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">{crop}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Water Resource Section */}
        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center"><Droplets className="mr-2 h-5 w-5 text-blue-600" /> Water Resource Analysis</h3>
          <p className="text-sm text-muted-foreground mb-3">
            <span className="font-medium text-foreground">Water Availability ({claim.waterAvailability}):</span> {waterData.description}
          </p>
          <div className="space-y-2">
            <h4 className="font-medium">Key Recommendations:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {waterData.recommendations.map(rec => <li key={rec}>{rec}</li>)}
            </ul>
          </div>
        </div>

        <Separator />

        {/* Economic Opportunity Section */}
        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center"><DollarSign className="mr-2 h-5 w-5 text-yellow-600" /> Economic Opportunity Analysis</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {economicData.map(opp => (
              <div key={opp.name} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                <opp.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">{opp.name}</p>
                  <p className="text-sm text-muted-foreground">{opp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiAnalysisPanel;