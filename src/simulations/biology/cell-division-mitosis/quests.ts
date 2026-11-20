import { Quest } from '../../../types/simulation.types';
import { CellDivisionState } from './types';

export const CELL_QUESTS: Quest[] = [
  {
    id: 'quest-explore-all-phases',
    title: 'Khám phá tất cả các kỳ của Nguyên phân',
    description: 'Chuyển qua lần lượt tất cả các kỳ: Kỳ đầu, Kỳ giữa, Kỳ sau, Kỳ cuối.',
    xpReward: 20,
    targetCondition: (state: any) => {
      const s = state as CellDivisionState;
      return s.phase === 'telophase' || s.phase === 'anaphase';
    },
  },
  {
    id: 'quest-metaphase-observation',
    title: 'Quan sát mặt phẳng xích đạo ở Kỳ giữa',
    description: 'Chuyển đến Kỳ giữa (Metaphase) và bật hiển thị Thoi phân bào (Spindle fibers).',
    xpReward: 25,
    targetCondition: (state: any) => {
      const s = state as CellDivisionState;
      return s.phase === 'metaphase' && s.showSpindleFibers;
    },
  },
  {
    id: 'quest-anaphase-separation',
    title: 'Khảo sát sự phân ly NST ở Kỳ sau',
    description: 'Quan sát trạng thái 4n đơn khi các chromatid chị em tách nhau về hai cực tế bào.',
    xpReward: 25,
    targetCondition: (state: any) => {
      const s = state as CellDivisionState;
      return s.phase === 'anaphase';
    },
  },
  {
    id: 'quest-play-continuous-cycle',
    title: 'Chạy mô phỏng vòng đời tế bào liên tục',
    description: 'Bấm nút Bắt đầu (Play) để chu kỳ nguyên phân diễn ra tự động 60 FPS.',
    xpReward: 30,
    targetCondition: (state: any) => {
      const s = state as CellDivisionState;
      return s.isPlaying;
    },
  },
];
