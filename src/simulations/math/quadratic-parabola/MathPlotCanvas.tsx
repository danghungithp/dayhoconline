import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  ParabolaParams, 
  LineParams, 
  ParabolaAnalysis, 
  LinearSystemAnalysis, 
  calculateTangent,
  calculateParabolaLineIntersection,
  formatQuadratic,
  formatLinearGeneral
} from './algebraSolver';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair, HelpCircle } from 'lucide-react';

interface MathPlotCanvasProps {
  activeTab: 'parabola' | 'linear-system';
  parabola: ParabolaParams;
  line: LineParams;
  showLine: boolean;
  probeX: number;
  onProbeXChange: (x: number) => void;
  parabolaAnalysis: ParabolaAnalysis;
  linearAnalysis: LinearSystemAnalysis;
  showTangent: boolean;
  showGrid: boolean;
}

export const MathPlotCanvas: React.FC<MathPlotCanvasProps> = ({
  activeTab,
  parabola,
  line,
  showLine,
  probeX,
  onProbeXChange,
  parabolaAnalysis,
  linearAnalysis,
  showTangent,
  showGrid,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trạng thái Camera: Tọa độ tâm O (world px offset) & Tỉ lệ (pixels per unit)
  const [scale, setScale] = useState<number>(45); // 45px = 1 đơn vị toán học
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mouseWorld, setMouseWorld] = useState<{ x: number; y: number } | null>(null);

  // Reset Camera về gốc tọa độ
  const handleResetCamera = useCallback(() => {
    setScale(45);
    setOffset({ x: 0, y: 0 });
  }, []);

  // Zoom In / Out
  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(120, Math.max(18, prev + delta)));
  };

  // Xử lý kéo rê chuột (Pan)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = canvas.width / (2 * (window.devicePixelRatio || 1)) + offset.x;
    const centerY = canvas.height / (2 * (window.devicePixelRatio || 1)) + offset.y;

    const wx = (mouseX - centerX) / scale;
    const wy = -(mouseY - centerY) / scale;
    setMouseWorld({ x: Number(wx.toFixed(2)), y: Number(wy.toFixed(2)) });

    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setScale(prev => Math.min(120, Math.max(18, prev * zoomFactor)));
  };

  // Vẽ Canvas chính
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Xóa nền: Nền tối hiện đại (slate-950)
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    const originX = width / 2 + offset.x;
    const originY = height / 2 + offset.y;

    // Helper đổi tọa độ Toán học -> Screen Pixel
    const toScreenX = (wx: number) => originX + wx * scale;
    const toScreenY = (wy: number) => originY - wy * scale;

    // Helper đổi tọa độ Screen Pixel -> Toán học
    const toWorldX = (sx: number) => (sx - originX) / scale;
    const toWorldY = (sy: number) => -(sy - originY) / scale;

    const minWx = toWorldX(0);
    const maxWx = toWorldX(width);
    const minWy = toWorldY(height);
    const maxWy = toWorldY(0);

    // 1. Vẽ Lưới Tọa độ (Grid)
    if (showGrid) {
      const step = scale < 30 ? 2 : scale > 80 ? 0.5 : 1;

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();

      const startGridX = Math.floor(minWx / step) * step;
      for (let wx = startGridX; wx <= maxWx; wx += step) {
        const sx = toScreenX(wx);
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, height);
      }

      const startGridY = Math.floor(minWy / step) * step;
      for (let wy = startGridY; wy <= maxWy; wy += step) {
        const sy = toScreenY(wy);
        ctx.moveTo(0, sy);
        ctx.lineTo(width, sy);
      }
      ctx.stroke();

      // Vẽ vạch và số đơn vị
      ctx.fillStyle = '#64748b';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      for (let wx = startGridX; wx <= maxWx; wx += step) {
        if (Math.abs(wx) < 1e-4) continue;
        const sx = toScreenX(wx);
        if (sx > 15 && sx < width - 15) {
          ctx.fillText(Number(wx.toFixed(1)).toString(), sx, Math.min(Math.max(originY + 4, 15), height - 25));
        }
      }

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let wy = startGridY; wy <= maxWy; wy += step) {
        if (Math.abs(wy) < 1e-4) continue;
        const sy = toScreenY(wy);
        if (sy > 15 && sy < height - 15) {
          ctx.fillText(Number(wy.toFixed(1)).toString(), Math.min(Math.max(originX - 6, 35), width - 10), sy);
        }
      }
    }

    // 2. Vẽ 2 Trục Tọa độ Chính Ox và Oy
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Trục Ox
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    // Trục Oy
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Mũi tên Ox
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(width - 4, originY);
    ctx.lineTo(width - 14, originY - 5);
    ctx.lineTo(width - 14, originY + 5);
    ctx.closePath();
    ctx.fill();

    // Mũi tên Oy
    ctx.beginPath();
    ctx.moveTo(originX, 4);
    ctx.lineTo(originX - 5, 14);
    ctx.lineTo(originX + 5, 14);
    ctx.closePath();
    ctx.fill();

    // Nhãn 'x', 'y' và gốc 'O'
    ctx.font = 'bold 12px JetBrains Mono, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.textAlign = 'right';
    ctx.fillText('x', width - 8, originY + 16);
    ctx.textAlign = 'left';
    ctx.fillText('y', originX + 10, 16);
    ctx.fillText('O', originX + 6, originY + 14);

    // =========================================================================
    // CHẾ ĐỘ 1: PARABOL BẬC HAI y = ax^2 + bx + c
    // =========================================================================
    if (activeTab === 'parabola') {
      const { a, b, c } = parabola;
      const { vertex, axisOfSymmetry, roots, yIntercept } = parabolaAnalysis;

      // 3. Trục đối xứng x = -b/(2a) (Đường đứt nét cyan)
      const symSx = toScreenX(axisOfSymmetry);
      ctx.save();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(symSx, 0);
      ctx.lineTo(symSx, height);
      ctx.stroke();
      ctx.restore();

      // Nhãn trục đối xứng
      ctx.fillStyle = '#06b6d4';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Trục x = ${axisOfSymmetry.toFixed(2)}`, symSx + 6, 30);

      // 4. Vẽ Đường Parabol (Màu xanh neon / Sky mượt mà)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();

      let started = false;
      const stepPx = 1.5; // Mỗi bước 1.5 pixel màn hình
      for (let sx = 0; sx <= width; sx += stepPx) {
        const wx = toWorldX(sx);
        const wy = a * wx * wx + b * wx + c;
        const sy = toScreenY(wy);

        if (sy >= -500 && sy <= height + 500) {
          if (!started) {
            ctx.moveTo(sx, sy);
            started = true;
          } else {
            ctx.lineTo(sx, sy);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();

      // 5. Đường thẳng so sánh y = mx + n (Nếu bật)
      if (showLine) {
        const { m, n } = line;
        const lineY1 = m * minWx + n;
        const lineY2 = m * maxWx + n;

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(toScreenX(minWx), toScreenY(lineY1));
        ctx.lineTo(toScreenX(maxWx), toScreenY(lineY2));
        ctx.stroke();

        // Giao điểm giữa Parabol và Đường thẳng
        const intersection = calculateParabolaLineIntersection(parabola, line);
        intersection.points.forEach((pt, idx) => {
          const isx = toScreenX(pt.x);
          const isy = toScreenY(pt.y);

          // Vòng sáng
          ctx.beginPath();
          ctx.arc(isx, isy, 8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(244, 63, 94, 0.3)';
          ctx.fill();

          // Điểm tâm
          ctx.beginPath();
          ctx.arc(isx, isy, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#f43f5e';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Nhãn
          ctx.fillStyle = '#fecdd3';
          ctx.font = 'bold 11px JetBrains Mono, monospace';
          ctx.fillText(`M${idx + 1}(${pt.x}, ${pt.y})`, isx + 10, isy - 10);
        });
      }

      // 6. Điểm Thăm Dò & Tiếp Tuyến (Probe Point & Tangent)
      if (showTangent) {
        const tangent = calculateTangent(parabola, probeX);
        const probeSx = toScreenX(tangent.x0);
        const probeSy = toScreenY(tangent.y0);

        // Vẽ tiếp tuyến
        const tY1 = tangent.slope * minWx + tangent.intercept;
        const tY2 = tangent.slope * maxWx + tangent.intercept;

        ctx.save();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(toScreenX(minWx), toScreenY(tY1));
        ctx.lineTo(toScreenX(maxWx), toScreenY(tY2));
        ctx.stroke();
        ctx.restore();

        // Điểm P(x0, y0)
        ctx.beginPath();
        ctx.arc(probeSx, probeSy, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#a7f3d0';
        ctx.font = 'bold 11px JetBrains Mono, monospace';
        ctx.fillText(`P(${tangent.x0}, ${tangent.y0}) [k = ${tangent.slope}]`, probeSx + 10, probeSy + 16);
      }

      // 7. Giao điểm với Oy (0, c)
      const oySx = toScreenX(0);
      const oySy = toScreenY(yIntercept.y);
      ctx.beginPath();
      ctx.arc(oySx, oySy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#a855f7';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#e9d5ff';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText(`Oy(0, ${yIntercept.y})`, oySx + 8, oySy - 6);

      // 8. Các Nghiệm Ox (x1, 0), (x2, 0)
      roots.forEach((root, idx) => {
        const rx = toScreenX(root);
        const ry = toScreenY(0);
        ctx.beginPath();
        ctx.arc(rx, ry, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#22c55e';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#86efac';
        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.fillText(`x${idx + 1}=${root}`, rx - 8, ry + 16);
      });

      // 9. Đỉnh Parabol I(xv, yv)
      const vx = toScreenX(vertex.x);
      const vy = toScreenY(vertex.y);

      // Hiệu ứng hào quang quanh đỉnh
      ctx.beginPath();
      ctx.arc(vx, vy, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(vx, vy, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Badge đỉnh I
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px JetBrains Mono, monospace';
      ctx.fillText(`Đỉnh I(${vertex.x}, ${vertex.y})`, vx + 10, vy - 10);
    }

    // =========================================================================
    // CHẾ ĐỘ 2: HỆ PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN
    // =========================================================================
    if (activeTab === 'linear-system') {
      const { eq1, eq2, solution, type } = linearAnalysis;

      // Hàm vẽ đường thẳng ax + by = c
      const drawGeneralLine = (eq: { a: number; b: number; c: number }, color: string, label: string) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        if (Math.abs(eq.b) > 1e-6) {
          // by = c - ax => y = (c - ax)/b
          const y1 = (eq.c - eq.a * minWx) / eq.b;
          const y2 = (eq.c - eq.a * maxWx) / eq.b;
          ctx.moveTo(toScreenX(minWx), toScreenY(y1));
          ctx.lineTo(toScreenX(maxWx), toScreenY(y2));
        } else if (Math.abs(eq.a) > 1e-6) {
          // ax = c => x = c/a (đường thẳng đứng)
          const constX = eq.c / eq.a;
          ctx.moveTo(toScreenX(constX), 0);
          ctx.lineTo(toScreenX(constX), height);
        }
        ctx.stroke();

        // Nhãn đường thẳng
        ctx.fillStyle = color;
        ctx.font = 'bold 11px JetBrains Mono, monospace';
        const labelX = toScreenX(1);
        const labelY = Math.abs(eq.b) > 1e-6 ? toScreenY((eq.c - eq.a * 1) / eq.b) - 10 : 50;
        ctx.fillText(label, labelX, labelY);
      };

      // Vẽ Đường 1 (Emerald/Teal)
      drawGeneralLine(eq1, '#10b981', `d₁: ${formatLinearGeneral(eq1.a, eq1.b, eq1.c)}`);

      // Vẽ Đường 2 (Amber/Orange)
      drawGeneralLine(eq2, '#f59e0b', `d₂: ${formatLinearGeneral(eq2.a, eq2.b, eq2.c)}`);

      // Nếu có nghiệm duy nhất (Giao điểm M)
      if (type === 'unique' && solution) {
        const sx = toScreenX(solution.x);
        const sy = toScreenY(solution.y);

        // Vòng phát sáng
        ctx.beginPath();
        ctx.arc(sx, sy, 12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Badge giao điểm
        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 12px JetBrains Mono, monospace';
        ctx.fillText(`M(${solution.x}, ${solution.y})`, sx + 12, sy - 12);
      }
    }

    ctx.restore();
  }, [
    activeTab,
    parabola,
    line,
    showLine,
    probeX,
    parabolaAnalysis,
    linearAnalysis,
    showTangent,
    showGrid,
    scale,
    offset,
  ]);

  return (
    <div className="relative w-full h-full min-h-[500px] select-none overflow-hidden bg-slate-950 flex flex-col">
      {/* Canvas chính */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Floating Toolbar góc trên bên trái: Điều khiển Camera */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-lg shadow-black/40 text-slate-300">
        <button
          onClick={() => handleZoom(10)}
          className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          title="Phóng to lưới (Zoom In)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-10)}
          className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          title="Thu nhỏ lưới (Zoom Out)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetCamera}
          className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          title="Về gốc tọa độ O(0,0)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-slate-700 mx-1" />
        <span className="text-xs font-mono text-slate-400">
          Tỉ lệ: {Math.round((scale / 45) * 100)}%
        </span>
      </div>

      {/* Tọa độ con trỏ chuột HUD ở góc dưới bên trái */}
      <div className="absolute bottom-3 left-3 z-10 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
        <Crosshair className="w-3.5 h-3.5 text-sky-400" />
        <span>
          x = {mouseWorld ? mouseWorld.x : '0.00'}, y = {mouseWorld ? mouseWorld.y : '0.00'}
        </span>
      </div>

      {/* Chú giải nhanh ở góc trên bên phải */}
      <div className="absolute top-4 right-4 z-10 bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 text-xs text-slate-300 shadow-lg">
        {activeTab === 'parabola' ? (
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-sky-400 rounded-full inline-block" />
              <span>Parabol: {parabolaAnalysis.equationStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-cyan-400 border-b border-dashed inline-block" />
              <span>Trục đối xứng: x = {parabolaAnalysis.axisOfSymmetry}</span>
            </div>
            {showLine && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-amber-400 rounded-full inline-block" />
                <span>Đường thẳng: y = {line.m}x + {line.n}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-emerald-400 rounded-full inline-block" />
              <span>d₁: {formatLinearGeneral(linearAnalysis.eq1.a, linearAnalysis.eq1.b, linearAnalysis.eq1.c)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-amber-400 rounded-full inline-block" />
              <span>d₂: {formatLinearGeneral(linearAnalysis.eq2.a, linearAnalysis.eq2.b, linearAnalysis.eq2.c)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
