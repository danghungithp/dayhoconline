import React, { useRef, useEffect, useState, useCallback } from 'react';
import { UnitCircleState, TrigValues } from './types';
import { calculateTrigValues, SPECIAL_ANGLES } from './trigInequalitiesEngine';

interface UnitCircleCanvasProps {
  state: UnitCircleState;
  onChangeAngle: (newAngleDeg: number) => void;
  isDark?: boolean;
}

export const UnitCircleCanvas: React.FC<UnitCircleCanvasProps> = ({
  state,
  onChangeAngle,
  isDark = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);
  const [hoverAngle, setHoverAngle] = useState<number | null>(null);

  const trig: TrigValues = calculateTrigValues(state.angleDeg);

  const updateAngleFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left - rect.width / 2;
      const y = rect.height / 2 - (clientY - rect.top); // Y hướng lên

      let deg = (Math.atan2(y, x) * 180) / Math.PI;
      if (deg < 0) deg += 360;

      if (state.snapToSpecial) {
        // Hút vào góc đặc biệt gần nhất trong phạm vi 4 độ
        const nearest = SPECIAL_ANGLES.find(sa => Math.abs(sa.deg - deg) < 4.5);
        if (nearest) {
          deg = nearest.deg;
        }
      }

      onChangeAngle(Math.round(deg * 10) / 10);
    },
    [state.snapToSpecial, onChangeAngle]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.38; // Bán kính R = 1

    // Clear background
    ctx.fillStyle = isDark ? '#090d16' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Grid mờ
    ctx.strokeStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.lineWidth = 1;
    const gridSize = 30;
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

    // Trục tọa độ Ox (Trục Cosin) & Oy (Trục Sin)
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.lineWidth = 2;

    // Trục Cos (Ox)
    ctx.beginPath();
    ctx.moveTo(30, centerY);
    ctx.lineTo(width - 30, centerY);
    ctx.stroke();

    // Trục Sin (Oy)
    ctx.beginPath();
    ctx.moveTo(centerX, height - 30);
    ctx.lineTo(centerX, 30);
    ctx.stroke();

    // Tên trục
    ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText('Trục Sin (y)', centerX + 12, 40);
    ctx.fillStyle = isDark ? '#34d399' : '#059669';
    ctx.fillText('Trục Cos (x)', width - 110, centerY - 12);

    // Đường tròn lượng giác R = 1
    ctx.strokeStyle = isDark ? '#cbd5e1' : '#475569';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Các mốc -1, 0, 1
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('1', centerX + radius, centerY + 18);
    ctx.fillText('-1', centerX - radius, centerY + 18);
    ctx.fillText('1', centerX - 14, centerY - radius + 4);
    ctx.fillText('-1', centerX - 16, centerY + radius + 4);
    ctx.fillText('O', centerX - 12, centerY + 16);

    // Điểm đánh dấu các góc đặc biệt trên đường tròn (30, 45, 60, 90...)
    SPECIAL_ANGLES.forEach(sa => {
      const rad = (sa.deg * Math.PI) / 180;
      const px = centerX + radius * Math.cos(rad);
      const py = centerY - radius * Math.sin(rad);

      ctx.fillStyle = isDark ? '#475569' : '#cbd5e1';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();

      // Nhãn góc đặc biệt
      if (sa.deg % 30 === 0 || sa.deg === 45 || sa.deg === 135 || sa.deg === 225 || sa.deg === 315) {
        const textRadius = radius + 20;
        const tx = centerX + textRadius * Math.cos(rad);
        const ty = centerY - textRadius * Math.sin(rad);
        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
        ctx.fillText(state.angleMode === 'radians' ? sa.rad : `${sa.deg}°`, tx, ty + 3);
      }
    });

    // Trục tiếp tuyến Tan (x = 1)
    if (state.showTangent) {
      const tanAxisX = centerX + radius;
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tanAxisX, 20);
      ctx.lineTo(tanAxisX, height - 20);
      ctx.stroke();

      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('Trục Tan (x = 1)', tanAxisX + 10, 30);
    }

    // Tọa độ điểm M trên đường tròn
    const angleRad = trig.angleRad;
    const mx = centerX + radius * Math.cos(angleRad);
    const my = centerY - radius * Math.sin(angleRad);

    // Cung góc α tô màu mờ
    ctx.fillStyle = isDark ? '#38bdf825' : '#0284c720';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius * 0.28, 0, -angleRad, true);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.28, 0, -angleRad, true);
    ctx.stroke();

    // Nhãn góc α trong cung
    const midAngle = angleRad / 2;
    const arcLabelX = centerX + radius * 0.38 * Math.cos(midAngle);
    const arcLabelY = centerY - radius * 0.38 * Math.sin(midAngle);
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(state.angleMode === 'radians' ? trig.radLabel : `${trig.angleDeg}°`, arcLabelX, arcLabelY);

    // Bán kính OM
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(mx, my);
    ctx.stroke();

    // Chiếu xuống Ox -> Cosin (đoạn OH)
    if (state.showCosine) {
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(mx, centerY);
      ctx.stroke();

      // Đường gióng đứt nét M -> H
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#34d39988';
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Điểm H
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.arc(mx, centerY, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Chiếu lên Oy -> Sin (đoạn OK)
    if (state.showSine) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX, my);
      ctx.stroke();

      // Đường gióng đứt nét M -> K
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#38bdf888';
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(centerX, my);
      ctx.stroke();
      ctx.setLineDash([]);

      // Điểm K
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(centerX, my, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tiếp tuyến Tan (kéo dài OM cắt x = 1)
    if (state.showTangent && trig.tan !== null && Math.abs(trig.cos) > 0.05) {
      const tanAxisX = centerX + radius;
      const tanY = centerY - radius * trig.tan;

      // Đường kéo dài từ O qua M đến T trên trục tan
      if (tanY >= 0 && tanY <= height) {
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = '#c084fc';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(tanAxisX, tanY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Điểm T trên trục tan
        ctx.fillStyle = '#c084fc';
        ctx.beginPath();
        ctx.arc(tanAxisX, tanY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText(`T(1, ${trig.tan.toFixed(2)})`, tanAxisX + 35, tanY);
      }
    }

    // Điểm M(cos α, sin α) trên đường tròn
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(mx, my, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`M(${trig.cosExact}, ${trig.sinExact})`, mx + (mx > centerX ? 15 : -15), my - 12);
  }, [state, trig, isDark]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    updateAngleFromPointer(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      updateAngleFromPointer(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative w-full h-full min-h-[420px] flex flex-col items-center justify-center select-none">
      <canvas
        ref={canvasRef}
        width={680}
        height={480}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full max-h-[500px] object-contain rounded-xl shadow-lg border border-slate-700/40 cursor-grab active:cursor-grabbing"
      />
      <div className="absolute top-3 left-4 px-3 py-1.5 bg-slate-900/80 backdrop-blur border border-slate-700/80 rounded-lg text-xs space-y-0.5 pointer-events-none">
        <div className="text-amber-300 font-bold">
          Góc α: {trig.angleDeg}° ({trig.radLabel})
        </div>
        <div className="text-emerald-300">
          cos α = <strong>{trig.cosExact}</strong>
        </div>
        <div className="text-sky-300">
          sin α = <strong>{trig.sinExact}</strong>
        </div>
        {state.showTangent && (
          <div className="text-purple-300">
            tan α = <strong>{trig.tanExact}</strong>
          </div>
        )}
      </div>
    </div>
  );
};
