import { Point2D, TriangleCalculations, CongruenceCriteria } from './types';

export function dist(p1: Point2D, p2: Point2D): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

/**
 * Phân tích hình học hoàn chỉnh cho tam giác ABC
 */
export function analyzeTriangle(A: Point2D, B: Point2D, C: Point2D): TriangleCalculations {
  const sideA = dist(B, C); // a = BC
  const sideB = dist(C, A); // b = CA
  const sideC = dist(A, B); // c = AB

  const perimeter = sideA + sideB + sideC;
  const s = perimeter / 2;
  const areaSq = Math.max(0, s * (s - sideA) * (s - sideB) * (s - sideC));
  const area = Math.sqrt(areaSq);

  // Góc theo định lý cosin (độ)
  const angleA = Math.acos(Math.max(-1, Math.min(1, (sideB * sideB + sideC * sideC - sideA * sideA) / (2 * sideB * sideC)))) * (180 / Math.PI);
  const angleB = Math.acos(Math.max(-1, Math.min(1, (sideA * sideA + sideC * sideC - sideB * sideB) / (2 * sideA * sideC)))) * (180 / Math.PI);
  const angleC = Math.max(0, 180 - angleA - angleB);

  // 1. Trọng tâm G (Centroid): Trung bình cộng tọa độ 3 đỉnh
  const centroid: Point2D = {
    x: (A.x + B.x + C.x) / 3,
    y: (A.y + B.y + C.y) / 3,
  };

  // 2. Tâm đường tròn nội tiếp I (Incenter): Tỉ lệ theo 3 cạnh a, b, c
  const incenter: Point2D = {
    x: (sideA * A.x + sideB * B.x + sideC * C.x) / perimeter,
    y: (sideA * A.y + sideB * B.y + sideC * C.y) / perimeter,
  };
  const inradius = area / s;

  // 3. Tâm đường tròn ngoại tiếp O (Circumcenter)
  const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
  let circumcenter: Point2D = { x: centroid.x, y: centroid.y };
  if (Math.abs(d) > 1e-5) {
    const ux =
      ((A.x * A.x + A.y * A.y) * (B.y - C.y) +
        (B.x * B.x + B.y * B.y) * (C.y - A.y) +
        (C.x * C.x + C.y * C.y) * (A.y - B.y)) /
      d;
    const uy =
      ((A.x * A.x + A.y * A.y) * (C.x - B.x) +
        (B.x * B.x + B.y * B.y) * (A.x - C.x) +
        (C.x * C.x + C.y * C.y) * (B.x - A.x)) /
      d;
    circumcenter = { x: ux, y: uy };
  }
  const circumradius = (sideA * sideB * sideC) / (4 * Math.max(0.1, area));

  // 4. Trực tâm H (Orthocenter): Theo hệ thức Euler H = 3G - 2O
  const orthocenter: Point2D = {
    x: 3 * centroid.x - 2 * circumcenter.x,
    y: 3 * centroid.y - 2 * circumcenter.y,
  };

  // Kiểm tra tam giác vuông & Pythagore
  let isRightTriangle = false;
  let rightVertex: 'A' | 'B' | 'C' | null = null;
  let pythagorasDiff = 999;

  if (Math.abs(angleA - 90) < 1.5) {
    isRightTriangle = true;
    rightVertex = 'A';
    pythagorasDiff = Math.abs(sideB * sideB + sideC * sideC - sideA * sideA);
  } else if (Math.abs(angleB - 90) < 1.5) {
    isRightTriangle = true;
    rightVertex = 'B';
    pythagorasDiff = Math.abs(sideA * sideA + sideC * sideC - sideB * sideB);
  } else if (Math.abs(angleC - 90) < 1.5) {
    isRightTriangle = true;
    rightVertex = 'C';
    pythagorasDiff = Math.abs(sideA * sideA + sideB * sideB - sideC * sideC);
  }

  return {
    sideA: Number(sideA.toFixed(1)),
    sideB: Number(sideB.toFixed(1)),
    sideC: Number(sideC.toFixed(1)),
    angleA: Number(angleA.toFixed(1)),
    angleB: Number(angleB.toFixed(1)),
    angleC: Number(angleC.toFixed(1)),
    perimeter: Number(perimeter.toFixed(1)),
    area: Number(area.toFixed(1)),
    centroid,
    incenter,
    circumcenter,
    orthocenter,
    inradius: Number(inradius.toFixed(1)),
    circumradius: Number(circumradius.toFixed(1)),
    isRightTriangle,
    rightVertex,
    pythagorasDiff: Number(pythagorasDiff.toFixed(2)),
  };
}

/**
 * Kiểm tra điều kiện bằng nhau giữa 2 tam giác
 */
export function checkCongruence(
  t1: TriangleCalculations,
  t2: TriangleCalculations
): { isCongruent: boolean; reasonVi: string; reasonEn: string; criteria: CongruenceCriteria } {
  // Sắp xếp 3 cạnh của 2 tam giác để so sánh độc lập thứ tự đỉnh
  const sides1 = [t1.sideA, t1.sideB, t1.sideC].sort((x, y) => x - y);
  const sides2 = [t2.sideA, t2.sideB, t2.sideC].sort((x, y) => x - y);

  const diffA = Math.abs(sides1[0] - sides2[0]);
  const diffB = Math.abs(sides1[1] - sides2[1]);
  const diffC = Math.abs(sides1[2] - sides2[2]);

  const maxSideDiff = Math.max(diffA, diffB, diffC);

  if (maxSideDiff < 3) {
    if (t1.isRightTriangle && t2.isRightTriangle) {
      return {
        isCongruent: true,
        reasonVi: 'Bằng nhau theo trường hợp Tam giác vuông (Cạnh huyền - Cạnh góc vuông)',
        reasonEn: 'Congruent by Right-Hypotenuse-Side (RHS)',
        criteria: 'rhs',
      };
    }
    return {
      isCongruent: true,
      reasonVi: 'Bằng nhau theo trường hợp c-c-c (Cạnh - Cạnh - Cạnh): Ba cạnh bằng nhau từng đôi một',
      reasonEn: 'Congruent by Side-Side-Side (SSS)',
      criteria: 'sss',
    };
  }

  return {
    isCongruent: false,
    reasonVi: 'Hai tam giác chưa bằng nhau (Kích thước các cạnh hoặc góc chưa tương ứng)',
    reasonEn: 'Triangles are not congruent',
    criteria: 'none',
  };
}
