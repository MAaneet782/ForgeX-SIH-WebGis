import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SheetFooter } from "@/components/ui/sheet";
import { showError, showLoading, dismissToast } from "@/utils/toast";
import type { Claim } from "@/data/mockClaims";
import type { Geometry } from "geojson";

// Define the schema for a single row in the CSV
const csvRowSchema = z.object({
  claim_id: z.string().min(1, "Claim ID is required"),
  holder_name: z.string().min(1, "Holder Name is required"),
  village: z.string().min(1, "Village is required"),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  area: z.coerce.number().nonnegative("Area must be a non-negative number"),
  status: z.enum(["Approved", "Pending", "Rejected"], { message: "Invalid status" }),
  document_name: z.string().optional(),
  soil_type: z.enum(['Alluvial', 'Clay', 'Loamy', 'Laterite'], { message: "Invalid soil type" }),
  water_availability: z.enum(['High', 'Medium', 'Low'], { message: "Invalid water availability" }),
  estimated_crop_value: z.coerce.number().nonnegative("Estimated crop value must be non-negative"),
  geometry: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return parsed.type === 'Polygon' && Array.isArray(parsed.coordinates);
    } catch (e) {
      return false;
    }
  }, { message: "Must be a valid GeoJSON Polygon string." }),
});

// Define the form schema for the file input
const formSchema = z.object({
  csvFile: z.instanceof(FileList).refine((fileList) => fileList.length > 0, "CSV file is required."),
});

type CsvUploadFormProps = {
  // Changed type to include 'id' as it comes from 'claim_id' in CSV
  onUpload: (claims: (Claim & { geometry: Geometry })[]) => void;
  onClose: () => void;
};

const CsvUploadForm = ({ onUpload, onClose }: CsvUploadFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const file = values.csvFile[0];
    if (!file) return;

    const toastId = showLoading("Parsing CSV file...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        dismissToast(String(toastId));
        if (results.errors.length) {
          showError(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`);
          return;
        }

        // Changed type to include 'id'
        const parsedClaims: (Claim & { geometry: Geometry })[] = [];
        let hasError = false;

        for (const row of results.data) {
          const validationResult = csvRowSchema.safeParse(row);
          if (!validationResult.success) {
            showError(`Validation error in row: ${JSON.stringify(row)}. Details: ${validationResult.error.errors.map(e => e.message).join(', ')}`);
            hasError = true;
            break;
          }
          const validatedData = validationResult.data;
          parsedClaims.push({
            id: validatedData.claim_id, // 'claim_id' from CSV is the 'id' for our Claim type
            holderName: validatedData.holder_name,
            village: validatedData.village,
            district: validatedData.district,
            state: validatedData.state,
            area: validatedData.area,
            status: validatedData.status,
            documentName: validatedData.document_name,
            soilType: validatedData.soil_type,
            waterAvailability: validatedData.water_availability,
            estimatedCropValue: validatedData.estimated_crop_value,
            geometry: JSON.parse(validatedData.geometry), // Parse GeoJSON string to object
          });
        }

        if (!hasError) {
          onUpload(parsedClaims);
          onClose();
        }
      },
      error: (error: Error) => {
        dismissToast(String(toastId));
        showError(`Failed to parse CSV: ${error.message}`);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="csvFile"
          render={({ field: { onChange, onBlur, name, ref } }) => (
            <FormItem>
              <FormLabel>Upload CSV File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={(e) => onChange(e.target.files)}
                  onBlur={onBlur}
                  name={name}
                  ref={ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SheetFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Upload Data</Button>
        </SheetFooter>
      </form>
    </Form>
  );
};

export default CsvUploadForm;