import { ElectronBox, OrbitalType } from './types';

export interface ElementConfig {
  z: number;
  symbol: string;
  nameVi: string;
  nameEn: string;
  configStr: string; // VD: 1s² 2s² 2p⁶ 3s¹
  period: number;
  group: string;
  valenceElectrons: number;
  unpairedElectrons: number;
}

// Danh mục 26 nguyên tố đầu tiên (H đến Fe)
export const ELEMENTS_CONFIG: ElementConfig[] = [
  { z: 1, symbol: 'H', nameVi: 'Hiđro', nameEn: 'Hydrogen', configStr: '1s¹', period: 1, group: 'IA', valenceElectrons: 1, unpairedElectrons: 1 },
  { z: 2, symbol: 'He', nameVi: 'Heli', nameEn: 'Helium', configStr: '1s²', period: 1, group: 'VIIIA', valenceElectrons: 2, unpairedElectrons: 0 },
  { z: 3, symbol: 'Li', nameVi: 'Liti', nameEn: 'Lithium', configStr: '1s² 2s¹', period: 2, group: 'IA', valenceElectrons: 1, unpairedElectrons: 1 },
  { z: 4, symbol: 'Be', nameVi: 'Beri', nameEn: 'Beryllium', configStr: '1s² 2s²', period: 2, group: 'IIA', valenceElectrons: 2, unpairedElectrons: 0 },
  { z: 5, symbol: 'B', nameVi: 'Bo', nameEn: 'Boron', configStr: '1s² 2s² 2p¹', period: 2, group: 'IIIA', valenceElectrons: 3, unpairedElectrons: 1 },
  { z: 6, symbol: 'C', nameVi: 'Cacbon', nameEn: 'Carbon', configStr: '1s² 2s² 2p²', period: 2, group: 'IVA', valenceElectrons: 4, unpairedElectrons: 2 },
  { z: 7, symbol: 'N', nameVi: 'Nitơ', nameEn: 'Nitrogen', configStr: '1s² 2s² 2p³', period: 2, group: 'VA', valenceElectrons: 5, unpairedElectrons: 3 },
  { z: 8, symbol: 'O', nameVi: 'Oxi', nameEn: 'Oxygen', configStr: '1s² 2s² 2p⁴', period: 2, group: 'VIA', valenceElectrons: 6, unpairedElectrons: 2 },
  { z: 9, symbol: 'F', nameVi: 'Flo', nameEn: 'Fluorine', configStr: '1s² 2s² 2p⁵', period: 2, group: 'VIIA', valenceElectrons: 7, unpairedElectrons: 1 },
  { z: 10, symbol: 'Ne', nameVi: 'Neon', nameEn: 'Neon', configStr: '1s² 2s² 2p⁶', period: 2, group: 'VIIIA', valenceElectrons: 8, unpairedElectrons: 0 },
  { z: 11, symbol: 'Na', nameVi: 'Natri', nameEn: 'Sodium', configStr: '[Ne] 3s¹', period: 3, group: 'IA', valenceElectrons: 1, unpairedElectrons: 1 },
  { z: 12, symbol: 'Mg', nameVi: 'Magie', nameEn: 'Magnesium', configStr: '[Ne] 3s²', period: 3, group: 'IIA', valenceElectrons: 2, unpairedElectrons: 0 },
  { z: 13, symbol: 'Al', nameVi: 'Nhôm', nameEn: 'Aluminium', configStr: '[Ne] 3s² 3p¹', period: 3, group: 'IIIA', valenceElectrons: 3, unpairedElectrons: 1 },
  { z: 14, symbol: 'Si', nameVi: 'Silic', nameEn: 'Silicon', configStr: '[Ne] 3s² 3p²', period: 3, group: 'IVA', valenceElectrons: 4, unpairedElectrons: 2 },
  { z: 15, symbol: 'P', nameVi: 'Photpho', nameEn: 'Phosphorus', configStr: '[Ne] 3s² 3p³', period: 3, group: 'VA', valenceElectrons: 5, unpairedElectrons: 3 },
  { z: 16, symbol: 'S', nameVi: 'Lưu huỳnh', nameEn: 'Sulfur', configStr: '[Ne] 3s² 3p⁴', period: 3, group: 'VIA', valenceElectrons: 6, unpairedElectrons: 2 },
  { z: 17, symbol: 'Cl', nameVi: 'Clo', nameEn: 'Chlorine', configStr: '[Ne] 3s² 3p⁵', period: 3, group: 'VIIA', valenceElectrons: 7, unpairedElectrons: 1 },
  { z: 18, symbol: 'Ar', nameVi: 'Argon', nameEn: 'Argon', configStr: '[Ne] 3s² 3p⁶', period: 3, group: 'VIIIA', valenceElectrons: 8, unpairedElectrons: 0 },
  { z: 19, symbol: 'K', nameVi: 'Kali', nameEn: 'Potassium', configStr: '[Ar] 4s¹', period: 4, group: 'IA', valenceElectrons: 1, unpairedElectrons: 1 },
  { z: 20, symbol: 'Ca', nameVi: 'Canxi', nameEn: 'Calcium', configStr: '[Ar] 4s²', period: 4, group: 'IIA', valenceElectrons: 2, unpairedElectrons: 0 },
  { z: 21, symbol: 'Sc', nameVi: 'Scandi', nameEn: 'Scandium', configStr: '[Ar] 3d¹ 4s²', period: 4, group: 'IIIB', valenceElectrons: 3, unpairedElectrons: 1 },
  { z: 22, symbol: 'Ti', nameVi: 'Titan', nameEn: 'Titanium', configStr: '[Ar] 3d² 4s²', period: 4, group: 'IVB', valenceElectrons: 4, unpairedElectrons: 2 },
  { z: 23, symbol: 'V', nameVi: 'Vanadi', nameEn: 'Vanadium', configStr: '[Ar] 3d³ 4s²', period: 4, group: 'VB', valenceElectrons: 5, unpairedElectrons: 3 },
  { z: 24, symbol: 'Cr', nameVi: 'Crom', nameEn: 'Chromium', configStr: '[Ar] 3d⁵ 4s¹', period: 4, group: 'VIB', valenceElectrons: 6, unpairedElectrons: 6 },
  { z: 25, symbol: 'Mn', nameVi: 'Mangan', nameEn: 'Manganese', configStr: '[Ar] 3d⁵ 4s²', period: 4, group: 'VIIB', valenceElectrons: 7, unpairedElectrons: 5 },
  { z: 26, symbol: 'Fe', nameVi: 'Sắt', nameEn: 'Iron', configStr: '[Ar] 3d⁶ 4s²', period: 4, group: 'VIIIB', valenceElectrons: 8, unpairedElectrons: 4 },
];

