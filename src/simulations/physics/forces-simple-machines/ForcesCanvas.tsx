import React, { useRef, useEffect } from 'react';
import { ForcesMachineState } from './types';
import { calculateForcesAndMachines } from './physicsEngine';

interface ForcesCanvasProps {
  state: ForcesMachineState;
  isDark: boolean;
}

export const ForcesCanvas: React.FC<ForcesCanvasProps> = ({ state, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const calc = calculateForcesAndMachines(state);

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

    if (state.mode === 'spring') {
      // ================= 1. LỰC KẾ LÒ XO & ĐỊNH LUẬT HOOKE =================
      const standX = width * 0.42;
      const standTopY = height * 0.15;
      const baseLen = 100; // Chiều dài tự nhiên ban đầu (px)
      const scaleElong = calc.elongationCm * 8; // 8px per cm
      const springLen = baseLen + scaleElong;

      // Giá đỡ treo
      ctx.save();
      ctx.fillStyle = isDark ? '#475569' : '#94a3b8';
      ctx.fillRect(standX - 70, standTopY - 14, 140, 14); // Xà ngang
      ctx.fillRect(standX - 70, standTopY - 14, 16, height * 0.75); // Cột đứng
      ctx.fillRect(standX - 110, standTopY + height * 0.75 - 14, 100, 16); // Chân đế
      ctx.restore();

      // Thước đo cm bên cạnh lò xo
      const rulerX = standX + 75;
      const rulerY = standTopY;
      const rulerH = 260;

      ctx.save();
      ctx.fillStyle = isDark ? '#1e293b' : '#fef08a';
      ctx.fillRect(rulerX, rulerY, 32, rulerH);
      ctx.strokeStyle = '#eab308';
      ctx.strokeRect(rulerX, rulerY, 32, rulerH);

      ctx.font = '9px monospace';
      ctx.fillStyle = isDark ? '#fef08a' : '#854d0e';
      for (let cm = 0; cm <= 25; cm += 2) {
        const py = rulerY + cm * 10;
        ctx.beginPath();
        ctx.moveTo(rulerX, py);
        ctx.lineTo(rulerX + (cm % 5 === 0 ? 14 : 7), py);
        ctx.stroke();
        if (cm % 5 === 0) {
          ctx.fillText(`${cm}`, rulerX + 16, py + 3);
        }
      }
      ctx.restore();

      // Vẽ lò xo xoắn
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(standX, standTopY);

      const coils = 12;
      const coilH = springLen / coils;
      for (let i = 0; i < coils; i++) {
        const y1 = standTopY + i * coilH + coilH * 0.25;
        const y2 = standTopY + i * coilH + coilH * 0.75;
        const xOffset = i % 2 === 0 ? 18 : -18;
        ctx.lineTo(standX + xOffset, y1);
        ctx.lineTo(standX - xOffset, y2);
      }
      ctx.lineTo(standX, standTopY + springLen);
      ctx.stroke();

      // Móc treo & Quả nặng
      const weightY = standTopY + springLen;
      ctx.beginPath();
      ctx.arc(standX, weightY + 6, 6, 0, Math.PI * 2);
      ctx.stroke();

      // Khối quả nặng hình trụ
      const weightW = 44;
      const weightH = 36;
      ctx.fillStyle = isDark ? '#64748b' : '#475569';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(standX - weightW / 2, weightY + 12, weightW, weightH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 11px system-ui';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`${state.massGrams}g`, standX, weightY + 34);

      // Vector Trọng lực P (màu đỏ chỉ xuống)
      drawArrow(ctx, standX, weightY + 12 + weightH, standX, weightY + 12 + weightH + 50, '#ef4444', `P = ${calc.springForceN} N`);

      // Vector Lực đàn hồi Fdh (màu xanh chỉ lên)
      drawArrow(ctx, standX, weightY + 12, standX, weightY - 40, '#22c55e', `Fđh = ${calc.springForceN} N`);

      // Ghi chú độ biến dạng
      ctx.font = 'bold 13px system-ui';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'left';
      ctx.fillText(`Độ dãn lò xo: Δl = ${calc.elongationCm} cm`, standX + 120, standTopY + 50);
      ctx.font = '12px system-ui';
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.fillText(`Độ cứng k = ${state.springConstant} N/m`, standX + 120, standTopY + 75);
      ctx.fillText(`Công thức Hooke: Fđh = k · Δl`, standX + 120, standTopY + 100);
      ctx.restore();

    } else if (state.mode === 'lever') {
      // ================= 2. ĐÒN BẨY =================
      const pivotX = width * 0.48;
      const pivotY = height * 0.65;
      const beamScale = 85; // 85px per meter

      const d1Px = state.loadArmM * beamScale;
      const d2Px = state.effortArmM * beamScale;

      // Điểm tựa tam giác O
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(pivotX - 22, pivotY + 45);
      ctx.lineTo(pivotX + 22, pivotY + 45);
      ctx.closePath();
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 12px system-ui';
      ctx.fillStyle = isDark ? '#f59e0b' : '#b45309';
      ctx.textAlign = 'center';
      ctx.fillText('Điểm tựa (O)', pivotX, pivotY + 62);

      // Thanh đòn bẩy nằm ngang
      const beamY = pivotY - 6;
      ctx.fillStyle = isDark ? '#334155' : '#78716c';
      ctx.fillRect(pivotX - d1Px - 20, beamY, d1Px + d2Px + 40, 12);

      // Tải trọng F1 ở bên trái
      const loadX = pivotX - d1Px;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(loadX - 24, beamY - 45, 48, 45);
      ctx.font = 'bold 11px system-ui';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Vật nặng`, loadX, beamY - 26);
      ctx.fillText(`${state.loadForceN} N`, loadX, beamY - 10);

      // Mũi tên khoảng cách d1
      drawDimensionLine(ctx, loadX, pivotY + 20, pivotX, pivotY + 20, `d₁ = ${state.loadArmM} m`);

      // Lực nâng F2 tác dụng ở bên phải
      const effortX = pivotX + d2Px;
      drawArrow(ctx, effortX, beamY - 60, effortX, beamY, '#22c55e', `F₂ = ${calc.requiredEffortN} N`);
      drawDimensionLine(ctx, pivotX, pivotY + 20, effortX, pivotY + 20, `d₂ = ${state.effortArmM} m`);

      // Banner kết luận lợi về lực
      ctx.font = 'bold 14px system-ui';
      ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.textAlign = 'center';
      ctx.fillText(
        `Được lợi ${calc.mechanicalAdvantage} lần về lực (F₂ = F₁ · d₁ / d₂)`,
        pivotX,
        height * 0.22
      );
      ctx.restore();

    } else {
      // ================= 3. MẶT PHẢNG NGHIÊNG =================
      const originX = width * 0.18;
      const originY = height * 0.72;
      const rampScale = 85;

      const baseLenPx = 360;
      const rad = (state.inclineAngleDeg * Math.PI) / 180;
      const heightPx = Math.min(200, Math.tan(rad) * baseLenPx);

      // Mặt phẳng nghiêng hình tam giác
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX + baseLenPx, originY);
      ctx.lineTo(originX + baseLenPx, originY - heightPx);
      ctx.closePath();
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(186, 230, 253, 0.4)';
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Cung góc nghiêng alpha
      ctx.beginPath();
      ctx.arc(originX, originY, 40, -rad, 0);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`α = ${state.inclineAngleDeg}°`, originX + 50, originY - 12);

      // Thước đo chiều cao h
      drawDimensionLine(ctx, originX + baseLenPx + 20, originY, originX + baseLenPx + 20, originY - heightPx, `h = ${state.inclineHeightM} m`);

      // Xe trượt đặt trên dốc ở vị trí 55%
      const cartPosNorm = 0.55;
      const cartX = originX + baseLenPx * cartPosNorm;
      const cartY = originY - heightPx * cartPosNorm;

      ctx.save();
      ctx.translate(cartX, cartY);
      ctx.rotate(-rad);

      // Bánh xe
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(-16, -5, 5, 0, Math.PI * 2);
      ctx.arc(16, -5, 5, 0, Math.PI * 2);
      ctx.fill();

      // Thùng xe
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(-26, -26, 52, 22);
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(-26, -26, 52, 22);

      ctx.font = 'bold 9px system-ui';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`${state.boxMassKg}kg`, 0, -12);

      // Lực kéo F dọc theo dốc
      drawArrow(ctx, 26, -15, 75, -15, '#22c55e', `Fkéo = ${calc.pullForceN} N`);
      ctx.restore();

      // So sánh lực nâng trực tiếp P
      ctx.font = 'bold 13px system-ui';
      ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
      ctx.textAlign = 'left';
      ctx.fillText(`- Trọng lực vật nâng trực tiếp: P = ${calc.gravityForceN} N`, width * 0.55, height * 0.18);
      ctx.fillStyle = '#22c55e';
      ctx.fillText(`- Lực kéo trên dốc nghiêng: F = ${calc.pullForceN} N`, width * 0.55, height * 0.23);
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.fillText(`- Giảm lực được: ${(calc.gravityForceN / calc.pullForceN).toFixed(1)} lần`, width * 0.55, height * 0.28);
      ctx.restore();
    }
  }, [state, calc, isDark]);

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
    ctx.textAlign = 'center';
    ctx.fillText(label, (x1 + x2) / 2 + 10, (y1 + y2) / 2 - 8);
    ctx.restore();
  }

  function drawDimensionLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, text: string) {
    ctx.save();
    ctx.strokeStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.font = '11px monospace';
    ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
    ctx.textAlign = 'center';
    ctx.fillText(text, (x1 + x2) / 2, (y1 + y2) / 2 - 5);
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
        <span>⚙️ {state.mode === 'spring' ? 'Lò xo & Định luật Hooke' : state.mode === 'lever' ? 'Đòn bẩy điểm tựa' : 'Mặt phẳng nghiêng'}</span>
      </div>
    </div>
  );
};
