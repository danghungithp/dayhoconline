import React, { useRef, useEffect } from 'react';
import { ProportionMode } from './types';

interface ProportionsCanvasProps {
  mode: 'direct' | 'inverse';
  k: number;
  a: number;
  testX: number;
  isDark: boolean;
}

export const ProportionsCanvas: React.FC<ProportionsCanvasProps> = ({
  mode,
  k,
  a,
  testX,
  isDark,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const scale = 36; // 36px per unit

    // Clear background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = isDark ? '#0b0f19' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Lưới tọa độ
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
    ctx.lineWidth = 1;
    for (let x = cx % scale; x < width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = cy % scale; y < height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Trục tọa độ Ox, Oy
    ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.5)';
    ctx.lineWidth = 1.5;

    // Trục Ox
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();

    // Trục Oy
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();

    // Số trên trục
    ctx.font = '10px monospace';
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let i = -8; i <= 8; i++) {
      if (i === 0) continue;
      const px = cx + i * scale;
      if (px > 0 && px < width) {
        ctx.fillText(i.toString(), px, cy + 4);
      }
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let j = -6; j <= 6; j++) {
      if (j === 0) continue;
      const py = cy - j * scale;
      if (py > 0 && py < height) {
        ctx.fillText(j.toString(), cx - 5, py);
      }
    }
    ctx.fillText('O', cx - 4, cy + 12);

    if (mode === 'direct') {
      // ===== ĐỒ THỊ TỈ LỆ THUẬN y = k*x =====
      ctx.save();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 6;

      ctx.beginPath();
      const xMin = -width / (2 * scale);
      const xMax = width / (2 * scale);
      ctx.moveTo(cx + xMin * scale, cy - k * xMin * scale);
      ctx.lineTo(cx + xMax * scale, cy - k * xMax * scale);
      ctx.stroke();
      ctx.restore();

      // Điểm thử nghiệm M(testX, testY)
      const testY = k * testX;
      const mx = cx + testX * scale;
      const my = cy - testY * scale;

      // Nét đứt từ M gióng xuống Ox và sang Oy
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx, cy);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(cx, my);
      ctx.stroke();
      ctx.setLineDash([]);

      // Điểm M
      ctx.beginPath();
      ctx.arc(mx, my, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Nhãn điểm M
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = isDark ? '#38bdf8' : '#0369a1';
      ctx.textAlign = 'left';
      ctx.fillText(`M(${testX}, ${testY.toFixed(1)}) -> y/x = ${k}`, mx + 8, my - 8);
      ctx.restore();
    } else {
      // ===== ĐỒ THỊ TỈ LỆ NGHỊCH y = a / x =====
      ctx.save();
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#8b5cf6';
      ctx.shadowBlur = 6;

      // Nhánh x > 0
      ctx.beginPath();
      let first = true;
      for (let px = 1; px <= width / 2; px += 2) {
        const xVal = px / scale;
        if (xVal < 0.15) continue;
        const yVal = a / xVal;
        const py = cy - yVal * scale;
        if (py < -height || py > height * 2) continue;
        if (first) {
          ctx.moveTo(cx + px, py);
          first = false;
        } else {
          ctx.lineTo(cx + px, py);
        }
      }
      ctx.stroke();

      // Nhánh x < 0
      ctx.beginPath();
      first = true;
      for (let px = -1; px >= -width / 2; px -= 2) {
        const xVal = px / scale;
        if (xVal > -0.15) continue;
        const yVal = a / xVal;
        const py = cy - yVal * scale;
        if (py < -height || py > height * 2) continue;
        if (first) {
          ctx.moveTo(cx + px, py);
          first = false;
        } else {
          ctx.lineTo(cx + px, py);
        }
      }
      ctx.stroke();
      ctx.restore();

      // Hình chữ nhật diện tích S = x * y = a
      const safeX = Math.max(0.5, testX);
      const testY = a / safeX;
      const rx = cx;
      const ry = cy;
      const rw = safeX * scale;
      const rh = -testY * scale;

      ctx.save();
      // Tô màu diện tích hình chữ nhật
      ctx.fillStyle = isDark ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.2)';
      ctx.fillRect(rx, ry, rw, rh);

      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.strokeRect(rx, ry, rw, rh);

      // Điểm M(x, y)
      const mx = cx + safeX * scale;
      const my = cy - testY * scale;
      ctx.beginPath();
      ctx.arc(mx, my, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#8b5cf6';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Chữ diện tích ở giữa hình chữ nhật
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillStyle = isDark ? '#c4b5fd' : '#6d28d9';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Diện tích S = x · y = ${a}`, rx + rw / 2, ry + rh / 2);

      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`M(${safeX.toFixed(1)}, ${testY.toFixed(1)})`, mx + 8, my - 8);
      ctx.restore();
    }
  }, [mode, k, a, testX, isDark]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 select-none">
      <canvas
        ref={canvasRef}
        width={760}
        height={500}
        className="w-full h-full max-h-[520px] rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800"
      />
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
        {mode === 'direct' ? (
          <span>📐 Tỉ lệ thuận: y = {k}x (Đường thẳng qua gốc tọa độ O)</span>
        ) : (
          <span>📐 Tỉ lệ nghịch: y = {a}/x (Diện tích hình chữ nhật x·y = {a} không đổi)</span>
        )}
      </div>
    </div>
  );
};