// Thứ tự mức năng lượng Aufbau: 1s, 2s, 2p, 3s, 3p, 4s, 3d
const SUBSHELL_ORDER: { name: string; capacity: number; level: number }[] = [
  { name: '1s', capacity: 1, level: 1 },
  { name: '2s', capacity: 1, level: 2 },
  { name: '2p', capacity: 3, level: 3 },
  { name: '3s', capacity: 1, level: 4 },
  { name: '3p', capacity: 3, level: 5 },
  { name: '4s', capacity: 1, level: 6 },
  { name: '3d', capacity: 5, level: 7 },
];

/**
 * Sinh cấu hình các ô lượng tử bám sát Quy tắc Hund và Nguyên lý Pauli
 */
export function generateElectronBoxes(z: number): ElectronBox[] {
  let remainingElectrons = z;
  const boxes: ElectronBox[] = [];

  // Ngoại lệ cấu hình nửa bão hòa & bão hòa d: Cr (Z=24) là 3d5 4s1 thay vì 3d4 4s2
  const isCr = z === 24;

  for (const sub of SUBSHELL_ORDER) {
    const numBoxes = sub.capacity;
    const maxElectronsInSubshell = numBoxes * 2;
    const eCount = Math.min(remainingElectrons, maxElectronsInSubshell);

    // Phân bố theo quy tắc Hund
    const boxContents: ('up' | 'down')[][] = Array.from({ length: numBoxes }, () => []);

    if (isCr && sub.name === '4s') {
      boxContents[0] = ['up']; // Cr chỉ có 1e ở 4s
      remainingElectrons -= 1;
    } else if (isCr && sub.name === '3d') {
      // 5 electron độc thân ở 3d
      for (let i = 0; i < 5; i++) {
        boxContents[i] = ['up'];
      }
      remainingElectrons = 0;
    } else {
      // 1. Điền spin up trước cho từng ô
      for (let i = 0; i < Math.min(eCount, numBoxes); i++) {
        boxContents[i].push('up');
      }
      // 2. Điền spin down ghép đôi nếu còn dư
      if (eCount > numBoxes) {
        const extra = eCount - numBoxes;
        for (let i = 0; i < extra; i++) {
          boxContents[i].push('down');
        }
      }
      remainingElectrons -= eCount;
    }

    boxes.push({
      subshell: sub.name,
      energyLevel: sub.level,
      capacity: numBoxes,
      electrons: boxContents,
    });

    if (remainingElectrons <= 0 && !isCr) {
      // Vẫn vẽ thêm phân lớp tiếp theo để học sinh thấy ô trống
      break;
    }
  }

  return boxes;
}

