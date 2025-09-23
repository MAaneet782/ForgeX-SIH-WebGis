import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, PlusCircle, Search } from "lucide-react";

// Define the type for a claim
interface Claim {
  id: string;
  claim_id: string;
  holder_name: string;
  village: string;
  district: string;
  state: string;
  area: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  created_at: string;
}

interface ClaimsTableProps {
  claims: Claim[];
}

const ClaimsTable = ({ claims }: ClaimsTableProps) => {
  const getStatusBadge = (status: Claim['status']) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'Pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Search Results: FRA Parcels</h2>
        <div className="flex space-x-2">
          <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add Claim</Button>
          <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload CSV</Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
        </div>
      </div>
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Claim ID</TableHead>
              <TableHead>Holder Name</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Area (acres)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell className="font-medium">{claim.claim_id}</TableCell>
                <TableCell>{claim.holder_name}</TableCell>
                <TableCell>{claim.district}</TableCell>
                <TableCell>{claim.area}</TableCell>
                <TableCell>{getStatusBadge(claim.status)}</TableCell>
                <TableCell>{new Date(claim.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button asChild>
                      <Link to={`/atlas/claim/${claim.claim_id}`}>Details</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClaimsTable;