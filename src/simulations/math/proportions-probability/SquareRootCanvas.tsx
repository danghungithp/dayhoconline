import React, { useRef, useEffect } from 'react';
import { analyzeSquareRoot } from './proportionsSolver';

interface SquareRootCanvasProps {
  area: number;
  isDark: boolean;
}

export const SquareRootCanvas: React.FC<SquareRootCanvasProps> = ({
  area,
  isDark,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const info = analyzeSquareRoot(area);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    // Clear background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = isDark ? '#0b0f19' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Kích thước cạnh hình vuông trên màn hình
    const maxSidePx = Math.min(width, height) * 0.65;
    const sidePx = Math.min(maxSidePx, Math.max(60, (info.side / 10) * maxSidePx));

    const x0 = cx - sidePx / 2;
    const y0 = cy - sidePx / 2;

    // Vẽ hình vuông chính
    ctx.save();
    ctx.fillStyle = isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)';
    ctx.fillRect(x0, y0, sidePx, sidePx);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.strokeRect(x0, y0, sidePx, sidePx);

    // Vẽ lưới các ô đơn vị nếu là số chính phương nhỏ hơn bằng 100
    if (info.isPerfectSquare && info.side <= 12) {
      const step = sidePx / info.side;
      ctx.strokeStyle = isDark ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.3)';
      ctx.lineWidth = 1;

      for (let i = 1; i < info.side; i++) {
        // Đường dọc
        ctx.beginPath();
        ctx.moveTo(x0 + i * step, y0);
        ctx.lineTo(x0 + i * step, y0 + sidePx);
        ctx.stroke();

        // Đường ngang
        ctx.beginPath();
        ctx.moveTo(x0, y0 + i * step);
        ctx.lineTo(x0 + sidePx, y0 + i * step);
        ctx.stroke();
      }
    }

    // Nhãn kích thước cạnh bên trên
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillStyle = isDark ? '#34d399' : '#059669';
    ctx.textAlign = 'center';
    ctx.fillText(`Cạnh a = √${area} = ${info.side}`, cx, y0 - 15);

    // Nhãn cạnh bên trái
    ctx.save();
    ctx.translate(x0 - 15, cy);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`a = ${info.side}`, 0, 0);
    ctx.restore();

    // Diện tích S ở chính giữa
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillStyle = isDark ? '#6ee7b7' : '#047857';
    ctx.fillText(`S = a² = ${area}`, cx, cy - 6);

    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.fillText(
      info.isPerfectSquare
        ? `(Số chính phương: ${info.side}² = ${area})`
        : `(Căn bậc hai số học: a = √${area} ≈ ${info.side})`,
      cx,
      cy + 18
    );

    ctx.restore();
  }, [area, info, isDark]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 select-none">
      <canvas
        ref={canvasRef}
        width={760}
        height={500}
        className="w-full h-full max-h-[520px] rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800"
      />
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
        <span>🟩 Khai căn bậc hai số học qua diện tích hình vuông: a = √S</span>
      </div>
    </div>
  );
};