/**
 * Trả về thông tin mô tả chi tiết của từng loại orbital
 */
export function getOrbitalDescription(orbital: OrbitalType): {
  name: string;
  shape: string;
  nodes: number;
  quantumNumbers: string;
  descriptionVi: string;
} {
  switch (orbital) {
    case '1s':
      return {
        name: 'Orbital 1s',
        shape: 'Hình cầu đối xứng hoàn hảo qua tâm hạt nhân',
        nodes: 0,
        quantumNumbers: 'n = 1, l = 0, m_l = 0',
        descriptionVi: 'Là orbital có mức năng lượng thấp nhất, gần hạt nhân nhất. Xác suất tìm thấy electron chỉ phụ thuộc vào khoảng cách r tới tâm mà không phụ thuộc vào góc quay.',
      };
    case '2s':
      return {
        name: 'Orbital 2s',
        shape: 'Hình cầu đồng tâm lớn hơn 1s, có 1 mặt nút cầu (radial node)',
        nodes: 1,
        quantumNumbers: 'n = 2, l = 0, m_l = 0',
        descriptionVi: 'Kích thước lớn hơn orbital 1s, electron có xác suất xuất hiện ở khoảng cách xa hạt nhân hơn.',
      };
    case '2px':
      return {
        name: 'Orbital 2px',
        shape: 'Hình số 8 nổi (hình quả tạ đôi) định hướng dọc trục Ox',
        nodes: 1,
        quantumNumbers: 'n = 2, l = 1, m_l = -1',
        descriptionVi: 'Gồm 2 thùy đối xứng qua mặt phẳng nút Oyz (tại mặt phẳng Oyz, xác suất tìm thấy electron bằng 0). Hai thùy có dấu hàm sóng ngược nhau.',
      };
    case '2py':
      return {
        name: 'Orbital 2py',
        shape: 'Hình số 8 nổi định hướng dọc theo trục Oy',
        nodes: 1,
        quantumNumbers: 'n = 2, l = 1, m_l = 0',
        descriptionVi: 'Hai thùy nằm dọc theo trục tung Oy, mặt phẳng nút là Oxz. Cùng mức năng lượng với 2px và 2pz (suy biến bậc 3).',
      };
    case '2pz':
      return {
        name: 'Orbital 2pz',
        shape: 'Hình số 8 nổi định hướng dọc theo trục Oz thẳng đứng',
        nodes: 1,
        quantumNumbers: 'n = 2, l = 1, m_l = +1',
        descriptionVi: 'Định hướng vuông góc với mặt phẳng Oxy. Tham gia xen phủ trục tạo liên kết sigma (σ) hoặc xen phủ bên tạo liên kết pi (π).',
      };
    case '3d':
      return {
        name: 'Orbital 3d (dz² & dxy)',
        shape: 'Dạng hoa 4 cánh (cloverleaf) hoặc quả tạ đôi kèm vành khuyên',
        nodes: 2,
        quantumNumbers: 'n = 3, l = 2, m_l = -2 đến +2',
        descriptionVi: 'Phân lớp d gồm 5 orbital suy biến bậc 5, đóng vai trò then chốt trong cấu trúc tinh thể và tính chất từ của các kim loại chuyển tiếp (Fe, Cu, Ni, Cr).',
      };
  }
}
