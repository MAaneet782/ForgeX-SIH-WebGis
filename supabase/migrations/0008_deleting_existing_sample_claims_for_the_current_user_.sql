DELETE FROM public.claims
WHERE user_id = auth.uid() AND (claim_id LIKE 'C-DEMO-%' OR claim_id LIKE 'C-MP-%' OR claim_id LIKE 'C-OD-%');