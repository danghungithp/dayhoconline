import React, { useRef, useEffect } from 'react';
import { IdentitiesState, IdentityBreakdown } from './types';
import { calculateIdentityBreakdown } from './algebraEngine';

interface IdentitiesCanvasProps {
  state: IdentitiesState;
  onUpdateState: (patch: Partial<IdentitiesState>) => void;
  isDark?: boolean;
}

export const IdentitiesCanvas: React.FC<IdentitiesCanvasProps> = ({
  state,
  isDark = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const breakdown: IdentityBreakdown = calculateIdentityBreakdown(
    state.identityType,
    state.paramA,
    state.paramB
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear background
      ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = isDark ? '#1e293b' : '#e2e8f0';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const { identityType, paramA: a, paramB: b, showLabels, unfoldProgress } = state;

      // Draw according to identity type
      if (identityType === 'square-sum') {
        renderSquareSum(ctx, width, height, a, b, showLabels, isDark);
      } else if (identityType === 'square-diff') {
        renderSquareDiff(ctx, width, height, a, b, showLabels, isDark);
      } else {
        renderDiffSquares(ctx, width, height, a, b, unfoldProgress, showLabels, isDark);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, isDark, breakdown]);

  return (
    <div className="relative w-full h-full min-h-[420px] flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={700}
        height={480}
        className="w-full h-full max-h-[500px] object-contain rounded-xl shadow-lg border border-slate-700/40"
      />
    </div>
  );
};

// Helper: Vẽ (a + b)^2
function renderSquareSum(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  a: number,
  b: number,
  showLabels: boolean,
  isDark: boolean
) {
  const totalUnits = a + b;
  const maxPx = Math.min(w * 0.55, h * 0.65);
  const scale = maxPx / totalUnits;

  const aPx = a * scale;
  const bPx = b * scale;
  const totalPx = aPx + bPx;

  const startX = (w - totalPx) / 2;
  const startY = (h - totalPx) / 2 + 10;

  // Khối 1: a x a (Top-Left)
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(startX, startY, aPx, aPx);
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 2;
  ctx.strokeRect(startX, startY, aPx, aPx);

  // Khối 2: a x b (Top-Right)
  ctx.fillStyle = '#10b981';
  ctx.fillRect(startX + aPx, startY, bPx, aPx);
  ctx.strokeStyle = '#34d399';
  ctx.strokeRect(startX + aPx, startY, bPx, aPx);

  // Khối 3: b x a (Bottom-Left)
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(startX, startY + aPx, aPx, bPx);
  ctx.strokeStyle = '#fbbf24';
  ctx.strokeRect(startX, startY + aPx, aPx, bPx);

  // Khối 4: b x b (Bottom-Right)
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(startX + aPx, startY + aPx, bPx, bPx);
  ctx.strokeStyle = '#f87171';
  ctx.strokeRect(startX + aPx, startY + aPx, bPx, bPx);

  // Viền bao tổng thể
  ctx.strokeStyle = isDark ? '#ffffff' : '#000000';
  ctx.lineWidth = 3;
  ctx.strokeRect(startX, startY, totalPx, totalPx);

  // Text và nhãn diện tích
  if (showLabels) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 15px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';

    // Label a^2
    ctx.fillText(`a² = ${a * a}`, startX + aPx / 2, startY + aPx / 2);
    // Label a*b
    ctx.fillText(`a·b = ${a * b}`, startX + aPx + bPx / 2, startY + aPx / 2);
    // Label b*a
    ctx.fillText(`b·a = ${b * a}`, startX + aPx / 2, startY + aPx + bPx / 2);
    // Label b^2
    ctx.fillText(`b² = ${b * b}`, startX + aPx + bPx / 2, startY + aPx + bPx / 2);

    // Kích thước cạnh trên
    drawDimension(ctx, startX, startY - 18, aPx, `a = ${a}`, isDark);
    drawDimension(ctx, startX + aPx, startY - 18, bPx, `b = ${b}`, isDark);

    // Kích thước cạnh trái
    drawVerticalDimension(ctx, startX - 18, startY, aPx, `a = ${a}`, isDark);
    drawVerticalDimension(ctx, startX - 18, startY + aPx, bPx, `b = ${b}`, isDark);
  }

  // Tên công thức trên đầu
  ctx.font = 'bold 18px Inter, system-ui, sans-serif';
  ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
  ctx.textAlign = 'center';
  ctx.fillText(
    `(a + b)² = a² + 2ab + b²  (${totalUnits}² = ${a * a} + ${2 * a * b} + ${b * b} = ${totalUnits * totalUnits})`,
    w / 2,
    30
  );
}

