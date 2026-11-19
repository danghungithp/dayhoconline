export type SolidType = 
  | 'triangular-pyramid'   // Hình chóp tam giác đều
  | 'square-pyramid'       // Hình chóp tứ giác đều
  | 'triangular-prism'     // Hình lăng trụ đứng tam giác
  | 'cylinder'             // Hình trụ
  | 'cone';                // Hình nón

export interface SolidGeometryOutput {
  solidType: SolidType;
  nameVi: string;
  nameEn: string;
  baseDimension: number;       // Cạnh đáy a hoặc Bán kính r
  height: number;              // Chiều cao h
  baseArea: number;            // S_đáy
  lateralArea: number;         // S_xq
  totalArea: number;           // S_tp
  volume: number;              // V
  slantHeightOrGenerator: number; // Trung đoạn d (chóp) hoặc đường sinh l (nón/trụ)
  basePerimeter: number;       // Chu vi đáy
  inradius: number;            // Bán kính đường tròn nội tiếp r_in
  circumradius: number;        // Bán kính đường tròn ngoại tiếp R_out
  sideEdgeLength?: number;     // Độ dài cạnh bên b
  sectorAngleDeg?: number;     // Góc quạt trải phẳng (hình nón)
  formulas: {
    baseArea: string;
    lateralArea: string;
    totalArea: string;
    volume: string;
    notes: string;
  };
}

/**
 * Tính toán hình học cho khối 3D theo kích thước cạnh đáy a (hoặc bán kính r) và chiều cao h
 */
