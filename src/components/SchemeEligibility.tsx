import { useMemo } from "react";
import { schemes, Scheme } from "@/lib/schemes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

// Define the type for a claim
interface Claim {
  claim_id: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

interface SchemeEligibilityProps {
  claim: Claim;
}

// A simple pseudo-random generator to make mock data deterministic
const seededRandom = (seed: number) => {
    let state = seed;
    return () => {
        state = (state * 9301 + 49297) % 233280;
        return state / 233280;
    };
};

const stringToSeed = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return hash;
};

const SchemeEligibility = ({ claim }: SchemeEligibilityProps) => {
  const eligibilityData = useMemo(() => {
    const seed = stringToSeed(claim.claim_id);
    const random = seededRandom(seed);

    return schemes.map((scheme) => {
      let isEligible = random() > 0.4; // Default random eligibility
      if (scheme.name.includes("PM-KISAN") || scheme.name.includes("Forest Rights Act")) {
        isEligible = claim.status === 'Approved';
      }
      return { ...scheme, isEligible };
    });
  }, [claim]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheme Eligibility</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {eligibilityData.map((scheme, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>
                <div className="flex justify-between items-center w-full pr-4">
                  <span className="text-left">{scheme.name}</span>
                  <Badge className={scheme.isEligible ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}>
                    {scheme.isEligible ? "Eligible" : "Not Eligible"}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Eligibility</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {scheme.eligibility.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Overview</h4>
                  <p className="text-sm text-muted-foreground">{scheme.overview}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Benefits</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {scheme.benefits.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default SchemeEligibility;