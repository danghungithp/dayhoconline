import React, { useRef, useEffect } from 'react';
import { CellDivisionState } from './types';
import { MITOSIS_PHASES_INFO } from './cellEngine';

interface CellDivisionCanvasProps {
  state: CellDivisionState;
  onChange: (patch: Partial<CellDivisionState>) => void;
}

export const CellDivisionCanvas: React.FC<CellDivisionCanvasProps> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.classList.contains('dark');
    const bgColor = isDark ? '#020617' : '#f8fafc';
    const textColor = isDark ? '#f8fafc' : '#0f172a';
    const subTextColor = isDark ? '#94a3b8' : '#64748b';

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const phaseInfo = MITOSIS_PHASES_INFO[state.phase];

    // =========================================================================
    // VẼ MÀNG TẾ BÀO (CELL MEMBRANE) VỚI EO THẮT KỲ CUỐI
    // =========================================================================
    const cellW = 460;
    const cellH = 290;
    const pinch = state.phase === 'telophase' ? 0.65 : 0; // Độ co thắt eo ở kỳ cuối

    ctx.save();
    ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 4;
    ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(240, 249, 255, 0.85)';

    ctx.beginPath();
    if (pinch > 0) {
      // Tế bào thắt eo tạo 2 bầu tế bào con
      const rPinch = cellH * 0.45 * pinch;
      ctx.moveTo(cx - cellW / 2, cy);
      ctx.bezierCurveTo(cx - cellW / 2, cy - cellH / 2, cx - 40, cy - cellH / 2, cx, cy - cellH / 2 + rPinch);
      ctx.bezierCurveTo(cx + 40, cy - cellH / 2, cx + cellW / 2, cy - cellH / 2, cx + cellW / 2, cy);
      ctx.bezierCurveTo(cx + cellW / 2, cy + cellH / 2, cx + 40, cy + cellH / 2, cx, cy + cellH / 2 - rPinch);
      ctx.bezierCurveTo(cx - 40, cy + cellH / 2, cx - cellW / 2, cy + cellH / 2, cx - cellW / 2, cy);
    } else {
      // Tế bào bầu dục bình thường
      ctx.ellipse(cx, cy, cellW / 2, cellH / 2, 0, 0, Math.PI * 2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // =========================================================================
    // VẼ TRUNG THỂ & THOI PHÂN BÀO (CENTROSOMES & SPINDLE FIBERS)
    // =========================================================================
    const leftPoleX = cx - cellW / 2 + 50;
    const rightPoleX = cx + cellW / 2 - 50;

    if (state.phase !== 'interphase' && state.phase !== 'telophase') {
      // Trung thể ở 2 cực (Centrosomes)
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(leftPoleX, cy, 7, 0, Math.PI * 2);
      ctx.arc(rightPoleX, cy, 7, 0, Math.PI * 2);
      ctx.fill();

      // Thoi phân bào (Spindle fibers - tơ vô sắc)
      if (state.showSpindleFibers) {
        ctx.strokeStyle = isDark ? 'rgba(251, 191, 36, 0.35)' : 'rgba(217, 119, 6, 0.35)';
        ctx.lineWidth = 1.5;
        for (let i = -60; i <= 60; i += 20) {
          ctx.beginPath();
          ctx.moveTo(leftPoleX, cy);
          ctx.quadraticCurveTo(cx, cy + i * 1.5, rightPoleX, cy);
          ctx.stroke();
        }
      }
    }

    // =========================================================================
    // VẼ MÀNG NHÂN (NUCLEUS)
    // =========================================================================
    if (state.phase === 'interphase') {
      // Màng nhân nguyên vẹn
      ctx.save();
      ctx.strokeStyle = isDark ? '#a855f7' : '#7e22ce';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    } else if (state.phase === 'telophase') {
      // Hai màng nhân mới tái lập ở 2 cực
      ctx.save();
      ctx.strokeStyle = isDark ? '#a855f7' : '#7e22ce';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx - 110, cy, 55, 0, Math.PI * 2);
      ctx.arc(cx + 110, cy, 55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // =========================================================================
    // VẼ NHIỄM SẮC THỂ (CHROMOSOMES: ĐỎ MẸ, XANH CHA)
    // =========================================================================
    const numPairs = state.chromosomeCount / 2; // 2 hoặc 3 cặp

    if (state.phase === 'interphase') {
      // Dạng sợi mảnh dãn xoắn
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < numPairs; i++) {
        const ox = cx - 35 + i * 25;
        const oy = cy - 25 + i * 15;
        drawWavyLine(ctx, ox - 20, oy - 25, ox + 20, oy + 25);
      }
      ctx.strokeStyle = '#3b82f6';
      for (let i = 0; i < numPairs; i++) {
        const ox = cx + 25 - i * 20;
        const oy = cy + 25 - i * 15;
        drawWavyLine(ctx, ox - 20, oy - 25, ox + 20, oy + 25);
      }
    } else if (state.phase === 'prophase') {
      // NST kép co xoắn nằm rải rác
      for (let i = 0; i < state.chromosomeCount; i++) {
        const angle = (i / state.chromosomeCount) * Math.PI * 2;
        const r = 45;
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;
        const color = i % 2 === 0 ? '#ef4444' : '#3b82f6';
        drawDoubleChromosome(ctx, px, py, 26, angle, color);
      }
    } else if (state.phase === 'metaphase') {
      // Xếp thành 1 hàng thẳng trên mặt phẳng xích đạo (x = cx)
      const spacing = 45;
      const startY = cy - ((state.chromosomeCount - 1) * spacing) / 2;

      // Đường xích đạo nét đứt
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(cx, cy - cellH / 2 + 20);
      ctx.lineTo(cx, cy + cellH / 2 - 20);
      ctx.stroke();
      ctx.setLineDash([]);

      for (let i = 0; i < state.chromosomeCount; i++) {
        const py = startY + i * spacing;
        const color = i % 2 === 0 ? '#ef4444' : '#3b82f6';
        drawDoubleChromosome(ctx, cx, py, 30, 0, color);
      }
    } else if (state.phase === 'anaphase') {
      // Phân ly về 2 cực: các NST đơn hình chữ V quay đỉnh về phía cực
      const spacing = 45;
      const startY = cy - ((state.chromosomeCount - 1) * spacing) / 2;
      const pullDist = 95;

      for (let i = 0; i < state.chromosomeCount; i++) {
        const py = startY + i * spacing;
        const color = i % 2 === 0 ? '#ef4444' : '#3b82f6';
        // Nửa kéo sang trái
        drawVChromosome(ctx, cx - pullDist, py, 22, 'left', color);
        // Nửa kéo sang phải
        drawVChromosome(ctx, cx + pullDist, py, 22, 'right', color);
      }
    } else if (state.phase === 'telophase') {
      // Nằm trong 2 nhân con ở 2 cực
      const leftNucleusX = cx - 110;
      const rightNucleusX = cx + 110;

      for (let i = 0; i < state.chromosomeCount; i++) {
        const angle = (i / state.chromosomeCount) * Math.PI * 2;
        const r = 22;
        const color = i % 2 === 0 ? '#ef4444' : '#3b82f6';
        drawSingleChromosome(ctx, leftNucleusX + Math.cos(angle) * r, cy + Math.sin(angle) * r, 20, angle, color);
        drawSingleChromosome(ctx, rightNucleusX + Math.cos(angle) * r, cy + Math.sin(angle) * r, 20, angle, color);
      }
    }

    // =========================================================================
    // THÔNG TIN BẢN CHẤT SINH HỌC & BANNER
    // =========================================================================
    ctx.fillStyle = textColor;
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${phaseInfo.nameVi} (${phaseInfo.nameEn})`, cx, 30);

    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`Trạng thái ADN: ${phaseInfo.dnaStatus} • NST: ${phaseInfo.chromosomeState}`, cx, 50);

    // Chú thích màu sắc (Đỏ: Nguồn gốc Mẹ, Xanh: Nguồn gốc Cha)
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('■ NST nguồn gốc Mẹ', 25, height - 20);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('■ NST nguồn gốc Cha', 160, height - 20);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('● Trung thể & Thoi phân bào', 300, height - 20);
  }, [state]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
      <canvas
        ref={canvasRef}
        width={780}
        height={480}
        className="w-full h-full max-w-4xl max-h-[560px] bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl"
      />
    </div>
  );
};

// =============================================================================
// HELPER DRAWING FUNCTIONS
// =============================================================================
function drawDoubleChromosome(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  len: number,
  angle: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  // 2 chromatid hình chữ X
  ctx.beginPath();
  ctx.moveTo(-len / 2, -len / 2);
  ctx.lineTo(len / 2, len / 2);
  ctx.moveTo(len / 2, -len / 2);
  ctx.lineTo(-len / 2, len / 2);
  ctx.stroke();

  // Tâm động (Centromere) hình tròn nhỏ ở tâm
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawVChromosome(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  len: number,
  dir: 'left' | 'right',
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  const sign = dir === 'left' ? -1 : 1;
  ctx.beginPath();
  ctx.moveTo(sign * len, -len / 2);
  ctx.lineTo(0, 0); // Đỉnh V tại tâm động
  ctx.lineTo(sign * len, len / 2);
  ctx.stroke();

  // Tâm động
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSingleChromosome(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  len: number,
  angle: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(0, -len / 2);
  ctx.lineTo(0, len / 2);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawWavyLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  const cx1 = (x1 + x2) / 2 + 10;
  const cy1 = (y1 + y2) / 2 - 10;
  ctx.quadraticCurveTo(cx1, cy1, x2, y2);
  ctx.stroke();
}
