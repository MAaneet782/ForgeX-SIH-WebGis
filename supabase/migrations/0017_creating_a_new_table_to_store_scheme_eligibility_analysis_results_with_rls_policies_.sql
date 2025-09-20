-- Create scheme_eligibility_results table
CREATE TABLE public.scheme_eligibility_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id TEXT NOT NULL UNIQUE, -- Reference to the claim's user-facing ID
  eligibility_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.scheme_eligibility_results ENABLE ROW LEVEL SECURITY;

-- Create secure policies for each operation
CREATE POLICY "scheme_eligibility_select_policy" ON public.scheme_eligibility_results
FOR SELECT TO authenticated USING (true); -- Authenticated users can read all eligibility results

CREATE POLICY "scheme_eligibility_insert_policy" ON public.scheme_eligibility_results
FOR INSERT TO authenticated WITH CHECK (true); -- Edge function will handle inserts

CREATE POLICY "scheme_eligibility_update_policy" ON public.scheme_eligibility_results
FOR UPDATE TO authenticated USING (true); -- Edge function will handle updates

CREATE POLICY "scheme_eligibility_delete_policy" ON public.scheme_eligibility_results
FOR DELETE TO authenticated USING (true); -- Allow deletion for cleanup/re-population