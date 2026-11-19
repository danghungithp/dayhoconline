import React, { useRef, useEffect } from 'react';
import { SubstanceType } from './types';
import { calculateMatterState, SUBSTANCES } from './matterEngine';

interface MatterCanvasProps {
  substance: SubstanceType;
  temperatureC: number;
  pistonHeight: number;
  isHeating: boolean;
  isCooling: boolean;
  showThermometer: boolean;
  showPressureGauge: boolean;
  isDark: boolean;
}

export const MatterCanvas: React.FC<MatterCanvasProps> = ({
  substance,
  temperatureC,
  pistonHeight,
  isHeating,
  isCooling,
  showThermometer,
  showPressureGauge,
  isDark,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; gridX: number; gridY: number }>>([]);
  const animFrameRef = useRef<number | null>(null);

  const subInfo = SUBSTANCES[substance];
  const matter = calculateMatterState(substance, temperatureC, pistonHeight);

  // Khởi tạo các hạt
  useEffect(() => {
    const numParticles = 54;
    const cols = 9;
    const rows = 6;
    const pts = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        pts.push({
          x: 200 + c * 24,
          y: 280 + r * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          gridX: c,
          gridY: r,
        });
      }
    }
    particlesRef.current = pts;
  }, [substance]);

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

      // Kích thước bình chứa
      const chamberX = width * 0.22;
      const chamberW = width * 0.48;
      const chamberBottom = height * 0.78;
      const chamberTopMax = height * 0.18;
      const chamberH = chamberBottom - chamberTopMax;

      // Chiều cao piston thực tế
      const pistonY = chamberBottom - chamberH * pistonHeight;

      // Clear
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = isDark ? '#0b0f19' : '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // 1. Bình chứa thủy tinh
      ctx.save();
      ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)';
      ctx.fillRect(chamberX, pistonY, chamberW, chamberBottom - pistonY);

      ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      // Thành bên trái
      ctx.moveTo(chamberX, chamberTopMax);
      ctx.lineTo(chamberX, chamberBottom);
      // Đáy bình
      ctx.lineTo(chamberX + chamberW, chamberBottom);
      // Thành bên phải
      ctx.lineTo(chamberX + chamberW, chamberTopMax);
      ctx.stroke();

      // Piston nén ở trên
      ctx.fillStyle = isDark ? '#334155' : '#64748b';
      ctx.fillRect(chamberX + 2, pistonY - 14, chamberW - 4, 14);

      // Cán piston
      ctx.fillRect(chamberX + chamberW / 2 - 8, pistonY - 45, 16, 35);
      ctx.restore();

      // 2. Cập nhật và vẽ các hạt phân tử
      const particles = particlesRef.current;
      const speedFactor = matter.averageSpeed * 0.045;
      const radius = 7;

      ctx.save();
      particles.forEach((p, idx) => {
        if (matter.stateOfMatter === 'solid') {
          // Thể rắn: Dao động nhỏ quanh vị trí mạng tinh thể ở đáy bình
          const baseX = chamberX + 35 + p.gridX * ((chamberW - 70) / 8);
          const baseY = chamberBottom - 20 - (5 - p.gridY) * 22;

          p.x = baseX + (Math.random() - 0.5) * (speedFactor * 0.6);
          p.y = baseY + (Math.random() - 0.5) * (speedFactor * 0.6);
        } else if (matter.stateOfMatter === 'liquid') {
          // Thể lỏng: Di chuyển linh hoạt ở nửa dưới bình chứa
          const liquidCeil = chamberBottom - (chamberBottom - pistonY) * 0.45;
          p.x += p.vx * speedFactor;
          p.y += p.vy * speedFactor + 0.15; // Trọng lực nhẹ kéo hạt xuống

          // Va chạm đáy và thành
          if (p.x - radius < chamberX + 4) { p.x = chamberX + 4 + radius; p.vx *= -1; }
          if (p.x + radius > chamberX + chamberW - 4) { p.x = chamberX + chamberW - 4 - radius; p.vx *= -1; }
          if (p.y + radius > chamberBottom - 4) { p.y = chamberBottom - 4 - radius; p.vy *= -0.8; }
          if (p.y - radius < liquidCeil) { p.y = liquidCeil + radius; p.vy *= -0.8; }
        } else {
          // Thể khí: Bay tự do hỗn loạn khắp không gian bình
          p.x += p.vx * speedFactor * 1.5;
          p.y += p.vy * speedFactor * 1.5;

          // Va chạm 4 phía
          if (p.x - radius < chamberX + 4) { p.x = chamberX + 4 + radius; p.vx *= -1; }
          if (p.x + radius > chamberX + chamberW - 4) { p.x = chamberX + chamberW - 4 - radius; p.vx *= -1; }
          if (p.y + radius > chamberBottom - 4) { p.y = chamberBottom - 4 - radius; p.vy *= -1; }
          if (p.y - radius < pistonY + 2) { p.y = pistonY + 2 + radius; p.vy *= -1; }
        }

        // Vẽ hạt
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = subInfo.color;
        ctx.shadowColor = subInfo.color;
        ctx.shadowBlur = matter.stateOfMatter === 'gas' ? 8 : 2;
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      ctx.restore();

      // 3. Đèn nhiệt / Làm lạnh phía dưới đáy bình
      const heaterCx = chamberX + chamberW / 2;
      const heaterY = chamberBottom + 25;

      ctx.save();
      if (isHeating) {
        // Vẽ ngọn lửa màu cam đỏ
        ctx.beginPath();
        ctx.arc(heaterCx, heaterY, 18, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.fill();

        ctx.font = '28px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('🔥', heaterCx, heaterY + 10);
      } else if (isCooling) {
        // Vẽ biểu tượng băng tuyết
        ctx.font = '28px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('❄️', heaterCx, heaterY + 10);
      } else {
        // Chân đế đỡ bình
        ctx.fillStyle = isDark ? '#334155' : '#cbd5e1';
        ctx.fillRect(heaterCx - 35, heaterY - 10, 70, 8);
      }
      ctx.restore();

      // 4. Áp kế (Pressure Gauge) gắn bên phải bình
      if (showPressureGauge) {
        const gaugeX = chamberX + chamberW + 45;
        const gaugeY = chamberBottom - chamberH * 0.5;
        const gaugeR = 30;

        ctx.save();
        ctx.beginPath();
        ctx.arc(gaugeX, gaugeY, gaugeR, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
        ctx.fill();
        ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Kim chỉ áp suất
        const maxPres = 3.0; // atm
        const pNorm = Math.min(1, matter.pressureAtm / maxPres);
        const needleAngle = -Math.PI * 0.75 + pNorm * Math.PI * 1.5;

        ctx.beginPath();
        ctx.moveTo(gaugeX, gaugeY);
        ctx.lineTo(gaugeX + Math.cos(needleAngle) * (gaugeR - 8), gaugeY + Math.sin(needleAngle) * (gaugeR - 8));
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.textAlign = 'center';
        ctx.fillText('P (atm)', gaugeX, gaugeY + 15);
        ctx.fillText(`${matter.pressureAtm}`, gaugeX, gaugeY + 24);
        ctx.restore();
      }

      // 5. Nhiệt kế (Thermometer) gắn bên trái bình
      if (showThermometer) {
        const thermoX = chamberX - 45;
        const thermoY = chamberBottom - chamberH * 0.7;
        const thermoW = 14;
        const thermoH = chamberH * 0.6;

        ctx.save();
        // Ống nhiệt kế
        ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
        ctx.fillRect(thermoX, thermoY, thermoW, thermoH);
        ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
        ctx.lineWidth = 2;
        ctx.strokeRect(thermoX, thermoY, thermoW, thermoH);

        // Bầu thủy ngân
        ctx.beginPath();
        ctx.arc(thermoX + thermoW / 2, thermoY + thermoH + 6, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();

        // Mức thủy ngân theo nhiệt độ (-100 đến 250)
        const tNorm = Math.max(0, Math.min(1, (temperatureC + 100) / 350));
        const colH = thermoH * tNorm;
        ctx.fillRect(thermoX + 2, thermoY + thermoH - colH, thermoW - 4, colH);

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.textAlign = 'center';
        ctx.fillText(`${temperatureC}°C`, thermoX + thermoW / 2, thermoY - 10);
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [substance, temperatureC, pistonHeight, isHeating, isCooling, showThermometer, showPressureGauge, isDark, matter]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 select-none">
      <canvas
        ref={canvasRef}
        width={760}
        height={500}
        className="w-full h-full max-h-[520px] rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800"
      />
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
        <span>🧪 Mô hình hạt: <strong>{matter.stateNameVi}</strong></span>
      </div>
    </div>
  );
};
