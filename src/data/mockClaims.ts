import { FeatureCollection } from 'geojson';

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
};

export const claims: Claim[] = [
  // --- Madhya Pradesh ---
  { id: 'C005', holderName: 'Rakesh Gond', village: 'Patan', district: 'Mandla', state: 'Madhya Pradesh', area: 6.1, status: 'Approved', soilType: 'Clay', waterAvailability: 'Medium' },
  { id: 'C006', holderName: 'Sunita Baiga', village: 'Bajag', district: 'Dindori', state: 'Madhya Pradesh', area: 4.9, status: 'Pending', soilType: 'Loamy', waterAvailability: 'Low' },
  { id: 'C007', holderName: 'Mohan Korku', village: 'Chicholi', district: 'Betul', state: 'Madhya Pradesh', area: 8.0, status: 'Approved', soilType: 'Clay', waterAvailability: 'Medium' },
  { id: 'C008', holderName: 'Gita Pardhan', village: 'Kurai', district: 'Seoni', state: 'Madhya Pradesh', area: 3.5, status: 'Rejected', soilType: 'Laterite', waterAvailability: 'Low' },
  { id: 'C015', holderName: 'Anil Bhil', village: 'Katthiwada', district: 'Alirajpur', state: 'Madhya Pradesh', area: 5.8, status: 'Approved', soilType: 'Loamy', waterAvailability: 'Medium' },
  { id: 'C016', holderName: 'Meera Kol', village: 'Jaisinghnagar', district: 'Shahdol', state: 'Madhya Pradesh', area: 4.2, status: 'Pending', soilType: 'Clay', waterAvailability: 'High' },
  { id: 'C017', holderName: 'Suresh Sahariya', village: 'Pohri', district: 'Shivpuri', state: 'Madhya Pradesh', area: 7.5, status: 'Approved', soilType: 'Alluvial', waterAvailability: 'Medium' },

  // --- Odisha ---
  { id: 'C012', holderName: 'Jaga Saura', village: 'Gunupur', district: 'Rayagada', state: 'Odisha', area: 6.8, status: 'Pending', soilType: 'Laterite', waterAvailability: 'High' },
  { id: 'C013', holderName: 'Sania Juang', village: 'Harichandanpur', district: 'Keonjhar', state: 'Odisha', area: 5.1, status: 'Approved', soilType: 'Alluvial', waterAvailability: 'High' },
  { id: 'C014', holderName: 'Bhima Kondh', village: 'Baliguda', district: 'Kandhamal', state: 'Odisha', area: 9.2, status: 'Rejected', soilType: 'Loamy', waterAvailability: 'Medium' },
  { id: 'C018', holderName: 'Laxman Munda', village: 'Jashipur', district: 'Mayurbhanj', state: 'Odisha', area: 4.7, status: 'Approved', soilType: 'Laterite', waterAvailability: 'Medium' },
  { id: 'C019', holderName: 'Tulasi Paraja', village: 'Lamtaput', district: 'Koraput', state: 'Odisha', area: 3.9, status: 'Pending', soilType: 'Clay', waterAvailability: 'High' },
  { id: 'C020', holderName: 'Ramesh Bonda', village: 'Khairput', district: 'Malkangiri', state: 'Odisha', area: 6.5, status: 'Approved', soilType: 'Loamy', waterAvailability: 'Low' },
  { id: 'C021', holderName: 'Sarita Santal', village: 'Thakurmunda', district: 'Mayurbhanj', state: 'Odisha', area: 5.5, status: 'Rejected', soilType: 'Alluvial', waterAvailability: 'High' },
];

