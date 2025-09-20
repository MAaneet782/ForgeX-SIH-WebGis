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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AddClaimForm from "./AddClaimForm";
import type { Claim } from "@/data/mockClaims";
import { cn } from "@/lib/utils";
import { Download, Info, ArrowUpDown, Upload, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import ExcelImportDialog from "./ExcelImportDialog";
import * as z from "zod";
import type { NewClaimInput } from "@/pages/Atlas";

const addClaimFormSchema = z.object({
  holderName: z.string(),
  village: z.string(),
  district: z.string(),
  state: z.string(),
  area: z.coerce.number(),
  status: z.enum(["Approved", "Pending", "Rejected"]),
  soilType: z.enum(['Alluvial', 'Clay', 'Loamy', 'Laterite', 'Unknown']),
  waterAvailability: z.enum(['High', 'Medium', 'Low', 'Unknown']),
  coordinates: z.string(),
  documentName: z.string().optional(),
});

interface ClaimsDataProps {
  claims: Claim[];
  onAddClaim: (claim: NewClaimInput) => void;
  onGenerateReport: () => void;
  onZoomToClaim: (dbId: string) => void;
  onDeleteClaim: (dbId: string) => void;
  onAddClaims: (newClaims: Omit<Claim, 'dbId'>[]) => void; // New prop for bulk import
}

type SortKey = keyof Claim | 'updated';

const ClaimsData = ({ 
  claims, 
  onAddClaim, 
  onGenerateReport,
  onZoomToClaim,
  onDeleteClaim,
  onAddClaims, // Destructure new prop
}: ClaimsDataProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [claimToDeleteDbId, setClaimToDeleteDbId] = useState<string | null>(null);
  const [claimToDeleteUserFacingId, setClaimToDeleteUserFacingId] = useState<string | null>(null);
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
    const hash = claimId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const dayOffset = hash % 28;
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

  const handleDeleteClick = (claimDbId: string, userFacingClaimId: string) => {
    setClaimToDeleteDbId(claimDbId);
    setClaimToDeleteUserFacingId(userFacingClaimId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (claimToDeleteDbId) {
      onDeleteClaim(claimToDeleteDbId);
      setClaimToDeleteDbId(null);
      setClaimToDeleteUserFacingId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
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
                  <TableHead className="py-3">Parcel ID</TableHead>
                  <TableHead className="py-3"><SortableHeader sortKey="holderName">Patta Holder</SortableHeader></TableHead>
                  <TableHead className="py-3"><SortableHeader sortKey="village">Village</SortableHeader></TableHead>
                  <TableHead className="text-right py-3"><SortableHeader sortKey="area">Area (ha)</SortableHeader></TableHead>
                  <TableHead className="text-center py-3">Type of Right</TableHead>
                  <TableHead className="py-3"><SortableHeader sortKey="updated">Updated</SortableHeader></TableHead>
                  <TableHead className="text-center py-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedClaims.map((claim) => {
                  const rightType = getRightType(claim.status);
                  return (
                    <TableRow key={claim.dbId} className="cursor-pointer hover:bg-muted/50" onClick={() => onZoomToClaim(claim.dbId)}>
                      <TableCell className="font-medium py-2">{claim.id}</TableCell>
                      <TableCell className="py-2">{claim.holderName}</TableCell>
                      <TableCell className="py-2">{claim.village}</TableCell>
                      <TableCell className="text-right py-2">{(claim.area * 0.404686).toFixed(2)}</TableCell>
                      <TableCell className="text-center py-2">
                        <Badge variant="outline" className={cn("border-transparent font-semibold", rightType.className)}>{rightType.text}</Badge>
                      </TableCell>
                      <TableCell className="py-2">{getMockDate(claim.id).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                      <TableCell className="text-center py-2">
                        <div className="flex items-center justify-center gap-2">
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/atlas/claim/${claim.id}`); }}>
                            <Info className="mr-2 h-4 w-4" />
                            Details
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(claim.dbId, claim.id); }}
                          >
                            <Trash2 className="h-4 w-4" />
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
      <ExcelImportDialog isOpen={isImportDialogOpen} onOpenChange={setIsImportDialogOpen} claims={claims} onAddClaims={onAddClaims} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete claim <span className="font-semibold">{claimToDeleteUserFacingId}</span> from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClaimsData;