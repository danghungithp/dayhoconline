export type BiologyMode = 'mendel' | 'cell';

export type PlantTrait = 'flower-color' | 'seed-shape' | 'pea-dihybrid';

export interface GeneticsState {
  mode: BiologyMode;
  trait: PlantTrait;
  p1Alleles: [string, string]; // e.g. ['A', 'a']
  p2Alleles: [string, string]; // e.g. ['A', 'a']
  pDihybridP1?: string; // 'AaBb'
  pDihybridP2?: string; // 'AaBb'
  showGenotypes: boolean;
  showPhenotypes: boolean;
  selectedOrganelle?: string; // for cell explorer
  cellZoom: number;
}
