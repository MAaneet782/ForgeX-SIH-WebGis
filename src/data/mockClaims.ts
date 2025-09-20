import { FeatureCollection } from 'geojson';
import * as GeoJSON from 'geojson'; // Import GeoJSON namespace

export type Claim = {
  id: string;
  holderName: string;
  village: string;
  district: string;
  state: string;
  area: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  documentName?: string;
  soilType: 'Alluvial' | 'Clay' | 'Loamy' | 'Laterite';
  waterAvailability: 'High' | 'Medium' | 'Low';
  estimatedCropValue: number; // in INR
  geometry?: GeoJSON.Geometry; // Added geometry property
  created_at: string; // Added for mock age calculation in edge function
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

// Exporting mockClaims array with sample data including geometry
export const mockClaims: Claim[] = [
  {
    id: 'mp-claim-001',
    holderName: 'Anil Bhil',
    village: 'Mandla',
    district: 'Mandla',
    state: 'Madhya Pradesh',
    area: 3.5,
    status: 'Approved',
    documentName: 'FRA_Patta_001.pdf',
    soilType: 'Loamy',
    waterAvailability: 'High',
    estimatedCropValue: 15000,
    geometry: {
      type: "Polygon",
      coordinates: [[[79.95,22.55],[79.96,22.55],[79.96,22.56],[79.95,22.56],[79.95,22.55]]]
    },
    created_at: '2023-01-15T00:00:00.000Z'
  },
  {
    id: 'mp-claim-002',
    holderName: 'Sunita Devi',
    village: 'Dindori',
    district: 'Dindori',
    state: 'Madhya Pradesh',
    area: 2.1,
    status: 'Pending',
    documentName: 'FRA_Application_002.pdf',
    soilType: 'Alluvial',
    waterAvailability: 'Medium',
    estimatedCropValue: 10000,
    geometry: {
      type: "Polygon",
      coordinates: [[[81.00,22.70],[81.01,22.70],[81.01,22.71],[81.00,22.71],[81.00,22.70]]]
    },
    created_at: '2023-02-20T00:00:00.000Z'
  },
  {
    id: 'mp-claim-003',
    holderName: 'Ramesh Gond',
    village: 'Umaria',
    district: 'Umaria',
    state: 'Madhya Pradesh',
    area: 4.0,
    status: 'Rejected',
    documentName: 'FRA_Rejection_003.pdf',
    soilType: 'Laterite',
    waterAvailability: 'Low',
    estimatedCropValue: 5000,
    geometry: {
      type: "Polygon",
      coordinates: [[[80.80,23.00],[80.81,23.00],[80.81,23.01],[80.80,23.01],[80.80,23.00]]]
    },
    created_at: '2023-03-10T00:00:00.000Z'
  },
  {
    id: 'mp-claim-004',
    holderName: 'Priya Singh',
    village: 'Jabalpur',
    district: 'Jabalpur',
    state: 'Madhya Pradesh',
    area: 1.8,
    status: 'Approved',
    documentName: 'FRA_Patta_004.pdf',
    soilType: 'Clay',
    waterAvailability: 'High',
    estimatedCropValue: 18000,
    geometry: {
      type: "Polygon",
      coordinates: [[[79.90,23.15],[79.91,23.15],[79.91,23.16],[79.90,23.16],[79.90,23.15]]]
    },
    created_at: '2023-04-01T00:00:00.000Z'
  },
  {
    id: 'mp-claim-005',
    holderName: 'Vijay Kumar',
    village: 'Seoni',
    district: 'Seoni',
    state: 'Madhya Pradesh',
    area: 2.9,
    status: 'Pending',
    documentName: 'FRA_Application_005.pdf',
    soilType: 'Alluvial',
    waterAvailability: 'Medium',
    estimatedCropValue: 12000,
    geometry: {
      type: "Polygon",
      coordinates: [[[79.50,22.00],[79.51,22.00],[79.51,22.01],[79.50,22.01],[79.50,22.00]]]
    },
    created_at: '2023-05-05T00:00:00.000Z'
  },
  {
    id: 'mp-claim-006',
    holderName: 'Suresh Murmu',
    village: 'Balaghat',
    district: 'Balaghat',
    state: 'Madhya Pradesh',
    area: 5.2,
    status: 'Approved',
    documentName: 'FRA_Patta_006.pdf',
    soilType: 'Loamy',
    waterAvailability: 'High',
    estimatedCropValue: 22000,
    geometry: {
      type: "Polygon",
      coordinates: [[[80.20,21.80],[80.21,21.80],[80.21,21.81],[80.20,21.81],[80.20,21.80]]]
    },
    created_at: '2023-06-12T00:00:00.000Z'
  },
  {
    id: 'mp-claim-007',
    holderName: 'Geeta Devi',
    village: 'Chhindwara',
    district: 'Chhindwara',
    state: 'Madhya Pradesh',
    area: 1.5,
    status: 'Rejected',
    documentName: 'FRA_Rejection_007.pdf',
    soilType: 'Clay',
    waterAvailability: 'Low',
    estimatedCropValue: 6000,
    geometry: {
      type: "Polygon",
      coordinates: [[[78.90,22.05],[78.91,22.05],[78.91,22.06],[78.90,22.06],[78.90,22.05]]]
    },
    created_at: '2023-07-01T00:00:00.000Z'
  },
  {
    id: 'mp-claim-008',
    holderName: 'Rajesh Soren',
    village: 'Betul',
    district: 'Betul',
    state: 'Madhya Pradesh',
    area: 3.0,
    status: 'Pending',
    documentName: 'FRA_Application_008.pdf',
    soilType: 'Loamy',
    waterAvailability: 'Medium',
    estimatedCropValue: 13500,
    geometry: {
      type: "Polygon",
      coordinates: [[[77.90,21.90],[77.91,21.90],[77.91,21.91],[77.90,21.91],[77.90,21.90]]]
    },
    created_at: '2023-08-18T00:00:00.000Z'
  },
  {
    id: 'mp-claim-009',
    holderName: 'Kiran Baiga',
    village: 'Anuppur',
    district: 'Anuppur',
    state: 'Madhya Pradesh',
    area: 2.5,
    status: 'Approved',
    documentName: 'FRA_Patta_009.pdf',
    soilType: 'Laterite',
    waterAvailability: 'Low',
    estimatedCropValue: 9000,
    geometry: {
      type: "Polygon",
      coordinates: [[[81.70,23.10],[81.71,23.10],[81.71,23.11],[81.70,23.11],[81.70,23.10]]]
    },
    created_at: '2023-09-03T00:00:00.000Z'
  },
  {
    id: 'mp-claim-010',
    holderName: 'Prakash Yadav',
    village: 'Shahdol',
    district: 'Shahdol',
    state: 'Madhya Pradesh',
    area: 3.8,
    status: 'Approved',
    documentName: 'FRA_Patta_010.pdf',
    soilType: 'Alluvial',
    waterAvailability: 'High',
    estimatedCropValue: 19500,
    geometry: {
      type: "Polygon",
      coordinates: [[[81.30,23.30],[81.31,23.30],[81.31,23.31],[81.30,23.31],[81.30,23.30]]]
    },
    created_at: '2023-10-25T00:00:00.000Z'
  },
  {
    id: 'od-claim-001',
    holderName: 'Manoj Kumar',
    village: 'Koraput',
    district: 'Koraput',
    state: 'Odisha',
    area: 4.2,
    status: 'Approved',
    documentName: 'FRA_Patta_O01.pdf',
    soilType: 'Alluvial',
    waterAvailability: 'High',
    estimatedCropValue: 17000,
    geometry: {
      type: "Polygon",
      coordinates: [[[82.70,18.80],[82.71,18.80],[82.71,18.81],[82.70,18.81],[82.70,18.80]]]
    },
    created_at: '2023-01-20T00:00:00.000Z'
  },
  {
    id: 'od-claim-002',
    holderName: 'Sushila Devi',
    village: 'Rayagada',
    district: 'Rayagada',
    state: 'Odisha',
    area: 2.8,
    status: 'Pending',
    documentName: 'FRA_Application_O02.pdf',
    soilType: 'Laterite',
    waterAvailability: 'Medium',
    estimatedCropValue: 11000,
    geometry: {
      type: "Polygon",
      coordinates: [[[83.40,19.20],[83.41,19.20],[83.41,19.21],[83.40,19.21],[83.40,19.20]]]
    },
    created_at: '2023-02-25T00:00:00.000Z'
  },
  {
    id: 'od-claim-003',
    holderName: 'Babu Rao',
    village: 'Gajapati',
    district: 'Gajapati',
    state: 'Odisha',
    area: 1.9,
    status: 'Approved',
    documentName: 'FRA_Patta_O03.pdf',
    soilType: 'Clay',
    waterAvailability: 'High',
    estimatedCropValue: 16000,
    geometry: {
      type: "Polygon",
      coordinates: [[[84.20,18.90],[84.21,18.90],[84.21,18.91],[84.20,18.91],[84.20,18.90]]]
    },
    created_at: '2023-03-15T00:00:00.000Z'
  },
  {
    id: 'od-claim-004',
    holderName: 'Laxmi Soren',
    village: 'Mayurbhanj',
    district: 'Mayurbhanj',
    state: 'Odisha',
    area: 3.1,
    status: 'Rejected',
    documentName: 'FRA_Rejection_O04.pdf',
    soilType: 'Loamy',
    waterAvailability: 'Low',
    estimatedCropValue: 7000,
    geometry: {
      type: "Polygon",
      coordinates: [[[86.50,21.90],[86.51,21.90],[86.51,21.91],[86.50,21.91],[86.50,21.90]]]
    },
    created_at: '2023-04-05T00:00:00.000Z'
  },
  {
    id: 'od-claim-005',
    holderName: 'Gopal Das',
    village: 'Kandhamal',
    district: 'Kandhamal',
    state: 'Odisha',
    area: 2.3,
    status: 'Pending',
    documentName: 'FRA_Application_O05.pdf',
    soilType: 'Alluvial',
    waterAvailability: 'Medium',
    estimatedCropValue: 9500,
    geometry: {
      type: "Polygon",
      coordinates: [[[84.00,20.50],[84.01,20.50],[84.01,20.51],[84.00,20.51],[84.00,20.50]]]
    },
    created_at: '2023-05-10T00:00:00.000Z'
  },
  {
    id: 'od-claim-006',
    holderName: 'Parvati Gond',
    village: 'Nabarangpur',
    district: 'Nabarangpur',
    state: 'Odisha',
    area: 4.8,
    status: 'Approved',
    documentName: 'FRA_Patta_O06.pdf',
    soilType: 'Laterite',
    waterAvailability: 'High',
    estimatedCropValue: 20000,
    geometry: {
      type: "Polygon",
      coordinates: [[[82.50,19.00],[82.51,19.00],[82.51,19.01],[82.50,19.01],[82.50,19.00]]]
    },
    created_at: '2023-06-17T00:00:00.000Z'
  },
  {
    id: 'od-claim-007',
    holderName: 'Raju Bhil',
    village: 'Malkangiri',
    district: 'Malkangiri',
    state: 'Odisha',
    area: 1.2,
    status: 'Rejected',
    documentName: 'FRA_Rejection_O07.pdf',
    soilType: 'Clay',
    waterAvailability: 'Low',
    estimatedCropValue: 4500,
    geometry: {
      type: "Polygon",
      coordinates: [[[81.80,18.30],[81.81,18.30],[81.81,18.31],[81.80,18.31],[81.80,18.30]]]
    },
    created_at: '2023-07-06T00:00:00.000Z'
  },
  {
    id: 'od-claim-008',
    holderName: 'Santosh Kumar',
    village: 'Sambalpur',
    district: 'Sambalpur',
    state: 'Odisha',
    area: 3.3,
    status: 'Pending',
    documentName: 'FRA_Application_O08.pdf',
    soilType: 'Laterite',
    waterAvailability: 'Medium',
    estimatedCropValue: 14000,
    geometry: {
      type: "Polygon",
      coordinates: [[[83.90,21.40],[83.91,21.40],[83.91,21.41],[83.90,21.41],[83.90,21.40]]]
    },
    created_at: '2023-08-23T00:00:00.000Z'
  },
  {
    id: 'od-claim-009',
    holderName: 'Deepak Majhi',
    village: 'Keonjhar',
    district: 'Keonjhar',
    state: 'Odisha',
    area: 2.7,
    status: 'Approved',
    documentName: 'FRA_Patta_O09.pdf',
    soilType: 'Alluvial',
    waterAvailability: 'High',
    estimatedCropValue: 18500,
    geometry: {
      type: "Polygon",
      coordinates: [[[85.60,21.70],[85.61,21.70],[85.61,21.71],[85.60,21.71],[85.60,21.70]]]
    },
    created_at: '2023-09-08T00:00:00.000Z'
  },
  {
    id: 'od-claim-010',
    holderName: 'Anita Devi',
    village: 'Bhadrak',
    district: 'Bhadrak',
    state: 'Odisha',
    area: 3.0,
    status: 'Pending',
    documentName: 'FRA_Application_O10.pdf',
    soilType: 'Loamy',
    waterAvailability: 'Medium',
    estimatedCropValue: 11500,
    geometry: {
      type: "Polygon",
      coordinates: [[[86.50,20.90],[86.51,20.90],[86.51,20.91],[86.50,20.91],[86.50,20.90]]]
    },
    created_at: '2023-10-30T00:00:00.000Z'
  }
];