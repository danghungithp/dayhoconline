export type Math6Mode = 'integers' | 'fractions';

export interface IntegersFractionsState {
  mode: Math6Mode;

  // Số nguyên
  firstNum: number;   // -10 đến 10
  operation: '+' | '-';
  secondNum: number;  // -10 đến 10
  showOpposite: boolean; // Số đối (-a)

  // Phân số
  numerator: number;   // 1 đến 12
  denominator: number; // 1 đến 12
  displayModel: 'circle' | 'bar'; // Đĩa tròn hoặc Thanh chữ nhật
}

export interface IntegersCalculations {
  result: number;
  formulaStr: string;
  stepExplanationVi: string;
  stepExplanationEn: string;
}

export interface FractionCalculations {
  decimalValue: number;
  percentage: number;
  isProper: boolean; // Phân số đúng (tử < mẫu)
  isImproper: boolean; // Phân số lớn hơn hoặc bằng 1
  simplifiedNumerator: number;
  simplifiedDenominator: number;
  mixedNumberStr: string;
}
