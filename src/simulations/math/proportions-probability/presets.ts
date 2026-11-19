import { PresetState } from '../../../types/simulation.types';
import { ProportionsProbState } from './types';

const DEFAULT_SLICES = [
  { id: 'red', label: 'Đỏ', color: '#ef4444', weight: 1 },
  { id: 'blue', label: 'Xanh lam', color: '#3b82f6', weight: 1 },
  { id: 'green', label: 'Xanh lục', color: '#10b981', weight: 1 },
  { id: 'yellow', label: 'Vàng', color: '#f59e0b', weight: 1 },
];

export const PROPORTIONS_PRESETS: PresetState<ProportionsProbState>[] = [
  {
    id: 'preset-direct-std',
    name: 'Tỉ lệ thuận y = 2x',
    description: 'Đại lượng y tỉ lệ thuận với x theo hệ số tỉ lệ k = 2 (Đồ thị đi qua gốc O).',
    state: {
      mode: 'direct',
      k: 2,
      testDirectX: 3,
      a: 12,
      testInverseX: 3,
      squareArea: 49,
      slices: DEFAULT_SLICES,
      stats: { counts: {}, totalSpins: 0 },
      currentSliceId: null,
      isSpinning: false,
    },
  },
  {
    id: 'preset-inverse-std',
    name: 'Tỉ lệ nghịch y = 12/x',
    description: 'Tích x·y = 12 luôn không đổi, diện tích hình chữ nhật dưới đường cong bằng 12.',
    state: {
      mode: 'inverse',
      k: 2,
      testDirectX: 3,
      a: 12,
      testInverseX: 4,
      squareArea: 49,
      slices: DEFAULT_SLICES,
      stats: { counts: {}, totalSpins: 0 },
      currentSliceId: null,
      isSpinning: false,
    },
  },
  {
    id: 'preset-sqrt-sq',
    name: 'Căn bậc hai: S = 64 (√64 = 8)',
    description: 'Hình vuông diện tích 64 đơn vị vuông có cạnh chính xác a = 8.',
    state: {
      mode: 'sqrt',
      k: 2,
      testDirectX: 3,
      a: 12,
      testInverseX: 4,
      squareArea: 64,
      slices: DEFAULT_SLICES,
      stats: { counts: {}, totalSpins: 0 },
      currentSliceId: null,
      isSpinning: false,
    },
  },
  {
    id: 'preset-prob-spinner',
    name: 'Vòng quay may mắn (P = 25%)',
    description: 'Vòng quay 4 màu đều nhau, xác suất lý thuyết mỗi màu là 1/4 = 25%.',
    state: {
      mode: 'probability',
      k: 2,
      testDirectX: 3,
      a: 12,
      testInverseX: 4,
      squareArea: 49,
      slices: DEFAULT_SLICES,
      stats: { counts: { red: 12, blue: 13, green: 11, yellow: 14 }, totalSpins: 50 },
      currentSliceId: 'blue',
      isSpinning: false,
    },
  },
];
