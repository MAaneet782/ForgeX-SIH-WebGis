-- Create ENUM types if they don't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'claim_status') THEN
        CREATE TYPE public.claim_status AS ENUM ('Approved', 'Pending', 'Rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'soil_type') THEN
        CREATE TYPE public.soil_type AS ENUM ('Alluvial', 'Clay', 'Loamy', 'Laterite');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'water_availability') THEN
        CREATE TYPE public.water_availability AS ENUM ('High', 'Medium', 'Low');
    END IF;
END $$;

-- Alter claims table to use these types if not already
ALTER TABLE public.claims
ALTER COLUMN status TYPE public.claim_status USING status::public.claim_status,
ALTER COLUMN soil_type TYPE public.soil_type USING soil_type::public.soil_type,
ALTER COLUMN water_availability TYPE public.water_availability USING water_availability::public.water_availability;

-- Insert sample data if the table is empty
INSERT INTO public.claims (claim_id, holder_name, village, district, state, area, status, document_name, soil_type, water_availability, estimated_crop_value, geometry)
SELECT
    'C001',
    'Ramesh Kumar',
    'Haripur',
    'Mandla',
    'Madhya Pradesh',
    3.5,
    'Approved',
    'Doc_C001.pdf',
    'Alluvial',
    'High',
    15000,
    '{"type":"Polygon","coordinates":[[[78.0,22.5],[78.1,22.5],[78.1,22.6],[78.0,22.6],[78.0,22.5]]]}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.claims WHERE claim_id = 'C001');

INSERT INTO public.claims (claim_id, holder_name, village, district, state, area, status, document_name, soil_type, water_availability, estimated_crop_value, geometry)
SELECT
    'C002',
    'Priya Sharma',
    'Shivpur',
    'Seoni',
    'Madhya Pradesh',
    2.1,
    'Pending',
    'Doc_C002.pdf',
    'Loamy',
    'Medium',
    12000,
    '{"type":"Polygon","coordinates":[[[79.0,22.0],[79.1,22.0],[79.1,22.1],[79.0,22.1],[79.0,22.0]]]}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.claims WHERE claim_id = 'C002');

INSERT INTO public.claims (claim_id, holder_name, village, district, state, area, status, document_name, soil_type, water_availability, estimated_crop_value, geometry)
SELECT
    'C003',
    'Sunil Verma',
    'Ramnagar',
    'Balaghat',
    'Madhya Pradesh',
    4.8,
    'Rejected',
    'Doc_C003.pdf',
    'Clay',
    'Low',
    8000,
    '{"type":"Polygon","coordinates":[[[80.0,21.5],[80.1,21.5],[80.1,21.6],[80.0,21.6],[80.0,21.5]]]}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.claims WHERE claim_id = 'C003');