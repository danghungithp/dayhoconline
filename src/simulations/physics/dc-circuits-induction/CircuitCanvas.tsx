import React, { useRef, useEffect, useState } from 'react';
import { DcCircuitState } from './types';
import { calculateCircuitMetrics } from './circuitEngine';

interface CircuitCanvasProps {
  state: DcCircuitState;
  onChange: (patch: Partial<DcCircuitState>) => void;
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({ state, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const electronOffsetRef = useRef<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());

  const metrics = calculateCircuitMetrics(state);

  // Xử lý kéo thả thanh nam châm trong chế độ cảm ứng
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (state.mode !== 'electromagnetic-induction') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left - canvas.width / 2;

    // Kiểm tra xem có click vào thanh nam châm không (kích thước ~120px rộng)
    if (Math.abs(clickX - state.magnetPositionX) < 80) {
      setIsDragging(true);
      dragStartXRef.current = clickX - state.magnetPositionX;
      canvas.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging || state.mode !== 'electromagnetic-induction') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left - canvas.width / 2;
    const newPosX = Math.max(-220, Math.min(220, currentX - dragStartXRef.current));

    const now = performance.now();
    const dt = Math.max(0.001, (now - lastTimeRef.current) / 1000);
    const velocity = (newPosX - state.magnetPositionX) / dt;
    lastTimeRef.current = now;

    onChange({
      magnetPositionX: Math.round(newPosX),
      magnetVelocity: Math.round(velocity),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
      onChange({ magnetVelocity: 0 });
    }
  };

  // Animation Loop 60 FPS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      const bgColor = isDark ? '#020617' : '#f8fafc';
      const wireColor = isDark ? '#38bdf8' : '#0284c7';
      const textColor = isDark ? '#f8fafc' : '#0f172a';
      const panelBg = isDark ? '#0f172a' : '#ffffff';
      const borderColor = isDark ? '#1e293b' : '#e2e8f0';

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      if (state.mode === 'ohm-dc') {
        // =====================================================================
        // VẼ MẠCH ĐIỆN MỘT CHIỀU (DC OHM CIRCUIT)
        // =====================================================================
        // Tốc độ dòng electron tỉ lệ với cường độ I
        if (state.switchClosed && metrics.totalCurrent > 0) {
          electronOffsetRef.current = (electronOffsetRef.current + metrics.totalCurrent * 2.5) % 30;
        }

        const rectW = Math.min(width * 0.75, 520);
        const rectH = Math.min(height * 0.65, 300);
        const left = cx - rectW / 2;
        const right = cx + rectW / 2;
        const top = cy - rectH / 2;
        const bottom = cy + rectH / 2;

        // Vẽ dây dẫn chính
        ctx.strokeStyle = state.switchClosed ? wireColor : '#64748b';
        ctx.lineWidth = 4;
        ctx.lineJoin = 'round';

        // 1. Dây nguồn phía trên (chứa PIN và KHÓA K)
        ctx.beginPath();
        ctx.moveTo(left, cy);
        ctx.lineTo(left, top);
        ctx.lineTo(cx - 35, top); // Đến chân cực âm PIN
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + 35, top); // Từ cực dương PIN
        ctx.lineTo(right - 90, top); // Đến khóa K
        ctx.stroke();

        // 2. KHÓA K (Switch)
        const switchX = right - 60;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(switchX - 25, top, 6, 0, Math.PI * 2);
        ctx.arc(switchX + 25, top, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = state.switchClosed ? '#10b981' : '#ef4444';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(switchX - 25, top);
        if (state.switchClosed) {
          ctx.lineTo(switchX + 25, top); // Đóng kín
        } else {
          ctx.lineTo(switchX + 18, top - 25); // Mở 45 độ
        }
        ctx.stroke();

        // Nhãn Khóa K
        ctx.fillStyle = textColor;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`Khóa K (${state.switchClosed ? 'ĐÓNG' : 'NGẮT'})`, switchX - 35, top - 18);

        // Nối tiếp sau khóa K về góc trên bên phải
        ctx.strokeStyle = state.switchClosed ? wireColor : '#64748b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(switchX + 25, top);
        ctx.lineTo(right, top);
        ctx.stroke();

        // 3. VẼ PIN / NGUỒN ĐIỆN (Battery) ở đỉnh trên
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 5;
        // Cực dài dương
        ctx.beginPath();
        ctx.moveTo(cx + 8, top - 22);
        ctx.lineTo(cx + 8, top + 22);
        ctx.stroke();
        // Cực ngắn âm dày
        ctx.lineWidth = 9;
        ctx.strokeStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(cx - 8, top - 13);
        ctx.lineTo(cx - 8, top + 13);
        ctx.stroke();

        // Ký hiệu cực + - và hiệu điện thế U
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('+', cx + 18, top - 12);
        ctx.fillStyle = '#3b82f6';
        ctx.fillText('-', cx - 28, top - 12);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`Nguồn U = ${state.voltage}V`, cx, top - 32);

