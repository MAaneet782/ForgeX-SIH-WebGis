import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, ScanLine, UploadCloud, FileImage } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";

interface OcrScannerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onScanComplete: (data: any) => void;
}

const OcrScanner = ({ isOpen, onOpenChange, onScanComplete }: OcrScannerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setScannedData(null); // Reset previous scan results
    }
  };

  const handleScan = async () => {
    if (!selectedFile) {
      showError("Please select a document to scan.");
      return;
    }
    setIsLoading(true);
    setScannedData(null);
    try {
      // In a real app, you would upload the file here.
      // For this demo, we just invoke the function which returns mock data.
      const { data, error } = await supabase.functions.invoke('ocr-extract');
      
      if (error) throw error;

      setScannedData(data.data);
      showSuccess("Document scanned successfully!");
    } catch (error: any) {
      showError(`Scan failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseData = () => {
    onScanComplete(scannedData);
    onOpenChange(false);
    resetState();
  };

  const handleClose = () => {
    onOpenChange(false);
    resetState();
  }

  const resetState = () => {
    setScannedData(null);
    setSelectedFile(null);
    setIsLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Scan Patta Document</DialogTitle>
          <DialogDescription>
            Upload a document image to automatically extract claim details. For this demo, we'll use a sample image.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed rounded-lg p-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
            />
            {!selectedFile ? (
              <>
                <UploadCloud className="h-12 w-12 text-muted-foreground" />
                <p className="text-center text-sm text-muted-foreground">Drag & drop a file here, or click to select a file.</p>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Browse File
                </Button>
              </>
            ) : (
              <div className="text-center">
                <FileImage className="h-12 w-12 text-primary mx-auto" />
                <p className="font-semibold mt-2">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                <Button variant="link" size="sm" onClick={() => setSelectedFile(null)}>Change file</Button>
              </div>
            )}
            <Button onClick={handleScan} disabled={isLoading || !selectedFile} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanLine className="mr-2 h-4 w-4" />}
              {isLoading ? "Scanning..." : "Scan Document"}
            </Button>
          </div>
          <div className="flex flex-col space-y-4">
            <p className="font-semibold text-center">Extracted Data (JSON)</p>
            <div className="bg-muted rounded-lg p-4 h-full min-h-[250px] overflow-y-auto">
              {isLoading && <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
              {scannedData && (
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(scannedData, null, 2)}
                </pre>
              )}
              {!isLoading && !scannedData && <p className="text-sm text-muted-foreground text-center pt-16">Upload a document and click "Scan" to see results.</p>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUseData} disabled={!scannedData}>Use This Data</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OcrScanner;