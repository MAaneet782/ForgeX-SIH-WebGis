import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { mockClaims as localMockClaims } from "@/data/mockClaims";
import type { Claim } from "@/data/mockClaims";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import L from 'leaflet';
import { useAuth } from "@/context/AuthContext";
import { type AnalysisResult } from "@/lib/ai-analysis";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card"; // Import Card and CardContent

// Import new modular components
import ClaimInfoCard from "@/components/claim-detail/ClaimInfoCard";
import ParcelLocationCard from "@/components/claim-detail/ParcelLocationCard";
import SchemeEligibilitySection from "@/components/claim-detail/SchemeEligibilitySection";
import AiAnalysisSection from "@/components/claim-detail/AiAnalysisSection";
import SoilAnalysisSection from "@/components/claim-detail/SoilAnalysisSection"; // New import

// --- Type Definitions for Scheme Eligibility ---
interface SchemeDetail {
  name: string;
  url: string;
  isEligible: boolean;
  eligibilityConditions: string[];
  schemeOverview: string;
  keyBenefits: string[];
  verificationProcess: string[];
  intendedCoverage: string;
  reason: string;
}

// Re-use the fetchClaims function for consistency
const fetchClaims = async (): Promise<Claim[]> => {
  const { data, error } = await supabase.from('claims').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data.map(item => ({
    id: item.claim_id,
    holderName: item.holder_name,
    village: item.village,
    district: item.district,
    state: item.state,
    area: item.area,
    status: item.status,
    documentName: item.document_name,
    soilType: item.soil_type,
    waterAvailability: item.water_availability,
    estimatedCropValue: item.estimated_crop_value,
    created_at: item.created_at,
    geometry: item.geometry,
  }));
};

// Component for unauthenticated message
const UnauthenticatedCard = () => (
  <Card className="h-full flex items-center justify-center">
    <CardContent className="text-center text-muted-foreground py-12">
      <p className="mb-4">Please <Link to="/login" className="text-primary underline">log in</Link> to view this section.</p>
      <Button asChild>
        <Link to="/login">Go to Login</Link>
      </Button>
    </CardContent>
  </Card>
);

