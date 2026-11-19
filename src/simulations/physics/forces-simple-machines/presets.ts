import { PresetState } from '../../../types/simulation.types';
import { ForcesMachineState } from './types';

export const FORCES_PRESETS: PresetState<ForcesMachineState>[] = [
  {
    id: 'preset-hooke-std',
    name: 'Lò xo Hooke (m = 200g, k = 50 N/m)',
    description: 'Thí nghiệm độ biến dạng lò xo tỉ lệ thuận với độ lớn lực đàn hồi: Fđh = k · Δl.',
    state: {
      mode: 'spring',
      springConstant: 50,
      massGrams: 200,
      gravity: 9.8,
      loadForceN: 40,
      loadArmM: 1.0,
      effortArmM: 2.0,
      inclineAngleDeg: 30,
      inclineHeightM: 1.5,
      boxMassKg: 20,
    },
  },
  {
    id: 'preset-lever-balance',
    name: 'Đòn bẩy lợi 2 lần về lực (d₂ = 2d₁)',
    description: 'Vật nặng 40N ở khoảng cách 1m, chỉ cần lực nâng 20N ở khoảng cách 2m.',
    state: {
      mode: 'lever',
      springConstant: 50,
      massGrams: 200,
      gravity: 9.8,
      loadForceN: 40,
      loadArmM: 1.0,
      effortArmM: 2.0,
      inclineAngleDeg: 30,
      inclineHeightM: 1.5,
      boxMassKg: 20,
    },
  },
  {
    id: 'preset-incline-ramp',
    name: 'Mặt phẳng nghiêng 30° (Giảm 50% lực)',
    description: 'Kéo xe 20kg lên cao 1.5m với góc dốc 30°, lực kéo giảm 2 lần so với nâng thẳng đứng.',
    state: {
      mode: 'incline',
      springConstant: 50,
      massGrams: 200,
      gravity: 9.8,
      loadForceN: 40,
      loadArmM: 1.0,
      effortArmM: 2.0,
      inclineAngleDeg: 30,
      inclineHeightM: 1.5,
      boxMassKg: 20,
    },
  },
];
