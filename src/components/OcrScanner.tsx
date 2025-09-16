import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, ScanLine } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";

interface OcrScannerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onScanComplete: (data: any) => void;
}

const OcrScanner = ({ isOpen, onOpenChange, onScanComplete }: OcrScannerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);

  const handleScan = async () => {
    setIsLoading(true);
    setScannedData(null);
    try {
      // In a real app, you would upload a file here.
      // For this demo, we just invoke the function.
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
    setScannedData(null); // Reset for next time
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Scan Patta Document</DialogTitle>
          <DialogDescription>
            Upload a document image to automatically extract claim details. For this demo, we'll use a sample image.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="flex flex-col items-center justify-center space-y-4 border rounded-lg p-4">
            <p className="font-semibold text-center">Sample Document</p>
            <img src="/fake-patta.jpg" alt="Sample Patta Document" className="rounded-md object-contain" />
            <Button onClick={handleScan} disabled={isLoading} className="w-full">
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
              {!isLoading && !scannedData && <p className="text-sm text-muted-foreground text-center pt-16">Click "Scan Document" to see the results.</p>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleUseData} disabled={!scannedData}>Use This Data</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OcrScanner;