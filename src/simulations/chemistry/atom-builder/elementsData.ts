export interface ElementInfo {
  z: number;
  symbol: string;
  nameVi: string;
  nameEn: string;
  defaultNeutrons: number;
  stableMasses: number[];
  radioactiveMasses: number[];
  period: number;
  group: string;
  color: string;
}

export interface MoleculePreset {
  formula: string;
  nameVi: string;
  bondType: 'Cộng hóa trị phân cực' | 'Cộng hóa trị không cực' | 'Liên kết ion';
  descriptionVi: string;
  requiredAtoms: Record<string, number>; // VD: { H: 2, O: 1 }
  atomsVisual: { symbol: string; x: number; y: number; color: string; valenceElectrons: number }[];
  bondsVisual: {
    fromIndex: number;
    toIndex: number;
    order: 1 | 2 | 3;
    sharedOrTransferred: 'shared' | 'transferred';
  }[];
}

export const ELEMENTS_DATA: ElementInfo[] = [
  { z: 1, symbol: 'H', nameVi: 'Hiđrô', nameEn: 'Hydrogen', defaultNeutrons: 0, stableMasses: [1, 2], radioactiveMasses: [3], period: 1, group: 'IA', color: '#38bdf8' },
  { z: 2, symbol: 'He', nameVi: 'Hêli', nameEn: 'Helium', defaultNeutrons: 2, stableMasses: [3, 4], radioactiveMasses: [], period: 1, group: 'VIIIA', color: '#818cf8' },
  { z: 3, symbol: 'Li', nameVi: 'Liti', nameEn: 'Lithium', defaultNeutrons: 4, stableMasses: [6, 7], radioactiveMasses: [8], period: 2, group: 'IA', color: '#f87171' },
  { z: 4, symbol: 'Be', nameVi: 'Berili', nameEn: 'Beryllium', defaultNeutrons: 5, stableMasses: [9], radioactiveMasses: [7, 10], period: 2, group: 'IIA', color: '#fb923c' },
  { z: 5, symbol: 'B', nameVi: 'Bo', nameEn: 'Boron', defaultNeutrons: 6, stableMasses: [10, 11], radioactiveMasses: [8, 12], period: 2, group: 'IIIA', color: '#fbbf24' },
  { z: 6, symbol: 'C', nameVi: 'Cacbon', nameEn: 'Carbon', defaultNeutrons: 6, stableMasses: [12, 13], radioactiveMasses: [14], period: 2, group: 'IVA', color: '#475569' },
  { z: 7, symbol: 'N', nameVi: 'Nitơ', nameEn: 'Nitrogen', defaultNeutrons: 7, stableMasses: [14, 15], radioactiveMasses: [13, 16], period: 2, group: 'VA', color: '#3b82f6' },
  { z: 8, symbol: 'O', nameVi: 'Oxi', nameEn: 'Oxygen', defaultNeutrons: 8, stableMasses: [16, 17, 18], radioactiveMasses: [15, 19], period: 2, group: 'VIA', color: '#ef4444' },
  { z: 9, symbol: 'F', nameVi: 'Flo', nameEn: 'Fluorine', defaultNeutrons: 10, stableMasses: [19], radioactiveMasses: [18], period: 2, group: 'VIIA', color: '#10b981' },
  { z: 10, symbol: 'Ne', nameVi: 'Neon', nameEn: 'Neon', defaultNeutrons: 10, stableMasses: [20, 21, 22], radioactiveMasses: [19, 23], period: 2, group: 'VIIIA', color: '#a855f7' },
  { z: 11, symbol: 'Na', nameVi: 'Natri', nameEn: 'Sodium', defaultNeutrons: 12, stableMasses: [23], radioactiveMasses: [22, 24], period: 3, group: 'IA', color: '#f59e0b' },
  { z: 12, symbol: 'Mg', nameVi: 'Magiê', nameEn: 'Magnesium', defaultNeutrons: 12, stableMasses: [24, 25, 26], radioactiveMasses: [28], period: 3, group: 'IIA', color: '#22c55e' },
  { z: 13, symbol: 'Al', nameVi: 'Nhôm', nameEn: 'Aluminum', defaultNeutrons: 14, stableMasses: [27], radioactiveMasses: [26], period: 3, group: 'IIIA', color: '#94a3b8' },
  { z: 14, symbol: 'Si', nameVi: 'Silic', nameEn: 'Silicon', defaultNeutrons: 14, stableMasses: [28, 29, 30], radioactiveMasses: [32], period: 3, group: 'IVA', color: '#06b6d4' },
  { z: 15, symbol: 'P', nameVi: 'Photpho', nameEn: 'Phosphorus', defaultNeutrons: 16, stableMasses: [31], radioactiveMasses: [32, 33], period: 3, group: 'VA', color: '#ec4899' },
  { z: 16, symbol: 'S', nameVi: 'Lưu huỳnh', nameEn: 'Sulfur', defaultNeutrons: 16, stableMasses: [32, 33, 34, 36], radioactiveMasses: [35], period: 3, group: 'VIA', color: '#eab308' },
  { z: 17, symbol: 'Cl', nameVi: 'Clo', nameEn: 'Chlorine', defaultNeutrons: 18, stableMasses: [35, 37], radioactiveMasses: [36], period: 3, group: 'VIIA', color: '#14b8a6' },
  { z: 18, symbol: 'Ar', nameVi: 'Agon', nameEn: 'Argon', defaultNeutrons: 22, stableMasses: [36, 38, 40], radioactiveMasses: [37, 39], period: 3, group: 'VIIIA', color: '#6366f1' },
  { z: 19, symbol: 'K', nameVi: 'Kali', nameEn: 'Potassium', defaultNeutrons: 20, stableMasses: [39, 41], radioactiveMasses: [40], period: 4, group: 'IA', color: '#d946ef' },
  { z: 20, symbol: 'Ca', nameVi: 'Canxi', nameEn: 'Calcium', defaultNeutrons: 20, stableMasses: [40, 42, 43, 44, 46, 48], radioactiveMasses: [41, 45], period: 4, group: 'IIA', color: '#84cc16' },
];

