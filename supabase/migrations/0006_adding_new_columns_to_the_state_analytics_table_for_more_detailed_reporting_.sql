-- Add new columns to track rejected claims and land distribution by type
ALTER TABLE public.state_fra_analytics
ADD COLUMN IF NOT EXISTS claims_rejected_individual BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS claims_rejected_community BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS extent_of_land_individual_acres NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS extent_of_land_community_acres NUMERIC DEFAULT 0;

-- Populating the new columns with some plausible, derived data for demonstration purposes.
-- This logic is for demonstration; it would be replaced by importing the actual data from your Excel file.

UPDATE public.state_fra_analytics
SET
  claims_rejected_individual = CASE 
    WHEN state_name = 'Odisha' THEN 45000
    WHEN state_name = 'Madhya Pradesh' THEN 65000
    WHEN state_name = 'Tripura' THEN 25000
    WHEN state_name = 'Telangana' THEN 15000
    ELSE (claims_received_individual - titles_distributed_individual) / 2 
  END,
  claims_rejected_community = CASE 
    WHEN state_name = 'Odisha' THEN 5000
    WHEN state_name = 'Madhya Pradesh' THEN 8000
    WHEN state_name = 'Tripura' THEN 2000
    WHEN state_name = 'Telangana' THEN 1000
    ELSE (claims_received_community - titles_distributed_community) / 2 
  END,
  extent_of_land_individual_acres = extent_of_land_acres * 
  CASE 
    WHEN state_name = 'Odisha' THEN 0.80
    WHEN state_name = 'Madhya Pradesh' THEN 0.85
    WHEN state_name = 'Tripura' THEN 0.90
    WHEN state_name = 'Telangana' THEN 0.75
    ELSE 0.8 
  END,
  extent_of_land_community_acres = extent_of_land_acres * 
  CASE 
    WHEN state_name = 'Odisha' THEN 0.20
    WHEN state_name = 'Madhya Pradesh' THEN 0.15
    WHEN state_name = 'Tripura' THEN 0.10
    WHEN state_name = 'Telangana' THEN 0.25
    ELSE 0.2
  END;