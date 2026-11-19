import { Quest } from '../../../types/simulation.types';
import { IntegersFractionsState } from './types';

export const INTEGERS_QUESTS: Quest[] = [
  {
    id: 'quest-addition-negative',
    title: 'Phép cộng số nguyên âm: 3 + (-5) = -2',
    description: 'Thiết lập số đầu là 3, phép cộng (+), và số thứ hai là -5 để quan sát bước nhảy lùi về điểm -2 trên trục số.',
    hint: 'Chỉnh số thứ nhất = 3, phép tính (+), số thứ hai = -5.',
    xpReward: 25,
    targetCondition: (state: IntegersFractionsState) =>
      state.mode === 'integers' &&
      state.firstNum === 3 &&
      state.operation === '+' &&
      state.secondNum === -5,
  },
  {
    id: 'quest-minus-negative',
    title: 'Quy tắc trừ số âm: 2 - (-4) = 6',
    description: 'Biểu diễn trừ số nguyên âm: Trừ đi số âm tương đương cộng số đối (2 + 4 = 6).',
    hint: 'Chỉnh số thứ nhất = 2, phép tính (-), số thứ hai = -4.',
    xpReward: 25,
    targetCondition: (state: IntegersFractionsState) =>
      state.mode === 'integers' &&
      state.firstNum === 2 &&
      state.operation === '-' &&
      state.secondNum === -4,
  },
  {
    id: 'quest-half-fraction',
    title: 'Phân số một nửa: 1/2 hoặc 4/8 (50%)',
    description: 'Chuyển sang tab Phân số và chỉnh tử số bằng đúng một nửa mẫu số để tạo phân số bằng 50%.',
    hint: 'Chọn tab Phân số, đặt ví dụ tử số = 1, mẫu số = 2 hoặc tử = 4, mẫu = 8.',
    xpReward: 25,
    targetCondition: (state: IntegersFractionsState) =>
      state.mode === 'fractions' && state.numerator * 2 === state.denominator,
  },
  {
    id: 'quest-three-quarters',
    title: 'Phân số ba phần tư: 3/4 (75%)',
    description: 'Thiết lập phân số 3/4 hoặc 6/8 để quan sát 75% diện tích hình tròn/thanh phân số được tô màu.',
    hint: 'Đặt tử số = 3 và mẫu số = 4.',
    xpReward: 25,
    targetCondition: (state: IntegersFractionsState) =>
      state.mode === 'fractions' && state.numerator * 4 === state.denominator * 3,
  },
];
