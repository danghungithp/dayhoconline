import { PresetState } from '../../../types/simulation.types';

export const CELL_PRESETS: PresetState[] = [
  {
    id: 'preset-metaphase-plate',
    name: 'Kỳ giữa (Metaphase) — Xếp hàng xích đạo (2n = 4)',
    description: 'Quan sát các NST kép co xoắn cực đại và xếp thành một hàng phẳng ngay ngắn trên mặt phẳng xích đạo của thoi phân bào.',
    state: {
      phase: 'metaphase',
      phaseProgress: 0.5,
      chromosomeCount: 4,
      isPlaying: false,
      speed: 1,
      showSpindleFibers: true,
      showLabels: true,
    },
  },
  {
    id: 'preset-anaphase-split',
    name: 'Kỳ sau (Anaphase) — Phân ly về 2 cực',
    description: 'Quan sát các tâm động tách đôi, kéo 2 chromatid phân ly đồng đều về hai cực đối diện của tế bào.',
    state: {
      phase: 'anaphase',
      phaseProgress: 0.5,
      chromosomeCount: 4,
      isPlaying: false,
      speed: 1,
      showSpindleFibers: true,
      showLabels: true,
    },
  },
  {
    id: 'preset-telophase-cytokinesis',
    name: 'Kỳ cuối (Telophase) — Thắt eo phân chia 2 tế bào con',
    description: 'Màng nhân tái lập, tế bào chất thắt eo tại mặt phẳng phân chia để hình thành 2 tế bào con mang bộ NST 2n hoàn chỉnh.',
    state: {
      phase: 'telophase',
      phaseProgress: 0.8,
      chromosomeCount: 4,
      isPlaying: false,
      speed: 1,
      showSpindleFibers: false,
      showLabels: true,
    },
  },
];
