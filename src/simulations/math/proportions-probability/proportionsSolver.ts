import { SpinnerSlice, SpinnerStats } from './types';

export interface TableRow {
  x: number;
  y: number;
  ratioOrProduct: number;
}

/**
 * Tạo bảng giá trị đại lượng tỉ lệ thuận y = k*x
 */
export function getDirectProportionTable(k: number): TableRow[] {
  const xs = [-3, -2, -1, 1, 2, 3, 4, 5];
  return xs.map(x => ({
    x,
    y: Number((k * x).toFixed(2)),
    ratioOrProduct: k,
  }));
}

/**
 * Tạo bảng giá trị đại lượng tỉ lệ nghịch y = a / x (x * y = a)
 */
export function getInverseProportionTable(a: number): TableRow[] {
  const xs = [-6, -4, -3, -2, -1, 1, 2, 3, 4, 6];
  return xs.map(x => ({
    x,
    y: Number((a / x).toFixed(2)),
    ratioOrProduct: a,
  }));
}

/**
 * Phân tích căn bậc hai số học
 */
export function analyzeSquareRoot(area: number) {
  const side = Math.sqrt(area);
  const isPerfectSquare = Number.isInteger(side);
  return {
    area,
    side: Number(side.toFixed(3)),
    isPerfectSquare,
    formulaStr: `√${area} ≈ ${side.toFixed(2)}`,
    perimeter: Number((side * 4).toFixed(2)),
  };
}

/**
 * Phân tích xác suất lý thuyết và tần số thực nghiệm
 */
export function analyzeProbability(slices: SpinnerSlice[], stats: SpinnerStats) {
  const totalWeight = slices.reduce((acc, s) => acc + s.weight, 0);

  return slices.map(s => {
    const theoreticalProb = totalWeight > 0 ? s.weight / totalWeight : 0;
    const count = stats.counts[s.id] || 0;
    const empiricalFreq = stats.totalSpins > 0 ? count / stats.totalSpins : 0;
    const deviation = Math.abs(empiricalFreq - theoreticalProb);

    return {
      sliceId: s.id,
      label: s.label,
      color: s.color,
      count,
      theoreticalProb: Number((theoreticalProb * 100).toFixed(1)),
      empiricalFreq: Number((empiricalFreq * 100).toFixed(1)),
      deviation: Number((deviation * 100).toFixed(1)),
    };
  });
}
