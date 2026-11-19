import { PresetState } from '../../../types/simulation.types';
import { ReactionBalancingState } from './types';

export const REACTION_PRESETS: PresetState<ReactionBalancingState>[] = [
  {
    id: 'preset-reaction-water',
    name: 'Tổng hợp Nước (2 H₂ + O₂ ➔ 2 H₂O)',
    description: 'Phản ứng cơ bản minh họa định luật bảo toàn khối lượng: 4g H₂ + 32g O₂ = 36g H₂O.',
    state: {
      reactionId: 'h2-o2-water',
      coeffs: [2, 1, 2],
      showAtomCounts: true,
      showMassBalance: true,
    },
  },
  {
    id: 'preset-reaction-ammonia',
    name: 'Tổng hợp Amoniac (N₂ + 3 H₂ ➔ 2 NH₃)',
    description: 'Phản ứng Haber tạo phân tử amoniac từ khí nitơ và hiđro.',
    state: {
      reactionId: 'n2-h2-ammonia',
      coeffs: [1, 3, 2],
      showAtomCounts: true,
      showMassBalance: true,
    },
  },
  {
    id: 'preset-reaction-methane',
    name: 'Cháy Mê-tan (CH₄ + 2 O₂ ➔ CO₂ + 2 H₂O)',
    description: 'Phản ứng đốt cháy hoàn toàn hiđrocacbon sinh ra khí cacbonic và hơi nước.',
    state: {
      reactionId: 'ch4-o2-combustion',
      coeffs: [1, 2, 1, 2],
      showAtomCounts: true,
      showMassBalance: true,
    },
  },
];
