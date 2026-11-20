import React, { useRef, useEffect } from 'react';
import { GeneticsState } from './types';
import { computeMonohybridCross, CELL_ORGANELLES, CrossResult } from './geneticsEngine';

interface GeneticsCanvasProps {
  state: GeneticsState;
  onChange: (patch: Partial<GeneticsState>) => void;
  crossResult: CrossResult;
}

export const GeneticsCanvas: React.FC<GeneticsCanvasProps> = ({ state, onChange, crossResult }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (state.mode === 'mendel') {
      renderMendelCross(ctx, width, height, state, crossResult);
    } else {
      renderCellAnatomy(ctx, width, height, state);
    }
  }, [state, crossResult]);

  // Handle click on cell organelles in cell mode
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (state.mode !== 'cell') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check hit test on organelles
    for (const org of CELL_ORGANELLES) {
      if (org.id === 'membrane') continue;
      const dist = Math.hypot(clickX - org.x, clickY - org.y);
      if (dist <= org.radius + 15) {
        onChange({ selectedOrganelle: org.id });
        return;
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
      <canvas
        ref={canvasRef}
        width={700}
        height={460}
        onClick={handleCanvasClick}
        className="w-full max-w-[700px] aspect-[700/460] bg-slate-900 rounded-2xl shadow-xl border border-slate-800 cursor-pointer"
      />
      <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-2">
        {state.mode === 'mendel' ? (
          <span>Bảng Punnett 2×2 phân li độc lập thế hệ con F2 • Bấm chọn giao tử bố mẹ ở bảng điều khiển</span>
        ) : (
          <span>Bấm chuột trực tiếp vào bào quan (Nhân, Ty thể, Lục lạp) trên sơ đồ để xem vai trò sinh học</span>
        )}
      </div>
    </div>
  );
};

// --- RENDER MENDEL PUNNETT SQUARE ---
function renderMendelCross(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: GeneticsState,
  cross: CrossResult
) {
  // Background subtle grid
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let x = 30; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Header Title
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 16px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    state.trait === 'flower-color'
      ? '🌻 Di Truyền Men-đen: Màu Sắc Hoa Đậu Hà Lan (A: Tím Trội > a: Trắng Lặn)'
      : '🟢 Di Truyền Men-đen: Hình Dạng & Màu Hạt (B: Vàng Trơn Trội > b: Xanh Nhăn Lặn)',
    30,
    32
  );

  // Parent P labels
  ctx.font = 'bold 13px Inter, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`P (Bố): ${state.p1Alleles.join('')}  ×  P (Mẹ): ${state.p2Alleles.join('')}`, 30, 56);

  // Draw Punnett Grid
  const startX = 220;
  const startY = 90;
  const cellSize = 135;

  // Header Gametes of Mother (Columns)
  ctx.fillStyle = '#f43f5e';
  ctx.font = 'bold 14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Giao tử Mẹ (♀)', startX + cellSize, startY - 26);

  ctx.fillStyle = '#38bdf8';
  ctx.fillText('Giao tử Bố (♂)', startX - 55, startY + cellSize - 10);

  // Column headers
  state.p2Alleles.forEach((al, colIdx) => {
    const cx = startX + colIdx * cellSize + cellSize / 2;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(cx, startY - 8, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(al, cx, startY - 3);
  });

  // Row headers
  state.p1Alleles.forEach((al, rowIdx) => {
    const cy = startY + rowIdx * cellSize + cellSize / 2;
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(startX - 22, cy, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(al, startX - 22, cy + 5);
  });

  // 4 Cells of Punnett
  cross.cells.forEach((cell, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;
    const x = startX + col * cellSize;
    const y = startY + row * cellSize;

    // Box background
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x + 4, y + 4, cellSize - 8, cellSize - 8, 12);
    ctx.fill();
    ctx.stroke();

    // Draw visual organism in cell
    const cx = x + cellSize / 2;
    const cy = y + cellSize / 2 - 12;

    if (state.trait === 'flower-color') {
      const isDominant = cell.genotype.includes('A');
      drawFlower(ctx, cx, cy, isDominant ? '#ec4899' : '#e2e8f0');
    } else {
      const isDominant = cell.genotype.includes('B');
      drawSeed(ctx, cx, cy, isDominant ? '#eab308' : '#22c55e', isDominant);
    }

    // Genotype text
    if (state.showGenotypes) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(cell.genotype, cx, y + cellSize - 28);
    }

    // Phenotype text
    if (state.showPhenotypes) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      const shortLabel = cell.phenotype.split('(')[0].trim();
      ctx.fillText(shortLabel, cx, y + cellSize - 12);
    }
  });

  // Summary Sidebar on the right
  const sideX = 530;
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(sideX, 80, 150, 340, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('📊 TỈ LỆ ĐỜI CON (F1/F2)', sideX + 12, 105);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillText('Kiểu hình:', sideX + 12, 132);

  cross.phenotypeRatio.forEach((item, i) => {
    const py = 155 + i * 45;
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(sideX + 18, py, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(`${item.label}`, sideX + 30, py + 4);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`${item.percentage}% (${item.count}/4)`, sideX + 30, py + 20);
  });

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillText('Kiểu gen:', sideX + 12, 280);

  cross.genotypeRatio.forEach((item, i) => {
    const gy = 302 + i * 22;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`${item.label}:`, sideX + 16, gy);
    ctx.fillStyle = '#a855f7';
    ctx.fillText(`${item.percentage}% (${item.count}/4)`, sideX + 58, gy);
  });
}

