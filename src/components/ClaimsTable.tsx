import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Search } from "lucide-react";
import { useRef } from "react";
import Papa from "papaparse";
import { supabase } from "@/lib/supabaseClient";
import { showLoading, showSuccess, showError, dismissToast } from "@/utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import AddClaimModal from "./AddClaimModal";

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
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

interface ClaimsTableProps {
  claims: Claim[];
  onRowClick: (claim: Claim) => void;
}

const ClaimsTable = ({ claims, onRowClick }: ClaimsTableProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const toastId = showLoading("Uploading and processing CSV...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const parsedData = results.data as any[];
        
        if (!parsedData.length || !results.meta.fields?.includes('claim_id')) {
            dismissToast(toastId);
            showError("Invalid CSV format. Make sure it has headers and a 'claim_id' column.");
            return;
        }

        const claimsToInsert = parsedData.map(row => {
            try {
                return {
                    claim_id: row.claim_id,
                    holder_name: row.holder_name,
                    village: row.village,
                    district: row.district,
                    state: row.state,
                    area: parseFloat(row.area),
                    status: row.status,
                    soil_type: row.soil_type,
                    water_availability: row.water_availability,
                    estimated_crop_value: parseInt(row.estimated_crop_value, 10),
                    geometry: row.geometry ? JSON.parse(row.geometry) : null,
                };
            } catch (e) {
                console.error("Error parsing row:", row, e);
                return null;
            }
        }).filter(Boolean);

        if (claimsToInsert.length === 0 && parsedData.length > 0) {
            dismissToast(toastId);
            showError("Could not parse any rows from the CSV. Check the format, especially the 'geometry' JSON.");
            return;
        }

        const { error } = await supabase.from('claims').insert(claimsToInsert);

        dismissToast(toastId);

        if (error) {
          showError(`Upload failed: ${error.message}`);
        } else {
          showSuccess(`${claimsToInsert.length} claims uploaded successfully!`);
          queryClient.invalidateQueries({ queryKey: ['claims'] });
        }
      },
      error: (error) => {
        dismissToast(toastId);
        showError(`CSV parsing error: ${error.message}`);
      }
    });
  };

  const handleExport = () => {
    const dataToExport = claims.map(({ id, created_at, geometry, ...rest }) => ({
        ...rest,
        geometry: JSON.stringify(geometry)
    }));
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'claims_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Search Results: FRA Parcels</h2>
        <div className="flex items-center space-x-4">
          <a href="/claims_template.csv" download className="text-sm text-muted-foreground hover:text-primary underline">Download Template</a>
          <AddClaimModal />
          <Button variant="outline" onClick={handleUploadClick}>
            <Upload className="mr-2 h-4 w-4" /> Upload CSV
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".csv"
          />
          <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export</Button>
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
              <TableRow key={claim.id} onClick={() => onRowClick(claim)} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{claim.claim_id}</TableCell>
                <TableCell>{claim.holder_name}</TableCell>
                <TableCell>{claim.district}</TableCell>
                <TableCell>{claim.area}</TableCell>
                <TableCell>{getStatusBadge(claim.status)}</TableCell>
                <TableCell>{new Date(claim.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onRowClick(claim); }}>
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button asChild onClick={(e) => e.stopPropagation()}>
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