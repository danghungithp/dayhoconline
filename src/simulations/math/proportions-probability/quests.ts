import { Quest } from '../../../types/simulation.types';
import { ProportionsProbState } from './types';

export const PROPORTIONS_QUESTS: Quest[] = [
  {
    id: 'quest-direct-k2',
    title: 'Hàm số tỉ lệ thuận: y = 2x',
    description: 'Thiết lập hệ số tỉ lệ k = 2 và di chuyển điểm thử nghiệm x = 3 để kiểm tra điểm M(3, 6) trên đồ thị.',
    hint: 'Chọn tab Tỉ lệ thuận, chỉnh k = 2 và kéo x về 3.',
    xpReward: 25,
    targetCondition: (state: ProportionsProbState) =>
      state.mode === 'direct' && state.k === 2 && state.testDirectX === 3,
  },
  {
    id: 'quest-inverse-area12',
    title: 'Tỉ lệ nghịch: Tích x · y = 12',
    description: 'Thiết lập hệ số a = 12 trong mô hình tỉ lệ nghịch và quan sát diện tích hình chữ nhật x·y luôn bằng 12.',
    hint: 'Chọn tab Tỉ lệ nghịch và chỉnh hệ số a về 12.',
    xpReward: 25,
    targetCondition: (state: ProportionsProbState) =>
      state.mode === 'inverse' && state.a === 12,
  },
  {
    id: 'quest-perfect-square-49',
    title: 'Căn bậc hai số học: √49 = 7',
    description: 'Điều chỉnh diện tích hình vuông S = 49 để tìm độ dài cạnh hình vuông a = √49 = 7.',
    hint: 'Chọn tab Căn bậc hai và kéo diện tích S về đúng 49.',
    xpReward: 25,
    targetCondition: (state: ProportionsProbState) =>
      state.mode === 'sqrt' && state.squareArea === 49,
  },
  {
    id: 'quest-law-large-numbers',
    title: 'Kiểm nghiệm Luật số lớn (≥ 20 lần quay)',
    description: 'Chuyển sang tab Xác suất và thực hiện quay ít nhất 20 lần để quan sát tần số thực nghiệm hội tụ về xác suất lý thuyết 25%.',
    hint: 'Nhấp tab Vòng quay xác suất và bấm nút "Quay 10 lần" ít nhất 2 lần.',
    xpReward: 25,
    targetCondition: (state: ProportionsProbState) =>
      state.mode === 'probability' && state.stats.totalSpins >= 20,
  },
];
