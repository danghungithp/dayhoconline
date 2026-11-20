export type MitosisPhase = 'interphase' | 'prophase' | 'metaphase' | 'anaphase' | 'telophase';

export interface Chromosome {
  id: string;
  origin: 'maternal' | 'paternal'; // Mẹ (đỏ) hoặc Cha (xanh)
  length: number;
  angle: number;
  x: number;
  y: number;
}

export interface CellDivisionState {
  phase: MitosisPhase;
  phaseProgress: number; // 0 to 1
  chromosomeCount: 4 | 6; // 2n = 4 hoặc 2n = 6
  isPlaying: boolean;
  speed: number; // 1x, 2x
  showSpindleFibers: boolean;
  showLabels: boolean;
}
