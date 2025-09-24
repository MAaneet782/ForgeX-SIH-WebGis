import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { MapContainer, TileLayer, Polygon, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, Info, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import MapFlyTo from "@/components/MapFlyTo";
import { Badge } from "@/components/ui/badge";

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

const fetchClaimByClaimId = async (claimId: string): Promise<Claim | null> => {
  if (!claimId) return null;
  const { data, error } = await supabase
    .from("claims")
    .select("*")
    .eq("claim_id", claimId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    throw new Error(error.message);
  }
  return data as Claim;
};

const FindMyParcel = () => {
  const [searchClaimId, setSearchClaimId] = useState<string>("");
  const [queryClaimId, setQueryClaimId] = useState<string | null>(null);

  const { data: claim, isLoading, isError, error } = useQuery<Claim | null, Error>({
    queryKey: ["findParcel", queryClaimId],
    queryFn: () => fetchClaimByClaimId(queryClaimId!),
    enabled: !!queryClaimId,
  });

  const handleSearch = () => {
    setQueryClaimId(searchClaimId);
  };

  const getStatusBadge = (status: Claim['status']) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'Pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  const defaultCenter: LatLngExpression = [22.9734, 78.6569]; // Centered on Central India

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-shadow">Find My Parcel</h1>
        <p className="text-muted-foreground">Enter your claim ID to locate your land parcel on the map.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-2 mb-6">
            <Input
              placeholder="Enter Claim ID (e.g., FRA-OD-001)"
              value={searchClaimId}
              onChange={(e) => setSearchClaimId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={!searchClaimId || isLoading}>
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>

          {isLoading && queryClaimId && (
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}

          {isError && (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error?.message || "An unknown error occurred."}</AlertDescription>
            </Alert>
          )}

          {queryClaimId && !isLoading && !claim && !isError && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Claim Not Found</AlertTitle>
              <AlertDescription>No claim found with ID "{queryClaimId}". Please check the ID and try again.</AlertDescription>
            </Alert>
          )}

          {claim && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <Card className="lg:col-span-2">
                <CardHeader><CardTitle>Parcel Location</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <MapContainer center={defaultCenter} zoom={6} style={{ height: '400px', width: '100%' }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {claim.geometry && (
                      <Polygon
                        pathOptions={{ color: 'blue', weight: 3, fillOpacity: 0.5 }}
                        positions={claim.geometry.coordinates[0].map(
                          (coord) => [coord[1], coord[0]]
                        ) as LatLngExpression[]}
                      >
                        <Popup>
                          <div>
                            <h3 className="font-bold">{claim.holder_name}</h3>
                            <p><strong>Claim ID:</strong> {claim.claim_id}</p>
                            <p><strong>Status:</strong> {claim.status}</p>
                          </div>
                        </Popup>
                      </Polygon>
                    )}
                    <MapFlyTo claim={claim} />
                  </MapContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Claim Details</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span>Claim ID:</span> <span className="font-medium">{claim.claim_id}</span></div>
                  <div className="flex justify-between"><span>Holder Name:</span> <span className="font-medium">{claim.holder_name}</span></div>
                  <div className="flex justify-between"><span>Village:</span> <span className="font-medium">{claim.village}</span></div>
                  <div className="flex justify-between"><span>District:</span> <span className="font-medium">{claim.district}</span></div>
                  <div className="flex justify-between"><span>State:</span> <span className="font-medium">{claim.state}</span></div>
                  <div className="flex justify-between"><span>Area:</span> <span className="font-medium">{claim.area} acres</span></div>
                  <div className="flex justify-between items-center"><span>Status:</span> {getStatusBadge(claim.status)}</div>
                  <div className="flex justify-between"><span>Submitted On:</span> <span className="font-medium">{new Date(claim.created_at).toLocaleDateString()}</span></div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FindMyParcel;