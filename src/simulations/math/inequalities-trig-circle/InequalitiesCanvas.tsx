import React, { useRef, useEffect, useState } from 'react';
import { UnitCircleState, PolygonVertex } from './types';
import {
  computeFeasibleVertices,
  checkPointInFeasibleRegion,
} from './trigInequalitiesEngine';

interface InequalitiesCanvasProps {
  state: UnitCircleState;
  onUpdateTestPoint: (point: { x: number; y: number }) => void;
  isDark?: boolean;
}

export const InequalitiesCanvas: React.FC<InequalitiesCanvasProps> = ({
  state,
  onUpdateTestPoint,
  isDark = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingTestPointRef = useRef(false);

  const vertices: PolygonVertex[] = computeFeasibleVertices(
    state.inequalities,
    state.objectiveA,
    state.objectiveB
  );

  const isTestPointInside = checkPointInFeasibleRegion(
    state.testPoint,
    state.inequalities
  ) && state.testPoint.x >= 0 && state.testPoint.y >= 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = isDark ? '#090d16' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Gốc tọa độ O đặt ở góc dưới bên trái (cho miền nghiệm x >= 0, y >= 0)
    const originX = 60;
    const originY = height - 50;
    const scalePx = 36; // 36px = 1 unit

    const toScreenX = (x: number) => originX + x * scalePx;
    const toScreenY = (y: number) => originY - y * scalePx;

    // Grid
    ctx.strokeStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.lineWidth = 1;
    const maxX = Math.floor((width - originX) / scalePx);
    const maxY = Math.floor(originY / scalePx);

    for (let x = 0; x <= maxX; x++) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 20);
      ctx.lineTo(sx, originY);
      ctx.stroke();
    }
    for (let y = 0; y <= maxY; y++) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(originX, sy);
      ctx.lineTo(width - 20, sy);
      ctx.stroke();
    }

    // Trục Ox & Oy
    ctx.strokeStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.lineWidth = 2.5;

    // Ox
    ctx.beginPath();
    ctx.moveTo(originX - 10, originY);
    ctx.lineTo(width - 20, originY);
    ctx.stroke();

    // Oy
    ctx.beginPath();
    ctx.moveTo(originX, originY + 10);
    ctx.lineTo(originX, 20);
    ctx.stroke();

    // Arrows
    ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
    ctx.beginPath();
    ctx.moveTo(width - 20, originY - 4);
    ctx.lineTo(width - 10, originY);
    ctx.lineTo(width - 20, originY + 4);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(originX - 4, 20);
    ctx.lineTo(originX, 10);
    ctx.lineTo(originX + 4, 20);
    ctx.fill();

    // Tọa độ mốc số
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    for (let x = 1; x <= maxX; x++) {
      ctx.fillText(`${x}`, toScreenX(x), originY + 16);
    }
    for (let y = 1; y <= maxY; y++) {
      ctx.fillText(`${y}`, originX - 14, toScreenY(y) + 4);
    }
    ctx.fillText('O', originX - 12, originY + 16);
    ctx.fillText('x', width - 15, originY + 18);
    ctx.fillText('y', originX - 16, 16);

    // Vẽ miền nghiệm đa giác (nếu có các đỉnh)
    if (vertices.length >= 3) {
      ctx.fillStyle = '#10b98125'; // Xanh lá mờ
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(toScreenX(vertices[0].x), toScreenY(vertices[0].y));
      for (let i = 1; i < vertices.length; i++) {
        ctx.lineTo(toScreenX(vertices[i].x), toScreenY(vertices[i].y));
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Đánh dấu các đỉnh của đa giác nghiệm
      const labels = ['O', 'A', 'B', 'C', 'D', 'E'];
      vertices.forEach((v, idx) => {
        const vx = toScreenX(v.x);
        const vy = toScreenY(v.y);

        ctx.fillStyle = v.isMax ? '#eab308' : '#3b82f6';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(vx, vy, v.isMax ? 7 : 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillStyle = v.isMax ? '#facc15' : isDark ? '#e2e8f0' : '#1e293b';
        ctx.textAlign = 'left';
        const label = labels[idx] || `V${idx}`;
        ctx.fillText(
          `${label}(${v.x}, ${v.y}) ➔ F = ${v.fValue}${v.isMax ? ' [MAX]' : ''}`,
          vx + 8,
          vy - 8
        );
      });
    }

    // Vẽ các đường biên của hệ BPT
    state.inequalities.forEach(ineq => {
      ctx.strokeStyle = ineq.color;
      ctx.lineWidth = 2;

      // Tìm 2 điểm cắt trục để vẽ đường thẳng a*x + b*y = c
      // x = 0 => y = c/b ; y = 0 => x = c/a
      let p1 = { x: 0, y: ineq.b !== 0 ? ineq.c / ineq.b : 0 };
      let p2 = { x: ineq.a !== 0 ? ineq.c / ineq.a : 0, y: 0 };

      // Kéo dài ra ngoài biên đồ thị
      const xStart = -1;
      const yStart = ineq.b !== 0 ? (ineq.c - ineq.a * xStart) / ineq.b : -1;
      const xEnd = maxX + 2;
      const yEnd = ineq.b !== 0 ? (ineq.c - ineq.a * xEnd) / ineq.b : maxX + 2;

      ctx.beginPath();
      ctx.moveTo(toScreenX(xStart), toScreenY(yStart));
      ctx.lineTo(toScreenX(xEnd), toScreenY(yEnd));
      ctx.stroke();

      // Nhãn đường thẳng
      const midX = Math.min(maxX - 1, Math.max(1, p2.x / 2));
      const midY = ineq.b !== 0 ? (ineq.c - ineq.a * midX) / ineq.b : 2;
      if (midY >= 0 && midY <= maxY) {
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillStyle = ineq.color;
        ctx.fillText(`${ineq.label}`, toScreenX(midX) + 8, toScreenY(midY) - 8);
      }
    });

    // Vẽ điểm thử nghiệm (Test Point)
    const tx = toScreenX(state.testPoint.x);
    const ty = toScreenY(state.testPoint.y);

    ctx.fillStyle = isTestPointInside ? '#22c55e' : '#ef4444';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(tx, ty, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillStyle = isTestPointInside ? '#4ade80' : '#f87171';
    ctx.fillText(
      `M(${state.testPoint.x}, ${state.testPoint.y}) [${isTestPointInside ? 'Thuộc miền' : 'Ngoài miền'}]`,
      tx + 12,
      ty - 6
    );
  }, [state, vertices, isTestPointInside, isDark]);

  const handlePointer = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const originX = 60;
    const originY = canvas.height - 50;
    const scalePx = 36;

    const px = (clientX - rect.left) * (canvas.width / rect.width);
    const py = (clientY - rect.top) * (canvas.height / rect.height);

    const x = Math.max(0, Math.round(((px - originX) / scalePx) * 10) / 10);
    const y = Math.max(0, Math.round(((originY - py) / scalePx) * 10) / 10);

    onUpdateTestPoint({ x, y });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingTestPointRef.current = true;
    handlePointer(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingTestPointRef.current) {
      handlePointer(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    isDraggingTestPointRef.current = false;
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
        className="w-full h-full max-h-[500px] object-contain rounded-xl shadow-lg border border-slate-700/40 cursor-crosshair"
      />
      <div className="absolute top-3 right-4 px-3 py-2 bg-slate-900/85 backdrop-blur border border-slate-700/80 rounded-lg text-xs space-y-1 pointer-events-none">
        <div className="text-emerald-300 font-bold">
          Miền nghiệm hệ BPT bậc nhất 2 ẩn (x ≥ 0, y ≥ 0)
        </div>
        <div className="text-slate-300">
          Điểm thử M: ({state.testPoint.x}, {state.testPoint.y}) ➔{' '}
          <strong className={isTestPointInside ? 'text-green-400' : 'text-red-400'}>
            {isTestPointInside ? 'THỎA MÃN HỆ' : 'VI PHẠM BPT'}
          </strong>
        </div>
        <div className="text-amber-300">
          Hàm mục tiêu: F(x, y) = {state.objectiveA}x + {state.objectiveB}y
        </div>
      </div>
    </div>
  );
};
