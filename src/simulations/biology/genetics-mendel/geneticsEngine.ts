import { PlantTrait } from './types';

export interface PunnettCell {
  rowAllele: string;
  colAllele: string;
  genotype: string;
  phenotype: string;
  color: string;
}

export interface CrossResult {
  cells: PunnettCell[];
  genotypeRatio: { label: string; count: number; percentage: number }[];
  phenotypeRatio: { label: string; count: number; percentage: number; color: string }[];
}

export function computeMonohybridCross(
  p1: [string, string],
  p2: [string, string],
  trait: PlantTrait
): CrossResult {
  const cells: PunnettCell[] = [];

  for (const g1 of p1) {
    for (const g2 of p2) {
      // chuẩn hóa kiểu gen: chữ hoa trước, chữ thường sau
      const alleles = [g1, g2].sort();
      const genotype = alleles[0] === alleles[0].toUpperCase() && alleles[1] === alleles[1].toLowerCase()
        ? `${alleles[0]}${alleles[1]}`
        : `${alleles[1]}${alleles[0]}`;

      let phenotype = '';
      let color = '#3b82f6';

      if (trait === 'flower-color') {
        const hasDominant = genotype.includes('A');
        phenotype = hasDominant ? 'Hoa Tím / Đỏ (Trội)' : 'Hoa Trắng (Lặn)';
        color = hasDominant ? '#ec4899' : '#e2e8f0';
      } else {
        const hasDominant = genotype.includes('B');
        phenotype = hasDominant ? 'Hạt Vàng Trơn (Trội)' : 'Hạt Xanh Nhăn (Lặn)';
        color = hasDominant ? '#eab308' : '#22c55e';
      }

      cells.push({
        rowAllele: g1,
        colAllele: g2,
        genotype,
        phenotype,
        color,
      });
    }
  }

  // Thống kê kiểu gen
  const genoMap: Record<string, number> = {};
  cells.forEach(c => {
    genoMap[c.genotype] = (genoMap[c.genotype] || 0) + 1;
  });

  const genotypeRatio = Object.entries(genoMap).map(([label, count]) => ({
    label,
    count,
    percentage: (count / 4) * 100,
  }));

  // Thống kê kiểu hình
  const phenoMap: Record<string, { count: number; color: string }> = {};
  cells.forEach(c => {
    if (!phenoMap[c.phenotype]) {
      phenoMap[c.phenotype] = { count: 0, color: c.color };
    }
    phenoMap[c.phenotype].count += 1;
  });

  const phenotypeRatio = Object.entries(phenoMap).map(([label, data]) => ({
    label,
    count: data.count,
    percentage: (data.count / 4) * 100,
    color: data.color,
  }));

  return { cells, genotypeRatio, phenotypeRatio };
}

export interface OrganelleInfo {
  id: string;
  nameVi: string;
  nameEn: string;
  functionVi: string;
  functionEn: string;
  x: number;
  y: number;
  radius: number;
  color: string;
}

export const CELL_ORGANELLES: OrganelleInfo[] = [
  {
    id: 'nucleus',
    nameVi: 'Nhân Tế Bào (Nucleus)',
    nameEn: 'Cell Nucleus',
    functionVi: 'Trung tâm điều khiển mọi hoạt động sống của tế bào; lưu giữ vật chất di truyền (ADN / NST) truyền đạt qua các thế hệ tế bào.',
    functionEn: 'The control center containing genetic material (DNA / chromosomes) that coordinates cell growth and division.',
    x: 250,
    y: 200,
    radius: 55,
    color: '#8b5cf6',
  },
  {
    id: 'mitochondria',
    nameVi: 'Ty Thể (Mitochondria)',
    nameEn: 'Mitochondria (Powerhouse)',
    functionVi: 'Nhà máy năng lượng của tế bào, thực hiện quá trình hô hấp tế bào để phân giải đường tạo năng lượng ATP cho hoạt động sống.',
    functionEn: 'The powerhouse of the cell, generating adenosine triphosphate (ATP) through cellular respiration.',
    x: 160,
    y: 120,
    radius: 28,
    color: '#f97316',
  },
  {
    id: 'chloroplast',
    nameVi: 'Lục Lạp (Chloroplast)',
    nameEn: 'Chloroplast',
    functionVi: 'Bào quan đặc trưng ở tế bào thực vật, chứa chất diệp lục hấp thụ ánh sáng mặt trời thực hiện quá trình quang hợp tạo tinh bột.',
    functionEn: 'Plant organelle containing chlorophyll that captures sunlight energy to conduct photosynthesis.',
    x: 350,
    y: 140,
    radius: 32,
    color: '#22c55e',
  },
  {
    id: 'vacuole',
    nameVi: 'Không Bào Trung Tâm (Vacuole)',
    nameEn: 'Central Vacuole',
    functionVi: 'Chứa dịch tế bào (nước, muối khoáng, đường và sắc tố), duy trì áp suất thẩm thấu và sức trương của tế bào.',
    functionEn: 'Large organelle holding cell sap, maintaining turgor pressure and storing nutrients and pigments.',
    x: 320,
    y: 280,
    radius: 45,
    color: '#06b6d4',
  },
  {
    id: 'membrane',
    nameVi: 'Màng & Vách Tế Bào (Cell Wall)',
    nameEn: 'Cell Wall & Plasma Membrane',
    functionVi: 'Bao bọc, bảo vệ và tạo hình cố định cho tế bào thực vật (chất xenlulôzơ), kiểm soát các chất ra vào tế bào có chọn lọc.',
    functionEn: 'Rigid outer layer composed of cellulose providing structural support and selective permeability.',
    x: 250,
    y: 200,
    radius: 175,
    color: '#10b981',
  },
];
