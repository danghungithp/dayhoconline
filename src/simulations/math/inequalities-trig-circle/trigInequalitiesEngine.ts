import { TrigValues, LinearInequality, PolygonVertex } from './types';

// Danh sách góc đặc biệt phổ biến trong chương trình Lớp 10
export const SPECIAL_ANGLES = [
  { deg: 0, rad: '0', sin: '0', cos: '1', tan: '0' },
  { deg: 30, rad: 'π/6', sin: '1/2', cos: '√3/2', tan: '√3/3' },
  { deg: 45, rad: 'π/4', sin: '√2/2', cos: '√2/2', tan: '1' },
  { deg: 60, rad: 'π/3', sin: '√3/2', cos: '1/2', tan: '√3' },
  { deg: 90, rad: 'π/2', sin: '1', cos: '0', tan: 'Không xác định' },
  { deg: 120, rad: '2π/3', sin: '√3/2', cos: '-1/2', tan: '-√3' },
  { deg: 135, rad: '3π/4', sin: '√2/2', cos: '-√2/2', tan: '-1' },
  { deg: 150, rad: '5π/6', sin: '1/2', cos: '-√3/2', tan: '-√3/3' },
  { deg: 180, rad: 'π', sin: '0', cos: '-1', tan: '0' },
  { deg: 210, rad: '7π/6', sin: '-1/2', cos: '-√3/2', tan: '√3/3' },
  { deg: 225, rad: '5π/4', sin: '-√2/2', cos: '-√2/2', tan: '1' },
  { deg: 240, rad: '4π/3', sin: '-√3/2', cos: '-1/2', tan: '√3' },
  { deg: 270, rad: '3π/2', sin: '-1', cos: '0', tan: 'Không xác định' },
  { deg: 300, rad: '5π/3', sin: '-√3/2', cos: '1/2', tan: '-√3' },
  { deg: 315, rad: '7π/4', sin: '-√2/2', cos: '√2/2', tan: '-1' },
  { deg: 330, rad: '11π/6', sin: '-1/2', cos: '√3/2', tan: '-√3/3' },
  { deg: 360, rad: '2π', sin: '0', cos: '1', tan: '0' },
];

/**
 * Tính toán giá trị lượng giác từ số đo góc
 */
export function calculateTrigValues(angleDeg: number): TrigValues {
  const normDeg = ((angleDeg % 360) + 360) % 360;
  const angleRad = (normDeg * Math.PI) / 180;

  const sinVal = Math.sin(angleRad);
  const cosVal = Math.cos(angleRad);

  // Tan & Cot
  const isCosZero = Math.abs(cosVal) < 1e-7;
  const isSinZero = Math.abs(sinVal) < 1e-7;

  const tanVal = isCosZero ? null : Math.tan(angleRad);
  const cotVal = isSinZero ? null : 1 / Math.tan(angleRad);

  // Tìm góc đặc biệt gần nhất trong phạm vi 0.5 độ
  const matched = SPECIAL_ANGLES.find(sa => Math.abs(sa.deg - normDeg) < 0.5);

  const sinExact = matched ? matched.sin : sinVal.toFixed(3);
  const cosExact = matched ? matched.cos : cosVal.toFixed(3);
  const tanExact = matched ? matched.tan : tanVal !== null ? tanVal.toFixed(3) : 'Không xác định';

  const radLabel = matched ? matched.rad : `${(normDeg / 180).toFixed(2)}π`;

  let quadrant: 1 | 2 | 3 | 4 | 'axis' = 'axis';
  if (normDeg > 0 && normDeg < 90) quadrant = 1;
  else if (normDeg > 90 && normDeg < 180) quadrant = 2;
  else if (normDeg > 180 && normDeg < 270) quadrant = 3;
  else if (normDeg > 270 && normDeg < 360) quadrant = 4;

  return {
    angleDeg: Math.round(normDeg * 10) / 10,
    angleRad,
    radLabel,
    sin: Math.round(sinVal * 1000) / 1000,
    cos: Math.round(cosVal * 1000) / 1000,
    tan: tanVal !== null ? Math.round(tanVal * 1000) / 1000 : null,
    cot: cotVal !== null ? Math.round(cotVal * 1000) / 1000 : null,
    sinExact,
    cosExact,
    tanExact,
    quadrant,
  };
}

