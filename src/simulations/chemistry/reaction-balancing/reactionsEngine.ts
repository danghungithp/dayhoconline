import { ReactionDefinition, BalancingAnalysis } from './types';

// Khối lượng mol nguyên tử cơ bản
export const ATOM_MASSES: Record<string, number> = {
  H: 1,
  O: 16,
  N: 14,
  C: 12,
  Fe: 56,
  Cl: 35.5,
  Al: 27,
};

export const REACTIONS_DATA: ReactionDefinition[] = [
  {
    id: 'h2-o2-water',
    nameVi: 'Đốt cháy khí Hiđro tạo Nước (H₂ + O₂ ➔ H₂O)',
    reactants: [
      { formula: 'H₂', atoms: { H: 2 }, defaultCoeff: 1, correctCoeff: 2 },
      { formula: 'O₂', atoms: { O: 2 }, defaultCoeff: 1, correctCoeff: 1 },
    ],
    products: [
      { formula: 'H₂O', atoms: { H: 2, O: 1 }, defaultCoeff: 1, correctCoeff: 2 },
    ],
  },
  {
    id: 'n2-h2-ammonia',
    nameVi: 'Tổng hợp khí Amoniac (N₂ + H₂ ➔ NH₃)',
    reactants: [
      { formula: 'N₂', atoms: { N: 2 }, defaultCoeff: 1, correctCoeff: 1 },
      { formula: 'H₂', atoms: { H: 2 }, defaultCoeff: 1, correctCoeff: 3 },
    ],
    products: [
      { formula: 'NH₃', atoms: { N: 1, H: 3 }, defaultCoeff: 1, correctCoeff: 2 },
    ],
  },
  {
    id: 'ch4-o2-combustion',
    nameVi: 'Đốt cháy khí Mê-tan (CH₄ + O₂ ➔ CO₂ + H₂O)',
    reactants: [
      { formula: 'CH₄', atoms: { C: 1, H: 4 }, defaultCoeff: 1, correctCoeff: 1 },
      { formula: 'O₂', atoms: { O: 2 }, defaultCoeff: 1, correctCoeff: 2 },
    ],
    products: [
      { formula: 'CO₂', atoms: { C: 1, O: 2 }, defaultCoeff: 1, correctCoeff: 1 },
      { formula: 'H₂O', atoms: { H: 2, O: 1 }, defaultCoeff: 1, correctCoeff: 2 },
    ],
  },
  {
    id: 'al-hcl-salt',
    nameVi: 'Nhôm tác dụng Axit clohiđric (Al + HCl ➔ AlCl₃ + H₂)',
    reactants: [
      { formula: 'Al', atoms: { Al: 1 }, defaultCoeff: 1, correctCoeff: 2 },
      { formula: 'HCl', atoms: { H: 1, Cl: 1 }, defaultCoeff: 1, correctCoeff: 6 },
    ],
    products: [
      { formula: 'AlCl₃', atoms: { Al: 1, Cl: 3 }, defaultCoeff: 1, correctCoeff: 2 },
      { formula: 'H₂', atoms: { H: 2 }, defaultCoeff: 1, correctCoeff: 3 },
    ],
  },
];

export function analyzeBalancing(
  reaction: ReactionDefinition,
  coeffs: number[]
): BalancingAnalysis {
  const numReactants = reaction.reactants.length;
  const leftCoeffs = coeffs.slice(0, numReactants);
  const rightCoeffs = coeffs.slice(numReactants);

  const leftAtoms: Record<string, number> = {};
  const rightAtoms: Record<string, number> = {};

  let leftMass = 0;
  let rightMass = 0;

  // Tính số nguyên tử và khối lượng vế trái
  reaction.reactants.forEach((r, idx) => {
    const c = leftCoeffs[idx] || 1;
    let molMass = 0;
    Object.entries(r.atoms).forEach(([el, cnt]) => {
      leftAtoms[el] = (leftAtoms[el] || 0) + cnt * c;
      molMass += (ATOM_MASSES[el] || 10) * cnt;
    });
    leftMass += molMass * c;
  });

  // Tính số nguyên tử và khối lượng vế phải
  reaction.products.forEach((p, idx) => {
    const c = rightCoeffs[idx] || 1;
    let molMass = 0;
    Object.entries(p.atoms).forEach(([el, cnt]) => {
      rightAtoms[el] = (rightAtoms[el] || 0) + cnt * c;
      molMass += (ATOM_MASSES[el] || 10) * cnt;
    });
    rightMass += molMass * c;
  });

  // Kiểm tra từng nguyên tố
  const allElements = Array.from(new Set([...Object.keys(leftAtoms), ...Object.keys(rightAtoms)]));
  const atomStatus: Record<string, boolean> = {};
  let isBalanced = true;

  allElements.forEach(el => {
    const l = leftAtoms[el] || 0;
    const r = rightAtoms[el] || 0;
    const ok = l > 0 && l === r;
    atomStatus[el] = ok;
    if (!ok) isBalanced = false;
  });

  return {
    isBalanced,
    leftAtoms,
    rightAtoms,
    atomStatus,
    leftMass,
    rightMass,
  };
}
