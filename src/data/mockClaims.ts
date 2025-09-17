import { FeatureCollection, Geometry } from 'geojson';

export type Claim = {
  dbId: string; // The actual UUID primary key from Supabase
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