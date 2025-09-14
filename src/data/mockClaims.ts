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
};

export const claims: Claim[] = [
  { id: 'C001', holderName: 'Aarav Sharma', village: 'Ramgarh', district: 'Nagpur', state: 'Maharashtra', area: 5.2, status: 'Approved' },
  { id: 'C002', holderName: 'Saanvi Patel', village: 'Krishnanagar', district: 'Patna', state: 'Bihar', area: 3.1, status: 'Pending' },
  { id: 'C003', holderName: 'Vivaan Singh', village: 'Devipur', district: 'New Delhi', state: 'Delhi', area: 7.8, status: 'Approved' },
  { id: 'C004', holderName: 'Ananya Gupta', village: 'Sitapur', district: 'Mumbai', state: 'Maharashtra', area: 4.5, status: 'Rejected' },
  // Madhya Pradesh
  { id: 'C005', holderName: 'Rakesh Gond', village: 'Patan', district: 'Mandla', state: 'Madhya Pradesh', area: 6.1, status: 'Approved' },
  { id: 'C006', holderName: 'Sunita Baiga', village: 'Dindori', district: 'Dindori', state: 'Madhya Pradesh', area: 4.9, status: 'Pending' },
  { id: 'C007', holderName: 'Mohan Korku', village: 'Chicholi', district: 'Betul', state: 'Madhya Pradesh', area: 8.0, status: 'Approved' },
  { id: 'C008', holderName: 'Gita Pardhan', village: 'Seoni', district: 'Seoni', state: 'Madhya Pradesh', area: 3.5, status: 'Rejected' },
  // Telangana
  { id: 'C009', holderName: 'Laxmi Koya', village: 'Utnoor', district: 'Adilabad', state: 'Telangana', area: 5.5, status: 'Approved' },
  { id: 'C010', holderName: 'Ramulu Chenchu', village: 'Bhadrachalam', district: 'Khammam', state: 'Telangana', area: 7.2, status: 'Pending' },
  { id: 'C011', holderName: 'Padma Naik', village: 'Jannaram', district: 'Mancherial', state: 'Telangana', area: 4.3, status: 'Approved' },
  // Odisha
  { id: 'C012', holderName: 'Jaga Saura', village: 'Gunupur', district: 'Rayagada', state: 'Odisha', area: 6.8, status: 'Pending' },
  { id: 'C013', holderName: 'Sania Juang', village: 'Keonjhar', district: 'Keonjhar', state: 'Odisha', area: 5.1, status: 'Approved' },
  { id: 'C014', holderName: 'Bhima Kondh', village: 'Baliguda', district: 'Kandhamal', state: 'Odisha', area: 9.2, status: 'Rejected' },
];

export const geoJsonData: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { claimId: 'C001', holderName: 'Aarav Sharma' }, geometry: { type: "Polygon", coordinates: [[[78.9629, 20.5937], [79.0629, 20.5937], [79.0629, 20.6937], [78.9629, 20.6937], [78.9629, 20.5937]]] } },
    { type: "Feature", properties: { claimId: 'C002', holderName: 'Saanvi Patel' }, geometry: { type: "Polygon", coordinates: [[[85.3131, 25.6090], [85.4131, 25.6090], [85.4131, 25.7090], [85.3131, 25.7090], [85.3131, 25.6090]]] } },
    { type: "Feature", properties: { claimId: 'C003', holderName: 'Vivaan Singh' }, geometry: { type: "Polygon", coordinates: [[[77.2167, 28.6139], [77.3167, 28.6139], [77.3167, 28.7139], [77.2167, 28.7139], [77.2167, 28.6139]]] } },
    { type: "Feature", properties: { claimId: 'C004', holderName: 'Ananya Gupta' }, geometry: { type: "Polygon", coordinates: [[[72.8777, 19.0760], [72.9777, 19.0760], [72.9777, 19.1760], [72.8777, 19.1760], [72.8777, 19.0760]]] } },
    // Madhya Pradesh
    { type: "Feature", properties: { claimId: 'C005', holderName: 'Rakesh Gond' }, geometry: { type: "Polygon", coordinates: [[[80.38, 22.6], [80.48, 22.6], [80.48, 22.7], [80.38, 22.7], [80.38, 22.6]]] } },
    { type: "Feature", properties: { claimId: 'C006', holderName: 'Sunita Baiga' }, geometry: { type: "Polygon", coordinates: [[[81.08, 22.95], [81.18, 22.95], [81.18, 23.05], [81.08, 23.05], [81.08, 22.95]]] } },
    { type: "Feature", properties: { claimId: 'C007', holderName: 'Mohan Korku' }, geometry: { type: "Polygon", coordinates: [[[77.9, 21.9], [78.0, 21.9], [78.0, 22.0], [77.9, 22.0], [77.9, 21.9]]] } },
    { type: "Feature", properties: { claimId: 'C008', holderName: 'Gita Pardhan' }, geometry: { type: "Polygon", coordinates: [[[79.53, 22.08], [79.63, 22.08], [79.63, 22.18], [79.53, 22.18], [79.53, 22.08]]] } },
    // Telangana
    { type: "Feature", properties: { claimId: 'C009', holderName: 'Laxmi Koya' }, geometry: { type: "Polygon", coordinates: [[[78.53, 19.66], [78.63, 19.66], [78.63, 19.76], [78.53, 19.76], [78.53, 19.66]]] } },
    { type: "Feature", properties: { claimId: 'C010', holderName: 'Ramulu Chenchu' }, geometry: { type: "Polygon", coordinates: [[[80.15, 17.24], [80.25, 17.24], [80.25, 17.34], [80.15, 17.34], [80.15, 17.24]]] } },
    { type: "Feature", properties: { claimId: 'C011', holderName: 'Padma Naik' }, geometry: { type: "Polygon", coordinates: [[[79.45, 18.86], [79.55, 18.86], [79.55, 18.96], [79.45, 18.96], [79.45, 18.86]]] } },
    // Odisha
    { type: "Feature", properties: { claimId: 'C012', holderName: 'Jaga Saura' }, geometry: { type: "Polygon", coordinates: [[[83.42, 19.17], [83.52, 19.17], [83.52, 19.27], [83.42, 19.27], [83.42, 19.17]]] } },
    { type: "Feature", properties: { claimId: 'C013', holderName: 'Sania Juang' }, geometry: { type: "Polygon", coordinates: [[[85.59, 21.63], [85.69, 21.63], [85.69, 21.73], [85.59, 21.73], [85.59, 21.63]]] } },
    { type: "Feature", properties: { claimId: 'C014', holderName: 'Bhima Kondh' }, geometry: { type: "Polygon", coordinates: [[[84.25, 20.5], [84.35, 20.5], [84.35, 20.6], [84.25, 20.6], [84.25, 20.5]]] } },
  ],
};

export const waterBodiesGeoJson: FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: 'Ramgarh Lake' },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [78.98, 20.61], [78.99, 20.62], [78.98, 20.63], [78.97, 20.62], [78.98, 20.61]
            ]
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
                  [85.32, 25.61], [85.33, 25.61], [85.33, 25.62], [85.32, 25.62], [85.32, 25.61]
                ]
              ]
            }
        }
    ]
};