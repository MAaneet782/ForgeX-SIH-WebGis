import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import ClaimsTable from "@/components/ClaimsTable";
import ClaimsAnalysis from "@/components/ClaimsAnalysis";
import MapFlyTo from "@/components/MapFlyTo";

// Define the type for a claim
interface Claim {
  id: string;
  claim_id: string;
  holder_name: string;
  village: string;
  district: string;
  state: string;
  area: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  created_at: string;
}

// Function to fetch claims data from Supabase
const fetchClaims = async (): Promise<Claim[]> => {
  const { data, error } = await supabase
    .from("claims")
    .select("*")
    .in("state", ["Odisha", "Madhya Pradesh"])
    .limit(20);

  if (error) {
    throw new Error(error.message);
  }

  return data as Claim[];
};

const Atlas = () => {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const { data: claims, isLoading, isError, error } = useQuery<Claim[], Error>({
    queryKey: ["claims"],
    queryFn: fetchClaims,
  });

  const getStatusColor = (status: Claim['status']) => {
    switch (status) {
      case 'Approved':
        return 'blue';
      case 'Pending':
        return 'orange';
      case 'Rejected':
        return 'red';
      default:
        return 'grey';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Atlas Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-[600px] mt-4" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load claims data: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalClaims = claims?.length || 0;
  const approvedClaims = claims?.filter(c => c.status === 'Approved').length || 0;
  const pendingClaims = claims?.filter(c => c.status === 'Pending').length || 0;

  const center: LatLngExpression = [22.9734, 78.6569]; // Centered on Central India

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Atlas Dashboard</h1>
      <p className="text-muted-foreground">
        This is the main WebGIS dashboard for government officials.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Total Claims Displayed</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{totalClaims}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Approved Claims</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold text-green-600">{approvedClaims}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pending Claims</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold text-yellow-600">{pendingClaims}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <MapContainer center={center} zoom={6} style={{ height: '600px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {claims?.map((claim) => {
              if (!claim.geometry) return null;
              const coordinates = claim.geometry.coordinates[0].map(
                (coord) => [coord[1], coord[0]]
              ) as LatLngExpression[];
              
              const isSelected = selectedClaim?.id === claim.id;

              return (
                <Polygon
                  key={claim.id}
                  pathOptions={{ 
                    color: getStatusColor(claim.status), 
                    weight: isSelected ? 5 : 2,
                    fillOpacity: isSelected ? 0.7 : 0.4,
                  }}
                  positions={coordinates}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{claim.holder_name}</h3>
                      <p><strong>Claim ID:</strong> {claim.claim_id}</p>
                      <p><strong>Status:</strong> {claim.status}</p>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}
            <MapFlyTo claim={selectedClaim} />
          </MapContainer>
        </CardContent>
      </Card>

      {claims && <ClaimsTable claims={claims} onRowClick={setSelectedClaim} />}
      {claims && <ClaimsAnalysis claims={claims} />}
    </div>
  );
};

export default Atlas;