// Helper: Vẽ (a - b)^2
function renderSquareDiff(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  a: number,
  b: number,
  showLabels: boolean,
  isDark: boolean
) {
  const validB = Math.min(b, a - 0.5);
  const maxPx = Math.min(w * 0.55, h * 0.65);
  const scale = maxPx / a;

  const aPx = a * scale;
  const bPx = validB * scale;
  const ambPx = aPx - bPx; // (a - b)

  const startX = (w - aPx) / 2;
  const startY = (h - aPx) / 2 + 10;

  // Hình vuông lớn a x a (toàn bộ nền mờ)
  ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
  ctx.fillRect(startX, startY, aPx, aPx);

  // Vùng (a - b)^2 (góc trên bên trái)
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(startX, startY, ambPx, ambPx);
  ctx.strokeStyle = '#818cf8';
  ctx.lineWidth = 2;
  ctx.strokeRect(startX, startY, ambPx, ambPx);

  // Vùng trừ 1: (a - b) x b (bên phải)
  ctx.fillStyle = '#f43f5e88';
  ctx.fillRect(startX + ambPx, startY, bPx, ambPx);
  ctx.strokeStyle = '#f43f5e';
  ctx.strokeRect(startX + ambPx, startY, bPx, ambPx);

  // Vùng trừ 2: a x b (dưới cùng)
  ctx.fillStyle = '#fb923c88';
  ctx.fillRect(startX, startY + ambPx, aPx, bPx);
  ctx.strokeStyle = '#fb923c';
  ctx.strokeRect(startX, startY + ambPx, aPx, bPx);

  // Góc giao nhau bù: b x b
  ctx.fillStyle = '#10b981aa';
  ctx.fillRect(startX + ambPx, startY + ambPx, bPx, bPx);
  ctx.strokeStyle = '#34d399';
  ctx.strokeRect(startX + ambPx, startY + ambPx, bPx, bPx);

  // Viền ngoài vuông a
  ctx.strokeStyle = isDark ? '#94a3b8' : '#475569';
  ctx.lineWidth = 3;
  ctx.strokeRect(startX, startY, aPx, aPx);

  if (showLabels) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 15px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';

    ctx.fillText(`(a - b)²`, startX + ambPx / 2, startY + ambPx / 2);
    ctx.fillText(`- (a-b)b`, startX + ambPx + bPx / 2, startY + ambPx / 2);
    ctx.fillText(`- ab (có cộng lại b² bù)`, startX + aPx / 2, startY + ambPx + bPx / 2);

    drawDimension(ctx, startX, startY - 18, ambPx, `a - b`, isDark);
    drawDimension(ctx, startX + ambPx, startY - 18, bPx, `b`, isDark);
  }

  ctx.font = 'bold 18px Inter, system-ui, sans-serif';
  ctx.fillStyle = isDark ? '#a5b4fc' : '#4338ca';
  ctx.textAlign = 'center';
  const res = (a - validB) * (a - validB);
  ctx.fillText(
    `(a - b)² = a² - 2ab + b² = ${(a - validB).toFixed(1)}² = ${res.toFixed(2)}`,
    w / 2,
    30
  );
}

