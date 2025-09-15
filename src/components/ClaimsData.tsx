import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddClaimForm from "./AddClaimForm";
import type { Claim } from "@/data/mockClaims";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { useDashboardState } from "@/context/DashboardStateContext";

interface ClaimsDataProps {
  claims: Claim[];
  onAddClaim: (claim: Omit<Claim, 'id' | 'soilType' | 'waterAvailability'>) => void;
  onGenerateReport: () => void;
  selectedClaimId: string | null;
  onClaimSelect: (id: string | null) => void;
}

const ClaimsData = ({ 
  claims, 
  onAddClaim, 
  onGenerateReport,
  selectedClaimId, 
  onClaimSelect,
}: ClaimsDataProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isLowWaterClaim, isPendingClaim, isMgnregaEligible } = useDashboardState();
  const rowRefs = useRef<Map<string, HTMLTableRowElement | null>>(new Map());

  useEffect(() => {
    if (selectedClaimId) {
      const node = rowRefs.current.get(selectedClaimId);
      if (node) {
        node.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [selectedClaimId]);

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
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Search Results: FRA Parcels</CardTitle>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add Claim</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Claim</DialogTitle>
                </DialogHeader>
                <AddClaimForm onAddClaim={onAddClaim} onClose={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={onGenerateReport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Holder Name</TableHead>
                <TableHead>Village</TableHead>
                <TableHead>District</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Area (acres)</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => (
                <TableRow
                  key={claim.id}
                  ref={(el) => rowRefs.current.set(claim.id, el)}
                  onClick={() => onClaimSelect(claim.id === selectedClaimId ? null : claim.id)}
                  className={cn(
                    "cursor-pointer transition-colors",
                    { "bg-muted": selectedClaimId === claim.id },
                    { "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:hover:bg-yellow-900/60": isLowWaterClaim(claim) },
                    { "outline outline-2 outline-blue-400": isPendingClaim(claim) },
                    { "outline outline-2 outline-purple-400": isMgnregaEligible(claim) },
                    { "hover:bg-muted/50": !isLowWaterClaim(claim) && !isPendingClaim(claim) && !isMgnregaEligible(claim) }
                  )}
                >
                  <TableCell className="font-medium">{claim.id}</TableCell>
                  <TableCell>
                    <Link to={`/claim/${claim.id}`} className="hover:underline text-primary">
                      {claim.holderName}
                    </Link>
                  </TableCell>
                  <TableCell>{claim.village}</TableCell>
                  <TableCell>{claim.district}</TableCell>
                  <TableCell>{claim.state}</TableCell>
                  <TableCell className="text-right">{claim.area.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getBadgeVariant(claim.status)}>{claim.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClaimsData;