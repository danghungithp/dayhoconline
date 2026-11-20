import { LogicGateType } from './types';

export const BIT_WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1] as const;

export function bitsToDecimal(bits: boolean[]): number {
  return bits.reduce((sum, bit, index) => sum + (bit ? BIT_WEIGHTS[index] : 0), 0);
}

export function decimalToHex(decimal: number): string {
  return '0x' + decimal.toString(16).toUpperCase().padStart(2, '0');
}

export function decimalToAscii(decimal: number): { char: string; desc: string } {
  if (decimal >= 32 && decimal <= 126) {
    return { char: String.fromCharCode(decimal), desc: `Ký tự: '${String.fromCharCode(decimal)}'` };
  }
  if (decimal === 0) return { char: 'NUL', desc: 'Ký tự rỗng (Null)' };
  if (decimal === 10) return { char: '\\n', desc: 'Xuống dòng (Line Feed)' };
  if (decimal === 13) return { char: '\\r', desc: 'Về đầu dòng (Carriage Return)' };
  if (decimal === 32) return { char: 'SPACE', desc: 'Dấu cách (Space)' };
  return { char: '·', desc: 'Mã điều khiển (Non-printable)' };
}

export function evaluateLogicGate(type: LogicGateType, a: boolean, b: boolean): boolean {
  switch (type) {
    case 'AND':
      return a && b;
    case 'OR':
      return a || b;
    case 'NOT':
      return !a;
    case 'XOR':
      return a !== b;
    case 'NAND':
      return !(a && b);
    default:
      return false;
  }
}

export interface TruthTableRow {
  a: boolean;
  b: boolean;
  output: boolean;
  isCurrent: boolean;
}

export function getTruthTable(
  type: LogicGateType,
  currentA: boolean,
  currentB: boolean
): TruthTableRow[] {
  if (type === 'NOT') {
    return [
      { a: false, b: false, output: true, isCurrent: currentA === false },
      { a: true, b: false, output: false, isCurrent: currentA === true },
    ];
  }

  const inputs: [boolean, boolean][] = [
    [false, false],
    [false, true],
    [true, false],
    [true, true],
  ];

  return inputs.map(([a, b]) => ({
    a,
    b,
    output: evaluateLogicGate(type, a, b),
    isCurrent: a === currentA && b === currentB,
  }));
}