export const geoJsonData: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    // --- Madhya Pradesh ---
    { type: "Feature", properties: { claimId: 'C005', holderName: 'Rakesh Gond' }, geometry: { type: "Polygon", coordinates: [[[80.38, 22.6], [80.48, 22.6], [80.48, 22.7], [80.38, 22.7], [80.38, 22.6]]] } },
    { type: "Feature", properties: { claimId: 'C006', holderName: 'Sunita Baiga' }, geometry: { type: "Polygon", coordinates: [[[81.08, 22.95], [81.18, 22.95], [81.18, 23.05], [81.08, 23.05], [81.08, 22.95]]] } },
    { type: "Feature", properties: { claimId: 'C007', holderName: 'Mohan Korku' }, geometry: { type: "Polygon", coordinates: [[[77.9, 21.9], [78.0, 21.9], [78.0, 22.0], [77.9, 22.0], [77.9, 21.9]]] } },
    { type: "Feature", properties: { claimId: 'C008', holderName: 'Gita Pardhan' }, geometry: { type: "Polygon", coordinates: [[[79.53, 22.08], [79.63, 22.08], [79.63, 22.18], [79.53, 22.18], [79.53, 22.08]]] } },
    { type: "Feature", properties: { claimId: 'C015', holderName: 'Anil Bhil' }, geometry: { type: "Polygon", coordinates: [[[74.35, 22.3], [74.45, 22.3], [74.45, 22.4], [74.35, 22.4], [74.35, 22.3]]] } },
    { type: "Feature", properties: { claimId: 'C016', holderName: 'Meera Kol' }, geometry: { type: "Polygon", coordinates: [[[81.36, 23.19], [81.46, 23.19], [81.46, 23.29], [81.36, 23.29], [81.36, 23.19]]] } },
    { type: "Feature", properties: { claimId: 'C017', holderName: 'Suresh Sahariya' }, geometry: { type: "Polygon", coordinates: [[[77.21, 25.43], [77.31, 25.43], [77.31, 25.53], [77.21, 25.53], [77.21, 25.43]]] } },

    // --- Odisha ---
    { type: "Feature", properties: { claimId: 'C012', holderName: 'Jaga Saura' }, geometry: { type: "Polygon", coordinates: [[[83.42, 19.17], [83.52, 19.17], [83.52, 19.27], [83.42, 19.27], [83.42, 19.17]]] } },
    { type: "Feature", properties: { claimId: 'C013', holderName: 'Sania Juang' }, geometry: { type: "Polygon", coordinates: [[[85.59, 21.63], [85.69, 21.63], [85.69, 21.73], [85.59, 21.73], [85.59, 21.63]]] } },
    { type: "Feature", properties: { claimId: 'C014', holderName: 'Bhima Kondh' }, geometry: { type: "Polygon", coordinates: [[[84.25, 20.5], [84.35, 20.5], [84.35, 20.6], [84.25, 20.6], [84.25, 20.5]]] } },
    { type: "Feature", properties: { claimId: 'C018', holderName: 'Laxman Munda' }, geometry: { type: "Polygon", coordinates: [[[86.17, 21.84], [86.27, 21.84], [86.27, 21.94], [86.17, 21.94], [86.17, 21.84]]] } },
    { type: "Feature", properties: { claimId: 'C019', holderName: 'Tulasi Paraja' }, geometry: { type: "Polygon", coordinates: [[[82.51, 18.35], [82.61, 18.35], [82.61, 18.45], [82.51, 18.45], [82.51, 18.35]]] } },
    { type: "Feature", properties: { claimId: 'C020', holderName: 'Ramesh Bonda' }, geometry: { type: "Polygon", coordinates: [[[82.05, 18.18], [82.15, 18.18], [82.15, 18.28], [82.05, 18.28], [82.05, 18.18]]] } },
    { type: "Feature", properties: { claimId: 'C021', holderName: 'Sarita Santal' }, geometry: { type: "Polygon", coordinates: [[[86.73, 21.72], [86.83, 21.72], [86.83, 21.82], [86.73, 21.82], [86.73, 21.72]]] } },
  ],
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
              [77.95, 22.55], [78.05, 22.50], [78.00, 22.60], [77.90, 22.60], [77.95, 22.55]
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
             [82.20, 19.05], [82.35, 19.10], [82.50, 19.08]
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
                  [85.60, 21.65], [85.62, 21.65], [85.62, 21.67], [85.60, 21.67], [85.60, 21.65]
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
                  [79.55, 22.10], [79.58, 22.10], [79.58, 22.13], [79.55, 22.13], [79.55, 22.10]
                ]
              ]
            }
        }
    ]
};