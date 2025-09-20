import { FeatureCollection, Geometry } from 'geojson';

export type Claim = {
  dbId: string; // The actual UUID primary key from Supabase (or unique ID for mock)
  id: string; // The user-facing claim_id (text)
  holderName: string;
  village: string;
  district: string;
  state: string;
  area: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  documentName?: string;
  soilType: 'Alluvial' | 'Clay' | 'Loamy' | 'Laterite' | 'Unknown'; // Added 'Unknown'
  waterAvailability: 'High' | 'Medium' | 'Low' | 'Unknown'; // Added 'Unknown'
  estimatedCropValue: number; // in INR
  geometry?: Geometry;
  created_at?: Date; // Added created_at field
};

export const waterBodiesGeoJson: FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: 'Tawa Reservoir' },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [77.95, 22.55], [78.05, 22.50], [78.02, 22.58], [78.00, 22.60], [77.92, 22.61], [77.90, 22.60], [77.95, 22.55]
            ]
          ]
        }
      },
      {
        type: "Feature",
        properties: { name: 'Indravati River' },
        geometry: {
          type: "LineString",
          coordinates: [
             [82.20, 19.05], [82.25, 19.06], [82.35, 19.10], [82.40, 19.09], [82.50, 19.08], [82.55, 19.12]
          ]
        }
      }
    ]
};

export const agriLandGeoJson: FeatureCollection = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { type: 'Paddy Field' },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [85.60, 21.65], [85.62, 21.65], [85.63, 21.66], [85.62, 21.67], [85.60, 21.67], [85.60, 21.65]
                ]
              ]
            }
        },
        {
            type: "Feature",
            properties: { type: 'Soybean Cultivation' },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [79.55, 22.10], [79.58, 22.10], [79.59, 22.11], [79.58, 22.13], [79.55, 22.13], [79.55, 22.10]
                ]
              ]
            }
        }
    ]
};

