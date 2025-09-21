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
import CsvUploadForm from "./CsvUploadForm"; // Import the new component
import type { Claim } from "@/data/mockClaims";
import type { Geometry } from "geojson"; // Import Geometry type
import { cn } from "@/lib/utils";
import { Download, Search, Info, Upload } from "lucide-react"; // Add Upload icon
import { useState } from "react";

interface ClaimsDataProps {
  claims: Claim[];
  onAddClaim: (claim: Omit<Claim, 'id' | 'estimatedCropValue'> & { coordinates: string }) => void;
  onUploadCsv: (claims: (Omit<Claim, 'id'> & { geometry: Geometry })[]) => void; // New prop for CSV upload
  onGenerateReport: () => void;
  onZoomToClaim: (id: string) => void;
}

const ClaimsData = ({ 
  claims, 
  onAddClaim, 
  onUploadCsv, // Destructure new prop
  onGenerateReport,
  onZoomToClaim,
}: ClaimsDataProps) => {
  const [isAddClaimSheetOpen, setIsAddClaimSheetOpen] = useState(false);
  const [isCsvUploadSheetOpen, setIsCsvUploadSheetOpen] = useState(false); // New state for CSV upload sheet
  const navigate = useNavigate();

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

  const getMockDate = (claimId: string) => {
    const d = new Date();
    const dayOffset = parseInt(claimId.replace('C', ''), 10) % 28;
    d.setDate(d.getDate() - dayOffset);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Search Results: FRA Parcels</CardTitle>
          <div className="flex items-center gap-2">
            {/* Add Claim Sheet */}
            <Sheet open={isAddClaimSheetOpen} onOpenChange={setIsAddClaimSheetOpen}>
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
                  <AddClaimForm onAddClaim={onAddClaim} onClose={() => setIsAddClaimSheetOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            {/* CSV Upload Sheet */}
            <Sheet open={isCsvUploadSheetOpen} onOpenChange={setIsCsvUploadSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" /> Upload CSV
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-2xl w-full">
                <SheetHeader>
                  <SheetTitle>Upload Claims from CSV</SheetTitle>
                  <SheetDescription>
                    Upload a CSV file containing multiple claim records. Ensure columns match the expected format.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <CsvUploadForm onUpload={onUploadCsv} onClose={() => setIsCsvUploadSheetOpen(false)} />
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
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">{claim.id}</TableCell>
                    <TableCell>{claim.holderName}</TableCell>
                    <TableCell>{claim.village}</TableCell>
                    <TableCell className="text-right">{(claim.area * 0.404686).toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn("border-transparent font-semibold", rightType.className)}>{rightType.text}</Badge>
                    </TableCell>
                    <TableCell>{getMockDate(claim.id)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => onZoomToClaim(claim.id)}>
                          <Search className="h-4 w-4" />
                          <span className="sr-only">Zoom to parcel</span>
                        </Button>
                        <Button size="sm" className="bg-[#004d40] hover:bg-[#00382e]" onClick={() => navigate(`/atlas/claim/${claim.id}`)}>
                          <Info className="mr-2 h-4 w-4" />
                          Details
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