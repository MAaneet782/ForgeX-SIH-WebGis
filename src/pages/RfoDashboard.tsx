import { useState, useMemo } from "react";
// Removed unused useQuery import
// import { supabase } from "@/lib/supabaseClient"; // No longer needed for claims data
import { mockClaims } from "@/data/mockClaims"; // Import mockClaims
// Removed unused Claim type import
import type { FeatureCollection, Geometry, Feature } from "geojson";
import RfoMap from "@/components/RfoMap";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useAuth } from "@/context/AuthContext";
import type { Claim } from "@/data/mockClaims"; // Re-added Claim type as it's used in filteredClaims

const RfoDashboard = () => {
  const { user } = useAuth();
  
  // Use local mockClaims instead of fetching from Supabase
  const claims = mockClaims;
  const isLoading = false; // No longer loading from Supabase
  const isError = false; // No longer fetching from Supabase

  const [searchTerm, setSearchTerm] = useState("");
  // Removed unused isLayersPanelOpen state and setter
  // const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false); // Keeping for sidebar prop, but not directly used in this file's JSX

  const filteredClaims = useMemo(() => {
    if (!claims) return [];
    return claims.filter((claim: Claim) => // Explicitly type claim here
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
          area: claim.area,
        },
        geometry: claim.geometry as Geometry,
      }));
    return { type: "FeatureCollection", features };
  }, [filteredClaims]);

  const handleFindMyParcel = () => { /* RFO map doesn't auto-zoom on selection */ };
  const handleGenerateReport = () => { /* RFO map doesn't generate reports */ };

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
          {/* onToggleLayersPanel is still passed, but the state it would toggle is removed from this component */}
          <Sidebar onToggleLayersPanel={() => { /* No-op or handle in Sidebar directly */ }} onGenerateReport={handleGenerateReport} onFindMyParcel={handleFindMyParcel} />
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