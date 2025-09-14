import { FeatureCollection } from 'geojson';

export type Claim = {
  id: string;
  holderName: string;
  village: string;
  district: string;
  state: string;
  area: number;
  status: 'Approved' | 'Pending' | 'Rejected';
};

export const claims: Claim[] = [
  { id: 'C001', holderName: 'Aarav Sharma', village: 'Ramgarh', district: 'Nagpur', state: 'Maharashtra', area: 5.2, status: 'Approved' },
  { id: 'C002', holderName: 'Saanvi Patel', village: 'Krishnanagar', district: 'Patna', state: 'Bihar', area: 3.1, status: 'Pending' },
  { id: 'C003', holderName: 'Vivaan Singh', village: 'Devipur', district: 'New Delhi', state: 'Delhi', area: 7.8, status: 'Approved' },
  { id: 'C004', holderName: 'Ananya Gupta', village: 'Sitapur', district: 'Mumbai', state: 'Maharashtra', area: 4.5, status: 'Rejected' },
];

export const geoJsonData: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { claimId: 'C001', holderName: 'Aarav Sharma' },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.9629, 20.5937],
            [79.0629, 20.5937],
            [79.0629, 20.6937],
            [78.9629, 20.6937],
            [78.9629, 20.5937],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { claimId: 'C002', holderName: 'Saanvi Patel' },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [85.3131, 25.6090],
            [85.4131, 25.6090],
            [85.4131, 25.7090],
            [85.3131, 25.7090],
            [85.3131, 25.6090],
          ],
        ],
      },
    },
    {
        type: "Feature",
        properties: { claimId: 'C003', holderName: 'Vivaan Singh' },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [77.2167, 28.6139],
              [77.3167, 28.6139],
              [77.3167, 28.7139],
              [77.2167, 28.7139],
              [77.2167, 28.6139],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { claimId: 'C004', holderName: 'Ananya Gupta' },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [72.8777, 19.0760],
              [72.9777, 19.0760],
              [72.9777, 19.1760],
              [72.8777, 19.1760],
              [72.8777, 19.0760],
            ],
          ],
        },
      },
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