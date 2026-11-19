export type MachineMode = 'spring' | 'lever' | 'incline';

export interface ForcesMachineState {
  mode: MachineMode;

  // Lò xo & Lực kế
  springConstant: number; // k (N/m: 20 - 100)
  massGrams: number;      // m (g: 50 - 500)
  gravity: number;        // g = 9.8 m/s^2

  // Đòn bẩy
  loadForceN: number;     // F1 (N: 10 - 100)
  loadArmM: number;       // d1 (m: 0.5 - 2.5)
  effortArmM: number;     // d2 (m: 0.5 - 4.0)

  // Mặt phẳng nghiêng
  inclineAngleDeg: number; // alpha (15° - 60°)
  inclineHeightM: number;  // h (m: 1.0 - 3.0)
  boxMassKg: number;       // m (kg: 10 - 50)
}

export interface MachineCalculations {
  // Spring
  springForceN: number;
  elongationCm: number;

  // Lever
  requiredEffortN: number;
  mechanicalAdvantage: number;
  isBalanced: boolean;

  // Incline
  gravityForceN: number;
  pullForceN: number;
  inclineLengthM: number;
  workJoules: number;
}
