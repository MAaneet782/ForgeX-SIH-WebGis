import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { waterBodiesGeoJson, agriLandGeoJson, mockClaims as localMockClaims } from "@/data/mockClaims";
import type { Claim } from "@/data/mockClaims";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import ClaimsData from "@/components/ClaimsData";
import GisMap from "@/components/GisMap";
import { DashboardStateProvider } from "@/context/DashboardStateContext";
import { showError, showSuccess, showInfo, showLoading, dismissToast } from "@/utils/toast";
import DashboardStats from "@/components/DashboardStats";
import DataVisualization from "@/components/DataVisualization";
import { Map, LayoutGrid, Table } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

// --- Supabase Data Fetching ---
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
    geometry: item.geometry, // Ensure geometry is included
  }));
};

interface AtlasMainContentProps {
  searchTerm: string;
  onFindMyParcel: () => void;
  selectedClaimId: string | null;
  setSelectedClaimId: (id: string | null) => void;
}

const AtlasMainContent = ({ searchTerm, onFindMyParcel, selectedClaimId, setSelectedClaimId }: AtlasMainContentProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const isMobile = useIsMobile();

  const { data: supabaseClaims = [], isLoading, isError } = useQuery<Claim[]>({
    queryKey: ['claims'],
    queryFn: fetchClaims,
    enabled: !!user, // Only fetch claims if user is logged in
  });

  // Combine Supabase claims with local mock claims
  const combinedClaims = useMemo<Claim[]>(() => {
    const uniqueClaimsMap = new globalThis.Map<string, Claim>();

    // Add Supabase claims, they take precedence
    supabaseClaims.forEach(claim => uniqueClaimsMap.set(claim.id, claim));

    // Add local mock claims, but only if their ID doesn't already exist
    localMockClaims.forEach(claim => {
      if (!uniqueClaimsMap.has(claim.id)) {
        uniqueClaimsMap.set(claim.id, claim);
      }
    });

    return Array.from(uniqueClaimsMap.values());
  }, [supabaseClaims]);

  const [viewMode, setViewMode] = useState("default");

  const addClaimMutation = useMutation({
    mutationFn: async (newClaimData: Omit<Claim, 'id' | 'estimatedCropValue'> & { coordinates: string }) => {
      const toastId = showLoading("Adding new claim...");
      const { coordinates, ...rest } = newClaimData;
      const claim_id = `C${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
      
      const newClaimRecord = {
        claim_id,
        holder_name: rest.holderName,
        village: rest.village,
        district: rest.district,
        state: rest.state,
        area: rest.area,
        status: rest.status,
        document_name: rest.documentName,
        soil_type: rest.soilType,
        water_availability: rest.waterAvailability,
        estimated_crop_value: Math.floor(Math.random() * (25000 - 5000 + 1)) + 5000,
        geometry: JSON.parse(coordinates),
        created_at: new Date().toISOString(), // Ensure created_at is set for new claims
        user_id: user?.id, // Associate claim with logged-in user
      };

      const { error } = await supabase.from('claims').insert([newClaimRecord]);
      dismissToast(String(toastId));
      if (error) throw new Error(error.message);
      return claim_id;
    },
    onSuccess: (newClaimId) => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      showSuccess(`Claim ${newClaimId} added. Redirecting to its dashboard for AI analysis.`);
      navigate(`/atlas/claim/${newClaimId}`);
    },
    onError: (error) => {
      showError(`Failed to add claim: ${error.message}`);
    },
  });

  const filteredClaims = useMemo(() => {
    return combinedClaims.filter((claim) =>
      claim.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.village.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [combinedClaims, searchTerm]);

  const geoJsonData = useMemo((): FeatureCollection => {
    const features = combinedClaims.map((claim): Feature => {
      const geometry = claim.geometry || { type: "Polygon", coordinates: [[[0,0]]] }; // Fallback geometry
      return {
        type: "Feature",
        properties: { claimId: claim.id, holderName: claim.holderName },
        geometry: geometry as Geometry,
      };
    });
    return { type: "FeatureCollection", features };
  }, [combinedClaims]);

  const handleZoomToClaim = (claimId: string) => {
    setSelectedClaimId(claimId);
    if (isMobile) {
      setViewMode('map'); // Switch to map view on mobile when zooming
    }
  };

  const handleGenerateReport = () => {
    showSuccess("Report generated successfully!");
  };

  if (isLoading || isLoadingAuth) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500 text-center p-8">Error loading claims data. Make sure you have run the SQL script in your Supabase project.</div>;
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">WebGIS Dashboard</h1>
          <p className="text-muted-foreground">Live Data from Supabase Database</p>
        </div>
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)} size="sm">
          <ToggleGroupItem value="default" aria-label="Default view" className="transition-colors duration-200"><LayoutGrid className="h-4 w-4" /></ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Table view" className="transition-colors duration-200"><Table className="h-4 w-4" /></ToggleGroupItem>
          <ToggleGroupItem value="map" aria-label="Map view" className="transition-colors duration-200"><Map className="h-4 w-4" /></ToggleGroupItem>
        </ToggleGroup>
      </header>
      
      {viewMode === 'default' || viewMode === 'table' ? (
        <>
          <DashboardStats claims={combinedClaims} />
          <DataVisualization claims={combinedClaims} />
        </>
      ) : null}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Claims Explorer</h2>
        {(viewMode === 'default' || viewMode === 'map') && (
          <div className={cn("rounded-lg overflow-hidden border", viewMode === 'map' ? 'h-[70vh]' : 'h-[50vh] min-h-[450px]')}>
            <GisMap 
              claims={combinedClaims} 
              claimsData={geoJsonData} 
              waterData={waterBodiesGeoJson}
              agriData={agriLandGeoJson}
              selectedClaimId={selectedClaimId} 
              onClaimSelect={setSelectedClaimId}
            />
          </div>
        )}
        {(viewMode === 'default' || viewMode === 'table') && (
          <div>
            <ClaimsData 
              claims={filteredClaims}
              onAddClaim={(claim) => addClaimMutation.mutate(claim)}
              onGenerateReport={handleGenerateReport}
              onZoomToClaim={handleZoomToClaim}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AtlasMainContent;