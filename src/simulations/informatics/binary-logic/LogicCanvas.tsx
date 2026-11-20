import React, { useRef, useEffect } from 'react';
import { BinaryLogicState } from './types';
import {
  BIT_WEIGHTS,
  bitsToDecimal,
  decimalToHex,
  decimalToAscii,
  evaluateLogicGate,
  getTruthTable,
} from './logicEngine';

interface LogicCanvasProps {
  state: BinaryLogicState;
  onChange: (patch: Partial<BinaryLogicState>) => void;
}

export const LogicCanvas: React.FC<LogicCanvasProps> = ({ state, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const decimalVal = bitsToDecimal(state.bits);
  const hexVal = decimalToHex(decimalVal);
  const asciiVal = decimalToAscii(decimalVal);
  const gateOutput = evaluateLogicGate(state.gateType, state.inputA, state.inputB);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (state.mode === 'binary-converter') {
      renderBinaryConverter(ctx, width, height, state, decimalVal, hexVal, asciiVal);
    } else {
      renderLogicCircuit(ctx, width, height, state, gateOutput);
    }
  }, [state, decimalVal, hexVal, asciiVal, gateOutput]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    if (state.mode === 'binary-converter') {
      // Check which of the 8 bits was clicked
      const startX = 35;
      const bitWidth = 72;
      const bitY = 90;
      const bitHeight = 110;

      for (let i = 0; i < 8; i++) {
        const bx = startX + i * (bitWidth + 8);
        if (clickX >= bx && clickX <= bx + bitWidth && clickY >= bitY && clickY <= bitY + bitHeight) {
          const nextBits = [...state.bits] as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];
          nextBits[i] = !nextBits[i];
          onChange({ bits: nextBits });
          return;
        }
      }
    } else {
      // Logic gates mode: Click on switch A or switch B
      if (clickX >= 80 && clickX <= 140) {
        if (clickY >= 140 && clickY <= 190) {
          onChange({ inputA: !state.inputA });
        } else if (clickY >= 230 && clickY <= 280) {
          onChange({ inputB: !state.inputB });
        }
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
      <canvas
        ref={canvasRef}
        width={700}
        height={460}
        onClick={handleCanvasClick}
        className="w-full max-w-[700px] aspect-[700/460] bg-slate-900 rounded-2xl shadow-xl border border-slate-800 cursor-pointer"
      />
      <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-2">
        {state.mode === 'binary-converter' ? (
          <span>Bấm chuột trực tiếp vào các ô bit (0/1) để bật/tắt tín hiệu nhị phân 8-bit</span>
        ) : (
          <span>Bấm chuột trực tiếp vào công tắc A hoặc B để chuyển đổi mức tín hiệu logic (0 hoặc 1)</span>
        )}
      </div>
    </div>
  );
};

