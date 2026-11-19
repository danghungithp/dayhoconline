export interface ElementInfo {
  atomicNumber: number; // Z = số proton
  symbol: string;
  nameVi: string;
  nameEn: string;
  standardNeutrons: number;
  period: number;
  group: string;
  category: 'Phi kim' | 'Kim loại kiềm' | 'Kim loại kiềm thổ' | 'Kim loại' | 'Khí hiếm' | 'Halogen';
  color: string;
}

export type MoleculeId = 'atom' | 'H2' | 'O2' | 'H2O' | 'CO2' | 'CH4';

export interface AtomBuilderState {
  protons: number;
  neutrons: number;
  electrons: number;
  activeMolecule: MoleculeId;
  viewMode: 'bohr' | 'cloud';
  showOrbits: boolean;
  showLabels: boolean;
  isAnimationPaused: boolean;
}
