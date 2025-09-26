import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { AlertTriangle, Users, MapPin, FileText, TrendingUp, CheckSquare, Award, Percent } from "lucide-react";
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
import StateAnalyticsSidebar from "@/components/StateAnalyticsSidebar";
import AnalyticsStatCard from "@/components/AnalyticsStatCard";

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
  const [selectedState, setSelectedState] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: stateData, isLoading: isLoadingState, isError, error } = useQuery({ queryKey: ["stateAnalytics"], queryFn: fetchStateAnalytics });
  const { data: timeData, isLoading: isLoadingTime } = useQuery({ queryKey: ["timeSeriesAnalytics"], queryFn: fetchTimeSeriesAnalytics });

  if (isLoadingState || isLoadingTime) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
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
  const totalIndividualClaims = stateData?.reduce((acc, s) => acc + s.claims_received_individual, 0) || 0;
  const totalCommunityClaims = stateData?.reduce((acc, s) => acc + s.claims_received_community, 0) || 0;
  const totalClaims = totalIndividualClaims + totalCommunityClaims;

  const totalIndividualTitles = stateData?.reduce((acc, s) => acc + s.titles_distributed_individual, 0) || 0;
  const totalCommunityTitles = stateData?.reduce((acc, s) => acc + s.titles_distributed_community, 0) || 0;
  const totalTitles = totalIndividualTitles + totalCommunityTitles;

  const totalIndividualLand = stateData?.reduce((acc, s) => acc + s.extent_of_land_individual_acres, 0) || 0;
  const totalCommunityLand = stateData?.reduce((acc, s) => acc + s.extent_of_land_community_acres, 0) || 0;
  const totalLand = totalIndividualLand + totalCommunityLand;

  const overallConversionRate = totalClaims > 0 ? ((totalTitles / totalClaims) * 100).toFixed(2) : 0;

  const claimsBreakdown = [
    { label: "Individual", value: totalIndividualClaims },
    { label: "Community", value: totalCommunityClaims },
  ];

  const titlesBreakdown = [
    { label: "Individual", value: totalIndividualTitles },
    { label: "Community", value: totalCommunityTitles },
  ];

  const landBreakdown = [
    { label: "Individual", value: Math.round(totalIndividualLand) },
    { label: "Community", value: Math.round(totalCommunityLand) },
  ];

  const conversionBreakdown = [
    { label: "Total Titles Distributed", value: totalTitles },
    { label: "Total Claims Received", value: totalClaims },
  ];

  const claimTypeData = [
    { name: 'Individual', value: totalIndividualClaims },
    { name: 'Community', value: totalCommunityClaims }
  ];

  const claimsVsTitlesData = stateData?.map(s => ({
    name: s.state_name,
    "Claims Received": s.claims_received_individual + s.claims_received_community,
    "Titles Distributed": s.titles_distributed_individual + s.titles_distributed_community,
  }));

  const landDistributionData = stateData?.map(s => ({
    name: s.state_name,
    "Land Recognized (Acres)": s.extent_of_land_acres,
  })).sort((a, b) => b["Land Recognized (Acres)"] - a["Land Recognized (Acres)"]);

  const committeeData = stateData?.map(s => ({
    name: s.state_name,
    "FRCs": s.frcs_constituted,
    "SDLCs": s.sdlc_constituted,
    "DLCs": s.dlc_constituted,
  }));

  const formattedTimeData = timeData?.map(d => ({
    date: new Date(d.report_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    "Total Claims": d.claims_received_individual + d.claims_received_community,
    "Titles Distributed": d.titles_distributed_individual + d.titles_distributed_community,
  }));

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
        if (!analytics) return null;
        return { ...feature, properties: { ...feature.properties, analytics } };
      })
      .filter(Boolean),
  };

  const style = (feature: any) => {
    const analytics = feature.properties.analytics;
    const totalStateClaims = analytics.claims_received_individual + analytics.claims_received_community;
    return {
      fillColor: getColor(totalStateClaims),
      weight: 1.5,
      opacity: 1,
      color: '#333',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature: any, layer: Layer) => {
    const analytics = feature.properties.analytics;
    if (analytics) {
      layer.bindTooltip(analytics.state_name, { sticky: true });
      layer.on({
        mouseover: (e) => e.target.setStyle({ weight: 3, color: '#000' }),
        mouseout: (e) => e.target.setStyle(style(feature)),
        click: () => {
          setSelectedState(analytics);
          setIsSidebarOpen(true);
        },
      });
    }
  };

  return (
    <div className="p-8 space-y-8 bg-muted/40">
      <div>
        <h1 className="text-3xl font-bold text-shadow">FRA Analytics for Key States</h1>
        <p className="text-muted-foreground">An overview of the Forest Rights Act implementation in Madhya Pradesh, Odisha, Tripura, and Telangana.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsStatCard
          title="Total Claims Received"
          value={totalClaims.toLocaleString()}
          icon={FileText}
          breakdown={claimsBreakdown}
        />
        <AnalyticsStatCard
          title="Total Titles Distributed"
          value={totalTitles.toLocaleString()}
          icon={Users}
          breakdown={titlesBreakdown}
        />
        <AnalyticsStatCard
          title="Total Land Recognized"
          value={Math.round(totalLand).toLocaleString()}
          unit="acres"
          icon={MapPin}
          breakdown={landBreakdown}
        />
        <AnalyticsStatCard
          title="Overall Conversion Rate"
          value={overallConversionRate}
          unit="%"
          icon={Percent}
          breakdown={conversionBreakdown}
          breakdownNote="(Titles Distributed / Claims Received) * 100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>State-wise Claims Distribution</CardTitle><CardDescription>States are colored by claim volume. Click a state for details.</CardDescription></CardHeader>
          <CardContent className="relative p-0"><MapContainer center={[22.9734, 78.6569]} zoom={5} style={{ height: '450px', width: '100%' }} className="rounded-b-lg"><TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />{geoJsonDataWithAnalytics.features.length > 0 && (<GeoJSON data={geoJsonDataWithAnalytics as any} style={style} onEachFeature={onEachFeature} />)}</MapContainer><MapLegend /></CardContent>
        </Card>
        <div className="space-y-6">
          <Card><CardHeader><CardTitle>Claim Types</CardTitle><CardDescription>Individual vs. Community</CardDescription></CardHeader><CardContent><ResponsiveContainer width="100%" height={180}><RePieChart><Pie data={claimTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5}>{claimTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend /></RePieChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle>Land Recognized by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={180}><ReBarChart data={landDistributionData} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)} /><YAxis type="category" dataKey="name" width={80} /><Tooltip /><Bar dataKey="Land Recognized (Acres)" fill="hsl(var(--primary))" /></ReBarChart></ResponsiveContainer></CardContent></Card>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center"><Award className="mr-2 h-5 w-5" /> State Performance: Claims vs. Titles</CardTitle><CardDescription>Comparing the number of claims received to the number of titles distributed in each state.</CardDescription></CardHeader>
        <CardContent><ResponsiveContainer width="100%" height={300}><ReBarChart data={claimsVsTitlesData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)} /><Tooltip /><Legend /><Bar dataKey="Claims Received" fill="#8884d8" /><Bar dataKey="Titles Distributed" fill="#82ca9d" /></ReBarChart></ResponsiveContainer></CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center"><CheckSquare className="mr-2 h-5 w-5" /> Governance: Committee Constitution</CardTitle><CardDescription>Number of Forest Rights, Sub-Divisional Level, and District Level Committees.</CardDescription></CardHeader>
          <CardContent><ResponsiveContainer width="100%" height={300}><ReBarChart data={committeeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="FRCs" stackId="a" fill="#8884d8" /><Bar dataKey="SDLCs" stackId="a" fill="#82ca9d" /><Bar dataKey="DLCs" stackId="a" fill="#ffc658" /></ReBarChart></ResponsiveContainer></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5" /> National Trend Over Time</CardTitle><CardDescription>Cumulative claims and titles distributed nationwide.</CardDescription></CardHeader>
          <CardContent><ResponsiveContainer width="100%" height={300}><ReLineChart data={formattedTimeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)} /><Tooltip /><Legend /><Line type="monotone" dataKey="Total Claims" stroke="#8884d8" strokeWidth={2} /><Line type="monotone" dataKey="Titles Distributed" stroke="#82ca9d" strokeWidth={2} /></ReLineChart></ResponsiveContainer></CardContent>
        </Card>
      </div>
      <StateAnalyticsSidebar 
        state={selectedState} 
        open={isSidebarOpen} 
        onOpenChange={setIsSidebarOpen} 
      />
    </div>
  );
};

export default StateWiseAnalytics;