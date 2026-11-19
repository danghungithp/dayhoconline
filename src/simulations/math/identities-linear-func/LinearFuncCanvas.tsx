import React, { useRef, useEffect, useState } from 'react';
import { IdentitiesState, LinearFuncAnalysis, TwoLinesRelation } from './types';
import { analyzeLinearFunction, analyzeTwoLines } from './algebraEngine';

interface LinearFuncCanvasProps {
  state: IdentitiesState;
  isDark?: boolean;
}

export const LinearFuncCanvas: React.FC<LinearFuncCanvasProps> = ({
  state,
  isDark = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoverCoord, setHoverCoord] = useState<{ mathX: number; mathY: number } | null>(null);

  const analysis1: LinearFuncAnalysis = analyzeLinearFunction(state.slope1, state.intercept1);
  const analysis2: LinearFuncAnalysis = analyzeLinearFunction(state.slope2, state.intercept2);
  const relation: TwoLinesRelation = analyzeTwoLines(
    state.slope1,
    state.intercept1,
    state.slope2,
    state.intercept2
  );

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

    // Coordinate conversion
    const originX = width / 2;
    const originY = height / 2;
    const unitPx = 30; // 30px = 1 unit

    const toScreenX = (mathX: number) => originX + mathX * unitPx;
    const toScreenY = (mathY: number) => originY - mathY * unitPx;

    // Draw grid
    ctx.strokeStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.lineWidth = 1;

    const maxUnitsX = Math.ceil(width / (2 * unitPx));
    const maxUnitsY = Math.ceil(height / (2 * unitPx));

    for (let x = -maxUnitsX; x <= maxUnitsX; x++) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();
    }

    for (let y = -maxUnitsY; y <= maxUnitsY; y++) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();
    }

    // Draw axes Ox & Oy
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.lineWidth = 2;

    // Ox
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Oy
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Arrows and Axis Labels
    ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
    ctx.font = 'bold 13px Inter, sans-serif';

    // x arrow
    ctx.beginPath();
    ctx.moveTo(width - 10, originY - 5);
    ctx.lineTo(width, originY);
    ctx.lineTo(width - 10, originY + 5);
    ctx.fill();
    ctx.fillText('x', width - 15, originY + 20);

    // y arrow
    ctx.beginPath();
    ctx.moveTo(originX - 5, 10);
    ctx.lineTo(originX, 0);
    ctx.lineTo(originX + 5, 10);
    ctx.fill();
    ctx.fillText('y', originX + 12, 16);

    // Origin (0,0)
    ctx.fillText('O', originX - 14, originY + 16);

    // Numbers on ticks
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    for (let x = -maxUnitsX; x <= maxUnitsX; x++) {
      if (x === 0 || x % 2 !== 0) continue;
      const sx = toScreenX(x);
      ctx.fillText(`${x}`, sx - 6, originY + 14);
    }
    for (let y = -maxUnitsY; y <= maxUnitsY; y++) {
      if (y === 0 || y % 2 !== 0) continue;
      const sy = toScreenY(y);
      ctx.fillText(`${y}`, originX + 6, sy + 4);
    }

    // Draw Line 1 (d1: y = a1*x + b1)
    const { slope1: a1, intercept1: b1 } = state;
    const xMin = -maxUnitsX - 2;
    const xMax = maxUnitsX + 2;

    const yStart1 = a1 * xMin + b1;
    const yEnd1 = a1 * xMax + b1;

    ctx.strokeStyle = '#38bdf8'; // sky blue
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(toScreenX(xMin), toScreenY(yStart1));
    ctx.lineTo(toScreenX(xMax), toScreenY(yEnd1));
    ctx.stroke();

    // Slope triangle (Tam giác hệ số góc Delta x = 1, Delta y = a)
    if (state.showSlopeTriangle && a1 !== 0) {
      const triX0 = 1;
      const triY0 = a1 * triX0 + b1;
      const triX1 = 2;
      const triY1 = triY0;
      const triY2 = a1 * triX1 + b1;

      ctx.fillStyle = '#38bdf822';
      ctx.beginPath();
      ctx.moveTo(toScreenX(triX0), toScreenY(triY0));
      ctx.lineTo(toScreenX(triX1), toScreenY(triY1));
      ctx.lineTo(toScreenX(triX1), toScreenY(triY2));
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#f59e0b';
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('Δx = 1', toScreenX(1.4), toScreenY(triY0) + 14);
      ctx.fillText(`Δy = a = ${a1}`, toScreenX(2.1), toScreenY((triY0 + triY2) / 2));
    }

    // Intercept points
    if (state.showInterceptPoints) {
      // (0, b1)
      const syOy = toScreenY(b1);
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(originX, syOy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`(0, ${b1})`, originX + 8, syOy - 8);

      // (-b1/a1, 0) if a1 != 0
      if (a1 !== 0) {
        const rootX = -b1 / a1;
        const sxOx = toScreenX(rootX);
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(sxOx, originY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText(`(${rootX.toFixed(1)}, 0)`, sxOx - 15, originY - 10);
      }
    }

    // Line 2 (in 'two-lines' tab)
    if (state.activeTab === 'two-lines') {
      const { slope2: a2, intercept2: b2 } = state;
      const yStart2 = a2 * xMin + b2;
      const yEnd2 = a2 * xMax + b2;

      ctx.strokeStyle = '#ec4899'; // pink
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(toScreenX(xMin), toScreenY(yStart2));
      ctx.lineTo(toScreenX(xMax), toScreenY(yEnd2));
      ctx.stroke();

      // Intersection point M
      if (relation.intersectionPoint) {
        const mx = toScreenX(relation.intersectionPoint.x);
        const my = toScreenY(relation.intersectionPoint.y);

        ctx.fillStyle = '#eab308';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mx, my, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillStyle = '#fef08a';
        ctx.fillText(
          `M(${relation.intersectionPoint.x}, ${relation.intersectionPoint.y})`,
          mx + 10,
          my - 10
        );
      }
    }

    // Top Legend & Badges
    ctx.textAlign = 'left';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`(d₁): ${analysis1.formulaText}`, 20, 28);

    if (state.activeTab === 'two-lines') {
      ctx.fillStyle = '#ec4899';
      ctx.fillText(`(d₂): ${analysis2.formulaText}`, 20, 50);

      // Status badge
      ctx.fillStyle = relation.status === 'perpendicular' ? '#10b981' : relation.status === 'parallel' ? '#f59e0b' : '#a855f7';
      ctx.fillText(`➜ ${relation.statusVi}`, 20, 75);
    }
  }, [state, isDark, analysis1, analysis2, relation]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const xPx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const yPx = (e.clientY - rect.top) * (canvas.height / rect.height);

    const unitPx = 30;
    const mathX = Math.round(((xPx - canvas.width / 2) / unitPx) * 10) / 10;
    const mathY = Math.round(((canvas.height / 2 - yPx) / unitPx) * 10) / 10;
    setHoverCoord({ mathX, mathY });
  };

  return (
    <div className="relative w-full h-full min-h-[420px] flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        width={700}
        height={480}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverCoord(null)}
        className="w-full h-full max-h-[500px] object-contain rounded-xl shadow-lg border border-slate-700/40 cursor-crosshair"
      />
      {hoverCoord && (
        <div className="absolute bottom-3 right-4 px-3 py-1 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-md text-xs font-mono text-cyan-300">
          Tọa độ chuột: ({hoverCoord.mathX}, {hoverCoord.mathY})
        </div>
      )}
    </div>
  );
};
