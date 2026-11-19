import { Quest } from '../../../types/simulation.types';
import { StatesOfMatterState } from './types';

export const STATES_QUESTS: Quest[] = [
  {
    id: 'quest-solid-state',
    title: 'Tạo thể rắn (Băng đá < 0°C)',
    description: 'Làm lạnh nước xuống dưới 0°C để quan sát các phân tử xếp thành mạng tinh thể cố định ở thể rắn.',
    hint: 'Kéo thanh trượt Nhiệt độ hoặc bấm "Làm lạnh" xuống dưới 0°C.',
    xpReward: 25,
    targetCondition: (state: StatesOfMatterState) =>
      state.substance === 'water' && state.temperatureC < 0,
  },
  {
    id: 'quest-boil-to-gas',
    title: 'Đun sôi chuyển sang thể khí (≥ 100°C)',
    description: 'Đun nóng nước vượt qua nhiệt độ sôi 100°C để các hạt bay tự do hỗn loạn chiếm trọn không gian bình.',
    hint: 'Bật "Đun nóng" hoặc chỉnh Nhiệt độ lên từ 100°C trở lên.',
    xpReward: 25,
    targetCondition: (state: StatesOfMatterState) =>
      state.substance === 'water' && state.temperatureC >= 100,
  },
  {
    id: 'quest-high-pressure',
    title: 'Tăng áp suất chất khí (Nén piston)',
    description: 'Nén piston xuống (giảm thể tích bình chứa ≤ 0.6) ở thể khí để quan sát các hạt va chạm dồn dập vào thành bình.',
    hint: 'Đưa nhiệt độ lên thể khí và kéo thanh Piston xuống mức 0.6 hoặc thấp hơn.',
    xpReward: 25,
    targetCondition: (state: StatesOfMatterState) =>
      state.temperatureC >= 100 && state.pistonHeight <= 0.6,
  },
  {
    id: 'quest-liquid-state',
    title: 'Trạng thái lỏng của nước (25°C - 80°C)',
    description: 'Điều chỉnh nhiệt độ nước trong khoảng 25°C - 80°C để quan sát các phân tử trượt linh hoạt quanh nhau.',
    hint: 'Chỉnh thanh trượt nhiệt độ về khoảng 25°C đến 80°C.',
    xpReward: 25,
    targetCondition: (state: StatesOfMatterState) =>
      state.substance === 'water' && state.temperatureC >= 25 && state.temperatureC <= 80,
  },
];
