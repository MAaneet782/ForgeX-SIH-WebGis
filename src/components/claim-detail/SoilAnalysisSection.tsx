import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Sprout, Droplets, Thermometer, CloudRain, LeafyGreen, FlaskConical, Microscope, Lightbulb } from "lucide-react";
import type { SoilAnalysis } from "@/lib/ai-analysis";

interface SoilAnalysisSectionProps {
  soilAnalysis: SoilAnalysis | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const SoilAnalysisSection = ({ soilAnalysis, isLoading, isError, error }: SoilAnalysisSectionProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Soil Composition & Health</CardTitle>
          <CardDescription>Analyzing soil parameters and providing insights...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-6 w-1/2 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Separator />
          <Skeleton className="h-6 w-1/2 mb-4" />
          <Skeleton className="h-5 w-1/4 mb-2" />
          <Skeleton className="h-6 w-full mb-4" />
          <ul className="list-disc list-inside text-sm space-y-2">
            <li><Skeleton className="h-4 w-4/5" /></li>
            <li><Skeleton className="h-4 w-3/5" /></li>
          </ul>
        </CardContent>
      </Card>
    );
  }

  if (isError || !soilAnalysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Soil Composition & Health</CardTitle>
          <CardDescription>Detailed analysis of your land's soil.</CardDescription>
        </CardHeader>
        <CardContent className="text-red-500 text-center py-12">
          Error loading soil analysis: {error?.message || "No soil analysis data available."}
        </CardContent>
      </Card>
    );
  }

  const { composition, healthAssessment, recommendations } = soilAnalysis;

  const soilParameters = [
    { label: "Nitrogen (N)", value: `${composition.n} ppm`, icon: LeafyGreen },
    { label: "Phosphorus (P)", value: `${composition.p} ppm`, icon: Sprout },
    { label: "Potassium (K)", value: `${composition.k} ppm`, icon: FlaskConical },
    { label: "pH", value: composition.pH.toFixed(1), icon: Microscope },
    { label: "EC", value: `${composition.ec} mS/cm`, icon: Droplets },
    { label: "Organic Matter (OM)", value: `${composition.om}%`, icon: LeafyGreen },
    { label: "CaCO3", value: `${composition.caco3}%`, icon: FlaskConical },
    { label: "Sand", value: `${composition.sand}%`, icon: Sprout },
    { label: "Silt", value: `${composition.silt}%`, icon: Sprout },
    { label: "Clay", value: `${composition.clay}%`, icon: Sprout },
    { label: "Temperature", value: `${composition.temperature}°C`, icon: Thermometer },
    { label: "Humidity", value: `${composition.humidity}%`, icon: CloudRain },
    { label: "Rainfall", value: `${composition.rainfall} mm`, icon: CloudRain },
    { label: "Magnesium (Mg)", value: `${composition.mg} ppm`, icon: FlaskConical },
    { label: "Iron (Fe)", value: `${composition.fe} ppm`, icon: FlaskConical },
    { label: "Zinc (Zn)", value: `${composition.zn} ppm`, icon: FlaskConical },
    { label: "Manganese (Mn)", value: `${composition.mn} ppm`, icon: FlaskConical },
  ];

  const getHealthBadgeVariant = (score: number) => {
    if (score > 80) return "default"; // Excellent
    if (score > 60) return "secondary"; // Good
    if (score > 40) return "outline"; // Moderate
    return "destructive"; // Poor
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Soil Composition & Health</CardTitle>
        <CardDescription>Detailed analysis of your land's soil parameters and health.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Soil Composition Data */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center"><FlaskConical className="mr-2 h-5 w-5 text-gray-600" /> Soil Composition</h3>
          <div className="max-h-[300px] overflow-y-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {soilParameters.map((param, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium flex items-center">
                      <param.icon className="h-4 w-4 mr-2 text-muted-foreground" /> {param.label}
                    </TableCell>
                    <TableCell>{param.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <Separator />

        {/* Soil Health Assessment */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center"><LeafyGreen className="mr-2 h-5 w-5 text-green-600" /> Soil Health Assessment</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Overall Health Score:</h4>
              <Badge variant={getHealthBadgeVariant(healthAssessment.overallScore)} className="text-lg px-3 py-1">
                {healthAssessment.overallScore} / 100
              </Badge>
            </div>
            <Progress value={healthAssessment.overallScore} className="w-full" />
            <p className="text-sm text-center font-medium text-muted-foreground">Fertility Rating: <span className="font-bold">{healthAssessment.fertilityRating}</span></p>
          </div>

          <Accordion type="single" collapsible className="w-full mt-4">
            {healthAssessment.strengths.length > 0 && (
              <AccordionItem value="strengths">
                <AccordionTrigger className="text-sm font-medium py-2">
                  <Lightbulb className="mr-2 h-4 w-4 text-blue-500" /> Key Strengths
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pl-6">
                  <ul className="list-disc list-inside space-y-1">
                    {healthAssessment.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
            {healthAssessment.deficiencies.length > 0 && (
              <AccordionItem value="deficiencies">
                <AccordionTrigger className="text-sm font-medium py-2">
                  <Lightbulb className="mr-2 h-4 w-4 text-red-500" /> Key Deficiencies
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pl-6">
                  <ul className="list-disc list-inside space-y-1">
                    {healthAssessment.deficiencies.map((deficiency, idx) => (
                      <li key={idx}>{deficiency}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>

        <Separator />

        {/* Actionable Recommendations */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-yellow-600" /> Actionable Recommendations</h3>
          <Accordion type="single" collapsible className="w-full">
            {recommendations.healthImprovement.length > 0 && (
              <AccordionItem value="health-improvement">
                <AccordionTrigger className="text-sm font-medium py-2">
                  Improve Soil Health
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pl-6">
                  <ul className="list-disc list-inside space-y-1">
                    {recommendations.healthImprovement.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
            {recommendations.cropSuitability.length > 0 && (
              <AccordionItem value="crop-suitability">
                <AccordionTrigger className="text-sm font-medium py-2">
                  Recommended Crops
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pl-6">
                  <ul className="list-disc list-inside space-y-1">
                    {recommendations.cropSuitability.map((crop, idx) => (
                      <li key={idx}>{crop}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoilAnalysisSection;