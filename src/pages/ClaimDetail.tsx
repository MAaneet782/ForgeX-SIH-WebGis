import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AiAnalysisPanel from "@/components/AiAnalysisPanel";
import SchemeEligibility from "@/components/SchemeEligibility";
import { supabase } from "@/lib/supabaseClient";
import type { Claim } from "@/data/mockClaims";
import { Skeleton } from "@/components/ui/skeleton";
import ClaimLocationMap from "@/components/ClaimLocationMap";

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
    geometry: data.geometry,
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      <Button asChild variant="outline" className="mb-4">
        <Link to="/atlas"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
      </Button>
      
      <header>
        <h1 className="text-3xl font-bold">Personal Dashboard</h1>
        <p className="text-muted-foreground">Claim Holder: {claim.holderName}</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
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
            <Card>
              <CardHeader>
                <CardTitle>Parcel Location</CardTitle>
              </CardHeader>
              <CardContent className="h-48 p-0">
                <ClaimLocationMap geometry={claim.geometry!} />
              </CardContent>
            </Card>
          </div>
          <AiAnalysisPanel claim={claim} />
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Scheme Eligibility</CardTitle>
            </CardHeader>
            <CardContent>
              <SchemeEligibility claim={claim} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetail;