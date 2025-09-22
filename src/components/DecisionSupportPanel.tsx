import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Claim } from "@/types"; // Updated import
import SchemeEligibility from "./SchemeEligibility";

interface DecisionSupportPanelProps {
  claim: Claim | null;
}

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