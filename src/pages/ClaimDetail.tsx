import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Polygon, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { AlertTriangle, ArrowLeft, Info } from "lucide-react";
import AiAnalysis from "@/components/AiAnalysis";
import SchemeEligibility from "@/components/SchemeEligibility";
import GroundwaterAnalysis from "@/components/GroundwaterAnalysis";
import { seededRandom, stringToSeed } from "@/lib/aiUtils";

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
}

// Function to fetch a single claim by its claim_id
const fetchClaimById = async (claimId: string): Promise<Claim | null> => {
  const { data, error } = await supabase
    .from("claims")
    .select("*")
    .eq("claim_id", claimId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message);
  }

  return data as Claim;
};

// Point in polygon check using the ray-casting algorithm
const isPointInPolygon = (point: [number, number], polygon: number[][]) => {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

// Helper function to generate mock water points strictly within the claim's geometry
const generateWaterPoints = (claim: Claim, numPoints: number = 2) => {
  if (!claim.geometry || !claim.geometry.coordinates || claim.geometry.coordinates[0].length < 3) {
    return [];
  }

  const polygonCoords = claim.geometry.coordinates[0]; // [lng, lat]
  const random = seededRandom(stringToSeed(claim.claim_id + "water_points"));
  const waterPoints: { position: LatLngExpression; index: string }[] = [];

  // Method 1: Try centroid of vertices
  let sumLng = 0;
  let sumLat = 0;
  polygonCoords.forEach(([lng, lat]) => {
    sumLng += lng;
    sumLat += lat;
  });
  const centroid: [number, number] = [sumLng / polygonCoords.length, sumLat / polygonCoords.length];

  if (isPointInPolygon(centroid, polygonCoords)) {
    const waterIndex = (85 + random() * 10).toFixed(1); // High index for centroid
    waterPoints.push({ position: [centroid[1], centroid[0]], index: waterIndex });
  }

  // Method 2: Try midpoints of segments, pushed slightly inwards
  let attempts = 0;
  const shuffledIndices = [...Array(polygonCoords.length).keys()].sort(() => random() - 0.5);

  while (waterPoints.length < numPoints && attempts < polygonCoords.length) {
    const i = shuffledIndices[attempts];
    const j = (i + 1) % polygonCoords.length;
    const p1 = polygonCoords[i];
    const p2 = polygonCoords[j];
    const midPoint: [number, number] = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    const vector: [number, number] = [centroid[0] - midPoint[0], centroid[1] - midPoint[1]];
    const innerPoint: [number, number] = [midPoint[0] + vector[0] * 0.1, midPoint[1] + vector[1] * 0.1];

    if (isPointInPolygon(innerPoint, polygonCoords)) {
      const isDuplicate = waterPoints.some(p => 
        (p.position as number[])[0] === innerPoint[1] && (p.position as number[])[1] === innerPoint[0]
      );
      if (!isDuplicate) {
        const waterIndex = (75 + random() * 15).toFixed(1);
        waterPoints.push({ position: [innerPoint[1], innerPoint[0]], index: waterIndex });
      }
    }
    attempts++;
  }

  // Fallback: If still not enough points, use the original random method with more attempts
  let randomAttempts = 0;
  if (waterPoints.length < numPoints) {
      let minLat = Infinity, maxLat = -Infinity;
      let minLng = Infinity, maxLng = -Infinity;

      polygonCoords.forEach(coord => {
        const [lng, lat] = coord;
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
      });

      while (waterPoints.length < numPoints && randomAttempts < 5000) {
        const lat = minLat + random() * (maxLat - minLat);
        const lng = minLng + random() * (maxLng - minLng);
        
        if (isPointInPolygon([lng, lat], polygonCoords)) {
          const waterIndex = (75 + random() * 20).toFixed(1);
          waterPoints.push({ position: [lat, lng], index: waterIndex });
        }
        randomAttempts++;
      }
  }

  return waterPoints;
};


const ClaimDetail = () => {
  const { claimId } = useParams<{ claimId: string }>();

  const { data: claim, isLoading, isError, error } = useQuery<Claim | null, Error>({
    queryKey: ["claim", claimId],
    queryFn: () => fetchClaimById(claimId!),
    enabled: !!claimId,
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-72" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="p-8">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Claim Not Found</AlertTitle>
          <AlertDescription>The claim with ID "{claimId}" could not be found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const coordinates = claim.geometry.coordinates[0].map(
    (coord) => [coord[1], coord[0]]
  ) as LatLngExpression[];
  
  const center = coordinates.reduce(
    (acc, coord) => [acc[0] + coord[0] / coordinates.length, acc[1] + coord[1] / coordinates.length],
    [0, 0]
  ) as LatLngExpression;

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

  const waterPoints = generateWaterPoints(claim);

  return (
    <div className="p-6 lg:p-8 bg-muted/40 min-h-screen">
      <div className="mb-6">
        <Button asChild variant="outline" className="mb-4">
          <Link to="/atlas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Atlas
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-shadow">Personal Dashboard</h1>
        <p className="text-muted-foreground">Claim Holder: {claim.holder_name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <AiAnalysis claimId={claim.claim_id} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Claim Information</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Claim ID:</span> <span className="font-medium">{claim.claim_id}</span></div>
              <div className="flex justify-between"><span>Village:</span> <span className="font-medium">{claim.village}</span></div>
              <div className="flex justify-between"><span>District:</span> <span className="font-medium">{claim.district}</span></div>
              <div className="flex justify-between"><span>State:</span> <span className="font-medium">{claim.state}</span></div>
              <div className="flex justify-between"><span>Area:</span> <span className="font-medium">{claim.area} acres</span></div>
              <div className="flex justify-between items-center"><span>Status:</span> {getStatusBadge(claim.status)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Parcel Location</CardTitle></CardHeader>
            <CardContent>
              <MapContainer center={center} zoom={15} style={{ height: '200px', width: '100%' }} className="rounded-md">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polygon pathOptions={{ color: 'blue' }} positions={coordinates} />
                {waterPoints.map((point, index) => (
                  <Marker key={index} position={point.position}>
                    <Popup>
                      <strong>Recommended Borewell Site</strong><br />
                      High potential for groundwater.<br />
                      Predicted Water Index: {point.index}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </CardContent>
          </Card>
          
          <GroundwaterAnalysis claimId={claim.claim_id} />
          <SchemeEligibility claim={claim} />
        </div>
      </div>
    </div>
  );
};

export default ClaimDetail;