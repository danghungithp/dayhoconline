import React, { useRef, useEffect } from 'react';
import { ProjectileParams, TrajectorySummary, TrajectoryPoint, sampleTrajectoryAtTime } from './physicsSolver';

interface ProjectileCanvasProps {
  params: ProjectileParams;
  summary: TrajectorySummary;
  idealSummary?: TrajectorySummary;
  previousSummary?: TrajectorySummary | null;
  currentTime: number;
  isRunning: boolean;
  hasFired: boolean;
  targetX: number;
  showVectors: boolean;
  showComponents: boolean;
  showEnergyHUD: boolean;
  showPreviousTrajectory: boolean;
}

export const ProjectileCanvas: React.FC<ProjectileCanvasProps> = ({
  params,
  summary,
  idealSummary,
  previousSummary,
  currentTime,
  isRunning,
  hasFired,
  targetX,
  showVectors,
  showComponents,
  showEnergyHUD,
  showPreviousTrajectory,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Viewport dimensions
    const width = canvas.width;
    const height = canvas.height;

    // Lấy kích thước thế giới tối đa để tự động co dãn (Auto-fit viewport scale)
    const maxX = Math.max(summary.maxRange, targetX + 15, idealSummary?.maxRange || 0, 50);
    const maxY = Math.max(summary.maxHeight, idealSummary?.maxHeight || 0, params.y0 + 5, 25);

    // Padding
    const padLeft = 65;
    const padBottom = 60;
    const padTop = 45;
    const padRight = 50;

    const plotWidth = width - padLeft - padRight;
    const plotHeight = height - padTop - padBottom;

    // Tỉ lệ scale mét sang pixel
    const scaleX = plotWidth / (maxX * 1.12);
    const scaleY = plotHeight / (maxY * 1.25);
    const scale = Math.min(scaleX, scaleY); // Giữ đúng tỉ lệ 1:1 hình học

    // Hàm chuyển tọa độ vật lý (mét) sang tọa độ màn hình (pixel)
    const toScreenX = (x: number) => padLeft + x * scale;
    const toScreenY = (y: number) => height - padBottom - y * scale;

    ctx.clearRect(0, 0, width, height);

    // 1. Vẽ nền trời phòng thí nghiệm và lưới tọa độ mét
    drawCoordinateGrid(ctx, width, height, padLeft, padBottom, scale, maxX, maxY);

    // 2. Vẽ bia mục tiêu (Target Bullseye) trên mặt đất
    drawTarget(ctx, toScreenX(targetX), toScreenY(0), scale);

    // 3. Vẽ bệ phóng đại bác tại (0, y0)
    drawCannon(ctx, toScreenX(0), toScreenY(params.y0), params.angleDeg, params.y0, scale, toScreenY(0));

    // 4. Vẽ quỹ đạo lần trước (Ghost trajectory) nếu có
    if (showPreviousTrajectory && previousSummary && previousSummary.path.length > 1) {
      drawTrajectoryLine(ctx, previousSummary.path, toScreenX, toScreenY, 'rgba(148, 163, 184, 0.25)', 2, [4, 4]);
    }

    // 5. Vẽ quỹ đạo lý tưởng trong chân không (nếu đang bật lực cản)
    if (params.dragCoeff > 0 && idealSummary && idealSummary.path.length > 1) {
      drawTrajectoryLine(ctx, idealSummary.path, toScreenX, toScreenY, 'rgba(6, 182, 212, 0.4)', 2, [6, 4]);
    }

    // 6. Vẽ quỹ đạo thực tế hiện tại
    if (summary.path.length > 1) {
      drawTrajectoryLine(ctx, summary.path, toScreenX, toScreenY, '#38bdf8', 3);
    }

    // 7. Vẽ vị trí quả đạn và các vector vận tốc tại thời điểm currentTime
    const currentPt: TrajectoryPoint = sampleTrajectoryAtTime(summary, currentTime);
    const ballScreenX = toScreenX(currentPt.x);
    const ballScreenY = toScreenY(currentPt.y);

    if (hasFired || isRunning) {
      // Quả đạn bay
      drawProjectile(ctx, ballScreenX, ballScreenY, currentPt.speed);

      // Các vector vận tốc
      if (showVectors && currentPt.speed > 0.1) {
        drawVelocityVectors(ctx, ballScreenX, ballScreenY, currentPt.vx, currentPt.vy, scale, showComponents);
      }
    }

    // 8. Đỉnh cao nhất (Apex marker) & Điểm rơi (Landing point)
    drawKeyPoints(ctx, summary, toScreenX, toScreenY);

    // 9. Bảng cột đo Động năng, Thế năng, Cơ năng (Energy HUD)
    if (showEnergyHUD) {
      drawEnergyHUD(ctx, width - 210, 25, currentPt, params.m);
    }

    // 10. Thước đo khoảng cách tới bia
    const distToTarget = currentPt.x - targetX;
    drawTargetTelemetry(ctx, padLeft, 25, currentPt, targetX, summary);

  }, [
    params,
    summary,
    idealSummary,
    previousSummary,
    currentTime,
    isRunning,
    hasFired,
    targetX,
    showVectors,
    showComponents,
    showEnergyHUD,
    showPreviousTrajectory,
  ]);

  // Tự động căn chỉnh kích thước Canvas theo thẻ cha
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        const ctx = canvas.getContext('2d');
        ctx?.scale(dpr, dpr);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // =========================================================================
  // CÁC HÀM VẼ CHI TIẾT
  // =========================================================================

  const drawCoordinateGrid = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    padLeft: number,
    padBottom: number,
    scale: number,
    maxX: number,
    maxY: number
  ) => {
    ctx.save();

    // Vạch mặt đất
    const groundY = h - padBottom;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // Mặt đất cỏ/nền
    const groundGrad = ctx.createLinearGradient(0, groundY, 0, h);
    groundGrad.addColorStop(0, '#0f172a');
    groundGrad.addColorStop(1, '#020617');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, groundY, w, padBottom);

    // Lưới mét Ox, Oy
    const stepMeters = maxX > 80 ? 20 : maxX > 40 ? 10 : 5;
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.fillStyle = '#64748b';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.lineWidth = 1;

    // Trục hoành Ox
    for (let x = 0; x <= maxX * 1.15; x += stepMeters) {
      const sx = padLeft + x * scale;
      if (sx > w - 10) break;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, groundY);
      ctx.stroke();

      ctx.fillText(`${x}m`, sx - 8, groundY + 16);
    }

    // Trục tung Oy
    for (let y = 0; y <= maxY * 1.2; y += stepMeters) {
      const sy = groundY - y * scale;
      if (sy < 10) break;
      ctx.beginPath();
      ctx.moveTo(padLeft, sy);
      ctx.lineTo(w, sy);
      ctx.stroke();

      ctx.fillText(`${y}m`, padLeft - 34, sy + 3);
    }

    // Trục chính Ox, Oy
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padLeft, 10);
    ctx.lineTo(padLeft, groundY);
    ctx.lineTo(w - 20, groundY);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.fillText('y (m)', padLeft - 20, 22);
    ctx.fillText('x (m)', w - 35, groundY - 8);

    ctx.restore();
  };

  const drawCannon = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    angleDeg: number,
    y0: number,
    scale: number,
    groundY: number
  ) => {
    ctx.save();

    // Nếu y0 > 0, vẽ tháp/bệ phóng nâng cao
    if (y0 > 0.05) {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      const towerW = 28;
      ctx.fillRect(cx - towerW / 2, cy, towerW, groundY - cy);
      ctx.strokeRect(cx - towerW / 2, cy, towerW, groundY - cy);

      // Thước đo chiều cao y0
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText(`y₀=${y0}m`, cx - towerW / 2 - 45, (cy + groundY) / 2);
    }

    // Nòng pháo xoay theo góc angleDeg
    ctx.translate(cx, cy);
    const rad = (-angleDeg * Math.PI) / 180;
    ctx.rotate(rad);

    // Nòng súng
    const barrelL = 36;
    const barrelH = 12;
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.fillRect(0, -barrelH / 2, barrelL, barrelH);
    ctx.strokeRect(0, -barrelH / 2, barrelL, barrelH);

    // Khớp xoay
    ctx.rotate(-rad);
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  };

  const drawTarget = (ctx: CanvasRenderingContext2D, tx: number, ty: number, scale: number) => {
    ctx.save();
    const r = 16;

    // Cột đỡ bia
    ctx.fillStyle = '#475569';
    ctx.fillRect(tx - 3, ty - 22, 6, 22);

    // Bia tròn hồng tâm
    // Vòng ngoài trắng
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(tx, ty - 24, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();

    // Vòng đỏ
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(tx, ty - 24, r * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // Tâm trắng
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(tx, ty - 24, r * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Điểm hồng tâm đỏ
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(tx, ty - 24, r * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Nhãn bia
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BIA', tx, ty - 44);

    ctx.restore();
  };

  const drawTrajectoryLine = (
    ctx: CanvasRenderingContext2D,
    path: TrajectoryPoint[],
    toX: (x: number) => number,
    toY: (y: number) => number,
    color: string,
    lineWidth: number,
    dash: number[] = []
  ) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash(dash);

    ctx.beginPath();
    ctx.moveTo(toX(path[0].x), toY(path[0].y));
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(toX(path[i].x), toY(path[i].y));
    }
    ctx.stroke();
    ctx.restore();
  };

  const drawProjectile = (ctx: CanvasRenderingContext2D, x: number, y: number, speed: number) => {
    ctx.save();

    // Vầng hào quang lửa / năng lượng
    const glow = ctx.createRadialGradient(x, y, 2, x, y, 16);
    glow.addColorStop(0, 'rgba(245, 158, 11, 0.9)');
    glow.addColorStop(0.5, 'rgba(239, 68, 68, 0.4)');
    glow.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Quả đạn đặc
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(x, y, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  };

  const drawVelocityVectors = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    vx: number,
    vy: number,
    scale: number,
    showComp: boolean
  ) => {
    ctx.save();
    const arrowScale = 1.8; // Độ dài hiển thị vector

    // Vector v tổng hợp (Màu vàng)
    const vTotalX = x + vx * arrowScale;
    const vTotalY = y - vy * arrowScale;
    drawArrow(ctx, x, y, vTotalX, vTotalY, '#facc15', 2.5);

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.fillText('v', vTotalX + 4, vTotalY - 2);

    if (showComp) {
      // Vector thành phần vx (Màu xanh ngọc)
      const vxScreenX = x + vx * arrowScale;
      drawArrow(ctx, x, y, vxScreenX, y, '#38bdf8', 1.8);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('vx', vxScreenX + 3, y + 12);

      // Vector thành phần vy (Màu cam)
      const vyScreenY = y - vy * arrowScale;
      drawArrow(ctx, x, y, x, vyScreenY, '#fb923c', 1.8);
      ctx.fillStyle = '#fb923c';
      ctx.fillText('vy', x + 5, vyScreenY);
    }

    ctx.restore();
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    width: number
  ) => {
    const headLen = 7;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  };

  const drawKeyPoints = (
    ctx: CanvasRenderingContext2D,
    summary: TrajectorySummary,
    toX: (x: number) => number,
    toY: (y: number) => number
  ) => {
    ctx.save();
    // Đỉnh cao nhất H_max
    const apexPt = summary.path.reduce((prev, curr) => (curr.y > prev.y ? curr : prev), summary.path[0]);
    if (apexPt) {
      const ax = toX(apexPt.x);
      const ay = toY(apexPt.y);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(ax, ay, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`H_max = ${summary.maxHeight.toFixed(1)}m`, ax - 28, ay - 8);
    }

    // Điểm chạm đất (Tầm xa L_max)
    const lx = toX(summary.maxRange);
    const ly = toY(0);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(lx, ly, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`L = ${summary.maxRange.toFixed(1)}m`, lx - 20, ly + 20);

    ctx.restore();
  };

  const drawEnergyHUD = (
    ctx: CanvasRenderingContext2D,
    hudX: number,
    hudY: number,
    pt: TrajectoryPoint,
    mass: number
  ) => {
    ctx.save();
    const hudW = 190;
    const hudH = 100;

    // Panel nền bán trong suốt
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudW, hudH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('⚡ Năng Lượng Cơ Học', hudX + 12, hudY + 18);

    const maxBarW = 100;
    const totalRef = Math.max(pt.te, 100);

    // Động năng Wd
    const keW = Math.min(maxBarW, (pt.ke / totalRef) * maxBarW);
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`Wd: ${pt.ke.toFixed(0)} J`, hudX + 12, hudY + 38);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(hudX + 80, hudY + 28, keW, 8);

    // Thế năng Wt
    const peW = Math.min(maxBarW, (pt.pe / totalRef) * maxBarW);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`Wt: ${pt.pe.toFixed(0)} J`, hudX + 12, hudY + 58);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(hudX + 80, hudY + 48, peW, 8);

    // Tổng cơ năng W
    const teW = Math.min(maxBarW, (pt.te / totalRef) * maxBarW);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`W : ${pt.te.toFixed(0)} J`, hudX + 12, hudY + 78);
    ctx.fillStyle = '#059669';
    ctx.fillRect(hudX + 80, hudY + 68, teW, 8);

    ctx.restore();
  };

  const drawTargetTelemetry = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    pt: TrajectoryPoint,
    targetX: number,
    summary: TrajectorySummary
  ) => {
    ctx.save();
    ctx.font = 'bold 11px JetBrains Mono, monospace';

    // Khoảng cách tới bia
    const diff = summary.maxRange - targetX;
    const isHit = Math.abs(diff) <= 1.5;

    ctx.fillStyle = isHit ? '#4ade80' : '#cbd5e1';
    ctx.fillText(
      `Mục tiêu: ${targetX}m • Tầm xa L: ${summary.maxRange.toFixed(1)}m (${diff >= 0 ? '+' : ''}${diff.toFixed(1)}m)`,
      x,
      y
    );

    ctx.restore();
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none bg-slate-950">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
