import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, BarChart, PieChart, AreaChart } from "lucide-react";
import {
  Bar,
  BarChart as ReBarChart,
  Pie,
  PieChart as RePieChart,
  Line,
  LineChart as ReLineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { generateAiAnalysis, generateGroundwaterAnalysis } from "@/lib/aiUtils";

// Define the type for a claim
interface Claim {
  id: string;
  claim_id: string;
  state: string;
  area: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  created_at: string;
}

// Function to fetch claims data from Supabase
const fetchAllClaims = async (): Promise<Claim[]> => {
  const { data, error } = await supabase
    .from("claims")
    .select("id, claim_id, state, area, status, created_at")
    .in("state", ["Odisha", "Madhya Pradesh"])
    .limit(100); // Fetch more data for analytics

  if (error) {
    throw new Error(error.message);
  }

  return data as Claim[];
};

const Analytics = () => {
  const { data: claims, isLoading, isError, error } = useQuery<Claim[], Error>({
    queryKey: ["allClaims"],
    queryFn: fetchAllClaims,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Advanced Analytics</h1>
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
          <AlertDescription>
            Failed to load analytics data: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Process data for charts
  const statusData = claims.reduce((acc, claim) => {
    const existing = acc.find(item => item.name === claim.status);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: claim.status, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const stateData = claims.reduce((acc, claim) => {
    const existing = acc.find(item => item.name === claim.state);
    if (existing) {
      existing.claims++;
      existing.area += claim.area;
    } else {
      acc.push({ name: claim.state, claims: 1, area: claim.area });
    }
    return acc;
  }, [] as { name: string; claims: number; area: number }[]);

  const aiAnalyses = claims.map(claim => ({
    ...generateAiAnalysis(claim.claim_id),
    ...generateGroundwaterAnalysis(claim.claim_id),
  }));

  const soilHealthData = aiAnalyses.reduce((acc, analysis) => {
    const status = analysis.soilHealth.status;
    const existing = acc.find(item => item.name === status);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: status, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const groundwaterData = aiAnalyses.reduce((acc, analysis) => {
    const status = analysis.status;
    const existing = acc.find(item => item.name === status);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: status, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const cropData = aiAnalyses.flatMap(a => a.cropRecommendations).reduce((acc, crop) => {
    const existing = acc.find(item => item.name === crop.name);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ name: crop.name, count: 1 });
    }
    return acc;
  }, [] as { name: string; count: number }[]).sort((a, b) => b.count - a.count).slice(0, 5);

  const claimsOverTime = claims.reduce((acc, claim) => {
    const month = new Date(claim.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
    const existing = acc.find(item => item.name === month);
    if (existing) {
      existing.claims++;
    } else {
      acc.push({ name: month, claims: 1 });
    }
    return acc;
  }, [] as { name: string; claims: number }[]).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());


  const COLORS = {
    status: { 'Approved': '#22c55e', 'Pending': '#f59e0b', 'Rejected': '#ef4444' },
    soil: { 'Good': '#22c55e', 'Moderate': '#f59e0b', 'Poor': '#ef4444' },
    groundwater: { 'Excellent': '#3b82f6', 'Good': '#22c55e', 'Moderate': '#f59e0b', 'Poor': '#ef4444' },
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-shadow">Advanced Analytics</h1>
        <p className="text-muted-foreground">Aggregated and anonymized data from FRA claims.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claims.length}</div>
            <p className="text-xs text-muted-foreground">Across Odisha & Madhya Pradesh</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Area Mapped</CardTitle>
            <AreaChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claims.reduce((sum, c) => sum + c.area, 0).toFixed(2)} acres</div>
            <p className="text-xs text-muted-foreground">Under FRA recognition</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Claim Size</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(claims.reduce((sum, c) => sum + c.area, 0) / claims.length).toFixed(2)} acres</div>
            <p className="text-xs text-muted-foreground">Per claim holder</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Claims by Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS.status[entry.name as keyof typeof COLORS.status]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Claims by State</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ReBarChart data={stateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="claims" fill="hsl(var(--primary))" />
                <Bar dataKey="area" fill="#82ca9d" name="Area (acres)" />
              </ReBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Soil Health Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie data={soilHealthData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} label>
                   {soilHealthData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS.soil[entry.name as keyof typeof COLORS.soil]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Groundwater Potential</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie data={groundwaterData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} label>
                  {groundwaterData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS.groundwater[entry.name as keyof typeof COLORS.groundwater]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Recommended Crops</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <ReBarChart data={cropData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="Recommendations" />
              </ReBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader><CardTitle>Claims Over Time</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ReLineChart data={claimsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="claims" stroke="hsl(var(--primary))" strokeWidth={2} />
            </ReLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
};

export default Analytics;