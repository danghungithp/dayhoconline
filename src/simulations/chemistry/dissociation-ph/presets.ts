import { PresetState } from '../../../types/simulation.types';

export const PH_PRESETS: PresetState[] = [
  {
    id: 'preset-acid-dilution',
    name: 'Pha loãng Axit Clohiđric (HCl)',
    description: 'Thêm nước cất vào dung dịch axit mạnh HCl để quan sát nồng độ ion H+ giảm dần và giá trị pH tăng dần tiến tới 7.',
    state: {
      mode: 'ph-scale',
      selectedSolutionId: 'sol-hcl',
      solutionVolumeMl: 200,
      waterAddedMl: 600,
      dippedIndicator: 'ph-probe',
      showIonParticles: true,
    },
  },
  {
    id: 'preset-neutral-water',
    name: 'Nước cất tinh khiết & Giấy quỳ tím',
    description: 'Quan sát màu tím trung tính của giấy quỳ và tích số ion của nước Kw = [H+][OH-] = 10^-14.',
    state: {
      mode: 'ph-scale',
      selectedSolutionId: 'sol-water',
      solutionVolumeMl: 300,
      waterAddedMl: 0,
      dippedIndicator: 'litmus-paper',
      showIonParticles: true,
    },
  },
  {
    id: 'preset-titration-equivalence',
    name: 'Chuẩn độ Axit - Bazơ đạt điểm tương đương',
    description: 'Chuẩn độ 25mL dung dịch HCl 0.1M bằng NaOH 0.1M, nhận biết bước nhảy pH đột ngột và dung dịch chuyển hồng nhạt tại V = 25mL.',
    state: {
      mode: 'titration',
      acidConcentration: 0.1,
      acidVolumeMl: 25,
      baseConcentration: 0.1,
      buretBaseVolumeMl: 25,
      isDripping: false,
      indicatorType: 'phenolphthalein',
    },
  },
];
