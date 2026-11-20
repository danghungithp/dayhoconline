import { PresetState } from '../../../types/simulation.types';

export const BIOLOGY_PRESETS: PresetState[] = [
  {
    id: 'f2-monohybrid-cross',
    name: 'Phép lai F2 (Aa × Aa) — Tỉ lệ Men-đen 3:1',
    description: 'Thí nghiệm lai đậu Hà Lan hoa tím dị hợp, thế hệ con xuất hiện 3 hoa tím : 1 hoa trắng.',
    state: {
      mode: 'mendel',
      trait: 'flower-color',
      p1Alleles: ['A', 'a'],
      p2Alleles: ['A', 'a'],
      showGenotypes: true,
      showPhenotypes: true,
    },
  },
  {
    id: 'test-cross-analyzer',
    name: 'Phép lai phân tích (Aa × aa)',
    description: 'Xác định kiểu gen của cơ thể mang tính trạng trội bằng cách lai với cá thể lặn aa.',
    state: {
      mode: 'mendel',
      trait: 'flower-color',
      p1Alleles: ['A', 'a'],
      p2Alleles: ['a', 'a'],
      showGenotypes: true,
      showPhenotypes: true,
    },
  },
  {
    id: 'seed-shape-pure-cross',
    name: 'Lai hạt giống thuần chủng (BB × bb)',
    description: 'Hạt vàng trơn thuần chủng lai với hạt xanh nhăn, 100% F1 mang kiểu hình hạt vàng trơn Bb.',
    state: {
      mode: 'mendel',
      trait: 'seed-shape',
      p1Alleles: ['B', 'B'],
      p2Alleles: ['b', 'b'],
      showGenotypes: true,
      showPhenotypes: true,
    },
  },
  {
    id: 'plant-cell-anatomy',
    name: 'Khám phá Cấu tạo Tế bào Thực vật',
    description: 'Quan sát Nhân ADN, Lục lạp quang hợp, Ty thể năng lượng và Không bào trung tâm.',
    state: {
      mode: 'cell',
      trait: 'flower-color',
      p1Alleles: ['A', 'a'],
      p2Alleles: ['A', 'a'],
      selectedOrganelle: 'nucleus',
      showGenotypes: true,
      showPhenotypes: true,
    },
  },
];
