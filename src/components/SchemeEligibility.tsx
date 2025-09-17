import { ArrowUpRight, AlertCircle, CheckCircle2, XCircle, Info, HandCoins, Home, Users, ShieldCheck, IndianRupee } from "lucide-react";
import type { Claim } from "@/data/mockClaims";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SchemeEligibilityProps {
  claim: Claim;
}

interface SchemeDetail {
  name: string;
  url: string;
  isEligible: boolean;
  eligibilityConditions: string[];
  keyBenefits: string[];
  verificationProcess: string[];
  intendedCoverage: string;
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

// Icon mapping for scheme details
const detailIconMap: { [key: string]: React.ElementType } = {
  eligibilityConditions: CheckCircle2,
  keyBenefits: IndianRupee,
  verificationProcess: ShieldCheck,
  intendedCoverage: Users,
};

const SchemeEligibility = ({ claim }: SchemeEligibilityProps) => {
  const [schemes, setSchemes] = useState<SchemeDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEligibility = async () => {
      if (!claim) return;

      setIsLoading(true);
      setError(null);

      try {
        // Pass the full claim object to the edge function
        const { data, error: functionError } = await supabase.functions.invoke('scheme-eligibility', {
          body: { claim },
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
    <div className="space-y-6">
      <h4 className="text-lg font-semibold">Government Scheme Eligibility</h4>
      <div className="space-y-4">
        {schemes.map((scheme) => (
          <Card key={scheme.name} className="bg-card transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">{scheme.name}</CardTitle>
                <Badge 
                  variant={scheme.isEligible ? 'default' : 'destructive'} 
                  className={cn(
                    scheme.isEligible && "bg-green-500 hover:bg-green-600 text-white"
                  )}
                >
                  {scheme.isEligible ? 'Eligible' : 'Not Eligible'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{scheme.reason}</p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <Separator />
              <div className="space-y-2">
                <h5 className="font-medium flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Eligibility Conditions</h5>
                <ul className="list-disc list-inside pl-4 text-muted-foreground">
                  {scheme.eligibilityConditions.map((condition, i) => <li key={i}>{condition}</li>)}
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium flex items-center"><IndianRupee className="mr-2 h-4 w-4 text-blue-600" /> Key Benefits</h5>
                <ul className="list-disc list-inside pl-4 text-muted-foreground">
                  {scheme.keyBenefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-purple-600" /> Verification Process</h5>
                <ul className="list-disc list-inside pl-4 text-muted-foreground">
                  {scheme.verificationProcess.map((process, i) => <li key={i}>{process}</li>)}
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium flex items-center"><Users className="mr-2 h-4 w-4 text-orange-600" /> Intended Coverage</h5>
                <p className="pl-4 text-muted-foreground">{scheme.intendedCoverage}</p>
              </div>
              <a 
                href={scheme.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-medium text-primary hover:underline flex items-center mt-4"
              >
                Visit Scheme Website <ArrowUpRight className="ml-1 h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SchemeEligibility;