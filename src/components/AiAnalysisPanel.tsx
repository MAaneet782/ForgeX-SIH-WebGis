import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import type { Claim } from "@/data/mockClaims";
import { Leaf, Sprout, Droplets, DollarSign, CalendarDays, BadgeIndianRupee, Waves, Globe, Briefcase } from "lucide-react"; // Import all necessary icons
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { runPredictiveAnalysis, type AnalysisResult, type CropRecommendation, type WaterAnalysis, type EconomicOpportunity } from "@/lib/ai-analysis";

interface AiAnalysisPanelProps {
  claim: Claim;
}

// Helper to map iconName string to LucideReact icon component
const getIconComponent = (iconName: string | undefined) => {
  switch (iconName) {
    case 'CalendarDays': return CalendarDays;
    case 'BadgeIndianRupee': return BadgeIndianRupee;
    case 'Waves': return Waves;
    case 'Globe': return Globe;
    case 'Briefcase': return Briefcase;
    case 'DollarSign': return DollarSign;
    default: return Leaf; // Default icon
  }
};

// --- Skeleton Component ---
const AiAnalysisSkeleton = () => (
  <Card>
    <CardHeader>
      <CardTitle>AI-Powered Predictive Analysis</CardTitle>
      <CardDescription>Generating actionable insights for your land asset...</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <Skeleton className="h-6 w-1/2 mb-4" />
        <div className="space-y-4">
          <Card><CardContent className="pt-6"><Skeleton className="h-5 w-1/3 mb-2" /><Skeleton className="h-4 w-full" /></CardContent></Card>
          <Card><CardContent className="pt-6"><Skeleton className="h-5 w-1/3 mb-2" /><Skeleton className="h-4 w-full" /></CardContent></Card>
        </div>
      </div>
      <Separator />
      <div>
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-5 w-1/4 mb-2" />
        <Skeleton className="h-6 w-full mb-4" />
        <ul className="list-disc list-inside text-sm space-y-2">
          <li><Skeleton className="h-4 w-4/5" /></li>
          <li><Skeleton className="h-4 w-3/5" /></li>
        </ul>
      </div>
    </CardContent>
  </Card>
);

// --- Main Component ---
const AiAnalysisPanel = ({ claim }: AiAnalysisPanelProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const results = runPredictiveAnalysis(claim);
      setAnalysis(results);
      setIsLoading(false);
    }, 1500); // Simulate advanced model processing time

    return () => clearTimeout(timer);
  }, [claim]);

  if (isLoading || !analysis) {
    return <AiAnalysisSkeleton />;
  }

  const { cropAnalysis, waterAnalysis, economicOpportunities } = analysis;

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Predictive Analysis</CardTitle>
        <CardDescription>Actionable insights to maximize the value of your land asset.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Soil & Crop Section */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center"><Sprout className="mr-2 h-5 w-5 text-green-600" /> Crop Recommendations ({claim.soilType} Soil)</h3>
          <div className="space-y-4">
            {cropAnalysis.map((crop: CropRecommendation) => {
              const IconComponent = getIconComponent(crop.iconName);
              return (
                <Card key={crop.name} className="bg-muted/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-medium flex items-center"><Leaf className="mr-2 h-4 w-4 text-green-500" />{crop.name}</CardTitle>
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-semibold">{crop.sowingSeason}</p>
                    <p className="text-sm text-muted-foreground mt-1">{crop.subsidyInfo}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Water Resource Section */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center"><Droplets className="mr-2 h-5 w-5 text-blue-600" /> Water Resource Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Borewell Suitability Index:</h4>
              <span className={`font-bold text-lg ${waterAnalysis.score > 75 ? 'text-green-600' : waterAnalysis.score > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {waterAnalysis.score} / 100
              </span>
            </div>
            <Progress value={waterAnalysis.score} className="w-full" />
            <p className="text-sm text-center font-medium text-muted-foreground">{waterAnalysis.borewellSuitability}</p>
          </div>
          <div className="mt-4 space-y-2">
            <h4 className="font-medium">Key Recommendations:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {waterAnalysis.recommendations.map((rec: string) => <li key={rec}>{rec}</li>)}
            </ul>
          </div>
        </div>

        <Separator />

        {/* Economic Opportunity Section */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center"><DollarSign className="mr-2 h-5 w-5 text-yellow-600" /> Economic Opportunity Analysis</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {economicOpportunities.map((opp: EconomicOpportunity) => {
              const IconComponent = getIconComponent(opp.iconName);
              return (
                <div key={opp.name} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <IconComponent className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">{opp.name}</p>
                    <p className="text-sm text-muted-foreground">{opp.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiAnalysisPanel;