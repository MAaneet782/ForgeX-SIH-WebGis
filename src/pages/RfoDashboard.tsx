import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { AlertTriangle, FileClock, MapPin, CheckCircle, ArrowRight } from "lucide-react";

// Define the type for a claim
interface Claim {
  id: string;
  claim_id: string;
  holder_name: string;
  village: string;
  area: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  created_at: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

// Function to fetch pending claims
const fetchPendingClaims = async (): Promise<Claim[]> => {
  const { data, error } = await supabase
    .from("claims")
    .select("*")
    .eq("status", "Pending")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data as Claim[];
};

const StatCard = ({ title, value, icon: Icon, color, unit = "" }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value} <span className="text-lg font-normal">{unit}</span></div>
      </CardContent>
    </Card>
);

const RfoDashboard = () => {
  const { data: claims, isLoading, isError, error } = useQuery<Claim[], Error>({
    queryKey: ["pendingClaims"],
    queryFn: fetchPendingClaims,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  const totalArea = claims.reduce((sum, claim) => sum + claim.area, 0);
  const center: LatLngExpression = claims.length > 0 && claims[0].geometry 
    ? [claims[0].geometry.coordinates[0][0][1], claims[0].geometry.coordinates[0][0][0]]
    : [22.9734, 78.6569];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-shadow">RFO Dashboard</h1>
        <p className="text-muted-foreground">Welcome, Range Forest Officer. Here are the claims that require your attention.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Pending Reviews" value={claims.length} icon={FileClock} color="text-yellow-500" />
        <StatCard title="Total Area Under Review" value={totalArea.toFixed(2)} unit="acres" icon={MapPin} color="text-blue-500" />
        <StatCard title="Recently Approved" value={12} icon={CheckCircle} color="text-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Claims Awaiting Review</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Holder Name</TableHead>
                    <TableHead>Village</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium">{claim.claim_id}</TableCell>
                      <TableCell>{claim.holder_name}</TableCell>
                      <TableCell>{claim.village}</TableCell>
                      <TableCell>{new Date(claim.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/atlas/claim/${claim.claim_id}`}>
                            Review <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Pending Claims Map</CardTitle>
            </CardHeader>
            <CardContent>
              <MapContainer center={center} zoom={8} style={{ height: '400px', width: '100%' }} className="rounded-md">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {claims.map((claim) => {
                  if (!claim.geometry) return null;
                  const coordinates = claim.geometry.coordinates[0].map(
                    (coord) => [coord[1], coord[0]]
                  ) as LatLngExpression[];
                  return <Polygon key={claim.id} pathOptions={{ color: 'orange' }} positions={coordinates} />;
                })}
              </MapContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RfoDashboard;