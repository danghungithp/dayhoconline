import React, { useRef, useEffect, useState } from 'react';
import { MirrorType } from './types';
import { calculateOptics } from './opticsAudioEngine';

interface LightOpticsCanvasProps {
  mirrorType: MirrorType;
  incidentAngleDeg: number;
  onAngleChange: (angle: number) => void;
  lightColor: string;
  laserPower: number;
  showNormal: boolean;
  showProtractor: boolean;
  showAngles: boolean;
  n1: number;
  n2: number;
  isDark: boolean;
}

export const LightOpticsCanvas: React.FC<LightOpticsCanvasProps> = ({
  mirrorType,
  incidentAngleDeg,
  onAngleChange,
  lightColor,
  laserPower,
  showNormal,
  showProtractor,
  showAngles,
  n1,
  n2,
  isDark,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Xử lý kéo thả chuột trực tiếp trên vòng cung để đổi góc tới
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    updateAngleFromEvent(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    updateAngleFromEvent(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const updateAngleFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = canvas.width / 2;
    const cy = canvas.height * 0.6;

    const dx = x - cx;
    const dy = cy - y; // dy > 0 là phía trên mặt gương

    if (dy <= 10) return; // Chỉ cho phép kéo ở phía trên mặt phản xạ

    let angleRad = Math.atan2(dx, dy); // Góc so với trục thẳng đứng (pháp tuyến)
    let angleDeg = Math.round((angleRad * 180) / Math.PI);
    angleDeg = Math.max(-80, Math.min(80, angleDeg));
    onAngleChange(angleDeg);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Render kích thước thực tế
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height * 0.6; // Gốc tọa độ tiếp xúc mặt gương
    const radius = Math.min(width, height) * 0.42;

    // Background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = isDark ? '#0b0f19' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Lưới tọa độ lab mờ
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 40;
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

    // Nếu ở chế độ khúc xạ: Vẽ 2 môi trường phân tách
    if (mirrorType === 'refraction') {
      // Môi trường 1 (Ở trên, ví dụ Không khí n1)
      ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.8)';
      ctx.fillRect(0, 0, width, cy);

      // Môi trường 2 (Ở dưới, Nước / Thủy tinh n2)
      ctx.fillStyle = isDark ? 'rgba(14, 116, 144, 0.25)' : 'rgba(186, 230, 253, 0.5)';
      ctx.fillRect(0, cy, width, height - cy);

      // Nhãn tên môi trường
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
      ctx.fillText(`Môi trường 1 (n₁ = ${n1.toFixed(2)})`, 20, cy - 15);
      ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.fillText(`Môi trường 2 (n₂ = ${n2.toFixed(2)})`, 20, cy + 25);
    }

    // Thước đo độ Goniometer ảo
    if (showProtractor) {
      ctx.save();
      ctx.translate(cx, cy);

      // Nửa vòng tròn trên
      ctx.beginPath();
      ctx.arc(0, 0, radius, Math.PI, 2 * Math.PI, false);
      ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(100, 116, 139, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Nếu là khúc xạ, vẽ thêm nửa dưới
      if (mirrorType === 'refraction') {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI, false);
        ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(2, 132, 199, 0.2)';
        ctx.stroke();
      }

      // Các vạch chia độ
      for (let deg = -90; deg <= 90; deg += 5) {
        const rad = ((deg - 90) * Math.PI) / 180;
        const isMajor = deg % 10 === 0;
        const tickLen = isMajor ? 12 : 6;
        const r1 = radius;
        const r2 = radius - tickLen;

        ctx.beginPath();
        ctx.moveTo(r1 * Math.cos(rad), r1 * Math.sin(rad));
        ctx.lineTo(r2 * Math.cos(rad), r2 * Math.sin(rad));
        ctx.strokeStyle = isMajor
          ? (isDark ? 'rgba(226, 232, 240, 0.4)' : 'rgba(51, 65, 85, 0.4)')
          : (isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.2)');
        ctx.stroke();

        // Ghi số đo tại các vạch 10°, 30°, 45°, 60°
        if (isMajor && deg !== -90 && deg !== 90) {
          const textR = radius - 24;
          const tx = textR * Math.cos(rad);
          const ty = textR * Math.sin(rad);
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
          ctx.fillText(`${Math.abs(deg)}°`, tx, ty);
        }
      }
      ctx.restore();
    }

    // Mặt gương / Mặt phân cách
    ctx.save();
    if (mirrorType === 'plane') {
      // Gương phẳng
      ctx.beginPath();
      ctx.moveTo(cx - radius * 1.1, cy);
      ctx.lineTo(cx + radius * 1.1, cy);
      ctx.lineWidth = 4;
      ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.stroke();

      // Nét gạch tráng bạc phía dưới gương
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(2, 132, 199, 0.3)';
      ctx.lineWidth = 1.5;
      for (let x = cx - radius * 1.1; x <= cx + radius * 1.1; x += 14) {
        ctx.beginPath();
        ctx.moveTo(x, cy);
        ctx.lineTo(x - 8, cy + 10);
        ctx.stroke();
      }
    } else if (mirrorType === 'concave') {
      // Gương cầu lõm (hội tụ)
      ctx.beginPath();
      ctx.arc(cx, cy - radius * 0.9, radius, 0.3 * Math.PI, 0.7 * Math.PI, false);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#a855f7';
      ctx.stroke();
    } else if (mirrorType === 'convex') {
      // Gương cầu lồi (phân kì)
      ctx.beginPath();
      ctx.arc(cx, cy + radius * 0.9, radius, 1.3 * Math.PI, 1.7 * Math.PI, false);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ec4899';
      ctx.stroke();
    } else {
      // Đường phân cách 2 môi trường
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.lineWidth = 2;
      ctx.strokeStyle = isDark ? '#06b6d4' : '#0891b2';
      ctx.stroke();
    }
    ctx.restore();

    // Pháp tuyến N (đường nét đứt vuông góc)
    if (showNormal) {
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.moveTo(cx, cy - radius * 1.05);
      ctx.lineTo(cx, mirrorType === 'refraction' ? cy + radius * 1.05 : cy + 20);
      ctx.strokeStyle = isDark ? 'rgba(251, 191, 36, 0.8)' : 'rgba(217, 119, 6, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillStyle = isDark ? '#fbbf24' : '#d97706';
      ctx.fillText("Pháp tuyến (N')", cx + 8, cy - radius + 15);
      ctx.restore();
    }

    // Tính toán tia tới và tia phản xạ / khúc xạ
    const absI = Math.abs(incidentAngleDeg);
    const sign = incidentAngleDeg === 0 ? 1 : Math.sign(incidentAngleDeg);
    const radI = (incidentAngleDeg * Math.PI) / 180;

    const laserDist = radius * 0.88;
    const lx = cx - laserDist * Math.sin(radI);
    const ly = cy - laserDist * Math.cos(radI);

    const optics = calculateOptics(incidentAngleDeg, mirrorType, n1, n2);

    // Vẽ vỏ đèn Laser
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(Math.atan2(cy - ly, cx - lx));

    ctx.fillStyle = isDark ? '#334155' : '#cbd5e1';
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-35, -12, 35, 24, 4);
    ctx.fill();
    ctx.stroke();

    // Đầu phát laser
    ctx.fillStyle = lightColor;
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Hiệu ứng tia sáng phát ra
    const glowAlpha = (laserPower / 100) * 0.4;
    const rayWidth = Math.max(2, (laserPower / 100) * 4);

    // 1. TIA TỚI (Incident Ray: lx, ly -> cx, cy)
    ctx.save();
    ctx.shadowColor = lightColor;
    ctx.shadowBlur = 12 * (laserPower / 100);

    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(cx, cy);
    ctx.strokeStyle = lightColor;
    ctx.lineWidth = rayWidth;
    ctx.stroke();

    // Mũi tên chỉ chiều truyền tia tới
    const midIx = (lx + cx) / 2;
    const midIy = (ly + cy) / 2;
    const angleI = Math.atan2(cy - ly, cx - lx);
    drawArrow(ctx, midIx, midIy, angleI, lightColor);

    // Điểm tới O
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = lightColor;
    ctx.fill();
    ctx.restore();

    // 2. TIA PHẢN XẠ (Reflected Ray: từ cx, cy đi lên)
    const refAngleDeg = incidentAngleDeg; // i' đối xứng qua pháp tuyến
    const radRef = (-refAngleDeg * Math.PI) / 180;
    const rx = cx - laserDist * Math.sin(radRef);
    const ry = cy - laserDist * Math.cos(radRef);

    ctx.save();
    ctx.shadowColor = lightColor;
    ctx.shadowBlur = 10 * (laserPower / 100);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(rx, ry);
    ctx.strokeStyle = lightColor;
    ctx.lineWidth = rayWidth;
    ctx.stroke();

    // Mũi tên chỉ chiều tia phản xạ
    const midRx = (cx + rx) / 2;
    const midRy = (cy + ry) / 2;
    const angleR = Math.atan2(ry - cy, rx - cx);
    drawArrow(ctx, midRx, midRy, angleR, lightColor);
    ctx.restore();

    // 3. TIA KHÚC XẠ (Refracted Ray: đi xuống môi trường 2)
    if (mirrorType === 'refraction') {
      if (!optics.isTotalInternalReflection && optics.refractionAngleDeg !== null) {
        const radRefr = (optics.refractionAngleDeg * Math.PI) / 180;
        const refrX = cx + laserDist * Math.sin(radRefr) * sign;
        const refrY = cy + laserDist * Math.cos(radRefr);

        ctx.save();
        ctx.shadowColor = lightColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(refrX, refrY);
        ctx.strokeStyle = lightColor;
        ctx.lineWidth = rayWidth * 0.85;
        ctx.stroke();

        const midTx = (cx + refrX) / 2;
        const midTy = (cy + refrY) / 2;
        const angleT = Math.atan2(refrY - cy, refrX - cx);
        drawArrow(ctx, midTx, midTy, angleT, lightColor);
        ctx.restore();
      } else if (optics.isTotalInternalReflection) {
        // Cảnh báo phản xạ toàn phần
        ctx.save();
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.fillText('⚡ PHẢN XẠ TOÀN PHẦN (i > igh)', cx - 110, cy + 40);
        ctx.restore();
      }
    }

    // Hiển thị cung góc và số đo góc (showAngles)
    if (showAngles && absI > 2) {
      ctx.save();
      // Cung góc tới i
      ctx.beginPath();
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle - (incidentAngleDeg * Math.PI) / 180;
      ctx.arc(cx, cy, 45, Math.min(startAngle, endAngle), Math.max(startAngle, endAngle), false);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Cung góc phản xạ i'
      ctx.beginPath();
      const endRefAngle = startAngle + (incidentAngleDeg * Math.PI) / 180;
      ctx.arc(cx, cy, 45, Math.min(startAngle, endRefAngle), Math.max(startAngle, endRefAngle), false);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Nhãn góc
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`i = ${absI}°`, cx - (incidentAngleDeg > 0 ? 55 : -15), cy - 60);

      ctx.fillStyle = '#22c55e';
      ctx.fillText(`i' = ${absI}°`, cx + (incidentAngleDeg > 0 ? 25 : -65), cy - 60);

      if (mirrorType === 'refraction' && optics.refractionAngleDeg !== null) {
        ctx.fillStyle = '#a855f7';
        ctx.fillText(`r = ${optics.refractionAngleDeg}°`, cx + 25, cy + 60);
      }
      ctx.restore();
    }
  }, [
    mirrorType,
    incidentAngleDeg,
    lightColor,
    laserPower,
    showNormal,
    showProtractor,
    showAngles,
    n1,
    n2,
    isDark,
  ]);

  // Hàm vẽ mũi tên chỉ chiều tia sáng
  function drawArrow(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    color: string
  ) {
    const headLen = 10;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-headLen, -5);
    ctx.lineTo(-headLen, 5);
    ctx.closePath();
    ctx.fill();
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
        className="w-full h-full max-h-[520px] rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800 cursor-crosshair touch-none"
      />
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
        <span>💡 Chạm và kéo đèn Laser để điều chỉnh góc tới</span>
      </div>
    </div>
  );
};
