export type Geometry6Mode = 'angles' | 'axis-symmetry' | 'center-symmetry';
export type SymmetryShape = 'butterfly' | 'heart' | 'letter-A' | 'pinwheel' | 'letter-S';

export interface AnglesSymmetryState {
  mode: Geometry6Mode;

  // Góc
  angleDeg: number; // 0 đến 360
  showProtractor: boolean;
  showAngleArc: boolean;

  // Tính đối xứng
  symmetryShape: SymmetryShape;
  foldProgress: number; // 0 (mở) đến 1.0 (gấp khít hoàn toàn)
  rotationAngleDeg: number; // 0 đến 180 (cho tâm đối xứng)
}

export interface AngleClassification {
  type: 'zero' | 'acute' | 'right' | 'obtuse' | 'straight' | 'reflex' | 'full';
  nameVi: string;
  nameEn: string;
  descriptionVi: string;
}
