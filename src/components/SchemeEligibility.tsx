import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import type { Claim } from "@/data/mockClaims";

interface SchemeEligibilityProps {
  claim: Claim;
}

const SchemeEligibility = ({ claim }: SchemeEligibilityProps) => {
  const schemes = [
    { name: "PM-KISAN", isEligible: claim.status === 'Approved' && claim.area < 5 },
    { name: "National Food Security Mission", isEligible: claim.status === 'Approved' },
    { name: "Rashtriya Krishi Vikas Yojana", isEligible: claim.area > 2 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheme Eligibility</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {schemes.map(scheme => (
          <div key={scheme.name} className="flex items-center justify-between">
            <p>{scheme.name}</p>
            {scheme.isEligible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SchemeEligibility;