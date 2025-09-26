import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapContainer, TileLayer, Popup, GeoJSON } from "react-leaflet";
import { AlertTriangle, Users, MapPin, FileText, TrendingUp, CheckSquare, Award } from "lucide-react";
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
import { indiaStatesGeo } from "@/lib/indiaStatesGeo";
import MapLegend from "@/components/MapLegend";
import { Layer } from "leaflet";

const fetchStateAnalytics = async () => {
  const { data, error } = await supabase.from("state_fra_analytics").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const fetchTimeSeriesAnalytics = async () => {
  const { data, error } = await supabase.from("fra_time_series_analytics").select("*").order('report_date');
  if (error) throw new Error(error.message);
  return data;
};

const StateWiseAnalytics = () => {
  const { data: stateData, isLoading: isLoadingState, isError, error } = useQuery({ queryKey: ["stateAnalytics"], queryFn: fetchStateAnalytics });
  const { data: timeData, isLoading: isLoadingTime } = useQuery({ queryKey: ["timeSeriesAnalytics"], queryFn: fetchTimeSeriesAnalytics });

  if (isLoadingState || isLoadingTime) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error?.message || "Failed to load analytics data."}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // --- Data Processing ---
  const totalClaims = stateData?.reduce((acc, s) => acc + s.claims_received_individual + s.claims_received_community, 0) || 0;
  const totalTitles = stateData?.reduce((acc, s) => acc + s.titles_distributed_individual + s.titles_distributed_community, 0) || 0;
  const totalLand = stateData?.reduce((acc, s) => acc + s.extent_of_land_acres, 0) || 0;

  const claimTypeData = [
    { name: 'Individual', value: stateData?.reduce((acc, s) => acc + s.claims_received_individual, 0) || 0 },
    { name: 'Community', value: stateData?.reduce((acc, s) => acc + s.claims_received_community, 0) || 0 }
  ];

  const formattedTimeData = timeData?.map(d => ({
    date: new Date(d.report_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    "Total Claims": d.claims_received_individual + d.claims_received_community,
    "Titles Distributed": d.titles_distributed_individual + d.titles_distributed_community,
  }));

  const topStatesData = stateData
    ?.map(s => ({ ...s, total_claims: s.claims_received_individual + s.claims_received_community }))
    .sort((a, b) => b.total_claims - a.total_claims)
    .slice(0, 10);

  const conversionRateData = stateData
    ?.map(s => {
      const totalClaims = s.claims_received_individual + s.claims_received_community;
      const totalTitles = s.titles_distributed_individual + s.titles_distributed_community;
      return {
        name: s.state_name,
        rate: totalClaims > 0 ? parseFloat(((totalTitles / totalClaims) * 100).toFixed(2)) : 0,
      };
    })
    .sort((a, b) => b.rate - a.rate);

  const lweStatesData = stateData?.filter(s => s.is_lwe_state);
  const COLORS = ["#0088FE", "#00C49F"];
  const maxClaims = Math.max(...(stateData?.map(s => s.claims_received_individual + s.claims_received_community) || [0]));

  const getColor = (claims: number) => {
    const scale = claims / maxClaims;
    if (scale > 0.8) return '#b30000'; if (scale > 0.6) return '#e34a33';
    if (scale > 0.4) return '#fc8d59'; if (scale > 0.2) return '#fdbb84';
    return '#fee8c8';
  };

  const geoJsonDataWithAnalytics = {
    ...indiaStatesGeo,
    features: indiaStatesGeo.features
      .map(feature => {
        const analytics = stateData?.find(s => s.state_name === feature.properties.name);
        if (!analytics) return null; // Only include states present in the data
        return {
          ...feature,
          properties: {
            ...feature.properties,
            analytics,
          }
        };
      })
      .filter(Boolean), // Remove nulls
  };

  const style = (feature: any) => {
    const analytics = feature.properties.analytics;
    const totalStateClaims = analytics.claims_received_individual + analytics.claims_received_community;
    return {
      fillColor: getColor(totalStateClaims),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature: any, layer: Layer) => {
    const analytics = feature.properties.analytics;
    if (analytics) {
      const popupContent = `<div class="p-1"><h3 class="font-bold text-base mb-1">${analytics.state_name}</h3><div class="space-y-1 text-sm"><p><strong>Claims:</strong> ${(analytics.claims_received_individual + analytics.claims_received_community).toLocaleString()}</p><p><strong>Titles:</strong> ${(analytics.titles_distributed_individual + analytics.titles_distributed_community).toLocaleString()}</p><p><strong>Land:</strong> ${Math.round(analytics.extent_of_land_acres).toLocaleString()} acres</p></div></div>`;
      layer.bindPopup(popupContent);

      layer.on({
        mouseover: (e) => {
          const targetLayer = e.target;
          targetLayer.setStyle({ weight: 3, color: '#444' });
        },
        mouseout: (e) => {
          const targetLayer = e.target;
          targetLayer.setStyle(style(feature));
        }
      });
    }
  };

  return (
    <div className="p-8 space-y-8 bg-muted/40">
      <div>
        <h1 className="text-3xl font-bold text-shadow">FRA Analytics for Key States</h1>
        <p className="text-muted-foreground">An overview of the Forest Rights Act implementation in Madhya Pradesh, Odisha, Tripura, and Telangana.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims Received</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClaims.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Titles Distributed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTitles.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Land Recognized (Acres)</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalLand).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>State-wise Claims Distribution</CardTitle>
            <CardDescription>States are colored by claim volume. Click a state for details.</CardDescription>
          </CardHeader>
          <CardContent className="relative p-0">
            <MapContainer center={[22.9734, 78.6569]} zoom={5} style={{ height: '500px', width: '100%' }} className="rounded-b-lg">
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
              {geoJsonDataWithAnalytics.features.length > 0 && (
                <GeoJSON data={geoJsonDataWithAnalytics as any} style={style} onEachFeature={onEachFeature} />
              )}
            </MapContainer>
            <MapLegend />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Claim Types</CardTitle>
              <CardDescription>Individual vs. Community</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie data={claimTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                    {claimTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top States by Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <ReBarChart data={topStatesData} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)} />
                  <YAxis type="category" dataKey="state_name" width={80} />
                  <Tooltip />
                  <Bar dataKey="total_claims" name="Total Claims" fill="hsl(var(--primary))" />
                </ReBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5" /> Claims & Titles Trend Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ReLineChart data={formattedTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Total Claims" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="Titles Distributed" stroke="#82ca9d" strokeWidth={2} />
            </ReLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Award className="mr-2 h-5 w-5" /> Claim to Title Conversion Rate</CardTitle>
            <CardDescription>Percentage of claims that resulted in a distributed title.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ReBarChart data={conversionRateData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" unit="%" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="rate" name="Conversion Rate" fillOpacity={0.8}>
                  {conversionRateData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rate > 75 ? '#22c55e' : entry.rate > 50 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><CheckSquare className="mr-2 h-5 w-5" /> Implementation in LWE States</CardTitle>
            <CardDescription>Status of FRA implementation in Left-Wing Extremism affected states.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>State</TableHead>
                  <TableHead>Claims</TableHead>
                  <TableHead>Titles</TableHead>
                  <TableHead>Land (Acres)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lweStatesData?.map(state => (
                  <TableRow key={state.id}>
                    <TableCell className="font-medium">{state.state_name}</TableCell>
                    <TableCell>{(state.claims_received_individual + state.claims_received_community).toLocaleString()}</TableCell>
                    <TableCell>{(state.titles_distributed_individual + state.titles_distributed_community).toLocaleString()}</TableCell>
                    <TableCell>{Math.round(state.extent_of_land_acres).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StateWiseAnalytics;