import { IdentityType, IdentityBreakdown, LinearFuncAnalysis, TwoLinesRelation } from './types';

/**
 * Phân tích và chia nhỏ diện tích hình học cho Hằng đẳng thức đáng nhớ
 */
export function calculateIdentityBreakdown(
  type: IdentityType,
  a: number,
  b: number
): IdentityBreakdown {
  if (type === 'square-sum') {
    // (a + b)^2 = a^2 + 2ab + b^2
    const totalArea = (a + b) * (a + b);
    return {
      type,
      formula: `(a + b)² = a² + 2ab + b²`,
      expandedFormula: `(${a} + ${b})² = ${a}² + 2·${a}·${b} + ${b}² = ${a * a} + ${2 * a * b} + ${b * b} = ${totalArea}`,
      totalArea,
      components: [
        {
          label: 'a²',
          width: a,
          height: a,
          area: a * a,
          color: '#3b82f6', // blue
          description: `Hình vuông cạnh a: ${a} × ${a} = ${a * a}`,
        },
        {
          label: 'a·b',
          width: b,
          height: a,
          area: a * b,
          color: '#10b981', // emerald
          description: `Hình chữ nhật: ${a} × ${b} = ${a * b}`,
        },
        {
          label: 'a·b',
          width: a,
          height: b,
          area: a * b,
          color: '#f59e0b', // amber
          description: `Hình chữ nhật: ${b} × ${a} = ${a * b}`,
        },
        {
          label: 'b²',
          width: b,
          height: b,
          area: b * b,
          color: '#ef4444', // rose/red
          description: `Hình vuông cạnh b: ${b} × ${b} = ${b * b}`,
        },
      ],
    };
  }

  if (type === 'square-diff') {
    // (a - b)^2 = a^2 - 2ab + b^2 (với a > b)
    const validB = Math.min(b, a - 0.5);
    const totalArea = (a - validB) * (a - validB);
    return {
      type,
      formula: `(a - b)² = a² - 2ab + b²`,
      expandedFormula: `(${a} - ${validB})² = ${a}² - 2·${a}·${validB} + ${validB}² = ${a * a} - ${2 * a * validB} + ${validB * validB} = ${totalArea.toFixed(2)}`,
      totalArea,
      components: [
        {
          label: '(a - b)²',
          width: a - validB,
          height: a - validB,
          area: (a - validB) * (a - validB),
          color: '#6366f1', // indigo
          description: `Hình vuông còn lại: (${a} - ${validB})² = ${totalArea.toFixed(2)}`,
        },
        {
          label: '(a - b)·b',
          width: validB,
          height: a - validB,
          area: (a - validB) * validB,
          color: '#94a3b8',
          description: `Dải cắt cạnh: (${a} - ${validB}) × ${validB}`,
        },
        {
          label: 'a·b',
          width: a,
          height: validB,
          area: a * validB,
          color: '#cbd5e1',
          description: `Dải cắt đáy: ${a} × ${validB}`,
        },
      ],
    };
  }

  // diff-squares: a^2 - b^2 = (a - b)(a + b)
  const validB = Math.min(b, a - 0.5);
  const totalArea = a * a - validB * validB;
  return {
    type,
    formula: `a² - b² = (a - b)(a + b)`,
    expandedFormula: `${a}² - ${validB}² = (${a} - ${validB})(${a} + ${validB}) = ${(a - validB).toFixed(1)} × ${(a + validB).toFixed(1)} = ${totalArea.toFixed(2)}`,
    totalArea,
    components: [
      {
        label: 'Mảnh 1: (a - b) × a',
        width: a,
        height: a - validB,
        area: a * (a - validB),
        color: '#3b82f6',
        description: `Mảnh ngang: ${a} × ${(a - validB).toFixed(1)} = ${(a * (a - validB)).toFixed(2)}`,
      },
      {
        label: 'Mảnh 2: (a - b) × b',
        width: validB,
        height: a - validB,
        area: validB * (a - validB),
        color: '#f59e0b',
        description: `Mảnh ghép nối (sau xoay ghép): ${validB} × ${(a - validB).toFixed(1)} = ${(validB * (a - validB)).toFixed(2)}`,
      },
    ],
  };
}

