-- Delete existing sample claims for the current user to avoid duplicates
DELETE FROM public.claims
WHERE user_id = auth.uid() AND claim_id LIKE 'C-DEMO-%';

-- Insert 10 sample claims for Madhya Pradesh
INSERT INTO public.claims (
    claim_id, user_id, holder_name, village, district, state, area, status,
    document_name, soil_type, water_availability, estimated_crop_value, geometry, created_at
) VALUES
(
    'C-MP-001', auth.uid(), 'Ram Singh', 'Sehore Kalan', 'Sehore', 'Madhya Pradesh', 4.2, 'Approved',
    'Patta_MP_001.pdf', 'Loamy', 'High', 21000,
    '{"type":"Polygon","coordinates":[[[77.08,23.20],[77.09,23.21],[77.10,23.20],[77.09,23.19],[77.08,23.20]]]}', NOW()
),
(
    'C-MP-002', auth.uid(), 'Geeta Devi', 'Hoshangabad', 'Narmadapuram', 'Madhya Pradesh', 6.8, 'Pending',
    'Patta_MP_002.pdf', 'Alluvial', 'Medium', 28000,
    '{"type":"Polygon","coordinates":[[[77.70,22.75],[77.71,22.76],[77.72,22.75],[77.71,22.74],[77.70,22.75]]]}', NOW()
),
(
    'C-MP-003', auth.uid(), 'Suresh Gond', 'Dindori', 'Dindori', 'Madhya Pradesh', 2.5, 'Rejected',
    'Patta_MP_003.pdf', 'Laterite', 'Low', 10500,
    '{"type":"Polygon","coordinates":[[[81.08,22.95],[81.09,22.96],[81.10,22.95],[81.09,22.94],[81.08,22.95]]]}', NOW()
),
(
    'C-MP-004', auth.uid(), 'Laxmi Bai', 'Chhindwara', 'Chhindwara', 'Madhya Pradesh', 5.1, 'Approved',
    'Patta_MP_004.pdf', 'Clay', 'High', 25000,
    '{"type":"Polygon","coordinates":[[[78.90,22.05],[78.91,22.06],[78.92,22.05],[78.91,22.04],[78.90,22.05]]]}', NOW()
),
(
    'C-MP-005', auth.uid(), 'Arjun Verma', 'Rewa', 'Rewa', 'Madhya Pradesh', 3.9, 'Pending',
    'Patta_MP_005.pdf', 'Alluvial', 'Medium', 19500,
    '{"type":"Polygon","coordinates":[[[81.30,24.55],[81.31,24.56],[81.32,24.55],[81.31,24.54],[81.30,24.55]]]}', NOW()
),
(
    'C-MP-006', auth.uid(), 'Prakash Patel', 'Jabalpur', 'Jabalpur', 'Madhya Pradesh', 7.0, 'Approved',
    'Patta_MP_006.pdf', 'Loamy', 'High', 30000,
    '{"type":"Polygon","coordinates":[[[79.90,23.15],[79.91,23.16],[79.92,23.15],[79.91,23.14],[79.90,23.15]]]}', NOW()
),
(
    'C-MP-007', auth.uid(), 'Kiran Yadav', 'Ujjain', 'Ujjain', 'Madhya Pradesh', 2.8, 'Pending',
    'Patta_MP_007.pdf', 'Clay', 'Low', 12000,
    '{"type":"Polygon","coordinates":[[[75.75,23.18],[75.76,23.19],[75.77,23.18],[75.76,23.17],[75.75,23.18]]]}', NOW()
),
(
    'C-MP-008', auth.uid(), 'Deepak Kushwaha', 'Sagar', 'Sagar', 'Madhya Pradesh', 5.5, 'Approved',
    'Patta_MP_008.pdf', 'Loamy', 'Medium', 26000,
    '{"type":"Polygon","coordinates":[[[78.75,23.85],[78.76,23.86],[78.77,23.85],[78.76,23.84],[78.75,23.85]]]}', NOW()
),
(
    'C-MP-009', auth.uid(), 'Santosh Bhil', 'Betul', 'Betul', 'Madhya Pradesh', 3.1, 'Rejected',
    'Patta_MP_009.pdf', 'Laterite', 'Low', 11500,
    '{"type":"Polygon","coordinates":[[[77.90,21.90],[77.91,21.91],[77.92,21.90],[77.91,21.89],[77.90,21.90]]]}', NOW()
),
(
    'C-MP-010', auth.uid(), 'Pooja Singh', 'Bhopal', 'Bhopal', 'Madhya Pradesh', 4.0, 'Approved',
    'Patta_MP_010.pdf', 'Alluvial', 'High', 20000,
    '{"type":"Polygon","coordinates":[[[77.40,23.25],[77.41,23.26],[77.42,23.25],[77.41,23.24],[77.40,23.25]]]}', NOW()
),
-- Insert 10 sample claims for Odisha
(
    'C-OD-001', auth.uid(), 'Manoj Sahoo', 'Puri', 'Puri', 'Odisha', 5.0, 'Approved',
    'Patta_OD_001.pdf', 'Alluvial', 'High', 23000,
    '{"type":"Polygon","coordinates":[[[85.80,19.80],[85.81,19.81],[85.82,19.80],[85.81,19.79],[85.80,19.80]]]}', NOW()
),
(
    'C-OD-002', auth.uid(), 'Sushila Murmu', 'Mayurbhanj', 'Mayurbhanj', 'Odisha', 3.2, 'Pending',
    'Patta_OD_002.pdf', 'Laterite', 'Medium', 14000,
    '{"type":"Polygon","coordinates":[[[86.70,21.90],[86.71,21.91],[86.72,21.90],[86.71,21.89],[86.70,21.90]]]}', NOW()
),
(
    'C-OD-003', auth.uid(), 'Gopal Naik', 'Koraput', 'Koraput', 'Odisha', 7.5, 'Approved',
    'Patta_OD_003.pdf', 'Clay', 'High', 32000,
    '{"type":"Polygon","coordinates":[[[82.70,18.80],[82.71,18.81],[82.72,18.80],[82.71,18.79],[82.70,18.80]]]}', NOW()
),
(
    'C-OD-004', auth.uid(), 'Rina Das', 'Cuttack', 'Cuttack', 'Odisha', 4.5, 'Rejected',
    'Patta_OD_004.pdf', 'Loamy', 'Low', 16000,
    '{"type":"Polygon","coordinates":[[[85.85,20.45],[85.86,20.46],[85.87,20.45],[85.86,20.44],[85.85,20.45]]]}', NOW()
),
(
    'C-OD-005', auth.uid(), 'Babu Singh', 'Sambalpur', 'Sambalpur', 'Odisha', 6.0, 'Pending',
    'Patta_OD_005.pdf', 'Alluvial', 'Medium', 27000,
    '{"type":"Polygon","coordinates":[[[83.95,21.45],[83.96,21.46],[83.97,21.45],[83.96,21.44],[83.95,21.45]]]}', NOW()
),
(
    'C-OD-006', auth.uid(), 'Sita Soren', 'Keonjhar', 'Keonjhar', 'Odisha', 2.9, 'Approved',
    'Patta_OD_006.pdf', 'Laterite', 'High', 13000,
    '{"type":"Polygon","coordinates":[[[85.50,21.60],[85.51,21.61],[85.52,21.60],[85.51,21.59],[85.50,21.60]]]}', NOW()
),
(
    'C-OD-007', auth.uid(), 'Kishore Behera', 'Ganjam', 'Ganjam', 'Odisha', 8.1, 'Pending',
    'Patta_OD_007.pdf', 'Clay', 'Medium', 35000,
    '{"type":"Polygon","coordinates":[[[84.80,19.50],[84.81,19.51],[84.82,19.50],[84.81,19.49],[84.80,19.50]]]}', NOW()
),
(
    'C-OD-008', auth.uid(), 'Mina Hembram', 'Rayagada', 'Rayagada', 'Odisha', 3.7, 'Rejected',
    'Patta_OD_008.pdf', 'Laterite', 'Low', 15500,
    '{"type":"Polygon","coordinates":[[[83.40,19.10],[83.41,19.11],[83.42,19.10],[83.41,19.09],[83.40,19.10]]]}', NOW()
),
(
    'C-OD-009', auth.uid(), 'Chandan Rout', 'Balasore', 'Balasore', 'Odisha', 5.3, 'Approved',
    'Patta_OD_009.pdf', 'Alluvial', 'High', 24000,
    '{"type":"Polygon","coordinates":[[[86.90,21.50],[86.91,21.51],[86.92,21.50],[86.91,21.49],[86.90,21.50]]]}', NOW()
),
(
    'C-OD-010', auth.uid(), 'Deepa Majhi', 'Kalahandi', 'Kalahandi', 'Odisha', 4.9, 'Pending',
    'Patta_OD_010.pdf', 'Loamy', 'Medium', 20500,
    '{"type":"Polygon","coordinates":[[[83.10,19.85],[83.11,19.86],[83.12,19.85],[83.11,19.84],[83.10,19.85]]]}', NOW()
);