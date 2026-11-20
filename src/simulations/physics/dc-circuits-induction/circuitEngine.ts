import { DcCircuitState } from './types';

export interface CircuitMetrics {
  equivalentResistance: number; // Rtd (Ohm)
  totalCurrent: number; // I_total (A)
  voltage1: number; // U1 (V)
  voltage2: number; // U2 (V)
  current1: number; // I1 (A)
  current2: number; // I2 (A)
  totalPower: number; // P = U*I (Watt)
  bulbBrightness: number; // 0 to 1
  isBulbBlown: boolean;
  inducedEmf: number; // Suất điện động cảm ứng (V)
  inducedCurrent: number; // Dòng cảm ứng qua cuộn dây (mA)
  flux: number; // Từ thông Phi qua cuộn dây (Wb tương đối)
}

export function calculateCircuitMetrics(state: DcCircuitState): CircuitMetrics {
  const {
    switchClosed,
    voltage,
    resistance1,
    resistance2,
    connection,
    bulbRatedVoltage,
    magnetPositionX,
    magnetVelocity,
    coilTurns,
    magnetStrength,
  } = state;

  if (!switchClosed || voltage <= 0) {
    // Mạch hở hoặc không có nguồn
    return {
      equivalentResistance: connection === 'series' ? resistance1 + resistance2 : (resistance1 * resistance2) / (resistance1 + resistance2),
      totalCurrent: 0,
      voltage1: 0,
      voltage2: 0,
      current1: 0,
      current2: 0,
      totalPower: 0,
      bulbBrightness: 0,
      isBulbBlown: false,
      inducedEmf: 0,
      inducedCurrent: 0,
      flux: calculateMagneticFlux(magnetPositionX, magnetStrength),
    };
  }

  let rEq = 0;
  let iTotal = 0;
  let u1 = 0;
  let u2 = 0;
  let i1 = 0;
  let i2 = 0;

  if (connection === 'series') {
    // Mạch nối tiếp: Rtd = R1 + R2
    rEq = Math.max(0.1, resistance1 + resistance2);
    iTotal = voltage / rEq;
    i1 = iTotal;
    i2 = iTotal;
    u1 = i1 * resistance1;
    u2 = i2 * resistance2;
  } else {
    // Mạch song song: 1/Rtd = 1/R1 + 1/R2
    const safeR1 = Math.max(0.1, resistance1);
    const safeR2 = Math.max(0.1, resistance2);
    rEq = (safeR1 * safeR2) / (safeR1 + safeR2);
    u1 = voltage;
    u2 = voltage;
    i1 = u1 / safeR1;
    i2 = u2 / safeR2;
    iTotal = i1 + i2;
  }

  // Điện áp đặt lên bóng đèn (giả sử R2 là bóng đèn)
  const bulbVoltage = u2;
  const isBulbBlown = bulbVoltage > bulbRatedVoltage * 1.8;
  const bulbBrightness = isBulbBlown
    ? 0
    : Math.min(1.2, Math.max(0, bulbVoltage / (bulbRatedVoltage || 6)));

  const totalPower = voltage * iTotal;

  // Tính từ thông và suất điện động cảm ứng
  const flux = calculateMagneticFlux(magnetPositionX, magnetStrength);
  // Đạo hàm từ thông theo vị trí và vận tốc: dPhi/dt = (dPhi/dx) * (dx/dt)
  const dPhi_dx = calculateFluxDerivative(magnetPositionX, magnetStrength);
  const inducedEmf = -1 * (coilTurns / 100) * dPhi_dx * (magnetVelocity / 50); // Volts tương đối
  const coilResistance = (coilTurns / 100) * 2; // Điện trở cuộn dây
  const inducedCurrent = (inducedEmf / coilResistance) * 1000; // mA

  return {
    equivalentResistance: Number(rEq.toFixed(2)),
    totalCurrent: Number(iTotal.toFixed(3)),
    voltage1: Number(u1.toFixed(2)),
    voltage2: Number(u2.toFixed(2)),
    current1: Number(i1.toFixed(3)),
    current2: Number(i2.toFixed(3)),
    totalPower: Number(totalPower.toFixed(2)),
    bulbBrightness: Number(bulbBrightness.toFixed(2)),
    isBulbBlown,
    inducedEmf: Number(inducedEmf.toFixed(3)),
    inducedCurrent: Number(inducedCurrent.toFixed(2)),
    flux: Number(flux.toFixed(3)),
  };
}

// Hàm tính từ thông Phi(x) qua cuộn dây đặt tại x = 0
function calculateMagneticFlux(x: number, strength: number): number {
  // Cuộn dây ở x = 0, từ trường cực đại khi x = 0
  const sigma = 60; // Bán kính tương tác của cuộn dây
  return strength * Math.exp(-(x * x) / (2 * sigma * sigma));
}

// Đạo hàm dPhi/dx
function calculateFluxDerivative(x: number, strength: number): number {
  const sigma = 60;
  return -strength * (x / (sigma * sigma)) * Math.exp(-(x * x) / (2 * sigma * sigma));
}
