import { Quest } from '../../../types/simulation.types';
import { GeoEarthState } from './types';

export const GEOGRAPHY_QUESTS: Quest[] = [
  {
    id: 'quest-geo-1',
    title: 'Xác định ngày Hạ Chí (22/6)',
    description: 'Chỉnh góc quỹ đạo đến khoảng 90° (Hạ chí), quan sát Bắc bán cầu ngả nhiều nhất về phía Mặt Trời và nhận lượng nhiệt tối đa.',
    hint: 'Chỉnh thanh trượt Góc quỹ đạo về gần 90° hoặc bấm nút "Hạ Chí (22/6)".',
    xpReward: 25,
    targetCondition: (state: GeoEarthState) => {
      const norm = ((state.orbitAngleDeg % 360) + 360) % 360;
      return Math.abs(norm - 90) <= 18;
    },
  },
  {
    id: 'quest-geo-2',
    title: 'Khảo sát ngày Đông Chí (22/12)',
    description: 'Chỉnh góc quỹ đạo đến khoảng 270° (Đông chí), lúc này Mặt Trời chiếu thẳng góc vào Chí tuyến Nam, Bắc bán cầu bước vào Mùa Đông lạnh giá.',
    hint: 'Chỉnh thanh trượt Góc quỹ đạo về gần 270° hoặc bấm nút "Đông Chí (22/12)".',
    xpReward: 25,
    targetCondition: (state: GeoEarthState) => {
      const norm = ((state.orbitAngleDeg % 360) + 360) % 360;
      return Math.abs(norm - 270) <= 18;
    },
  },
  {
    id: 'quest-geo-3',
    title: 'Hiện tượng Ngày và Đêm dài bằng nhau',
    description: 'Dừng quỹ đạo tại ngày Xuân phân (0°) hoặc Thu phân (180°), khi Mặt Trời chiếu vuông góc vào đường Xích đạo (0°).',
    hint: 'Chỉnh góc về 0° (Xuân phân) hoặc 180° (Thu phân).',
    xpReward: 25,
    targetCondition: (state: GeoEarthState) => {
      const norm = ((state.orbitAngleDeg % 360) + 360) % 360;
      return norm <= 18 || norm >= 342 || Math.abs(norm - 180) <= 18;
    },
  },
  {
    id: 'quest-geo-4',
    title: 'Trái Đất tự quay quanh trục & Múi giờ Việt Nam (GMT+7)',
    description: 'Chuyển sang chế độ Ngày - Đêm & Múi Giờ, xoay Trái Đất để giờ tại Hà Nội đạt đúng khoảng 12:00 trưa (Mặt Trời đứng bóng).',
    hint: 'Chuyển sang tab Ngày Đêm & Múi Giờ và xoay trục để giờ Hà Nội gần 12:00.',
    xpReward: 25,
    targetCondition: (state: GeoEarthState) => {
      const hanoiHour = (state.rotationHour + 7) % 24;
      return state.mode === 'day-night-rotation' && Math.abs(hanoiHour - 12) <= 1.2;
    },
  },
];
