import { Quest } from '../../../types/simulation.types';
import { GeneticsState } from './types';

export const BIOLOGY_QUESTS: Quest[] = [
  {
    id: 'quest-bio-1',
    title: 'Phép lai F1 tự thụ phấn (Aa × Aa)',
    description: 'Thiết lập kiểu gen bố mẹ P: Aa × Aa để thu được thế hệ F2 với tỉ lệ kiểu hình phân li 3 Trội : 1 Lặn (75% Trội, 25% Lặn).',
    hint: 'Chọn kiểu gen bố P là Aa và mẹ P là Aa.',
    xpReward: 25,
    targetCondition: (state: GeneticsState) => {
      const p1 = state.p1Alleles.join('');
      const p2 = state.p2Alleles.join('');
      return (
        ((p1 === 'Aa' || p1 === 'aA') && (p2 === 'Aa' || p2 === 'aA')) ||
        ((p1 === 'Bb' || p1 === 'bB') && (p2 === 'Bb' || p2 === 'bB'))
      );
    },
  },
  {
    id: 'quest-bio-2',
    title: 'Phép lai phân tích (Aa × aa)',
    description: 'Cho cá thể mang tính trạng trội dị hợp tử Aa lai với cá thể đồng hợp lặn aa để thu được tỉ lệ phân li 1 : 1 (50% Trội : 50% Lặn).',
    hint: 'Chọn kiểu gen bố là Aa và mẹ là aa (hoặc ngược lại).',
    xpReward: 25,
    targetCondition: (state: GeneticsState) => {
      const p1 = state.p1Alleles.join('');
      const p2 = state.p2Alleles.join('');
      return (
        ((p1 === 'Aa' || p1 === 'aA') && p2 === 'aa') ||
        (p1 === 'aa' && (p2 === 'Aa' || p2 === 'aA')) ||
        ((p1 === 'Bb' || p1 === 'bB') && p2 === 'bb') ||
        (p1 === 'bb' && (p2 === 'Bb' || p2 === 'bB'))
      );
    },
  },
  {
    id: 'quest-bio-3',
    title: 'Dòng thuần chủng đồng hợp (AA × AA)',
    description: 'Thiết lập bố mẹ thuần chủng AA × AA để 100% đời con F1 đồng tính trạng trội.',
    hint: 'Chọn cả bố và mẹ đều mang kiểu gen đồng hợp trội AA hoặc BB.',
    xpReward: 25,
    targetCondition: (state: GeneticsState) => {
      const p1 = state.p1Alleles.join('');
      const p2 = state.p2Alleles.join('');
      return (p1 === 'AA' && p2 === 'AA') || (p1 === 'BB' && p2 === 'BB');
    },
  },
  {
    id: 'quest-bio-4',
    title: 'Khám phá Nhà máy Năng lượng & Nhân ADN',
    description: 'Chuyển sang chế độ Tế Bào Học, khám phá Nhân Tế Bào (chứa ADN di truyền) hoặc Ty Thể (sản sinh năng lượng ATP).',
    hint: 'Chuyển sang chế độ Cấu tạo Tế bào và nhấp vào Nhân hoặc Ty thể.',
    xpReward: 25,
    targetCondition: (state: GeneticsState) =>
      state.mode === 'cell' && (state.selectedOrganelle === 'nucleus' || state.selectedOrganelle === 'mitochondria'),
  },
];
