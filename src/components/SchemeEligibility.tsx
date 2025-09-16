import { ArrowUpRight } from "lucide-react";
import type { Claim } from "@/data/mockClaims";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SchemeEligibilityProps {
  claim: Claim;
}

const SchemeEligibility = ({ claim }: SchemeEligibilityProps) => {
  const schemes = [
    {
      name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      url: "https://pmkisan.gov.in/",
      isEligible: claim.status === 'Approved' && claim.area < 5,
      reason: claim.status !== 'Approved' ? "Claim not approved." : claim.area >= 5 ? "Area exceeds 5 acre limit." : "All criteria met.",
    },
    {
      name: "National Food Security Mission",
      url: "https://www.nfsm.gov.in/",
      isEligible: claim.status === 'Approved',
      reason: claim.status === 'Approved' ? "Claim is approved." : "Claim not approved.",
    },
    {
      name: "Rashtriya Krishi Vikas Yojana (RKVY)",
      url: "https://rkvy.nic.in/",
      isEligible: claim.area > 2,
      reason: claim.area > 2 ? "Area is above the 2 acre minimum." : "Area is 2 acres or less.",
    },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold">Scheme Eligibility Analysis</h4>
      <div className="space-y-3">
        {schemes.map((scheme) => (
          <div key={scheme.name} className="p-4 border rounded-lg bg-card transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <h5 className="font-semibold mb-2 sm:mb-0">{scheme.name}</h5>
              <Badge 
                variant={scheme.isEligible ? 'outline' : 'destructive'} 
                className={cn(
                  scheme.isEligible && "border-green-500/50 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                )}
              >
                {scheme.isEligible ? 'Eligible' : 'Not Eligible'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{scheme.reason}</p>
            <a 
              href={scheme.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-medium text-primary hover:underline flex items-center"
            >
              Visit Scheme Website <ArrowUpRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemeEligibility;