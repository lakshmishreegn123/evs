export type DeviceType = 
  | 'smartphone' 
  | 'laptop' 
  | 'charger' 
  | 'earphones' 
  | 'tv' 
  | 'tablet' 
  | 'battery' 
  | 'accessories';

export type DeviceCondition = 'working' | 'repairable' | 'broken';

export type DeviceLabel = 'Keep / Reuse' | 'Repair' | 'Recycle';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  yearBought: number;
  condition: DeviceCondition;
  pin: string;
  brand?: string;
  notes?: string;
  label: DeviceLabel;
  recycled?: boolean;
  createdAt: string;
}

export interface MetalImpact {
  totalWeightKg: number;
  copperG: number;
  goldMg: number;
  silverMg: number;
  aluminiumG: number;
  co2SavedKg: number;
  plasticsPreventedKg: number;
}

export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  pin: string;
  phone: string;
  email?: string;
  hours: string;
  type: 'CPCB Authorized Dismantler' | 'KSPCB Collection Center' | 'Authorized E-Waste Recycler' | 'Drop-off Bin';
  lat: number;
  lng: number;
  registrationNo: string;
  acceptedItems: string[];
}
