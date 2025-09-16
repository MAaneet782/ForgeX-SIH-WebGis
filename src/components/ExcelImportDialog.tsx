import { useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, UploadCloud } from "lucide-react";
import { showError, showSuccess, showLoading, dismissToast } from "@/utils/toast";
import { useQueryClient } from "@tanstack/react-query";

interface ExcelImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper to create a random polygon around a center point
const createPolygonFromCenter = (lat: number, lon: number, areaInAcres: number) => {
    const radius = Math.sqrt(areaInAcres * 4046.86) / 111320 / 2; // Rough conversion
    const points = 5;
    const coords = [];
    for (let i = 0; i < points; i++) {
        const angle = (i / points) * 2 * Math.PI;
        const randomFactor = 0.75 + Math.random() * 0.5;
        const newLat = lat + Math.cos(angle) * radius * randomFactor;
        const newLon = lon + Math.sin(angle) * radius * randomFactor;
        coords.push([newLon, newLat]);
    }
    coords.push(coords[0]); // Close the polygon
    return { type: "Polygon", coordinates: [coords] };
};

const ExcelImportDialog = ({ isOpen, onOpenChange }: ExcelImportDialogProps) => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setJsonData(json);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleImport = async () => {
    if (jsonData.length === 0) {
      showError("No data to import.");
      return;
    }
    setIsLoading(true);
    const toastId = showLoading("Importing data... This may take a moment.");

    const statusMap: { [key: string]: 'Approved' | 'Pending' | 'Rejected' } = {
      'IFR': 'Approved',
      'CR': 'Pending',
      'CFR': 'Rejected',
    };

    const newClaims = jsonData.map(row => {
      const [lat, lng] = (row['location coordinates'] || "0,0").split(',').map(Number);
      const areaInAcres = parseFloat(row['area (ha)']) * 2.47105;
      
      return {
        claim_id: row['parcel id'],
        holder_name: row['patta holder'],
        village: row['village'],
        district: 'Unknown', // Not in Excel
        state: row['state'],
        area: isNaN(areaInAcres) ? 0 : areaInAcres,
        status: statusMap[row['type of right']] || 'Pending',
        soil_type: ['Alluvial', 'Clay', 'Loamy', 'Laterite'][Math.floor(Math.random() * 4)],
        water_availability: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
        estimated_crop_value: Math.floor(Math.random() * 20000) + 5000,
        geometry: createPolygonFromCenter(lat, lng, isNaN(areaInAcres) ? 1 : areaInAcres),
        created_at: row['updated'] ? new Date(row['updated']) : new Date(),
      };
    });

    try {
      const { error } = await supabase.from('claims').insert(newClaims);
      if (error) throw error;
      
      dismissToast(toastId);
      showSuccess(`${newClaims.length} claims imported successfully!`);
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      onOpenChange(false);
      setFile(null);
      setJsonData([]);
    } catch (error: any) {
      dismissToast(toastId);
      showError(`Import failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Import Claims from Excel</DialogTitle>
          <DialogDescription>
            Upload an Excel file with claim data. The columns should be: parcel id, patta holder, village, state, area (ha), type of right, updated, location coordinates.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg">
            <UploadCloud className="w-12 h-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              {file ? `Selected: ${file.name}` : "Select an .xlsx or .csv file to upload"}
            </p>
            <Input id="excel-upload" type="file" className="mt-4" onChange={handleFileChange} accept=".xlsx, .csv" />
          </div>
          {jsonData.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Data Preview</h4>
              <div className="max-h-64 overflow-y-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(jsonData[0]).map(key => <TableHead key={key}>{key}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jsonData.slice(0, 5).map((row, i) => (
                      <TableRow key={i}>
                        {Object.values(row).map((val: any, j: number) => <TableCell key={j}>{String(val)}</TableCell>)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Showing first 5 of {jsonData.length} rows.</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleImport} disabled={isLoading || jsonData.length === 0}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelImportDialog;