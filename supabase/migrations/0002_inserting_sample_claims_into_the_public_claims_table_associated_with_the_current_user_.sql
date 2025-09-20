INSERT INTO public.claims (
    claim_id, user_id, holder_name, village, district, state, area, status,
    document_name, soil_type, water_availability, estimated_crop_value, geometry, created_at
) VALUES
(
    'C-DEMO-001', auth.uid(), 'Ramesh Kumar', 'Palampur', 'Kangra', 'Himachal Pradesh', 3.5, 'Approved',
    'Patta_Ramesh_001.pdf', 'Loamy', 'High', 18500,
    '{"type":"Polygon","coordinates":[[[76.53,32.10],[76.54,32.10],[76.54,32.11],[76.53,32.11],[76.53,32.10]]]}', NOW()
),
(
    'C-DEMO-002', auth.uid(), 'Priya Devi', 'Sundarbans', 'South 24 Parganas', 'West Bengal', 7.2, 'Pending',
    'Patta_Priya_002.pdf', 'Clay', 'Medium', 22000,
    '{"type":"Polygon","coordinates":[[[88.80,21.85],[88.81,21.85],[88.81,21.86],[88.80,21.86],[88.80,21.85]]]}', NOW()
),
(
    'C-DEMO-003', auth.uid(), 'Anil Bhil', 'Mandla Forest', 'Mandla', 'Madhya Pradesh', 2.1, 'Approved',
    'Patta_Anil_003.pdf', 'Laterite', 'Low', 9500,
    '{"type":"Polygon","coordinates":[[[80.35,22.50],[80.36,22.50],[80.36,22.51],[80.35,22.51],[80.35,22.50]]]}', NOW()
),
(
    'C-DEMO-004', auth.uid(), 'Sunita Gond', 'Dantewada', 'Dantewada', 'Chhattisgarh', 4.8, 'Pending',
    'Patta_Sunita_004.pdf', 'Clay', 'Medium', 15000,
    '{"type":"Polygon","coordinates":[[[81.30,18.80],[81.31,18.80],[81.31,18.81],[81.30,18.81],[81.30,18.80]]]}', NOW()
),
(
    'C-DEMO-005', auth.uid(), 'Rajesh Sharma', 'Jaipur Rural', 'Jaipur', 'Rajasthan', 6.0, 'Rejected',
    'Patta_Rajesh_005.pdf', 'Loamy', 'Low', 11000,
    '{"type":"Polygon","coordinates":[[[75.80,26.90],[75.81,26.90],[75.81,26.91],[75.80,26.91],[75.80,26.90]]]}', NOW()
);