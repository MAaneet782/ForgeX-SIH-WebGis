import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, IndianRupee, Info, ShieldCheck, Users, ArrowUpRight } from "lucide-react";

// --- Type Definitions for Scheme Eligibility ---
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

const SchemeEligibilitySkeleton = () => (
  <Card>
    <CardHeader>
      <CardTitle>Government Scheme Eligibility</CardTitle>
      <CardDescription>Analyzing eligibility for various government schemes...</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
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
    </CardContent>
  </Card>
);

const SchemeEligibilitySection = ({ schemes, isLoading, isError, error }: SchemeEligibilitySectionProps) => {
  if (isLoading) {
    return <SchemeEligibilitySkeleton />;
  }

  if (isError || !schemes) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Government Scheme Eligibility</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Eligibility Analysis Failed</AlertTitle>
            <AlertDescription>
              Could not retrieve scheme eligibility. {error?.message || "An unknown error occurred."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Government Scheme Eligibility</CardTitle>
        <CardDescription>Analysis of relevant government schemes based on claim details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
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
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h5 className="font-medium flex items-center"><Info className="mr-2 h-4 w-4 text-blue-600" /> Scheme Overview</h5>
                  <p className="pl-4 text-muted-foreground">{scheme.schemeOverview}</p>
                </div>
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
      </CardContent>
    </Card>
  );
};

export default SchemeEligibilitySection;