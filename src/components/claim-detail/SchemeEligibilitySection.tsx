import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, ExternalLink, Info, Handshake, ShieldCheck, Users, CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

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
          <div className="space-y-6">
            {schemes.map((scheme) => (
              <div key={scheme.name} className="border rounded-lg p-4 bg-muted/20">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-base">{scheme.name}</h3>
                  <Badge variant={scheme.isEligible ? 'default' : 'destructive'} className="ml-2">
                    {scheme.isEligible ? 'Eligible' : 'Not Eligible'}
                  </Badge>
                </div>
                <p className={`text-sm mb-3 ${scheme.isEligible ? 'text-green-600' : 'text-red-600'}`}>
                  {scheme.isEligible ? "Eligible" : "Not Eligible"}: <span className="text-muted-foreground">{scheme.reason}</span>
                </p>
                {scheme.url && (
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs mt-1 mb-3" asChild>
                    <a href={scheme.url} target="_blank" rel="noopener noreferrer">
                      Learn More <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                )}

                <Accordion type="single" collapsible className="w-full">
                  {scheme.schemeOverview && (
                    <AccordionItem value="overview">
                      <AccordionTrigger className="text-sm font-medium py-2">
                        <Info className="mr-2 h-4 w-4 text-blue-500" /> Scheme Overview
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pl-6">
                        {scheme.schemeOverview}
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {scheme.eligibilityConditions && scheme.eligibilityConditions.length > 0 && (
                    <AccordionItem value="conditions">
                      <AccordionTrigger className="text-sm font-medium py-2">
                        <Handshake className="mr-2 h-4 w-4 text-purple-500" /> Eligibility Conditions
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pl-6">
                        <ul className="list-disc list-inside space-y-1">
                          {scheme.eligibilityConditions.map((condition, idx) => (
                            <li key={idx}>{condition}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {scheme.keyBenefits && scheme.keyBenefits.length > 0 && (
                    <AccordionItem value="benefits">
                      <AccordionTrigger className="text-sm font-medium py-2">
                        <ShieldCheck className="mr-2 h-4 w-4 text-green-500" /> Key Benefits
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pl-6">
                        <ul className="list-disc list-inside space-y-1">
                          {scheme.keyBenefits.map((benefit, idx) => (
                            <li key={idx}>{benefit}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {scheme.verificationProcess && scheme.verificationProcess.length > 0 && (
                    <AccordionItem value="verification">
                      <AccordionTrigger className="text-sm font-medium py-2">
                        <CalendarDays className="mr-2 h-4 w-4 text-yellow-500" /> Verification Process
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pl-6">
                        <ul className="list-disc list-inside space-y-1">
                          {scheme.verificationProcess.map((process, idx) => (
                            <li key={idx}>{process}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {scheme.intendedCoverage && (
                    <AccordionItem value="coverage">
                      <AccordionTrigger className="text-sm font-medium py-2">
                        <Users className="mr-2 h-4 w-4 text-orange-500" /> Intended Coverage
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pl-6">
                        {scheme.intendedCoverage}
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </div>
            ))}
          </div>
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