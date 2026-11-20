import { SmartHomeState } from './types';

export interface SmartHomeOutputMetrics {
  ldrResistanceKohm: number; // Điện trở quang trở LDR (kOhm)
  sensorVoltageV: number; // Điện áp cầu phân áp (V)
  relayState: 'OPEN' | 'CLOSED';
  fanSpeedRpm: number;
  totalEnergyWatts: number;
}

export function calculateSmartHomeMetrics(state: SmartHomeState): SmartHomeOutputMetrics {
  const {
    ambientLightLux,
    temperatureC,
    motionDetected,
    lightThresholdLux,
    tempThresholdC,
    isAutoMode,
  } = state;

  // LDR đặc tính: Trời tối (Lux thấp) -> R_LDR rất lớn (~50k - 100k)
  // Trời sáng (Lux cao) -> R_LDR giảm mạnh (~0.5k - 2k)
  const ldrR = Math.max(0.5, Number((1000 / (ambientLightLux + 10)).toFixed(2)));

  // Cầu phân áp với R_fixed = 10kOhm, Vcc = 5V
  // V_out = Vcc * (R_fixed / (R_LDR + R_fixed))
  const rFixed = 10;
  const vOut = Number((5 * (rFixed / (ldrR + rFixed))).toFixed(2));

  let balconyLight = state.isBalconyLightOn;
  let livingLight = state.isLivingRoomLightOn;
  let fanOn = state.isCoolingFanOn;

  if (isAutoMode) {
    // Tự động bật đèn ban công khi trời tối (dưới ngưỡng Lux)
    balconyLight = ambientLightLux <= lightThresholdLux;
    // Tự động bật đèn phòng khi phát hiện chuyển động
    livingLight = motionDetected;
    // Tự động bật quạt khi nhiệt độ vượt ngưỡng
    fanOn = temperatureC >= tempThresholdC;
  }

  const relayState = balconyLight ? 'CLOSED' : 'OPEN';
  const fanSpeedRpm = fanOn ? Math.min(2400, Math.round(1000 + (temperatureC - 30) * 120)) : 0;

  let watts = 0;
  if (balconyLight) watts += 15; // LED 15W
  if (livingLight) watts += 25; // LED 25W
  if (fanOn) watts += 45; // Quạt 45W

  return {
    ldrResistanceKohm: ldrR,
    sensorVoltageV: vOut,
    relayState,
    fanSpeedRpm,
    totalEnergyWatts: watts,
  };
}
