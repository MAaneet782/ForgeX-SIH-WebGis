import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AiAnalysisPanel from "@/components/AiAnalysisPanel";
import SchemeEligibility from "@/components/SchemeEligibility";
import SoilAnalysisPanel from "@/components/SoilAnalysisPanel"; // New import
import ParcelMapDisplay from "@/components/ParcelMapDisplay"; // New import
import { supabase } from "@/lib/supabaseClient";
import type { Claim } from "@/data/mockClaims";
import { Skeleton } from "@/components/ui/skeleton";
import type { Geometry } from "geojson"; // Import Geometry type

const fetchClaimById = async (claimId: string): Promise<Claim> => {
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('claim_id', claimId)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Claim not found");

  return {
    id: data.claim_id,
    holderName: data.holder_name,
    village: data.village,
    district: data.district,
    state: data.state,
    area: data.area,
    status: data.status,
    documentName: data.document_name,
    soilType: data.soil_type,
    waterAvailability: data.water_availability,
    estimatedCropValue: data.estimated_crop_value,
    geometry: data.geometry as Geometry, // Ensure geometry is mapped
  };
};

const ClaimDetail = () => {
  const { claimId } = useParams<{ claimId: string }>();

  const { data: claim, isLoading, isError } = useQuery<Claim>({
    queryKey: ['claim', claimId],
    queryFn: () => fetchClaimById(claimId!),
    enabled: !!claimId,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !claim) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Claim not found</h2>
        <Button asChild variant="link">
          <Link to="/atlas">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      <Button asChild variant="outline" className="mb-4">
        <Link to="/atlas"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
      </Button>
      
      <header>
        <h1 className="text-3xl font-bold">Personal Dashboard</h1>
        <p className="text-muted-foreground">Claim Holder: {claim.holderName}</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6"> {/* Changed to 3 columns */}
        <Card className="md:col-span-1"> {/* Claim Information */}
          <CardHeader>
            <CardTitle>Claim Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between"><span>Claim ID:</span> <span className="font-mono">{claim.id}</span></div>
            <div className="flex justify-between"><span>Village:</span> <span>{claim.village}</span></div>
            <div className="flex justify-between"><span>District:</span> <span>{claim.district}</span></div>
            <div className="flex justify-between"><span>State:</span> <span>{claim.state}</span></div>
            <div className="flex justify-between"><span>Area:</span> <span>{claim.area.toFixed(2)} acres</span></div>
            <div className="flex justify-between items-center"><span>Status:</span> <Badge variant={claim.status === 'Approved' ? 'default' : claim.status === 'Pending' ? 'secondary' : 'destructive'}>{claim.status}</Badge></div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1"> {/* Parcel Location */}
          <CardHeader>
            <CardTitle>Parcel Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {claim.geometry ? (
              <ParcelMapDisplay geometry={claim.geometry} claimId={claim.id} />
            ) : (
              <div className="text-center text-muted-foreground py-4">No geometry data available for this claim.</div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-1"> {/* Scheme Eligibility */}
          <CardContent className="pt-6">
            <SchemeEligibility claim={claim} />
          </CardContent>
        </Card>
      </div>

      <AiAnalysisPanel claim={claim} />
      <SoilAnalysisPanel claim={claim} /> {/* New Soil Analysis Panel */}
    </div>
  );
};

export default ClaimDetail;