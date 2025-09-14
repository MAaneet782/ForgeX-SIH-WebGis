import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Claim } from "@/data/mockClaims";
import { CheckCircle, XCircle } from "lucide-react";

interface DecisionSupportPanelProps {
  claim: Claim | null;
}

const SchemeEligibility = ({ claim }: { claim: Claim }) => {
  const schemes = [
    {
      name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      isEligible: claim.status === 'Approved' && claim.area < 5,
      reason: claim.status !== 'Approved' ? "Claim not approved" : claim.area >= 5 ? "Area exceeds 5 acres" : "Eligible",
    },
    {
      name: "National Food Security Mission",
      isEligible: claim.status === 'Approved',
      reason: claim.status === 'Approved' ? "Eligible" : "Claim not approved",
    },
    {
      name: "Rashtriya Krishi Vikas Yojana (RKVY)",
      isEligible: claim.area > 2,
      reason: claim.area > 2 ? "Eligible" : "Area is 2 acres or less",
    },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold">Scheme Eligibility Analysis</h4>
      {schemes.map((scheme) => (
        <div key={scheme.name} className="flex items-start space-x-3">
          {scheme.isEligible ? (
            <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
          )}
          <div>
            <p className="font-medium">{scheme.name}</p>
            <p className={`text-sm ${scheme.isEligible ? 'text-green-600' : 'text-red-600'}`}>
              {scheme.isEligible ? "Eligible" : "Not Eligible"}: <span className="text-muted-foreground">{scheme.reason}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const DecisionSupportPanel = ({ claim }: DecisionSupportPanelProps) => {
  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Decision Support Panel</CardTitle>
        <CardDescription>
          Details and scheme eligibility for the selected claim.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {claim ? (
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-semibold mb-2">Claim Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Holder Name:</span> <span className="font-medium">{claim.holderName}</span></div>
                <div className="flex justify-between"><span>Village:</span> <span className="font-medium">{claim.village}</span></div>
                <div className="flex justify-between"><span>Area (acres):</span> <span className="font-medium">{claim.area.toFixed(2)}</span></div>
                <div className="flex justify-between items-center"><span>Status:</span> <Badge variant={claim.status === 'Approved' ? 'default' : claim.status === 'Pending' ? 'secondary' : 'destructive'}>{claim.status}</Badge></div>
                {claim.documentName && <div className="flex justify-between"><span>Document:</span> <span className="font-medium truncate">{claim.documentName}</span></div>}
              </div>
            </div>
            <Separator />
            <SchemeEligibility claim={claim} />
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p>Select a claim from the map or table to see details.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DecisionSupportPanel;