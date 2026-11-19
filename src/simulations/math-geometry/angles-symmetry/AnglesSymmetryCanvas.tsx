import React, { useRef, useEffect, useState } from 'react';
import { AnglesSymmetryState } from './types';
import { classifyAngle } from './geometry6Engine';

interface AnglesSymmetryCanvasProps {
  state: AnglesSymmetryState;
  onAngleChange: (deg: number) => void;
  isDark: boolean;
}

export const AnglesSymmetryCanvas: React.FC<AnglesSymmetryCanvasProps> = ({
  state,
  onAngleChange,
  isDark,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const angleInfo = classifyAngle(state.angleDeg);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (state.mode !== 'angles') return;
    setIsDragging(true);
    updateAngleFromPointer(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging || state.mode !== 'angles') return;
    updateAngleFromPointer(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const updateAngleFromPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = canvas.width / 2;
    const cy = canvas.height * 0.55;

    const dx = x - cx;
    const dy = cy - y; // dy > 0 phía trên

    let rad = Math.atan2(dy, dx);
    if (rad < 0) rad += 2 * Math.PI;

    let deg = Math.round((rad * 180) / Math.PI);
    onAngleChange(deg);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height * 0.55;
    const radius = 150;

    // Clear
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = isDark ? '#0b0f19' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    if (state.mode === 'angles') {
      // ================= 1. GÓC VÀ THƯỚC ĐO ĐỘ =================

      // Thước đo độ tròn 360°
      if (state.showProtractor) {
        ctx.save();
        ctx.translate(cx, cy);

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(100, 116, 139, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        for (let deg = 0; deg < 360; deg += 5) {
          const rad = (deg * Math.PI) / 180;
          const isMajor = deg % 10 === 0;
          const isQuadrant = deg % 90 === 0;
          const tickLen = isQuadrant ? 14 : isMajor ? 9 : 5;

          const r1 = radius;
          const r2 = radius - tickLen;

          ctx.beginPath();
          ctx.moveTo(r1 * Math.cos(-rad), r1 * Math.sin(-rad));
          ctx.lineTo(r2 * Math.cos(-rad), r2 * Math.sin(-rad));
          ctx.strokeStyle = isQuadrant
            ? '#f59e0b'
            : isMajor
            ? (isDark ? 'rgba(226, 232, 240, 0.4)' : 'rgba(51, 65, 85, 0.4)')
            : (isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.2)');
          ctx.lineWidth = isQuadrant ? 2 : 1;
          ctx.stroke();

          // Chữ số đo góc
          if (isMajor && deg % 30 === 0) {
            const tr = radius - 20;
            const tx = tr * Math.cos(-rad);
            const ty = tr * Math.sin(-rad);
            ctx.font = '9px monospace';
            ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${deg}°`, tx, ty);
          }
        }
        ctx.restore();
      }

      // Cung góc tô màu
      const radAngle = (state.angleDeg * Math.PI) / 180;
      if (state.showAngleArc && state.angleDeg > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, 55, 0, -radAngle, true);
        ctx.closePath();
        ctx.fillStyle = isDark ? 'rgba(2, 132, 199, 0.25)' : 'rgba(186, 230, 253, 0.6)';
        ctx.fill();

        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ký hiệu góc vuông nếu đúng 90 độ
        if (state.angleDeg === 90) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(cx, cy - 20, 20, 20);
        }
        ctx.restore();
      }

      // Tia gốc Ox (nằm ngang cố định sang phải)
      ctx.save();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * 1.15, cy);
      ctx.stroke();

      drawRayArrow(ctx, cx, cy, cx + radius * 1.15, cy, '#0284c7');
      ctx.font = 'bold 14px system-ui';
      ctx.fillStyle = '#0284c7';
      ctx.fillText('Ox', cx + radius * 1.2, cy + 5);

      // Tia quay Oy (theo góc angleDeg)
      const oyX = cx + radius * 1.15 * Math.cos(-radAngle);
      const oyY = cy + radius * 1.15 * Math.sin(-radAngle);

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(oyX, oyY);
      ctx.stroke();

      drawRayArrow(ctx, cx, cy, oyX, oyY, '#f59e0b');
      ctx.font = 'bold 14px system-ui';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('Oy', oyX + 8, oyY);

      // Đỉnh O
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 14px system-ui';
      ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
      ctx.fillText('O', cx - 18, cy + 18);
      ctx.restore();

      // Banner phân loại góc ở đỉnh
      ctx.save();
      ctx.font = 'bold 20px system-ui, sans-serif';
      ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
      ctx.textAlign = 'center';
      ctx.fillText(`Số đo góc: xOy = ${state.angleDeg}°`, width / 2, height * 0.15);

      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.fillStyle = '#0284c7';
      ctx.fillText(angleInfo.nameVi, width / 2, height * 0.22);
      ctx.restore();

    } else if (state.mode === 'axis-symmetry') {
      // ================= 2. TRỤC ĐỐI XỨNG =================
      const axisX = width / 2;
      const foldScale = Math.cos(state.foldProgress * Math.PI); // gấp hình 3D phẳng

      // Trục đối xứng d nét đứt
      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(axisX, 40);
      ctx.lineTo(axisX, height - 40);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = 'bold 13px system-ui';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.fillText('Trục đối xứng (d)', axisX, 30);

      // Vẽ hình trái tim hoặc cánh bướm đối xứng
      const shapeColor = '#ec4899';

      // Nửa bên trái cố định
      ctx.save();
      ctx.translate(axisX, height * 0.5);
      drawSymmetricHalf(ctx, state.symmetryShape, -1, 1, shapeColor, isDark);
      ctx.restore();

      // Nửa bên phải (có thể gấp sang)
      ctx.save();
      ctx.translate(axisX, height * 0.5);
      drawSymmetricHalf(ctx, state.symmetryShape, 1 * foldScale, 1, shapeColor, isDark);
      ctx.restore();

      ctx.font = 'bold 14px system-ui';
      ctx.fillStyle = isDark ? '#f472b6' : '#db2777';
      ctx.textAlign = 'center';
      ctx.fillText(
        state.foldProgress >= 0.95
          ? '🎉 Hai nửa hình trùng khít lên nhau hoàn toàn khi gấp theo trục d!'
          : 'Kéo thanh "Gấp hình" để kiểm chứng hai nửa trùng khít qua trục đối xứng.',
        width / 2,
        height * 0.88
      );
      ctx.restore();

    } else {
      // ================= 3. TÂM ĐỐI XỨNG =================
      const centerX = width / 2;
      const centerY = height * 0.52;

      ctx.save();
      // Tâm đối xứng O
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 13px system-ui';
      ctx.fillStyle = '#f59e0b';
      ctx.textAlign = 'center';
      ctx.fillText('Tâm đối xứng (O)', centerX, centerY + 25);

      // Hình chong chóng hoặc chữ S xoay quanh tâm
      ctx.translate(centerX, centerY);
      ctx.rotate((state.rotationAngleDeg * Math.PI) / 180);

      drawCenterSymmetricShape(ctx, state.symmetryShape, '#8b5cf6', isDark);
      ctx.restore();

      ctx.font = 'bold 14px system-ui';
      ctx.fillStyle = isDark ? '#a78bfa' : '#7c3aed';
      ctx.textAlign = 'center';
      ctx.fillText(
        state.rotationAngleDeg === 180
          ? '🎉 Khi quay 180° quanh tâm O, hình trùng khít vào chính nó (Tâm đối xứng)!'
          : `Góc xoay quanh tâm: ${state.rotationAngleDeg}° (Xoay đủ 180° để trùng khít)`,
        width / 2,
        height * 0.88
      );
    }
  }, [state, angleInfo, isDark]);

  function drawRayArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const head = 12;
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

  function drawSymmetricHalf(
    ctx: CanvasRenderingContext2D,
    shape: string,
    scaleX: number,
    scaleY: number,
    color: string,
    dark: boolean
  ) {
    ctx.save();
    ctx.scale(scaleX, scaleY);
    ctx.fillStyle = `${color}40`;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    ctx.beginPath();
    if (shape === 'heart') {
      ctx.moveTo(0, 80);
      ctx.bezierCurveTo(90, 40, 110, -50, 0, -80);
    } else if (shape === 'butterfly') {
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(80, -90, 130, -30, 20, 10);
      ctx.bezierCurveTo(110, 40, 80, 90, 0, 40);
    } else {
      // Chữ A
      ctx.moveTo(0, -90);
      ctx.lineTo(60, 90);
      ctx.lineTo(35, 90);
      ctx.lineTo(15, 20);
      ctx.lineTo(0, 20);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawCenterSymmetricShape(ctx: CanvasRenderingContext2D, shape: string, color: string, dark: boolean) {
    ctx.save();
    ctx.fillStyle = `${color}40`;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    // Chong chóng 4 cánh tâm đối xứng
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI) / 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(50, -40, 85, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 select-none">
      <canvas
        ref={canvasRef}
        width={760}
        height={500}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-full max-h-[520px] rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800 cursor-crosshair touch-none"
      />
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
        <span>📐 {state.mode === 'angles' ? 'Kéo tia Oy để xoay góc và đo số đo' : state.mode === 'axis-symmetry' ? 'Trục đối xứng gương' : 'Tâm đối xứng quay 180°'}</span>
      </div>
    </div>
  );
};
