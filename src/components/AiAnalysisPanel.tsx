import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import type { Claim } from "@/data/mockClaims";
import { Leaf, Sprout, Droplets, DollarSign, Waves, Globe, Briefcase, CalendarDays, BadgeIndianRupee, AlertCircle, Package, Lightbulb, FlaskConical, HeartPulse, Microscope, Tally1, Thermometer, CloudRain, Droplet, Sun, Wind, CheckCircle2, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query"; // Import useQuery
import { Skeleton } from "@/components/ui/skeleton";
import { type AnalysisResult } from "@/lib/ai-analysis";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

interface AiAnalysisPanelProps {
  claim: Claim;
}

// --- Icon Mapping ---
// Maps icon names from the backend to actual Lucide components
const iconMap: { [key: string]: React.ElementType } = {
  Waves,
  Globe,
  Briefcase,
  DollarSign,
  CalendarDays,
  BadgeIndianRupee,
  Leaf,
};

// --- Soil Parameter Icons ---
const soilParamIcons: { [key: string]: React.ElementType } = {
  N: FlaskConical, P: FlaskConical, K: FlaskConical,
  pH: Microscope, EC: Tally1, OM: Leaf, CaCO3: FlaskConical,
  Sand: Wind, Silt: Droplet, Clay: FlaskConical,
  Temperature: Thermometer, Humidity: Droplet, Rainfall: CloudRain,
  Mg: FlaskConical, Fe: FlaskConical, Zn: FlaskConical, Mn: FlaskConical,
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
      <Separator />
      <div>
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
      <Separator />
      <div>
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    </CardContent>
  </Card>
);

// --- Main Component ---
const AiAnalysisPanel = ({ claim }: AiAnalysisPanelProps) => {
  const { supabase } = useAuth();

  const { data: analysis, isLoading, isError, error } = useQuery<AnalysisResult, Error>({
    queryKey: ['aiAnalysis', claim.id],
    queryFn: async () => {
      // 1. Try to fetch from Supabase cache first
      const { data: cachedData, error: fetchError } = await supabase
        .from('ai_analysis_results')
        .select('analysis_data')
        .eq('claim_id', claim.id)
        .single();

      if (cachedData && cachedData.analysis_data) {
        return cachedData.analysis_data as AnalysisResult;
      }

      // 2. If not in cache or error fetching cache, invoke Edge Function
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means 'no rows found'
        console.warn("Error fetching AI analysis from cache, invoking Edge Function:", fetchError.message);
      }

      const { data, error: functionError } = await supabase.functions.invoke('predictive-analysis', {
        body: { claim },
      });

      if (functionError) throw functionError;
      
      return data as AnalysisResult;
    },
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  if (isLoading) {
    return <AiAnalysisSkeleton />;
  }

  if (isError || !analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Predictive Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>
              Could not retrieve predictive analysis. {error?.message || "An unknown error occurred."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const { cropAnalysis, waterAnalysis, economicOpportunities, soilAnalysis } = analysis;

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Predictive Analysis</CardTitle>
        <CardDescription>Actionable insights to maximize the value of your land asset.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Soil & Crop Section */}
        {cropAnalysis && cropAnalysis.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center"><Sprout className="mr-2 h-5 w-5 text-green-600" /> Crop Recommendations ({claim.soilType} Soil)</h3>
            <div className="space-y-4">
              {cropAnalysis.map(crop => {
                const Icon = iconMap[crop.iconName] || Leaf;
                return (
                  <Card key={crop.name} className="bg-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-base font-medium flex items-center"><Leaf className="mr-2 h-4 w-4 text-green-500" />{crop.name}</CardTitle>
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">{crop.sowingSeason}</span>
                        <div className="flex items-center font-semibold">
                          <Package className="mr-1.5 h-4 w-4 text-primary" />
                          <span>{crop.potentialYield}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{crop.subsidyInfo}</p>
                      <div className="flex items-start space-x-2 pt-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Recommendation:</span> {crop.recommendation}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        <Separator className="my-8" />

        {/* NEW: Soil Composition Section */}
        {soilAnalysis?.parameters && Object.keys(soilAnalysis.parameters).length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center"><FlaskConical className="mr-2 h-5 w-5 text-gray-600" /> Soil Composition</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
              {Object.entries(soilAnalysis.parameters).map(([key, value]) => {
                const Icon = soilParamIcons[key] || FlaskConical;
                let unit = '';
                if (['N', 'P', 'K', 'Mg', 'Fe', 'Zn', 'Mn'].includes(key)) unit = ' ppm';
                else if (['OM', 'CaCO3', 'Sand', 'Silt', 'Clay', 'Humidity'].includes(key)) unit = ' %';
                else if (key === 'pH') unit = '';
                else if (key === 'EC') unit = ' mS/cm';
                else if (key === 'Temperature') unit = ' °C';
                else if (key === 'Rainfall') unit = ' mm';

                return (
                  <div key={key} className="flex items-center space-x-2 bg-muted/50 p-2 rounded-md">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{key}:</p>
                      <p className="text-muted-foreground">{value}{unit}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Separator className="my-8" />

        {/* NEW: Soil Health Assessment */}
        {soilAnalysis?.healthAssessment && (
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center"><HeartPulse className="mr-2 h-5 w-5 text-red-600" /> Soil Health Assessment</h3>
            <Card className="bg-muted/50">
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Overall Quality:</h4>
                  <Badge 
                    className={
                      soilAnalysis.healthAssessment.overallQuality === 'Excellent' ? 'bg-green-500' :
                      soilAnalysis.healthAssessment.overallQuality === 'Good' ? 'bg-blue-500' :
                      soilAnalysis.healthAssessment.overallQuality === 'Moderate' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }
                  >
                    {soilAnalysis.healthAssessment.overallQuality}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Fertility Score:</h4>
                  <span className="font-bold text-lg">{soilAnalysis.healthAssessment.fertilityScore} / 100</span>
                </div>
                <Progress value={soilAnalysis.healthAssessment.fertilityScore} className="w-full" />
                
                <div className="space-y-2 mt-4">
                  <h5 className="font-medium flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Strengths:</h5>
                  <ul className="list-disc list-inside text-sm pl-4 text-muted-foreground">
                    {soilAnalysis.healthAssessment.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium flex items-center"><XCircle className="mr-2 h-4 w-4 text-red-600" /> Deficiencies:</h5>
                  <ul className="list-disc list-inside text-sm pl-4 text-muted-foreground">
                    {soilAnalysis.healthAssessment.deficiencies.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Separator className="my-8" />

        {/* NEW: Soil Health Recommendations */}
        {soilAnalysis?.recommendations && soilAnalysis.recommendations.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-yellow-600" /> Soil Health Recommendations</h3>
            <div className="space-y-4">
              {soilAnalysis.recommendations.map((rec, i) => (
                <Card key={i} className="bg-muted/50">
                  <CardContent className="pt-4 space-y-2">
                    <p className="font-semibold">{rec.action} <Badge variant="secondary">{rec.category}</Badge></p>
                    <p className="text-sm text-muted-foreground">{rec.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-8" />

        {/* Water Resource Section */}
        {waterAnalysis && (
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
              <p className="text-sm text-center font-medium text-muted-foreground mt-2">{waterAnalysis.borewellSuitability}</p>
            </div>
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Key Recommendations:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {waterAnalysis.recommendations.map(rec => <li key={rec}>{rec}</li>)}
              </ul>
            </div>
          </div>
        )}

        <Separator className="my-8" />

        {/* Economic Opportunity Section */}
        {economicOpportunities && economicOpportunities.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center"><DollarSign className="mr-2 h-5 w-5 text-yellow-600" /> Economic Opportunity Analysis</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {economicOpportunities.map(opp => {
                const Icon = iconMap[opp.iconName] || DollarSign;
                return (
                  <div key={opp.name} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{opp.name}</p>
                      <p className="text-sm text-muted-foreground">{opp.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiAnalysisPanel;