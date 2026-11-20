import { PresetState } from '../../../types/simulation.types';

export const ALGORITHM_PRESETS: PresetState[] = [
  {
    id: 'preset-bubble-sort',
    name: 'Sắp xếp nổi bọt (Bubble Sort)',
    description: 'Quan sát các phần tử lớn dần nổi lên phía cuối mảng sau từng vòng lặp hoán đổi O(n^2).',
    state: {
      mode: 'sorting',
      sortAlgorithm: 'bubble',
      isPlaying: false,
      speedMs: 250,
      stepCount: 0,
      comparisonsCount: 0,
      swapsCount: 0,
      isSorted: false,
    },
  },
  {
    id: 'preset-selection-sort',
    name: 'Sắp xếp chọn (Selection Sort)',
    description: 'Mỗi lượt duyệt tìm phần tử nhỏ nhất trong đoạn chưa sắp xếp rồi đổi chỗ về đầu mảng.',
    state: {
      mode: 'sorting',
      sortAlgorithm: 'selection',
      isPlaying: false,
      speedMs: 300,
      stepCount: 0,
      comparisonsCount: 0,
      swapsCount: 0,
      isSorted: false,
    },
  },
  {
    id: 'preset-binary-search',
    name: 'Tìm kiếm nhị phân & Lưu đồ khối (O(log n))',
    description: 'Chia đôi không gian tìm kiếm trên mảng đã sắp xếp, theo dõi trực tiếp các khối quyết định trong Lưu đồ thuật toán.',
    state: {
      mode: 'binary-search',
      targetValue: 42,
      leftIndex: 0,
      rightIndex: 14,
      midIndex: 7,
      searchFoundIndex: null,
      flowchartStep: 'start',
    },
  },
];
