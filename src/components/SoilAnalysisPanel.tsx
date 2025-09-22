import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Claim } from "@/types"; // Updated import
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getSoilCompositionData,
  getSoilHealthAssessment,
  getSoilHealthRecommendations,
  getSoilCropRecommendations,
  type SoilComposition,
  type SoilHealthAssessmentResult,
  type SoilHealthRecommendation,
  type SoilCropRecommendation,
} from "@/lib/soil-analysis";
import { LeafyGreen, HeartPulse, Lightbulb, Sprout } from "lucide-react";
import { cn } from "@/lib/utils"; // Import cn utility

interface SoilAnalysisPanelProps {
  claim: Claim;
}

// --- Skeleton Component ---
const SoilAnalysisSkeleton = () => (
  <Card>
    <CardHeader>
      <CardTitle>Soil Health & Crop Recommendations</CardTitle>
      <CardDescription>Analyzing soil data and generating insights...</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <Skeleton className="h-6 w-1/3 mb-4" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Separator />
      <Skeleton className="h-6 w-1/2 mb-4" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Separator />
      <Skeleton className="h-6 w-1/3 mb-4" />
      <Skeleton className="h-24 w-full" />
      <Separator />
      <Skeleton className="h-6 w-1/3 mb-4" />
      <Skeleton className="h-24 w-full" />
    </CardContent>
  </Card>
);

// --- Main Component ---
const SoilAnalysisPanel = ({ claim }: SoilAnalysisPanelProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [composition, setComposition] = useState<SoilComposition | null>(null);
  const [assessment, setAssessment] = useState<SoilHealthAssessmentResult | null>(null);
  const [recommendations, setRecommendations] = useState<SoilHealthRecommendation[]>([]);
  const [cropRecommendations, setCropRecommendations] = useState<SoilCropRecommendation[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const soilComposition = getSoilCompositionData(claim);
      const healthAssessment = getSoilHealthAssessment(soilComposition);
      const healthRecommendations = getSoilHealthRecommendations(soilComposition, healthAssessment);
      const cropRecs = getSoilCropRecommendations(claim, soilComposition, healthAssessment); // Pass claim here

      setComposition(soilComposition);
      setAssessment(healthAssessment);
      setRecommendations(healthRecommendations);
      setCropRecommendations(cropRecs);
      setIsLoading(false);
    }, 2000); // Simulate data fetching/analysis time

    return () => clearTimeout(timer);
  }, [claim]);

  if (isLoading || !composition || !assessment) {
    return <SoilAnalysisSkeleton />;
  }

  const getStatusColor = (status: SoilHealthAssessmentResult['status']) => {
    switch (status) {
      case 'Excellent': return 'bg-green-500';
      case 'Good': return 'bg-lime-500';
      case 'Moderate': return 'bg-yellow-500';
      case 'Poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSuitabilityColor = (suitability: SoilCropRecommendation['suitability']) => {
    switch (suitability) {
      case 'High': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Low': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Soil Health & Crop Recommendations</CardTitle>
        <CardDescription>Detailed analysis of your land's soil composition and potential.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Soil Composition */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center"><LeafyGreen className="mr-2 h-5 w-5 text-green-600" /> Soil Composition</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
            {Object.entries(composition).map(([key, value]) => (
              <div key={key} className="flex flex-col p-2 border rounded-md bg-muted/20">
                <span className="text-muted-foreground text-xs">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="font-medium">{value} {key === 'N' || key === 'P' || key === 'K' || key === 'Mg' || key === 'Fe' || key === 'Zn' || key === 'Mn' ? 'ppm' : key === 'pH' ? '' : key === 'EC' ? 'mS/cm' : key === 'Temperature' ? '°C' : key === 'Humidity' ? '%' : key === 'Rainfall' ? 'mm' : '%'}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Soil Health Assessment */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center"><HeartPulse className="mr-2 h-5 w-5 text-red-600" /> Soil Health Assessment</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Overall Soil Quality:</h4>
              <span className={`font-bold text-lg text-white px-3 py-1 rounded-full ${getStatusColor(assessment.status)}`}>
                {assessment.status} ({assessment.overallScore}%)
              </span>
            </div>
            <Progress value={assessment.overallScore} className={cn("w-full", getStatusColor(assessment.status))} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="font-medium mb-1">Strengths:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {assessment.strengths.length > 0 ? assessment.strengths.map(s => <li key={s}>{s}</li>) : <li>No major strengths identified.</li>}
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Deficiencies:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {assessment.deficiencies.length > 0 ? assessment.deficiencies.map(d => <li key={d}>{d}</li>) : <li>No major deficiencies identified.</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Actionable Recommendations */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-yellow-600" /> Actionable Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <Card key={index} className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">{rec.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Crop Recommendations */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center"><Sprout className="mr-2 h-5 w-5 text-blue-600" /> Crop Recommendations</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop</TableHead>
                <TableHead>Suitability</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cropRecommendations.length > 0 ? (
                cropRecommendations.map((crop, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{crop.name}</TableCell>
                    <TableCell><Badge className={cn(getSuitabilityColor(crop.suitability))}>{crop.suitability}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{crop.reason}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">No specific crop recommendations at this time.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoilAnalysisPanel;