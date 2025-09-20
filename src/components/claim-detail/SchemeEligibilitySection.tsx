import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface SchemeDetail {
  name: string;
  url: string;
  isEligible: boolean;
  eligibilityConditions: string[];
  schemeOverview: string;
  keyBenefits: string[];
  verificationProcess: string[];
  intendedCoverage: string;
  reason: string;
}

interface SchemeEligibilitySectionProps {
  schemes: SchemeDetail[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const SchemeEligibilitySection = ({ schemes, isLoading, isError, error }: SchemeEligibilitySectionProps) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Scheme Eligibility</CardTitle>
        <CardDescription>Automated assessment for government schemes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : isError ? (
          <div className="text-red-500 text-sm">
            Error loading schemes: {error?.message || "Unknown error."}
          </div>
        ) : schemes && schemes.length > 0 ? (
          schemes.map((scheme) => (
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
                {scheme.url && (
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs mt-1" asChild>
                    <a href={scheme.url} target="_blank" rel="noopener noreferrer">
                      Learn More <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground text-center py-4">
            No scheme eligibility data available.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SchemeEligibilitySection;