import React, { useRef, useEffect } from 'react';
import { IntegersFractionsState } from './types';
import { calculateIntegers, calculateFraction } from './math6Engine';

interface IntegersFractionsCanvasProps {
  state: IntegersFractionsState;
  isDark: boolean;
}

export const IntegersFractionsCanvas: React.FC<IntegersFractionsCanvasProps> = ({ state, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const intCalc = calculateIntegers(state.firstNum, state.operation, state.secondNum);
  const fracCalc = calculateFraction(state.numerator, state.denominator);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = isDark ? '#0b0f19' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    if (state.mode === 'integers') {
      // ================= 1. TRỤC SỐ NGUYÊN =================
      const lineY = height * 0.55;
      const stepPx = 32;
      const originX = width / 2;

      // Trục số chính
      ctx.save();
      ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(30, lineY);
      ctx.lineTo(width - 30, lineY);
      ctx.stroke();

      // Mũi tên chiều dương bên phải
      ctx.beginPath();
      ctx.moveTo(width - 30, lineY);
      ctx.lineTo(width - 42, lineY - 6);
      ctx.lineTo(width - 42, lineY + 6);
      ctx.closePath();
      ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
      ctx.fill();

      // Các vạch chia từ -10 đến 10
      for (let n = -10; n <= 10; n++) {
        const vx = originX + n * stepPx;
        if (vx < 40 || vx > width - 50) continue;

        ctx.beginPath();
        ctx.moveTo(vx, lineY - 8);
        ctx.lineTo(vx, lineY + 8);
        ctx.strokeStyle = n === 0 ? '#f59e0b' : (isDark ? '#475569' : '#cbd5e1');
        ctx.lineWidth = n === 0 ? 3 : 1.5;
        ctx.stroke();

        ctx.font = n === 0 ? 'bold 13px monospace' : '11px monospace';
        ctx.fillStyle = n === 0
          ? '#f59e0b'
          : n < 0
          ? (isDark ? '#f87171' : '#dc2626')
          : (isDark ? '#38bdf8' : '#0284c7');
        ctx.textAlign = 'center';
        ctx.fillText(n.toString(), vx, lineY + 24);
      }
      ctx.restore();

      // Điểm bắt đầu firstNum
      const startX = originX + state.firstNum * stepPx;
      const endX = originX + intCalc.result * stepPx;

      ctx.save();
      // Điểm xuất phát
      ctx.beginPath();
      ctx.arc(startX, lineY, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Đường cong nhảy (Jump Arc)
      const jumpDist = endX - startX;
      const arcHeight = Math.min(80, Math.max(35, Math.abs(jumpDist) * 0.35));
      const midX = (startX + endX) / 2;
      const midY = lineY - arcHeight;

      ctx.beginPath();
      ctx.moveTo(startX, lineY);
      ctx.quadraticCurveTo(midX, midY - 20, endX, lineY);
      ctx.strokeStyle = jumpDist >= 0 ? '#10b981' : '#ef4444';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Mũi tên chỉ hướng nhảy ở cuối cung
      drawJumpArrow(ctx, midX, midY - 10, endX, lineY, jumpDist >= 0 ? '#10b981' : '#ef4444');

      // Điểm kết thúc (Result)
      ctx.beginPath();
      ctx.arc(endX, lineY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Banner kết quả phép tính ở đỉnh
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
      ctx.textAlign = 'center';
      ctx.fillText(intCalc.formulaStr, width / 2, height * 0.18);

      ctx.font = '13px system-ui, sans-serif';
      ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
      ctx.fillText(intCalc.stepExplanationVi, width / 2, height * 0.26);
      ctx.restore();

    } else {
      // ================= 2. PHÂN SỐ TRỰC QUAN =================
      const cx = width * 0.35;
      const cy = height * 0.52;
      const radius = 110;

      const { numerator, denominator, displayModel } = state;

      if (displayModel === 'circle') {
        // Mô hình đĩa tròn Pizza
        ctx.save();
        ctx.translate(cx, cy);

        // Nền đĩa tròn
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.8)';
        ctx.fill();
        ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Vẽ các phần được tô màu
        let startAngle = -Math.PI / 2;
        const sliceAngle = (2 * Math.PI) / denominator;

        for (let i = 0; i < denominator; i++) {
          const endAngle = startAngle + sliceAngle;
          const isFilled = i < numerator;

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, radius, startAngle, endAngle);
          ctx.closePath();

          ctx.fillStyle = isFilled
            ? '#0284c7'
            : isDark
            ? 'rgba(51, 65, 85, 0.2)'
            : 'rgba(226, 232, 240, 0.4)';
          ctx.fill();

          ctx.strokeStyle = isDark ? '#0f172a' : '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          startAngle = endAngle;
        }

        ctx.restore();

      } else {
        // Mô hình thanh chữ nhật Fraction Bar
        const barX = width * 0.15;
        const barY = height * 0.42;
        const barW = width * 0.42;
        const barH = 55;

        ctx.save();
        ctx.fillStyle = isDark ? '#1e293b' : '#f1f5f9';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barW, barH);

        const slotW = barW / denominator;
        for (let i = 0; i < denominator; i++) {
          const isFilled = i < numerator;
          if (isFilled) {
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(barX + i * slotW, barY, slotW, barH);
          }
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(barX + i * slotW, barY, slotW, barH);
        }
        ctx.restore();
      }

      // Thông số toán học ở bên phải
      const infoX = width * 0.65;
      const infoY = height * 0.35;

      ctx.save();
      ctx.textAlign = 'left';

      // Phân số to
      ctx.font = 'bold 36px monospace';
      ctx.fillStyle = '#0284c7';
      ctx.fillText(`${numerator} / ${denominator}`, infoX, infoY);

      ctx.font = '14px system-ui, sans-serif';
      ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';

      if (fracCalc.simplifiedNumerator !== numerator || fracCalc.simplifiedDenominator !== denominator) {
        ctx.fillText(`= Rút gọn tối giản: ${fracCalc.simplifiedNumerator} / ${fracCalc.simplifiedDenominator}`, infoX, infoY + 40);
      } else {
        ctx.fillText(`(Đã là phân số tối giản)`, infoX, infoY + 40);
      }

      ctx.fillStyle = '#10b981';
      ctx.fillText(`= Số thập phân: ${fracCalc.decimalValue}`, infoX, infoY + 70);
      ctx.fillText(`= Tỉ lệ phần trăm: ${fracCalc.percentage}%`, infoX, infoY + 100);

      if (fracCalc.isImproper) {
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`= Hỗn số: ${fracCalc.mixedNumberStr}`, infoX, infoY + 130);
      }
      ctx.restore();
    }
  }, [state, intCalc, fracCalc, isDark]);

  function drawJumpArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const head = 10;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 select-none">
      <canvas
        ref={canvasRef}
        width={760}
        height={500}
        className="w-full h-full max-h-[520px] rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800"
      />
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
        <span>🔢 {state.mode === 'integers' ? 'Số nguyên trên trục số' : 'Phân số trực quan'}</span>
      </div>
    </div>
  );
};
