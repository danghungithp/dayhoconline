import { Quest } from '../../../types/simulation.types';
import { BuoyancyOpticsState } from './types';

export const BUOYANCY_QUESTS: Quest[] = [
  {
    id: 'quest-floating-wood',
    title: 'Vật nổi trên nước (Khối gỗ)',
    description: 'Chọn chất lỏng Nước ngọt và vật liệu Gỗ để kiểm chứng trạng thái vật nổi khi FA = P.',
    hint: 'Chọn tab Lực đẩy Ác-si-mét, chất lỏng = Nước ngọt và vật liệu = Gỗ.',
    xpReward: 25,
    targetCondition: (state: BuoyancyOpticsState) =>
      state.activeTab === 'buoyancy' &&
      state.liquidType === 'water' &&
      state.material === 'wood',
  },
  {
    id: 'quest-sinking-metal',
    title: 'Vật chìm xuống đáy (Kim loại)',
    description: 'Thả khối vật liệu Nhôm hoặc Sắt (khối lượng riêng lớn hơn chất lỏng) để quan sát vật chìm hoàn toàn xuống đáy.',
    hint: 'Chọn vật liệu Nhôm hoặc Sắt.',
    xpReward: 25,
    targetCondition: (state: BuoyancyOpticsState) =>
      state.activeTab === 'buoyancy' &&
      (state.material === 'aluminum' || state.material === 'iron'),
  },
  {
    id: 'quest-lens-2f-equal',
    title: 'Ảnh thật bằng đúng vật (d = 2f)',
    description: 'Chuyển sang tab Thấu kính, đặt tiêu cự f = 15 cm và khoảng cách d = 30 cm để tạo ảnh thật A\'B\' ngược chiều bằng đúng vật.',
    hint: 'Chỉnh f = 15 cm và d = 30 cm.',
    xpReward: 25,
    targetCondition: (state: BuoyancyOpticsState) =>
      state.activeTab === 'lens' &&
      state.focalLengthCm === 15 &&
      state.objectDistanceCm === 30,
  },
  {
    id: 'quest-magnifying-glass',
    title: 'Ứng dụng kính lúp: Ảnh ảo (d < f)',
    description: 'Đặt vật sáng nằm trong khoảng tiêu cự (d < f) để tạo ảnh ảo cùng chiều lớn hơn vật.',
    hint: 'Kéo khoảng cách d nhỏ hơn tiêu cự f (ví dụ d = 8 cm, f = 15 cm).',
    xpReward: 25,
    targetCondition: (state: BuoyancyOpticsState) =>
      state.activeTab === 'lens' && state.objectDistanceCm < state.focalLengthCm,
  },
];
