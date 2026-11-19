import { PresetState } from '../../../types/simulation.types';
import { ProjectileParams } from './physicsSolver';

export interface ProjectilePresetConfig {
  params: ProjectileParams;
  targetX: number;
}

export const PROJECTILE_PRESETS: PresetState<ProjectilePresetConfig>[] = [
  {
    id: 'preset-standard-45',
    name: '1. Góc ném 45° tối ưu tầm xa (Trái Đất)',
    description: 'Theo lý thuyết vật lý lớp 10, trong chân không góc 45° cho tầm bay xa cực đại L = v0²/g.',
    state: {
      params: {
        v0: 20,
        angleDeg: 45,
        y0: 0,
        g: 9.80665,
        m: 1.0,
        dragCoeff: 0,
      },
      targetX: 40.8,
    },
  },
  {
    id: 'preset-cliff-launch',
    name: '2. Ném từ vách núi cao 12m',
    description: 'Vật xuất phát từ độ cao ban đầu y0 = 12m, làm tăng thời gian bay và tầm xa rơi xuống mặt đất.',
    state: {
      params: {
        v0: 16,
        angleDeg: 35,
        y0: 12,
        g: 9.80665,
        m: 1.5,
        dragCoeff: 0,
      },
      targetX: 34.5,
    },
  },
  {
    id: 'preset-moon-gravity',
    name: '3. Phóng đại bác trên Mặt Trăng (g = 1.62)',
    description: 'Trọng lực yếu khiến gia tốc rơi tự do rất nhỏ, đạn bay cao vút và vươn xa gấp 6 lần Trái Đất.',
    state: {
      params: {
        v0: 20,
        angleDeg: 45,
        y0: 0,
        g: 1.62,
        m: 1.0,
        dragCoeff: 0,
      },
      targetX: 120,
    },
  },
  {
    id: 'preset-heavy-drag',
    name: '4. Lực cản không khí mạnh (Quỹ đạo lệch)',
    description: 'Lực cản khí động học làm suy giảm cơ năng nhanh chóng, nhánh đi xuống dốc hơn nhiều so với nhánh đi lên.',
    state: {
      params: {
        v0: 30,
        angleDeg: 55,
        y0: 0,
        g: 9.80665,
        m: 0.5,
        dragCoeff: 0.05,
      },
      targetX: 40,
    },
  },
  {
    id: 'preset-target-challenge',
    name: '5. Thử thách trúng hồng tâm 40m',
    description: 'Cấu hình hoàn hảo v0 = 19.8 m/s, góc 45° đưa điểm rơi chính xác vào giữa bia mục tiêu.',
    state: {
      params: {
        v0: 19.8,
        angleDeg: 45,
        y0: 0,
        g: 9.80665,
        m: 1.0,
        dragCoeff: 0,
      },
      targetX: 40,
    },
  },
];
