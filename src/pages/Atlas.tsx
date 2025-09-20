import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query"; // Removed unused 'useQuery', 'useQueryClient'
import { waterBodiesGeoJson, agriLandGeoJson, mockClaims as initialMockClaims } from "@/data/mockClaims"; // Import mockClaims
import type { Claim } from "@/data/mockClaims";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import ClaimsData from "@/components/ClaimsData";
import GisMap from "@/components/GisMap";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LayersPanel from "@/components/LayersPanel";
import { DashboardStateProvider } from "@/context/DashboardStateContext";
import { showError, showSuccess, showInfo } from "@/utils/toast"; // Removed unused 'showLoading', 'dismissToast'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import DashboardStats from "@/components/DashboardStats";
import DataVisualization from "@/components/DataVisualization";
// import { supabase } from "@/lib/supabaseClient"; // No longer needed for claims data
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";

// Define the consistent type for new claim input
export type NewClaimInput = Omit<Claim, 'dbId' | 'estimatedCropValue' | 'geometry' | 'id' | 'created_at'> & { coordinates: string; documentName?: string };

const IndexPageContent = () => {
  // Removed unused 'queryClient'
  const navigate = useNavigate();
  const { user } = useAuth();

  // Manage claims data locally
  const [claims, setClaims] = useState<Claim[]>(initialMockClaims);
  const isLoading = false; // No longer loading from Supabase
  const isError = false; // No longer fetching from Supabase

  const [selectedClaimDbId, setSelectedClaimDbId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);

  const addClaimMutation = useMutation({
    mutationFn: async (newClaimData: NewClaimInput) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const { coordinates, ...rest } = newClaimData;
      
      // Generate unique IDs for mock data
      const newDbId = `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newUserFacingClaimId = `C-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      
      const newClaim: Claim = {
        dbId: newDbId,
        id: newUserFacingClaimId,
        holderName: rest.holderName,
        village: rest.village,
        district: rest.district,
        state: rest.state,
        area: rest.area,
        status: rest.status,
        documentName: rest.documentName,
        soilType: rest.soilType,
        waterAvailability: rest.waterAvailability,
        estimatedCropValue: Math.floor(Math.random() * (25000 - 5000 + 1)) + 5000, // Random value
        geometry: JSON.parse(coordinates),
        created_at: new Date(),
      };
      
      setClaims(prevClaims => [newClaim, ...prevClaims]);
      return { dbId: newDbId, userFacingId: newUserFacingClaimId };
    },
    onSuccess: ({ userFacingId }) => {
      showSuccess(`Claim ${userFacingId} added. Redirecting to its dashboard for AI analysis.`);
      navigate(`/atlas/claim/${userFacingId}`);
    },
    onError: (error) => {
      showError(`Failed to add claim: ${error.message}`);
    },
  });

  const deleteClaimMutation = useMutation({
    mutationFn: async (dbId: string) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setClaims(prevClaims => prevClaims.filter(claim => claim.dbId !== dbId));
      return dbId;
    },
    onSuccess: (deletedDbId) => {
      showSuccess(`Claim deleted successfully.`);
      if (selectedClaimDbId === deletedDbId) {
        setSelectedClaimDbId(null);
      }
    },
    onError: (error) => {
      showError(`Failed to delete claim: ${error.message}`);
    },
  });

  // Function to handle adding multiple claims from Excel import
  const handleAddClaims = (newClaims: Omit<Claim, 'dbId'>[]) => {
    const claimsWithDbIds: Claim[] = newClaims.map(claim => ({
      ...claim,
      dbId: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Generate a unique dbId
    }));
    setClaims(prevClaims => [...claimsWithDbIds, ...prevClaims]);
  };

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) =>
      claim.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [claims, searchTerm]);

  const geoJsonData = useMemo((): FeatureCollection => {
    const features = claims
      .filter(claim => claim.geometry)
      .map((claim): Feature => ({
        type: "Feature",
        properties: { dbId: claim.dbId, claimId: claim.id, holderName: claim.holderName },
        geometry: claim.geometry as Geometry,
      }));
    return { type: "FeatureCollection", features };
  }, [claims]);

  const handleZoomToClaim = (dbId: string) => {
    setSelectedClaimDbId(dbId);
  };

  const handleClaimClickOnMap = (dbId: string | null) => {
    if (dbId) {
      const clickedClaim = claims.find(c => c.dbId === dbId);
      if (clickedClaim) {
        navigate(`/atlas/claim/${clickedClaim.id}`);
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

  if (isLoading || !user) {
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
    return <div className="text-red-500 text-center p-8">Error loading claims data.</div>;
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
            <header className="mb-6">
              <h1 className="text-3xl font-bold">WebGIS Dashboard</h1>
              <p className="text-muted-foreground">Live Data from Local Mock Database</p>
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
                  selectedClaimDbId={selectedClaimDbId}
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
                  onDeleteClaim={(dbId) => deleteClaimMutation.mutate(dbId)}
                  onAddClaims={handleAddClaims} // Added the missing prop here
                />
            </div>

            <div className="space-y-4">
              <h2 className="2xl font-bold">Data Analysis</h2>
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