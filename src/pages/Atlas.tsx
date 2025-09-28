import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, FileText, CheckCircle, Clock, XCircle, PlusCircle, Upload, Download, BarChart2, LayoutDashboard, Search as SearchIcon, Filter as FilterIcon } from "lucide-react";
import ClaimsTable from "@/components/ClaimsTable";
import MapFlyTo from "@/components/MapFlyTo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import { showLoading, showSuccess, showError, dismissToast, showInfo } from "@/utils/toast";

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
    .limit(58); // Match screenshot data

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

  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const toastId = showLoading("Uploading and processing CSV...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const parsedData = results.data as any[];
        
        if (!parsedData.length || !results.meta.fields?.includes('claim_id')) {
            dismissToast(toastId);
            showError("Invalid CSV format. Make sure it has headers and a 'claim_id' column.");
            return;
        }

        const claimsToInsert = parsedData.map(row => {
            try {
                return {
                    claim_id: row.claim_id,
                    holder_name: row.holder_name,
                    village: row.village,
                    district: row.district,
                    state: row.state,
                    area: parseFloat(row.area),
                    status: row.status,
                    soil_type: row.soil_type,
                    water_availability: row.water_availability,
                    estimated_crop_value: parseInt(row.estimated_crop_value, 10),
                    geometry: row.geometry ? JSON.parse(row.geometry) : null,
                };
            } catch (e) {
                console.error("Error parsing row:", row, e);
                return null;
            }
        }).filter(Boolean);

        if (claimsToInsert.length === 0 && parsedData.length > 0) {
            dismissToast(toastId);
            showError("Could not parse any rows from the CSV. Check the format, especially the 'geometry' JSON.");
            return;
        }

        const { error } = await supabase.from('claims').insert(claimsToInsert);

        dismissToast(toastId);

        if (error) {
          showError(`Upload failed: ${error.message}`);
        } else {
          showSuccess(`${claimsToInsert.length} claims uploaded successfully!`);
          queryClient.invalidateQueries({ queryKey: ['claims'] });
        }
      },
      error: (error) => {
        dismissToast(toastId);
        showError(`CSV parsing error: ${error.message}`);
      }
    });
  };

  const handleExport = () => {
    if (!claims) {
      showInfo("No claims to export.");
      return;
    }
    const dataToExport = claims.map(({ id, created_at, geometry, ...rest }) => ({
        ...rest,
        geometry: JSON.stringify(geometry)
    }));
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'claims_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">WebGIS Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-24" />
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
  const rejectedClaims = claims?.filter(c => c.status === 'Rejected').length || 0;

  const center: LatLngExpression = [22.9734, 78.6569]; // Centered on Central India

  const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: number, icon: React.ElementType, color: string }) => (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-shadow">WebGIS Dashboard</h1>
        <p className="text-muted-foreground">Live Data from Supabase Database</p>
      </div>

      {/* New section for action buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Button asChild>
          <Link to="/atlas/rfo-dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" /> RFO Dashboard
          </Link>
        </Button>
        <Button asChild>
          <Link to="/atlas/find-my-parcel">
            <SearchIcon className="mr-2 h-4 w-4" /> Find My Parcel
          </Link>
        </Button>
        <Button asChild>
          <Link to="/atlas/analytics">
            <BarChart2 className="mr-2 h-4 w-4" /> Thematic Analytics
          </Link>
        </Button>
        <Button variant="ghost">
          <FilterIcon className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
        <Button asChild variant="outline">
          <Link to="/atlas/add-claim">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Claim
          </Link>
        </Button>
        <a href="/claims_template.csv" download className="text-sm text-muted-foreground hover:text-primary underline flex items-center">Download Template</a>
        <Button variant="outline" onClick={handleUploadClick}>
          <Upload className="mr-2 h-4 w-4" /> Upload CSV
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".csv"
        />
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Claims" value={totalClaims} icon={FileText} color="text-muted-foreground" />
        <StatCard title="Approved" value={approvedClaims} icon={CheckCircle} color="text-green-500" />
        <StatCard title="Pending" value={pendingClaims} icon={Clock} color="text-yellow-500" />
        <StatCard title="Rejected" value={rejectedClaims} icon={XCircle} color="text-red-500" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Claims Map</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <MapContainer center={center} zoom={6} style={{ height: '500px', width: '100%' }}>
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
    </div>
  );
};

export default Atlas;