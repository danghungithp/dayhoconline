import { Quest } from '../../../types/simulation.types';
import { SmartHomeState } from './types';
import { calculateSmartHomeMetrics } from './smartHomeEngine';

export const SMART_HOME_QUESTS: Quest[] = [
  {
    id: 'quest-trigger-light',
    title: 'Kích hoạt đèn tự động khi trời tối',
    description: 'Bật chế độ Tự động (Auto Mode) và giảm ánh sáng môi trường xuống dưới 150 Lux để rơ-le đóng đèn.',
    xpReward: 20,
    targetCondition: (state: any) => {
      const s = state as SmartHomeState;
      const m = calculateSmartHomeMetrics(s);
      return s.isAutoMode && s.ambientLightLux <= 150 && m.relayState === 'CLOSED';
    },
  },
  {
    id: 'quest-trigger-fan',
    title: 'Kích hoạt quạt làm mát tự động theo nhiệt độ',
    description: 'Tăng nhiệt độ môi trường lên >= 33°C để kích hoạt hệ thống làm mát.',
    xpReward: 25,
    targetCondition: (state: any) => {
      const s = state as SmartHomeState;
      const m = calculateSmartHomeMetrics(s);
      return s.isAutoMode && s.temperatureC >= 33 && m.fanSpeedRpm > 0;
    },
  },
  {
    id: 'quest-motion-detection',
    title: 'Kích hoạt cảm biến chuyển động PIR',
    description: 'Bật trạng thái Phát hiện chuyển động (PIR Motion) để đèn phòng khách tự động sáng.',
    xpReward: 25,
    targetCondition: (state: any) => {
      const s = state as SmartHomeState;
      return s.motionDetected && s.isAutoMode;
    },
  },
  {
    id: 'quest-switch-schematic',
    title: 'Khảo sát sơ đồ nguyên lý mạch điện tử',
    description: 'Chuyển sang tab Sơ đồ nguyên lý mạch (Schematic View) để quan sát cầu phân áp LDR và Rơ-le điều khiển.',
    xpReward: 30,
    targetCondition: (state: any) => {
      const s = state as SmartHomeState;
      return s.viewMode === 'schematic-view';
    },
  },
];
