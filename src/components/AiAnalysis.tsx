import { generateAiAnalysis } from "@/lib/aiUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface AiAnalysisProps {
  claimId: string;
}

const AiAnalysis = ({ claimId }: AiAnalysisProps) => {
  const analysis = generateAiAnalysis(claimId);

  const SoilParamItem = ({ label, value, unit }: { label: string, value: string, unit: string }) => (
    <div className="flex justify-between text-sm p-2 bg-muted/50 rounded-md">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value} {unit}</span>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Predictive Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Soil Composition</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <SoilParamItem label="Nitrogen (N)" value={analysis.soilComposition.N} unit="ppm" />
            <SoilParamItem label="Phosphorus (P)" value={analysis.soilComposition.P} unit="ppm" />
            <SoilParamItem label="Potassium (K)" value={analysis.soilComposition.K} unit="ppm" />
            <SoilParamItem label="pH" value={analysis.soilComposition.pH} unit="" />
            <SoilParamItem label="Organic Matter" value={analysis.soilComposition.OM} unit="%" />
            <SoilParamItem label="Temperature" value={analysis.soilComposition.Temperature} unit="°C" />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Soil Health Assessment</h3>
          <div className={`flex items-center p-3 rounded-md ${analysis.soilHealth.status === 'Good' ? 'bg-green-100 text-green-800' : analysis.soilHealth.status === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
            {analysis.soilHealth.status === 'Good' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertTriangle className="h-5 w-5 mr-2" />}
            <p>Overall soil health is <strong>{analysis.soilHealth.status}</strong> with a score of {analysis.soilHealth.score}/100.</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Improvement Recommendations</h3>
          <ul className="space-y-2 list-disc list-inside text-sm">
            {analysis.improvementRecommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Crop Recommendations</h3>
          <Accordion type="single" collapsible className="w-full">
            {analysis.cropRecommendations.map((crop, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{crop.name} ({crop.season})</AccordionTrigger>
                <AccordionContent>
                  {crop.notes}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiAnalysis;