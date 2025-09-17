import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Claim } from "@/data/mockClaims";
import type { FeatureCollection, Geometry, Feature } from "geojson";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, IndianRupee, Map, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import ThematicMap from "@/components/ThematicMap";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

const ALLOWED_STATES = ['Odisha', 'Madhya Pradesh', 'Tripura', 'Telangana'];

const fetchClaims = async (): Promise<Claim[]> => {
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .in('state', ALLOWED_STATES); // Filter by allowed states
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
    geometry: item.geometry,
  }));
};

const PROFESSIONAL_COLORS = ['#4f46e5', '#0d9488', '#f59e0b', '#db2777', '#6b7280', '#3b82f6'];

const Analytics = () => {
  const { data: claims = [], isLoading, isError } = useQuery<Claim[]>({
    queryKey: ['claims', 'filtered_analytics'], // Unique key for filtered claims
    queryFn: fetchClaims,
  });

  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  const states = useMemo(() => ['all', ...Array.from(new Set(claims.map(c => c.state).filter(Boolean)))], [claims]);
  const districts = useMemo(() => {
    if (selectedState === 'all') return ['all'];
    return ['all', ...Array.from(new Set(claims.filter(c => c.state === selectedState).map(c => c.district).filter(Boolean)))];
  }, [claims, selectedState]);

  const filteredClaims = useMemo(() => {
    return claims.filter(claim => {
      const stateMatch = selectedState === 'all' || claim.state === selectedState;
      const districtMatch = selectedDistrict === 'all' || claim.district === selectedDistrict;
      return stateMatch && districtMatch;
    });
  }, [claims, selectedState, selectedDistrict]);

  const analyticsData = useMemo(() => {
    if (!filteredClaims || filteredClaims.length === 0) {
      return {
        totalValue: 0,
        totalArea: 0,
        totalClaims: 0,
        valueByDistrict: [],
        valueBySoilType: [],
      };
    }

    const totalValue = filteredClaims.reduce((sum, claim) => sum + claim.estimatedCropValue, 0);
    const totalArea = filteredClaims.reduce((sum, claim) => sum + claim.area, 0);

    const valueByDistrict = filteredClaims.reduce((acc, claim) => {
      acc[claim.district] = (acc[claim.district] || 0) + claim.estimatedCropValue;
      return acc;
    }, {} as Record<string, number>);

    const valueBySoilType = filteredClaims.reduce((acc, claim) => {
      acc[claim.soilType] = (acc[claim.soilType] || 0) + claim.estimatedCropValue;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalValue,
      totalArea,
      totalClaims: filteredClaims.length,
      valueByDistrict: Object.entries(valueByDistrict).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
      valueBySoilType: Object.entries(valueBySoilType).map(([name, value]) => ({ name, value })),
    };
  }, [filteredClaims]);

  const geoJsonData = useMemo((): FeatureCollection => {
    if (!filteredClaims) return { type: "FeatureCollection", features: [] };
    const features = filteredClaims
      .filter(claim => claim.geometry)
      .map((claim): Feature => ({
        type: "Feature",
        properties: { ...claim },
        geometry: claim.geometry as Geometry,
      }));
    return { type: "FeatureCollection", features };
  }, [filteredClaims]);

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
        <Skeleton className="h-96 w-full" />
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

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
              <Label htmlFor="state-filter">Filter by State</Label>
              <Select value={selectedState} onValueChange={(value) => { setSelectedState(value); setSelectedDistrict('all'); }}>
                  <SelectTrigger id="state-filter"><SelectValue placeholder="Select a state" /></SelectTrigger>
                  <SelectContent>
                      {states.map(state => <SelectItem key={state} value={state}>{state === 'all' ? 'All States' : state}</SelectItem>)}
                  </SelectContent>
              </Select>
          </div>
          <div className="flex-1 space-y-2">
              <Label htmlFor="district-filter">Filter by District</Label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={selectedState === 'all'}>
                  <SelectTrigger id="district-filter"><SelectValue placeholder="Select a district" /></SelectTrigger>
                  <SelectContent>
                      {districts.map(district => <SelectItem key={district} value={district}>{district === 'all' ? 'All Districts' : district}</SelectItem>)}
                  </SelectContent>
              </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard 
          icon={IndianRupee} 
          title="Total Estimated Crop Value" 
          value={`₹${(analyticsData.totalValue / 1000).toFixed(1)}k`}
          description="Across all filtered claims"
        />
        <StatCard 
          icon={Map} 
          title="Total Area Mapped" 
          value={`${analyticsData.totalArea.toFixed(1)} acres`}
          description="Total land under filtered claims"
        />
        <StatCard 
          icon={Users} 
          title="Total Claims" 
          value={`${analyticsData.totalClaims}`}
          description="Number of households in filter"
        />
      </div>

      <div className="grid md:grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
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
        <Card className="lg:col-span-2">
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
                    <Cell key={`cell-${index}`} fill={PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} wrapperClassName="rounded-lg border bg-background p-2 shadow-sm" />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Thematic Map Analysis</CardTitle>
            <CardDescription>Visualize claims data based on soil type and water availability.</CardDescription>
          </CardHeader>
          <CardContent className="h-[600px] w-full p-0">
            <ThematicMap claims={filteredClaims} geoJsonData={geoJsonData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;