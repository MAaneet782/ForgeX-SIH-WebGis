import { ArrowUpRight, AlertCircle } from "lucide-react";
import type { Claim } from "@/data/mockClaims";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SchemeEligibilityProps {
  claim: Claim;
}

interface Scheme {
  name: string;
  url: string;
  isEligible: boolean;
  reason: string;
}

const SchemeEligibilitySkeleton = () => (
  <div className="space-y-4">
    <h4 className="text-md font-semibold">Scheme Eligibility Analysis</h4>
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-4 w-4/5 mb-3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  </div>
);

const SchemeEligibility = ({ claim }: SchemeEligibilityProps) => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEligibility = async () => {
      if (!claim) return;

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: functionError } = await supabase.functions.invoke('scheme-eligibility', {
          body: { claim: { status: claim.status, area: claim.area } },
        });

        if (functionError) {
          throw functionError;
        }

        if (data && data.schemes) {
          setSchemes(data.schemes);
        } else {
          throw new Error("Invalid response from eligibility function.");
        }
      } catch (e: any) {
        setError(e.message || "Failed to fetch scheme eligibility.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEligibility();
  }, [claim]);

  if (isLoading) {
    return <SchemeEligibilitySkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not load scheme eligibility data. {error}
        </AlertDescription>
      </Alert>
    );
  }

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