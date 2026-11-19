import React, { useRef, useEffect } from 'react';
import { SpinnerSlice, SpinnerStats } from './types';
import { analyzeProbability } from './proportionsSolver';

interface ProbabilitySpinnerCanvasProps {
  slices: SpinnerSlice[];
  stats: SpinnerStats;
  currentSliceId: string | null;
  isSpinning: boolean;
  isDark: boolean;
  rotationDeg: number;
}

export const ProbabilitySpinnerCanvas: React.FC<ProbabilitySpinnerCanvasProps> = ({
  slices,
  stats,
  currentSliceId,
  isSpinning,
  isDark,
  rotationDeg,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = isDark ? '#0b0f19' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Bố cục 2 cột: Cột trái vẽ Vòng quay, Cột phải vẽ Biểu đồ tần số
    const spinnerCx = width * 0.32;
    const spinnerCy = height * 0.52;
    const spinnerRadius = Math.min(width * 0.24, height * 0.38);

    const totalWeight = slices.reduce((acc, s) => acc + s.weight, 0);

    // ================= 1. VẼ VÒNG QUAY MAY MẮN =================
    ctx.save();
    ctx.translate(spinnerCx, spinnerCy);
    ctx.rotate((rotationDeg * Math.PI) / 180);

    let startAngle = -Math.PI / 2;
    slices.forEach(slice => {
      const sliceAngle = (slice.weight / totalWeight) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, spinnerRadius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();

      ctx.strokeStyle = isDark ? '#1e293b' : '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Nhãn trên từng rẻ quạt
      const midAngle = startAngle + sliceAngle / 2;
      const textR = spinnerRadius * 0.65;
      const tx = textR * Math.cos(midAngle);
      const ty = textR * Math.sin(midAngle);

      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(midAngle + Math.PI / 2);
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 4;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(slice.label, 0, 0);
      ctx.restore();

      startAngle = endAngle;
    });

    // Trục xoay ở giữa
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();

    // Kim chỉ cố định ở đỉnh 12 giờ
    ctx.save();
    ctx.translate(spinnerCx, spinnerCy - spinnerRadius - 4);
    ctx.beginPath();
    ctx.moveTo(0, 14);
    ctx.lineTo(-12, -14);
    ctx.lineTo(12, -14);
    ctx.closePath();
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // ================= 2. VẼ BIỂU ĐỒ TẦN SỐ THỰC NGHIỆM =================
    const chartLeft = width * 0.62;
    const chartTop = height * 0.18;
    const chartWidth = width * 0.33;
    const chartHeight = height * 0.65;
    const chartBottom = chartTop + chartHeight;

    // Tiêu đề biểu đồ
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
    ctx.textAlign = 'left';
    ctx.fillText('Biểu đồ Tần số thực nghiệm vs Lý thuyết', chartLeft, chartTop - 18);

    // Trục tọa độ biểu đồ
    ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(100, 116, 139, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(chartLeft, chartTop);
    ctx.lineTo(chartLeft, chartBottom);
    ctx.lineTo(chartLeft + chartWidth, chartBottom);
    ctx.stroke();

    // Đường xác suất lý thuyết (dòng nét đứt 25% nếu chia đều 4 ô)
    const probData = analyzeProbability(slices, stats);
    const maxProb = 100; // 0% đến 100%

    // Vạch 50% và 25%
    [25, 50].forEach(p => {
      const y = chartBottom - (p / maxProb) * chartHeight;
      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(251, 191, 36, 0.4)' : 'rgba(217, 119, 6, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(chartLeft, y);
      ctx.lineTo(chartLeft + chartWidth, y);
      ctx.stroke();

      ctx.font = '10px monospace';
      ctx.fillStyle = isDark ? '#fbbf24' : '#d97706';
      ctx.textAlign = 'right';
      ctx.fillText(`${p}%`, chartLeft - 6, y + 3);
      ctx.restore();
    });

    // Vẽ các cột của từng rẻ quạt
    const numBars = slices.length;
    const barSlot = chartWidth / numBars;
    const barWidth = barSlot * 0.55;

    probData.forEach((item, index) => {
      const bx = chartLeft + index * barSlot + (barSlot - barWidth) / 2;
      const barH = (item.empiricalFreq / maxProb) * chartHeight;
      const by = chartBottom - barH;

      // Cột thực nghiệm
      ctx.fillStyle = item.color;
      ctx.fillRect(bx, by, barWidth, barH);

      // Đường viền
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, barWidth, barH);

      // Đường gạch chỉ mức lý thuyết của ô này
      const theoY = chartBottom - (item.theoreticalProb / maxProb) * chartHeight;
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bx - 4, theoY);
      ctx.lineTo(bx + barWidth + 4, theoY);
      ctx.stroke();
      ctx.restore();

      // Số % thực nghiệm trên đỉnh cột
      if (stats.totalSpins > 0) {
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
        ctx.textAlign = 'center';
        ctx.fillText(`${item.empiricalFreq}%`, bx + barWidth / 2, by - 6);
      }

      // Tên nhãn phía dưới
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, bx + barWidth / 2, chartBottom + 16);

      // Số lần trúng
      ctx.font = '10px monospace';
      ctx.fillText(`(${item.count} lần)`, bx + barWidth / 2, chartBottom + 28);
    });

    // Chú thích
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.textAlign = 'left';
    ctx.fillText(`Tổng số lần quay: ${stats.totalSpins}`, chartLeft, chartBottom + 52);
  }, [slices, stats, currentSliceId, isSpinning, isDark, rotationDeg]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 select-none">
      <canvas
        ref={canvasRef}
        width={760}
        height={500}
        className="w-full h-full max-h-[520px] rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800"
      />
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
        <span>🎯 Vòng quay xác suất: Kiểm nghiệm Định luật số lớn (Bernoulli)</span>
      </div>
    </div>
  );
};
