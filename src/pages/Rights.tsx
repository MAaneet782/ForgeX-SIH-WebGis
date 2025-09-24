import { forestRights, ForestRight } from "@/lib/rights";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const Rights = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-shadow">Types of Forest Rights</h1>
        <p className="text-muted-foreground">
          Understanding the rights recognized under the Forest Rights Act, 2006.
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {forestRights.map((right: ForestRight, index: number) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full pr-4">
                    <span className="text-left font-semibold">{right.title}</span>
                    <Badge variant="secondary">{right.section}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Description</h4>
                    <p className="text-sm text-muted-foreground">{right.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Key Details</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {right.details.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rights;