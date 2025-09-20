import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Claim } from "@/data/mockClaims";
import type { FeatureCollection, Geometry, Feature } from "geojson";
import RfoMap from "@/components/RfoMap";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header"; // Reusing existing Header
import Sidebar from "@/components/Sidebar"; // Reusing existing Sidebar
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useAuth } from "@/context/AuthContext"; // Import useAuth

// --- Supabase Data Fetching ---
const fetchClaims = async (): Promise<Claim[]> => {
  // This function will now fetch all claims that the authenticated user has SELECT access to
  // Based on the new RLS, authenticated users can SELECT all claims.
  const { data, error } = await supabase.from('claims').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data.map(item => ({
    dbId: item.id, // Map DB's primary key 'id' to frontend 'dbId'
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
    created_at: new Date(item.created_at), // Map created_at
  }));
};

const RfoDashboard = () => {
  const { user } = useAuth(); // Get the current user
  const { data: claims = [], isLoading, isError } = useQuery<Claim[]>({
    queryKey: ['claims', 'rfo_dashboard', user?.id], // Include user.id in query key
    queryFn: fetchClaims,
    enabled: !!user?.id, // Only run query if user.id is available
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false); // Keep for Header compatibility

  const filteredClaims = useMemo(() => {
    if (!claims) return [];
    return claims.filter((claim) =>
      claim.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [claims, searchTerm]);

  const geoJsonData = useMemo((): FeatureCollection => {
    const features = filteredClaims
      .filter(claim => claim.geometry)
      .map((claim): Feature => ({
        type: "Feature",
        properties: {
          claimId: claim.id,
          holderName: claim.holderName,
          village: claim.village,
          area: claim.area, // Area in acres
        },
        geometry: claim.geometry as Geometry,
      }));
    return { type: "FeatureCollection", features };
  }, [filteredClaims]);

  // Dummy functions for Header/Sidebar compatibility
  const handleFindMyParcel = () => { /* RFO map doesn't auto-zoom on selection */ };
  const handleGenerateReport = () => { /* RFO map doesn't generate reports */ };

  if (isLoading || !user) { // Show loading if user is not yet loaded
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
          <main className="h-full relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search village or holder..." 
                className="pl-10 w-full" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <RfoMap claimsData={geoJsonData} />
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default RfoDashboard;