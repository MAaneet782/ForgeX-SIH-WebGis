import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Claim } from "@/data/mockClaims";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState, useEffect } from "react";
import L from 'leaflet';
import { useAuth } from "@/context/AuthContext";
import { type AnalysisResult } from "@/lib/ai-analysis";

// Import new modular components
import ClaimInfoCard from "@/components/claim-detail/ClaimInfoCard";
import ParcelLocationCard from "@/components/claim-detail/ParcelLocationCard";
import SchemeEligibilitySection from "@/components/claim-detail/SchemeEligibilitySection";
import AiAnalysisSection from "@/components/claim-detail/AiAnalysisSection";

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

const ClaimDetail = () => {
  const { claimId } = useParams<{ claimId: string }>();
  const { user, supabase } = useAuth();

  const [claims, setClaims] = useState<Claim[]>([]);
  useEffect(() => {
    import("@/data/mockClaims").then(module => {
      setClaims(module.mockClaims);
    });
  }, []);

  const claim = useMemo(() => claims.find(c => c.id === claimId), [claims, claimId]);
  const isLoadingClaim = claims.length === 0;
  const isErrorClaim = !claim && !isLoadingClaim;

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
      if (!claim?.id) {
        console.log("Query skipped: Claim ID is missing.");
        throw new Error("Claim ID is missing for AI analysis."); // This should be caught by `enabled` prop
      }

      console.log("Attempting to fetch AI analysis for claim ID:", claim.id);

      // 1. Try to fetch from Supabase cache first
      try {
        const { data: cachedData, error: fetchError } = await supabase
          .from('ai_analysis_results')
          .select('analysis_data')
          .eq('claim_id', claim.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means 'no rows found'
          console.warn("Error fetching AI analysis from cache (not 'no rows found'):", fetchError.message);
          // Don't throw here, try edge function as fallback
        }

        if (cachedData && cachedData.analysis_data) {
          console.log("AI analysis found in Supabase cache:", cachedData.analysis_data);
          // Basic validation for cached data structure
          if (typeof cachedData.analysis_data === 'object' && cachedData.analysis_data !== null && 'cropAnalysis' in cachedData.analysis_data) {
            return cachedData.analysis_data as AnalysisResult;
          } else {
            console.warn("Cached AI analysis data is malformed, invoking Edge Function as fallback.");
          }
        } else {
          console.log("AI analysis not found in Supabase cache, invoking Edge Function.");
        }
      } catch (cacheError: any) {
        console.error("Unexpected error during cache fetch:", cacheError.message);
        // Continue to invoke edge function as fallback
      }


      // 2. If not in cache or error fetching cache, invoke Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('predictive-analysis', {
        body: { claim },
      });

      if (functionError) {
        console.error("Error invoking predictive-analysis Edge Function:", functionError);
        throw functionError;
      }
      
      console.log("AI analysis from Edge Function:", data);
      // Validate data structure from edge function
      if (typeof data === 'object' && data !== null && 'cropAnalysis' in data) {
        return data as AnalysisResult;
      } else {
        console.error("Predictive analysis Edge Function returned malformed data:", data);
        throw new Error("AI analysis data is malformed or empty.");
      }
    },
    enabled: !!claim?.id, // Only run query if claim.id is available
    staleTime: Infinity, // Data is always fresh once fetched
    gcTime: Infinity,    // Keep data in cache indefinitely
    refetchOnWindowFocus: false,
    retry: 1, // Retry once in case of transient network issues or cold start
  });

  // --- Scheme Eligibility Data Fetching ---
  const { data: schemes, isLoading: isLoadingSchemes, isError: isErrorSchemes, error: schemesError } = useQuery<SchemeDetail[], Error>({
    queryKey: ['schemeEligibility', claim?.id],
    queryFn: async () => {
      if (!claim) throw new Error("Claim data is missing for scheme eligibility.");

      console.log("Attempting to fetch scheme eligibility for claim ID:", claim.id);
      const { data, error: functionError } = await supabase.functions.invoke('scheme-eligibility', {
        body: { claim },
      });

      if (functionError) {
        console.error("Error invoking scheme-eligibility Edge Function:", functionError);
        throw functionError;
      }
      
      console.log("Scheme eligibility from Edge Function:", data.schemes);
      return data.schemes as SchemeDetail[];
    },
    enabled: !!claim, // Only run query if claim is available
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  console.log("ClaimDetail Render - isLoadingAnalysis:", isLoadingAnalysis, "isErrorAnalysis:", isErrorAnalysis, "analysisError:", analysisError, "analysis data:", analysis);
  console.log("ClaimDetail Render - isLoadingSchemes:", isLoadingSchemes, "isErrorSchemes:", isErrorSchemes, "schemesError:", schemesError, "schemes data:", schemes);


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

      {/* Top Section: Claim Info, Parcel Location, Scheme Eligibility */}
      <section className="grid lg:grid-cols-3 gap-6">
        <ClaimInfoCard claim={claim} />
        <ParcelLocationCard claim={claim} waterIndexLocation={waterIndexLocation} />
        <SchemeEligibilitySection 
          schemes={schemes} 
          isLoading={isLoadingSchemes} 
          isError={isErrorSchemes} 
          error={schemesError} 
        />
      </section>

      {/* AI-Powered Predictive Analysis Section */}
      <section>
        <AiAnalysisSection 
          claim={claim}
          analysis={analysis} 
          isLoading={isLoadingAnalysis} 
          isError={isErrorAnalysis} 
          error={analysisError} 
        />
      </section>
    </div>
  );
};

export default ClaimDetail;