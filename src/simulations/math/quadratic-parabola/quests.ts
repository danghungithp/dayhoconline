import { Quest } from '../../../types/simulation.types';
import { ParabolaParams, LineParams, LinearEquation, LinearSystemAnalysis, ParabolaAnalysis } from './algebraSolver';

export interface MathSimulationState {
  activeTab: 'parabola' | 'linear-system';
  parabola: ParabolaParams;
  line: LineParams;
  showLine: boolean;
  probeX: number;
  linearEq1: LinearEquation;
  linearEq2: LinearEquation;
  parabolaAnalysis: ParabolaAnalysis;
  linearAnalysis: LinearSystemAnalysis;
  parabolaLineDelta: number;
  intersectionCount: number;
}

export const MATH_QUESTS: Quest[] = [
  {
    id: 'quest-parabola-tangent-ox',
    title: 'Đỉnh tiếp xúc trục hoành (Nghiệm kép)',
    description: 'Điều chỉnh các hệ số a, b, c sao cho Parabol tiếp xúc trục hoành Ox (Δ = 0 và tung độ đỉnh y_I = 0).',
    hint: 'Thử đặt a = 1, b = -4, c = 4 hoặc a = 1, b = -2, c = 1 để (x - x0)² = 0.',
    xpReward: 25,
    targetCondition: (state: MathSimulationState) => {
      if (state.activeTab !== 'parabola') return false;
      const { delta, vertex } = state.parabolaAnalysis;
      return Math.abs(delta) < 0.15 && Math.abs(vertex.y) < 0.08;
    },
  },
  {
    id: 'quest-parabola-origin-sym',
    title: 'Đi qua gốc O(0,0) & Trục đối xứng x = 2',
    description: 'Tạo Parabol đi qua gốc tọa độ (c = 0) và có trục đối xứng x = -b/(2a) = 2.',
    hint: 'Chọn c = 0, nếu chọn a = 1 thì b = -4 để -b/(2a) = 4/2 = 2.',
    xpReward: 25,
    targetCondition: (state: MathSimulationState) => {
      if (state.activeTab !== 'parabola') return false;
      const { c } = state.parabola;
      const { axisOfSymmetry } = state.parabolaAnalysis;
      return Math.abs(c) < 0.05 && Math.abs(axisOfSymmetry - 2) < 0.08;
    },
  },
  {
    id: 'quest-parabola-max-vertex',
    title: 'Cực đại Parabol y_max = 4',
    description: 'Thiết lập Parabol có bề lõm quay xuống (a < 0) và đạt giá trị lớn nhất tại đỉnh đúng bằng 4 (y_I = 4).',
    hint: 'Chọn a = -1, b = 0, c = 4; khi đó y = -x² + 4 có đỉnh I(0, 4).',
    xpReward: 30,
    targetCondition: (state: MathSimulationState) => {
      if (state.activeTab !== 'parabola') return false;
      const { a } = state.parabola;
      const { vertex } = state.parabolaAnalysis;
      return a < -0.1 && Math.abs(vertex.y - 4) < 0.08;
    },
  },
  {
    id: 'quest-linear-parallel',
    title: 'Hệ 2 đường thẳng song song (Vô nghiệm)',
    description: 'Chuyển sang tab Hệ phương trình và thiết lập 2 phương trình sao cho hai đường thẳng song song d1 // d2 (D = 0).',
    hint: 'Giữ tỉ lệ a1/a2 = b1/b2 nhưng khác c1/c2 (ví dụ: 2x + y = 3 và 2x + y = 7).',
    xpReward: 25,
    targetCondition: (state: MathSimulationState) => {
      if (state.activeTab !== 'linear-system') return false;
      return state.linearAnalysis.type === 'parallel';
    },
  },
  {
    id: 'quest-parabola-line-tangent',
    title: 'Đường thẳng tiếp xúc Parabol',
    description: 'Bật đường thẳng so sánh y = mx + n và điều chỉnh sao cho đường thẳng tiếp xúc với Parabol (chỉ có 1 điểm chung, Δ_giao = 0).',
    hint: 'Với Parabol y = x² (a=1, b=0, c=0), chọn m=2, n=-1 thì (x - 1)² = 0 (tiếp xúc tại x=1, y=1).',
    xpReward: 35,
    targetCondition: (state: MathSimulationState) => {
      if (state.activeTab !== 'parabola' || !state.showLine) return false;
      return Math.abs(state.parabolaLineDelta) < 0.15 && state.intersectionCount === 1;
    },
  },
];
