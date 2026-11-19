import { PresetState } from '../../../types/simulation.types';
import { IntegersFractionsState } from './types';

export const INTEGERS_PRESETS: PresetState<IntegersFractionsState>[] = [
  {
    id: 'preset-add-negative',
    name: 'Cộng số âm: 3 + (-5) = -2',
    description: 'Bắt đầu từ số dương 3, cộng thêm số âm tương đương lùi 5 bước về bên trái, dừng ở -2.',
    state: {
      mode: 'integers',
      firstNum: 3,
      operation: '+',
      secondNum: -5,
      showOpposite: false,
      numerator: 3,
      denominator: 4,
      displayModel: 'circle',
    },
  },
  {
    id: 'preset-minus-negative',
    name: 'Trừ số âm: 2 - (-4) = 6',
    description: 'Quy tắc dấu ngoặc: Trừ đi số âm tương đương với cộng số đối: 2 - (-4) = 2 + 4 = 6.',
    state: {
      mode: 'integers',
      firstNum: 2,
      operation: '-',
      secondNum: -4,
      showOpposite: true,
      numerator: 3,
      denominator: 4,
      displayModel: 'circle',
    },
  },
  {
    id: 'preset-fraction-pizza-half',
    name: 'Phân số 1/2 (Đĩa tròn Pizza)',
    description: 'Mô hình đĩa tròn chia 2 phần bằng nhau, tô màu 1 phần ứng với 50% = 0.5.',
    state: {
      mode: 'fractions',
      firstNum: 3,
      operation: '+',
      secondNum: -5,
      showOpposite: false,
      numerator: 1,
      denominator: 2,
      displayModel: 'circle',
    },
  },
  {
    id: 'preset-fraction-bar-three-quarters',
    name: 'Phân số 3/4 (Thanh phân số Bar)',
    description: 'Thanh hình chữ nhật chia 4 phần bằng nhau, tô màu 3 phần ứng với 75% = 0.75.',
    state: {
      mode: 'fractions',
      firstNum: 3,
      operation: '+',
      secondNum: -5,
      showOpposite: false,
      numerator: 3,
      denominator: 4,
      displayModel: 'bar',
    },
  },
];
