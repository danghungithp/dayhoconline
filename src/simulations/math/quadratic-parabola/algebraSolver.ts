/**
 * Bộ giải toán đại số & hàm số GDPT 2018 (Lớp 9 & 10)
 * Khảo sát hàm số bậc hai y = ax^2 + bx + c và Hệ phương trình bậc nhất hai ẩn
 */

export interface ParabolaParams {
  a: number; // Hệ số a != 0
  b: number; // Hệ số b
  c: number; // Hệ số c
}

export interface LineParams {
  m: number; // y = mx + n
  n: number;
}

export interface ParabolaAnalysis {
  a: number;
  b: number;
  c: number;
  vertex: { x: number; y: number };
  axisOfSymmetry: number;
  delta: number;
  roots: number[];
  yIntercept: { x: number; y: number };
  concavity: 'up' | 'down';
  extrema: {
    type: 'min' | 'max';
    value: number;
    atX: number;
  };
  equationStr: string;
}

export interface TangentAnalysis {
  x0: number;
  y0: number;
  slope: number;
  intercept: number;
  equationStr: string;
}

export interface ParabolaLineIntersection {
  points: { x: number; y: number }[];
  delta: number;
  status: 'secant' | 'tangent' | 'none'; // Cắt tại 2 điểm, tiếp xúc (1 điểm), không cắt
}

export interface LinearEquation {
  a: number; // a*x + b*y = c
  b: number;
  c: number;
}

export interface LinearSystemAnalysis {
  eq1: LinearEquation;
  eq2: LinearEquation;
  D: number;
  Dx: number;
  Dy: number;
  type: 'unique' | 'parallel' | 'coincident';
  solution?: { x: number; y: number };
  statusMessageVi: string;
  stepsVi: string[];
}

/**
 * Định dạng chuỗi phương trình bậc hai đẹp mắt
 * y = ax^2 + bx + c
 */
export function formatQuadratic(a: number, b: number, c: number): string {
  if (a === 0) return `y = ${b}x ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}`;

  let res = 'y = ';
  if (a === 1) res += 'x²';
  else if (a === -1) res += '-x²';
  else res += `${a}x²`;

  if (b !== 0) {
    if (b === 1) res += ' + x';
    else if (b === -1) res += ' - x';
    else if (b > 0) res += ` + ${b}x`;
    else res += ` - ${Math.abs(b)}x`;
  }

  if (c !== 0) {
    if (c > 0) res += ` + ${c}`;
    else res += ` - ${Math.abs(c)}`;
  } else if (b === 0) {
    // Chỉ có ax^2
  }

  return res;
}

/**
 * Định dạng phương trình đường thẳng ax + by = c
 */
export function formatLinearGeneral(a: number, b: number, c: number): string {
  let res = '';
  if (a !== 0) {
    if (a === 1) res += 'x';
    else if (a === -1) res += '-x';
    else res += `${a}x`;
  }

  if (b !== 0) {
    const sign = res.length > 0 ? (b > 0 ? ' + ' : ' - ') : (b < 0 ? '-' : '');
    const absB = Math.abs(b);
    if (absB === 1) res += `${sign}y`;
    else res += `${sign}${absB}y`;
  } else if (res.length === 0) {
    res = '0';
  }

  return `${res} = ${c}`;
}

/**
 * Định dạng hàm số bậc nhất y = mx + n
 */
export function formatSlopeIntercept(m: number, n: number): string {
  if (m === 0) return `y = ${n}`;
  let res = 'y = ';
  if (m === 1) res += 'x';
  else if (m === -1) res += '-x';
  else res += `${m}x`;

  if (n > 0) res += ` + ${n}`;
  else if (n < 0) res += ` - ${Math.abs(n)}`;

  return res;
}

/**
 * Phân tích toàn diện Parabol y = ax^2 + bx + c
 */
export function analyzeParabola(params: ParabolaParams): ParabolaAnalysis {
  let { a, b, c } = params;
  if (Math.abs(a) < 1e-6) a = 0.001; // Tránh suy biến về đường thẳng

  const delta = b * b - 4 * a * c;
  const xv = -b / (2 * a);
  const yv = -delta / (4 * a);

  const roots: number[] = [];
  if (Math.abs(delta) < 1e-9) {
    roots.push(xv);
  } else if (delta > 0) {
    const sqrtD = Math.sqrt(delta);
    const r1 = (-b - sqrtD) / (2 * a);
    const r2 = (-b + sqrtD) / (2 * a);
    roots.push(Math.min(r1, r2), Math.max(r1, r2));
  }

  return {
    a,
    b,
    c,
    vertex: { x: Number(xv.toFixed(4)), y: Number(yv.toFixed(4)) },
    axisOfSymmetry: Number(xv.toFixed(4)),
    delta: Number(delta.toFixed(4)),
    roots: roots.map(r => Number(r.toFixed(4))),
    yIntercept: { x: 0, y: c },
    concavity: a > 0 ? 'up' : 'down',
    extrema: {
      type: a > 0 ? 'min' : 'max',
      value: Number(yv.toFixed(4)),
      atX: Number(xv.toFixed(4)),
    },
    equationStr: formatQuadratic(a, b, c),
  };
}

/**
 * Tính tiếp tuyến tại điểm x0 trên Parabol
 * y - y0 = f'(x0)(x - x0) với f'(x0) = 2*a*x0 + b
 */