// Helper: Vẽ a^2 - b^2 = (a - b)(a + b) (với animation dịch chuyển ghép hình chữ nhật)
function renderDiffSquares(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  a: number,
  b: number,
  progress: number, // 0 -> 1 (0: L-shape ban đầu, 1: ghép thành hình chữ nhật (a-b) x (a+b))
  showLabels: boolean,
  isDark: boolean
) {
  const validB = Math.min(b, a - 0.5);
  const maxPx = Math.min(w * 0.45, h * 0.6);
  const scale = maxPx / a;

  const aPx = a * scale;
  const bPx = validB * scale;
  const ambPx = aPx - bPx; // chiều cao a - b

  const originX = (w - (aPx + bPx)) / 2;
  const originY = (h - aPx) / 2 + 20;

  // Mảnh 1 (Cố định): Kích thước a x (a - b)
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(originX, originY, aPx, ambPx);
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 2;
  ctx.strokeRect(originX, originY, aPx, ambPx);

  // Mảnh 2 (Di chuyển xoay ghép): Kích thước (a - b) x b
  // Khi progress = 0: nằm ở dưới mảnh 1: x = originX, y = originY + ambPx, width = validB * scale = bPx, height = ambPx
  // Khi progress = 1: dịch chuyển sang bên phải mảnh 1: x = originX + aPx, y = originY, width = bPx, height = ambPx
  const curX = originX + progress * aPx;
  const curY = originY + ambPx * (1 - progress);

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(curX, curY, bPx, ambPx);
  ctx.strokeStyle = '#fbbf24';
  ctx.strokeRect(curX, curY, bPx, ambPx);

  // Lỗ khuyết b^2 khi progress = 0
  if (progress < 0.2) {
    const holeX = originX + bPx;
    const holeY = originY + ambPx;
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#ef4444';
    ctx.strokeRect(holeX, holeY, ambPx, bPx);
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef444488';
    ctx.fillText('Đã cắt b²', holeX + ambPx / 2, holeY + bPx / 2);
  }

  // Viền chữ nhật hoàn chỉnh khi progress > 0.95
  if (progress > 0.95) {
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.strokeRect(originX, originY, aPx + bPx, ambPx);
  }

  if (showLabels) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 14px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';

    ctx.fillText(`Mảnh 1: a × (a-b)`, originX + aPx / 2, originY + ambPx / 2);
    ctx.fillText(`Mảnh 2: b × (a-b)`, curX + bPx / 2, curY + ambPx / 2);

    if (progress > 0.8) {
      drawDimension(ctx, originX, originY - 18, aPx + bPx, `Chiều dài = a + b = ${(a + validB).toFixed(1)}`, isDark);
      drawVerticalDimension(ctx, originX - 18, originY, ambPx, `Chiều rộng = a - b = ${(a - validB).toFixed(1)}`, isDark);
    }
  }

  ctx.font = 'bold 18px Inter, system-ui, sans-serif';
  ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
  ctx.textAlign = 'center';
  const total = a * a - validB * validB;
  ctx.fillText(
    `a² - b² = (a - b)(a + b) = ${(a - validB).toFixed(1)} × ${(a + validB).toFixed(1)} = ${total.toFixed(2)}`,
    w / 2,
    30
  );
}

// Draw horizontal dimension line with arrows
function drawDimension(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, label: string, isDark: boolean) {
  ctx.strokeStyle = isDark ? '#94a3b8' : '#475569';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(x, y - 4);
  ctx.lineTo(x, y + 4);
  ctx.moveTo(x, y);
  ctx.lineTo(x + len, y);
  ctx.moveTo(x + len, y - 4);
  ctx.lineTo(x + len, y + 4);
  ctx.stroke();

  ctx.font = '12px Inter, system-ui, sans-serif';
  ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
  ctx.textAlign = 'center';
  ctx.fillText(label, x + len / 2, y - 8);
}

// Draw vertical dimension line with arrows
function drawVerticalDimension(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, label: string, isDark: boolean) {
  ctx.strokeStyle = isDark ? '#94a3b8' : '#475569';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(x - 4, y);
  ctx.lineTo(x + 4, y);
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + len);
  ctx.moveTo(x - 4, y + len);
  ctx.lineTo(x + 4, y + len);
  ctx.stroke();

  ctx.save();
  ctx.translate(x - 8, y + len / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = '12px Inter, system-ui, sans-serif';
  ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
  ctx.textAlign = 'center';
  ctx.fillText(label, 0, 0);
  ctx.restore();
}
