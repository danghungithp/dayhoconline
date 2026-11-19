import React, { useRef, useEffect } from 'react';
import { BuoyancyOpticsState } from './types';
import { calculateBuoyancy, calculateLens, LIQUIDS, MATERIALS } from './physics8Engine';

interface BuoyancyOpticsCanvasProps {
  state: BuoyancyOpticsState;
  isDark: boolean;
}

export const BuoyancyOpticsCanvas: React.FC<BuoyancyOpticsCanvasProps> = ({ state, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const buoy = calculateBuoyancy(state.liquidType, state.material, state.blockVolumeLiters);
  const lens = calculateLens(state.focalLengthCm, state.objectDistanceCm, state.objectHeightCm);

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

    if (state.activeTab === 'buoyancy') {
      // ================= 1. LỰC ĐẨY ÁC-SI-MÉT =================
      const tankX = width * 0.25;
      const tankW = width * 0.5;
      const tankBottom = height * 0.8;
      const tankTop = height * 0.25;
      const waterY = height * 0.4; // Mặt nước

      const liqInfo = LIQUIDS[state.liquidType];
      const matInfo = MATERIALS[state.material];

      // Bình chứa chất lỏng
      ctx.save();
      // Nước trong bể
      ctx.fillStyle = liqInfo.color;
      ctx.fillRect(tankX, waterY, tankW, tankBottom - waterY);

      // Mặt thoáng chất lỏng
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(tankX, waterY);
      ctx.lineTo(tankX + tankW, waterY);
      ctx.stroke();

      // Thành bể thủy tinh
      ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
      ctx.lineWidth = 4;
      ctx.strokeRect(tankX, tankTop, tankW, tankBottom - tankTop);
      ctx.restore();

      // Khối vật thể
      const blockSide = 70;
      let blockY = waterY;

      if (buoy.state === 'floating') {
        const subRatio = buoy.submergedVolumeLiters / state.blockVolumeLiters;
        blockY = waterY - blockSide * (1 - subRatio);
      } else if (buoy.state === 'suspended') {
        blockY = waterY + 40;
      } else {
        blockY = tankBottom - blockSide; // Nằm ở đáy bể
      }

      const blockX = tankX + tankW / 2 - blockSide / 2;

      ctx.save();
      ctx.fillStyle = matInfo.color;
      ctx.fillRect(blockX, blockY, blockSide, blockSide);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(blockX, blockY, blockSide, blockSide);

      ctx.font = 'bold 11px system-ui';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(matInfo.nameVi.split(' ')[0], blockX + blockSide / 2, blockY + blockSide / 2 - 4);
      ctx.fillText(`${buoy.massKg} kg`, blockX + blockSide / 2, blockY + blockSide / 2 + 14);

      // Vẽ vector Trọng lực P (màu đỏ chỉ xuống)
      const centerX = blockX + blockSide / 2;
      const centerY = blockY + blockSide / 2;
      drawArrow(ctx, centerX, centerY, centerX, centerY + 55, '#ef4444', `P = ${buoy.weightN} N`);

      // Vẽ vector Lực đẩy Ác-si-mét FA (màu xanh chỉ lên)
      drawArrow(ctx, centerX, centerY, centerX, centerY - 55, '#22c55e', `FA = ${buoy.buoyantForceN} N`);
      ctx.restore();

      // Banner kết luận
      ctx.save();
      ctx.font = 'bold 15px system-ui';
      ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.textAlign = 'center';
      ctx.fillText(buoy.stateVi, width / 2, height * 0.16);

      ctx.font = '12px system-ui';
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.fillText(`Công thức Ác-si-mét: FA = d · V = ρ · g · Vchìm`, width / 2, height * 0.21);
      ctx.restore();

    } else {
      // ================= 2. THẤU KÍNH HỘI TỤ =================
      const cx = width * 0.5;
      const cy = height * 0.52;
      const pxPerCm = 7; // 7px per cm

      const fPx = state.focalLengthCm * pxPerCm;
      const dPx = state.objectDistanceCm * pxPerCm;
      const hPx = state.objectHeightCm * pxPerCm * 2;

      // Trục chính Δ
      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(100, 116, 139, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(30, cy);
      ctx.lineTo(width - 30, cy);
      ctx.stroke();

      // Thấu kính hội tụ (trục đứng có 2 mũi tên hướng ra ngoài)
      const lensH = 240;
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy - lensH / 2);
      ctx.lineTo(cx, cy + lensH / 2);
      ctx.stroke();

      // Mũi tên 2 đầu thấu kính hội tụ
      drawLensArrowHead(ctx, cx, cy - lensH / 2, true);
      drawLensArrowHead(ctx, cx, cy + lensH / 2, false);

      // Quang tâm O
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.font = 'bold 12px system-ui';
      ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
      ctx.fillText('O', cx - 12, cy + 16);

      // Hai tiêu điểm F (trái) và F' (phải)
      const fx = cx - fPx;
      const fPrimex = cx + fPx;

      ctx.beginPath();
      ctx.arc(fx, cy, 4, 0, Math.PI * 2);
      ctx.arc(fPrimex, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.fillText('F', fx - 5, cy + 18);
      ctx.fillText("F'", fPrimex - 5, cy + 18);

      // Điểm 2F và 2F'
      ctx.fillText('2F', cx - 2 * fPx - 8, cy + 18);
      ctx.fillText("2F'", cx + 2 * fPx - 8, cy + 18);

      // Vật sáng AB (mũi tên hướng lên bên trái)
      const ax = cx - dPx;
      const by = cy - hPx;

      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(ax, cy);
      ctx.lineTo(ax, by);
      ctx.stroke();
      drawVerticalArrowHead(ctx, ax, by, true, '#22c55e');

      ctx.font = 'bold 12px system-ui';
      ctx.fillStyle = '#22c55e';
      ctx.fillText('A', ax - 12, cy + 16);
      ctx.fillText('B', ax - 12, by - 4);

      // Vẽ 2 tia sáng đặc biệt từ đỉnh B
      if (state.showSpecialRays && Math.abs(state.objectDistanceCm - state.focalLengthCm) >= 0.5) {
        // Tia 1: Song song trục chính ➔ đi qua F'
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ax, by);
        ctx.lineTo(cx, by);
        ctx.lineTo(width - 50, cy + (by - cy) * -((width - 50 - cx) / fPx - 1));
        ctx.stroke();

        // Tia 2: Đi qua quang tâm O truyền thẳng
        ctx.strokeStyle = '#a855f7';
        ctx.beginPath();
        ctx.moveTo(ax, by);
        ctx.lineTo(width - 50, cy + ((cy - by) / dPx) * (width - 50 - cx));
        ctx.stroke();
      }

      // Vẽ ảnh A'B'
      if (Math.abs(lens.imageDistanceCm) < 80) {
        const aPrimex = cx + lens.imageDistanceCm * pxPerCm;
        const bPrimey = cy + (lens.isInverted ? 1 : -1) * (lens.imageHeightCm * pxPerCm * 2);

        ctx.save();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        if (!lens.isReal) {
          ctx.setLineDash([5, 4]); // Ảnh ảo nét đứt
        }

        ctx.beginPath();
        ctx.moveTo(aPrimex, cy);
        ctx.lineTo(aPrimex, bPrimey);
        ctx.stroke();
        drawVerticalArrowHead(ctx, aPrimex, bPrimey, !lens.isInverted, '#ef4444');

        ctx.font = 'bold 12px system-ui';
        ctx.fillStyle = '#ef4444';
        ctx.fillText("A'", aPrimex + 6, cy + 16);
        ctx.fillText("B'", aPrimex + 6, bPrimey + (lens.isInverted ? 16 : -4));
        ctx.restore();
      }

      // Banner kết luận tính chất ảnh
      ctx.font = 'bold 14px system-ui';
      ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.textAlign = 'center';
      ctx.fillText(lens.imageTypeVi, width / 2, height * 0.15);

      ctx.font = '12px monospace';
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.fillText(
        `d = ${state.objectDistanceCm}cm | d' = ${lens.imageDistanceCm}cm | h = ${state.objectHeightCm}cm | h' = ${lens.imageHeightCm}cm`,
        width / 2,
        height * 0.21
      );
      ctx.restore();
    }
  }, [state, buoy, lens, isDark]);

  function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, label: string) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const head = 9;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 11px system-ui';
    ctx.fillText(label, x2 + 15, (y1 + y2) / 2);
    ctx.restore();
  }

  function drawLensArrowHead(ctx: CanvasRenderingContext2D, x: number, y: number, isTop: boolean) {
    ctx.save();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    const dy = isTop ? 10 : -10;
    ctx.beginPath();
    ctx.moveTo(x - 8, y + dy);
    ctx.lineTo(x, y);
    ctx.lineTo(x + 8, y + dy);
    ctx.stroke();
    ctx.restore();
  }

  function drawVerticalArrowHead(ctx: CanvasRenderingContext2D, x: number, y: number, pointingUp: boolean, color: string) {
    ctx.save();
    ctx.fillStyle = color;
    const dy = pointingUp ? 8 : -8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 5, y + dy);
    ctx.lineTo(x + 5, y + dy);
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
        <span>🔬 {state.activeTab === 'buoyancy' ? 'Lực đẩy Ác-si-mét & Sự nổi' : 'Thấu kính hội tụ & Tạo ảnh quang học'}</span>
      </div>
    </div>
  );
};