// --- RENDER 8-BIT BINARY CONVERTER ---
function renderBinaryConverter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: BinaryLogicState,
  decimalVal: number,
  hexVal: string,
  asciiVal: { char: string; desc: string }
) {
  // Title
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 16px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('💻 Chuyển Đổi Hệ Nhị Phân 8-Bit (Byte) sang Thập Phân, Hex & ASCII', 30, 36);

  ctx.font = '12px Inter, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Mỗi bit biểu diễn lũy thừa của 2: 2⁷ (128) tới 2⁰ (1). Nhấp vào bit để đảo trạng thái:', 30, 60);

  // Draw 8 bit boxes
  const startX = 35;
  const bitWidth = 72;
  const bitHeight = 115;
  const bitY = 85;

  state.bits.forEach((isOn, idx) => {
    const x = startX + idx * (bitWidth + 8);
    const weight = BIT_WEIGHTS[idx];

    // Card background
    ctx.save();
    ctx.fillStyle = isOn ? '#0c4a6e' : '#1e293b';
    ctx.strokeStyle = isOn ? '#38bdf8' : '#334155';
    ctx.lineWidth = isOn ? 2.5 : 1;
    ctx.beginPath();
    ctx.roundRect(x, bitY, bitWidth, bitHeight, 12);
    ctx.fill();
    ctx.stroke();

    // Weight label at top
    ctx.fillStyle = isOn ? '#7dd3fc' : '#64748b';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`2${7 - idx} = ${weight}`, x + bitWidth / 2, bitY + 22);

    // Glowing LED Indicator
    ctx.beginPath();
    ctx.arc(x + bitWidth / 2, bitY + 45, 10, 0, Math.PI * 2);
    ctx.fillStyle = isOn ? '#38bdf8' : '#334155';
    ctx.fill();
    if (isOn) {
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Big Bit Value (0 or 1)
    ctx.fillStyle = isOn ? '#ffffff' : '#475569';
    ctx.font = 'bold 30px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isOn ? '1' : '0', x + bitWidth / 2, bitY + 95);

    ctx.restore();
  });

  // Bottom Dashboard: Decimal + Hex + ASCII
  const dashY = 225;

  // Decimal Box
  drawMetricCard(ctx, 35, dashY, 195, 120, 'HỆ THẬP PHÂN (DECIMAL)', decimalVal.toString(), '#38bdf8', 'Cơ số 10');

  // Hex Box
  drawMetricCard(ctx, 245, dashY, 195, 120, 'HỆ THẬP LỤC PHÂN (HEX)', hexVal, '#a855f7', 'Cơ số 16 (0x)');

  // ASCII Box
  drawMetricCard(ctx, 455, dashY, 210, 120, 'KÝ TỰ ASCII', `'${asciiVal.char}'`, '#10b981', asciiVal.desc);

  // Summation formula at bottom
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(35, 365, 630, 70, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('CÔNG THỨC KHAI TRIỂN GIÁ TRỊ:', 50, 390);

  const activeTerms = state.bits
    .map((b, i) => (b ? `${BIT_WEIGHTS[i]}` : null))
    .filter(Boolean);
  const formulaStr = activeTerms.length > 0 ? activeTerms.join(' + ') + ` = ${decimalVal}` : '0 = 0';

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 14px monospace';
  ctx.fillText(formulaStr, 50, 416);
}

function drawMetricCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  value: string,
  accentColor: string,
  subtitle: string
) {
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 10px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, x + 16, y + 26);

  ctx.fillStyle = accentColor;
  ctx.font = 'bold 28px monospace';
  ctx.fillText(value, x + 16, y + 68);

  ctx.fillStyle = '#64748b';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText(subtitle, x + 16, y + 98);
}

// --- RENDER DIGITAL LOGIC GATES CIRCUIT ---
function renderLogicCircuit(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: BinaryLogicState,
  output: boolean
) {
  // Title
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 16px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`⚡ Mô Phỏng Mạch Logic Số: Cổng ${state.gateType}`, 30, 36);

  // Switch A
  drawSwitch(ctx, 80, 140, 'Đầu vào A', state.inputA);

  // Switch B (if not NOT gate)
  if (state.gateType !== 'NOT') {
    drawSwitch(ctx, 80, 230, 'Đầu vào B', state.inputB);
  }

  // Wires to Gate
  ctx.lineWidth = 3;

  // Wire A
  ctx.strokeStyle = state.inputA ? '#38bdf8' : '#475569';
  ctx.beginPath();
  ctx.moveTo(150, 165);
  ctx.lineTo(250, 165);
  ctx.stroke();

  // Wire B
  if (state.gateType !== 'NOT') {
    ctx.strokeStyle = state.inputB ? '#38bdf8' : '#475569';
    ctx.beginPath();
    ctx.moveTo(150, 255);
    ctx.lineTo(250, 255);
    ctx.stroke();
  }

  // Draw Logic Gate Symbol
  drawGateSymbol(ctx, 250, 140, state.gateType);

  // Output wire
  ctx.strokeStyle = output ? '#facc15' : '#475569';
  ctx.beginPath();
  ctx.moveTo(350, 210);
  ctx.lineTo(430, 210);
  ctx.stroke();

  // Draw Light Bulb / LED
  drawLightBulb(ctx, 450, 210, output);

  // Draw Truth Table on Right Side
  renderTruthTable(ctx, 510, 80, state);
}

