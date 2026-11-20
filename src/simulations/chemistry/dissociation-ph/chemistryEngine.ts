import { DissociationPhState, SolutionPreset } from './types';

export const SAMPLE_SOLUTIONS: SolutionPreset[] = [
  { id: 'sol-hcl', nameVi: 'Axit Clohiđric (HCl 0.1M)', nameEn: 'Hydrochloric Acid (0.1M)', type: 'acid', basePh: 1.0, description: 'Axit mạnh, phân li hoàn toàn thành H+ và Cl-' },
  { id: 'sol-lemon', nameVi: 'Nước chanh tươi (Axit citric)', nameEn: 'Lemon Juice', type: 'acid', basePh: 2.3, description: 'Axit yếu tự nhiên, vị chua thanh' },
  { id: 'sol-vinegar', nameVi: 'Giấm ăn (CH3COOH 5%)', nameEn: 'Vinegar', type: 'acid', basePh: 2.8, description: 'Axit axetic hữu cơ, phân li thuận nghịch một phần' },
  { id: 'sol-coffee', nameVi: 'Cà phê đen nguyên chất', nameEn: 'Black Coffee', type: 'acid', basePh: 5.0, description: 'Axit nhẹ' },
  { id: 'sol-water', nameVi: 'Nước cất tinh khiết (H2O)', nameEn: 'Pure Distilled Water', type: 'neutral', basePh: 7.0, description: 'Môi trường trung tính, [H+] = [OH-] = 10^-7 M' },
  { id: 'sol-blood', nameVi: 'Máu người sinh lý', nameEn: 'Human Blood', type: 'base', basePh: 7.4, description: 'Hệ đệm sinh học duy trì pH máu ổn định 7.35 - 7.45' },
  { id: 'sol-baking-soda', nameVi: 'Bột nở Baking Soda (NaHCO3)', nameEn: 'Baking Soda', type: 'base', basePh: 8.5, description: 'Muối có tính bazơ yếu do ion HCO3- thủy phân' },
  { id: 'sol-soap', nameVi: 'Dung dịch xà phòng tắm', nameEn: 'Hand Soap', type: 'base', basePh: 9.8, description: 'Môi trường kiềm nhẹ làm trơn da' },
  { id: 'sol-bleach', nameVi: 'Nước tẩy Javel (NaClO)', nameEn: 'Bleach', type: 'base', basePh: 12.0, description: 'Tính oxi hóa mạnh và tính bazơ mạnh' },
  { id: 'sol-naoh', nameVi: 'Natri hiđroxit (NaOH 0.1M)', nameEn: 'Sodium Hydroxide (0.1M)', type: 'base', basePh: 13.0, description: 'Bazơ kiềm mạnh, phân li hoàn toàn sinh ion OH-' },
];

export interface PhMetrics {
  currentPh: number;
  hPlusConcentration: number; // [H+] mol/L
  ohMinusConcentration: number; // [OH-] mol/L
  solutionColor: string; // Hex color
  litmusPaperColor: string; // Hex color
  titrationCurve: { vAdded: number; ph: number }[];
  isEquivalencePoint: boolean; // Đúng điểm tương đương
}

