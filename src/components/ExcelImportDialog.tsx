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
import type { Claim } from "@/data/mockClaims"; // Import Claim type for soilType and waterAvailability

interface ExcelImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper to convert Excel serial date to JS Date
const excelSerialToDate = (serial: number) => {
  if (isNaN(serial) || serial < 25569 || serial > 50000) return null; // Basic validation for Excel date range
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
};

// Helper to create a random polygon around a center point (with reduced size)
const createPolygonFromCenter = (lat: number, lon: number, areaInAcres: number) => {
    // Ensure lat/lon are valid numbers
    if (isNaN(lat) || isNaN(lon) || lat === 0 || lon === 0) {
      // Fallback to a default small polygon if coordinates are invalid
      lat = 22.5937; // Default center of India
      lon = 78.9629;
      areaInAcres = 0.1; // Very small default area
    }

    const effectiveArea = Math.max(0.01, areaInAcres); // Ensure area is at least a small positive number
    const radius = (Math.sqrt(effectiveArea * 4046.86) / 111320 / 2) / 2; // Reduced radius by 50%
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

// Helper to get value from potential column names (case-insensitive and space-tolerant)
const getCellValue = (row: any, keys: string[]) => {
  const normalizedRow: Record<string, any> = {};
  for (const key in row) {
    if (Object.prototype.hasOwnProperty.call(row, key)) {
      normalizedRow[key.toLowerCase().replace(/[^a-z0-9]/g, '')] = row[key];
    }
  }

  for (const key of keys) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalizedRow[normalizedKey] !== undefined && normalizedRow[normalizedKey] !== null) {
      return normalizedRow[normalizedKey];
    }
  }
  return undefined;
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
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          setJsonData(json);
        } catch (error: any) {
          showError(`Failed to parse Excel file: ${error.message}`);
          setFile(null);
          setJsonData([]);
        }
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
      'Approved': 'Approved', // Handle if status is already in desired format
      'Pending': 'Pending',
      'Rejected': 'Rejected',
    };

    const soilTypes: Claim['soilType'][] = ['Alluvial', 'Clay', 'Loamy', 'Laterite'];
    const waterAvailabilities: Claim['waterAvailability'][] = ['High', 'Medium', 'Low'];

    const newClaims = jsonData
      .filter(row => getCellValue(row, ['patta holder', 'Patta Holder', 'holder name', 'Holder Name'])) // Filter out empty rows based on holder name
      .map(row => {
        const rawCoords = getCellValue(row, ['location coordinates', 'Location Coordinates', 'coordinates', 'Coordinates']);
        let lat = 0;
        let lng = 0;
        if (rawCoords) {
          const parts = String(rawCoords).split(',').map(Number);
          if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            [lat, lng] = parts;
          } else {
            console.warn(`Invalid coordinates for row: ${JSON.stringify(row)}. Using default 0,0.`);
          }
        }

        const areaInHectares = parseFloat(getCellValue(row, ['area (ha)', 'Area (ha)', 'area', 'Area']) || '0');
        const areaInAcres = areaInHectares * 2.47105;
        const updatedDateSerial = getCellValue(row, ['updated', 'Updated', 'date', 'Date']);
        const updatedDate = excelSerialToDate(updatedDateSerial);
        
        const claimId = String(getCellValue(row, ['parcel id', 'Parcel ID', 'claim id', 'Claim ID']) || `C${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`);
        const statusRaw = getCellValue(row, ['type of right', 'Type of Right', 'status', 'Status']);
        const status: 'Approved' | 'Pending' | 'Rejected' = statusMap[statusRaw] || 'Pending';

        const soilTypeRaw = getCellValue(row, ['soil type', 'Soil Type', 'soil']);
        const soilType: Claim['soilType'] = soilTypes.includes(soilTypeRaw) ? soilTypeRaw : soilTypes[Math.floor(Math.random() * soilTypes.length)];

        const waterAvailabilityRaw = getCellValue(row, ['water availability', 'Water Availability', 'water']);
        const waterAvailability: Claim['waterAvailability'] = waterAvailabilities.includes(waterAvailabilityRaw) ? waterAvailabilityRaw : waterAvailabilities[Math.floor(Math.random() * waterAvailabilities.length)];

        const estimatedCropValueRaw = getCellValue(row, ['estimated crop value', 'Estimated Crop Value', 'crop value']);
        const estimatedCropValue = isNaN(parseFloat(estimatedCropValueRaw)) ? (Math.floor(Math.random() * 20000) + 5000) : parseFloat(estimatedCropValueRaw);

        return {
          claim_id: claimId,
          holder_name: getCellValue(row, ['patta holder', 'Patta Holder', 'holder name', 'Holder Name']),
          village: getCellValue(row, ['village', 'Village']),
          district: getCellValue(row, ['district', 'District']) || 'Unknown',
          state: getCellValue(row, ['state', 'State']),
          area: isNaN(areaInAcres) ? 0 : areaInAcres,
          status: status,
          document_name: getCellValue(row, ['document name', 'Document Name']),
          soil_type: soilType,
          water_availability: waterAvailability,
          estimated_crop_value: estimatedCropValue,
          geometry: createPolygonFromCenter(lat, lng, isNaN(areaInAcres) ? 1 : areaInAcres),
          created_at: updatedDate || new Date(),
        };
      });

    try {
      if (newClaims.length === 0) {
        throw new Error("No valid claims found to import after processing.");
      }
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
      <DialogContent className="max-w-4xl z-[9999]">
        <DialogHeader>
          <DialogTitle>Import Claims from Excel</DialogTitle>
          <DialogDescription>
            Upload an Excel file with claim data. Expected columns (case-insensitive, space-tolerant): "parcel id", "patta holder", "village", "district", "state", "area (ha)", "type of right", "updated", "location coordinates", "soil type", "water availability", "estimated crop value".
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
              <h4 className="font-semibold mb-2">Data Preview ({jsonData.length} rows)</h4>
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
                        {Object.values(row).map((val: any, j: number) => (
                          <TableCell key={j}>
                            {/* Attempt to format date if it looks like an Excel serial number */}
                            {typeof val === 'number' && val > 25569 && val < 50000 ? excelSerialToDate(val)?.toLocaleDateString() || String(val) : String(val)}
                          </TableCell>
                        ))}
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