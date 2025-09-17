ALTER TABLE public.claims
ADD CONSTRAINT unique_claim_id UNIQUE (claim_id);