import type { Geometry } from 'geojson';

export type ClaimStatus = 'Approved' | 'Pending' | 'Rejected';
export type SoilType = 'Alluvial' | 'Clay' | 'Loamy' | 'Laterite';
export type WaterAvailability = 'High' | 'Medium' | 'Low';

export type Claim = {
  id: string; // Corresponds to 'claim_id' in Supabase
  holderName: string;
  village: string;
  district: string;
  state: string;
  area: number;
  status: ClaimStatus;
  documentName?: string;
  soilType: SoilType;
  waterAvailability: WaterAvailability;
  estimatedCropValue: number; // in INR
  geometry?: Geometry;
};