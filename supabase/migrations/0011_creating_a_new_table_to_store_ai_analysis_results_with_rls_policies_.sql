CREATE TABLE public.ai_analysis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id TEXT NOT NULL UNIQUE, -- User-facing claim ID from mock data
  analysis_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for the table
ALTER TABLE public.ai_analysis_results ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view AI analysis results
CREATE POLICY "Authenticated users can view AI analysis results" ON public.ai_analysis_results
FOR SELECT TO authenticated USING (true);

-- Policy for authenticated users (via Edge Function) to insert/update AI analysis results
CREATE POLICY "Authenticated users can insert/update AI analysis results" ON public.ai_analysis_results
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update AI analysis results" ON public.ai_analysis_results
FOR UPDATE TO authenticated USING (true);

-- Policy for authenticated users to delete AI analysis results (optional, but good practice)
CREATE POLICY "Authenticated users can delete AI analysis results" ON public.ai_analysis_results
FOR DELETE TO authenticated USING (true);