import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Claim } from "@/data/mockClaims";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";

interface DashboardStatsProps {
  claims: Claim[];
}

const DashboardStats = ({ claims }: DashboardStatsProps) => {
  const totalClaims = claims.length;
  const approvedClaims = claims.filter((c) => c.status === "Approved").length;
  const pendingClaims = claims.filter((c) => c.status === "Pending").length;
  const rejectedClaims = claims.filter((c) => c.status === "Rejected").length;

  const stats = [
    {
      title: "Total Claims",
      value: totalClaims,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Approved",
      value: approvedClaims,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Pending",
      value: pendingClaims,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "Rejected",
      value: rejectedClaims,
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon
              className={`h-4 w-4 text-muted-foreground ${stat.color}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;