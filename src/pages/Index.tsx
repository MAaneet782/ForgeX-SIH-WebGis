import { useState } from "react";
import { claims, geoJsonData, waterBodiesGeoJson, agriLandGeoJson } from "@/data/mockClaims";
import ClaimsTable from "@/components/ClaimsTable";
import MapView from "@/components/MapView";
import AiAnalysisPanel from "@/components/AiAnalysisPanel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [selectedClaim, setSelectedClaim] = useState(claims[0]);

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
                <MapView 
                  claimsGeoJson={geoJsonData} 
                  waterBodiesGeoJson={waterBodiesGeoJson}
                  agriLandGeoJson={agriLandGeoJson}
                  selectedClaimId={selectedClaim?.id} 
                  onClaimSelect={(claimId) => {
                    const claim = claims.find(c => c.id === claimId);
                    if (claim) setSelectedClaim(claim);
                  }}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={35}>
              <div className="h-full p-1 overflow-y-auto">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Claims Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ClaimsTable claims={claims} onRowSelect={setSelectedClaim} selectedClaimId={selectedClaim?.id} />
                  </CardContent>
                </Card>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40}>
          <div className="h-full p-1 overflow-y-auto">
            {selectedClaim && <AiAnalysisPanel claim={selectedClaim} />}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;