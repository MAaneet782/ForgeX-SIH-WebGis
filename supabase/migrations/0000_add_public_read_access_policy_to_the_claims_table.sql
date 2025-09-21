CREATE POLICY "Public read access for claims" ON public.claims
FOR SELECT USING (true);