import { PresetState } from '../../../types/simulation.types';
import { BuoyancyOpticsState } from './types';

export const BUOYANCY_PRESETS: PresetState<BuoyancyOpticsState>[] = [
  {
    id: 'preset-floating-wood-water',
    name: 'Khối gỗ nổi trên nước ngọt',
    description: 'Khối gỗ (700 kg/m³) nổi trên nước ngọt (1000 kg/m³), chìm đúng 70% thể tích.',
    state: {
      activeTab: 'buoyancy',
      liquidType: 'water',
      material: 'wood',
      blockVolumeLiters: 2.0,
      focalLengthCm: 15,
      objectDistanceCm: 30,
      objectHeightCm: 4,
      showSpecialRays: true,
    },
  },
  {
    id: 'preset-sinking-iron',
    name: 'Khối sắt chìm trong nước',
    description: 'Sắt (7800 kg/m³) nặng hơn nước rất nhiều, trọng lực P lớn hơn nhiều lực đẩy FA nên chìm xuống đáy.',
    state: {
      activeTab: 'buoyancy',
      liquidType: 'water',
      material: 'iron',
      blockVolumeLiters: 2.0,
      focalLengthCm: 15,
      objectDistanceCm: 30,
      objectHeightCm: 4,
      showSpecialRays: true,
    },
  },
  {
    id: 'preset-lens-real-equal',
    name: 'Thấu kính hội tụ (d = 2f = 30cm)',
    description: 'Vật cách thấu kính d = 2f tạo ảnh thật cách thấu kính d\' = 2f, ngược chiều và bằng đúng vật.',
    state: {
      activeTab: 'lens',
      liquidType: 'water',
      material: 'wood',
      blockVolumeLiters: 2.0,
      focalLengthCm: 15,
      objectDistanceCm: 30,
      objectHeightCm: 4,
      showSpecialRays: true,
    },
  },
  {
    id: 'preset-magnifying-virtual',
    name: 'Kính lúp tạo ảnh ảo (d = 8cm < f = 15cm)',
    description: 'Vật đặt trong khoảng tiêu cự thấu kính hội tụ tạo ảnh ảo cùng chiều và phóng đại lớn hơn vật.',
    state: {
      activeTab: 'lens',
      liquidType: 'water',
      material: 'wood',
      blockVolumeLiters: 2.0,
      focalLengthCm: 15,
      objectDistanceCm: 8,
      objectHeightCm: 3,
      showSpecialRays: true,
    },
  },
];
