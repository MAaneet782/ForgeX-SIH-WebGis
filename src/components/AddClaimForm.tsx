import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SheetFooter } from "@/components/ui/sheet";
import type { ClaimStatus, SoilType, WaterAvailability } from "@/types"; // Updated import

const formSchema = z.object({
  holderName: z.string().min(2, { message: "Holder name must be at least 2 characters." }),
  village: z.string().min(2, { message: "Village name must be at least 2 characters." }),
  district: z.string().min(2, { message: "District name must be at least 2 characters." }),
  state: z.string().min(2, { message: "State name must be at least 2 characters." }),
  area: z.coerce.number().nonnegative({ message: "Area must be a non-negative number." }),
  status: z.enum(["Approved", "Pending", "Rejected"] as const),
  soilType: z.enum(['Alluvial', 'Clay', 'Loamy', 'Laterite'] as const),
  waterAvailability: z.enum(['High', 'Medium', 'Low'] as const),
  coordinates: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return parsed.type === 'Polygon' && Array.isArray(parsed.coordinates);
    } catch (e) {
      return false;
    }
  }, { message: "Must be a valid GeoJSON Polygon string." }),
  document: z.instanceof(FileList).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type AddClaimFormProps = {
  onAddClaim: (claim: Omit<FormValues, 'document'> & { documentName?: string }) => void;
  onClose: () => void;
};

const AddClaimForm = ({ onAddClaim, onClose }: AddClaimFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      holderName: "",
      village: "",
      district: "",
      state: "",
      area: 0,
      status: "Pending",
      soilType: "Loamy",
      waterAvailability: "Medium",
      coordinates: '{"type":"Polygon","coordinates":[[[0,0],[0,1],[1,1],[1,0],[0,0]]]}',
    },
  });

  function onSubmit(values: FormValues) {
    const { document, ...rest } = values;
    const documentName = document?.[0]?.name;
    onAddClaim({ ...rest, documentName });
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="holderName" render={({ field }) => ( <FormItem><FormLabel>Holder Name</FormLabel><FormControl><Input placeholder="Enter name" {...field} /></FormControl><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="village" render={({ field }) => ( <FormItem><FormLabel>Village</FormLabel><FormControl><Input placeholder="Enter village" {...field} /></FormControl><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="district" render={({ field }) => ( <FormItem><FormLabel>District</FormLabel><FormControl><Input placeholder="Enter district" {...field} /></FormControl><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="state" render={({ field }) => ( <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="Enter state" {...field} /></FormControl><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="area" render={({ field }) => ( <FormItem><FormLabel>Area (acres)</FormLabel><FormControl><Input type="number" placeholder="Enter area" {...field} /></FormControl><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="status" render={({ field }) => ( <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="soilType" render={({ field }) => ( <FormItem><FormLabel>Soil Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Alluvial">Alluvial</SelectItem><SelectItem value="Clay">Clay</SelectItem><SelectItem value="Loamy">Loamy</SelectItem><SelectItem value="Laterite">Laterite</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="waterAvailability" render={({ field }) => ( <FormItem><FormLabel>Water Availability</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
        </div>
        <FormField control={form.control} name="coordinates" render={({ field }) => ( <FormItem><FormLabel>GeoJSON Coordinates</FormLabel><FormControl><Textarea placeholder="Enter GeoJSON Polygon coordinates" className="min-h-[100px] font-mono text-xs" {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="document" render={({ field: { onChange, onBlur, name, ref } }) => ( <FormItem><FormLabel>Govt. Document (Optional)</FormLabel><FormControl><Input type="file" onChange={(e) => onChange(e.target.files)} onBlur={onBlur} name={name} ref={ref} /></FormControl><FormMessage /></FormItem> )} />
        <SheetFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Claim</Button>
        </SheetFooter>
      </form>
    </Form>
  );
};

export default AddClaimForm;