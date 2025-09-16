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
import { Download, Info, ArrowUpDown, Upload } from "lucide-react";
import { useState, useMemo } from "react";
import ExcelImportDialog from "./ExcelImportDialog";

interface ClaimsDataProps {
  claims: Claim[];
  onAddClaim: (claim: Omit<Claim, 'id' | 'estimatedCropValue' | 'geometry'> & { coordinates: string }) => void;
  onGenerateReport: () => void;
  onZoomToClaim: (id: string) => void;
}

type SortKey = keyof Claim | 'updated';

const ClaimsData = ({ 
  claims, 
  onAddClaim, 
  onGenerateReport,
  onZoomToClaim,
}: ClaimsDataProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
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
    return d;
  };

  const sortedClaims = useMemo(() => {
    let sortableItems = [...claims];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortConfig.key === 'updated') {
          aValue = getMockDate(a.id).getTime();
          bValue = getMockDate(b.id).getTime();
        } else {
          aValue = a[sortConfig.key as keyof Claim];
          bValue = b[sortConfig.key as keyof Claim];
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [claims, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const SortableHeader = ({ sortKey, children }: { sortKey: SortKey, children: React.ReactNode }) => (
    <Button variant="ghost" onClick={() => requestSort(sortKey)} className="px-2">
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Search Results: FRA Parcels</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
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
                      Enter claim details manually or scan a document to auto-fill the form.
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
                  <TableHead><SortableHeader sortKey="holderName">Patta Holder</SortableHeader></TableHead>
                  <TableHead><SortableHeader sortKey="village">Village</SortableHeader></TableHead>
                  <TableHead className="text-right"><SortableHeader sortKey="area">Area (ha)</SortableHeader></TableHead>
                  <TableHead className="text-center">Type of Right</TableHead>
                  <TableHead><SortableHeader sortKey="updated">Updated</SortableHeader></TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedClaims.map((claim) => {
                  const rightType = getRightType(claim.status);
                  return (
                    <TableRow key={claim.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onZoomToClaim(claim.id)}>
                      <TableCell className="font-medium">{claim.id}</TableCell>
                      <TableCell>{claim.holderName}</TableCell>
                      <TableCell>{claim.village}</TableCell>
                      <TableCell className="text-right">{(claim.area * 0.404686).toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn("border-transparent font-semibold", rightType.className)}>{rightType.text}</Badge>
                      </TableCell>
                      <TableCell>{getMockDate(claim.id).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/atlas/claim/${claim.id}`); }}>
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
      <ExcelImportDialog isOpen={isImportDialogOpen} onOpenChange={setIsImportDialogOpen} claims={claims} />
    </>
  );
};

export default ClaimsData;