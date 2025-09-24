import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Leaf, Droplets, Wheat } from "lucide-react";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { generateAiAnalysis } from "@/lib/aiUtils";

// Function to fetch claims data from Supabase
const fetchAllClaims = async () => {
  const { data, error } = await supabase
    .from("claims")
    .select("id, claim_id")
    .in("state", ["Odisha", "Madhya Pradesh"])
    .limit(100);

  if (error) throw new Error(error.message);
  return data;
};

const Agriculture = () => {
  const { data: claims, isLoading, isError, error } = useQuery({
    queryKey: ["allClaimsForAgri"],
    queryFn: fetchAllClaims,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Agricultural Insights</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load data: {error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const aiAnalyses = claims.map(claim => generateAiAnalysis(claim.claim_id));

  const soilHealthData = aiAnalyses.reduce((acc, analysis) => {
    const status = analysis.soilHealth.status;
    const existing = acc.find(item => item.name === status);
    if (existing) existing.value++;
    else acc.push({ name: status, value: 1 });
    return acc;
  }, []);

  const cropData = aiAnalyses.flatMap(a => a.cropRecommendations).reduce((acc, crop) => {
    const existing = acc.find(item => item.name === crop.name);
    if (existing) existing.count++;
    else acc.push({ name: crop.name, count: 1 });
    return acc;
  }, []).sort((a, b) => b.count - a.count).slice(0, 7);

  const avgSoilParams = aiAnalyses.reduce((acc, analysis) => {
    acc.N += parseFloat(analysis.soilComposition.N);
    acc.P += parseFloat(analysis.soilComposition.P);
    acc.K += parseFloat(analysis.soilComposition.K);
    return acc;
  }, { N: 0, P: 0, K: 0 });

  const totalAnalyses = aiAnalyses.length;
  avgSoilParams.N /= totalAnalyses;
  avgSoilParams.P /= totalAnalyses;
  avgSoilParams.K /= totalAnalyses;

  const COLORS = { 'Good': '#22c55e', 'Moderate': '#f59e0b', 'Poor': '#ef4444' };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-shadow">Agricultural Insights</h1>
        <p className="text-muted-foreground">Aggregated analysis of soil health and crop suitability.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Nitrogen (N)</CardTitle>
            <Leaf className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSoilParams.N.toFixed(2)} ppm</div>
            <p className="text-xs text-muted-foreground">Ideal range: 50-120 ppm</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Phosphorus (P)</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSoilParams.P.toFixed(2)} ppm</div>
            <p className="text-xs text-muted-foreground">Ideal range: 15-30 ppm</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Potassium (K)</CardTitle>
            <Wheat className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSoilParams.K.toFixed(2)} ppm</div>
            <p className="text-xs text-muted-foreground">Ideal range: 100-200 ppm</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader><CardTitle>Top Recommended Crops</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cropData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" name="Recommendations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Soil Health Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={soilHealthData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {soilHealthData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Agriculture;