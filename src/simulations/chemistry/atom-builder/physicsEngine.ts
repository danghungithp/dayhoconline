import { ELEMENTS_DATA, MOLECULE_SAMPLES, ElementData, MoleculeSample } from './elementsData';

export type IonStatus = 'Nguyên tử trung hòa' | 'Cation' | 'Anion';

export type NuclearStability = 'Bền vững' | 'Đồng vị kém bền / Phóng xạ';

export interface CalculatedAtomOutputs {
  z: number;                             // Số proton
  massNumber: number;                   // A = Z + N
  netCharge: number;                    // q = Z - e
  ionStatus: IonStatus;
  ionSymbol: string;                    // e.g. "Na⁺", "Cl⁻", "O²⁻", "C"
  ionDescription: string;
  isStable: boolean;
  nuclearStability: NuclearStability;
  stabilityDetail: string;              // Chi tiết chu kỳ bán rã hoặc lí do
  electronShells: [number, number, number, number]; // [K, L, M, N]
  electronShellSummary: string;         // e.g. "K(2) L(8) M(1)"
  subshellNotation: string;             // e.g. "1s² 2s² 2p⁶ 3s¹"
  matchedElement: ElementData | null;
  valenceElectrons: number;             // Số electron lớp ngoài cùng
  electronegativity: number;
}

/**
 * Tính toán phân bổ electron theo các lớp K, L, M, N (tối đa 2, 8, 8, 2 với 20 nguyên tố đầu)
 */
export function calculateElectronShells(electrons: number): [number, number, number, number] {
  let remaining = Math.max(0, electrons);

  const k = Math.min(remaining, 2);
  remaining -= k;

  const l = Math.min(remaining, 8);
  remaining -= l;

  const m = Math.min(remaining, 8);
  remaining -= m;

  const n = Math.min(remaining, 2);
  remaining -= n;

  return [k, l, m, n];
}

/**
 * Tạo chuỗi phân lớp Aufbau chuẩn (1s, 2s, 2p, 3s, 3p, 4s)
 */
export function generateSubshellNotation(electrons: number): string {
  if (electrons <= 0) return 'Không có electron';

  const order: { name: string; capacity: number }[] = [
    { name: '1s', capacity: 2 },
    { name: '2s', capacity: 2 },
    { name: '2p', capacity: 6 },
    { name: '3s', capacity: 2 },
    { name: '3p', capacity: 6 },
    { name: '4s', capacity: 2 },
  ];

  let remaining = electrons;
  const parts: string[] = [];

  const superscriptDigits = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

  for (const sub of order) {
    if (remaining <= 0) break;
    const filled = Math.min(remaining, sub.capacity);
    const sup = filled
      .toString()
      .split('')
      .map(d => superscriptDigits[parseInt(d, 10)])
      .join('');
    parts.push(`${sub.name}${sup}`);
    remaining -= filled;
  }

  return parts.join(' ');
}

/**
 * Kiểm tra tính bền vững của hạt nhân (Nuclear Stability & Specific Isotopes)
 */
export function calculateNuclearStability(
  protons: number,
  neutrons: number
): { isStable: boolean; status: NuclearStability; detail: string } {
  if (protons === 0) {
    return {
      isStable: false,
      status: 'Đồng vị kém bền / Phóng xạ',
      detail: 'Không có hạt nhân vì số proton bằng 0.',
    };
  }

  // 1. Đặc biệt: Hiđro (Z = 1)
  if (protons === 1) {
    if (neutrons === 0) {
      return { isStable: true, status: 'Bền vững', detail: 'Đồng vị Protium (¹H) phổ biến 99.98% trong tự nhiên.' };
    }
    if (neutrons === 1) {
      return { isStable: true, status: 'Bền vững', detail: 'Đồng vị Đơteri (²H - Deuterium) bền, dùng làm nước nặng trong lò phản ứng.' };
    }
    if (neutrons === 2) {
      return {
        isStable: false,
        status: 'Đồng vị kém bền / Phóng xạ',
        detail: 'Đồng vị Triti (³H - Tritium) phóng xạ phân rã β⁻ (chu kỳ bán rã t½ = 12.3 năm).',
      };
    }
    return {
      isStable: false,
      status: 'Đồng vị kém bền / Phóng xạ',
      detail: 'Đồng vị quá nhiều neutron, hạt nhân cực kỳ kém bền.',
    };
  }

  // 2. Đặc biệt: Heli (Z = 2)
  if (protons === 2) {
    if (neutrons === 1) {
      return { isStable: true, status: 'Bền vững', detail: 'Đồng vị Heli-3 (³He) bền vững hiếm gặp.' };
    }
    if (neutrons === 2) {
      return { isStable: true, status: 'Bền vững', detail: 'Đồng vị Heli-4 (⁴He - Hạt alpha) có cấu trúc hạt nhân thần kỳ siêu bền.' };
    }
    return { isStable: false, status: 'Đồng vị kém bền / Phóng xạ', detail: 'Tỉ lệ N/Z lệch khỏi vùng ổn định của Heli.' };
  }

  // 3. Đặc biệt: Cacbon (Z = 6)
  if (protons === 6) {
    if (neutrons === 6) {
      return { isStable: true, status: 'Bền vững', detail: 'Cacbon-12 (¹²C) chuẩn mốc 1 amu quốc tế, chiếm 98.9% trong tự nhiên.' };
    }
    if (neutrons === 7) {
      return { isStable: true, status: 'Bền vững', detail: 'Cacbon-13 (¹³C) bền vững, dùng trong phân tích phổ cộng hưởng từ hạt nhân (NMR).' };
    }
    if (neutrons === 8) {
      return {
        isStable: false,
        status: 'Đồng vị kém bền / Phóng xạ',
        detail: 'Cacbon-14 (¹⁴C) phóng xạ β⁻ (t½ = 5.730 năm) - Công cụ vàng để định tuổi khảo cổ học!',
      };
    }
    return { isStable: false, status: 'Đồng vị kém bền / Phóng xạ', detail: 'Hạt nhân Cacbon bất đối xứng lực hạt nhân mạnh.' };
  }

  // 4. Các nguyên tố nhẹ Z = 3 đến 20: Tỉ lệ N/Z bền vững thường dao động từ 1.0 đến ~1.25
  const ratio = neutrons / protons;
  const element = ELEMENTS_DATA.find(e => e.z === protons);
  const stableN = element ? element.stableNeutrons : protons;

  if (neutrons === stableN) {
    return {
      isStable: true,
      status: 'Bền vững',
      detail: `Đồng vị phổ biến nhất của ${element?.nameVi || 'nguyên tố'} (A = ${protons + neutrons}).`,
    };
  }

  if (Math.abs(neutrons - stableN) <= 1 && ratio >= 0.85 && ratio <= 1.3) {
    return {
      isStable: true,
      status: 'Bền vững',
      detail: `Đồng vị bền tự nhiên (Tỉ lệ N/Z = ${ratio.toFixed(2)}).`,
    };
  }

  return {
    isStable: false,
    status: 'Đồng vị kém bền / Phóng xạ',
    detail: `Tỉ lệ N/Z = ${ratio.toFixed(2)} nằm ngoài dải bền vững (${protons <= 20 ? '1.0 ≤ N/Z ≤ 1.25' : '1.0 - 1.5'}). Hạt nhân có xu hướng phân rã phóng xạ.`,
  };
}

