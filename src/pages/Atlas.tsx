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
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

// --- Supabase Data Fetching ---
const fetchClaims = async (): Promise<Claim[]> => {
  const { data, error } = await supabase.from('claims').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data.map(item => ({
    dbId: item.id, // Map DB's primary key 'id' to frontend 'dbId'
    id: item.claim_id, // Map DB's 'claim_id' (text) to frontend 'id' (user-facing)
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

  const [selectedClaimDbId, setSelectedClaimDbId] = useState<string | null>(null); // Use dbId for map selection
  const [searchTerm, setSearchTerm] = useState("");
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);

  const addClaimMutation = useMutation({
    mutationFn: async (newClaimData: Omit<Claim, 'dbId' | 'estimatedCropValue' | 'geometry'> & { coordinates: string }) => {
      const toastId = showLoading("Adding new claim...");
      const { coordinates, ...rest } = newClaimData;
      
      // Generate a user-facing claim_id (text)
      const userFacingClaimId = `C-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      
      const newClaimRecord = {
        claim_id: userFacingClaimId, // User-facing text ID
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

      const { data, error } = await supabase.from('claims').insert([newClaimRecord]).select('id, claim_id').single(); // Select DB's primary key 'id'
      dismissToast(String(toastId));
      if (error) throw new Error(error.message);
      return { dbId: data.id, userFacingId: data.claim_id }; // Return both IDs
    },
    onSuccess: ({ dbId, userFacingId }) => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      showSuccess(`Claim ${userFacingId} added. Redirecting to its dashboard for AI analysis.`);
      navigate(`/atlas/claim/${userFacingId}`); // Navigate using user-facing ID
    },
    onError: (error) => {
      showError(`Failed to add claim: ${error.message}`);
    },
  });

  const deleteClaimMutation = useMutation({
    mutationFn: async (dbId: string) => { // Expects the database's primary key
      const toastId = showLoading(`Deleting claim...`);
      const { error } = await supabase.from('claims').delete().eq('id', dbId); // Delete using DB's primary key
      dismissToast(String(toastId));
      if (error) throw new Error(error.message);
      return dbId;
    },
    onSuccess: (deletedDbId) => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      showSuccess(`Claim deleted successfully.`);
      if (selectedClaimDbId === deletedDbId) {
        setSelectedClaimDbId(null);
      }
    },
    onError: (error) => {
      showError(`Failed to delete claim: ${error.message}`);
    },
  });

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) =>
      claim.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) // Search by user-facing ID
    );
  }, [claims, searchTerm]);

  const geoJsonData = useMemo((): FeatureCollection => {
    const features = claims
      .filter(claim => claim.geometry) // Ensure claim has geometry
      .map((claim): Feature => ({
        type: "Feature",
        properties: { dbId: claim.dbId, claimId: claim.id, holderName: claim.holderName }, // Pass both IDs
        geometry: claim.geometry as Geometry,
      }));
    return { type: "FeatureCollection", features };
  }, [claims]);

  const handleZoomToClaim = (dbId: string) => { // Expects dbId for map interaction
    setSelectedClaimDbId(dbId);
  };

  const handleClaimClickOnMap = (dbId: string | null) => { // Expects dbId from map
    if (dbId) {
      const clickedClaim = claims.find(c => c.dbId === dbId);
      if (clickedClaim) {
        navigate(`/atlas/claim/${clickedClaim.id}`); // Navigate using user-facing ID
      }
    }
  };

  const handleGenerateReport = () => {
    showSuccess("Report generated successfully!");
  };

  const handleFindMyParcel = () => {
    if (claims.length > 0) {
      const parcelDbId = claims[0].dbId;
      setSelectedClaimDbId(parcelDbId);
      showInfo(`Locating parcel for ${claims[0].holderName} (ID: ${claims[0].id})`);
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
          <main className="h-full overflow-y-auto p-6 space-y-8">
            <header>
              <h1 className="text-3xl font-bold">WebGIS Dashboard</h1>
              <p className="text-muted-foreground">Live Data from Supabase Database</p>
            </header>
            
            <DashboardStats claims={claims} />
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Claims Map</h2>
              <div className="h-[60vh] min-h-[500px] rounded-lg overflow-hidden border">
                <GisMap 
                  claims={claims}
                  claimsData={geoJsonData} 
                  waterData={waterBodiesGeoJson}
                  agriData={agriLandGeoJson}
                  selectedClaimDbId={selectedClaimDbId} // Pass dbId to map
                  onClaimSelect={handleClaimClickOnMap}
                />
              </div>
            </div>

            <div className="space-y-4">
               <h2 className="text-2xl font-bold">Claims Explorer</h2>
               <ClaimsData 
                  claims={filteredClaims}
                  onAddClaim={(claim) => addClaimMutation.mutate(claim)}
                  onGenerateReport={handleGenerateReport}
                  onZoomToClaim={handleZoomToClaim}
                  onDeleteClaim={(dbId) => deleteClaimMutation.mutate(dbId)} // Pass dbId for deletion
                />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Data Analysis</h2>
              <DataVisualization claims={claims} />
            </div>
          </main>
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