export function calculatePhMetrics(state: DissociationPhState): PhMetrics {
  if (state.mode === 'ph-scale') {
    const selected = SAMPLE_SOLUTIONS.find((s) => s.id === state.selectedSolutionId) || SAMPLE_SOLUTIONS[4];
    const basePh = selected.basePh;
    const initialV = state.solutionVolumeMl;
    const addedV = state.waterAddedMl;
    const totalV = initialV + addedV;
    const dilutionFactor = initialV / totalV;

    let finalPh = 7.0;
    if (basePh < 7.0) {
      // Axit pha loãng: [H+] = 10^(-basePh) * dilutionFactor + 10^-7
      const hInit = Math.pow(10, -basePh);
      const hFinal = hInit * dilutionFactor + 1e-7;
      finalPh = -Math.log10(hFinal);
    } else if (basePh > 7.0) {
      // Bazơ pha loãng: [OH-] = 10^(-(14 - basePh)) * dilutionFactor + 10^-7
      const ohInit = Math.pow(10, -(14 - basePh));
      const ohFinal = ohInit * dilutionFactor + 1e-7;
      const pOH = -Math.log10(ohFinal);
      finalPh = 14 - pOH;
    } else {
      finalPh = 7.0;
    }

    finalPh = Math.max(0, Math.min(14, Number(finalPh.toFixed(2))));
    const hPlus = Math.pow(10, -finalPh);
    const ohMinus = Math.pow(10, -(14 - finalPh));

    return {
      currentPh: finalPh,
      hPlusConcentration: hPlus,
      ohMinusConcentration: ohMinus,
      solutionColor: getSolutionColorByPh(finalPh),
      litmusPaperColor: getLitmusColor(finalPh),
      titrationCurve: [],
      isEquivalencePoint: false,
    };
  }

  // =========================================================================
  // TITRATION MODE: Chuẩn độ HCl bằng NaOH
  // =========================================================================
  const { acidConcentration, acidVolumeMl, baseConcentration, buretBaseVolumeMl } = state;
  const molAcid = (acidConcentration * acidVolumeMl) / 1000;
  const vAdded = buretBaseVolumeMl;
  const molBaseAdded = (baseConcentration * vAdded) / 1000;
  const totalVolumeL = (acidVolumeMl + vAdded) / 1000;

  let currentPh = 7.0;
  const eqVolumeMl = (molAcid / baseConcentration) * 1000;
  const isEquivalencePoint = Math.abs(vAdded - eqVolumeMl) <= 0.5;

  if (vAdded < eqVolumeMl) {
    // Axit còn dư
    const molAcidRemaining = molAcid - molBaseAdded;
    const hConc = molAcidRemaining / totalVolumeL;
    currentPh = -Math.log10(Math.max(1e-7, hConc));
  } else if (vAdded > eqVolumeMl) {
    // Bazơ dư
    const molBaseRemaining = molBaseAdded - molAcid;
    const ohConc = molBaseRemaining / totalVolumeL;
    const pOH = -Math.log10(Math.max(1e-7, ohConc));
    currentPh = 14 - pOH;
  } else {
    // Đúng điểm tương đương
    currentPh = 7.0;
  }

  currentPh = Math.max(0.5, Math.min(13.5, Number(currentPh.toFixed(2))));
  const hPlus = Math.pow(10, -currentPh);
  const ohMinus = Math.pow(10, -(14 - currentPh));

  // Tạo dữ liệu đồ thị chuẩn độ
  const curve: { vAdded: number; ph: number }[] = [];
  for (let v = 0; v <= 50; v += 1) {
    const mb = (baseConcentration * v) / 1000;
    const totV = (acidVolumeMl + v) / 1000;
    let phVal = 7.0;
    if (v < eqVolumeMl) {
      phVal = -Math.log10(Math.max(1e-7, (molAcid - mb) / totV));
    } else if (v > eqVolumeMl) {
      phVal = 14 - (-Math.log10(Math.max(1e-7, (mb - molAcid) / totV)));
    }
    curve.push({ vAdded: v, ph: Number(phVal.toFixed(2)) });
  }

  // Màu sắc dung dịch chuẩn độ khi dùng Phenolphthalein
  let color = 'rgba(240, 249, 255, 0.4)';
  if (state.indicatorType === 'phenolphthalein') {
    if (currentPh < 8.2) {
      color = 'rgba(240, 249, 255, 0.4)'; // Không màu
    } else if (currentPh >= 8.2 && currentPh <= 10.0) {
      color = 'rgba(244, 114, 182, 0.55)'; // Hồng nhạt đến hồng cánh sen
    } else {
      color = 'rgba(219, 39, 119, 0.85)'; // Đỏ tím thẫm
    }
  } else {
    // Methyl da cam: < 3.1 đỏ, 3.1-4.4 da cam, > 4.4 vàng
    if (currentPh < 3.1) color = 'rgba(239, 68, 68, 0.8)';
    else if (currentPh <= 4.4) color = 'rgba(249, 115, 22, 0.8)';
    else color = 'rgba(234, 179, 8, 0.8)';
  }

  return {
    currentPh,
    hPlusConcentration: hPlus,
    ohMinusConcentration: ohMinus,
    solutionColor: color,
    litmusPaperColor: getLitmusColor(currentPh),
    titrationCurve: curve,
    isEquivalencePoint,
  };
}

// Bảng màu giấy quỳ tím
export function getLitmusColor(ph: number): string {
  if (ph <= 2) return '#dc2626'; // Đỏ đậm
  if (ph <= 4) return '#ef4444'; // Đỏ tươi
  if (ph <= 6) return '#f97316'; // Cam vàng
  if (ph <= 7.5) return '#a855f7'; // Tím trung tính
  if (ph <= 9) return '#3b82f6'; // Xanh lam
  if (ph <= 11) return '#2563eb'; // Xanh đậm
  return '#1d4ed8'; // Xanh tím thẫm
}

// Bảng màu dung dịch dựa theo pH
export function getSolutionColorByPh(ph: number): string {
  if (ph < 2) return 'rgba(239, 68, 68, 0.65)';
  if (ph < 4) return 'rgba(249, 115, 22, 0.55)';
  if (ph < 6) return 'rgba(234, 179, 8, 0.5)';
  if (ph <= 7.5) return 'rgba(56, 189, 248, 0.35)'; // Nước trong suốt hơi xanh nhẹ
  if (ph < 10) return 'rgba(59, 130, 246, 0.5)';
  if (ph < 12) return 'rgba(99, 102, 241, 0.65)';
  return 'rgba(126, 34, 206, 0.75)';
}