export function calculateSolidGeometry(
  solidType: SolidType,
  dim: number, // a hoặc r
  h: number    // chiều cao h
): SolidGeometryOutput {
  const aOrR = Math.max(0.5, dim);
  const height = Math.max(0.5, h);

  switch (solidType) {
    case 'triangular-pyramid': {
      // Hình chóp tam giác đều: Đáy tam giác đều cạnh a
      const a = aOrR;
      const baseArea = (Math.sqrt(3) / 4) * a * a;
      const basePerimeter = 3 * a;
      const inradius = (a * Math.sqrt(3)) / 6;
      const circumradius = (a * Math.sqrt(3)) / 3;

      // Trung đoạn d = sqrt(h^2 + inradius^2)
      const slantHeight = Math.sqrt(height * height + inradius * inradius);
      // Cạnh bên b = sqrt(h^2 + circumradius^2)
      const sideEdge = Math.sqrt(height * height + circumradius * circumradius);

      // S_xq = 3 * (1/2 * a * d) = (3/2) * a * d
      const lateralArea = 1.5 * a * slantHeight;
      const totalArea = lateralArea + baseArea;
      // V = 1/3 * S_đáy * h
      const volume = (1 / 3) * baseArea * height;

      return {
        solidType,
        nameVi: 'Hình chóp tam giác đều',
        nameEn: 'Regular Triangular Pyramid (Tetrahedron-like)',
        baseDimension: a,
        height,
        baseArea,
        lateralArea,
        totalArea,
        volume,
        slantHeightOrGenerator: slantHeight,
        basePerimeter,
        inradius,
        circumradius,
        sideEdgeLength: sideEdge,
        formulas: {
          baseArea: 'S_đáy = (a²√3) / 4',
          lateralArea: 'S_xq = p · d = (3/2) · a · d  (p: nửa chu vi đáy, d: trung đoạn)',
          totalArea: 'S_tp = S_xq + S_đáy',
          volume: 'V = (1/3) · S_đáy · h = (a²h√3) / 12',
          notes: 'Đáy là tam giác đều, các mặt bên là tam giác cân bằng nhau. Chân đường cao trùng với tâm đáy (trọng tâm).',
        },
      };
    }

    case 'square-pyramid': {
      // Hình chóp tứ giác đều: Đáy là hình vuông cạnh a
      const a = aOrR;
      const baseArea = a * a;
      const basePerimeter = 4 * a;
      const inradius = a / 2;
      const circumradius = (a * Math.sqrt(2)) / 2;

      // Trung đoạn d = sqrt(h^2 + (a/2)^2)
      const slantHeight = Math.sqrt(height * height + (a / 2) * (a / 2));
      // Cạnh bên b = sqrt(h^2 + circumradius^2)
      const sideEdge = Math.sqrt(height * height + (a * a) / 2);

      // S_xq = 4 * (1/2 * a * d) = 2 * a * d
      const lateralArea = 2 * a * slantHeight;
      const totalArea = lateralArea + baseArea;
      // V = 1/3 * a^2 * h
      const volume = (1 / 3) * baseArea * height;

      return {
        solidType,
        nameVi: 'Hình chóp tứ giác đều',
        nameEn: 'Regular Square Pyramid',
        baseDimension: a,
        height,
        baseArea,
        lateralArea,
        totalArea,
        volume,
        slantHeightOrGenerator: slantHeight,
        basePerimeter,
        inradius,
        circumradius,
        sideEdgeLength: sideEdge,
        formulas: {
          baseArea: 'S_đáy = a²',
          lateralArea: 'S_xq = 4 · (1/2 · a · d) = 2 · a · d = p · d',
          totalArea: 'S_tp = S_xq + S_đáy = 2ad + a²',
          volume: 'V = (1/3) · S_đáy · h = (1/3) · a² · h',
          notes: 'Mô hình kim tự tháp: đáy là hình vuông, 4 mặt bên là các tam giác cân bằng nhau có chung đỉnh S.',
        },
      };
    }

    case 'triangular-prism': {
      // Hình lăng trụ đứng tam giác: Đáy tam giác đều cạnh a, chiều cao h
      const a = aOrR;
      const baseArea = (Math.sqrt(3) / 4) * a * a;
      const basePerimeter = 3 * a;
      const inradius = (a * Math.sqrt(3)) / 6;
      const circumradius = (a * Math.sqrt(3)) / 3;

      // S_xq = 3 * a * h = chu vi đáy * h
      const lateralArea = basePerimeter * height;
      const totalArea = lateralArea + 2 * baseArea;
      // V = S_đáy * h
      const volume = baseArea * height;

      return {
        solidType,
        nameVi: 'Hình lăng trụ đứng tam giác',
        nameEn: 'Right Triangular Prism',
        baseDimension: a,
        height,
        baseArea,
        lateralArea,
        totalArea,
        volume,
        slantHeightOrGenerator: height,
        basePerimeter,
        inradius,
        circumradius,
        sideEdgeLength: height,
        formulas: {
          baseArea: 'S_đáy = (a²√3) / 4',
          lateralArea: 'S_xq = 2p · h = 3 · a · h  (chu vi đáy nhân chiều cao)',
          totalArea: 'S_tp = S_xq + 2 · S_đáy',
          volume: 'V = S_đáy · h = ((a²√3) / 4) · h',
          notes: 'Có 2 đáy song song và bằng nhau, 3 mặt bên là các hình chữ nhật vuông góc với đáy.',
        },
      };
    }

    case 'cylinder': {
      // Hình trụ: Bán kính đáy r, chiều cao h, đường sinh l = h
      const r = aOrR;
      const baseArea = Math.PI * r * r;
      const basePerimeter = 2 * Math.PI * r;

      const lateralArea = 2 * Math.PI * r * height;
      const totalArea = lateralArea + 2 * baseArea;
      const volume = baseArea * height;

      return {
        solidType,
        nameVi: 'Hình trụ',
        nameEn: 'Right Circular Cylinder',
        baseDimension: r,
        height,
        baseArea,
        lateralArea,
        totalArea,
        volume,
        slantHeightOrGenerator: height,
        basePerimeter,
        inradius: r,
        circumradius: r,
        sideEdgeLength: height,
        formulas: {
          baseArea: 'S_đáy = π · r²',
          lateralArea: 'S_xq = 2π · r · h  (chu vi đáy nhân chiều cao/đường sinh)',
          totalArea: 'S_tp = 2πrh + 2πr² = 2πr(h + r)',
          volume: 'V = S_đáy · h = π · r² · h',
          notes: 'Khi trải phẳng mặt xung quanh ta được một hình chữ nhật có kích thước là 2πr và h.',
        },
      };
    }

    case 'cone': {
      // Hình nón: Bán kính r, chiều cao h, đường sinh l = sqrt(r^2 + h^2)
      const r = aOrR;
      const generator = Math.sqrt(r * r + height * height);
      const baseArea = Math.PI * r * r;
      const basePerimeter = 2 * Math.PI * r;

      const lateralArea = Math.PI * r * generator;
      const totalArea = lateralArea + baseArea;
      const volume = (1 / 3) * baseArea * height;
      const sectorAngleDeg = (360 * r) / generator;

      return {
        solidType,
        nameVi: 'Hình nón',
        nameEn: 'Right Circular Cone',
        baseDimension: r,
        height,
        baseArea,
        lateralArea,
        totalArea,
        volume,
        slantHeightOrGenerator: generator,
        basePerimeter,
        inradius: r,
        circumradius: r,
        sideEdgeLength: generator,
        sectorAngleDeg,
        formulas: {
          baseArea: 'S_đáy = π · r²',
          lateralArea: 'S_xq = π · r · l  (với đường sinh l = √(r² + h²))',
          totalArea: 'S_tp = S_xq + S_đáy = πr(l + r)',
          volume: 'V = (1/3) · S_đáy · h = (1/3) · π · r² · h',
          notes: 'Khi trải phẳng mặt xung quanh ta được hình quạt tròn bán kính l với góc ở tâm α = (360° · r) / l.',
        },
      };
    }
  }
}