/**
 * Pure function: Tính toán toàn bộ trạng thái hạt nhân và vỏ electron từ (protons, neutrons, electrons)
 */
export function calculateAtomState(
  protons: number,
  neutrons: number,
  electrons: number
): CalculatedAtomOutputs {
  const z = Math.max(0, protons);
  const n = Math.max(0, neutrons);
  const e = Math.max(0, electrons);

  const massNumber = z + n;
  const netCharge = z - e;

  const matchedElement = ELEMENTS_DATA.find(item => item.z === z) || null;
  const symbol = matchedElement ? matchedElement.symbol : (z === 0 ? 'Ø' : `Z${z}`);

  // Trạng thái Ion
  let ionStatus: IonStatus = 'Nguyên tử trung hòa';
  let ionSymbol = symbol;
  let ionDescription = 'Số proton bằng số electron, tổng điện tích bằng 0.';

  if (netCharge > 0) {
    ionStatus = 'Cation';
    const chargeStr = netCharge === 1 ? '⁺' : `${netCharge}⁺`;
    ionSymbol = `${symbol}${chargeStr}`;
    ionDescription = `Cation mang điện tích dương +${netCharge} do đã nhường ${netCharge} electron.`;
  } else if (netCharge < 0) {
    ionStatus = 'Anion';
    const absCharge = Math.abs(netCharge);
    const chargeStr = absCharge === 1 ? '⁻' : `${absCharge}⁻`;
    ionSymbol = `${symbol}${chargeStr}`;
    ionDescription = `Anion mang điện tích âm -${absCharge} do đã nhận thêm ${absCharge} electron.`;
  }

  // Tính hạt nhân
  const stability = calculateNuclearStability(z, n);

  // Phân bổ lớp vỏ K, L, M, N
  const electronShells = calculateElectronShells(e);
  const shellNames = ['K', 'L', 'M', 'N'];
  const activeShells = electronShells
    .map((count, idx) => (count > 0 ? `${shellNames[idx]}(${count})` : null))
    .filter(Boolean);
  const electronShellSummary = activeShells.length > 0 ? activeShells.join(' ') : 'Lớp vỏ trống (0e)';

  // Số electron hóa trị (lớp ngoài cùng có e)
  let valenceElectrons = 0;
  for (let i = electronShells.length - 1; i >= 0; i--) {
    if (electronShells[i] > 0) {
      valenceElectrons = electronShells[i];
      break;
    }
  }

  const subshellNotation = generateSubshellNotation(e);
  const electronegativity = matchedElement?.electronegativity || 0;

  return {
    z,
    massNumber,
    netCharge,
    ionStatus,
    ionSymbol,
    ionDescription,
    isStable: stability.isStable,
    nuclearStability: stability.status,
    stabilityDetail: stability.detail,
    electronShells,
    electronShellSummary,
    subshellNotation,
    matchedElement,
    valenceElectrons,
    electronegativity,
  };
}

/**
 * Kiểm tra khả năng tạo phân tử từ nguyên tố hiện thời
 */
export function getAvailableMoleculesForElement(symbol: string): MoleculeSample[] {
  const result: MoleculeSample[] = [];
  for (const mol of Object.values(MOLECULE_SAMPLES)) {
    if (mol.atoms.some(a => a.symbol === symbol)) {
      result.push(mol);
    }
  }
  return result;
}

/**
 * Lấy dữ liệu chi tiết của một phân tử mẫu
 */
export function getMoleculeDetails(moleculeId: string): MoleculeSample | null {
  return MOLECULE_SAMPLES[moleculeId] || null;
}
