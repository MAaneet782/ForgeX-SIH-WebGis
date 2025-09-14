import { useState, useMemo } from "react";
import { claims as initialClaims, geoJsonData, waterBodiesGeoJson, agriLandGeoJson } from "@/data/mockClaims";
import type { Claim } from "@/data/mockClaims";
import ClaimsData from "@/components/ClaimsData";
import GisMap from "@/components/GisMap";
import AiAnalysisPanel from "@/components/AiAnalysisPanel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { showError, showSuccess } from "@/utils/toast";

const Index = () => {
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(initialClaims[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

  const selectedClaim = useMemo(() => {
    return claims.find(c => c.id === selectedClaimId) || null;
  }, [claims, selectedClaimId]);

  const handleAddClaim = (newClaimData: Omit<Claim, 'id' | 'soilType' | 'waterAvailability'>) => {
    try {
      const newClaim: Claim = {
        ...newClaimData,
        id: `C${String(claims.length + 1).padStart(3, '0')}`,
        // The form doesn't specify these, so we'll add defaults
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
    <div className="h-screen w-screen p-4 flex flex-col font-sans">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-primary">Forest Land Claims Dashboard</h1>
        <p className="text-muted-foreground">Monitoring and Analysis for Madhya Pradesh & Odisha</p>
      </header>

      <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border">
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={65}>
              <div className="h-full p-1">
                <GisMap 
                  claimsData={geoJsonData} 
                  waterData={waterBodiesGeoJson}
                  agriData={agriLandGeoJson}
                  selectedClaimId={selectedClaimId} 
                  onClaimSelect={handleSelectClaim}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={35}>
              <div className="h-full p-1 overflow-y-auto">
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
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40}>
          <div className="h-full p-1 overflow-y-auto">
            {selectedClaim ? (
              <AiAnalysisPanel claim={selectedClaim} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border bg-card p-4 text-muted-foreground">
                <p>Select a claim to see AI-powered analysis</p>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;