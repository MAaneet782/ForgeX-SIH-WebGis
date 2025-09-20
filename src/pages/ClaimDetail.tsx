import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Leaf, Sprout, Droplets, DollarSign, Waves, Globe, Briefcase, CalendarDays, BadgeIndianRupee, AlertCircle, Package, Lightbulb, FlaskConical, HeartPulse, Microscope, Tally1, Thermometer, CloudRain, Droplet, Sun, Wind, CheckCircle2, XCircle, Info, HandCoins, Home, Users, ShieldCheck, IndianRupee, ArrowUpRight } from "lucide-react";
import type { Claim } from "@/data/mockClaims";
import { Skeleton } from "@/components/ui/skeleton";
import ClaimLocationMap from "@/components/ClaimLocationMap";
import { useMemo, useState, useEffect } from "react";
import L from 'leaflet';
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { type AnalysisResult } from "@/lib/ai-analysis";

// --- Type Definitions for Scheme Eligibility (moved from SchemeEligibility.tsx) ---
interface SchemeDetail {
  name: string;
  url: string;
  isEligible: boolean;
  eligibilityConditions: string[];
  keyBenefits: string[];
  verificationProcess: string[];
  intendedCoverage: string;
  reason: string; // Short reason for eligibility/ineligibility
}

// --- Icon Mapping for AI Analysis (moved from AiAnalysisPanel.tsx) ---
const iconMap: { [key: string]: React.ElementType } = {
  Waves,
  Globe,
  Briefcase,
  DollarSign,
  CalendarDays,
  BadgeIndianRupee,
  Leaf,
};

// --- Soil Parameter Icons (moved from AiAnalysisPanel.tsx) ---
const soilParamIcons: { [key: string]: React.ElementType } = {
  N: FlaskConical, P: FlaskConical, K: FlaskConical,
  pH: Microscope, EC: Tally1, OM: Leaf, CaCO3: FlaskConical,
  Sand: Wind, Silt: Droplet, Clay: FlaskConical,
  Temperature: Thermometer, Humidity: Droplet, Rainfall: CloudRain,
  Mg: FlaskConical, Fe: FlaskConical, Zn: FlaskConical, Mn: FlaskConical,
};

// --- Skeleton Components (adapted from AiAnalysisPanel.tsx and SchemeEligibility.tsx) ---
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

const SchemeEligibilitySkeleton = () => (
  <Card>
    <CardHeader>
      <CardTitle>Government Scheme Eligibility</CardTitle>
      <CardDescription>Analyzing eligibility for various government schemes...</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-4 w-4/5 mb-3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </CardContent>
  </Card>
);

