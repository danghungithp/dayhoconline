import { AngleClassification, SymmetryShape } from './types';

export function classifyAngle(angleDeg: number): AngleClassification {
  const norm = ((angleDeg % 360) + 360) % 360;

  if (norm === 0) {
    return {
      type: 'zero',
      nameVi: 'Góc không (0°)',
      nameEn: 'Zero Angle',
      descriptionVi: 'Hai tia Ox và Oy trùng nhau.',
    };
  } else if (norm > 0 && norm < 90) {
    return {
      type: 'acute',
      nameVi: 'Góc nhọn (0° < α < 90°)',
      nameEn: 'Acute Angle',
      descriptionVi: 'Số đo góc lớn hơn 0° và nhỏ hơn góc vuông (90°).',
    };
  } else if (norm === 90) {
    return {
      type: 'right',
      nameVi: 'Góc vuông (α = 90°)',
      nameEn: 'Right Angle',
      descriptionVi: 'Hai tia Ox và Oy vuông góc với nhau (bằng 1/4 vòng tròn).',
    };
  } else if (norm > 90 && norm < 180) {
    return {
      type: 'obtuse',
      nameVi: 'Góc tù (90° < α < 180°)',
      nameEn: 'Obtuse Angle',
      descriptionVi: 'Số đo góc lớn hơn góc vuông và nhỏ hơn góc bẹt.',
    };
  } else if (norm === 180) {
    return {
      type: 'straight',
      nameVi: 'Góc bẹt (α = 180°)',
      nameEn: 'Straight Angle',
      descriptionVi: 'Hai tia Ox và Oy là hai tia đối nhau, tạo thành một đường thẳng.',
    };
  } else if (norm > 180 && norm < 360) {
    return {
      type: 'reflex',
      nameVi: 'Góc phản (180° < α < 360°)',
      nameEn: 'Reflex Angle',
      descriptionVi: 'Số đo góc lớn hơn góc bẹt và nhỏ hơn góc đầy.',
    };
  } else {
    return {
      type: 'full',
      nameVi: 'Góc đầy (α = 360°)',
      nameEn: 'Full / Complete Angle',
      descriptionVi: 'Tia Oy quay trọn một vòng tròn 360° trở về trùng với Ox.',
    };
  }
}
