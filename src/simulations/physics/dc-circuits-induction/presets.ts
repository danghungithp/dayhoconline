import { PresetState } from '../../../types/simulation.types';

export const CIRCUIT_PRESETS: PresetState[] = [
  {
    id: 'preset-standard-series',
    name: 'Mạch nối tiếp tiêu chuẩn (U = 12V)',
    description: 'Hai điện trở mắc nối tiếp, quan sát sự phân chia hiệu điện thế U1, U2 và định luật bảo toàn dòng điện I = I1 = I2.',
    state: {
      mode: 'ohm-dc',
      switchClosed: true,
      voltage: 12,
      resistance1: 10,
      resistance2: 20,
      connection: 'series',
      showElectrons: true,
      showMeters: true,
    },
  },
  {
    id: 'preset-parallel-current-split',
    name: 'Mạch song song phân nhánh (U = 9V)',
    description: 'Khảo sát điện trở tương đương Rtd nhỏ hơn từng điện trở thành phần và dòng điện tổng I = I1 + I2.',
    state: {
      mode: 'ohm-dc',
      switchClosed: true,
      voltage: 9,
      resistance1: 15,
      resistance2: 30,
      connection: 'parallel',
      showElectrons: true,
      showMeters: true,
    },
  },
  {
    id: 'preset-induction-faraday',
    name: 'Thí nghiệm cảm ứng Faraday (N = 1000 vòng)',
    description: 'Di chuyển nam châm qua lại trong lòng cuộn dây để quan sát kim điện kế lệch và chiều dòng điện cảm ứng tuân theo Định luật Lenz.',
    state: {
      mode: 'electromagnetic-induction',
      coilTurns: 1000,
      magnetStrength: 4,
      magnetPositionX: -100,
      magnetVelocity: 40,
    },
  },
];