export const mockClaims: Claim[] = [
  // 10 sample claims for Madhya Pradesh
  {
    dbId: 'mp-claim-001', id: 'C-MP-001', holderName: 'Ram Singh', village: 'Sehore Kalan', district: 'Sehore', state: 'Madhya Pradesh', area: 4.2, status: 'Approved',
    documentName: 'Patta_MP_001.pdf', soilType: 'Loamy', waterAvailability: 'High', estimatedCropValue: 21000,
    geometry: {"type":"Polygon","coordinates":[[[77.08,23.20],[77.09,23.21],[77.10,23.20],[77.09,23.19],[77.08,23.20]]]}, created_at: new Date('2023-01-15')
  },
  {
    dbId: 'mp-claim-002', id: 'C-MP-002', holderName: 'Geeta Devi', village: 'Hoshangabad', district: 'Narmadapuram', state: 'Madhya Pradesh', area: 6.8, status: 'Pending',
    documentName: 'Patta_MP_002.pdf', soilType: 'Alluvial', waterAvailability: 'Medium', estimatedCropValue: 28000,
    geometry: {"type":"Polygon","coordinates":[[[77.70,22.75],[77.71,22.76],[77.72,22.75],[77.71,22.74],[77.70,22.75]]]}, created_at: new Date('2023-02-20')
  },
  {
    dbId: 'mp-claim-003', id: 'C-MP-003', holderName: 'Suresh Gond', village: 'Dindori', district: 'Dindori', state: 'Madhya Pradesh', area: 2.5, status: 'Rejected',
    documentName: 'Patta_MP_003.pdf', soilType: 'Laterite', waterAvailability: 'Low', estimatedCropValue: 10500,
    geometry: {"type":"Polygon","coordinates":[[[81.08,22.95],[81.09,22.96],[81.10,22.95],[81.09,22.94],[81.08,22.95]]]}, created_at: new Date('2023-03-10')
  },
  {
    dbId: 'mp-claim-004', id: 'C-MP-004', holderName: 'Laxmi Bai', village: 'Chhindwara', district: 'Chhindwara', state: 'Madhya Pradesh', area: 5.1, status: 'Approved',
    documentName: 'Patta_MP_004.pdf', soilType: 'Clay', waterAvailability: 'High', estimatedCropValue: 25000,
    geometry: {"type":"Polygon","coordinates":[[[78.90,22.05],[78.91,22.06],[78.92,22.05],[78.91,22.04],[78.90,22.05]]]}, created_at: new Date('2023-04-01')
  },
  {
    dbId: 'mp-claim-005', id: 'C-MP-005', holderName: 'Arjun Verma', village: 'Rewa', district: 'Rewa', state: 'Madhya Pradesh', area: 3.9, status: 'Pending',
    documentName: 'Patta_MP_005.pdf', soilType: 'Alluvial', waterAvailability: 'Medium', estimatedCropValue: 19500,
    geometry: {"type":"Polygon","coordinates":[[[81.30,24.55],[81.31,24.56],[81.32,24.55],[81.31,24.54],[81.30,24.55]]]}, created_at: new Date('2023-05-05')
  },
  {
    dbId: 'mp-claim-006', id: 'C-MP-006', holderName: 'Prakash Patel', village: 'Jabalpur', district: 'Jabalpur', state: 'Madhya Pradesh', area: 7.0, status: 'Approved',
    documentName: 'Patta_MP_006.pdf', soilType: 'Loamy', waterAvailability: 'High', estimatedCropValue: 30000,
    geometry: {"type":"Polygon","coordinates":[[[79.90,23.15],[79.91,23.16],[79.92,23.15],[79.91,23.14],[79.90,23.15]]]}, created_at: new Date('2023-06-12')
  },
  {
    dbId: 'mp-claim-007', id: 'C-MP-007', holderName: 'Kiran Yadav', village: 'Ujjain', district: 'Ujjain', state: 'Madhya Pradesh', area: 2.8, status: 'Pending',
    documentName: 'Patta_MP_007.pdf', soilType: 'Clay', waterAvailability: 'Low', estimatedCropValue: 12000,
    geometry: {"type":"Polygon","coordinates":[[[75.75,23.18],[75.76,23.19],[75.77,23.18],[75.76,23.17],[75.75,23.18]]]}, created_at: new Date('2023-07-01')
  },
  {
    dbId: 'mp-claim-008', id: 'C-MP-008', holderName: 'Deepak Kushwaha', village: 'Sagar', district: 'Sagar', state: 'Madhya Pradesh', area: 5.5, status: 'Approved',
    documentName: 'Patta_MP_008.pdf', soilType: 'Loamy', waterAvailability: 'Medium', estimatedCropValue: 26000,
    geometry: {"type":"Polygon","coordinates":[[[78.75,23.85],[78.76,23.86],[78.77,23.85],[78.76,23.84],[78.75,23.85]]]}, created_at: new Date('2023-08-18')
  },
  {
    dbId: 'mp-claim-009', id: 'C-MP-009', holderName: 'Santosh Bhil', village: 'Betul', district: 'Betul', state: 'Madhya Pradesh', area: 3.1, status: 'Rejected',
    documentName: 'Patta_MP_009.pdf', soilType: 'Laterite', waterAvailability: 'Low', estimatedCropValue: 11500,
    geometry: {"type":"Polygon","coordinates":[[[77.90,21.90],[77.91,21.91],[77.92,21.90],[77.91,21.89],[77.90,21.90]]]}, created_at: new Date('2023-09-03')
  },
  {
    dbId: 'mp-claim-010', id: 'C-MP-010', holderName: 'Pooja Singh', village: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh', area: 4.0, status: 'Approved',
    documentName: 'Patta_MP_010.pdf', soilType: 'Alluvial', waterAvailability: 'High', estimatedCropValue: 20000,
    geometry: {"type":"Polygon","coordinates":[[[77.40,23.25],[77.41,23.26],[77.42,23.25],[77.41,23.24],[77.40,23.25]]]}, created_at: new Date('2023-10-25')
  },
  // 10 sample claims for Odisha
  {
    dbId: 'od-claim-001', id: 'C-OD-001', holderName: 'Manoj Sahoo', village: 'Puri', district: 'Puri', state: 'Odisha', area: 5.0, status: 'Approved',
    documentName: 'Patta_OD_001.pdf', soilType: 'Alluvial', waterAvailability: 'High', estimatedCropValue: 23000,
    geometry: {"type":"Polygon","coordinates":[[[85.80,19.80],[85.81,19.81],[85.82,19.80],[85.81,19.79],[85.80,19.80]]]}, created_at: new Date('2023-01-20')
  },
  {
    dbId: 'od-claim-002', id: 'C-OD-002', holderName: 'Sushila Murmu', village: 'Mayurbhanj', district: 'Mayurbhanj', state: 'Odisha', area: 3.2, status: 'Pending',
    documentName: 'Patta_OD_002.pdf', soilType: 'Laterite', waterAvailability: 'Medium', estimatedCropValue: 14000,
    geometry: {"type":"Polygon","coordinates":[[[86.70,21.90],[86.71,21.91],[86.72,21.90],[86.71,21.89],[86.70,21.90]]]}, created_at: new Date('2023-02-25')
  },
  {
    dbId: 'od-claim-003', id: 'C-OD-003', holderName: 'Gopal Naik', village: 'Koraput', district: 'Koraput', state: 'Odisha', area: 7.5, status: 'Approved',
    documentName: 'Patta_OD_003.pdf', soilType: 'Clay', waterAvailability: 'High', estimatedCropValue: 32000,
    geometry: {"type":"Polygon","coordinates":[[[82.70,18.80],[82.71,18.81],[82.72,18.80],[82.71,18.79],[82.70,18.80]]]}, created_at: new Date('2023-03-15')
  },
  {
    dbId: 'od-claim-004', id: 'C-OD-004', holderName: 'Rina Das', village: 'Cuttack', district: 'Cuttack', state: 'Odisha', area: 4.5, status: 'Rejected',
    documentName: 'Patta_OD_004.pdf', soilType: 'Loamy', waterAvailability: 'Low', estimatedCropValue: 16000,
    geometry: {"type":"Polygon","coordinates":[[[85.85,20.45],[85.86,20.46],[85.87,20.45],[85.86,20.44],[85.85,20.45]]]}, created_at: new Date('2023-04-05')
  },
  {
    dbId: 'od-claim-005', id: 'C-OD-005', holderName: 'Babu Singh', village: 'Sambalpur', district: 'Sambalpur', state: 'Odisha', area: 6.0, status: 'Pending',
    documentName: 'Patta_OD_005.pdf', soilType: 'Alluvial', waterAvailability: 'Medium', estimatedCropValue: 27000,
    geometry: {"type":"Polygon","coordinates":[[[83.95,21.45],[83.96,21.46],[83.97,21.45],[83.96,21.44],[83.95,21.45]]]}, created_at: new Date('2023-05-10')
  },
  {
    dbId: 'od-claim-006', id: 'C-OD-006', holderName: 'Sita Soren', village: 'Keonjhar', district: 'Keonjhar', state: 'Odisha', area: 2.9, status: 'Approved',
    documentName: 'Patta_OD_006.pdf', soilType: 'Laterite', waterAvailability: 'High', estimatedCropValue: 13000,
    geometry: {"type":"Polygon","coordinates":[[[85.50,21.60],[85.51,21.61],[85.52,21.60],[85.51,21.59],[85.50,21.60]]]}, created_at: new Date('2023-06-17')
  },
  {
    dbId: 'od-claim-007', id: 'C-OD-007', holderName: 'Kishore Behera', village: 'Ganjam', district: 'Ganjam', state: 'Odisha', area: 8.1, status: 'Pending',
    documentName: 'Patta_OD_007.pdf', soilType: 'Clay', waterAvailability: 'Medium', estimatedCropValue: 35000,
    geometry: {"type":"Polygon","coordinates":[[[84.80,19.50],[84.81,19.51],[84.82,19.50],[84.81,19.49],[84.80,19.50]]]}, created_at: new Date('2023-07-06')
  },
  {
    dbId: 'od-claim-008', id: 'C-OD-008', holderName: 'Mina Hembram', village: 'Rayagada', district: 'Rayagada', state: 'Odisha', area: 3.7, status: 'Rejected',
    documentName: 'Patta_OD_008.pdf', soilType: 'Laterite', waterAvailability: 'Low', estimatedCropValue: 15500,
    geometry: {"type":"Polygon","coordinates":[[[83.40,19.10],[83.41,19.11],[83.42,19.10],[83.41,19.09],[83.40,19.10]]]}, created_at: new Date('2023-08-23')
  },
  {
    dbId: 'od-claim-009', id: 'C-OD-009', holderName: 'Chandan Rout', village: 'Balasore', district: 'Balasore', state: 'Odisha', area: 5.3, status: 'Approved',
    documentName: 'Patta_OD_009.pdf', soilType: 'Alluvial', waterAvailability: 'High', estimatedCropValue: 24000,
    geometry: {"type":"Polygon","coordinates":[[[86.90,21.50],[86.91,21.51],[86.92,21.50],[86.91,21.49],[86.90,21.50]]]}, created_at: new Date('2023-09-08')
  },
  {
    dbId: 'od-claim-010', id: 'C-OD-010', holderName: 'Deepa Majhi', village: 'Kalahandi', district: 'Kalahandi', state: 'Odisha', area: 4.9, status: 'Pending',
    documentName: 'Patta_OD_010.pdf', soilType: 'Loamy', waterAvailability: 'Medium', estimatedCropValue: 20500,
    geometry: {"type":"Polygon","coordinates":[[[83.10,19.85],[83.11,19.86],[83.12,19.85],[83.11,19.84],[83.10,19.85]]]}, created_at: new Date('2023-10-30')
  }
];