/**
 * Phân tích hàm số bậc nhất y = ax + b
 */
export function analyzeLinearFunction(a: number, b: number): LinearFuncAnalysis {
  const rootX = a !== 0 ? -b / a : null;
  const interceptY = b;
  const angleRad = Math.atan(a);
  const angleDeg = (angleRad * 180) / Math.PI;

  let monotonicity: 'increasing' | 'decreasing' | 'constant' = 'constant';
  if (a > 0) monotonicity = 'increasing';
  else if (a < 0) monotonicity = 'decreasing';

  // Định dạng công thức y = ax + b thân thiện toán học
  let formulaText = 'y = ';
  if (a === 0) {
    formulaText += `${b}`;
  } else {
    if (a === 1) formulaText += 'x';
    else if (a === -1) formulaText += '-x';
    else formulaText += `${a}x`;

    if (b > 0) formulaText += ` + ${b}`;
    else if (b < 0) formulaText += ` - ${Math.abs(b)}`;
  }

  return {
    slope: a,
    intercept: b,
    rootX,
    interceptY,
    angleDeg: Math.round(angleDeg * 10) / 10,
    monotonicity,
    formulaText,
  };
}

/**
 * Phân tích mối quan hệ giữa 2 đường thẳng d1: y = a1*x + b1 và d2: y = a2*x + b2
 */
export function analyzeTwoLines(
  a1: number,
  b1: number,
  a2: number,
  b2: number
): TwoLinesRelation {
  const isParallelSlopes = Math.abs(a1 - a2) < 0.0001;
  const isEqualIntercepts = Math.abs(b1 - b2) < 0.0001;
  const isPerpendicular = Math.abs(a1 * a2 + 1) < 0.0001;

  if (isParallelSlopes && isEqualIntercepts) {
    return {
      status: 'coincident',
      statusVi: 'Trùng nhau (d₁ ≡ d₂)',
      statusEn: 'Coincident (d₁ ≡ d₂)',
      intersectionPoint: null,
      explanation: 'Vì a₁ = a₂ và b₁ = b₂ nên hai đường thẳng trùng khít lên nhau, có vô số điểm chung.',
    };
  }

  if (isParallelSlopes && !isEqualIntercepts) {
    return {
      status: 'parallel',
      statusVi: 'Song song (d₁ // d₂)',
      statusEn: 'Parallel (d₁ // d₂)',
      intersectionPoint: null,
      explanation: 'Vì a₁ = a₂ và b₁ ≠ b₂ nên hai đường thẳng song song tuyệt đối, không có điểm chung nào.',
    };
  }

  // Intersecting
  // a1*x + b1 = a2*x + b2 => (a1 - a2)*x = b2 - b1 => x = (b2 - b1)/(a1 - a2)
  const x = (b2 - b1) / (a1 - a2);
  const y = a1 * x + b1;
  const roundedX = Math.round(x * 100) / 100;
  const roundedY = Math.round(y * 100) / 100;

  if (isPerpendicular) {
    return {
      status: 'perpendicular',
      statusVi: 'Vuông góc (d₁ ⊥ d₂)',
      statusEn: 'Perpendicular (d₁ ⊥ d₂)',
      intersectionPoint: { x: roundedX, y: roundedY },
      explanation: `Tích hai hệ số góc: a₁ · a₂ = ${a1} · ${a2} = -1. Hai đường thẳng cắt nhau và vuông góc tại M(${roundedX}, ${roundedY}).`,
    };
  }

  return {
    status: 'intersecting',
    statusVi: 'Cắt nhau tại một điểm',
    statusEn: 'Intersecting at one point',
    intersectionPoint: { x: roundedX, y: roundedY },
    explanation: `Vì a₁ ≠ a₂ (${a1} ≠ ${a2}) nên hai đường thẳng cắt nhau tại điểm duy nhất M(${roundedX}, ${roundedY}).`,
  };
}
