import { Link, useNavigate } from "react-router-dom";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import AddClaimForm from "./AddClaimForm";
import type { Claim } from "@/data/mockClaims";
import { cn } from "@/lib/utils";
import { Download, Search, Info, Upload, Trash2 } from "lucide-react"; // Added Upload and Trash2
import { useState } from "react";
import { format } from 'date-fns'; // Import date-fns

interface ClaimsDataProps {
  claims: Claim[];
  onAddClaim: (claim: Omit<Claim, 'id' | 'estimatedCropValue'> & { coordinates: string }) => void;
  onGenerateReport: () => void;
  onZoomToClaim: (id: string) => void;
}

const ClaimsData = ({ 
  claims, 
  onAddClaim, 
  onGenerateReport,
  onZoomToClaim,
}: ClaimsDataProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();

  // Updated to match screenshot: IFR, CR, CFR
  const getRightType = (status: Claim['status']) => {
    switch (status) {
      case 'Approved':
        return { text: 'IFR', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' };
      case 'Pending':
        return { text: 'CR', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' };
      case 'Rejected':
        return { text: 'CFR', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' };
      default:
        return { text: 'N/A', className: 'bg-gray-100 text-gray-800' };
    }
  };

  // Format date as "DD Mon YYYY"
  const getFormattedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy'); // e.g., "20 Sept 2025"
    } catch (e) {
      console.error("Invalid date string:", dateString);
      return "N/A";
    }
  };

  const handleDetailsNavigation = (claimId: string) => {
    navigate(`/atlas/claim/${claimId}`); // Only navigate to personal AI predictive dashboard
  };

  const handleRowClick = (claimId: string) => {
    onZoomToClaim(claimId); // Only highlight and zoom on map
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Search Results: FRA Parcels</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline"> {/* Placeholder Import button */}
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button>Add Claim</Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-2xl w-full">
                <SheetHeader>
                  <SheetTitle>Add New Claim</SheetTitle>
                  <SheetDescription>
                    Enter the details for the new land claim. Ensure GeoJSON coordinates are accurate.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <AddClaimForm onAddClaim={onAddClaim} onClose={() => setIsSheetOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
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
                <TableHead>Parcel ID</TableHead>
                <TableHead>Patta Holder</TableHead>
                <TableHead>Village</TableHead>
                <TableHead className="text-right">Area (ha)</TableHead>
                <TableHead className="text-center">Type of Right</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => {
                const rightType = getRightType(claim.status);
                return (
                  <TableRow 
                    key={claim.id} 
                    onClick={() => handleRowClick(claim.id)} // Row click only highlights on map
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{claim.id}</TableCell>
                    <TableCell>{claim.holderName}</TableCell>
                    <TableCell>{claim.village}</TableCell>
                    <TableCell className="text-right">{(claim.area * 0.404686).toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn("border-transparent font-semibold", rightType.className)}>{rightType.text}</Badge>
                    </TableCell>
                    <TableCell>{getFormattedDate(claim.created_at)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}> {/* Prevent row click from triggering */}
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" className="bg-[#004d40] hover:bg-[#00382e]" onClick={() => handleDetailsNavigation(claim.id)}>
                          <Info className="mr-2 h-4 w-4" />
                          Details
                        </Button>
                        <Button variant="destructive" size="icon" className="h-9 w-9"> {/* Placeholder Delete button */}
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete parcel</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClaimsData;