export type OrbitalType = '1s' | '2s' | '2px' | '2py' | '2pz' | '3d';
export type LabViewMode = 'orbital-3d' | 'electron-boxes' | 'chemical-bonding';

export type BondType = 'covalent-sigma' | 'covalent-pi' | 'ionic-nacl';

export interface ElectronBox {
  subshell: string; // '1s', '2s', '2p', '3s', '3p', '4s', '3d'
  energyLevel: number;
  capacity: number; // 1 box for s, 3 boxes for p, 5 boxes for d
  electrons: ('up' | 'down')[][]; // each box can have [] or ['up'] or ['up', 'down']
}

export interface OrbitalsBondingState {
  viewMode: LabViewMode;

  // Orbital 3D View
  selectedOrbital: OrbitalType;
  showAxes: boolean;
  cloudDensity: number; // 0.5 to 2.0
  rotationAngleX: number;
  rotationAngleY: number;

  // Electron Boxes View (Cấu hình electron & Ô lượng tử)
  atomicNumberZ: number; // 1 to 26 (H to Fe)
  autoFillAufbau: boolean;

  // Chemical Bonding View
  selectedBond: BondType;
  internuclearDistance: number; // pm (picometers)
  showOverlapCloud: boolean;
}
