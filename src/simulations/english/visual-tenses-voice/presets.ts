import { PresetState } from '../../../types/simulation.types';
import { TenseId } from './grammarEngine';

export interface EnglishPresetConfig {
  mode: 'timeline' | 'transformer';
  selectedTense: TenseId;
  passiveTenseKey: string;
  isPassiveVoice: boolean;
  selectedVerbBase: string;
}

export const ENGLISH_PRESETS: PresetState<EnglishPresetConfig>[] = [
  {
    id: 'preset-present-continuous',
    name: '1. Hiện tại tiếp diễn (Ngay tại mốc NOW)',
    description: 'Khảo sát hành động đang diễn ra xung quanh thời điểm nói (Right now / At the moment).',
    state: {
      mode: 'timeline',
      selectedTense: 'present-continuous',
      passiveTenseKey: 'present-continuous',
      isPassiveVoice: false,
      selectedVerbBase: 'build',
    },
  },
  {
    id: 'preset-past-continuous',
    name: '2. Quá khứ tiếp diễn (Tại thời điểm xác định quá khứ)',
    description: 'Hành động đang diễn ra tại một mốc cụ thể trong quá khứ (At 8 PM yesterday).',
    state: {
      mode: 'timeline',
      selectedTense: 'past-continuous',
      passiveTenseKey: 'past-continuous',
      isPassiveVoice: false,
      selectedVerbBase: 'eat',
    },
  },
  {
    id: 'preset-present-perfect',
    name: '3. Hiện tại hoàn thành (Cầu nối quá khứ - hiện tại)',
    description: 'Hành động bắt đầu từ quá khứ, kéo dài hoặc có kết quả để lại ở hiện tại (since/for).',
    state: {
      mode: 'timeline',
      selectedTense: 'present-perfect',
      passiveTenseKey: 'present-perfect',
      isPassiveVoice: false,
      selectedVerbBase: 'write',
    },
  },
  {
    id: 'preset-passive-build-school',
    name: '4. Biến đổi Bị động: Xây trường học (Past Simple)',
    description: 'Chủ động: "The workers built a new school" -> Bị động: "A new school was built by the workers".',
    state: {
      mode: 'transformer',
      selectedTense: 'past-simple',
      passiveTenseKey: 'past-simple',
      isPassiveVoice: true,
      selectedVerbBase: 'build',
    },
  },
  {
    id: 'preset-passive-modal-must',
    name: '5. Biến đổi Bị động với Modal Verb (Must)',
    description: 'Chủ động: "The students must finish homework" -> Bị động: "The homework must be finished".',
    state: {
      mode: 'transformer',
      selectedTense: 'present-simple',
      passiveTenseKey: 'modal-must',
      isPassiveVoice: true,
      selectedVerbBase: 'clean',
    },
  },
];
