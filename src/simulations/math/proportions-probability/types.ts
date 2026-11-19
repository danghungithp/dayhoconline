export type ProportionMode = 'direct' | 'inverse' | 'sqrt' | 'probability';

export interface SpinnerSlice {
  id: string;
  label: string;
  color: string;
  weight: number; // Tỉ trọng / góc
}

export interface SpinnerStats {
  counts: Record<string, number>;
  totalSpins: number;
}

export interface ProportionsProbState {
  mode: ProportionMode;

  // Tỉ lệ thuận: y = k * x
  k: number; // -10 đến 10 (khác 0)
  testDirectX: number; // Điểm x để kiểm tra trên đồ thị

  // Tỉ lệ nghịch: y = a / x (x*y = a)
  a: number; // 1 đến 36
  testInverseX: number; // Điểm x để kiểm tra diện tích

  // Căn bậc hai số học: S = c^2 => c = sqrt(S)
  squareArea: number; // 1 đến 100

  // Xác suất vòng quay may mắn
  slices: SpinnerSlice[];
  stats: SpinnerStats;
  currentSliceId: string | null;
  isSpinning: boolean;
}
