import { PresetState } from '../../../types/simulation.types';
import { StatesOfMatterState } from './types';

export const STATES_PRESETS: PresetState<StatesOfMatterState>[] = [
  {
    id: 'preset-ice-solid',
    name: 'Nước đá thể rắn (-15°C)',
    description: 'Các phân tử nước dao động cố định tại các nút mạng tinh thể, hình dạng và thể tích xác định.',
    state: {
      substance: 'water',
      temperatureC: -15,
      pistonHeight: 0.8,
      isHeating: false,
      isCooling: false,
      showThermometer: true,
      showPressureGauge: true,
    },
  },
  {
    id: 'preset-water-liquid',
    name: 'Nước ở thể lỏng (25°C)',
    description: 'Nước ở nhiệt độ phòng, các phân tử linh hoạt trượt qua nhau, thể tích xác định nhưng hình dạng theo bình chứa.',
    state: {
      substance: 'water',
      temperatureC: 25,
      pistonHeight: 0.8,
      isHeating: false,
      isCooling: false,
      showThermometer: true,
      showPressureGauge: true,
    },
  },
  {
    id: 'preset-steam-gas',
    name: 'Hơi nước thể khí (130°C)',
    description: 'Các phân tử chuyển động hỗn loạn không ngừng, chiếm trọn toàn bộ thể tích bình chứa.',
    state: {
      substance: 'water',
      temperatureC: 130,
      pistonHeight: 0.8,
      isHeating: true,
      isCooling: false,
      showThermometer: true,
      showPressureGauge: true,
    },
  },
  {
    id: 'preset-compressed-gas',
    name: 'Khí nén áp suất cao (150°C, Piston 0.4)',
    description: 'Thể tích thu hẹp làm mật độ phân tử tăng cao, va chạm mạnh vào thành bình và piston.',
    state: {
      substance: 'water',
      temperatureC: 150,
      pistonHeight: 0.45,
      isHeating: false,
      isCooling: false,
      showThermometer: true,
      showPressureGauge: true,
    },
  },
];
