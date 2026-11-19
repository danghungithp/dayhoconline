import { Quest } from '../../../types/simulation.types';
import { OpticsAudioState } from './types';

export const OPTICS_SOUND_QUESTS: Quest[] = [
  {
    id: 'quest-reflection-45',
    title: 'Định luật phản xạ: Góc tới i = 45°',
    description: 'Điều chỉnh góc tới của tia laser đạt chính xác i = 45° (hoặc -45°) trên gương phẳng để kiểm chứng góc phản xạ i\' = 45°.',
    hint: 'Kéo đèn laser hoặc chỉnh thanh trượt Góc tới về đúng 45° khi ở chế độ Gương phẳng.',
    xpReward: 25,
    targetCondition: (state: OpticsAudioState) =>
      state.activeTab === 'optics' &&
      state.mirrorType === 'plane' &&
      Math.abs(state.incidentAngleDeg) === 45,
  },
  {
    id: 'quest-normal-incidence',
    title: 'Tia sáng vuông góc mặt gương (i = 0°)',
    description: 'Chiếu tia laser vuông góc với mặt gương (i = 0°), quan sát tia phản xạ truyền ngược trở lại theo đúng phương pháp tuyến.',
    hint: 'Chỉnh thanh trượt Góc tới về đúng 0° (trùng với phương pháp tuyến N).',
    xpReward: 25,
    targetCondition: (state: OpticsAudioState) =>
      state.activeTab === 'optics' &&
      state.mirrorType === 'plane' &&
      state.incidentAngleDeg === 0,
  },
  {
    id: 'quest-treble-sound',
    title: 'Khám phá Âm bổng & Tần số cao',
    description: 'Chuyển sang tab Âm thanh và điều chỉnh tần số f ≥ 1000 Hz để quan sát các chu kỳ sóng sít nhau và phân loại Âm bổng (Treble).',
    hint: 'Nhấp sang tab Âm thanh và kéo thanh trượt Tần số lên mức 1000 Hz trở lên.',
    xpReward: 25,
    targetCondition: (state: OpticsAudioState) =>
      state.activeTab === 'sound' && state.frequency >= 1000,
  },
  {
    id: 'quest-loudness-amplitude',
    title: 'Độ to của âm & Biên độ dao động',
    description: 'Điều chỉnh biên độ âm thanh A ≥ 80% và bật phát âm thanh để quan sát biên độ dao động lớn ứng với âm phát ra to.',
    hint: 'Kéo Biên độ lên từ 80% trở lên và đảm bảo nút Phát âm thanh được kích hoạt.',
    xpReward: 25,
    targetCondition: (state: OpticsAudioState) =>
      state.activeTab === 'sound' && state.amplitude >= 80 && state.isPlaying === true,
  },
];
