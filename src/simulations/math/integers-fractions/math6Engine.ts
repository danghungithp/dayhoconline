import { IntegersCalculations, FractionCalculations } from './types';

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function calculateIntegers(
  firstNum: number,
  operation: '+' | '-',
  secondNum: number
): IntegersCalculations {
  let result = 0;
  let formulaStr = '';
  let stepExplanationVi = '';
  let stepExplanationEn = '';

  if (operation === '+') {
    result = firstNum + secondNum;
    const formattedSecond = secondNum < 0 ? `(${secondNum})` : `${secondNum}`;
    formulaStr = `${firstNum} + ${formattedSecond} = ${result}`;

    if (secondNum >= 0) {
      stepExplanationVi = `Bắt đầu từ ${firstNum}, nhảy sang PHẢI ${secondNum} đơn vị ➔ Dừng lại ở ${result}.`;
      stepExplanationEn = `Start at ${firstNum}, move RIGHT by ${secondNum} units ➔ Lands on ${result}.`;
    } else {
      stepExplanationVi = `Cộng với số âm tương đương với lùi về phía TRÁI: ${firstNum} - ${Math.abs(secondNum)} = ${result}.`;
      stepExplanationEn = `Adding a negative number means moving LEFT: ${firstNum} - ${Math.abs(secondNum)} = ${result}.`;
    }
  } else {
    result = firstNum - secondNum;
    const formattedSecond = secondNum < 0 ? `(${secondNum})` : `${secondNum}`;
    formulaStr = `${firstNum} - ${formattedSecond} = ${result}`;

    if (secondNum < 0) {
      stepExplanationVi = `Quy tắc dấu ngoặc: Trừ đi số âm biến thành cộng số đối: ${firstNum} - (${secondNum}) = ${firstNum} + ${Math.abs(secondNum)} = ${result}.`;
      stepExplanationEn = `Minus a negative equals plus: ${firstNum} - (${secondNum}) = ${firstNum} + ${Math.abs(secondNum)} = ${result}.`;
    } else {
      stepExplanationVi = `Bắt đầu từ ${firstNum}, nhảy lùi sang TRÁI ${secondNum} đơn vị ➔ Dừng lại ở ${result}.`;
      stepExplanationEn = `Start at ${firstNum}, move LEFT by ${secondNum} units ➔ Lands on ${result}.`;
    }
  }

  return {
    result,
    formulaStr,
    stepExplanationVi,
    stepExplanationEn,
  };
}

export function calculateFraction(
  numerator: number,
  denominator: number
): FractionCalculations {
  const safeDenom = Math.max(1, denominator);
  const decimalValue = Number((numerator / safeDenom).toFixed(3));
  const percentage = Number((decimalValue * 100).toFixed(1));

  const g = gcd(numerator, safeDenom);
  const simplifiedNumerator = numerator / g;
  const simplifiedDenominator = safeDenom / g;

  const isProper = numerator < safeDenom;
  const isImproper = numerator >= safeDenom;

  let mixedNumberStr = '';
  if (isImproper) {
    const whole = Math.floor(numerator / safeDenom);
    const rem = numerator % safeDenom;
    if (rem === 0) {
      mixedNumberStr = `${whole}`;
    } else {
      mixedNumberStr = `${whole} và ${rem}/${safeDenom}`;
    }
  }

  return {
    decimalValue,
    percentage,
    isProper,
    isImproper,
    simplifiedNumerator,
    simplifiedDenominator,
    mixedNumberStr,
  };
}
