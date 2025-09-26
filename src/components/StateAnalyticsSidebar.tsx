import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Define the type for the state data prop
interface StateData {
  state_name: string;
  claims_received_individual: number;
  claims_received_community: number;
  titles_distributed_individual: number;
  titles_distributed_community: number;
  extent_of_land_acres: number;
  frcs_constituted: number;
  sdlc_constituted: number;
  dlc_constituted: number;
}

interface StateAnalyticsSidebarProps {
  state: StateData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StateAnalyticsSidebar = ({ state, open, onOpenChange }: StateAnalyticsSidebarProps) => {
  if (!state) return null;

  const totalClaims = state.claims_received_individual + state.claims_received_community;
  const totalTitles = state.titles_distributed_individual + state.titles_distributed_community;
  const conversionRate = totalClaims > 0 ? ((totalTitles / totalClaims) * 100).toFixed(2) : 0;

  const claimTypeData = [
    { name: "Individual", value: state.claims_received_individual },
    { name: "Community", value: state.claims_received_community },
  ];

  const committeeData = [
    { name: "FRCs", value: state.frcs_constituted },
    { name: "SDLCs", value: state.sdlc_constituted },
    { name: "DLCs", value: state.dlc_constituted },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  const StatItem = ({ label, value, unit = "" }: { label: string, value: string | number, unit?: string }) => (
    <div className="flex justify-between items-baseline p-3 bg-muted/50 rounded-md">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-bold">{typeof value === 'number' ? value.toLocaleString() : value}{unit && <span className="text-sm font-normal ml-1">{unit}</span>}</span>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="text-2xl font-bold">{state.state_name}</SheetTitle>
            <SheetDescription>
              Detailed FRA implementation status for {state.state_name}.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Key Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <StatItem label="Total Claims Received" value={totalClaims} />
                <StatItem label="Total Titles Distributed" value={totalTitles} />
                <StatItem label="Land Recognized" value={Math.round(state.extent_of_land_acres)} unit="acres" />
                <StatItem label="Conversion Rate" value={conversionRate} unit="%" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Claim Types Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={claimTypeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {claimTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Committee Constitution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={committeeData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="value" name="Count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StateAnalyticsSidebar;