import { Quest } from '../../../types/simulation.types';
import { AnglesSymmetryState } from './types';

export const ANGLES_QUESTS: Quest[] = [
  {
    id: 'quest-angle-right-90',
    title: 'Tạo góc vuông xOy = 90°',
    description: 'Xoay tia Oy vuông góc với tia Ox để tạo thành góc vuông chuẩn 90° có ký hiệu vuông.',
    hint: 'Kéo tia Oy hoặc chỉnh thanh trượt về đúng 90°.',
    xpReward: 25,
    targetCondition: (state: AnglesSymmetryState) =>
      state.mode === 'angles' && state.angleDeg === 90,
  },
  {
    id: 'quest-angle-straight-180',
    title: 'Tạo góc bẹt xOy = 180°',
    description: 'Kéo tia Oy sang phía đối diện của Ox để tạo thành một góc bẹt 180° (hai tia đối nhau).',
    hint: 'Chỉnh góc về đúng 180°.',
    xpReward: 25,
    targetCondition: (state: AnglesSymmetryState) =>
      state.mode === 'angles' && state.angleDeg === 180,
  },
  {
    id: 'quest-angle-obtuse',
    title: 'Khảo sát góc tù (110° - 150°)',
    description: 'Tạo một góc tù có số đo lớn hơn góc vuông và nhỏ hơn góc bẹt (110° ≤ α ≤ 150°).',
    hint: 'Kéo góc vào khoảng 110° đến 150°.',
    xpReward: 25,
    targetCondition: (state: AnglesSymmetryState) =>
      state.mode === 'angles' && state.angleDeg >= 110 && state.angleDeg <= 150,
  },
  {
    id: 'quest-axis-fold',
    title: 'Gấp hình qua trục đối xứng',
    description: 'Chuyển sang tab Trục đối xứng và kéo thanh Gấp hình đạt 100% để hai nửa trùng khít nhau.',
    hint: 'Nhấp tab Trục đối xứng và kéo thanh Gấp hình sang cực đại.',
    xpReward: 25,
    targetCondition: (state: AnglesSymmetryState) =>
      state.mode === 'axis-symmetry' && state.foldProgress >= 0.9,
  },
];