        // 4. VẼ KHU VỰC TẢI (Nối tiếp hoặc Song song) ở đáy dưới
        if (state.connection === 'series') {
          // Dây bên phải đi xuống
          ctx.strokeStyle = state.switchClosed ? wireColor : '#64748b';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(right, top);
          ctx.lineTo(right, bottom);
          ctx.lineTo(cx + 120, bottom);
          ctx.stroke();

          // Điện trở R2 (Bên phải)
          drawResistor(ctx, cx + 50, bottom, 80, 26, `R2: ${state.resistance2}Ω`, '#8b5cf6', isDark);

          // Đoạn dây giữa R1 và R2
          ctx.strokeStyle = state.switchClosed ? wireColor : '#64748b';
          ctx.beginPath();
          ctx.moveTo(cx + 10, bottom);
          ctx.lineTo(cx - 10, bottom);
          ctx.stroke();

          // Điện trở R1 (Bên trái)
          drawResistor(ctx, cx - 70, bottom, 80, 26, `R1: ${state.resistance1}Ω`, '#06b6d4', isDark);

          // Dây từ R1 về góc trái đi lên
          ctx.beginPath();
          ctx.moveTo(cx - 110, bottom);
          ctx.lineTo(left, bottom);
          ctx.lineTo(left, cy);
          ctx.stroke();
        } else {
          // Mạch song song 2 nhánh
          const branchOffset = 45;

          // Dây bên phải phân đôi
          ctx.strokeStyle = state.switchClosed ? wireColor : '#64748b';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(right, top);
          ctx.lineTo(right, bottom);
          ctx.stroke();

          // Nhánh trên R1
          ctx.beginPath();
          ctx.moveTo(right, bottom - branchOffset);
          ctx.lineTo(cx + 60, bottom - branchOffset);
          ctx.moveTo(cx - 60, bottom - branchOffset);
          ctx.lineTo(left, bottom - branchOffset);
          ctx.stroke();
          drawResistor(ctx, cx - 40, bottom - branchOffset, 80, 24, `R1: ${state.resistance1}Ω`, '#06b6d4', isDark);

          // Nhánh dưới R2
          ctx.beginPath();
          ctx.moveTo(right, bottom + branchOffset);
          ctx.lineTo(cx + 60, bottom + branchOffset);
          ctx.moveTo(cx - 60, bottom + branchOffset);
          ctx.lineTo(left, bottom + branchOffset);
          ctx.stroke();
          drawResistor(ctx, cx - 40, bottom + branchOffset, 80, 24, `R2: ${state.resistance2}Ω`, '#8b5cf6', isDark);

          // Nối nhánh trái về trục chính
          ctx.beginPath();
          ctx.moveTo(left, bottom - branchOffset);
          ctx.lineTo(left, bottom + branchOffset);
          ctx.moveTo(left, bottom);
          ctx.lineTo(left, cy);
          ctx.stroke();
        }

        // 5. VẼ BÓNG ĐÈN ẢO & ĐỘ SÁNG (ở cạnh phải mạch)
        const bulbY = cy;
        const bulbX = right;
        drawBulb(ctx, bulbX, bulbY, metrics.bulbBrightness, metrics.isBulbBlown, isDark);

