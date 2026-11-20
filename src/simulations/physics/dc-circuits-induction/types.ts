export type CircuitMode = 'ohm-dc' | 'electromagnetic-induction';
export type CircuitConnection = 'series' | 'parallel';

export interface DcCircuitState {
  mode: CircuitMode;
  // Ohm DC Circuit params
  switchClosed: boolean;
  voltage: number; // Volts (0 to 24V)
  resistance1: number; // Ohms (1 to 100)
  resistance2: number; // Ohms (1 to 100)
  connection: CircuitConnection;
  bulbRatedVoltage: number; // Volts, default 6V
  showElectrons: boolean;
  showMeters: boolean;

  // Induction params
  magnetPositionX: number; // -150 to +150 px
  magnetVelocity: number; // px/s
  coilTurns: number; // 200, 500, 1000
  magnetStrength: number; // 1 to 5 (Tesla relative)
  isDraggingMagnet: boolean;
}
