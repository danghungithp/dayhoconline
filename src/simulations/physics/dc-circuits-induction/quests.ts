import { Quest } from '../../../types/simulation.types';
import { DcCircuitState } from './types';
import { calculateCircuitMetrics } from './circuitEngine';

export const CIRCUIT_QUESTS: Quest[] = [
  {
    id: 'quest-close-switch',
    title: 'Đóng khóa K tạo mạch kín',
    description: 'Bật công tắc điện (Đóng khóa K) để dòng electron bắt đầu dịch chuyển trong mạch.',
    xpReward: 15,
    targetCondition: (state: any) => {
      const s = state as DcCircuitState;
      return s.mode === 'ohm-dc' && s.switchClosed && s.voltage > 0;
    },
  },
  {
    id: 'quest-series-ohm',
    title: 'Khảo sát định luật Ôm mạch nối tiếp',
    description: 'Thiết lập mạch nối tiếp với U >= 12V và điện trở tương đương Rtd >= 25Ω.',
    xpReward: 25,
    targetCondition: (state: any) => {
      const s = state as DcCircuitState;
      if (s.mode !== 'ohm-dc' || !s.switchClosed || s.connection !== 'series') return false;
      const metrics = calculateCircuitMetrics(s);
      return s.voltage >= 12 && metrics.equivalentResistance >= 25;
    },
  },
  {
    id: 'quest-parallel-low-r',
    title: 'Kiểm nghiệm điện trở tương đương mạch song song',
    description: 'Chuyển sang chế độ Mạch song song và điều chỉnh để điện trở tương đương Rtd < 10Ω.',
    xpReward: 30,
    targetCondition: (state: any) => {
      const s = state as DcCircuitState;
      if (s.mode !== 'ohm-dc' || !s.switchClosed || s.connection !== 'parallel') return false;
      const metrics = calculateCircuitMetrics(s);
      return metrics.equivalentResistance < 10;
    },
  },
  {
    id: 'quest-faraday-induction',
    title: 'Tạo dòng điện cảm ứng xoay chiều',
    description: 'Chuyển sang tab Cảm ứng điện từ và dịch chuyển nam châm tạo độ lớn dòng cảm ứng |I_cảm_ứng| >= 15mA.',
    xpReward: 30,
    targetCondition: (state: any) => {
      const s = state as DcCircuitState;
      if (s.mode !== 'electromagnetic-induction') return false;
      const metrics = calculateCircuitMetrics(s);
      return Math.abs(metrics.inducedCurrent) >= 15;
    },
  },
];
