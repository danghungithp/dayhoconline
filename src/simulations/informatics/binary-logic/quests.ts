import { Quest } from '../../../types/simulation.types';
import { BinaryLogicState } from './types';
import { bitsToDecimal, evaluateLogicGate } from './logicEngine';

export const INFORMATICS_QUESTS: Quest[] = [
  {
    id: 'quest-cs-1',
    title: 'Tạo số thập phân 42 (Mã nhị phân 00101010)',
    description: 'Bật các công tắc nhị phân tương ứng với 32 + 8 + 2 để tổng giá trị thập phân bằng 42.',
    hint: 'Bật bit thứ 3 (32), bit thứ 5 (8) và bit thứ 7 (2).',
    xpReward: 25,
    targetCondition: (state: BinaryLogicState) =>
      state.mode === 'binary-converter' && bitsToDecimal(state.bits) === 42,
  },
  {
    id: 'quest-cs-2',
    title: 'Mã ASCII của chữ cái "A" (Thập phân 65)',
    description: 'Bật công tắc bit 64 và bit 1 (01000001) để hiển thị ký tự mã ASCII "A".',
    hint: 'Bật bit 64 và bit 1, tắt tất cả các bit còn lại.',
    xpReward: 25,
    targetCondition: (state: BinaryLogicState) =>
      state.mode === 'binary-converter' && bitsToDecimal(state.bits) === 65,
  },
  {
    id: 'quest-cs-3',
    title: 'Kích hoạt bóng đèn sáng với cổng logic AND',
    description: 'Chuyển sang chế độ Mạch cổng Logic, chọn cổng AND và bật cả hai đầu vào A = 1 và B = 1 để bóng đèn LED phát sáng (Output = 1).',
    hint: 'Chọn cổng AND, gạt switch A sang 1 và switch B sang 1.',
    xpReward: 25,
    targetCondition: (state: BinaryLogicState) =>
      state.mode === 'logic-gates' && state.gateType === 'AND' && state.inputA && state.inputB,
  },
  {
    id: 'quest-cs-4',
    title: 'Khảo sát Cổng XOR (Đầu vào khác nhau)',
    description: 'Chọn cổng logic XOR (Exclusive OR) và đặt một đầu vào 1, một đầu vào 0 để đầu ra đạt mức 1 (High).',
    hint: 'Chọn cổng XOR, đặt A=1, B=0 hoặc A=0, B=1.',
    xpReward: 25,
    targetCondition: (state: BinaryLogicState) =>
      state.mode === 'logic-gates' &&
      state.gateType === 'XOR' &&
      evaluateLogicGate('XOR', state.inputA, state.inputB) === true,
  },
];
