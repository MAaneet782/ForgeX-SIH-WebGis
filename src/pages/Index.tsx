import { useState, useMemo } from "react";
import { claims as initialClaims, geoJsonData, waterBodiesGeoJson, agriLandGeoJson } from "@/data/mockClaims";
import type { Claim } from "@/data/mockClaims";
import ClaimsData from "@/components/ClaimsData";
import GisMap from "@/components/GisMap";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LayersPanel from "@/components/LayersPanel";
import { DashboardStateProvider } from "@/context/DashboardStateContext";
import { showError, showSuccess } from "@/utils/toast";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import DashboardStats from "@/components/DashboardStats";
import DataVisualization from "@/components/DataVisualization";
import DecisionSupportPanel from "@/components/DecisionSupportPanel";

const IndexPageContent = () => {
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(initialClaims[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);

  const filteredClaims = useMemo(() => {
    return claims
      .filter((claim) => statusFilter === "All" ? true : claim.status === statusFilter)
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

  const handleGenerateReport = () => {
    const headers = ["id", "holderName", "village", "district", "state", "area", "status", "soilType", "waterAvailability"];
    const csvRows = [
      headers.join(','),
      ...filteredClaims.map(claim => headers.map(header => `"${claim[header as keyof Claim]}"`).join(','))
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'claims_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("Report generated successfully!");
  };

  return (
    <div className="grid grid-cols-[280px_1fr] grid-rows-[auto_1fr] h-screen w-screen bg-background overflow-hidden">
      <div className="col-span-2"><Header /></div>
      <div className="row-start-2"><Sidebar onToggleLayersPanel={() => setIsLayersPanelOpen(true)} onGenerateReport={handleGenerateReport} /></div>
      
      <main className="row-start-2 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={65} minSize={40}>
            <div className="h-full overflow-y-auto p-6 space-y-8">
              <header>
                <h1 className="text-3xl font-bold">WebGIS Dashboard</h1>
                <p className="text-muted-foreground">Analytics and Management for Forest Rights Act Claims</p>
              </header>
              <DashboardStats claims={claims} />
              <DataVisualization claims={claims} />
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Claims Explorer</h2>
                <div className="h-[50vh] min-h-[450px] rounded-lg overflow-hidden border">
                  <GisMap 
                    claims={claims}
                    claimsData={geoJsonData} 
                    waterData={waterBodiesGeoJson}
                    agriData={agriLandGeoJson}
                    selectedClaimId={selectedClaimId} 
                    onClaimSelect={handleSelectClaim}
                  />
                </div>
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
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={35} minSize={25}>
            <div className="h-full overflow-y-auto p-6">
              <DecisionSupportPanel claim={selectedClaim} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
      
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