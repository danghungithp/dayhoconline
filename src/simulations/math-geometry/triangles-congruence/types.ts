export interface Point2D {
  x: number;
  y: number;
}

export type CongruenceCriteria = 'none' | 'sss' | 'sas' | 'asa' | 'rhs';

export interface TriangleState {
  activeTab: 'concurrence' | 'congruence' | 'pythagoras';

  // Tọa độ 3 đỉnh tam giác chính ABC
  A: Point2D;
  B: Point2D;
  C: Point2D;

  // Bật/tắt 4 đường đồng quy
  showMedians: boolean;         // 3 đường trung tuyến & Trọng tâm G
  showAngleBisectors: boolean;  // 3 đường phân giác & Tâm nội tiếp I
  showPerpendicularBisectors: boolean; // 3 đường trung trực & Tâm ngoại tiếp O
  showAltitudes: boolean;       // 3 đường cao & Trực tâm H
  showIncircle: boolean;        // Đường tròn nội tiếp (I, r)
  showCircumcircle: boolean;    // Đường tròn ngoại tiếp (O, R)
  showEulerLine: boolean;       // Đường thẳng Euler (O - G - H thẳng hàng)

  // Tam giác phụ thứ 2 A'B'C' (dùng cho chế độ kiểm tra tam giác bằng nhau)
  A2: Point2D;
  B2: Point2D;
  C2: Point2D;
  isSuperimposed: boolean;      // Chế độ chồng khít 2 tam giác
  congruenceCase: CongruenceCriteria;

  // Định lý Pythagore
  showPythagorasSquares: boolean; // Dựng 3 hình vuông trên 3 cạnh
}

export interface TriangleCalculations {
  sideA: number; // BC (đối diện A)
  sideB: number; // CA (đối diện B)
  sideC: number; // AB (đối diện C)
  angleA: number; // Góc A (độ)
  angleB: number; // Góc B (độ)
  angleC: number; // Góc C (độ)
  perimeter: number;
  area: number;

  // Tọa độ 4 điểm đồng quy
  centroid: Point2D;      // G (Trọng tâm)
  incenter: Point2D;      // I (Tâm nội tiếp)
  circumcenter: Point2D;  // O (Tâm ngoại tiếp)
  orthocenter: Point2D;   // H (Trực tâm)

  inradius: number;       // r (Bán kính đường tròn nội tiếp)
  circumradius: number;   // R (Bán kính đường tròn ngoại tiếp)

  isRightTriangle: boolean;
  rightVertex: 'A' | 'B' | 'C' | null;
  pythagorasDiff: number; // |a^2 + b^2 - c^2|
}
