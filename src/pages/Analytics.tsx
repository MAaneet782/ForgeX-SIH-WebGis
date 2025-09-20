import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Claim } from "@/data/mockClaims";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, IndianRupee, Map, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({ icon: Icon, title, value, description }: { icon: React.ElementType, title: string, value: string, description: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const fetchClaims = async (): Promise<Claim[]> => {
  const { data, error } = await supabase.from('claims').select('*');
  if (error) throw new Error(error.message);
  return data.map(item => ({
    id: item.claim_id,
    holderName: item.holder_name,
    village: item.village,
    district: item.district,
    state: item.state,
    area: item.area,
    status: item.status,
    documentName: item.document_name,
    soilType: item.soil_type,
    waterAvailability: item.water_availability,
    estimatedCropValue: item.estimated_crop_value,
    created_at: item.created_at, // Added created_at
  }));
};

const Analytics = () => {
  const { data: claims = [], isLoading, isError } = useQuery<Claim[]>({
    queryKey: ['claims'],
    queryFn: fetchClaims,
  });

  const analyticsData = useMemo(() => {
    if (!claims || claims.length === 0) {
      return {
        totalValue: 0,
        totalArea: 0,
        totalClaims: 0,
        valueByDistrict: [],
        valueBySoilType: [],
      };
    }

    const totalValue = claims.reduce((sum, claim) => sum + claim.estimatedCropValue, 0);
    const totalArea = claims.reduce((sum, claim) => sum + claim.area, 0);

    const valueByDistrict = claims.reduce((acc, claim) => {
      acc[claim.district] = (acc[claim.district] || 0) + claim.estimatedCropValue;
      return acc;
    }, {} as Record<string, number>);

    const valueBySoilType = claims.reduce((acc, claim) => {
      acc[claim.soilType] = (acc[claim.soilType] || 0) + claim.estimatedCropValue;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalValue,
      totalArea,
      totalClaims: claims.length,
      valueByDistrict: Object.entries(valueByDistrict).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
      valueBySoilType: Object.entries(valueBySoilType).map(([name, value]) => ({ name, value })),
    };
  }, [claims]);

  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-8 w-1/2" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <Skeleton className="md:col-span-3 h-96 w-full" />
          <Skeleton className="md:col-span-2 h-96 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500 text-center p-8">Error loading analytics data.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      <Button asChild variant="outline" className="mb-4">
        <Link to="/atlas"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
      </Button>
      
      <header>
        <h1 className="text-3xl font-bold">Advanced Analytics</h1>
        <p className="text-muted-foreground">Economic and agricultural insights from FRA claims data.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard 
          icon={IndianRupee} 
          title="Total Estimated Crop Value" 
          value={`₹${(analyticsData.totalValue / 1000).toFixed(1)}k`}
          description="Across all digitized claims"
        />
        <StatCard 
          icon={Map} 
          title="Total Area Mapped" 
          value={`${analyticsData.totalArea.toFixed(1)} acres`}
          description="Total land under FRA claims"
        />
        <StatCard 
          icon={Users} 
          title="Total Claims" 
          value={`${analyticsData.totalClaims}`}
          description="Number of households served"
        />
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Crop Value by District</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={analyticsData.valueByDistrict} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `₹${value/1000}k`} />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, "Est. Value"]} wrapperClassName="rounded-lg border bg-background p-2 shadow-sm" />
                <Legend />
                <Bar dataKey="value" name="Estimated Crop Value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Crop Value by Soil Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={analyticsData.valueBySoilType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData.valueBySoilType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} wrapperClassName="rounded-lg border bg-background p-2 shadow-sm" />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;