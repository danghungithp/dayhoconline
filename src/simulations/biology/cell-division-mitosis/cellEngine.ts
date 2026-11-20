import { MitosisPhase } from './types';

export interface PhaseInfo {
  phase: MitosisPhase;
  nameVi: string;
  nameEn: string;
  descriptionVi: string;
  dnaStatus: string;
  chromosomeState: string;
}

export const MITOSIS_PHASES_INFO: Record<MitosisPhase, PhaseInfo> = {
  interphase: {
    phase: 'interphase',
    nameVi: 'Kỳ trung gian (Pha S & G2)',
    nameEn: 'Interphase',
    descriptionVi: 'Tế bào tăng trưởng kích thước; nhân đôi ADN và centriole (trung tử). Mỗi nhiễm sắc thể đơn nhân đôi thành 1 NST kép gồm 2 chromatid dính nhau tại tâm động.',
    dnaStatus: '2n đơn → 2n kép (4c ADN)',
    chromosomeState: 'Sợi nhiễm sắc mảnh, dãn xoắn tối đa',
  },
  prophase: {
    phase: 'prophase',
    nameVi: 'Kỳ đầu (Prophase)',
    nameEn: 'Prophase',
    descriptionVi: 'Nhiễm sắc thể kép bắt đầu co xoắn và cô đặc dần; màng nhân và nhân con tiêu biến; hai trung thể di chuyển về hai cực tế bào và hình thành thoi phân bào.',
    dnaStatus: '2n kép (4c)',
    chromosomeState: 'Co xoắn, thấy rõ cấu trúc kép hình chữ X',
  },
  metaphase: {
    phase: 'metaphase',
    nameVi: 'Kỳ giữa (Metaphase)',
    nameEn: 'Metaphase',
    descriptionVi: 'Nhiễm sắc thể kép co xoắn cực đại, có hình thái đặc trưng nhất; thoi tơ vô sắc đính vào tâm động của NST từ 2 cực; toàn bộ NST kép xếp thành 1 hàng trên mặt phẳng xích đạo.',
    dnaStatus: '2n kép (4c)',
    chromosomeState: 'Co xoắn cực đại, xếp 1 hàng xích đạo',
  },
  anaphase: {
    phase: 'anaphase',
    nameVi: 'Kỳ sau (Anaphase)',
    nameEn: 'Anaphase',
    descriptionVi: 'Tâm động tách đôi, 2 chromatid của mỗi NST kép phân li thành 2 NST đơn và được tơ vô sắc kéo trượt về hai cực đối diện của tế bào.',
    dnaStatus: '4n đơn (4c)',
    chromosomeState: 'Tách thành các NST đơn hình chữ V quay về 2 cực',
  },
  telophase: {
    phase: 'telophase',
    nameVi: 'Kỳ cuối & Phân chia tế bào chất',
    nameEn: 'Telophase & Cytokinesis',
    descriptionVi: 'Nhiễm sắc thể dãn xoắn dần; màng nhân và nhân con tái lập bao bọc 2 bộ nhân mới; màng tế bào thắt eo ở giữa chia đều tế bào chất thành 2 tế bào con có bộ NST 2n giống hệt tế bào mẹ.',
    dnaStatus: '2n đơn trong mỗi tế bào con (2c)',
    chromosomeState: 'Dãn xoắn thành mạng lưới chất nhiễm sắc',
  },
};
