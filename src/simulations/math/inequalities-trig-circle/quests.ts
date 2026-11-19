import { Quest } from '../../../types/simulation.types';
import { UnitCircleState } from './types';
import {
  checkPointInFeasibleRegion,
  computeFeasibleVertices,
} from './trigInequalitiesEngine';

export const TRIG_INEQUALITIES_QUESTS: Quest[] = [
  {
    id: 'quest-trig-60-deg',
    title: 'Góc đặc biệt 60° (π/3)',
    description: 'Xoay góc lượng giác đến đúng 60° để kiểm tra cos(60°) = 1/2 và sin(60°) = √3/2 ≈ 0.866.',
    hint: 'Kéo điểm M hoặc chỉnh thanh trượt đến góc 60° (bật hút góc đặc biệt để dễ dừng).',
    xpReward: 25,
    targetCondition: (state: UnitCircleState) =>
      state.activeTab === 'unit-circle' &&
      Math.abs(state.angleDeg - 60) < 1.0,
  },
  {
    id: 'quest-trig-suppl-150',
    title: 'Quan hệ góc bù 150° (180° - 30°)',
    description: 'Khảo sát góc tù 150°: sin(150°) = sin(30°) = 0.5 và cos(150°) = -cos(30°) = -√3/2.',
    hint: 'Xoay điểm M sang góc phần tư thứ II tại góc 150°.',
    xpReward: 25,
    targetCondition: (state: UnitCircleState) =>
      state.activeTab === 'unit-circle' &&
      Math.abs(state.angleDeg - 150) < 1.0,
  },
  {
    id: 'quest-trig-tangent-axis',
    title: 'Trục tiếp tuyến Tan tại 45°',
    description: 'Bật hiển thị "Trục Tangent" và đặt góc α = 45° (π/4) để tia OM cắt trục tiếp tuyến x = 1 tại điểm T(1, 1).',
    hint: 'Bật trục Tangent và chỉnh góc α = 45°.',
    xpReward: 25,
    targetCondition: (state: UnitCircleState) =>
      state.activeTab === 'unit-circle' &&
      state.showTangent &&
      Math.abs(state.angleDeg - 45) < 1.0,
  },
  {
    id: 'quest-ineq-test-point',
    title: 'Điểm thuộc miền nghiệm hệ BPT',
    description: 'Chuyển sang tab "Miền nghiệm BPT", nhấp chuột hoặc kéo điểm thử nghiệm M(x, y) vào trong miền đa giác màu xanh (thỏa mãn toàn bộ hệ BPT).',
    hint: 'Kéo điểm M vào trong vùng đa giác màu xanh lá.',
    xpReward: 25,
    targetCondition: (state: UnitCircleState) => {
      if (state.activeTab !== 'inequalities') return false;
      return (
        checkPointInFeasibleRegion(state.testPoint, state.inequalities) &&
        state.testPoint.x >= 0 &&
        state.testPoint.y >= 0
      );
    },
  },
  {
    id: 'quest-ineq-max-f',
    title: 'Tìm phương án tối ưu F(x, y) cực đại',
    description: 'Đặt điểm thử nghiệm M(x, y) tại đỉnh đa giác làm hàm mục tiêu F(x, y) đạt giá trị lớn nhất [MAX].',
    hint: 'Kéo điểm M đến vị trí đỉnh có nhãn màu vàng [MAX].',
    xpReward: 30,
    targetCondition: (state: UnitCircleState) => {
      if (state.activeTab !== 'inequalities') return false;
      const vertices = computeFeasibleVertices(
        state.inequalities,
        state.objectiveA,
        state.objectiveB
      );
      const maxVertex = vertices.find(v => v.isMax);
      if (!maxVertex) return false;
      const dist = Math.hypot(
        state.testPoint.x - maxVertex.x,
        state.testPoint.y - maxVertex.y
      );
      return dist < 0.35;
    },
  },
];
