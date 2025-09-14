import { useState, useMemo } from "react";
import ClaimsData from "@/components/ClaimsData";
import DashboardStats from "@/components/DashboardStats";
import DataVisualization from "@/components/DataVisualization";
import GisMap from "@/components/GisMap";
import DecisionSupportPanel from "@/components/DecisionSupportPanel";
import {
  claims as initialClaims,
  geoJsonData,
  waterBodiesGeoJson,
  agriLandGeoJson,
} from "@/data/mockClaims";
import type { Claim } from "@/data/mockClaims";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess } from "@/utils/toast";

const Index = () => {
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const handleAddClaim = (newClaimData: Omit<Claim, 'id'>) => {
    const newClaim: Claim = {
      id: `C${String(claims.length + 1).padStart(3, '0')}`,
      ...newClaimData,
    };
    setClaims((prevClaims) => [...prevClaims, newClaim]);
    showSuccess("Successfully added new claim!");
  };

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesSearch =
        claim.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.village.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || claim.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [claims, searchTerm, statusFilter]);

  const selectedClaim = claims.find((c) => c.id === selectedClaimId) || null;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Forest Rights Act (FRA) Decision Support System
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            An interactive dashboard for visualizing claims, assets, and scheme
            eligibility.
          </p>
        </header>

        <main className="space-y-8">
          <section>
            <DashboardStats claims={claims} />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-lg overflow-hidden border shadow-sm">
                <GisMap
                  claimsData={geoJsonData}
                  waterData={waterBodiesGeoJson}
                  agriData={agriLandGeoJson}
                  selectedClaimId={selectedClaimId}
                  onClaimSelect={setSelectedClaimId}
                />
              </div>
              <ClaimsData
                claims={filteredClaims}
                onAddClaim={handleAddClaim}
                selectedClaimId={selectedClaimId}
                onClaimSelect={setSelectedClaimId}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
            </div>
            <div className="lg:col-span-1">
              <DecisionSupportPanel claim={selectedClaim} />
            </div>
          </section>

          <section>
            <DataVisualization claims={claims} />
          </section>
        </main>
        <div className="pt-8">
          <MadeWithDyad />
        </div>
      </div>
    </div>
  );
};

export default Index;