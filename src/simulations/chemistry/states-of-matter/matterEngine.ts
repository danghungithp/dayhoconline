import { SubstanceType, StateOfMatter, MatterCalculations } from './types';

export interface SubstanceInfo {
  nameVi: string;
  nameEn: string;
  formula: string;
  color: string;
  meltingPointC: number;
  boilingPointC: number;
}

export const SUBSTANCES: Record<SubstanceType, SubstanceInfo> = {
  water: {
    nameVi: 'Nước (H₂O)',
    nameEn: 'Water (H₂O)',
    formula: 'H₂O',
    color: '#38bdf8',
    meltingPointC: 0,
    boilingPointC: 100,
  },
  oxygen: {
    nameVi: 'Khí Ô-xi (O₂)',
    nameEn: 'Oxygen (O₂)',
    formula: 'O₂',
    color: '#ef4444',
    meltingPointC: -30, // Điều chỉnh trực quan cho lớp 6
    boilingPointC: 50,
  },
  argon: {
    nameVi: 'Khí hiếm Ác-gông (Ar)',
    nameEn: 'Argon (Ar)',
    formula: 'Ar',
    color: '#a855f7',
    meltingPointC: -60,
    boilingPointC: 20,
  },
};

/**
 * Tính toán trạng thái thể và áp suất của chất
 */
export function calculateMatterState(
  substance: SubstanceType,
  temperatureC: number,
  pistonHeight: number
): MatterCalculations {
  const info = SUBSTANCES[substance];
  const temperatureK = temperatureC + 273.15;

  let stateOfMatter: StateOfMatter = 'liquid';
  let stateNameVi = 'Thể lỏng (Liquid)';
  let stateNameEn = 'Liquid';

  if (temperatureC < info.meltingPointC) {
    stateOfMatter = 'solid';
    stateNameVi = 'Thể rắn (Solid - Băng đá/Tinh thể)';
    stateNameEn = 'Solid';
  } else if (temperatureC >= info.boilingPointC) {
    stateOfMatter = 'gas';
    stateNameVi = 'Thể khí / Hơi (Gas)';
    stateNameEn = 'Gas';
  }

  // Áp suất tỉ lệ thuận với nhiệt độ tuyệt đối T (Kelvin) và tỉ lệ nghịch với thể tích (pistonHeight)
  const normVolume = Math.max(0.3, pistonHeight);
  let basePressure = (temperatureK / 300) * (0.8 / normVolume);
  if (stateOfMatter === 'solid') {
    basePressure *= 0.15;
  } else if (stateOfMatter === 'liquid') {
    basePressure *= 0.5;
  }
  const pressureAtm = Number(Math.max(0.1, basePressure).toFixed(2));

  // Vận tốc trung bình của hạt tỉ lệ với căn bậc 2 của T (K)
  const averageSpeed = Number((Math.sqrt(temperatureK) * 1.8).toFixed(1));

  return {
    temperatureK: Math.round(temperatureK),
    stateOfMatter,
    stateNameVi,
    stateNameEn,
    pressureAtm,
    meltingPointC: info.meltingPointC,
    boilingPointC: info.boilingPointC,
    averageSpeed,
  };
}
