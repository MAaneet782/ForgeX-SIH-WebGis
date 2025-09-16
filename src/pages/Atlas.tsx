import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { waterBodiesGeoJson, agriLandGeoJson } from "@/data/mockClaims";
import type { Claim } from "@/data/mockClaims";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import ClaimsData from "@/components/ClaimsData";
import GisMap from "@/components/GisMap";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LayersPanel from "@/components/LayersPanel";
import { DashboardStateProvider } from "@/context/DashboardStateContext";
import { showError, showSuccess, showInfo, showLoading, dismissToast } from "@/utils/toast";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import DashboardStats from "@/components/DashboardStats";
import DataVisualization from "@/components/DataVisualization";
import DecisionSupportPanel from "@/components/DecisionSupportPanel";
import { Map, LayoutGrid, Table } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

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
    geometry: item.geometry,
  }));
};

const IndexPageContent = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: claims = [], isLoading, isError } = useQuery<Claim[]>({
    queryKey: ['claims'],
    queryFn: fetchClaims,
  });

  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState("default");

  const addClaimMutation = useMutation({
    mutationFn: async (newClaimData: Omit<Claim, 'id' | 'estimatedCropValue' | 'geometry'> & { coordinates: string }) => {
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
    return claims.filter((claim) =>
      claim.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.village.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [claims, searchTerm]);

  const selectedClaim = useMemo(() => {
    return claims.find(c => c.id === selectedClaimId) || null;
  }, [claims, selectedClaimId]);

  const geoJsonData = useMemo((): FeatureCollection => {
    const features = claims
      .filter(claim => claim.geometry) // Ensure claim has geometry
      .map((claim): Feature => ({
        type: "Feature",
        properties: { claimId: claim.id, holderName: claim.holderName },
        geometry: claim.geometry as Geometry,
      }));
    return { type: "FeatureCollection", features };
  }, [claims]);

  const handleZoomToClaim = (claimId: string) => {
    setSelectedClaimId(claimId);
    setViewMode('map');
  };

  const handleClaimClickOnMap = (claimId: string | null) => {
    if (claimId) {
      navigate(`/atlas/claim/${claimId}`);
    }
  };

  const handleGenerateReport = () => {
    showSuccess("Report generated successfully!");
  };

  const handleFindMyParcel = () => {
    if (claims.length > 0) {
      const parcelId = claims[0].id;
      setSelectedClaimId(parcelId);
      showInfo(`Locating parcel for ${claims[0].holderName} (ID: ${parcelId})`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} onFindMyParcel={handleFindMyParcel} />
      
      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        <ResizablePanel defaultSize={18} minSize={15} maxSize={25}>
          <Sidebar onToggleLayersPanel={() => setIsLayersPanelOpen(true)} onGenerateReport={handleGenerateReport} onFindMyParcel={handleFindMyParcel} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={82} minSize={50}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={65} minSize={40}>
              <div className="h-full overflow-y-auto p-6 space-y-6">
                <header className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">WebGIS Dashboard</h1>
                    <p className="text-muted-foreground">Live Data from Supabase Database</p>
                  </div>
                  <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)} size="sm">
                    <ToggleGroupItem value="default" aria-label="Default view"><LayoutGrid className="h-4 w-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="table" aria-label="Table view"><Table className="h-4 w-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="map" aria-label="Map view"><Map className="h-4 w-4" /></ToggleGroupItem>
                  </ToggleGroup>
                </header>
                
                <DashboardStats claims={claims} />
                <DataVisualization claims={claims} />
                
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Claims Explorer</h2>
                  <div className={cn("rounded-lg overflow-hidden border", viewMode === 'table' ? 'hidden' : 'block', viewMode === 'map' ? 'h-[70vh]' : 'h-[50vh] min-h-[450px]')}>
                    <GisMap 
                      claims={claims}
                      claimsData={geoJsonData} 
                      waterData={waterBodiesGeoJson}
                      agriData={agriLandGeoJson}
                      selectedClaimId={selectedClaimId} 
                      onClaimSelect={handleClaimClickOnMap}
                    />
                  </div>
                  <div className={cn(viewMode === 'map' ? 'hidden' : 'block')}>
                    <ClaimsData 
                      claims={filteredClaims}
                      onAddClaim={(claim) => addClaimMutation.mutate(claim)}
                      onGenerateReport={handleGenerateReport}
                      onZoomToClaim={handleZoomToClaim}
                    />
                  </div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={35} minSize={25}>
              <div className="h-full overflow-y-auto p-6">
                <DecisionSupportPanel claim={selectedClaim} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      <LayersPanel isOpen={isLayersPanelOpen} onOpenChange={setIsLayersPanelOpen} />
    </div>
  );
};

const Index = () => (
  <DashboardStateProvider>
    <IndexPageContent />
  </DashboardStateProvider>
);

export default Index;