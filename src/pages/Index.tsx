import { useState } from "react";
import GisMap from "@/components/GisMap";
import ClaimsData from "@/components/ClaimsData";
import { claims as initialClaims, geoJsonData } from "@/data/mockClaims";
import type { Claim } from "@/data/mockClaims";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess, showError } from "@/utils/toast";

const Index = () => {
  const [claims, setClaims] = useState<Claim[]>(initialClaims);

  const handleAddClaim = (newClaimData: Omit<Claim, 'id' | 'status'> & { status: 'Approved' | 'Pending' | 'Rejected' }) => {
    const newClaim: Claim = {
      id: `C${String(claims.length + 1).padStart(3, '0')}`,
      ...newClaimData,
    };
    setClaims(prevClaims => [...prevClaims, newClaim]);
    showSuccess("Successfully added new claim!");
  };

  const handleEditClaim = (updatedClaim: Claim) => {
    setClaims(prevClaims =>
      prevClaims.map(claim =>
        claim.id === updatedClaim.id ? updatedClaim : claim
      )
    );
    showSuccess("Claim updated successfully!");
  };

  const handleDeleteClaim = (claimId: string) => {
    setClaims(prevClaims => prevClaims.filter(claim => claim.id !== claimId));
    showSuccess("Claim deleted successfully.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Forest Rights Act (FRA) Patta Claims Viewer
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            An interactive map and database of legacy claim records.
          </p>
        </header>

        <main className="space-y-8">
          <section>
            <div className="rounded-lg overflow-hidden border shadow-sm">
              <GisMap data={geoJsonData} />
            </div>
          </section>

          <section>
            <ClaimsData
              claims={claims}
              onAddClaim={handleAddClaim}
              onEditClaim={handleEditClaim}
              onDeleteClaim={handleDeleteClaim}
            />
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