import { LiquidType, BlockMaterial, BuoyancyCalculations, LensCalculations } from './types';

export const LIQUIDS: Record<LiquidType, { nameVi: string; density: number; color: string }> = {
  water: { nameVi: 'Nước ngọt (1000 kg/m³)', density: 1000, color: 'rgba(56, 189, 248, 0.45)' },
  saltwater: { nameVi: 'Nước biển (1030 kg/m³)', density: 1030, color: 'rgba(14, 165, 233, 0.55)' },
  oil: { nameVi: 'Dầu hỏa (800 kg/m³)', density: 800, color: 'rgba(234, 179, 8, 0.45)' },
};

export const MATERIALS: Record<BlockMaterial, { nameVi: string; density: number; color: string }> = {
  wood: { nameVi: 'Gỗ (700 kg/m³)', density: 700, color: '#b45309' },
  plastic: { nameVi: 'Nhựa (950 kg/m³)', density: 950, color: '#f59e0b' },
  aluminum: { nameVi: 'Nhôm (2700 kg/m³)', density: 2700, color: '#94a3b8' },
  iron: { nameVi: 'Sắt (7800 kg/m³)', density: 7800, color: '#475569' },
};

export function calculateBuoyancy(
  liquidType: LiquidType,
  material: BlockMaterial,
  volumeLiters: number
): BuoyancyCalculations {
  const rhoL = LIQUIDS[liquidType].density;
  const rhoM = MATERIALS[material].density;
  const volumeM3 = volumeLiters / 1000;
  const g = 9.8;

  const massKg = Number((rhoM * volumeM3).toFixed(2));
  const weightN = Number((massKg * g).toFixed(2));

  let submergedVolL = volumeLiters;
  let buoyantForceN = 0;
  let state: 'floating' | 'suspended' | 'sinking' = 'floating';
  let stateVi = 'Vật nổi trên mặt nước';

  if (rhoM < rhoL) {
    state = 'floating';
    submergedVolL = Number((volumeLiters * (rhoM / rhoL)).toFixed(2));
    buoyantForceN = weightN; // Khi nổi cân bằng: FA = P
    stateVi = `Vật nổi (Chìm ${(submergedVolL / volumeLiters * 100).toFixed(0)}% thể tích, FA = P)`;
  } else if (rhoM === rhoL) {
    state = 'suspended';
    submergedVolL = volumeLiters;
    buoyantForceN = weightN;
    stateVi = 'Vật lơ lửng trong lòng chất lỏng (FA = P)';
  } else {
    state = 'sinking';
    submergedVolL = volumeLiters;
    buoyantForceN = Number(((rhoL * volumeM3) * g).toFixed(2));
    stateVi = 'Vật chìm xuống đáy (P > FA)';
  }

  return {
    liquidDensity: rhoL,
    materialDensity: rhoM,
    massKg,
    weightN,
    submergedVolumeLiters: submergedVolL,
    buoyantForceN,
    state,
    stateVi,
  };
}

export function calculateLens(
  focalLengthCm: number,
  objectDistanceCm: number,
  objectHeightCm: number
): LensCalculations {
  const f = focalLengthCm;
  const d = objectDistanceCm;
  const h = objectHeightCm;

  if (Math.abs(d - f) < 0.2) {
    return {
      imageDistanceCm: 9999,
      imageHeightCm: 9999,
      isReal: true,
      isInverted: true,
      magnification: 999,
      imageTypeVi: 'Vật đặt tại tiêu điểm F ➔ Ảnh ở vô cực (chùm tia song song)',
    };
  }

  // 1/f = 1/d + 1/d' => d' = (d * f) / (d - f)
  const dPrime = (d * f) / (d - f);
  const isReal = dPrime > 0;
  const isInverted = isReal;
  const magnification = Math.abs(dPrime / d);
  const hPrime = Number((h * magnification).toFixed(1));

  let imageTypeVi = '';
  if (isReal) {
    if (d > 2 * f) {
      imageTypeVi = 'Ảnh thật, ngược chiều, nhỏ hơn vật';
    } else if (Math.abs(d - 2 * f) < 0.5) {
      imageTypeVi = 'Ảnh thật, ngược chiều, bằng đúng vật (d = d\' = 2f)';
    } else {
      imageTypeVi = 'Ảnh thật, ngược chiều, lớn hơn vật';
    }
  } else {
    imageTypeVi = 'Ảnh ảo, cùng chiều, lớn hơn vật (Ứng dụng kính lúp)';
  }

  return {
    imageDistanceCm: Number(dPrime.toFixed(1)),
    imageHeightCm: hPrime,
    isReal,
    isInverted,
    magnification: Number(magnification.toFixed(2)),
    imageTypeVi,
  };
}
