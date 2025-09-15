import { useState, useMemo } from "react";
import { claims as initialClaims, geoJsonData, waterBodiesGeoJson, agriLandGeoJson } from "@/data/mockClaims";
import type { Claim } from "@/data/mockClaims";
import ClaimsData from "@/components/ClaimsData";
import GisMap from "@/components/GisMap";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { showError, showSuccess } from "@/utils/toast";
import { Home, ChevronRight, SlidersHorizontal, Layers, Map, LayoutGrid, Table, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Index = () => {
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(initialClaims[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState("map");

  const filteredClaims = useMemo(() => {
    return claims
      .filter((claim) =>
        statusFilter === "All" ? true : claim.status === statusFilter
      )
      .filter((claim) =>
        claim.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.village.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [claims, searchTerm, statusFilter]);

  const handleAddClaim = (newClaimData: Omit<Claim, 'id' | 'soilType' | 'waterAvailability'>) => {
    try {
      const newClaim: Claim = {
        ...newClaimData,
        id: `C${String(claims.length + 1).padStart(3, '0')}`,
        soilType: 'Loamy', 
        waterAvailability: 'Medium',
      };
      setClaims(prevClaims => [...prevClaims, newClaim]);
      showSuccess("Claim added successfully!");
    } catch (error) {
      showError("Failed to add claim.");
      console.error(error);
    }
  };
  
  const handleSelectClaim = (claimId: string | null) => {
    setSelectedClaimId(claimId);
  };

  return (
    <div className="grid grid-cols-[280px_1fr] grid-rows-[auto_1fr] h-screen w-screen bg-background overflow-hidden">
      <div className="col-span-2">
        <Header />
      </div>
      
      <div className="row-start-2">
        <Sidebar />
      </div>

      <main className="row-start-2 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center text-sm text-muted-foreground">
            <Home className="h-4 w-4 mr-2" />
            <span className="font-medium">Home</span>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Atlas</span>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-foreground font-semibold">WebGIS</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><SlidersHorizontal className="mr-2 h-4 w-4" /> Filters</Button>
            <Button variant="outline" size="sm"><Layers className="mr-2 h-4 w-4" /> Layers</Button>
            <Button variant="outline" size="sm"><Map className="mr-2 h-4 w-4" /> Basemap</Button>
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)} size="sm">
              <ToggleGroupItem value="map" aria-label="Map view"><LayoutGrid className="h-4 w-4 mr-2" /> Map</ToggleGroupItem>
              <ToggleGroupItem value="table" aria-label="Table view"><Table className="h-4 w-4 mr-2" /> Table</ToggleGroupItem>
              <ToggleGroupItem value="tiles" aria-label="Tiles view"><List className="h-4 w-4 mr-2" /> Tiles</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          <div className="h-[50vh] min-h-[400px]">
            <GisMap 
              claimsData={geoJsonData} 
              waterData={waterBodiesGeoJson}
              agriData={agriLandGeoJson}
              selectedClaimId={selectedClaimId} 
              onClaimSelect={handleSelectClaim}
            />
          </div>
          <div>
            <ClaimsData 
              claims={filteredClaims}
              onAddClaim={handleAddClaim}
              selectedClaimId={selectedClaimId}
              onClaimSelect={handleSelectClaim}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;