import { Quest } from '../../../types/simulation.types';
import { AlgorithmsState } from './types';

export const ALGORITHM_QUESTS: Quest[] = [
  {
    id: 'quest-run-sort',
    title: 'Thực thi thuật toán Sắp xếp',
    description: 'Bấm nút Bắt đầu (Play) hoặc Bước tiếp theo (Next Step) để quan sát các phép so sánh & hoán đổi.',
    xpReward: 15,
    targetCondition: (state: any) => {
      const s = state as AlgorithmsState;
      return s.mode === 'sorting' && s.comparisonsCount > 0;
    },
  },
  {
    id: 'quest-sort-complete',
    title: 'Hoàn tất sắp xếp toàn bộ mảng',
    description: 'Chạy thuật toán đến khi toàn bộ các cột đổi sang màu xanh lá cây (isSorted = true).',
    xpReward: 25,
    targetCondition: (state: any) => {
      const s = state as AlgorithmsState;
      return s.mode === 'sorting' && s.isSorted;
    },
  },
  {
    id: 'quest-binary-search-found',
    title: 'Tìm kiếm Nhị phân thành công',
    description: 'Chuyển sang tab Tìm kiếm nhị phân, chọn một số có trong mảng và bấm Tìm kiếm từng bước đến khi tìm thấy.',
    xpReward: 30,
    targetCondition: (state: any) => {
      const s = state as AlgorithmsState;
      return s.mode === 'binary-search' && s.searchFoundIndex !== null;
    },
  },
  {
    id: 'quest-compare-bubble-selection',
    title: 'Thử nghiệm cả hai thuật toán Bubble & Selection Sort',
    description: 'Chuyển đổi giữa 2 thuật toán để so sánh số lần hoán đổi (Swaps) thực tế.',
    xpReward: 30,
    targetCondition: (state: any) => {
      const s = state as AlgorithmsState;
      return s.mode === 'sorting' && s.swapsCount >= 5;
    },
  },
];
