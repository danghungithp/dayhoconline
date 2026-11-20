import { Quest } from '../../../types/simulation.types';
import { DissociationPhState } from './types';
import { calculatePhMetrics } from './chemistryEngine';

export const PH_QUESTS: Quest[] = [
  {
    id: 'quest-dip-litmus',
    title: 'Thử nghiệm quỳ tím nhận biết tính Axit / Bazơ',
    description: 'Chọn một dung dịch bất kỳ và nhúng giấy quỳ tím hoặc bút đo pH điện tử vào cốc.',
    xpReward: 15,
    targetCondition: (state: any) => {
      const s = state as DissociationPhState;
      return s.mode === 'ph-scale' && s.dippedIndicator !== 'none';
    },
  },
  {
    id: 'quest-dilution-effect',
    title: 'Khảo sát hiện tượng pha loãng dung dịch',
    description: 'Thêm ít nhất 400 mL nước cất vào dung dịch axit hoặc bazơ để quan sát giá trị pH dịch chuyển về 7.',
    xpReward: 25,
    targetCondition: (state: any) => {
      const s = state as DissociationPhState;
      return s.mode === 'ph-scale' && s.waterAddedMl >= 400 && s.selectedSolutionId !== 'sol-water';
    },
  },
  {
    id: 'quest-find-strong-base',
    title: 'Đo độ kiềm của dung dịch Bazơ mạnh',
    description: 'Chọn dung dịch có tính kiềm mạnh (pH >= 11) và đo nồng độ ion OH- sinh ra.',
    xpReward: 25,
    targetCondition: (state: any) => {
      const s = state as DissociationPhState;
      if (s.mode !== 'ph-scale') return false;
      const metrics = calculatePhMetrics(s);
      return metrics.currentPh >= 11;
    },
  },
  {
    id: 'quest-titration-finish',
    title: 'Xác định chính xác Điểm tương đương chuẩn độ',
    description: 'Chuyển sang tab Chuẩn độ, điều chỉnh thể tích buret đạt đúng điểm đổi màu của Phenolphthalein (V = 24.5 - 25.5 mL).',
    xpReward: 35,
    targetCondition: (state: any) => {
      const s = state as DissociationPhState;
      if (s.mode !== 'titration') return false;
      const metrics = calculatePhMetrics(s);
      return metrics.isEquivalencePoint;
    },
  },
];
