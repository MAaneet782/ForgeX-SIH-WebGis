import { schemes, Scheme } from "@/lib/schemes";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const Schemes = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-shadow">Government Schemes</h1>
        <p className="text-muted-foreground">
          Information on schemes relevant to FRA beneficiaries.
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {schemes.map((scheme: Scheme, index: number) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <span className="text-left font-semibold">{scheme.name}</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Overview</h4>
                    <p className="text-sm text-muted-foreground">{scheme.overview}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Eligibility</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {scheme.eligibility.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold">Benefits</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {scheme.benefits.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                  <Button asChild variant="link" className="p-0 h-auto">
                    <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                      Learn More
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Schemes;