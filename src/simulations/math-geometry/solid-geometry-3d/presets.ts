import { PresetState } from '../../../types/simulation.types';
import { SolidType } from './geometryMath';

export interface SolidGeometryPresetConfig {
  solidType: SolidType;
  baseDimension: number;
  height: number;
  unfoldProgress: number;
}

export const SOLID_GEOMETRY_PRESETS: PresetState<SolidGeometryPresetConfig>[] = [
  {
    id: 'preset-pyramid-giza',
    name: '1. Mô hình Kim tự tháp (Chóp tứ giác đều)',
    description: 'Khối chóp tứ giác đều a = 6, h = 8. Trung đoạn d = 8.54, thể tích V = 96.',
    state: {
      solidType: 'square-pyramid',
      baseDimension: 6,
      height: 8,
      unfoldProgress: 0,
    },
  },
  {
    id: 'preset-pyramid-tetrahedron',
    name: '2. Chóp tam giác đều chuẩn',
    description: 'Khối chóp tam giác đều cạnh a = 5, h = 6. Đáy là tam giác đều.',
    state: {
      solidType: 'triangular-pyramid',
      baseDimension: 5,
      height: 6,
      unfoldProgress: 0,
    },
  },
  {
    id: 'preset-triangular-prism',
    name: '3. Lăng trụ đứng tam giác',
    description: 'Khối lăng trụ có 2 đáy tam giác đều a = 5, chiều cao h = 6. Thể tích gấp 3 lần chóp cùng đáy.',
    state: {
      solidType: 'triangular-prism',
      baseDimension: 5,
      height: 6,
      unfoldProgress: 0,
    },
  },
  {
    id: 'preset-cylinder-can',
    name: '4. Hình trụ (Lon nước giải khát)',
    description: 'Bán kính r = 3, h = 8. Trải phẳng mặt xung quanh thành hình chữ nhật 2πr × h.',
    state: {
      solidType: 'cylinder',
      baseDimension: 3,
      height: 8,
      unfoldProgress: 0,
    },
  },
  {
    id: 'preset-cone-pythagorean',
    name: '5. Hình nón tỉ lệ vàng Pythagore (r=6, h=8, l=10)',
    description: 'Tam giác vuông r-h-l chuẩn (6 - 8 - 10), đường sinh l = 10, góc quạt trải phẳng 216°.',
    state: {
      solidType: 'cone',
      baseDimension: 6,
      height: 8,
      unfoldProgress: 0,
    },
  },
  {
    id: 'preset-unfolded-net',
    name: '6. Mạng lưới trải phẳng 100% (Flat Net)',
    description: 'Chóp tứ giác đều mở phẳng hoàn toàn trên mặt đất 2D để quan sát 1 hình vuông và 4 tam giác cân.',
    state: {
      solidType: 'square-pyramid',
      baseDimension: 6,
      height: 6,
      unfoldProgress: 1,
    },
  },
];
