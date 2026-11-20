import React, { useRef, useEffect } from 'react';
import { AlgorithmsState } from './types';

interface AlgorithmCanvasProps {
  state: AlgorithmsState;
  onChange: (patch: Partial<AlgorithmsState>) => void;
}

export const AlgorithmCanvas: React.FC<AlgorithmCanvasProps> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.classList.contains('dark');
    const bgColor = isDark ? '#020617' : '#f8fafc';
    const textColor = isDark ? '#f8fafc' : '#0f172a';
    const subTextColor = isDark ? '#94a3b8' : '#64748b';

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    if (state.mode === 'sorting') {
      // =======================================================================
      // MODE 1: SORTING VISUALIZER (CÁC CỘT MÀU SẮC)
      // =======================================================================
      const arr = state.array;
      const n = arr.length;
      const marginX = 50;
      const availableW = width - marginX * 2;
      const barW = Math.max(18, Math.floor(availableW / n) - 8);
      const gap = Math.floor((availableW - barW * n) / (n - 1));
      const baseY = height - 70;
      const maxH = 260;

      // Tiêu đề thuật toán
      ctx.fillStyle = textColor;
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        state.sortAlgorithm === 'bubble'
          ? 'Mô phỏng: Sắp xếp nổi bọt (Bubble Sort) — Độ phức tạp: O(n²)'
          : state.sortAlgorithm === 'selection'
          ? 'Mô phỏng: Sắp xếp chọn (Selection Sort) — Độ phức tạp: O(n²)'
          : 'Mô phỏng: Sắp xếp chèn (Insertion Sort) — Độ phức tạp: O(n²)',
        marginX,
        40
      );

      // Thống kê so sánh & hoán đổi
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`So sánh: ${state.comparisonsCount}`, marginX, 64);
      ctx.fillStyle = '#ef4444';
      ctx.fillText(`Hoán đổi: ${state.swapsCount}`, marginX + 130, 64);
      if (state.isSorted) {
        ctx.fillStyle = '#10b981';
        ctx.fillText(`✨ ĐÃ SẮP XẾP HOÀN TẤT!`, marginX + 260, 64);
      }

      // Vẽ từng cột mảng
      arr.forEach((item, idx) => {
        const x = marginX + idx * (barW + gap);
        const h = Math.round((item.value / 100) * maxH);
        const y = baseY - h;

        let barColor = isDark ? '#38bdf8' : '#0284c7';
        if (item.state === 'comparing') barColor = '#f59e0b'; // Vàng đang so sánh
        if (item.state === 'swapping') barColor = '#ef4444'; // Đỏ đang đổi chỗ
        if (item.state === 'sorted') barColor = '#10b981'; // Xanh lá hoàn thành

        // Thân cột
        ctx.fillStyle = barColor;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, h, [6, 6, 0, 0]);
        ctx.fill();

        // Viền bóng
        ctx.strokeStyle = isDark ? '#ffffff22' : '#00000022';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Giá trị số trên đỉnh cột
        ctx.fillStyle = textColor;
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${item.value}`, x + barW / 2, y - 6);

        // Chỉ số index dưới chân cột
        ctx.fillStyle = subTextColor;
        ctx.font = '9px monospace';
        ctx.fillText(`[${idx}]`, x + barW / 2, baseY + 18);
      });

      // Đường cơ sở
      ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(marginX - 10, baseY);
      ctx.lineTo(width - marginX + 10, baseY);
      ctx.stroke();
    } else {
      // =======================================================================
      // MODE 2: BINARY SEARCH & FLOWCHART
      // =======================================================================
      const sArr = state.searchArray;
      const n = sArr.length;
      const marginX = 40;
      const availableW = width - marginX * 2;
      const cellW = Math.floor(availableW / n);
      const arrY = 75;
      const cellH = 44;

      // Tiêu đề
      ctx.fillStyle = textColor;
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        `Thuật toán Tìm kiếm Nhị phân (Binary Search) — O(log n) • Tìm X = ${state.targetValue}`,
        marginX,
        35
      );

      // Vẽ mảng ngang
      sArr.forEach((val, idx) => {
        const x = marginX + idx * cellW;
        const isWithinRange = idx >= state.leftIndex && idx <= state.rightIndex;
        const isMid = idx === state.midIndex;
        const isFound = state.searchFoundIndex === idx;

        // Màu nền ô
        if (isFound) {
          ctx.fillStyle = '#10b981'; // Xanh lá tìm thấy
        } else if (isMid) {
          ctx.fillStyle = '#f59e0b'; // Vàng điểm giữa Mid
        } else if (isWithinRange) {
          ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
        } else {
          ctx.fillStyle = isDark ? '#090d16' : '#f1f5f9'; // Làm mờ vùng bị loại bỏ
        }

        ctx.fillRect(x, arrY, cellW - 4, cellH);
        ctx.strokeStyle = isMid ? '#f59e0b' : isDark ? '#334155' : '#cbd5e1';
        ctx.lineWidth = isMid || isFound ? 2.5 : 1;
        ctx.strokeRect(x, arrY, cellW - 4, cellH);

        // Giá trị số
        ctx.fillStyle = isFound ? '#ffffff' : isWithinRange ? textColor : subTextColor;
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${val}`, x + (cellW - 4) / 2, arrY + cellH / 2);

        // Nhãn con trỏ L, R, Mid
        ctx.font = 'bold 10px sans-serif';
        if (idx === state.leftIndex) {
          ctx.fillStyle = '#38bdf8';
          ctx.fillText('Left', x + (cellW - 4) / 2, arrY - 14);
        }
        if (idx === state.rightIndex) {
          ctx.fillStyle = '#ec4899';
          ctx.fillText('Right', x + (cellW - 4) / 2, arrY - 26);
        }
        if (isMid) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillText('▲ Mid', x + (cellW - 4) / 2, arrY + cellH + 15);
        }
      });

      // =======================================================================
      // VẼ LƯU ĐỒ KHỐI (FLOWCHART) BÊN DƯỚI
      // =======================================================================
      const fcY = 180;
      drawFlowchartBlock(ctx, cx - 220, fcY, 110, 40, 'Bắt đầu', 'start', state.flowchartStep, isDark);
      drawArrow(ctx, cx - 110, fcY + 20, cx - 70, fcY + 20, isDark);

      drawFlowchartBlock(
        ctx,
        cx - 70,
        fcY,
        140,
        40,
        `Mid = ⌊(L+R)/2⌋ = ${state.midIndex}`,
        'calc-mid',
        state.flowchartStep,
        isDark
      );
      drawArrow(ctx, cx + 70, fcY + 20, cx + 110, fcY + 20, isDark);

      drawFlowchartDiamond(
        ctx,
        cx + 170,
        fcY + 20,
        120,
        60,
        `A[Mid] == ${state.targetValue}?`,
        'compare-equal',
        state.flowchartStep,
        isDark
      );

      // Nhánh YES: Tìm thấy!
      drawArrow(ctx, cx + 170, fcY + 50, cx + 170, fcY + 95, isDark);
      drawFlowchartBlock(
        ctx,
        cx + 110,
        fcY + 95,
        120,
        40,
        `✓ TÌM THẤY! [${state.searchFoundIndex ?? '?'}]`,
        'found',
        state.flowchartStep,
        isDark
      );

      // Nhánh NO: So sánh A[Mid] < X
      drawArrow(ctx, cx + 230, fcY + 20, cx + 270, fcY + 20, isDark);
      drawFlowchartBlock(
        ctx,
        cx + 270,
        fcY,
        130,
        40,
        `A[Mid] < X ? L/R`,
        'branch',
        state.flowchartStep,
        isDark
      );

      // Thông báo kết luận tìm kiếm
      ctx.fillStyle = state.searchFoundIndex !== null ? '#10b981' : textColor;
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        state.searchFoundIndex !== null
          ? `🎉 Tìm thấy giá trị X = ${state.targetValue} tại chỉ số A[${state.searchFoundIndex}]!`
          : `Đang xét đoạn [Left = ${state.leftIndex}, Right = ${state.rightIndex}], phần tử giữa A[${state.midIndex}] = ${sArr[state.midIndex]}`,
        cx,
        height - 35
      );
    }
  }, [state]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
      <canvas
        ref={canvasRef}
        width={780}
        height={480}
        className="w-full h-full max-w-4xl max-h-[560px] bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl"
      />
    </div>
  );
};

