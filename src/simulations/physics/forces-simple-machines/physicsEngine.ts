import { ForcesMachineState, MachineCalculations } from './types';

export function calculateForcesAndMachines(state: ForcesMachineState): MachineCalculations {
  // 1. Lò xo & Lực đàn hồi (Định luật Hooke)
  // P = m * g; F_dh = k * delta_l => delta_l = P / k
  const massKg = state.massGrams / 1000;
  const gravityForceN = Number((massKg * state.gravity).toFixed(2));
  const springForceN = gravityForceN; // ở trạng thái cân bằng
  const elongationM = gravityForceN / state.springConstant;
  const elongationCm = Number((elongationM * 100).toFixed(1));

  // 2. Đòn bẩy (Điều kiện cân bằng đòn bẩy: F1 * d1 = F2 * d2)
  const requiredEffortN = Number(((state.loadForceN * state.loadArmM) / state.effortArmM).toFixed(1));
  const mechanicalAdvantage = Number((state.effortArmM / state.loadArmM).toFixed(2));
  const isBalanced = true;

  // 3. Mặt phẳng nghiêng
  // P_box = m * g
  const boxWeightN = Number((state.boxMassKg * state.gravity).toFixed(1));
  const radAngle = (state.inclineAngleDeg * Math.PI) / 180;
  const pullForceN = Number((boxWeightN * Math.sin(radAngle)).toFixed(1));
  const inclineLengthM = Number((state.inclineHeightM / Math.sin(radAngle)).toFixed(2));
  const workJoules = Number((boxWeightN * state.inclineHeightM).toFixed(1)); // Định luật về công A = P*h = F*l

  return {
    springForceN,
    elongationCm,
    requiredEffortN,
    mechanicalAdvantage,
    isBalanced,
    gravityForceN: boxWeightN,
    pullForceN,
    inclineLengthM,
    workJoules,
  };
}
