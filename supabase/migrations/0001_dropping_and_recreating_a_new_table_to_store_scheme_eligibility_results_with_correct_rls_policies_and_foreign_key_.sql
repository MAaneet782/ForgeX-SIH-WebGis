-- Drop existing scheme_eligibility_cache table if it exists to recreate with correct FK
DROP TABLE IF EXISTS public.scheme_eligibility_cache CASCADE;

-- Create scheme_eligibility_cache table with correct foreign key
CREATE TABLE public.scheme_eligibility_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id TEXT NOT NULL UNIQUE REFERENCES public.claims(claim_id) ON DELETE CASCADE, -- Corrected reference
  eligibility_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.scheme_eligibility_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for each operation
CREATE POLICY "Allow authenticated users to read scheme eligibility cache" ON public.scheme_eligibility_cache
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert their own scheme eligibility cache" ON public.scheme_eligibility_cache
FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.claims WHERE claims.claim_id = scheme_eligibility_cache.claim_id AND claims.user_id = auth.uid())); -- Corrected reference

CREATE POLICY "Allow authenticated users to update their own scheme eligibility cache" ON public.scheme_eligibility_cache
FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.claims WHERE claims.claim_id = scheme_eligibility_cache.claim_id AND claims.user_id = auth.uid())); -- Corrected reference

CREATE POLICY "Allow authenticated users to delete their own scheme eligibility cache" ON public.scheme_eligibility_cache
FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.claims WHERE claims.claim_id = scheme_eligibility_cache.claim_id AND claims.user_id = auth.uid())); -- Corrected reference