import { PresetState } from '../../../types/simulation.types';
import { ParabolaParams, LineParams, LinearEquation } from './algebraSolver';

export interface MathPresetConfig {
  activeTab: 'parabola' | 'linear-system';
  parabola: ParabolaParams;
  line: LineParams;
  showLine: boolean;
  probeX: number;
  linearEq1: LinearEquation;
  linearEq2: LinearEquation;
}

export const MATH_PRESETS: PresetState<MathPresetConfig>[] = [
  {
    id: 'parabola-standard',
    name: '1. Parabol chuẩn tắc y = x²',
    description: 'Parabol cơ bản, đỉnh I(0,0), đối xứng qua Oy, bề lõm quay lên trên.',
    state: {
      activeTab: 'parabola',
      parabola: { a: 1, b: 0, c: 0 },
      line: { m: 1, n: 0 },
      showLine: false,
      probeX: 1,
      linearEq1: { a: 2, b: 1, c: 4 },
      linearEq2: { a: 1, b: -1, c: -1 },
    },
  },
  {
    id: 'parabola-two-roots',
    name: '2. Cắt Ox tại 2 điểm: y = x² - 4x + 3',
    description: 'Biệt thức Δ = 4 > 0, cắt trục hoành tại x = 1 và x = 3, đỉnh I(2, -1).',
    state: {
      activeTab: 'parabola',
      parabola: { a: 1, b: -4, c: 3 },
      line: { m: 1, n: 0 },
      showLine: false,
      probeX: 2,
      linearEq1: { a: 2, b: 1, c: 4 },
      linearEq2: { a: 1, b: -1, c: -1 },
    },
  },
  {
    id: 'parabola-tangent-ox',
    name: '3. Tiếp xúc Ox: y = x² - 4x + 4',
    description: 'Biệt thức Δ = 0, đỉnh I(2, 0) tiếp xúc trục hoành (nghiệm kép x = 2).',
    state: {
      activeTab: 'parabola',
      parabola: { a: 1, b: -4, c: 4 },
      line: { m: 1, n: 0 },
      showLine: false,
      probeX: 2,
      linearEq1: { a: 2, b: 1, c: 4 },
      linearEq2: { a: 1, b: -1, c: -1 },
    },
  },
  {
    id: 'parabola-origin-sym2',
    name: '4. Qua gốc O & Trục x = 2: y = x² - 4x',
    description: 'Đi qua gốc tọa độ O(0,0), c = 0, trục đối xứng x = 2, đỉnh I(2, -4).',
    state: {
      activeTab: 'parabola',
      parabola: { a: 1, b: -4, c: 0 },
      line: { m: 1, n: 0 },
      showLine: false,
      probeX: 2,
      linearEq1: { a: 2, b: 1, c: 4 },
      linearEq2: { a: 1, b: -1, c: -1 },
    },
  },
  {
    id: 'parabola-concave-down-max',
    name: '5. Cực đại y_max = 4: y = -x² + 4',
    description: 'Bề lõm quay xuống a = -1 < 0, đỉnh I(0, 4), giá trị lớn nhất y = 4.',
    state: {
      activeTab: 'parabola',
      parabola: { a: -1, b: 0, c: 4 },
      line: { m: 1, n: 0 },
      showLine: false,
      probeX: 0,
      linearEq1: { a: 2, b: 1, c: 4 },
      linearEq2: { a: 1, b: -1, c: -1 },
    },
  },
  {
    id: 'parabola-line-tangent',
    name: '6. Đường thẳng tiếp xúc Parabol',
    description: 'Parabol y = x² và tiếp tuyến y = 2x - 1 tiếp xúc nhau tại điểm (1, 1).',
    state: {
      activeTab: 'parabola',
      parabola: { a: 1, b: 0, c: 0 },
      line: { m: 2, n: -1 },
      showLine: true,
      probeX: 1,
      linearEq1: { a: 2, b: 1, c: 4 },
      linearEq2: { a: 1, b: -1, c: -1 },
    },
  },
  {
    id: 'linear-unique-solution',
    name: '7. Hệ cắt nhau: 2x + y = 4 & x - y = -1',
    description: 'Hệ 2 phương trình có nghiệm duy nhất tại giao điểm M(1, 2). D = -3 ≠ 0.',
    state: {
      activeTab: 'linear-system',
      parabola: { a: 1, b: -4, c: 3 },
      line: { m: 1, n: 0 },
      showLine: false,
      probeX: 1,
      linearEq1: { a: 2, b: 1, c: 4 },
      linearEq2: { a: 1, b: -1, c: -1 },
    },
  },
  {
    id: 'linear-parallel-no-sol',
    name: '8. Hệ song song vô nghiệm: 2x + y = 3 & 2x + y = 7',
    description: 'Hai đường thẳng song song d1 // d2, D = 0, Dx = -4 ≠ 0, không có giao điểm.',
    state: {
      activeTab: 'linear-system',
      parabola: { a: 1, b: 0, c: 0 },
      line: { m: 1, n: 0 },
      showLine: false,
      probeX: 1,
      linearEq1: { a: 2, b: 1, c: 3 },
      linearEq2: { a: 2, b: 1, c: 7 },
    },
  },
  {
    id: 'linear-coincident-infinite',
    name: '9. Hệ trùng nhau vô số nghiệm: x - 2y = 3 & 2x - 4y = 6',
    description: 'Hai đường thẳng trùng nhau d1 ≡ d2, D = Dx = Dy = 0, có vô số nghiệm.',
    state: {
      activeTab: 'linear-system',
      parabola: { a: 1, b: 0, c: 0 },
      line: { m: 1, n: 0 },
      showLine: false,
      probeX: 1,
      linearEq1: { a: 1, b: -2, c: 3 },
      linearEq2: { a: 2, b: -4, c: 6 },
    },
  },
];
