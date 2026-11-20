import { PresetState } from '../../../types/simulation.types';

export const INFORMATICS_PRESETS: PresetState[] = [
  {
    id: 'ascii-letter-a',
    name: 'Ký tự ASCII "A" (01000001₂ = 65₁₀)',
    description: 'Chữ in hoa A trong bảng mã chuẩn ASCII với 8-bit nhị phân 01000001.',
    state: {
      mode: 'binary-converter',
      bits: [false, true, false, false, false, false, false, true],
      gateType: 'AND',
      inputA: true,
      inputB: true,
      showTruthTable: true,
    },
  },
  {
    id: 'byte-max-255',
    name: 'Byte tối đa (11111111₂ = 255₁₀ = 0xFF)',
    description: 'Tất cả 8-bit đều ở mức 1 (High), biểu diễn số nguyên không dấu lớn nhất của 1 byte.',
    state: {
      mode: 'binary-converter',
      bits: [true, true, true, true, true, true, true, true],
      gateType: 'AND',
      inputA: true,
      inputB: true,
      showTruthTable: true,
    },
  },
  {
    id: 'gate-and-circuit',
    name: 'Mạch cổng logic AND (Và)',
    description: 'Đầu ra chỉ ở mức 1 khi CẢ HAI đầu vào A và B đồng thời ở mức 1.',
    state: {
      mode: 'logic-gates',
      bits: [false, false, false, false, false, false, false, false],
      gateType: 'AND',
      inputA: true,
      inputB: true,
      showTruthTable: true,
    },
  },
  {
    id: 'gate-xor-circuit',
    name: 'Mạch cổng logic XOR (Hoặc loại trừ)',
    description: 'Ứng dụng trong mạch cộng bán phần (Half Adder) của CPU máy tính.',
    state: {
      mode: 'logic-gates',
      bits: [false, false, false, false, false, false, false, false],
      gateType: 'XOR',
      inputA: true,
      inputB: false,
      showTruthTable: true,
    },
  },
];