function drawFlower(ctx: CanvasRenderingContext2D, cx: number, cy: number, petalColor: string) {
  // Center yellow pistil
  ctx.save();
  const numPetals = 5;
  for (let i = 0; i < numPetals; i++) {
    const angle = (i * 2 * Math.PI) / numPetals;
    const px = cx + Math.cos(angle) * 14;
    const py = cy + Math.sin(angle) * 14;
    ctx.fillStyle = petalColor;
    ctx.beginPath();
    ctx.arc(px, py, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSeed(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string, isRound: boolean) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  if (isRound) {
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
  } else {
    // Wrinkled seed
    ctx.moveTo(cx - 18, cy - 8);
    ctx.quadraticCurveTo(cx - 8, cy - 22, cx + 8, cy - 16);
    ctx.quadraticCurveTo(cx + 22, cy - 6, cx + 18, cy + 12);
    ctx.quadraticCurveTo(cx + 4, cy + 22, cx - 14, cy + 16);
    ctx.closePath();
  }
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

// --- RENDER CELL ANATOMY ---
function renderCellAnatomy(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: GeneticsState
) {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, width, height);

  // Outer Plant Cell Wall
  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 10;
  ctx.fillStyle = '#064e3b15';
  ctx.beginPath();
  ctx.roundRect(80, 40, 400, 360, 40);
  ctx.fill();
  ctx.stroke();

  // Inner Cell Membrane
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(88, 48, 384, 344, 34);
  ctx.stroke();

  // Organelles
  CELL_ORGANELLES.forEach(org => {
    if (org.id === 'membrane') return;

    const isSelected = state.selectedOrganelle === org.id;

    ctx.save();
    ctx.fillStyle = org.color + (isSelected ? 'dd' : '99');
    ctx.strokeStyle = isSelected ? '#ffffff' : org.color;
    ctx.lineWidth = isSelected ? 3 : 1.5;

    ctx.beginPath();
    ctx.arc(org.x, org.y, org.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Internal details for nucleus
    if (org.id === 'nucleus') {
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(org.x - 10, org.y - 8, 14, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(org.x + 8, org.y + 10, 12, 0, Math.PI);
      ctx.stroke();
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ADN / NST', org.x, org.y + 4);
    }

    // Label
    ctx.fillStyle = '#f1f5f9';
    ctx.font = isSelected ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(org.nameVi.split('(')[0].trim(), org.x, org.y + org.radius + 14);

    ctx.restore();
  });

  // Info sidebar for selected organelle
  const activeOrg = CELL_ORGANELLES.find(o => o.id === state.selectedOrganelle) || CELL_ORGANELLES[0];
  const sideX = 500;
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(sideX, 40, 180, 360, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = activeOrg.color;
  ctx.font = 'bold 13px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🔬 THÔNG TIN BÀO QUAN', sideX + 12, 68);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.fillText(activeOrg.nameVi, sideX + 12, 98);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px monospace';
  ctx.fillText(activeOrg.nameEn, sideX + 12, 116);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '11px Inter, sans-serif';
  wrapText(ctx, activeOrg.functionVi, sideX + 12, 145, 155, 16);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, curY);
}
