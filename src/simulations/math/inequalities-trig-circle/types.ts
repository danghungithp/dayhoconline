export type SimulationTab = 'unit-circle' | 'inequalities';

export interface LinearInequality {
  id: string;
  a: number; // a*x + b*y <= c
  b: number;
  c: number;
  label: string;
  color: string;
}

export interface UnitCircleState {
  activeTab: SimulationTab;
  // Vòng tròn lượng giác
  angleDeg: number;         // 0 to 360
  angleMode: 'degrees' | 'radians';
  snapToSpecial: boolean;
  showSine: boolean;
  showCosine: boolean;
  showTangent: boolean;
  showCotangent: boolean;

  // Miền nghiệm BPT hai ẩn
  inequalities: LinearInequality[];
  testPoint: { x: number; y: number };
  objectiveA: number; // F(x, y) = objectiveA * x + objectiveB * y
  objectiveB: number;
  showLevelLines: boolean;
}

export interface TrigValues {
  angleDeg: number;
  angleRad: number;
  radLabel: string;
  sin: number;
  cos: number;
  tan: number | null; // null if cos == 0
  cot: number | null; // null if sin == 0
  sinExact: string;
  cosExact: string;
  tanExact: string;
  quadrant: 1 | 2 | 3 | 4 | 'axis';
}

export interface PolygonVertex {
  x: number;
  y: number;
  fValue: number;
  isMax?: boolean;
  isMin?: boolean;
}
