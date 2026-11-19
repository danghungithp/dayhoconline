import { Quest } from '../../../types/simulation.types';
import { TriangleState } from './types';

export const TRIANGLE_QUESTS: Quest[] = [
  {
    id: 'quest-medians-centroid',
    title: 'Trọng tâm G & 3 đường trung tuyến',
    description: 'Bật hiển thị 3 đường trung tuyến để quan sát giao điểm Trọng tâm G (cách mỗi đỉnh 2/3 độ dài trung tuyến).',
    hint: 'Chọn tab 4 Đường đồng quy và kích hoạt "3 đường trung tuyến (Trọng tâm G)".',
    xpReward: 25,
    targetCondition: (state: TriangleState) =>
      state.activeTab === 'concurrence' && state.showMedians === true,
  },
  {
    id: 'quest-inscribed-circle',
    title: 'Tâm I & Đường tròn nội tiếp',
    description: 'Bật 3 đường phân giác và hiển thị đường tròn nội tiếp (I, r) tiếp xúc khít với cả 3 cạnh của tam giác.',
    hint: 'Bật công tắc "3 đường phân giác (Tâm nội tiếp I)" và "Đường tròn nội tiếp".',
    xpReward: 25,
    targetCondition: (state: TriangleState) =>
      state.activeTab === 'concurrence' &&
      state.showAngleBisectors === true &&
      state.showIncircle === true,
  },
  {
    id: 'quest-pythagoras-theorem',
    title: 'Định lý Pythagore & 3 hình vuông',
    description: 'Chuyển sang tab Định lý Pythagore và bật hiển thị 3 hình vuông dựng trên các cạnh để thấy diện tích a² = b² + c².',
    hint: 'Chọn tab Định lý Pythagore và bật "Dựng 3 hình vuông ngoại tiếp".',
    xpReward: 25,
    targetCondition: (state: TriangleState) =>
      state.activeTab === 'pythagoras' && state.showPythagorasSquares === true,
  },
  {
    id: 'quest-triangle-congruence',
    title: 'Chồng khít 2 tam giác bằng nhau',
    description: 'Chuyển sang tab Tam giác bằng nhau và bật chế độ Chồng khít để quan sát 2 tam giác bằng nhau trùng khít mọi đỉnh và cạnh.',
    hint: 'Nhấp tab Tam giác bằng nhau và bật "Chồng khít 2 tam giác".',
    xpReward: 25,
    targetCondition: (state: TriangleState) =>
      state.activeTab === 'congruence' && state.isSuperimposed === true,
  },
];
