import { CheckCircle, XCircle } from "lucide-react";
import type { Claim } from "@/data/mockClaims";

interface SchemeEligibilityProps {
  claim: Claim;
}

const SchemeEligibility = ({ claim }: SchemeEligibilityProps) => {
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

export default SchemeEligibility;