const ClaimDetail = () => {
  const { claimId } = useParams<{ claimId: string }>();
  const { user, supabase } = useAuth();

  // Find the claim from local mockClaims (assuming mockClaims is imported from data/mockClaims)
  // In a real app, this would be fetched from Supabase or a global state.
  // For this demo, we'll use the mockClaims directly.
  const [claims, setClaims] = useState<Claim[]>([]); // State to hold claims
  useEffect(() => {
    // Simulate fetching claims, or directly use mockClaims
    import("@/data/mockClaims").then(module => {
      setClaims(module.mockClaims);
    });
  }, []);

  const claim = useMemo(() => claims.find(c => c.id === claimId), [claims, claimId]);
  const isLoadingClaim = claims.length === 0; // Loading if mockClaims not yet loaded
  const isErrorClaim = !claim && !isLoadingClaim; // If claim is not found after loading, consider it an error

  // Calculate the water index location (centroid of the claim's geometry)
  const waterIndexLocation = useMemo(() => {
    if (claim?.geometry) {
      // @ts-ignore
      const bounds = L.geoJSON(claim.geometry).getBounds();
      if (bounds.isValid()) {
        const center = bounds.getCenter();
        return center;
      }
    }
    return undefined;
  }, [claim?.geometry]);

  // --- AI Analysis Data Fetching ---
  const { data: analysis, isLoading: isLoadingAnalysis, isError: isErrorAnalysis, error: analysisError } = useQuery<AnalysisResult, Error>({
    queryKey: ['aiAnalysis', claim?.id],
    queryFn: async () => {
      if (!claim?.id) throw new Error("Claim ID is missing for AI analysis.");

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
    enabled: !!claim?.id, // Only run query if claim.id is available
    staleTime: Infinity, // Data is always fresh once fetched
    gcTime: Infinity,    // Keep data in cache indefinitely
    refetchOnWindowFocus: false,
  });

  // --- Scheme Eligibility Data Fetching ---
  const { data: schemes, isLoading: isLoadingSchemes, isError: isErrorSchemes, error: schemesError } = useQuery<SchemeDetail[], Error>({
    queryKey: ['schemeEligibility', claim?.id],
    queryFn: async () => {
      if (!claim) throw new Error("Claim data is missing for scheme eligibility.");

      const { data, error: functionError } = await supabase.functions.invoke('scheme-eligibility', {
        body: { claim },
      });

      if (functionError) throw functionError;
      
      return data.schemes as SchemeDetail[];
    },
    enabled: !!claim, // Only run query if claim is available
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  if (isLoadingClaim || !user) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-8 w-1/2" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isErrorClaim || !claim) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Claim not found or you do not have access.</h2>
        <Button asChild variant="link">
          <Link to="/atlas">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <Button asChild variant="outline" className="mb-4">
        <Link to="/atlas"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
      </Button>
      
      <header>
        <h1 className="text-3xl font-bold">Personal Dashboard for {claim.holderName}</h1>
        <p className="text-muted-foreground">Claim ID: {claim.id} | Village: {claim.village}</p>
      </header>

      {/* Claim Overview Section */}
      <section className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Claim Information</CardTitle>
            <CardDescription>Key details about the land parcel and its holder.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Claim ID:</span> <span className="font-mono">{claim.id}</span></div>
            <div className="flex justify-between"><span>Holder Name:</span> <span>{claim.holderName}</span></div>
            <div className="flex justify-between"><span>Village:</span> <span>{claim.village}</span></div>
            <div className="flex justify-between"><span>District:</span> <span>{claim.district}</span></div>
            <div className="flex justify-between"><span>State:</span> <span>{claim.state}</span></div>
            <div className="flex justify-between"><span>Area:</span> <span>{claim.area.toFixed(2)} acres</span></div>
            <div className="flex justify-between items-center"><span>Status:</span> <Badge variant={claim.status === 'Approved' ? 'default' : claim.status === 'Pending' ? 'secondary' : 'destructive'}>{claim.status}</Badge></div>
            <div className="flex justify-between"><span>Soil Type:</span> <span>{claim.soilType}</span></div>
            <div className="flex justify-between"><span>Water Availability:</span> <span>{claim.waterAvailability}</span></div>
            <div className="flex justify-between"><span>Estimated Crop Value:</span> <span>₹{claim.estimatedCropValue.toLocaleString()}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Parcel Location</CardTitle>
            <CardDescription>Geographical location of the claimed land.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 p-0">
            <ClaimLocationMap geometry={claim.geometry!} waterIndexLocation={waterIndexLocation} />
          </CardContent>
        </Card>
      </section>

      {/* AI-Powered Predictive Analysis Section */}
      <section>
        {isLoadingAnalysis ? (
          <AiAnalysisSkeleton />
        ) : isErrorAnalysis || !analysis ? (
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Predictive Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>
                  Could not retrieve predictive analysis. {analysisError?.message || "An unknown error occurred."}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Predictive Analysis</CardTitle>
              <CardDescription>Actionable insights to maximize the value of your land asset.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Soil Composition */}
              {analysis.soilAnalysis?.parameters && Object.keys(analysis.soilAnalysis.parameters).length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center"><FlaskConical className="mr-2 h-5 w-5 text-gray-600" /> Soil Composition</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
                    {Object.entries(analysis.soilAnalysis.parameters).map(([key, value]) => {
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

              {/* Soil Health Assessment */}
              {analysis.soilAnalysis?.healthAssessment && (
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center"><HeartPulse className="mr-2 h-5 w-5 text-red-600" /> Soil Health Assessment</h3>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Overall Quality:</h4>
                        <Badge 
                          className={
                            analysis.soilAnalysis.healthAssessment.overallQuality === 'Excellent' ? 'bg-green-500' :
                            analysis.soilAnalysis.healthAssessment.overallQuality === 'Good' ? 'bg-blue-500' :
                            analysis.soilAnalysis.healthAssessment.overallQuality === 'Moderate' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }
                        >
                          {analysis.soilAnalysis.healthAssessment.overallQuality}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Fertility Score:</h4>
                        <span className="font-bold text-lg">{analysis.soilAnalysis.healthAssessment.fertilityScore} / 100</span>
                      </div>
                      <Progress value={analysis.soilAnalysis.healthAssessment.fertilityScore} className="w-full" />
                      
                      <div className="space-y-2 mt-4">
                        <h5 className="font-medium flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Strengths:</h5>
                        <ul className="list-disc list-inside text-sm pl-4 text-muted-foreground">
                          {analysis.soilAnalysis.healthAssessment.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium flex items-center"><XCircle className="mr-2 h-4 w-4 text-red-600" /> Deficiencies:</h5>
                        <ul className="list-disc list-inside text-sm pl-4 text-muted-foreground">
                          {analysis.soilAnalysis.healthAssessment.deficiencies.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Separator className="my-8" />

              {/* Soil Health Recommendations */}
              {analysis.soilAnalysis?.recommendations && analysis.soilAnalysis.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-yellow-600" /> Soil Health Recommendations</h3>
                  <div className="space-y-4">
                    {analysis.soilAnalysis.recommendations.map((rec, i) => (
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

              {/* Crop Recommendations */}
              {analysis.cropAnalysis && analysis.cropAnalysis.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center"><Sprout className="mr-2 h-5 w-5 text-green-600" /> Crop Recommendations ({claim.soilType} Soil)</h3>
                  <div className="space-y-4">
                    {analysis.cropAnalysis.map(crop => {
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

              {/* Water Resource Section */}
              {analysis.waterAnalysis && (
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center"><Droplets className="mr-2 h-5 w-5 text-blue-600" /> Water Resource Analysis</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Borewell Suitability Index:</h4>
                      <span className={`font-bold text-lg ${analysis.waterAnalysis.score > 75 ? 'text-green-600' : analysis.waterAnalysis.score > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {analysis.waterAnalysis.score} / 100
                      </span>
                    </div>
                    <Progress value={analysis.waterAnalysis.score} className="w-full" />
                    <p className="text-sm text-center font-medium text-muted-foreground mt-2">{analysis.waterAnalysis.borewellSuitability}</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium">Key Recommendations:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {analysis.waterAnalysis.recommendations.map(rec => <li key={rec}>{rec}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              <Separator className="my-8" />

              {/* Economic Opportunity Section */}
              {analysis.economicOpportunities && analysis.economicOpportunities.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center"><DollarSign className="mr-2 h-5 w-5 text-yellow-600" /> Economic Opportunity Analysis</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {analysis.economicOpportunities.map(opp => {
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
        )}
      </section>

      {/* Government Scheme Eligibility Section */}
      <section>
        {isLoadingSchemes ? (
          <SchemeEligibilitySkeleton />
        ) : isErrorSchemes || !schemes ? (
          <Card>
            <CardHeader>
              <CardTitle>Government Scheme Eligibility</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Eligibility Analysis Failed</AlertTitle>
                <AlertDescription>
                  Could not retrieve scheme eligibility. {schemesError?.message || "An unknown error occurred."}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Government Scheme Eligibility</CardTitle>
              <CardDescription>Analysis of relevant government schemes based on claim details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {schemes.map((scheme) => (
                  <Card key={scheme.name} className="bg-card transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold">{scheme.name}</CardTitle>
                        <Badge 
                          variant={scheme.isEligible ? 'default' : 'destructive'} 
                          className={cn(
                            scheme.isEligible && "bg-green-500 hover:bg-green-600 text-white"
                          )}
                        >
                          {scheme.isEligible ? 'Eligible' : 'Not Eligible'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{scheme.reason}</p>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <h5 className="font-medium flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Eligibility Conditions</h5>
                        <ul className="list-disc list-inside pl-4 text-muted-foreground">
                          {scheme.eligibilityConditions.map((condition, i) => <li key={i}>{condition}</li>)}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium flex items-center"><IndianRupee className="mr-2 h-4 w-4 text-blue-600" /> Key Benefits</h5>
                        <ul className="list-disc list-inside pl-4 text-muted-foreground">
                          {scheme.keyBenefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-purple-600" /> Verification Process</h5>
                        <ul className="list-disc list-inside pl-4 text-muted-foreground">
                          {scheme.verificationProcess.map((process, i) => <li key={i}>{process}</li>)}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium flex items-center"><Users className="mr-2 h-4 w-4 text-orange-600" /> Intended Coverage</h5>
                        <p className="pl-4 text-muted-foreground">{scheme.intendedCoverage}</p>
                      </div>
                      <a 
                        href={scheme.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm font-medium text-primary hover:underline flex items-center mt-4"
                      >
                        Visit Scheme Website <ArrowUpRight className="ml-1 h-4 w-4" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
};

export default ClaimDetail;