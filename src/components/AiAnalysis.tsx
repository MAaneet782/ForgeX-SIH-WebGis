import { generateAiAnalysis } from "@/lib/aiUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, AlertTriangle, Info, Award, TrendingUp, Droplets, Wheat, CalendarDays } from "lucide-react";
import SoilCompositionChart from "./SoilCompositionChart";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";

interface AiAnalysisProps {
  claimId: string;
}

const AiAnalysis = ({ claimId }: AiAnalysisProps) => {
  const analysis = generateAiAnalysis(claimId);

  const chartData = [
    { subject: 'N', value: parseFloat(analysis.soilComposition.N), fullMark: 120 },
    { subject: 'P', value: parseFloat(analysis.soilComposition.P), fullMark: 55 },
    { subject: 'K', value: parseFloat(analysis.soilComposition.K), fullMark: 250 },
    { subject: 'OM %', value: parseFloat(analysis.soilComposition.OM), fullMark: 3 },
    { subject: 'pH', value: parseFloat(analysis.soilComposition.pH), fullMark: 10 },
  ];

  const SoilParamItem = ({ label, value, unit }: { label: string, value: string, unit: string }) => (
    <div className="flex justify-between text-sm p-2 bg-muted/50 rounded-md">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value} {unit}</span>
    </div>
  );

  const CropDetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div className="flex items-center text-sm">
      <Icon className="h-4 w-4 mr-2 text-muted-foreground" />
      <span className="font-medium mr-2">{label}:</span>
      <span className="text-muted-foreground">{value}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <SoilCompositionChart data={chartData} />
            </div>
            <div className="space-y-2">
              <SoilParamItem label="Nitrogen (N)" value={analysis.soilComposition.N} unit="ppm" />
              <SoilParamItem label="Phosphorus (P)" value={analysis.soilComposition.P} unit="ppm" />
              <SoilParamItem label="Potassium (K)" value={analysis.soilComposition.K} unit="ppm" />
              <SoilParamItem label="pH" value={analysis.soilComposition.pH} unit="" />
              <SoilParamItem label="Organic Matter" value={analysis.soilComposition.OM} unit="%" />
              <SoilParamItem label="Temperature" value={analysis.soilComposition.Temperature} unit="°C" />
            </div>
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
          <div className="space-y-2">
            {analysis.improvementRecommendations.map((rec, index) => (
              <Alert key={index}>
                <Info className="h-4 w-4" />
                <AlertDescription>{rec}</AlertDescription>
              </Alert>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Crop Recommendations</h3>
          <Accordion type="single" collapsible className="w-full">
            {analysis.cropRecommendations.map((crop, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{crop.name} ({crop.season})</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-sm text-muted-foreground italic">{crop.notes}</p>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3 bg-muted/50 rounded-md">
                    <CropDetailItem icon={Wheat} label="Est. Yield" value={crop.yield} />
                    <CropDetailItem icon={Droplets} label="Water Need" value={crop.water_need} />
                    <CropDetailItem icon={TrendingUp} label="Profit Potential" value={crop.profit_potential} />
                    <CropDetailItem icon={CalendarDays} label="Sowing Window" value={crop.sowing_window} />
                  </div>

                  {crop.subsidy && (
                    <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/30 dark:border-blue-700">
                      <Award className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <Badge variant="secondary" className="mb-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">{crop.subsidy.scheme}</Badge>
                        <p className="text-sm text-blue-700 dark:text-blue-300">{crop.subsidy.details}</p>
                      </div>
                    </div>
                  )}
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