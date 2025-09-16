import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Claim } from "@/data/mockClaims";
import { useMemo } from 'react';

interface DataVisualizationProps {
  claims: Claim[];
}

const STATUS_COLORS = ['hsl(var(--primary))', 'hsl(var(--muted-foreground))', 'hsl(var(--destructive))'];
const PROFESSIONAL_COLORS = ['#4f46e5', '#0d9488', '#f59e0b', '#db2777', '#6b7280', '#3b82f6'];

const DataVisualization = ({ claims }: DataVisualizationProps) => {
  const claimsByStatus = useMemo(() => {
    const statusCounts = claims.reduce((acc, claim) => {
      acc[claim.status] = (acc[claim.status] || 0) + 1;
      return acc;
    }, {} as Record<Claim['status'], number>);

    return [
      { name: 'Approved', count: statusCounts.Approved || 0 },
      { name: 'Pending', count: statusCounts.Pending || 0 },
      { name: 'Rejected', count: statusCounts.Rejected || 0 },
    ];
  }, [claims]);

  const claimsByState = useMemo(() => {
    const stateCounts = claims.reduce((acc, claim) => {
      if (claim.state && claim.state !== 'Unknown') {
        acc[claim.state] = (acc[claim.state] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stateCounts).map(([name, value]) => ({ name, value }));
  }, [claims]);

  return (
    <section className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Claims by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={claimsByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip wrapperClassName="rounded-lg border bg-background p-2 shadow-sm" />
              <Legend />
              <Bar dataKey="count" name="Number of Claims">
                {claimsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Bar>
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
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Pie
                data={claimsByState}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {claimsByState.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip wrapperClassName="rounded-lg border bg-background p-2 shadow-sm" />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  );
};

export default DataVisualization;