function drawSwitch(ctx: CanvasRenderingContext2D, x: number, y: number, label: string, isOn: boolean) {
  ctx.fillStyle = isOn ? '#0369a1' : '#1e293b';
  ctx.strokeStyle = isOn ? '#38bdf8' : '#475569';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, 70, 50, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 10px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, x + 35, y - 8);

  ctx.fillStyle = isOn ? '#ffffff' : '#64748b';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(isOn ? '1 (ON)' : '0 (OFF)', x + 35, y + 32);
}

function drawGateSymbol(ctx: CanvasRenderingContext2D, x: number, y: number, type: string) {
  ctx.save();
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;

  const w = 100;
  const h = 140;

  ctx.beginPath();
  if (type === 'AND' || type === 'NAND') {
    ctx.moveTo(x, y);
    ctx.lineTo(x + w / 2, y);
    ctx.arc(x + w / 2, y + h / 2, h / 2, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(x, y + h);
    ctx.closePath();
  } else if (type === 'OR' || type === 'XOR') {
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + w / 2, y, x + w, y + h / 2);
    ctx.quadraticCurveTo(x + w / 2, y + h, x, y + h);
    ctx.quadraticCurveTo(x + 25, y + h / 2, x, y);
    ctx.closePath();
  } else if (type === 'NOT') {
    ctx.moveTo(x, y + 20);
    ctx.lineTo(x + w - 20, y + h / 2);
    ctx.lineTo(x, y + h - 20);
    ctx.closePath();
  }
  ctx.fill();
  ctx.stroke();

  // Circle at end for NOT or NAND
  if (type === 'NOT' || type === 'NAND') {
    ctx.beginPath();
    ctx.arc(x + w - 10, y + h / 2, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.stroke();
  }

  // Label inside
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 15px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(type, x + w / 2 - 5, y + h / 2 + 5);

  ctx.restore();
}

function drawLightBulb(ctx: CanvasRenderingContext2D, cx: number, cy: number, isOn: boolean) {
  ctx.save();
  if (isOn) {
    const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 45);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.5, '#facc1566');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 45, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bulb glass
  ctx.fillStyle = isOn ? '#facc15' : '#334155';
  ctx.strokeStyle = isOn ? '#fef08a' : '#64748b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isOn ? '#854d0e' : '#cbd5e1';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(isOn ? '💡 SÁNG' : 'TẮT', cx, cy + 4);

  ctx.restore();
}

function renderTruthTable(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  state: BinaryLogicState
) {
  const table = getTruthTable(state.gateType, state.inputA, state.inputB);

  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y, 160, 260, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`📋 BẢNG CHÂN LÝ (${state.gateType})`, x + 12, y + 26);

  // Table Headers
  const rowY = y + 54;
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 11px monospace';
  if (state.gateType === 'NOT') {
    ctx.fillText('A', x + 35, rowY);
    ctx.fillText('OUT', x + 105, rowY);
  } else {
    ctx.fillText('A', x + 25, rowY);
    ctx.fillText('B', x + 65, rowY);
    ctx.fillText('OUT', x + 115, rowY);
  }

  ctx.strokeStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(x + 10, rowY + 8);
  ctx.lineTo(x + 150, rowY + 8);
  ctx.stroke();

  // Rows
  table.forEach((row, i) => {
    const py = rowY + 28 + i * 36;
    if (row.isCurrent) {
      ctx.fillStyle = '#1e3a8a66';
      ctx.beginPath();
      ctx.roundRect(x + 8, py - 18, 144, 28, 6);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();
    }

    ctx.fillStyle = row.isCurrent ? '#ffffff' : '#cbd5e1';
    ctx.font = row.isCurrent ? 'bold 13px monospace' : '12px monospace';

    if (state.gateType === 'NOT') {
      ctx.fillText(row.a ? '1' : '0', x + 35, py);
      ctx.fillStyle = row.output ? '#facc15' : '#64748b';
      ctx.fillText(row.output ? '1' : '0', x + 115, py);
    } else {
      ctx.fillText(row.a ? '1' : '0', x + 25, py);
      ctx.fillText(row.b ? '1' : '0', x + 65, py);
      ctx.fillStyle = row.output ? '#facc15' : '#64748b';
      ctx.fillText(row.output ? '1' : '0', x + 125, py);
    }
  });
}
