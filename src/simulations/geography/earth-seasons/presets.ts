import { PresetState } from '../../../types/simulation.types';

export const GEOGRAPHY_PRESETS: PresetState[] = [
  {
    id: 'summer-solstice-north',
    name: 'Hạ Chí (22/6) — Mùa hè Bắc Bán Cầu',
    description: 'Bắc bán cầu ngả tối đa về phía Mặt Trời; ngày dài hơn đêm (ngày dài nhất trong năm tại Việt Nam).',
    state: {
      mode: 'seasons-orbit',
      orbitAngleDeg: 90,
      isOrbiting: false,
      rotationHour: 12,
      showTropics: true,
      showEquator: true,
      showTerminator: true,
    },
  },
  {
    id: 'winter-solstice-north',
    name: 'Đông Chí (22/12) — Mùa đông Bắc Bán Cầu',
    description: 'Mặt Trời chiếu thẳng góc vào Chí tuyến Nam (23°27′ N); đêm dài nhất trong năm tại Việt Nam.',
    state: {
      mode: 'seasons-orbit',
      orbitAngleDeg: 270,
      isOrbiting: false,
      rotationHour: 12,
      showTropics: true,
      showEquator: true,
      showTerminator: true,
    },
  },
  {
    id: 'spring-equinox-global',
    name: 'Xuân Phân (21/3) — Ngày đêm bằng nhau',
    description: 'Tia sáng Mặt Trời chiếu vuông góc vào Xích đạo; khắp nơi trên Trái Đất đều có 12 giờ ngày và 12 giờ đêm.',
    state: {
      mode: 'seasons-orbit',
      orbitAngleDeg: 0,
      isOrbiting: false,
      rotationHour: 12,
      showTropics: true,
      showEquator: true,
      showTerminator: true,
    },
  },
  {
    id: 'hanoi-noon-rotation',
    name: 'Mặt Trời Đứng Bóng tại Hà Nội (GMT+7)',
    description: 'Quan sát hiện tượng ngày đêm luân phiên và chênh lệch múi giờ giữa Hà Nội, London và Tokyo.',
    state: {
      mode: 'day-night-rotation',
      orbitAngleDeg: 90,
      isOrbiting: false,
      rotationHour: 5, // London 05:00 => Hanoi 12:00
      showTropics: true,
      showEquator: true,
      showTerminator: true,
    },
  },
];
