import { Quest } from '../../../types/simulation.types';
import { ReactionBalancingState } from './types';

export const REACTION_QUESTS: Quest[] = [
  {
    id: 'quest-balance-water',
    title: 'Cân bằng tạo Nước: 2 H₂ + O₂ ➔ 2 H₂O',
    description: 'Điều chỉnh hệ số cân bằng phản ứng đốt cháy hiđro: 2 H₂ + 1 O₂ ➔ 2 H₂O.',
    hint: 'Chọn phản ứng tạo Nước, đặt hệ số H₂ = 2, O₂ = 1, H₂O = 2.',
    xpReward: 25,
    targetCondition: (state: ReactionBalancingState) =>
      state.reactionId === 'h2-o2-water' &&
      state.coeffs[0] === 2 &&
      state.coeffs[1] === 1 &&
      state.coeffs[2] === 2,
  },
  {
    id: 'quest-balance-ammonia',
    title: 'Cân bằng tổng hợp Amoniac: N₂ + 3 H₂ ➔ 2 NH₃',
    description: 'Chỉnh hệ số phản ứng tạo khí amoniac: 1 N₂ + 3 H₂ ➔ 2 NH₃.',
    hint: 'Chọn phản ứng Tổng hợp Amoniac, đặt hệ số N₂ = 1, H₂ = 3, NH₃ = 2.',
    xpReward: 25,
    targetCondition: (state: ReactionBalancingState) =>
      state.reactionId === 'n2-h2-ammonia' &&
      state.coeffs[0] === 1 &&
      state.coeffs[1] === 3 &&
      state.coeffs[2] === 2,
  },
  {
    id: 'quest-balance-methane',
    title: 'Cân bằng cháy Mê-tan: CH₄ + 2 O₂ ➔ CO₂ + 2 H₂O',
    description: 'Điều chỉnh hệ số phản ứng cháy metan: 1 CH₄ + 2 O₂ ➔ 1 CO₂ + 2 H₂O.',
    hint: 'Đặt hệ số CH₄ = 1, O₂ = 2, CO₂ = 1, H₂O = 2.',
    xpReward: 25,
    targetCondition: (state: ReactionBalancingState) =>
      state.reactionId === 'ch4-o2-combustion' &&
      state.coeffs[0] === 1 &&
      state.coeffs[1] === 2 &&
      state.coeffs[2] === 1 &&
      state.coeffs[3] === 2,
  },
  {
    id: 'quest-balance-al-acid',
    title: 'Cân bằng Nhôm + Axit: 2 Al + 6 HCl ➔ 2 AlCl₃ + 3 H₂',
    description: 'Cân bằng phản ứng giữa Al và axit: 2 Al + 6 HCl ➔ 2 AlCl₃ + 3 H₂.',
    hint: 'Đặt hệ số Al = 2, HCl = 6, AlCl₃ = 2, H₂ = 3.',
    xpReward: 25,
    targetCondition: (state: ReactionBalancingState) =>
      state.reactionId === 'al-hcl-salt' &&
      state.coeffs[0] === 2 &&
      state.coeffs[1] === 6 &&
      state.coeffs[2] === 2 &&
      state.coeffs[3] === 3,
  },
];
