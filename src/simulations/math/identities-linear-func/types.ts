export type IdentityType = 'square-sum' | 'square-diff' | 'diff-squares';

export type SimulationTab = 'identities' | 'linear-func' | 'two-lines';

export interface IdentitiesState {
  activeTab: SimulationTab;
  // Hằng đẳng thức
  identityType: IdentityType;
  paramA: number; // 1 to 10
  paramB: number; // 1 to 10 (paramB < paramA for differences)
  showLabels: boolean;
  unfoldProgress: number; // 0 to 1 (for rearranging a^2 - b^2)

  // Hàm số bậc nhất d1: y = a1*x + b1
  slope1: number;       // a1 (-5 to 5, step 0.5)
  intercept1: number;   // b1 (-10 to 10, step 1)
  showSlopeTriangle: boolean;
  showInterceptPoints: boolean;

  // Đường thẳng d2: y = a2*x + b2
  slope2: number;       // a2 (-5 to 5, step 0.5)
  intercept2: number;   // b2 (-10 to 10, step 1)
}

export interface IdentityBreakdown {
  type: IdentityType;
  formula: string;
  expandedFormula: string;
  totalArea: number;
  components: {
    label: string;
    width: number;
    height: number;
    area: number;
    color: string;
    description: string;
  }[];
}

export interface LinearFuncAnalysis {
  slope: number;
  intercept: number;
  rootX: number | null; // Intercept with Ox (-b/a)
  interceptY: number;   // Intercept with Oy (b)
  angleDeg: number;     // arctan(a) in degrees
  monotonicity: 'increasing' | 'decreasing' | 'constant';
  formulaText: string;
}

export interface TwoLinesRelation {
  status: 'parallel' | 'coincident' | 'perpendicular' | 'intersecting';
  statusVi: string;
  statusEn: string;
  intersectionPoint: { x: number; y: number } | null;
  explanation: string;
}
