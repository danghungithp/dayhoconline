import { ProjectileParams, TrajectorySummary } from './physicsSolver';

export interface ProjectileSimulationState {
  params: ProjectileParams;
  summary: TrajectorySummary;
  currentTime: number;
  isRunning: boolean;
  hasFired: boolean;
  targetX: number;
  hitTarget: boolean;
  hasVisitedMoon?: boolean;
}

export interface ProjectileQuest {
  id: string;
  title: string;
  description: string;
  hint: string;
  xpReward: number;
  checkCompleted: (state: ProjectileSimulationState) => boolean;
  targetCondition: (state: any) => boolean;
}

export const PROJECTILE_QUESTS: ProjectileQuest[] = [
  {
    id: 'quest-hit-target',
    title: 'Nhiệm vụ 1: Bắn trúng hồng tâm mục tiêu (Target = 40m)',
    description: 'Điều chỉnh vận tốc đầu v0 và góc bắn α để điểm rơi của vật cách bia mục tiêu (x = 40m) trong khoảng sai số cho phép ±1.5m.',
    hint: 'Công thức tầm xa chân không: L = (v0² · sin(2α)) / g. Với g = 9.8 và L = 40m, nếu chọn α = 45° thì v0 ≈ 19.8 m/s!',
    xpReward: 35,
    checkCompleted: state => {
      if (!state.hasFired) return false;
      const targetDist = Math.abs(state.summary.maxRange - state.targetX);
      return targetDist <= 1.5;
    },
    targetCondition: (state: any) => {
      const summary = state.summary;
      const targetX = state.targetX || 40;
      if (!summary) return false;
      return Math.abs(summary.maxRange - targetX) <= 1.5;
    },
  },
  {
    id: 'quest-max-height-window',
    title: 'Nhiệm vụ 2: Chạm trần độ cao cực đại (H_max ∈ [20m, 25m])',
    description: 'Thiết lập thông số phóng sao cho tầm cao cực đại H_max đạt trong khoảng từ 20.0m đến 25.0m.',
    hint: 'H_max = y0 + (v0 · sin α)² / (2g). Hãy thử tăng góc bắn lên 60° - 75° và điều chỉnh v0 quanh mức 22 - 25 m/s.',
    xpReward: 35,
    checkCompleted: state => {
      const h = state.summary.maxHeight;
      return h >= 20.0 && h <= 25.0;
    },
    targetCondition: (state: any) => {
      const h = state.summary?.maxHeight;
      return h >= 20.0 && h <= 25.0;
    },
  },
  {
    id: 'quest-moon-gravity',
    title: 'Nhiệm vụ 3: Chinh phục trọng lực Mặt Trăng (g = 1.62 m/s²)',
    description: 'Chuyển môi trường trọng lực sang Mặt Trăng (g = 1.62 m/s²). Quan sát xem tầm xa bay L_max tăng vọt gấp khoảng 6 lần so với Trái Đất!',
    hint: 'Trong bảng điều khiển, nhấp vào nút preset "Mặt Trăng (1.62 m/s²)" rồi bấm Phóng!',
    xpReward: 40,
    checkCompleted: state => {
      return Math.abs(state.params.g - 1.62) < 0.1 && state.summary.maxRange > 80;
    },
    targetCondition: (state: any) => {
      const g = state.params?.g;
      const range = state.summary?.maxRange;
      return g && Math.abs(g - 1.62) < 0.1 && range > 80;
    },
  },
  {
    id: 'quest-conservation-energy',
    title: 'Nhiệm vụ 4: Kiểm chứng Bảo toàn cơ năng (W = Wd + Wt)',
    description: 'Tắt lực cản không khí (k = 0), phóng đạn và quan sát thanh năng lượng: tổng cơ năng W luôn là một hằng số không đổi suốt quỹ đạo!',
    hint: 'Kéo thanh trượt "Lực cản không khí" về 0, bấm Phóng và theo dõi cột cơ năng W màu xanh lá cây giữ nguyên độ dài.',
    xpReward: 50,
    checkCompleted: state => {
      return state.params.dragCoeff <= 0.001 && state.hasFired;
    },
    targetCondition: (state: any) => {
      return state.params?.dragCoeff <= 0.001 && (state.hasFired || state.currentTime > 0.5);
    },
  },
];
