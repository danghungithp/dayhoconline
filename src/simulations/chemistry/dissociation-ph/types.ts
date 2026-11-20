export type PhLabMode = 'ph-scale' | 'titration';

export interface SolutionPreset {
  id: string;
  nameVi: string;
  nameEn: string;
  type: 'acid' | 'neutral' | 'base';
  basePh: number;
  description: string;
}

export interface DissociationPhState {
  mode: PhLabMode;
  // pH scale mode
  selectedSolutionId: string;
  solutionVolumeMl: number; // 100 to 1000 mL
  waterAddedMl: number; // 0 to 800 mL
  dippedIndicator: 'none' | 'litmus-paper' | 'ph-probe';
  showIonParticles: boolean;

  // Titration mode
  acidConcentration: number; // M (0.05 to 0.5 M, default 0.1 M)
  acidVolumeMl: number; // 25 mL fixed
  baseConcentration: number; // M (0.1 M fixed)
  buretBaseVolumeMl: number; // 0 to 50 mL added
  isDripping: boolean;
  indicatorType: 'phenolphthalein' | 'methyl-orange';
}
