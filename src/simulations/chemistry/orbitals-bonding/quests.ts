import { Quest } from '../../../types/simulation.types';
import { OrbitalsBondingState } from './types';

export const ORBITAL_QUESTS: Quest[] = [
  {
    id: 'quest-explore-orbitals',
    title: 'Khám phá hình dạng đám mây Orbital p hoặc d',
    description: 'Chuyển sang tab Đám mây Orbital 3D và chọn xem một trong các orbital: 2px, 2py, 2pz hoặc 3d.',
    xpReward: 20,
    targetCondition: (state: any) => {
      const s = state as OrbitalsBondingState;
      return s.viewMode === 'orbital-3d' && (s.selectedOrbital === '2px' || s.selectedOrbital === '2py' || s.selectedOrbital === '2pz' || s.selectedOrbital === '3d');
    },
  },
  {
    id: 'quest-nitrogen-hund',
    title: 'Khảo sát cấu hình Nửa bão hòa của Nitơ (Z = 7)',
    description: 'Chuyển sang tab Ô lượng tử và chọn nguyên tố Nitơ (Z = 7) để quan sát 3 electron độc thân ở phân lớp 2p.',
    xpReward: 25,
    targetCondition: (state: any) => {
      const s = state as OrbitalsBondingState;
      return s.viewMode === 'electron-boxes' && s.atomicNumberZ === 7;
    },
  },
  {
    id: 'quest-covalent-sigma-overlap',
    title: 'Tạo vùng xen phủ trục liên kết Sigma (σ)',
    description: 'Chuyển sang tab Liên kết Hóa học, chọn Liên kết Sigma và điều chỉnh khoảng cách hai hạt nhân d < 100 pm.',
    xpReward: 25,
    targetCondition: (state: any) => {
      const s = state as OrbitalsBondingState;
      return s.viewMode === 'chemical-bonding' && s.selectedBond === 'covalent-sigma' && s.internuclearDistance < 100;
    },
  },
  {
    id: 'quest-ionic-bonding-nacl',
    title: 'Khảo sát sự tạo thành liên kết Ion (NaCl)',
    description: 'Chọn chế độ Liên kết Ion để quan sát quá trình chuyển giao electron từ Na sang Cl và lực hút tĩnh điện giữa Na⁺ và Cl⁻.',
    xpReward: 30,
    targetCondition: (state: any) => {
      const s = state as OrbitalsBondingState;
      return s.viewMode === 'chemical-bonding' && s.selectedBond === 'ionic-nacl';
    },
  },
];
