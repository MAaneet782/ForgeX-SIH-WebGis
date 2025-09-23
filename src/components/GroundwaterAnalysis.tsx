import { generateGroundwaterAnalysis } from "@/lib/aiUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface GroundwaterAnalysisProps {
  claimId: string;
}

const GroundwaterAnalysis = ({ claimId }: GroundwaterAnalysisProps) => {
  const analysis = generateGroundwaterAnalysis(claimId);

  const getStatusColor = () => {
    switch (analysis.status) {
      case "Excellent": return "bg-blue-500";
      case "Good": return "bg-green-500";
      case "Moderate": return "bg-yellow-500";
      case "Poor": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Groundwater Potential</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Index Score: {analysis.score}/10</span>
          <Badge className={getStatusColor()}>{analysis.status}</Badge>
        </div>
        <Progress value={analysis.score * 10} className="h-2" />
        <div>
          <h4 className="font-semibold text-sm">Recommendation</h4>
          <p className="text-sm text-muted-foreground">{analysis.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroundwaterAnalysis;