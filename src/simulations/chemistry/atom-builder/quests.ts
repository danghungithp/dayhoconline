import { CalculatedAtomOutputs } from './physicsEngine';

export interface SimulationStateInput {
  protons: number;
  neutrons: number;
  electrons: number;
  mode: 'atom' | 'molecule';
  selectedMoleculeId: string | null;
  outputs: CalculatedAtomOutputs;
}

export interface SimulationQuest {
  id: string;
  title: string;
  description: string;
  hint: string;
  xpReward: number;
  checkCompleted: (state: SimulationStateInput) => boolean;
  targetCondition: (state: any) => boolean; // Tương thích SandboxLayout
}

export const ATOM_BUILDER_QUESTS: SimulationQuest[] = [
  {
    id: 'quest-carbon-12',
    title: 'Nhiệm vụ 1: Tạo nguyên tử Cacbon-12 trung hòa (¹²C)',
    description: 'Lắp ráp 6 Proton, 6 Neutron và 6 Electron. Đây là nguyên tử chuẩn mốc 1 amu (đơn vị khối lượng nguyên tử quốc tế).',
    hint: 'Nhấn nút "+" ở cả 3 ô sao cho Proton = 6, Neutron = 6, Electron = 6. Lúc này điện tích ròng q = 0.',
    xpReward: 30,
    checkCompleted: state => {
      return state.protons === 6 && state.neutrons === 6 && state.electrons === 6 && state.outputs.netCharge === 0;
    },
    targetCondition: (state: any) => {
      const p = state.protons;
      const n = state.neutrons;
      const e = state.electrons;
      return p === 6 && n === 6 && e === 6;
    },
  },
  {
    id: 'quest-sodium-cation',
    title: 'Nhiệm vụ 2: Tạo Cation Natri (Na⁺)',
    description: 'Tạo ion Natri dương bằng cách lắp 11 Proton, 12 Neutron và chỉ 10 Electron (nhường 1 electron ở lớp ngoài cùng M).',
    hint: 'Chỉnh Proton = 11, Neutron = 12, Electron = 10. Quan sát điện tích đổi thành +1 và lớp vỏ M(1) biến mất.',
    xpReward: 40,
    checkCompleted: state => {
      return state.protons === 11 && state.neutrons === 12 && state.electrons === 10 && state.outputs.netCharge === 1;
    },
    targetCondition: (state: any) => {
      return state.protons === 11 && state.neutrons === 12 && state.electrons === 10;
    },
  },
  {
    id: 'quest-chloride-anion',
    title: 'Nhiệm vụ 3: Tạo Anion Clorua (Cl⁻)',
    description: 'Tạo ion Clo âm bằng cách lắp 17 Proton, 18 Neutron và 18 Electron (nhận thêm 1 electron để đạt cấu hình bền khí hiếm Argon).',
    hint: 'Chỉnh Proton = 17, Neutron = 18, Electron = 18. Điện tích đạt -1 và lớp ngoài cùng M đạt 8 electron bão hòa.',
    xpReward: 40,
    checkCompleted: state => {
      return state.protons === 17 && state.neutrons === 18 && state.electrons === 18 && state.outputs.netCharge === -1;
    },
    targetCondition: (state: any) => {
      return state.protons === 17 && state.neutrons === 18 && state.electrons === 18;
    },
  },
  {
    id: 'quest-carbon-14',
    title: 'Nhiệm vụ 4: Tạo đồng vị phóng xạ Cacbon-14 (¹⁴C)',
    description: 'Chế tạo hạt nhân Cacbon-14 gồm 6 Proton, 8 Neutron và 6 Electron. Đây là đồng vị phóng xạ β⁻ nổi tiếng dùng để định tuổi hóa thạch cổ vật.',
    hint: 'Giữ Proton = 6, Electron = 6, nhưng tăng Neutron lên 8. Xem hạt nhân kích hoạt rung lắc cảnh báo phóng xạ!',
    xpReward: 50,
    checkCompleted: state => {
      return state.protons === 6 && state.neutrons === 8 && state.electrons === 6 && !state.outputs.isStable;
    },
    targetCondition: (state: any) => {
      return state.protons === 6 && state.neutrons === 8 && state.electrons === 6;
    },
  },
  {
    id: 'quest-water-or-co2',
    title: 'Nhiệm vụ 5: Ghép thành công phân tử Nước (H₂O) hoặc CO₂',
    description: 'Chuyển sang "Chế độ Ghép phân tử" và chọn xem phân tử Nước (H₂O) hoặc Cacbon Đioxit (CO₂) để quan sát cấu trúc liên kết cộng hóa trị.',
    hint: 'Nhấp sang tab "Ghép phân tử" trên bảng điều khiển, sau đó chọn H₂O hoặc CO₂.',
    xpReward: 60,
    checkCompleted: state => {
      return state.mode === 'molecule' && (state.selectedMoleculeId === 'H2O' || state.selectedMoleculeId === 'CO2');
    },
    targetCondition: (state: any) => {
      return (
        state.mode === 'molecule' &&
        (state.selectedMoleculeId === 'H2O' || state.selectedMoleculeId === 'CO2' || state.activeMolecule === 'H2O' || state.activeMolecule === 'CO2')
      );
    },
  },
];