// =============================================================================
// FLOWCHART DRAWING HELPERS
// =============================================================================
function drawFlowchartBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  text: string,
  blockStep: string,
  currentStep: string,
  isDark: boolean
) {
  const isActive = blockStep === currentStep;
  ctx.save();
  ctx.fillStyle = isActive ? '#0284c7' : isDark ? '#1e293b' : '#f1f5f9';
  ctx.strokeStyle = isActive ? '#38bdf8' : isDark ? '#334155' : '#cbd5e1';
  ctx.lineWidth = isActive ? 2.5 : 1;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isActive ? '#ffffff' : isDark ? '#f8fafc' : '#0f172a';
  ctx.font = isActive ? 'bold 11px sans-serif' : '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + w / 2, y + h / 2);
  ctx.restore();
}

function drawFlowchartDiamond(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  text: string,
  blockStep: string,
  currentStep: string,
  isDark: boolean
) {
  const isActive = blockStep === currentStep;
  ctx.save();
  ctx.fillStyle = isActive ? '#f59e0b' : isDark ? '#1e293b' : '#f1f5f9';
  ctx.strokeStyle = isActive ? '#fbbf24' : isDark ? '#334155' : '#cbd5e1';
  ctx.lineWidth = isActive ? 2.5 : 1;

  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx + w / 2, cy);
  ctx.lineTo(cx, cy + h / 2);
  ctx.lineTo(cx - w / 2, cy);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isActive ? '#000000' : isDark ? '#f8fafc' : '#0f172a';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cx, cy);
  ctx.restore();
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  isDark: boolean
) {
  ctx.save();
  ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
  ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Mũi tên
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const headLen = 6;
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