export const MOLECULE_PRESETS: MoleculePreset[] = [
  {
    formula: 'H2O',
    nameVi: 'Nước',
    bondType: 'Cộng hóa trị phân cực',
    descriptionVi: '1 nguyên tử O dùng chung 1 cặp electron với mỗi nguyên tử H (2 liên kết đơn), tạo góc liên kết gãy khúc ~104,5°.',
    requiredAtoms: { H: 2, O: 1 },
    atomsVisual: [
      { symbol: 'O', x: 210, y: 120, color: '#ef4444', valenceElectrons: 6 },
      { symbol: 'H', x: 125, y: 195, color: '#38bdf8', valenceElectrons: 1 },
      { symbol: 'H', x: 295, y: 195, color: '#38bdf8', valenceElectrons: 1 },
    ],
    bondsVisual: [
      { fromIndex: 0, toIndex: 1, order: 1, sharedOrTransferred: 'shared' },
      { fromIndex: 0, toIndex: 2, order: 1, sharedOrTransferred: 'shared' },
    ],
  },
  {
    formula: 'CO2',
    nameVi: 'Cacbon đioxit',
    bondType: 'Cộng hóa trị không cực',
    descriptionVi: '1 nguyên tử C góp chung 2 cặp electron với mỗi nguyên tử O (2 liên kết đôi), cấu tạo thẳng hàng.',
    requiredAtoms: { C: 1, O: 2 },
    atomsVisual: [
      { symbol: 'O', x: 105, y: 160, color: '#ef4444', valenceElectrons: 6 },
      { symbol: 'C', x: 210, y: 160, color: '#475569', valenceElectrons: 4 },
      { symbol: 'O', x: 315, y: 160, color: '#ef4444', valenceElectrons: 6 },
    ],
    bondsVisual: [
      { fromIndex: 1, toIndex: 0, order: 2, sharedOrTransferred: 'shared' },
      { fromIndex: 1, toIndex: 2, order: 2, sharedOrTransferred: 'shared' },
    ],
  },
  {
    formula: 'NH3',
    nameVi: 'Amoniac',
    bondType: 'Cộng hóa trị phân cực',
    descriptionVi: '1 nguyên tử N liên kết cộng hóa trị đơn với 3 nguyên tử H và còn 1 cặp electron tự do.',
    requiredAtoms: { N: 1, H: 3 },
    atomsVisual: [
      { symbol: 'N', x: 210, y: 105, color: '#3b82f6', valenceElectrons: 5 },
      { symbol: 'H', x: 120, y: 205, color: '#38bdf8', valenceElectrons: 1 },
      { symbol: 'H', x: 210, y: 225, color: '#38bdf8', valenceElectrons: 1 },
      { symbol: 'H', x: 300, y: 205, color: '#38bdf8', valenceElectrons: 1 },
    ],
    bondsVisual: [
      { fromIndex: 0, toIndex: 1, order: 1, sharedOrTransferred: 'shared' },
      { fromIndex: 0, toIndex: 2, order: 1, sharedOrTransferred: 'shared' },
      { fromIndex: 0, toIndex: 3, order: 1, sharedOrTransferred: 'shared' },
    ],
  },
  {
    formula: 'CH4',
    nameVi: 'Metan',
    bondType: 'Cộng hóa trị không cực',
    descriptionVi: '1 nguyên tử C liên kết cộng hóa trị đơn với 4 nguyên tử H.',
    requiredAtoms: { C: 1, H: 4 },
    atomsVisual: [
      { symbol: 'C', x: 210, y: 160, color: '#475569', valenceElectrons: 4 },
      { symbol: 'H', x: 210, y: 75, color: '#38bdf8', valenceElectrons: 1 },
      { symbol: 'H', x: 210, y: 245, color: '#38bdf8', valenceElectrons: 1 },
      { symbol: 'H', x: 125, y: 160, color: '#38bdf8', valenceElectrons: 1 },
      { symbol: 'H', x: 295, y: 160, color: '#38bdf8', valenceElectrons: 1 },
    ],
    bondsVisual: [
      { fromIndex: 0, toIndex: 1, order: 1, sharedOrTransferred: 'shared' },
      { fromIndex: 0, toIndex: 2, order: 1, sharedOrTransferred: 'shared' },
      { fromIndex: 0, toIndex: 3, order: 1, sharedOrTransferred: 'shared' },
      { fromIndex: 0, toIndex: 4, order: 1, sharedOrTransferred: 'shared' },
    ],
  },
  {
    formula: 'NaCl',
    nameVi: 'Natri clorua (Muối ăn)',
    bondType: 'Liên kết ion',
    descriptionVi: 'Nguyên tử Na nhường 1 electron cho nguyên tử Cl tạo thành ion Na+ và ion Cl-, hút nhau bằng lực hút tĩnh điện.',
    requiredAtoms: { Na: 1, Cl: 1 },
    atomsVisual: [
      { symbol: 'Na', x: 145, y: 160, color: '#f59e0b', valenceElectrons: 1 },
      { symbol: 'Cl', x: 275, y: 160, color: '#14b8a6', valenceElectrons: 7 },
    ],
    bondsVisual: [
      { fromIndex: 0, toIndex: 1, order: 1, sharedOrTransferred: 'transferred' },
    ],
  },
];
