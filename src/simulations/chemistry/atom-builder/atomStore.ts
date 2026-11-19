import { create } from 'zustand';
import { calculateAtomState, CalculatedAtomOutputs } from './physicsEngine';
import { ELEMENTS_DATA } from './elementsData';

export interface SimulationStateSnapshot {
  parameters: {
    protons: number;
    neutrons: number;
    electrons: number;
    mode: 'atom' | 'molecule';
    selectedMoleculeId: string | null;
  };
  calculatedOutputs: CalculatedAtomOutputs;
  summaryForAI: string;
}

export interface AtomStoreState {
  protons: number;
  neutrons: number;
  electrons: number;
  mode: 'atom' | 'molecule';
  selectedMoleculeId: string | null;
  outputs: CalculatedAtomOutputs;
  isAnimationPaused: boolean;

  setProtons: (p: number) => void;
  setNeutrons: (n: number) => void;
  setElectrons: (e: number) => void;
  setParticles: (p: number, n: number, e: number) => void;
  setMode: (mode: 'atom' | 'molecule') => void;
  setSelectedMoleculeId: (id: string) => void;
  togglePauseAnimation: () => void;
  selectElementPreset: (z: number) => void;
  reset: () => void;
  getSnapshot: () => SimulationStateSnapshot;
}

const INITIAL_P = 6;
const INITIAL_N = 6;
const INITIAL_E = 6;

export const useAtomStore = create<AtomStoreState>((set, get) => ({
  protons: INITIAL_P,
  neutrons: INITIAL_N,
  electrons: INITIAL_E,
  mode: 'atom',
  selectedMoleculeId: 'H2O',
  outputs: calculateAtomState(INITIAL_P, INITIAL_N, INITIAL_E),
  isAnimationPaused: false,

  setProtons: (p: number) => {
    const nextP = Math.max(0, Math.min(20, p));
    const outputs = calculateAtomState(nextP, get().neutrons, get().electrons);
    set({ protons: nextP, outputs, mode: 'atom' });
  },

  setNeutrons: (n: number) => {
    const nextN = Math.max(0, Math.min(30, n));
    const outputs = calculateAtomState(get().protons, nextN, get().electrons);
    set({ neutrons: nextN, outputs });
  },

  setElectrons: (e: number) => {
    const nextE = Math.max(0, Math.min(20, e));
    const outputs = calculateAtomState(get().protons, get().neutrons, nextE);
    set({ electrons: nextE, outputs });
  },

  setParticles: (p: number, n: number, e: number) => {
    const nextP = Math.max(0, Math.min(20, p));
    const nextN = Math.max(0, Math.min(30, n));
    const nextE = Math.max(0, Math.min(20, e));
    const outputs = calculateAtomState(nextP, nextN, nextE);
    set({ protons: nextP, neutrons: nextN, electrons: nextE, outputs });
  },

  setMode: (mode: 'atom' | 'molecule') => {
    set({ mode });
  },

  setSelectedMoleculeId: (id: string) => {
    set({ selectedMoleculeId: id, mode: 'molecule' });
  },

  togglePauseAnimation: () => {
    set(state => ({ isAnimationPaused: !state.isAnimationPaused }));
  },

  selectElementPreset: (z: number) => {
    const element = ELEMENTS_DATA.find(item => item.z === z);
    if (element) {
      const p = element.z;
      const n = element.stableNeutrons;
      const e = element.z; // neutral by default
      const outputs = calculateAtomState(p, n, e);
      set({ protons: p, neutrons: n, electrons: e, outputs, mode: 'atom' });
    }
  },

  reset: () => {
    set({
      protons: INITIAL_P,
      neutrons: INITIAL_N,
      electrons: INITIAL_E,
      mode: 'atom',
      selectedMoleculeId: 'H2O',
      outputs: calculateAtomState(INITIAL_P, INITIAL_N, INITIAL_E),
      isAnimationPaused: false,
    });
  },

  getSnapshot: (): SimulationStateSnapshot => {
    const { protons, neutrons, electrons, mode, selectedMoleculeId, outputs } = get();
    const elemName = outputs.matchedElement ? outputs.matchedElement.nameVi : 'Chưa xác định';
    const chargeStr = outputs.netCharge === 0 ? 'Trung hòa' : outputs.netCharge > 0 ? `Cation +${outputs.netCharge}` : `Anion ${outputs.netCharge}`;
    const stabilityStr = outputs.isStable ? 'Hạt nhân bền vững' : `Không bền / Phóng xạ (${outputs.stabilityDetail})`;

    const summaryForAI = `
BÀI THÍ NGHIỆM: Cấu tạo nguyên tử, Ion, Đồng vị & Phân tử (GDPT Hóa học 10 / KHTN 7)
- Chế độ hiện tại: ${mode === 'atom' ? 'Khảo sát Nguyên tử & Ion' : `Khảo sát Phân tử (${selectedMoleculeId})`}
- Thông số hạt: Proton = ${protons}, Neutron = ${neutrons}, Electron = ${electrons}
- Nguyên tố tương ứng: ${elemName} (Ký hiệu: ${outputs.ionSymbol}, Z = ${outputs.z}, A = ${outputs.massNumber})
- Điện tích: ${outputs.netCharge} (${chargeStr})
- Trạng thái hạt nhân: ${stabilityStr}
- Phân bố vỏ electron: ${outputs.electronShellSummary} (${outputs.subshellNotation})
`.trim();

    return {
      parameters: {
        protons,
        neutrons,
        electrons,
        mode,
        selectedMoleculeId,
      },
      calculatedOutputs: outputs,
      summaryForAI,
    };
  },
}));
