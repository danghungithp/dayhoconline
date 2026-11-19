import { PresetState } from '../../../types/simulation.types';

export interface AtomBuilderPresetConfig {
  protons: number;
  neutrons: number;
  electrons: number;
  mode: 'atom' | 'molecule';
  selectedMoleculeId: string;
}

export const ATOM_BUILDER_PRESETS: PresetState<AtomBuilderPresetConfig>[] = [
  {
    id: 'preset-c12',
    name: '1. Cacbon-12 (¹²C) - Chuẩn 1 amu',
    description: 'Nguyên tử Cacbon trung hòa hoàn hảo: 6p, 6n, 6e; lớp K có 2e, lớp L có 4e.',
    state: {
      protons: 6,
      neutrons: 6,
      electrons: 6,
      mode: 'atom',
      selectedMoleculeId: 'CO2',
    },
  },
  {
    id: 'preset-na-cation',
    name: '2. Cation Natri (Na⁺)',
    description: 'Nguyên tử Natri (11p, 12n) nhường 1 electron hóa trị ở lớp M, còn lại 10 electron (q = +1).',
    state: {
      protons: 11,
      neutrons: 12,
      electrons: 10,
      mode: 'atom',
      selectedMoleculeId: 'NaCl',
    },
  },
  {
    id: 'preset-cl-anion',
    name: '3. Anion Clorua (Cl⁻)',
    description: 'Nguyên tử Clo (17p, 18n) nhận thêm 1 electron để đạt cấu hình bát tử 8e bão hòa ở lớp M (q = -1).',
    state: {
      protons: 17,
      neutrons: 18,
      electrons: 18,
      mode: 'atom',
      selectedMoleculeId: 'NaCl',
    },
  },
  {
    id: 'preset-c14',
    name: '4. Đồng vị phóng xạ Cacbon-14 (¹⁴C)',
    description: 'Chứa 6 proton và 8 neutron, tỉ lệ N/Z = 1.33 khiến hạt nhân mất ổn định, phân rã β⁻ (t½ = 5.730 năm).',
    state: {
      protons: 6,
      neutrons: 8,
      electrons: 6,
      mode: 'atom',
      selectedMoleculeId: 'CO2',
    },
  },
  {
    id: 'preset-h2o',
    name: '5. Phân tử Nước (H₂O)',
    description: 'Khảo sát liên kết cộng hóa trị phân cực giữa 1 Oxi và 2 Hiđro với góc gấp khúc 104.5°.',
    state: {
      protons: 8,
      neutrons: 8,
      electrons: 8,
      mode: 'molecule',
      selectedMoleculeId: 'H2O',
    },
  },
  {
    id: 'preset-co2',
    name: '6. Phân tử Cacbon Đioxit (CO₂)',
    description: 'Khảo sát liên kết đôi O = C = O dạng đường thẳng 180°, không phân cực tổng thể.',
    state: {
      protons: 6,
      neutrons: 6,
      electrons: 6,
      mode: 'molecule',
      selectedMoleculeId: 'CO2',
    },
  },
  {
    id: 'preset-nacl',
    name: '7. Mạng tinh thể Muối ăn (NaCl)',
    description: 'Mô phỏng liên kết ion điển hình: Na nhường 1 electron cho Cl sinh lực hút tĩnh điện ion.',
    state: {
      protons: 11,
      neutrons: 12,
      electrons: 11,
      mode: 'molecule',
      selectedMoleculeId: 'NaCl',
    },
  },
];
