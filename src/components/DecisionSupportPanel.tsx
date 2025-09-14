import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Claim } from "@/data/mockClaims";
import { Check, AlertTriangle } from "lucide-react";

interface DecisionSupportPanelProps {
  claim: Claim | null;
}

const DecisionSupportPanel = ({ claim }: DecisionSupportPanelProps) => {
  if (!claim) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Decision Support System</CardTitle>
          <CardDescription>
            Select a claim from the map or table to see details and scheme
            recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <p>No claim selected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock DSS logic
  const schemes = [
    {
      name: "PM-KISAN",
      eligible: claim.status === "Approved",
      reason: "Requires approved land title.",
    },
    {
      name: "Jal Jeevan Mission",
      eligible: true,
      reason: "Recommended for providing household tap connection.",
    },
    {
      name: "MGNREGA",
      eligible: true,
      reason: "All rural households are eligible for wage employment.",
    },
    {
      name: "DAJGUA",
      eligible: claim.state === "Maharashtra",
      reason: "Scheme specific to certain states (example).",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Decision Support for: {claim.holderName}</CardTitle>
        <CardDescription>
          Claim ID: {claim.id} | Village: {claim.village}, {claim.district}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Claim Details</h4>
          <p>
            <strong>Area:</strong> {claim.area} acres
          </p>
          <p>
            <strong>Status:</strong> <Badge>{claim.status}</Badge>
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Recommended Schemes</h4>
          <ul className="space-y-2">
            {schemes.map((scheme) => (
              <li
                key={scheme.name}
                className="flex items-start p-2 rounded-md border"
              >
                <div className="flex-shrink-0 mr-3 mt-1">
                  {scheme.eligible ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {scheme.name} -{" "}
                    <span
                      className={
                        scheme.eligible ? "text-green-600" : "text-yellow-600"
                      }
                    >
                      {scheme.eligible ? "Eligible" : "Review Needed"}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {scheme.reason}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DecisionSupportPanel;