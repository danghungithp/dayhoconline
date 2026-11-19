export type BuoyancyOpticsTab = 'buoyancy' | 'lens';

export type LiquidType = 'water' | 'saltwater' | 'oil';
export type BlockMaterial = 'wood' | 'plastic' | 'aluminum' | 'iron';

export interface BuoyancyOpticsState {
  activeTab: BuoyancyOpticsTab;

  // Lực đẩy Ác-si-mét
  liquidType: LiquidType;
  material: BlockMaterial;
  blockVolumeLiters: number; // 1 đến 5 lít

  // Thấu kính hội tụ
  focalLengthCm: number; // f (10 đến 30 cm)
  objectDistanceCm: number; // d (5 đến 60 cm)
  objectHeightCm: number; // h (2 đến 10 cm)
  showSpecialRays: boolean;
}

export interface BuoyancyCalculations {
  liquidDensity: number; // kg/m^3
  materialDensity: number; // kg/m^3
  massKg: number;
  weightN: number;
  submergedVolumeLiters: number;
  buoyantForceN: number;
  state: 'floating' | 'suspended' | 'sinking';
  stateVi: string;
}

export interface LensCalculations {
  imageDistanceCm: number; // d' (âm nếu là ảnh ảo)
  imageHeightCm: number;   // h'
  isReal: boolean;
  isInverted: boolean;
  magnification: number;   // k = |d'/d|
  imageTypeVi: string;
}
