import { ElementInfo } from '../types';

export const ELEMENTS: ElementInfo[] = [
  { atomicNumber: 1, symbol: 'H', nameVi: 'Hiđro', nameEn: 'Hydrogen', standardNeutrons: 0, period: 1, group: 'IA', category: 'Phi kim', color: '#e2e8f0' },
  { atomicNumber: 2, symbol: 'He', nameVi: 'Heli', nameEn: 'Helium', standardNeutrons: 2, period: 1, group: 'VIIIA', category: 'Khí hiếm', color: '#c084fc' },
  { atomicNumber: 3, symbol: 'Li', nameVi: 'Liti', nameEn: 'Lithium', standardNeutrons: 4, period: 2, group: 'IA', category: 'Kim loại kiềm', color: '#f87171' },
  { atomicNumber: 4, symbol: 'Be', nameVi: 'Beri', nameEn: 'Beryllium', standardNeutrons: 5, period: 2, group: 'IIA', category: 'Kim loại kiềm thổ', color: '#fb923c' },
  { atomicNumber: 5, symbol: 'B', nameVi: 'Bo', nameEn: 'Boron', standardNeutrons: 6, period: 2, group: 'IIIA', category: 'Phi kim', color: '#facc15' },
  { atomicNumber: 6, symbol: 'C', nameVi: 'Cacbon', nameEn: 'Carbon', standardNeutrons: 6, period: 2, group: 'IVA', category: 'Phi kim', color: '#94a3b8' },
  { atomicNumber: 7, symbol: 'N', nameVi: 'Nitơ', nameEn: 'Nitrogen', standardNeutrons: 7, period: 2, group: 'VA', category: 'Phi kim', color: '#60a5fa' },
  { atomicNumber: 8, symbol: 'O', nameVi: 'Oxi', nameEn: 'Oxygen', standardNeutrons: 8, period: 2, group: 'VIA', category: 'Phi kim', color: '#38bdf8' },
  { atomicNumber: 9, symbol: 'F', nameVi: 'Flo', nameEn: 'Fluorine', standardNeutrons: 10, period: 2, group: 'VIIA', category: 'Halogen', color: '#4ade80' },
  { atomicNumber: 10, symbol: 'Ne', nameVi: 'Neon', nameEn: 'Neon', standardNeutrons: 10, period: 2, group: 'VIIIA', category: 'Khí hiếm', color: '#a855f7' },
  { atomicNumber: 11, symbol: 'Na', nameVi: 'Natri', nameEn: 'Sodium', standardNeutrons: 12, period: 3, group: 'IA', category: 'Kim loại kiềm', color: '#ef4444' },
  { atomicNumber: 12, symbol: 'Mg', nameVi: 'Magie', nameEn: 'Magnesium', standardNeutrons: 12, period: 3, group: 'IIA', category: 'Kim loại kiềm thổ', color: '#f97316' },
  { atomicNumber: 13, symbol: 'Al', nameVi: 'Nhôm', nameEn: 'Aluminium', standardNeutrons: 14, period: 3, group: 'IIIA', category: 'Kim loại', color: '#eab308' },
  { atomicNumber: 14, symbol: 'Si', nameVi: 'Silic', nameEn: 'Silicon', standardNeutrons: 14, period: 3, group: 'IVA', category: 'Phi kim', color: '#64748b' },
  { atomicNumber: 15, symbol: 'P', nameVi: 'Photpho', nameEn: 'Phosphorus', standardNeutrons: 16, period: 3, group: 'VA', category: 'Phi kim', color: '#fbbf24' },
  { atomicNumber: 16, symbol: 'S', nameVi: 'Lưu huỳnh', nameEn: 'Sulfur', standardNeutrons: 16, period: 3, group: 'VIA', category: 'Phi kim', color: '#fef08a' },
  { atomicNumber: 17, symbol: 'Cl', nameVi: 'Clo', nameEn: 'Chlorine', standardNeutrons: 18, period: 3, group: 'VIIA', category: 'Halogen', color: '#22c55e' },
  { atomicNumber: 18, symbol: 'Ar', nameVi: 'Agon', nameEn: 'Argon', standardNeutrons: 22, period: 3, group: 'VIIIA', category: 'Khí hiếm', color: '#9333ea' },
  { atomicNumber: 19, symbol: 'K', nameVi: 'Kali', nameEn: 'Potassium', standardNeutrons: 20, period: 4, group: 'IA', category: 'Kim loại kiềm', color: '#dc2626' },
  { atomicNumber: 20, symbol: 'Ca', nameVi: 'Canxi', nameEn: 'Calcium', standardNeutrons: 20, period: 4, group: 'IIA', category: 'Kim loại kiềm thổ', color: '#ea580c' },
];

/**
 * Tính số electron ở các lớp vỏ Bohr (K, L, M, N)
 * Quy tắc bão hòa theo chương trình THCS & THPT:
 * - Lớp 1 (K): tối đa 2e
 * - Lớp 2 (L): tối đa 8e
 * - Lớp 3 (M): tối đa 8e (với Z <= 20)
 * - Lớp 4 (N): tối đa 2e (với Z <= 20, e.g. K, Ca)
 */
export function getElectronShells(totalElectrons: number): number[] {
  let remaining = totalElectrons;
  const shells: number[] = [];

  // Lớp K (max 2)
  const k = Math.min(remaining, 2);
  shells.push(k);
  remaining -= k;

  // Lớp L (max 8)
  const l = Math.min(remaining, 8);
  shells.push(l);
  remaining -= l;

  // Lớp M (với 20 nguyên tố đầu, M nhận tối đa 8 trước khi sang N)
  const m = Math.min(remaining, 8);
  shells.push(m);
  remaining -= m;

  // Lớp N (max 2)
  const n = Math.min(remaining, 2);
  shells.push(n);
  remaining -= n;

  return shells;
}

/**
 * Kiểm tra tính bền vững của hạt nhân (Nuclear Stability)
 * Với các nguyên tố Z <= 20: bền khi 1 <= N/Z <= 1.25 (riêng H-1 bền với N=0, He bền với N=2)
 */
export function checkNuclearStability(protons: number, neutrons: number): boolean {
  if (protons === 0) return true;
  if (protons === 1) return neutrons === 0 || neutrons === 1; // 1H và 2H bền
  if (protons === 2) return neutrons === 1 || neutrons === 2; // 3He và 4He bền
  
  const ratio = neutrons / protons;
  return ratio >= 1.0 && ratio <= 1.28;
}
