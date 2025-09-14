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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";

const formSchema = z.object({
  holderName: z.string().min(2, { message: "Holder name must be at least 2 characters." }),
  village: z.string().min(2, { message: "Village name must be at least 2 characters." }),
  area: z.coerce.number().nonnegative({ message: "Area must be a non-negative number." }),
  status: z.enum(["Approved", "Pending", "Rejected"]),
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
      area: 0,
      status: "Pending",
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
        <FormField
          control={form.control}
          name="holderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Holder Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter holder name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="village"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Village</FormLabel>
              <FormControl>
                <Input placeholder="Enter village name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area (acres)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter area" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="document"
          render={({ field: { onChange, onBlur, name, ref } }) => (
            <FormItem>
              <FormLabel>Government Document (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
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
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Claim</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddClaimForm;