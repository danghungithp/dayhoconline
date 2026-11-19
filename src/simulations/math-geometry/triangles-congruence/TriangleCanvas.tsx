import React, { useRef, useEffect, useState } from 'react';
import { Point2D, TriangleState } from './types';
import { analyzeTriangle, dist } from './geometrySolver';

interface TriangleCanvasProps {
  state: TriangleState;
  onVertexDrag: (vertex: 'A' | 'B' | 'C' | 'A2' | 'B2' | 'C2', point: Point2D) => void;
  isDark: boolean;
}

export const TriangleCanvas: React.FC<TriangleCanvasProps> = ({
  state,
  onVertexDrag,
  isDark,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [draggedVertex, setDraggedVertex] = useState<'A' | 'B' | 'C' | 'A2' | 'B2' | 'C2' | null>(null);

  const t1 = analyzeTriangle(state.A, state.B, state.C);

  // Xử lý kéo thả đỉnh tam giác
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const vertices: { key: 'A' | 'B' | 'C' | 'A2' | 'B2' | 'C2'; pt: Point2D }[] = [
      { key: 'A', pt: state.A },
      { key: 'B', pt: state.B },
      { key: 'C', pt: state.C },
    ];

    if (state.activeTab === 'congruence' && !state.isSuperimposed) {
      vertices.push(
        { key: 'A2', pt: state.A2 },
        { key: 'B2', pt: state.B2 },
        { key: 'C2', pt: state.C2 }
      );
    }

    for (const v of vertices) {
      if (Math.hypot(v.pt.x - x, v.pt.y - y) <= 18) {
        setDraggedVertex(v.key);
        break;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggedVertex) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(20, Math.min(canvas.width - 20, e.clientX - rect.left));
    const y = Math.max(20, Math.min(canvas.height - 20, e.clientY - rect.top));

    onVertexDrag(draggedVertex, { x, y });
  };

  const handlePointerUp = () => {
    setDraggedVertex(null);
  };

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

    // Lưới nền lab mờ
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 35) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 35) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const { A, B, C } = state;

    // ================= PHẦN ĐỊNH LÝ PYTHAGORE =================
    if (state.activeTab === 'pythagoras' && state.showPythagorasSquares) {
      // Dựng 3 hình vuông bên ngoài 3 cạnh
      drawExteriorSquare(ctx, B, C, '#ef4444', isDark, `a² = ${(t1.sideA * t1.sideA).toFixed(0)}`);
      drawExteriorSquare(ctx, C, A, '#3b82f6', isDark, `b² = ${(t1.sideB * t1.sideB).toFixed(0)}`);
      drawExteriorSquare(ctx, A, B, '#10b981', isDark, `c² = ${(t1.sideC * t1.sideC).toFixed(0)}`);
    }

    // ================= PHẦN 4 ĐƯỜNG ĐỒNG QUY =================
    if (state.activeTab === 'concurrence') {
      // 1. Ba đường trung tuyến (Medians)
      if (state.showMedians) {
        const mBC = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 };
        const mCA = { x: (C.x + A.x) / 2, y: (C.y + A.y) / 2 };
        const mAB = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        drawLine(ctx, A, mBC);
        drawLine(ctx, B, mCA);
        drawLine(ctx, C, mAB);

        // Trọng tâm G
        drawSpecialPoint(ctx, t1.centroid, 'G (Trọng tâm)', '#f59e0b', isDark);
      }

      // 2. Ba đường phân giác & Đường tròn nội tiếp
      if (state.showAngleBisectors) {
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 1.5;
        drawLine(ctx, A, t1.incenter);
        drawLine(ctx, B, t1.incenter);
        drawLine(ctx, C, t1.incenter);

        drawSpecialPoint(ctx, t1.incenter, 'I (Tâm nội tiếp)', '#ec4899', isDark);

        if (state.showIncircle && t1.inradius > 2) {
          ctx.beginPath();
          ctx.arc(t1.incenter.x, t1.incenter.y, t1.inradius, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(236, 72, 153, 0.6)';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // 3. Ba đường trung trực & Đường tròn ngoại tiếp
      if (state.showPerpendicularBisectors) {
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.5;
        const mBC = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 };
        const mCA = { x: (C.x + A.x) / 2, y: (C.y + A.y) / 2 };
        const mAB = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };

        drawLine(ctx, mBC, t1.circumcenter);
        drawLine(ctx, mCA, t1.circumcenter);
        drawLine(ctx, mAB, t1.circumcenter);

        drawSpecialPoint(ctx, t1.circumcenter, 'O (Tâm ngoại tiếp)', '#06b6d4', isDark);

        if (state.showCircumcircle && t1.circumradius > 5 && t1.circumradius < 1000) {
          ctx.beginPath();
          ctx.arc(t1.circumcenter.x, t1.circumcenter.y, t1.circumradius, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // 4. Ba đường cao & Trực tâm H
      if (state.showAltitudes) {
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 1.5;
        drawLine(ctx, A, t1.orthocenter);
        drawLine(ctx, B, t1.orthocenter);
        drawLine(ctx, C, t1.orthocenter);

        drawSpecialPoint(ctx, t1.orthocenter, 'H (Trực tâm)', '#8b5cf6', isDark);
      }

      // Đường thẳng Euler (O - G - H)
      if (state.showEulerLine) {
        ctx.save();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        drawLine(ctx, t1.circumcenter, t1.orthocenter);
        ctx.restore();
      }
    }

    // ================= VẼ TAM GIÁC PHỤ A'B'C' (NẾU Ở TAB CONGRUENCE) =================
    if (state.activeTab === 'congruence') {
      const pA2 = state.isSuperimposed ? A : state.A2;
      const pB2 = state.isSuperimposed ? B : state.B2;
      const pC2 = state.isSuperimposed ? C : state.C2;

      // Tam giác 2
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pA2.x, pA2.y);
      ctx.lineTo(pB2.x, pB2.y);
      ctx.lineTo(pC2.x, pC2.y);
      ctx.closePath();
      ctx.fillStyle = state.isSuperimposed ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      if (!state.isSuperimposed) {
        drawVertex(ctx, pA2, "A'", '#f59e0b', isDark);
        drawVertex(ctx, pB2, "B'", '#f59e0b', isDark);
        drawVertex(ctx, pC2, "C'", '#f59e0b', isDark);
      }
    }

    // ================= VẼ TAM GIÁC CHÍNH ABC =================
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.closePath();
    ctx.fillStyle = isDark ? 'rgba(2, 132, 199, 0.15)' : 'rgba(186, 230, 253, 0.4)';
    ctx.fill();

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Góc vuông nếu có
    if (t1.isRightTriangle && t1.rightVertex) {
      drawRightAngleMarker(ctx, t1.rightVertex === 'A' ? A : t1.rightVertex === 'B' ? B : C);
    }

    // Nhãn đỉnh A, B, C
    drawVertex(ctx, A, 'A', '#0284c7', isDark);
    drawVertex(ctx, B, 'B', '#0284c7', isDark);
    drawVertex(ctx, C, 'C', '#0284c7', isDark);

  }, [state, t1, isDark]);

  // Helper vẽ đoạn thẳng
  function drawLine(ctx: CanvasRenderingContext2D, p1: Point2D, p2: Point2D) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  // Helper vẽ đỉnh có thể kéo
  function drawVertex(
    ctx: CanvasRenderingContext2D,
    p: Point2D,
    label: string,
    color: string,
    dark: boolean
  ) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillStyle = dark ? '#ffffff' : '#0f172a';
    ctx.fillText(label, p.x + 10, p.y - 10);
    ctx.restore();
  }

  // Helper vẽ điểm đồng quy đặc biệt
  function drawSpecialPoint(
    ctx: CanvasRenderingContext2D,
    p: Point2D,
    label: string,
    color: string,
    dark: boolean
  ) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillStyle = color;
    ctx.fillText(label, p.x + 8, p.y + 4);
    ctx.restore();
  }

  // Helper vẽ ký hiệu góc vuông
  function drawRightAngleMarker(ctx: CanvasRenderingContext2D, vertex: Point2D) {
    ctx.save();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    const s = 14;
    ctx.strokeRect(vertex.x - s / 2, vertex.y - s / 2, s, s);
    ctx.restore();
  }

  // Helper dựng hình vuông ngoại tiếp trên cạnh tam giác (Pythagore)
  function drawExteriorSquare(
    ctx: CanvasRenderingContext2D,
    p1: Point2D,
    p2: Point2D,
    color: string,
    dark: boolean,
    text: string
  ) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    // Vector pháp tuyến hướng ra ngoài
    const nx = -dy;
    const ny = dx;

    const p3 = { x: p2.x + nx, y: p2.y + ny };
    const p4 = { x: p1.x + nx, y: p1.y + ny };

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();

    ctx.fillStyle = `${color}25`;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ghi số diện tích ở tâm hình vuông
    const mx = (p1.x + p2.x + p3.x + p4.x) / 4;
    const my = (p1.y + p2.y + p3.y + p4.y) / 4;
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, mx, my);
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
        className="w-full h-full max-h-[520px] rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800 cursor-move touch-none"
      />
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
        <span>📍 Chạm và kéo các đỉnh A, B, C để biến đổi hình học</span>
      </div>
    </div>
  );
};