export function calculateTangent(parabola: ParabolaParams, x0: number): TangentAnalysis {
  const { a, b, c } = parabola;
  const y0 = a * x0 * x0 + b * x0 + c;
  const slope = 2 * a * x0 + b; // Đạo hàm tại x0
  const intercept = y0 - slope * x0;

  return {
    x0: Number(x0.toFixed(3)),
    y0: Number(y0.toFixed(3)),
    slope: Number(slope.toFixed(3)),
    intercept: Number(intercept.toFixed(3)),
    equationStr: formatSlopeIntercept(Number(slope.toFixed(2)), Number(intercept.toFixed(2))),
  };
}

/**
 * Tìm giao điểm giữa Parabol y = ax^2 + bx + c và đường thẳng y = mx + n
 * Phương trình hoành độ giao điểm: ax^2 + (b - m)x + (c - n) = 0
 */
export function calculateParabolaLineIntersection(
  parabola: ParabolaParams,
  line: LineParams
): ParabolaLineIntersection {
  const { a, b, c } = parabola;
  const { m, n } = line;

  const B = b - m;
  const C = c - n;
  const delta = B * B - 4 * a * C;

  if (delta < -1e-7) {
    return { points: [], delta, status: 'none' };
  }

  if (Math.abs(delta) <= 1e-7) {
    const x = -B / (2 * a);
    const y = m * x + n;
    return {
      points: [{ x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) }],
      delta: 0,
      status: 'tangent',
    };
  }

  const sqrtD = Math.sqrt(delta);
  const x1 = (-B - sqrtD) / (2 * a);
  const x2 = (-B + sqrtD) / (2 * a);
  const y1 = m * x1 + n;
  const y2 = m * x2 + n;

  return {
    points: [
      { x: Number(x1.toFixed(3)), y: Number(y1.toFixed(3)) },
      { x: Number(x2.toFixed(3)), y: Number(y2.toFixed(3)) },
    ],
    delta,
    status: 'secant',
  };
}

/**
 * Giải hệ 2 phương trình bậc nhất hai ẩn bằng định thức Cramer & Phương pháp cộng/thế
 * a1*x + b1*y = c1
 * a2*x + b2*y = c2
 */
export function solveLinearSystem(
  eq1: LinearEquation,
  eq2: LinearEquation
): LinearSystemAnalysis {
  const D = eq1.a * eq2.b - eq2.a * eq1.b;
  const Dx = eq1.c * eq2.b - eq2.c * eq1.b;
  const Dy = eq1.a * eq2.c - eq2.a * eq1.c;

  const steps: string[] = [];
  steps.push(`Hệ PT: (1) ${formatLinearGeneral(eq1.a, eq1.b, eq1.c)} và (2) ${formatLinearGeneral(eq2.a, eq2.b, eq2.c)}`);
  steps.push(`Tính định thức: D = a₁b₂ - a₂b₁ = (${eq1.a})(${eq2.b}) - (${eq2.a})(${eq1.b}) = ${D}`);
  steps.push(`Dx = c₁b₂ - c₂b₁ = (${eq1.c})(${eq2.b}) - (${eq2.c})(${eq1.b}) = ${Dx}`);
  steps.push(`Dy = a₁c₂ - a₂c₁ = (${eq1.a})(${eq2.c}) - (${eq2.a})(${eq1.c}) = ${Dy}`);

  if (Math.abs(D) > 1e-6) {
    const x = Dx / D;
    const y = Dy / D;
    steps.push(`Vì D = ${D} ≠ 0, hệ có nghiệm duy nhất:`);
    steps.push(`x = Dx / D = ${Dx} / ${D} = ${Number(x.toFixed(3))}`);
    steps.push(`y = Dy / D = ${Dy} / ${D} = ${Number(y.toFixed(3))}`);

    return {
      eq1,
      eq2,
      D,
      Dx,
      Dy,
      type: 'unique',
      solution: { x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) },
      statusMessageVi: `Hai đường thẳng cắt nhau tại điểm duy nhất M(${Number(x.toFixed(2))}, ${Number(y.toFixed(2))})`,
      stepsVi: steps,
    };
  }

  // D == 0
  if (Math.abs(Dx) > 1e-6 || Math.abs(Dy) > 1e-6) {
    steps.push(`Vì D = 0 nhưng Dx = ${Dx} hoặc Dy = ${Dy} khác 0 nên hệ VÔ NGHIỆM.`);
    steps.push(`Về mặt hình học, hai đường thẳng song song với nhau và không có điểm chung.`);
    return {
      eq1,
      eq2,
      D: 0,
      Dx,
      Dy,
      type: 'parallel',
      statusMessageVi: 'Hai đường thẳng song song (d₁ // d₂) - Hệ vô nghiệm',
      stepsVi: steps,
    };
  }

  // D == 0 and Dx == 0 and Dy == 0
  steps.push(`Vì D = Dx = Dy = 0, hai phương trình tương đương (tỉ lệ hệ số trùng nhau).`);
  steps.push(`Về mặt hình học, hai đường thẳng TRÙNG NHAU (d₁ ≡ d₂) - Hệ có VÔ SỐ NGHIỆM.`);
  return {
    eq1,
    eq2,
    D: 0,
    Dx: 0,
    Dy: 0,
    type: 'coincident',
    statusMessageVi: 'Hai đường thẳng trùng nhau (d₁ ≡ d₂) - Hệ có vô số nghiệm',
    stepsVi: steps,
  };
}
