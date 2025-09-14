import { useState, lazy, Suspense } from "react";
import ClaimsData from "@/components/ClaimsData";
import { claims as initialClaims, geoJsonData } from "@/data/mockClaims";
import type { Claim } from "@/data/mockClaims";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";

const GisMap = lazy(() => import("@/components/GisMap"));

const Index = () => {
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  const handleAddClaim = (newClaimData: Omit<Claim, 'id'>) => {
    const newClaim: Claim = {
      id: `C${String(claims.length + 1).padStart(3, '0')}`,
      ...newClaimData,
    };
    setClaims(prevClaims => [...prevClaims, newClaim]);
    showSuccess("Successfully added new claim!");
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
              <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
                <GisMap
                  data={geoJsonData}
                  selectedClaimId={selectedClaimId}
                  onClaimSelect={setSelectedClaimId}
                />
              </Suspense>
            </div>
          </section>

          <section>
            <ClaimsData
              claims={claims}
              onAddClaim={handleAddClaim}
              selectedClaimId={selectedClaimId}
              onClaimSelect={setSelectedClaimId}
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