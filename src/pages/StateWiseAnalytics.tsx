import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { AlertTriangle, Users, MapPin, FileText, BarChart, LineChart, PieChart } from "lucide-react";
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
import { stateCoordinates } from "@/lib/stateCoordinates";

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
  const { data: stateData, isLoading: isLoadingState } = useQuery({ queryKey: ["stateAnalytics"], queryFn: fetchStateAnalytics });
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

  const totalClaims = stateData?.reduce((acc, s) => acc + s.claims_received_individual + s.claims_received_community, 0) || 0;
  const totalTitles = stateData?.reduce((acc, s) => acc + s.titles_distributed_individual + s.titles_distributed_community, 0) || 0;
  const totalLand = stateData?.reduce((acc, s) => acc + s.extent_of_land_acres, 0) || 0;

  const claimTypeData = [
    { name: 'Individual', value: stateData?.reduce((acc, s) => acc + s.claims_received_individual, 0) },
    { name: 'Community', value: stateData?.reduce((acc, s) => acc + s.claims_received_community, 0) }
  ];

  const formattedTimeData = timeData?.map(d => ({
    ...d,
    date: new Date(d.report_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    total_claims: d.claims_received_individual + d.claims_received_community,
  }));

  const lweStatesData = stateData?.filter(s => s.is_lwe_state);

  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-shadow">Nationwide FRA Analytics</h1>
        <p className="text-muted-foreground">An overview of the Forest Rights Act implementation across India.</p>
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

      <Card>
        <CardHeader><CardTitle>State-wise Claims Distribution</CardTitle></CardHeader>
        <CardContent>
          <MapContainer center={[22.9734, 78.6569]} zoom={5} style={{ height: '500px', width: '100%' }} className="rounded-md">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {stateData?.map(state => {
              const coords = stateCoordinates[state.state_name];
              if (!coords) return null;
              const totalStateClaims = state.claims_received_individual + state.claims_received_community;
              const radius = Math.max(5, Math.log(totalStateClaims) * 2);
              return (
                <CircleMarker key={state.id} center={coords} radius={radius} pathOptions={{ color: state.is_lwe_state ? 'red' : 'blue', fillColor: state.is_lwe_state ? '#f03' : '#3388ff', fillOpacity: 0.5 }}>
                  <Popup>
                    <div className="font-bold">{state.state_name}</div>
                    <div>Claims: {totalStateClaims.toLocaleString()}</div>
                    <div>Titles: {(state.titles_distributed_individual + state.titles_distributed_community).toLocaleString()}</div>
                    <div>Land: {Math.round(state.extent_of_land_acres).toLocaleString()} acres</div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader><CardTitle>Claims & Titles Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ReLineChart data={formattedTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value)} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total_claims" name="Total Claims" stroke="#8884d8" />
              </ReLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Claim Types (Individual vs. Community)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie data={claimTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {claimTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Implementation in LWE States</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead>Claims Received</TableHead>
                <TableHead>Titles Distributed</TableHead>
                <TableHead>Land Recognized (Acres)</TableHead>
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
  );
};

export default StateWiseAnalytics;