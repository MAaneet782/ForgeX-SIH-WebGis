import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { showLoading, showSuccess, showError, dismissToast } from "@/utils/toast";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const claimSchema = z.object({
  claim_id: z.string().min(1, "Claim ID is required"),
  holder_name: z.string().min(1, "Holder name is required"),
  village: z.string().min(1, "Village is required"),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  area: z.coerce.number().min(0, "Area must be a positive number"),
  status: z.enum(["Approved", "Pending", "Rejected"]),
});

type ClaimFormValues = z.infer<typeof claimSchema>;

const AddClaimPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      status: "Pending",
    },
  });

  const onSubmit = async (values: ClaimFormValues) => {
    const toastId = showLoading("Adding new claim...");
    const { error } = await supabase.from("claims").insert([values]);
    dismissToast(toastId);

    if (error) {
      showError(`Failed to add claim: ${error.message}`);
    } else {
      showSuccess("Claim added successfully!");
      queryClient.invalidateQueries({ queryKey: ["claims"] });
      navigate('/atlas'); // Redirect back to the Atlas page after adding
      form.reset();
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-muted/40 min-h-screen">
      <div className="mb-6">
        <Button asChild variant="outline" className="mb-4">
          <Link to="/atlas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Atlas
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-shadow">Add New Claim</h1>
        <p className="text-muted-foreground">
          Enter the details for the new claim.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-card p-8 rounded-lg shadow-lg border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="claim_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Claim ID</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="holder_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Holder Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
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
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
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
                  <FormControl><Input type="number" {...field} /></FormControl>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
              {form.formState.isSubmitting ? "Saving..." : "Save Claim"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddClaimPage;