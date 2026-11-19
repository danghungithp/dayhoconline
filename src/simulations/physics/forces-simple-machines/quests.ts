import { Quest } from '../../../types/simulation.types';
import { ForcesMachineState } from './types';

export const FORCES_QUESTS: Quest[] = [
  {
    id: 'quest-hooke-elongation',
    title: 'Kiểm chứng Định luật Hooke (m = 200g)',
    description: 'Treo quả nặng m = 200g vào lò xo độ cứng k = 50 N/m và quan sát độ dãn lò xo đạt khoảng 4 cm.',
    hint: 'Chọn tab Lò xo & Lực kế, chỉnh m = 200g và k = 50 N/m.',
    xpReward: 25,
    targetCondition: (state: ForcesMachineState) =>
      state.mode === 'spring' && state.massGrams === 200 && state.springConstant === 50,
  },
  {
    id: 'quest-lever-advantage-2x',
    title: 'Lợi 2 lần về lực với đòn bẩy',
    description: 'Chọn chế độ Đòn bẩy, đặt d₁ = 1.0 m và d₂ = 2.0 m để chỉ cần dùng một nửa lực nâng (lợi 2 lần về lực).',
    hint: 'Chọn tab Đòn bẩy, kéo d₁ = 1 m và d₂ = 2 m.',
    xpReward: 25,
    targetCondition: (state: ForcesMachineState) =>
      state.mode === 'lever' && state.loadArmM === 1.0 && state.effortArmM === 2.0,
  },
  {
    id: 'quest-incline-half-force',
    title: 'Mặt phẳng nghiêng góc 30°',
    description: 'Chỉnh góc dốc nghiêng α = 30° để lực kéo xe lên dốc chỉ còn đúng một nửa trọng lượng vật (F = P · sin 30° = P / 2).',
    hint: 'Chọn tab Mặt phẳng nghiêng và kéo góc dốc về 30°.',
    xpReward: 25,
    targetCondition: (state: ForcesMachineState) =>
      state.mode === 'incline' && state.inclineAngleDeg === 30,
  },
  {
    id: 'quest-heavy-load-500g',
    title: 'Tải trọng tối đa m = 500g',
    description: 'Treo tải trọng lớn nhất m = 500g để kiểm tra giới hạn đàn hồi của lò xo.',
    hint: 'Chọn tab Lò xo và kéo quả nặng lên 500g.',
    xpReward: 25,
    targetCondition: (state: ForcesMachineState) =>
      state.mode === 'spring' && state.massGrams === 500,
  },
];
