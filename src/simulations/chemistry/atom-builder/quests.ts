import { CustomQuestItem } from '../../../types/assignment.types';

export const DEFAULT_ATOM_QUESTS: CustomQuestItem[] = [
  {
    id: 'atom-q1-carbon-12',
    title: '1. Tạo nguyên tử Cacbon-12 trung hòa',
    instruction: 'Thiết lập 6 Proton, 6 Neutron và 6 Electron để tạo nguyên tử 12C trung hòa điện.',
    points: 20,
    logic: 'ALL',
    conditions: [
      { id: 'c1', source: 'parameters', fieldKey: 'protons', fieldLabel: 'Số proton', operator: 'eq', value: 6 },
      { id: 'c2', source: 'parameters', fieldKey: 'neutrons', fieldLabel: 'Số neutron', operator: 'eq', value: 6 },
      { id: 'c3', source: 'parameters', fieldKey: 'electrons', fieldLabel: 'Số electron', operator: 'eq', value: 6 },
    ],
    hint: 'Cacbon có số hiệu nguyên tử Z = 6, số khối A = 12 nên số neutron = 12 - 6 = 6.',
  },
  {
    id: 'atom-q2-sodium-cation',
    title: '2. Tạo ion dương Natri (Na+)',
    instruction: 'Tạo hạt có 11 Proton, 12 Neutron và nhường bớt 1 electron so với nguyên tử trung hòa (còn 10 Electron).',
    points: 25,
    logic: 'ALL',
    conditions: [
      { id: 'c4', source: 'parameters', fieldKey: 'protons', fieldLabel: 'Số proton', operator: 'eq', value: 11 },
      { id: 'c5', source: 'parameters', fieldKey: 'neutrons', fieldLabel: 'Số neutron', operator: 'eq', value: 12 },
      { id: 'c6', source: 'parameters', fieldKey: 'electrons', fieldLabel: 'Số electron', operator: 'eq', value: 10 },
      { id: 'c7', source: 'calculatedOutputs', fieldKey: 'charge', fieldLabel: 'Điện tích', operator: 'eq', value: 1 },
    ],
    hint: 'Khi số proton (11) lớn hơn số electron (10), hạt mang điện tích +1.',
  },
  {
    id: 'atom-q3-chloride-anion',
    title: '3. Tạo ion âm Clorua (Cl-)',
    instruction: 'Tạo hạt có 17 Proton, 18 Neutron và nhận thêm 1 electron (tổng 18 Electron) để đạt điện tích -1.',
    points: 25,
    logic: 'ALL',
    conditions: [
      { id: 'c8', source: 'parameters', fieldKey: 'protons', fieldLabel: 'Số proton', operator: 'eq', value: 17 },
      { id: 'c9', source: 'parameters', fieldKey: 'neutrons', fieldLabel: 'Số neutron', operator: 'eq', value: 18 },
      { id: 'c10', source: 'parameters', fieldKey: 'electrons', fieldLabel: 'Số electron', operator: 'eq', value: 18 },
      { id: 'c11', source: 'calculatedOutputs', fieldKey: 'charge', fieldLabel: 'Điện tích', operator: 'eq', value: -1 },
    ],
    hint: 'Clo có Z = 17; nhận thêm 1 electron sẽ có 18 electron và điện tích -1.',
  },
  {
    id: 'atom-q4-carbon-14',
    title: '4. Tạo đồng vị phóng xạ Cacbon-14',
    instruction: 'Giữ 6 Proton và 6 Electron, tăng số Neutron lên 8 để tạo đồng vị 14C.',
    points: 30,
    logic: 'ALL',
    conditions: [
      { id: 'c12', source: 'parameters', fieldKey: 'protons', fieldLabel: 'Số proton', operator: 'eq', value: 6 },
      { id: 'c13', source: 'parameters', fieldKey: 'neutrons', fieldLabel: 'Số neutron', operator: 'eq', value: 8 },
      { id: 'c14', source: 'calculatedOutputs', fieldKey: 'massNumber', fieldLabel: 'Số khối A', operator: 'eq', value: 14 },
    ],
    hint: 'Số khối A = Proton + Neutron = 6 + 8 = 14.',
  },
];