        // 6. VẼ ĐỒNG HỒ ĐO (AMPE KẾ & VÔN KẾ)
        if (state.showMeters) {
          // Ampe kế mắc nối tiếp ở cạnh trái
          drawMeter(ctx, left, cy, 'A', `${metrics.totalCurrent} A`, '#10b981', isDark);
          // Vôn kế mắc song song đo nguồn ở góc trên
          drawMeter(ctx, cx, top + 75, 'V', `${state.voltage} V`, '#f59e0b', isDark);
          // Dây dẫn vôn kế
          ctx.strokeStyle = '#f59e0b88';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(cx - 50, top);
          ctx.lineTo(cx - 30, top + 60);
          ctx.moveTo(cx + 50, top);
          ctx.lineTo(cx + 30, top + 60);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // 7. DÒNG ELECTRON DỊCH CHUYỂN (Chấm tròn màu cyan di chuyển ngược chiều quy ước)
        if (state.showElectrons && state.switchClosed && metrics.totalCurrent > 0) {
          ctx.fillStyle = '#38bdf8';
          const step = 28;
          const offset = electronOffsetRef.current;

          // Nhánh trên (từ cực âm sang cực dương)
          for (let x = left + offset; x < right; x += step) {
            ctx.beginPath();
            ctx.arc(x, top, 3, 0, Math.PI * 2);
            ctx.fill();
          }
          // Nhánh phải (chạy xuống)
          for (let y = top + offset; y < bottom; y += step) {
            ctx.beginPath();
            ctx.arc(right, y, 3, 0, Math.PI * 2);
            ctx.fill();
          }
          // Nhánh đáy (chạy sang trái)
          for (let x = right - offset; x > left; x -= step) {
            ctx.beginPath();
            ctx.arc(x, bottom, 3, 0, Math.PI * 2);
            ctx.fill();
          }
          // Nhánh trái (chạy lên)
          for (let y = bottom - offset; y > top; y -= step) {
            ctx.beginPath();
            ctx.arc(left, y, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else {
        // =====================================================================
        // VẼ THÍ NGHIỆM CẢM ỨNG ĐIỆN TỪ (ELECTROMAGNETIC INDUCTION)
        // =====================================================================
        // 1. Trục tâm & Vùng cuộn dây (Coil) ở chính giữa x = cx
        const coilW = 100;
        const coilH = 140;

        // Vẽ các vòng dây đồng (Copper loops)
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 5;
        const numLoops = Math.min(14, Math.max(6, Math.round(state.coilTurns / 75)));
        for (let i = 0; i < numLoops; i++) {
          const loopX = cx - coilW / 2 + (i * coilW) / (numLoops - 1);
          ctx.beginPath();
          ctx.ellipse(loopX, cy, 14, coilH / 2, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Nhãn cuộn dây
        ctx.fillStyle = textColor;
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Cuộn dây (N = ${state.coilTurns} vòng)`, cx, cy - coilH / 2 - 15);

        // 2. Dây dẫn nối từ cuộn dây xuống ĐIỆN KẾ (Galvanometer)
        ctx.strokeStyle = wireColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 30, cy + coilH / 2);
        ctx.lineTo(cx - 30, cy + coilH / 2 + 50);
        ctx.lineTo(cx - 80, cy + coilH / 2 + 80);

        ctx.moveTo(cx + 30, cy + coilH / 2);
        ctx.lineTo(cx + 30, cy + coilH / 2 + 50);
        ctx.lineTo(cx + 80, cy + coilH / 2 + 80);
        ctx.stroke();

        // 3. VẼ ĐIỆN KẾ G (Galvanometer với kim xoay)
        const gX = cx;
        const gY = cy + coilH / 2 + 90;
        drawGalvanometer(ctx, gX, gY, metrics.inducedCurrent, isDark);

        // 4. VẼ THANH NAM CHÂM THẲNG CÓ THỂ KÉO THẢ (N - Cực Bắc màu Đỏ, S - Cực Nam màu Xanh)
        const magX = cx + state.magnetPositionX;
        const magY = cy;
        const magW = 130;
        const magH = 46;

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 10;

        // Nửa S (Cực Nam - Xanh lam)
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(magX - magW / 2, magY - magH / 2, magW / 2, magH);

        // Nửa N (Cực Bắc - Đỏ)
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(magX, magY - magH / 2, magW / 2, magH);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(magX - magW / 2, magY - magH / 2, magW, magH);
        ctx.restore();

        // Chữ N và S
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('S', magX - magW / 4, magY);
        ctx.fillText('N', magX + magW / 4, magY);

        // Chỉ dẫn kéo thả
        ctx.fillStyle = textColor;
        ctx.font = '11px sans-serif';
        ctx.fillText('⇄ Kéo thả nam châm dịch chuyển qua lại', magX, magY - magH / 2 - 12);

        // Đường sức từ trường (Magnetic field lines) tỏa ra từ cực N sang cực S
        ctx.strokeStyle = isDark ? '#ef444466' : '#dc262644';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        for (let r = 25; r <= 55; r += 15) {
          ctx.beginPath();
          ctx.arc(magX + magW / 2, magY, r, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(magX - magW / 2, magY, r, Math.PI / 2, (3 * Math.PI) / 2);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [state, metrics]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
      <canvas
        ref={canvasRef}
        width={780}
        height={480}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full max-w-4xl max-h-[560px] bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl cursor-grab active:cursor-grabbing touch-none"
      />
    </div>
  );
};

// =============================================================================
// HELPER DRAWING FUNCTIONS
// =============================================================================
function drawResistor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  color: string,
  isDark: boolean
) {
  ctx.save();
  ctx.fillStyle = isDark ? '#1e293b' : '#f1f5f9';
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.strokeRect(x - w / 2, y - h / 2, w, h);

  // Vạch ziczac bên trong
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const segments = 5;
  for (let i = 0; i <= segments; i++) {
    const px = x - w / 2 + 10 + (i * (w - 20)) / segments;
    const py = y + (i % 2 === 0 ? -6 : 6);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(label, x, y - h / 2 - 4);
  ctx.restore();
}

function drawBulb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  brightness: number,
  isBlown: boolean,
  isDark: boolean
) {
  ctx.save();
  const radius = 24;

  // Quầng sáng hào quang (Glow effect)
  if (brightness > 0.05 && !isBlown) {
    const glow = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 2.8 * brightness);
    glow.addColorStop(0, `rgba(253, 224, 71, ${0.8 * brightness})`);
    glow.addColorStop(0.5, `rgba(250, 204, 21, ${0.4 * brightness})`);
    glow.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, radius * 3 * brightness, 0, Math.PI * 2);
    ctx.fill();
  }

  // Thủy tinh bóng đèn
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = isBlown
    ? '#475569'
    : brightness > 0
    ? `rgba(254, 240, 138, ${Math.min(1, 0.4 + brightness * 0.6)})`
    : isDark
    ? '#1e293b'
    : '#e2e8f0';
  ctx.fill();
  ctx.strokeStyle = isBlown ? '#ef4444' : '#eab308';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dây tóc Vonfram
  ctx.beginPath();
  ctx.strokeStyle = isBlown ? '#ef4444' : brightness > 0 ? '#f59e0b' : '#94a3b8';
  ctx.lineWidth = 2;
  ctx.moveTo(x - 8, y + 8);
  ctx.lineTo(x - 4, y - 6);
  ctx.lineTo(x + 4, y - 6);
  ctx.lineTo(x + 8, y + 8);
  ctx.stroke();

  // Nhãn đèn
  ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(isBlown ? 'ĐÈN CHÁY!' : `Đèn (${Math.round(brightness * 100)}%)`, x, y + radius + 16);
  ctx.restore();
}

function drawMeter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  unit: 'A' | 'V',
  value: string,
  color: string,
  isDark: boolean
) {
  ctx.save();
  const r = 24;
  ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(unit, x, y);

  // Hộp số hiển thị giá trị số
  ctx.fillStyle = isDark ? '#1e293b' : '#f1f5f9';
  ctx.fillRect(x - 35, y + r + 4, 70, 20);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 35, y + r + 4, 70, 20);

  ctx.fillStyle = isDark ? '#38bdf8' : '#0369a1';
  ctx.font = 'bold 11px monospace';
  ctx.fillText(value, x, y + r + 15);
  ctx.restore();
}

function drawGalvanometer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  current_mA: number,
  isDark: boolean
) {
  ctx.save();
  const w = 150;
  const h = 85;

  ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.strokeRect(x - w / 2, y - h / 2, w, h);

  // Thước chia độ vạch -50 đến +50
  ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y + 25, 45, Math.PI + 0.3, 2 * Math.PI - 0.3);
  ctx.stroke();

  // Vạch 0 ở giữa
  ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('0', x, y - 10);
  ctx.fillText('-50', x - 42, y - 5);
  ctx.fillText('+50', x + 42, y - 5);

  // Kim điện kế (lệch trái/phải theo dòng điện cảm ứng)
  const maxCurrent = 50;
  const clampedCurrent = Math.max(-maxCurrent, Math.min(maxCurrent, current_mA));
  const angle = (clampedCurrent / maxCurrent) * (Math.PI / 4) - Math.PI / 2;

  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x, y + 25);
  ctx.lineTo(x + 40 * Math.cos(angle), y + 25 + 40 * Math.sin(angle));
  ctx.stroke();

  // Tâm xoay
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(x, y + 25, 4, 0, Math.PI * 2);
  ctx.fill();

  // Chỉ số đo số
  ctx.fillStyle = isDark ? '#38bdf8' : '#0369a1';
  ctx.font = 'bold 12px monospace';
  ctx.fillText(`i = ${current_mA} mA`, x, y + h / 2 - 8);
  ctx.restore();
}
