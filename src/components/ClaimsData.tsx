import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Claim } from "@/data/mockClaims";

interface ClaimsDataProps {
  claims: Claim[];
}

const ClaimsData = ({ claims }: ClaimsDataProps) => {
  const getBadgeVariant = (status: Claim['status']) => {
    switch (status) {
      case 'Approved':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Claim Records</CardTitle>
        <Button>Add New Claim</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Claim ID</TableHead>
              <TableHead>Holder Name</TableHead>
              <TableHead>Village</TableHead>
              <TableHead className="text-right">Area (acres)</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell className="font-medium">{claim.id}</TableCell>
                <TableCell>{claim.holderName}</TableCell>
                <TableCell>{claim.village}</TableCell>
                <TableCell className="text-right">{claim.area.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={getBadgeVariant(claim.status)}>{claim.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ClaimsData;