import { useState, useMemo, useRef } from "react";
import { claims as initialClaims, geoJsonData, waterBodiesGeoJson, agriLandGeoJson } from "@/data/mockClaims";
import type { Claim } from "@/data/mockClaims";
import ClaimsData from "@/components/ClaimsData";
import GisMap from "@/components/GisMap";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LayersPanel from "@/components/LayersPanel";
import { DashboardStateProvider } from "@/context/DashboardStateContext";
import { showError, showSuccess, showInfo } from "@/utils/toast";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import DashboardStats from "@/components/DashboardStats";
import DataVisualization from "@/components/DataVisualization";
import DecisionSupportPanel from "@/components/DecisionSupportPanel";
import { Home, ChevronRight, SlidersHorizontal, Layers, Map, LayoutGrid, Table, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

const IndexPageContent = () => {
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState("default"); // default, table, map
  const analyticsRef = useRef<HTMLDivElement>(null);

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) =>
      claim.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [claims, searchTerm]);

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

  const handleFindMyParcel = () => {
    const parcelId = 'C017'; // Hardcoded parcel for "Anita Devi"
    setSelectedClaimId(parcelId);
    showInfo(`Locating parcel for Suresh Sahariya (ID: ${parcelId})`);
  };

  const handleOpenAnalytics = () => {
    analyticsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="grid grid-cols-[280px_1fr] grid-rows-[auto_1fr] h-screen w-screen bg-background overflow-hidden">
      <div className="col-span-2 z-10"><Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} onFindMyParcel={handleFindMyParcel} onOpenAnalytics={handleOpenAnalytics} /></div>
      <div className="row-start-2"><Sidebar onToggleLayersPanel={() => setIsLayersPanelOpen(true)} onGenerateReport={handleGenerateReport} /></div>
      
      <main className="row-start-2 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={65} minSize={40}>
            <div className="h-full overflow-y-auto p-6 space-y-6">
              <header className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">WebGIS Dashboard</h1>
                  <p className="text-muted-foreground">Analytics and Management for Forest Rights Act Claims</p>
                </div>
                <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)} size="sm">
                  <ToggleGroupItem value="default" aria-label="Default view"><LayoutGrid className="h-4 w-4" /></ToggleGroupItem>
                  <ToggleGroupItem value="table" aria-label="Table view"><Table className="h-4 w-4" /></ToggleGroupItem>
                  <ToggleGroupItem value="map" aria-label="Map view"><Map className="h-4 w-4" /></ToggleGroupItem>
                </ToggleGroup>
              </header>
              
              <div ref={analyticsRef}><DashboardStats claims={claims} /></div>
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
                    onClaimSelect={handleSelectClaim}
                  />
                </div>
                <div className={cn(viewMode === 'map' ? 'hidden' : 'block')}>
                  <ClaimsData 
                    claims={filteredClaims}
                    onAddClaim={handleAddClaim}
                    onGenerateReport={handleGenerateReport}
                    selectedClaimId={selectedClaimId}
                    onClaimSelect={handleSelectClaim}
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