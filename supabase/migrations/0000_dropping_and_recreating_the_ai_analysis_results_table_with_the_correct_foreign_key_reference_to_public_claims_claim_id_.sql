-- Drop existing ai_analysis_results table if it exists to recreate with correct FK
DROP TABLE IF EXISTS public.ai_analysis_results CASCADE;

-- Create ai_analysis_results table with correct foreign key
CREATE TABLE public.ai_analysis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id TEXT NOT NULL UNIQUE REFERENCES public.claims(claim_id) ON DELETE CASCADE, -- Corrected reference
  analysis_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.ai_analysis_results ENABLE ROW LEVEL SECURITY;

-- Create policies for each operation
CREATE POLICY "Authenticated users can view AI analysis results" ON public.ai_analysis_results
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert/update AI analysis results" ON public.ai_analysis_results
FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.claims WHERE claims.claim_id = ai_analysis_results.claim_id AND claims.user_id = auth.uid()));

CREATE POLICY "Authenticated users can update AI analysis results" ON public.ai_analysis_results
FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.claims WHERE claims.claim_id = ai_analysis_results.claim_id AND claims.user_id = auth.uid()));

CREATE POLICY "Authenticated users can delete AI analysis results" ON public.ai_analysis_results
FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.claims WHERE claims.claim_id = ai_analysis_results.claim_id AND claims.user_id = auth.uid()));