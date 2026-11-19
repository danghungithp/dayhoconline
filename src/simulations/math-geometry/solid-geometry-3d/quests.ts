import { SolidType, SolidGeometryOutput } from './geometryMath';

export interface SolidGeometryState {
  solidType: SolidType;
  baseDimension: number;
  height: number;
  unfoldProgress: number; // 0 to 1
  outputs: SolidGeometryOutput;
  showLabels: boolean;
  showAltitude: boolean;
  showWireframe: boolean;
  showGrid: boolean;
  opacity: number;
}

export interface SolidQuest {
  id: string;
  title: string;
  description: string;
  hint: string;
  xpReward: number;
  checkCompleted: (state: SolidGeometryState) => boolean;
  targetCondition: (state: any) => boolean;
}

export const SOLID_GEOMETRY_QUESTS: SolidQuest[] = [
  {
    id: 'quest-pyramid-volume-100',
    title: 'Nhiệm vụ 1: Thể tích Kim tự tháp mục tiêu V ≈ 100',
    description: 'Chọn Hình chóp tứ giác đều, điều chỉnh cạnh đáy a và chiều cao h sao cho thể tích V nằm trong khoảng từ 95 đến 105.',
    hint: 'Gợi ý: V = (1/3) · a² · h. Nếu chọn a = 6 thì a² = 36, chiều cao h ≈ 8.33; hoặc chọn a = 5 thì h = 12.',
    xpReward: 30,
    checkCompleted: state => {
      return (
        state.solidType === 'square-pyramid' &&
        state.outputs.volume >= 95 &&
        state.outputs.volume <= 105
      );
    },
    targetCondition: (state: any) => {
      return (
        state.solidType === 'square-pyramid' &&
        state.outputs?.volume >= 95 &&
        state.outputs?.volume <= 105
      );
    },
  },
  {
    id: 'quest-net-unfolding',
    title: 'Nhiệm vụ 2: Trải phẳng hoàn toàn hình học (Net Unfolding)',
    description: 'Kéo thanh trượt "Mức độ trải phẳng" đạt trên 95% để mở bung hoàn toàn các mặt xung quanh lên mặt phẳng 2D.',
    hint: 'Kéo thanh trượt "Trải phẳng" sang tận cùng bên phải (≥ 95%) để quan sát mạng lưới hình phẳng (Net).',
    xpReward: 35,
    checkCompleted: state => {
      return state.unfoldProgress >= 0.95;
    },
    targetCondition: (state: any) => {
      return state.unfoldProgress >= 0.95;
    },
  },
  {
    id: 'quest-ratio-one-third',
    title: 'Nhiệm vụ 3: Tỉ lệ 1/3 thần kỳ (Chóp vs Lăng trụ)',
    description: 'Chọn khối Hình chóp tam giác đều hoặc Lăng trụ tam giác, so sánh thể tích để kiểm chứng định lý: V(chóp) = (1/3) · V(lăng trụ).',
    hint: 'Chuyển đổi qua lại giữa "Hình chóp tam giác đều" và "Hình lăng trụ đứng tam giác" với cùng cạnh a và chiều cao h để thấy thể tích gấp đúng 3 lần.',
    xpReward: 40,
    checkCompleted: state => {
      return (
        state.solidType === 'triangular-prism' ||
        state.solidType === 'triangular-pyramid'
      );
    },
    targetCondition: (state: any) => {
      return (
        state.solidType === 'triangular-prism' ||
        state.solidType === 'triangular-pyramid'
      );
    },
  },
  {
    id: 'quest-cone-generator-10',
    title: 'Nhiệm vụ 4: Đường sinh hình nón l = 10 (Bộ ba Pythagore)',
    description: 'Chọn Hình nón và điều chỉnh bán kính đáy r và chiều cao h sao cho đường sinh l = √(r² + h²) = 10 (±0.2).',
    hint: 'Áp dụng bộ ba số Pythagore: 6² + 8² = 10²! Hãy chỉnh r = 6 và h = 8 (hoặc r = 8 và h = 6).',
    xpReward: 50,
    checkCompleted: state => {
      return (
        state.solidType === 'cone' &&
        Math.abs(state.outputs.slantHeightOrGenerator - 10) <= 0.2
      );
    },
    targetCondition: (state: any) => {
      return (
        state.solidType === 'cone' &&
        state.outputs &&
        Math.abs(state.outputs.slantHeightOrGenerator - 10) <= 0.2
      );
    },
  },
];
