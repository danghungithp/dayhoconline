import { Quest } from '../../../types/simulation.types';
import { PastFutureState } from './types';

export const COMPARATIVES_QUESTS: Quest[] = [
  {
    id: 'quest-cheetah-faster',
    title: 'So sánh tốc độ: Cheetah vs Elephant',
    description: 'Chọn Cheetah và Elephant theo tiêu chí Tốc độ để tự động sinh câu: "The cheetah is faster than the elephant."',
    hint: 'Chọn nhóm Động vật, đặt Đối tượng A là Cheetah, B là Elephant và chọn tiêu chí Speed.',
    xpReward: 25,
    targetCondition: (state: PastFutureState) =>
      state.activeTab === 'comparatives' &&
      state.category === 'animals' &&
      state.attribute === 'speed' &&
      ((state.itemAId === 'cheetah' && state.itemBId === 'elephant') ||
        (state.itemAId === 'elephant' && state.itemBId === 'cheetah')),
  },
  {
    id: 'quest-giraffe-tallest',
    title: 'So sánh nhất: Chiều cao Hươu cao cổ',
    description: 'Chọn tiêu chí Chiều cao (Height) để tìm ra loài động vật cao nhất thế giới (The giraffe is the tallest of all).',
    hint: 'Chọn tiêu chí so sánh Chiều cao (Height).',
    xpReward: 25,
    targetCondition: (state: PastFutureState) =>
      state.activeTab === 'comparatives' && state.attribute === 'height',
  },
  {
    id: 'quest-vehicle-fastest',
    title: 'Phương tiện giao thông nhanh nhất',
    description: 'Chuyển nhóm sang Phương tiện giao thông (Vehicles) và khảo sát câu so sánh giữa Máy bay phản lực và Tàu cao tốc.',
    hint: 'Chọn nhóm Phương tiện giao thông (Vehicles) ở bảng điều khiển.',
    xpReward: 25,
    targetCondition: (state: PastFutureState) =>
      state.activeTab === 'comparatives' && state.category === 'vehicles',
  },
  {
    id: 'quest-future-going-to',
    title: 'Kế hoạch tương lai với "Be going to"',
    description: 'Chuyển sang tab Trục thời gian và khám phá cách dùng cấu trúc "be going to" diễn đạt kế hoạch hoặc dự định định sẵn.',
    hint: 'Nhấp tab Quá khứ & Tương lai và chọn mốc thì Be going to.',
    xpReward: 25,
    targetCondition: (state: PastFutureState) =>
      state.activeTab === 'past-future' && state.selectedTense === 'future-going-to',
  },
];
