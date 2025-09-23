import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Claim {
  state: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  area: number;
}

interface ClaimsAnalysisProps {
  claims: Claim[];
}

const ClaimsAnalysis = ({ claims }: ClaimsAnalysisProps) => {
  const statusData = claims.reduce((acc, claim) => {
    const existing = acc.find(item => item.name === claim.status);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ name: claim.status, count: 1 });
    }
    return acc;
  }, [] as { name: string; count: number }[]);

  const stateData = claims.reduce((acc, claim) => {
    const existing = acc.find(item => item.name === claim.state);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ name: claim.state, count: 1 });
    }
    return acc;
  }, [] as { name: string; count: number }[]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Claims Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Claims by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Claims by State</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClaimsAnalysis;