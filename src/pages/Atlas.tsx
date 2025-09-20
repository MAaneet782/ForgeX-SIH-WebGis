import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { waterBodiesGeoJson, agriLandGeoJson, mockClaims as localMockClaims } from "@/data/mockClaims";
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
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import AtlasMainContent from "@/components/AtlasMainContent"; // Import the new component

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

const IndexPageContent = () => {
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

  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

  const selectedClaim = useMemo(() => {
    return combinedClaims.find(c => c.id === selectedClaimId) || null;
  }, [combinedClaims, selectedClaimId]);

  const handleGenerateReport = () => {
    showSuccess("Report generated successfully!");
  };

  const handleFindMyParcel = () => {
    if (combinedClaims.length > 0) {
      const parcelId = combinedClaims[0].id;
      setSelectedClaimId(parcelId);
      showInfo(`Locating parcel for ${combinedClaims[0].holderName} (ID: ${parcelId})`);
      // The AtlasMainContent will handle switching view mode if mobile
    }
  };

  if (isLoading || isLoadingAuth) {
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
    <div className="grid grid-rows-[auto_1fr] lg:grid-cols-[280px_1fr] h-screen w-screen bg-background overflow-hidden">
      <div className="col-span-full lg:col-span-2 z-10">
        <Header 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onFindMyParcel={handleFindMyParcel} 
          onToggleSidebar={() => setIsSidebarOpen(true)} 
        />
      </div>
      
      {isMobile ? (
        <>
          <Sidebar 
            onToggleLayersPanel={() => setIsLayersPanelOpen(true)} 
            onGenerateReport={handleGenerateReport} 
            onFindMyParcel={handleFindMyParcel} 
            isOpen={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
          />
          <main className="row-start-2 col-span-full overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <AtlasMainContent 
                  searchTerm={searchTerm} 
                  onFindMyParcel={handleFindMyParcel} 
                  selectedClaimId={selectedClaimId} 
                  setSelectedClaimId={setSelectedClaimId} 
                />
              </div>
              <div className="p-4 border-t border-border overflow-y-auto">
                <DecisionSupportPanel claim={selectedClaim} />
              </div>
            </div>
          </main>
        </>
      ) : (
        <>
          <aside className="row-start-2 col-start-1">
            <Sidebar 
              onToggleLayersPanel={() => setIsLayersPanelOpen(true)} 
              onGenerateReport={handleGenerateReport} 
              onFindMyParcel={handleFindMyParcel} 
            />
          </aside>
          <main className="row-start-2 col-start-2 overflow-hidden">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={65} minSize={40}>
                <AtlasMainContent 
                  searchTerm={searchTerm} 
                  onFindMyParcel={handleFindMyParcel} 
                  selectedClaimId={selectedClaimId} 
                  setSelectedClaimId={setSelectedClaimId} 
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={35} minSize={25}>
                <div className="h-full overflow-y-auto p-6">
                  <DecisionSupportPanel claim={selectedClaim} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </main>
        </>
      )}
      
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