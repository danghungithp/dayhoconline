import React, { useRef, useEffect } from 'react';
import { GeoEarthState } from './types';
import { getSeasonDetails, formatTimeUTC } from './geoEngine';

interface GeoEarthCanvasProps {
  state: GeoEarthState;
  onChange: (patch: Partial<GeoEarthState>) => void;
}

export const GeoEarthCanvas: React.FC<GeoEarthCanvasProps> = ({ state, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animation loop for orbiting
  useEffect(() => {
    let animId: number;
    if (state.isOrbiting) {
      let lastTime = performance.now();
      const loop = (currentTime: number) => {
        const dt = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        onChange({
          orbitAngleDeg: (state.orbitAngleDeg + dt * 25 * (state.orbitSpeed || 1)) % 360,
        });
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [state.isOrbiting, state.orbitAngleDeg, state.orbitSpeed]);

  // Animation loop for axial rotation
  useEffect(() => {
    let animId: number;
    if (state.isRotating) {
      let lastTime = performance.now();
      const loop = (currentTime: number) => {
        const dt = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        onChange({
          rotationHour: (state.rotationHour + dt * 2) % 24,
        });
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [state.isRotating, state.rotationHour]);

  const seasonInfo = getSeasonDetails(state.orbitAngleDeg);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (state.mode === 'seasons-orbit') {
      renderSeasonsOrbit(ctx, width, height, state, seasonInfo);
    } else {
      renderDayNightRotation(ctx, width, height, state);
    }
  }, [state, seasonInfo]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
      <canvas
        ref={canvasRef}
        width={700}
        height={460}
        className="w-full max-w-[700px] aspect-[700/460] bg-slate-950 rounded-2xl shadow-xl border border-slate-800"
      />
      <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-2">
        {state.mode === 'seasons-orbit' ? (
          <span>Kéo thanh trượt góc quỹ đạo hoặc bấm "Chạy quỹ đạo" để quan sát Trái Đất chuyển động quanh Mặt Trời sinh ra 4 Mùa</span>
        ) : (
          <span>Xoay Trái Đất quanh trục để quan sát hiện tượng ngày đêm luân phiên và chênh lệch múi giờ quốc tế</span>
        )}
      </div>
    </div>
  );
};

// --- RENDER SEASONS ORBIT ---
function renderSeasonsOrbit(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: GeoEarthState,
  season: ReturnType<typeof getSeasonDetails>
) {
  // Deep space background with subtle stars
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, width, height);

  // Random static stars
  ctx.fillStyle = '#ffffff66';
  for (let i = 0; i < 40; i++) {
    const sx = (i * 123 + 45) % width;
    const sy = (i * 231 + 89) % height;
    ctx.fillRect(sx, sy, 1.5, 1.5);
  }

  // Header Title
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 15px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🌍 Chuyển Động Trái Đất Quanh Mặt Trời & Hiện Tượng 4 Mùa', 30, 32);

  const centerX = 260;
  const centerY = 240;
  const orbitRx = 190;
  const orbitRy = 110;

  // Draw Elliptical Orbit
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, orbitRx, orbitRy, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 4 Cardinal Positions Labels on Orbit
  ctx.font = 'bold 10px Inter, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'center';
  ctx.fillText('Hạ Chí (22/6)', centerX, centerY - orbitRy - 12);
  ctx.fillText('Đông Chí (22/12)', centerX, centerY + orbitRy + 20);
  ctx.fillText('Xuân Phân (21/3)', centerX + orbitRx + 40, centerY + 4);
  ctx.fillText('Thu Phân (23/9)', centerX - orbitRx - 40, centerY + 4);

  // Center Sun with Glow
  const sunGrad = ctx.createRadialGradient(centerX, centerY, 8, centerX, centerY, 55);
  sunGrad.addColorStop(0, '#fef08a');
  sunGrad.addColorStop(0.3, '#f59e0b');
  sunGrad.addColorStop(0.7, '#ea580c44');
  sunGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 55, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 10px Inter, sans-serif';
  ctx.fillText('Mặt Trời', centerX, centerY + 3);

  // Calculate Earth Position on Orbit
  const rad = (state.orbitAngleDeg * Math.PI) / 180;
  // Note: 0 deg = Right (Spring), 90 deg = Top (Summer), 180 deg = Left (Autumn), 270 deg = Bottom (Winter)
  const earthX = centerX + orbitRx * Math.cos(rad);
  const earthY = centerY - orbitRy * Math.sin(rad);

  // Sunlight ray line from Sun to Earth
  ctx.strokeStyle = '#fef08a33';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(earthX, earthY);
  ctx.stroke();

  // Draw Earth
  const earthRadius = 18;
  const tiltRad = (23.5 * Math.PI) / 180; // axial tilt ~23.5°

  ctx.save();
  ctx.translate(earthX, earthY);

  // Axial line
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-Math.sin(tiltRad) * 32, -Math.cos(tiltRad) * 32);
  ctx.lineTo(Math.sin(tiltRad) * 32, Math.cos(tiltRad) * 32);
  ctx.stroke();

  // North pole marker
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('B', -Math.sin(tiltRad) * 36, -Math.cos(tiltRad) * 36);

  // Earth Globe
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(0, 0, earthRadius, 0, Math.PI * 2);
  ctx.fill();

  // Continents patch (green)
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.arc(-3, -2, 7, 0, Math.PI * 2);
  ctx.fill();

  // Night shadow (facing away from the Sun)
  const angleToSun = Math.atan2(centerY - earthY, centerX - earthX);
  ctx.fillStyle = '#020617bb';
  ctx.beginPath();
  ctx.arc(0, 0, earthRadius, angleToSun + Math.PI / 2, angleToSun - Math.PI / 2, false);
  ctx.fill();

  ctx.restore();

  // Info Sidebar on Right Side
  const sideX = 490;
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(sideX, 30, 195, 400, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🌡️ ĐẶC ĐIỂM KHÍ HẬU & MÙA', sideX + 14, 58);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.fillText(season.nameVi, sideX + 14, 88);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText(`Thời điểm: ${season.approxDate}`, sideX + 14, 110);
  ctx.fillText(`Mặt Trời chiếu thẳng góc:`, sideX + 14, 134);
  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillText(season.subsolarLatitude, sideX + 14, 152);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('Bắc bán cầu (có Việt Nam):', sideX + 14, 185);
  ctx.fillStyle = '#38bdf8';
  wrapText(ctx, season.northernHemisphere, sideX + 14, 205, 170, 16);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('Độ dài ngày tại Hà Nội:', sideX + 14, 260);
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillText(season.dayLengthHanoi, sideX + 14, 278);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('Nam bán cầu:', sideX + 14, 310);
  ctx.fillStyle = '#e2e8f0';
  wrapText(ctx, season.southernHemisphere, sideX + 14, 330, 170, 16);

  ctx.fillStyle = '#64748b';
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText(`Góc quỹ đạo: ${Math.round(state.orbitAngleDeg)}°`, sideX + 14, 405);
}

// --- RENDER DAY & NIGHT ROTATION ---
function renderDayNightRotation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: GeoEarthState
) {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 15px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('⏰ Trái Đất Tự Quay Quanh Trục (24 Giờ) & Múi Giờ Quốc Tế (UTC)', 30, 32);

  const cx = 250;
  const cy = 230;
  const r = 135;

  // Sunlight rays coming from the left
  ctx.fillStyle = '#fef08a';
  for (let y = 120; y <= 340; y += 30) {
    ctx.strokeStyle = '#facc1555';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(cx - r - 5, y);
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(cx - r - 5, y);
    ctx.lineTo(cx - r - 15, y - 4);
    ctx.lineTo(cx - r - 15, y + 4);
    ctx.fill();
  }
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.fillText('Ánh sáng Mặt Trời (Ban Ngày)', 40, 105);

  // Earth Globe
  ctx.save();
  ctx.translate(cx, cy);

  // Earth base
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Latitudes
  if (state.showEquator) {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-r, 0);
    ctx.lineTo(r, 0);
    ctx.stroke();
  }

  if (state.showTropics) {
    ctx.strokeStyle = '#f87171';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.2;
    // Tropic of Cancer ~23.5° N
    const cancerY = -r * Math.sin((23.5 * Math.PI) / 180);
    const cancerW = r * Math.cos((23.5 * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(-cancerW, cancerY);
    ctx.lineTo(cancerW, cancerY);
    ctx.stroke();

    // Tropic of Capricorn ~23.5° S
    const capriY = r * Math.sin((23.5 * Math.PI) / 180);
    ctx.strokeStyle = '#818cf8';
    ctx.beginPath();
    ctx.moveTo(-cancerW, capriY);
    ctx.lineTo(cancerW, capriY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Shadow for Night side (Right half)
  if (state.showTerminator) {
    ctx.fillStyle = '#020617cc';
    ctx.beginPath();
    ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
    ctx.fill();
  }

  // Tilted Axis
  const tilt = (23.5 * Math.PI) / 180;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-Math.sin(tilt) * (r + 25), -Math.cos(tilt) * (r + 25));
  ctx.lineTo(Math.sin(tilt) * (r + 25), Math.cos(tilt) * (r + 25));
  ctx.stroke();

  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('Cực Bắc (23.5°)', -Math.sin(tilt) * (r + 32), -Math.cos(tilt) * (r + 32));

  ctx.restore();

  // World Clocks Sidebar
  const sideX = 460;
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(sideX, 40, 220, 390, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🌐 BẢNG GIỜ ĐỊA PHƯƠNG', sideX + 16, 68);

  const baseHour = state.rotationHour;

  // Hanoi (GMT+7)
  drawClockRow(ctx, sideX + 16, 105, '🇻🇳 Hà Nội (Việt Nam)', formatTimeUTC(baseHour, 7), 'Múi giờ GMT+7', '#10b981');

  // London (GMT+0)
  drawClockRow(ctx, sideX + 16, 175, '🇬🇧 London (Anh Quốc)', formatTimeUTC(baseHour, 0), 'Múi giờ gốc GMT+0', '#38bdf8');

  // Tokyo (GMT+9)
  drawClockRow(ctx, sideX + 16, 245, '🇯🇵 Tokyo (Nhật Bản)', formatTimeUTC(baseHour, 9), 'Múi giờ GMT+9', '#a855f7');

  // New York (GMT-5)
  drawClockRow(ctx, sideX + 16, 315, '🇺🇸 New York (Hoa Kỳ)', formatTimeUTC(baseHour, -5), 'Múi giờ GMT-5', '#f59e0b');
}

function drawClockRow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  city: string,
  timeStr: string,
  zone: string,
  accentColor: string
) {
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillText(city, x, y);

  ctx.fillStyle = accentColor;
  ctx.font = 'bold 22px monospace';
  ctx.fillText(timeStr, x, y + 26);

  ctx.fillStyle = '#64748b';
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText(zone, x, y + 42);
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