/**
 * Kiểm tra xem một điểm (x, y) có thỏa mãn hệ bất phương trình hay không
 */
export function checkPointInFeasibleRegion(
  point: { x: number; y: number },
  inequalities: LinearInequality[]
): boolean {
  for (const ineq of inequalities) {
    const val = ineq.a * point.x + ineq.b * point.y;
    if (val > ineq.c + 1e-6) {
      return false;
    }
  }
  return true;
}

/**
 * Giao điểm giữa hai đường thẳng a1*x + b1*y = c1 và a2*x + b2*y = c2
 */
export function lineIntersection(
  l1: { a: number; b: number; c: number },
  l2: { a: number; b: number; c: number }
): { x: number; y: number } | null {
  const det = l1.a * l2.b - l2.a * l1.b;
  if (Math.abs(det) < 1e-8) return null; // Song song hoặc trùng nhau

  const x = (l1.c * l2.b - l2.c * l1.b) / det;
  const y = (l1.a * l2.c - l2.a * l1.c) / det;
  return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
}

/**
 * Tìm các đỉnh của miền nghiệm đa giác (với các ràng buộc x >= 0, y >= 0 và hệ BPT)
 */
export function computeFeasibleVertices(
  inequalities: LinearInequality[],
  objA: number,
  objB: number
): PolygonVertex[] {
  // Bao gồm thêm các đường biên: x >= 0 ( -1*x + 0*y <= 0 ), y >= 0 ( 0*x - 1*y <= 0 )
  const allLines: { a: number; b: number; c: number }[] = [
    { a: -1, b: 0, c: 0 }, // x >= 0
    { a: 0, b: -1, c: 0 }, // y >= 0
    ...inequalities.map(i => ({ a: i.a, b: i.b, c: i.c })),
  ];

  const candidatePoints: { x: number; y: number }[] = [];

  for (let i = 0; i < allLines.length; i++) {
    for (let j = i + 1; j < allLines.length; j++) {
      const pt = lineIntersection(allLines[i], allLines[j]);
      if (pt) {
        // Kiểm tra pt có thỏa mãn toàn bộ hệ hay không
        if (checkPointInFeasibleRegion(pt, inequalities) && pt.x >= -1e-6 && pt.y >= -1e-6) {
          // Tránh trùng lặp
          const exists = candidatePoints.some(
            p => Math.abs(p.x - pt.x) < 0.05 && Math.abs(p.y - pt.y) < 0.05
          );
          if (!exists) {
            candidatePoints.push({
              x: Math.max(0, pt.x),
              y: Math.max(0, pt.y),
            });
          }
        }
      }
    }
  }

  // Sắp xếp các điểm theo góc cực quanh trọng tâm để vẽ đa giác lồi đúng thứ tự
  if (candidatePoints.length > 2) {
    const cx = candidatePoints.reduce((acc, p) => acc + p.x, 0) / candidatePoints.length;
    const cy = candidatePoints.reduce((acc, p) => acc + p.y, 0) / candidatePoints.length;

    candidatePoints.sort((p1, p2) => {
      const a1 = Math.atan2(p1.y - cy, p1.x - cx);
      const a2 = Math.atan2(p2.y - cy, p2.x - cx);
      return a1 - a2;
    });
  }

  // Tính giá trị hàm mục tiêu F(x, y) = objA * x + objB * y
  const verticesWithF: PolygonVertex[] = candidatePoints.map(p => ({
    x: p.x,
    y: p.y,
    fValue: Math.round((objA * p.x + objB * p.y) * 100) / 100,
  }));

  if (verticesWithF.length > 0) {
    const maxVal = Math.max(...verticesWithF.map(v => v.fValue));
    const minVal = Math.min(...verticesWithF.map(v => v.fValue));

    verticesWithF.forEach(v => {
      if (Math.abs(v.fValue - maxVal) < 1e-4) v.isMax = true;
      if (Math.abs(v.fValue - minVal) < 1e-4) v.isMin = true;
    });
  }

  return verticesWithF;
}
