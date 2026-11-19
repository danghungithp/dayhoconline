import { PresetState } from '../../../types/simulation.types';
import { AnglesSymmetryState } from './types';

export const ANGLES_PRESETS: PresetState<AnglesSymmetryState>[] = [
  {
    id: 'preset-right-angle',
    name: 'Góc vuông chuẩn (90°)',
    description: 'Hai tia vuông góc với nhau, góc vuông bằng 90 độ có ký hiệu vuông ở đỉnh.',
    state: {
      mode: 'angles',
      angleDeg: 90,
      showProtractor: true,
      showAngleArc: true,
      symmetryShape: 'heart',
      foldProgress: 0,
      rotationAngleDeg: 0,
    },
  },
  {
    id: 'preset-straight-angle',
    name: 'Góc bẹt (180°)',
    description: 'Hai tia Ox và Oy đối nhau tạo thành đường thẳng, số đo đúng 180°.',
    state: {
      mode: 'angles',
      angleDeg: 180,
      showProtractor: true,
      showAngleArc: true,
      symmetryShape: 'heart',
      foldProgress: 0,
      rotationAngleDeg: 0,
    },
  },
  {
    id: 'preset-heart-axis',
    name: 'Trục đối xứng hình Trái Tim',
    description: 'Hình trái tim có một trục đối xứng thẳng đứng chia đôi thành hai nửa trùng khít.',
    state: {
      mode: 'axis-symmetry',
      angleDeg: 90,
      showProtractor: true,
      showAngleArc: true,
      symmetryShape: 'heart',
      foldProgress: 0,
      rotationAngleDeg: 0,
    },
  },
  {
    id: 'preset-pinwheel-center',
    name: 'Tâm đối xứng Chong chóng',
    description: 'Chong chóng 4 cánh có tâm đối xứng O, khi quay 180° hình trùng khít vào chính nó.',
    state: {
      mode: 'center-symmetry',
      angleDeg: 90,
      showProtractor: true,
      showAngleArc: true,
      symmetryShape: 'pinwheel',
      foldProgress: 0,
      rotationAngleDeg: 0,
    },
  },
];
