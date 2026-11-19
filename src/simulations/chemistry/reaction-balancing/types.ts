export interface ReactionDefinition {
  id: string;
  nameVi: string;
  reactants: { formula: string; atoms: Record<string, number>; defaultCoeff: number; correctCoeff: number }[];
  products: { formula: string; atoms: Record<string, number>; defaultCoeff: number; correctCoeff: number }[];
}

export interface ReactionBalancingState {
  reactionId: string;
  coeffs: number[]; // Mảng các hệ số hiện tại do học sinh chỉnh
  showAtomCounts: boolean;
  showMassBalance: boolean;
}

export interface BalancingAnalysis {
  isBalanced: boolean;
  leftAtoms: Record<string, number>;
  rightAtoms: Record<string, number>;
  atomStatus: Record<string, boolean>; // true nếu nguyên tố đó đã cân bằng 2 vế
  leftMass: number;
  rightMass: number;
}
