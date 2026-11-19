import { ELEMENTS_DATA, ElementInfo, MOLECULE_PRESETS, MoleculePreset } from './elementsData';

export interface ShellDistribution {
  shellName: 'K' | 'L' | 'M' | 'N';
  count: number;
  capacity: number;
}

export interface AtomAnalysisResult {
  protons: number;
  neutrons: number;
  electrons: number;
  massNumber: number;
  charge: number; // protons - electrons
  ionType: 'neutral' | 'cation' | 'anion';
  ionLabel: string;
  chargeFormatted: string;
  element: ElementInfo | null;
  symbol: string;
  nameVi: string;
  stability: 'stable' | 'radioactive' | 'empty_nucleus';
  stabilityLabel: string;
  shells: ShellDistribution[];
  electronConfigText: string;
}

const SHELL_CAPACITIES: { name: 'K' | 'L' | 'M' | 'N'; cap: number }[] = [
  { name: 'K', cap: 2 },
  { name: 'L', cap: 8 },
  { name: 'M', cap: 8 },
  { name: 'N', cap: 2 },
];

export function distributeElectrons(electronCount: number): ShellDistribution[] {
  let remaining = Math.max(0, Math.floor(electronCount));
  const result: ShellDistribution[] = [];

  for (const shell of SHELL_CAPACITIES) {
    const placed = Math.min(remaining, shell.cap);
    result.push({
      shellName: shell.name,
      count: placed,
      capacity: shell.cap,
    });
    remaining -= placed;
    if (remaining === 0 && result.length >= 1 && shell.name !== 'K') {
      break;
    }
  }

  // Nếu còn electron vượt mức tối giản (ví dụ > 20), dồn vào lớp N
  if (remaining > 0 && result.length > 0) {
    result[result.length - 1].count += remaining;
  }

  return result;
}

export function formatCharge(charge: number): string {
  if (charge === 0) return '0 (Trung hòa)';
  const abs = Math.abs(charge);
  const sign = charge > 0 ? '+' : '-';
  return abs === 1 ? `${sign}` : `${abs}${sign}`;
}

export function analyzeAtom(
  protons: number,
  neutrons: number,
  electrons: number
): AtomAnalysisResult {
  const p = Math.max(0, Math.floor(protons));
  const n = Math.max(0, Math.floor(neutrons));
  const e = Math.max(0, Math.floor(electrons));

  const massNumber = p + n;
  const charge = p - e;

  let ionType: AtomAnalysisResult['ionType'] = 'neutral';
  let ionLabel = 'Nguyên tử trung hòa';
  if (charge > 0) {
    ionType = 'cation';
    ionLabel = `Ion dương (Cation ${charge > 1 ? `${charge}+` : '+'})`;
  } else if (charge < 0) {
    ionType = 'anion';
    ionLabel = `Ion âm (Anion ${Math.abs(charge) > 1 ? `${Math.abs(charge)}-` : '-'})`;
  }

  const element = ELEMENTS_DATA.find((item) => item.z === p) ?? null;

  let stability: AtomAnalysisResult['stability'] = 'stable';
  let stabilityLabel = 'Hạt nhân bền vững';

  if (p === 0) {
    stability = 'empty_nucleus';
    stabilityLabel = 'Chưa có proton trong hạt nhân';
  } else if (element) {
    if (element.radioactiveMasses.includes(massNumber)) {
      stability = 'radioactive';
      stabilityLabel = `Đồng vị phóng xạ / kém bền (${element.symbol}-${massNumber})`;
    } else if (element.stableMasses.includes(massNumber)) {
      stability = 'stable';
      stabilityLabel = `Đồng vị bền (${element.symbol}-${massNumber})`;
    } else {
      const ratio = n / p;
      if (p > 1 && (ratio < 0.85 || ratio > 1.65)) {
        stability = 'radioactive';
        stabilityLabel = 'Tỉ lệ n/p lệch chuẩn — dễ kém bền';
      } else {
        stability = 'stable';
        stabilityLabel = 'Cấu hình hạt nhân tương đối ổn định';
      }
    }
  } else if (p > 0) {
    const ratio = n / p;
    if (ratio < 0.9 || ratio > 1.7) {
      stability = 'radioactive';
      stabilityLabel = 'Tỉ lệ n/p kém bền';
    }
  }

  const shells = distributeElectrons(e);
  const nonZeroShells = shells.filter((s) => s.count > 0);
  const electronConfigText =
    nonZeroShells.length > 0
      ? nonZeroShells.map((s) => `Lớp ${s.shellName}: ${s.count}e`).join(' · ')
      : 'Không có electron';

  return {
    protons: p,
    neutrons: n,
    electrons: e,
    massNumber,
    charge,
    ionType,
    ionLabel,
    chargeFormatted: formatCharge(charge),
    element,
    symbol: element ? element.symbol : p === 0 ? '∅' : `Z${p}`,
    nameVi: element ? element.nameVi : p === 0 ? 'Trống' : `Nguyên tố Z=${p}`,
    stability,
    stabilityLabel,
    shells,
    electronConfigText,
  };
}

export function matchMoleculeFromCounts(
  atomCounts: Record<string, number>
): MoleculePreset | null {
  const activeEntries = Object.entries(atomCounts).filter(([, qty]) => qty > 0);
  if (activeEntries.length === 0) return null;

  for (const preset of MOLECULE_PRESETS) {
    const reqEntries = Object.entries(preset.requiredAtoms);
    if (
      reqEntries.length === activeEntries.length &&
      reqEntries.every(([sym, qty]) => atomCounts[sym] === qty)
    ) {
      return preset;
    }
  }
  return null;
}
