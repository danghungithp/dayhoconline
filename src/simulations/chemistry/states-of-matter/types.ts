export type SubstanceType = 'water' | 'oxygen' | 'argon';
export type StateOfMatter = 'solid' | 'liquid' | 'gas';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
}

export interface StatesOfMatterState {
  substance: SubstanceType;
  temperatureC: number; // -100°C đến 250°C
  pistonHeight: number; // 0.4 đến 1.0 (thể tích bình)
  isHeating: boolean;
  isCooling: boolean;
  showThermometer: boolean;
  showPressureGauge: boolean;
}

export interface MatterCalculations {
  temperatureK: number;
  stateOfMatter: StateOfMatter;
  stateNameVi: string;
  stateNameEn: string;
  pressureAtm: number;
  meltingPointC: number;
  boilingPointC: number;
  averageSpeed: number; // m/s mô phỏng
}
