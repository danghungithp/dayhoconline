import { Quest } from '../../../types/simulation.types';
import { IdentitiesState } from './types';
import { analyzeTwoLines } from './algebraEngine';

export const IDENTITIES_QUESTS: Quest[] = [
  {
    id: 'quest-sum-square',
    title: 'Khám phá (a + b)² = a² + 2ab + b²',
    description: 'Chọn hằng đẳng thức "Bình phương một tổng", điều chỉnh a = 4 và b = 3 để quan sát 4 mảnh diện tích ghép thành hình vuông cạnh 7 (diện tích 49).',
    hint: 'Chọn (a + b)², chỉnh a = 4 và b = 3.',
    xpReward: 25,
    targetCondition: (state: IdentitiesState) =>
      state.activeTab === 'identities' &&
      state.identityType === 'square-sum' &&
      state.paramA === 4 &&
      state.paramB === 3,
  },
  {
    id: 'quest-diff-squares',
    title: 'Ghép hình a² - b² = (a - b)(a + b)',
    description: 'Chọn "Hiệu hai bình phương", đặt a = 5, b = 2 và kéo thanh trượt "Tiến độ ghép" đến trên 90% để ghép mảnh L thành hình chữ nhật 3 × 7 = 21.',
    hint: 'Chọn a² - b², chỉnh a = 5, b = 2 và kéo tiến độ ghép >= 85%.',
    xpReward: 25,
    targetCondition: (state: IdentitiesState) =>
      state.activeTab === 'identities' &&
      state.identityType === 'diff-squares' &&
      state.paramA === 5 &&
      state.paramB === 2 &&
      state.unfoldProgress >= 0.85,
  },
  {
    id: 'quest-func-increasing',
    title: 'Hàm số đồng biến y = ax + b',
    description: 'Chuyển sang tab "Đồ thị hàm số", điều chỉnh hệ số góc a > 0 và tung độ gốc b = 2 để quan sát đường thẳng dốc lên từ trái sang phải.',
    hint: 'Tab Đồ thị hàm số, a > 0 và b = 2.',
    xpReward: 25,
    targetCondition: (state: IdentitiesState) =>
      state.activeTab === 'linear-func' &&
      state.slope1 > 0 &&
      state.intercept1 === 2,
  },
  {
    id: 'quest-func-parallel',
    title: 'Hai đường thẳng song song (d₁ // d₂)',
    description: 'Chuyển sang tab "Hai đường thẳng", điều chỉnh để a₁ = a₂ = 2 và b₁ ≠ b₂ để hai đường thẳng không có điểm chung.',
    hint: 'Đặt a₁ = 2 và a₂ = 2 (với b₁ khác b₂).',
    xpReward: 25,
    targetCondition: (state: IdentitiesState) => {
      const rel = analyzeTwoLines(state.slope1, state.intercept1, state.slope2, state.intercept2);
      return state.activeTab === 'two-lines' && rel.status === 'parallel' && state.slope1 === 2;
    },
  },
  {
    id: 'quest-func-perpendicular',
    title: 'Hai đường thẳng vuông góc (d₁ ⊥ d₂)',
    description: 'Điều chỉnh hệ số góc sao cho tích a₁ · a₂ = -1 (ví dụ a₁ = 2 và a₂ = -0.5) để hai đường thẳng cắt nhau ở góc 90°.',
    hint: 'Nhấn nút nhanh "Vuông góc" hoặc chỉnh a₁ = 2, a₂ = -0.5.',
    xpReward: 25,
    targetCondition: (state: IdentitiesState) => {
      const rel = analyzeTwoLines(state.slope1, state.intercept1, state.slope2, state.intercept2);
      return state.activeTab === 'two-lines' && rel.status === 'perpendicular';
    },
  },
];