const ClaimDetail = () => {
  const { claimId } = useParams<{ claimId: string }>();
  const { user, supabase, isLoading: isLoadingAuth } = useAuth();

  // Fetch claims from Supabase and combine with local mock claims
  const { data: supabaseClaims = [], isLoading: isLoadingSupabaseClaims, isError: isErrorSupabaseClaims } = useQuery<Claim[]>({
    queryKey: ['claims'],
    queryFn: fetchClaims,
    enabled: !isLoadingAuth, // Fetch claims once auth state is known
  });

  const combinedClaims = useMemo(() => {
    const uniqueClaimsMap = new Map<string, Claim>();
    supabaseClaims.forEach(claim => uniqueClaimsMap.set(claim.id, claim));
    localMockClaims.forEach(claim => {
      if (!uniqueClaimsMap.has(claim.id)) {
        uniqueClaimsMap.set(claim.id, claim);
      }
    });
    return Array.from(uniqueClaimsMap.values());
  }, [supabaseClaims]);

  const claim = useMemo(() => combinedClaims.find(c => c.id === claimId), [combinedClaims, claimId]);
  const isLoadingClaim = isLoadingSupabaseClaims;
  const isErrorClaim = isErrorSupabaseClaims || (!claim && !isLoadingClaim); // Refined error check

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

      console.log("Attempting to fetch AI analysis for claim ID:", claim.id);

      // 1. Try to fetch from Supabase cache first
      const { data: cachedData, error: fetchError } = await supabase
        .from('ai_analysis_results')
        .select('analysis_data')
        .eq('claim_id', claim.id)
        .single();

      if (cachedData && cachedData.analysis_data) {
        console.log("AI analysis found in Supabase cache:", cachedData.analysis_data);
        return cachedData.analysis_data as AnalysisResult;
      }

      // 2. If not in cache or error fetching cache, invoke Edge Function
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.warn("Error fetching AI analysis from cache, invoking Edge Function:", fetchError.message);
      } else if (fetchError && fetchError.code === 'PGRST116') {
        console.log("AI analysis not found in Supabase cache, invoking Edge Function.");
      } else {
        console.log("No cached data, invoking Edge Function.");
      }

      const { data, error: functionError } = await supabase.functions.invoke('predictive-analysis', {
        body: { claim },
      });

      if (functionError) {
        console.error("Error invoking predictive-analysis Edge Function:", functionError);
        throw functionError;
      }
      
      console.log("AI analysis from Edge Function:", data);
      if (!data) {
        throw new Error("Predictive analysis function returned no data.");
      }
      return data as AnalysisResult;
    },
    enabled: !!claim?.id && !!user && !isLoadingAuth, // Only enabled if claim exists, user is logged in, and auth is not loading
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // --- Scheme Eligibility Data Fetching ---
  const { data: schemes, isLoading: isLoadingSchemes, isError: isErrorSchemes, error: schemesError } = useQuery<SchemeDetail[], Error>({
    queryKey: ['schemeEligibility', claim?.id],
    queryFn: async () => {
      if (!claim?.id) throw new Error("Claim ID is missing for scheme eligibility.");

      console.log("Attempting to fetch scheme eligibility for claim ID:", claim.id);

      // 1. Try to fetch from Supabase cache first
      const { data: cachedData, error: fetchError } = await supabase
        .from('scheme_eligibility_cache')
        .select('eligibility_data')
        .eq('claim_id', claim.id)
        .single();

      if (cachedData && cachedData.eligibility_data) {
        console.log("Scheme eligibility found in Supabase cache:", cachedData.eligibility_data);
        return cachedData.eligibility_data as SchemeDetail[];
      }

      // 2. If not in cache or error fetching cache, invoke Edge Function
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.warn("Error fetching scheme eligibility from cache, invoking Edge Function:", fetchError.message);
      } else if (fetchError && fetchError.code === 'PGRST116') {
        console.log("Scheme eligibility not found in Supabase cache, invoking Edge Function.");
      } else {
        console.log("No cached data, invoking Edge Function.");
      }

      const { data, error: functionError } = await supabase.functions.invoke('scheme-eligibility', {
        body: { claim },
      });

      if (functionError) {
        console.error("Error invoking scheme-eligibility Edge Function:", functionError);
        throw functionError;
      }
      
      console.log("Scheme eligibility from Edge Function:", data.schemes);
      if (!data || !data.schemes) {
        throw new Error("Scheme eligibility function returned no data.");
      }
      return data.schemes as SchemeDetail[];
    },
    enabled: !!claim?.id && !!user && !isLoadingAuth, // Only enabled if claim exists, user is logged in, and auth is not loading
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // If authentication is still loading, show a full page skeleton
  if (isLoadingAuth) {
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-4"> {/* Reduced space-y-6 to space-y-4 */}
      <Button asChild variant="outline" className="mb-4">
        <Link to="/atlas"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
      </Button>
      
      <header>
        <h1 className="text-3xl font-bold">Personal Dashboard for {claim.holderName}</h1>
        <p className="text-muted-foreground">Claim ID: {claim.id} | Village: {claim.village}</p>
      </header>

      {/* Top Section: Claim Info, Parcel Location */}
      <section className="grid lg:grid-cols-2 gap-6">
        <ClaimInfoCard claim={claim} />
        <ParcelLocationCard claim={claim} waterIndexLocation={waterIndexLocation} />
      </section>

      {/* Middle Section: Scheme Eligibility, AI Analysis, and Soil Analysis */}
      <section className="grid lg:grid-cols-2 gap-6">
        {user ? (
          <SchemeEligibilitySection 
            schemes={schemes} 
            isLoading={isLoadingSchemes} 
            isError={isErrorSchemes} 
            error={schemesError} 
          />
        ) : (
          <UnauthenticatedCard />
        )}
        {user ? (
          <AiAnalysisSection 
            claim={claim}
            analysis={analysis} 
            isLoading={isLoadingAnalysis} 
            isError={isErrorAnalysis} 
            error={analysisError} 
          />
        ) : (
          <UnauthenticatedCard />
        )}
        {user ? (
          <div className="lg:col-span-2"> {/* Make SoilAnalysisSection span both columns */}
            <SoilAnalysisSection
              soilAnalysis={analysis?.soilAnalysis}
              isLoading={isLoadingAnalysis}
              isError={isErrorAnalysis}
              error={analysisError}
            />
          </div>
        ) : (
          <div className="lg:col-span-2">
            <UnauthenticatedCard />
          </div>
        )}
      </section>
    </div>
  );
};

export default ClaimDetail;