export type InformaticsMode = 'binary-converter' | 'logic-gates';

export type LogicGateType = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND';

export interface BinaryLogicState {
  mode: InformaticsMode;
  // 8 bits from MSB (128) to LSB (1)
  bits: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];
  // Logic gate simulation
  gateType: LogicGateType;
  inputA: boolean;
  inputB: boolean;
  showTruthTable: boolean;
}
