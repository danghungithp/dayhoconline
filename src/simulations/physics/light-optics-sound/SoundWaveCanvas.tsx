import React, { useRef, useEffect } from 'react';
import { WaveformType } from './types';
import { calculateSound } from './opticsAudioEngine';

interface SoundWaveCanvasProps {
  frequency: number;
  amplitude: number;
  waveform: WaveformType;
  isPlaying: boolean;
  showParticles: boolean;
  isDark: boolean;
}

export const SoundWaveCanvas: React.FC<SoundWaveCanvasProps> = ({
  frequency,
  amplitude,
  waveform,
  isPlaying,
  showParticles,
  isDark,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    // Khởi tạo các hạt không khí
    const numParticles = 140;
    const baseParticles = Array.from({ length: numParticles }, (_, i) => ({
      baseX: (i / numParticles) * canvas.width,
      y: (0.7 + (Math.random() * 0.25 - 0.12)) * canvas.height,
      radius: 2 + Math.random() * 2,
    }));

    const render = () => {
      if (!running) return;
      const width = canvas.width;
      const height = canvas.height;

      // Cập nhật pha sóng khi đang phát
      if (isPlaying) {
        // Tốc độ trôi sóng tỉ lệ thuận tần số
        const speed = (frequency / 200) * 0.08;
        phaseRef.current = (phaseRef.current + speed) % (Math.PI * 2);
      }

      const phase = phaseRef.current;

      // Background
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = isDark ? '#0b0f19' : '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Lưới tọa độ dao động ký (Oscilloscope grid)
      const oscHeight = height * 0.55;
      const oscCenterY = oscHeight / 2;

      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(2, 132, 199, 0.08)';
      ctx.lineWidth = 1;
      const grid = 28;
      for (let x = 0; x < width; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, oscHeight);
        ctx.stroke();
      }
      for (let y = 0; y < oscHeight; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Trục 0V (Đường cân bằng)
      ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(100, 116, 139, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, oscCenterY);
      ctx.lineTo(width, oscCenterY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Vẽ sóng âm trên dao động ký
      const soundCalc = calculateSound(frequency, amplitude);
      const ampPx = (amplitude / 100) * (oscHeight * 0.42);

      // Số chu kỳ hiển thị trên màn hình
      const numCycles = Math.max(1, (frequency / 150));
      const k = (2 * Math.PI * numCycles) / width;

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = isPlaying ? '#38bdf8' : (isDark ? '#475569' : '#94a3b8');
      ctx.shadowColor = isPlaying ? '#38bdf8' : 'transparent';
      ctx.shadowBlur = isPlaying ? 10 : 0;

      for (let x = 0; x < width; x += 2) {
        let val = 0;
        const theta = k * x - phase;

        if (waveform === 'sine') {
          val = Math.sin(theta);
        } else if (waveform === 'square') {
          val = Math.sin(theta) >= 0 ? 1 : -1;
        } else if (waveform === 'triangle') {
          val = (2 / Math.PI) * Math.asin(Math.sin(theta));
        }

        const y = oscCenterY - val * ampPx;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.restore();

      // Đỉnh biên độ +A và -A
      if (ampPx > 10) {
        ctx.save();
        ctx.font = '10px monospace';
        ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
        ctx.fillText(`+A (${amplitude}%)`, 10, oscCenterY - ampPx - 4);
        ctx.fillText(`-A`, 10, oscCenterY + ampPx + 12);
        ctx.restore();
      }

      // Vạch phân cách khu vực dao động ký và mô hình hạt
      ctx.strokeStyle = isDark ? '#1e293b' : '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, oscHeight);
      ctx.lineTo(width, oscHeight);
      ctx.stroke();

      // Tiêu đề khu vực hạt không khí
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
      ctx.fillText('Mô hình nén - dãn của các hạt không khí (Sóng dọc)', 16, oscHeight + 24);

      // Vẽ các hạt không khí dao động nén dãn
      if (showParticles) {
        ctx.save();
        baseParticles.forEach(p => {
          // Độ dịch chuyển của hạt theo sóng dọc
          const disp = isPlaying
            ? Math.sin(k * p.baseX - phase) * (amplitude / 100) * 16
            : 0;
          const currentX = p.baseX + disp;

          // Mật độ nén/dãn quyết định độ sáng của hạt
          const density = Math.cos(k * p.baseX - phase);
          const alpha = 0.4 + density * 0.3 * (amplitude / 100);

          ctx.beginPath();
          ctx.arc(currentX, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = isPlaying
            ? `rgba(56, 189, 248, ${Math.max(0.15, Math.min(0.9, alpha))})`
            : (isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(100, 116, 139, 0.4)');
          ctx.fill();
        });
        ctx.restore();
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
  }, [frequency, amplitude, waveform, isPlaying, showParticles, isDark]);

  const soundCalc = calculateSound(frequency, amplitude);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 select-none">
      <canvas
        ref={canvasRef}
        width={760}
        height={500}
        className="w-full h-full max-h-[520px] rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800"
      />

      {/* Floating Info Overlay */}
      <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
        <span className="font-semibold text-sky-500">f = {frequency} Hz</span>
        <span>•</span>
        <span>Chu kỳ T = {soundCalc.periodMs} ms</span>
        <span>•</span>
        <span>Bước sóng λ = {soundCalc.wavelengthM} m</span>
        <span>•</span>
        <span className="font-medium text-emerald-500">{soundCalc.pitchNameVi}</span>
      </div>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="px-5 py-2.5 rounded-2xl bg-black/60 backdrop-blur text-white font-medium text-sm shadow-xl flex items-center gap-2">
            <span>Ấn "Phát âm thanh" ở bảng điều khiển để kích hoạt loa và sóng động</span>
          </div>
        </div>
      )}
    </div>
  );
};
