import React, { useRef, useState, useEffect } from 'react';
import { Pen, Eraser, RotateCcw, Palette, Check } from 'lucide-react';
import { AnnotationPath } from '../../types/simulation.types';

interface AnnotationOverlayProps {
  isActive: boolean;
  onToggle: () => void;
}

export const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({ isActive, onToggle }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [paths, setPaths] = useState<AnnotationPath[]>([]);
  const [currentPath, setCurrentPath] = useState<AnnotationPath | null>(null);
  const [color, setColor] = useState<string>('#ef4444'); // default red
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const colors = [
    { label: 'Đỏ', value: '#ef4444' },
    { label: 'Vàng', value: '#eab308' },
    { label: 'Xanh ngọc', value: '#06b6d4' },
    { label: 'Xanh lá', value: '#22c55e' },
    { label: 'Trắng', value: '#ffffff' },
  ];

  // Resize canvas to match container size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        redraw();
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [paths]);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const allPaths = currentPath ? [...paths, currentPath] : paths;

    for (const p of allPaths) {
      if (p.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.width;
      ctx.moveTo(p.points[0].x, p.points[0].y);

      for (let i = 1; i < p.points.length; i++) {
        ctx.lineTo(p.points[i].x, p.points[i].y);
      }
      ctx.stroke();
    }
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isActive) return;
    setIsDrawing(true);
    const coords = getCanvasCoords(e);
    setCurrentPath({
      id: Math.random().toString(),
      points: [coords],
      color,
      width: lineWidth,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentPath || !isActive) return;
    const coords = getCanvasCoords(e);
    const updated = {
      ...currentPath,
      points: [...currentPath.points, coords],
    };
    setCurrentPath(updated);
    redraw();
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentPath) return;
    setIsDrawing(false);
    if (currentPath.points.length > 1) {
      setPaths(prev => [...prev, currentPath]);
    }
    setCurrentPath(null);
  };

  const handleUndo = () => {
    setPaths(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPaths([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`absolute inset-0 z-20 transition-all ${
          isActive ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
        }`}
      />

      {/* Floating Toolbar for Annotation */}
      {isActive && (
        <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-xl px-3 py-2 shadow-2xl animate-fade-in text-xs text-white">
          <div className="flex items-center gap-1.5 border-r border-slate-700 pr-2">
            <span className="font-semibold text-cyan-400 flex items-center gap-1">
              <Pen className="w-3.5 h-3.5" /> Bút vẽ:
            </span>
            <div className="flex items-center gap-1">
              {colors.map(c => (
                <button
                  key={c.value}
                  title={c.label}
                  onClick={() => setColor(c.value)}
                  style={{ backgroundColor: c.value }}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${
                    color === c.value ? 'scale-125 border-white shadow-lg' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 border-r border-slate-700 pr-2">
            <button
              onClick={() => setLineWidth(2)}
              className={`px-2 py-1 rounded text-xs font-mono ${lineWidth === 2 ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              Mảnh
            </button>
            <button
              onClick={() => setLineWidth(4)}
              className={`px-2 py-1 rounded text-xs font-mono ${lineWidth === 4 ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              Vừa
            </button>
            <button
              onClick={() => setLineWidth(8)}
              className={`px-2 py-1 rounded text-xs font-mono ${lineWidth === 8 ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              Dày
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={paths.length === 0}
              title="Hoàn tác (Ctrl+Z)"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleClear}
              disabled={paths.length === 0}
              title="Xóa toàn bộ nét vẽ"
              className="px-2 py-1 rounded-lg bg-red-950/80 hover:bg-red-800 text-red-300 transition text-[11px] font-medium"
            >
              Xóa hết
            </button>
          </div>
        </div>
      )}
    </>
  );
};
