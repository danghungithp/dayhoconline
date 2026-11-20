import React, { useState, useEffect, useRef } from 'react';
import {
  InteractiveLabSimulationData,
  InteractiveLabParameter,
  QuizQuestion,
} from '../../types/admin.types';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Activity,
  Award,
  BookOpen,
  FlaskConical,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

interface DynamicLabCanvasProps {
  simulationData: InteractiveLabSimulationData;
  title: string;
  quizzes?: QuizQuestion[];
  onOpenInFullPlayer?: () => void;
}

export const DynamicLabCanvas: React.FC<DynamicLabCanvasProps> = ({
  simulationData,
  title,
  quizzes = [],
  onOpenInFullPlayer,
}) => {
  // Current parameter values map
  const [paramValues, setParamValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    simulationData.parameters.forEach(p => {
      initial[p.name] = p.defaultValue;
    });
    return initial;
  });

  // Play / Pause state
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'sim' | 'theory' | 'quiz'>('sim');

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Cập nhật khi simulationData thay đổi
  useEffect(() => {
    const initial: Record<string, number> = {};
    simulationData.parameters.forEach(p => {
      initial[p.name] = p.defaultValue;
    });
    setParamValues(initial);
    timeRef.current = 0;
  }, [simulationData]);

  const handleParamChange = (name: string, value: number) => {
    setParamValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    const initial: Record<string, number> = {};
    simulationData.parameters.forEach(p => {
      initial[p.name] = p.defaultValue;
    });
    setParamValues(initial);
    timeRef.current = 0;
  };

  // Tính toán các đại lượng đầu ra tức thời
  const calculateLiveMetrics = () => {
    const p = paramValues;
    const diagram = simulationData.diagramType || 'graph';

    if (diagram === 'pendulum') {
      const l = p.length ?? 1.0;
      const g = p.gravity ?? 9.8;
      const angleDeg = p.angle ?? 15;
      const m = p.mass ?? 0.2;

      const T = 2 * Math.PI * Math.sqrt(l / g);
      const f = 1 / T;
      const alphaRad = (angleDeg * Math.PI) / 180;
      const vmax = Math.sqrt(2 * g * l * (1 - Math.cos(alphaRad)));
      const W = m * g * l * (1 - Math.cos(alphaRad));

      return {
        'Chu kỳ T': `${T.toFixed(2)} s`,
        'Tần số f': `${f.toFixed(2)} Hz`,
        'Vận tốc cực đại vmax': `${vmax.toFixed(2)} m/s`,
        'Cơ năng toàn phần W': `${W.toFixed(3)} J`,
        _raw: { T, f, vmax, W },
      };
    }

    if (diagram === 'circuit') {
      const U = p.voltage ?? 12;
      const R1 = p.resistor1 ?? 10;
      const R2 = p.resistor2 ?? 10;
      const mode = p.circuitMode ?? 1; // 1: nối tiếp, 2: song song

      let Rtd = mode === 1 ? R1 + R2 : (R1 * R2) / (R1 + R2 || 1);
      Rtd = Math.max(0.1, Rtd);
      const I = U / Rtd;
      const P = U * I;

      return {
        'Điện trở tương đương Rtd': `${Rtd.toFixed(2)} Ω`,
        'Cường độ dòng điện I': `${I.toFixed(2)} A`,
        'Công suất tiêu thụ P': `${P.toFixed(1)} W`,
        'Hiệu điện thế U': `${U.toFixed(1)} V`,
        _raw: { Rtd, I, P, U },
      };
    }

    if (diagram === 'reaction') {
      const Va = p.volAcid ?? 25;
      const Ca = p.concAcid ?? 0.1;
      const Vb = p.volBase ?? 0;
      const Cb = p.concBase ?? 0.1;

      const molAcid = (Va * Ca) / 1000;
      const molBase = (Vb * Cb) / 1000;
      const Vtotal = (Va + Vb) / 1000;

      let pH = 7.0;
      let color = 'Trung tính (Xanh lá)';

      if (molAcid > molBase) {
        const molRemain = molAcid - molBase;
        const H_conc = molRemain / Vtotal;
        pH = Math.max(0, -Math.log10(H_conc));
        color = pH < 3 ? 'Axit mạnh (Đỏ thẫm)' : 'Axit yếu (Cam/Vàng)';
      } else if (molBase > molAcid) {
        const molRemain = molBase - molAcid;
        const OH_conc = molRemain / Vtotal;
        const pOH = -Math.log10(OH_conc);
        pH = Math.min(14, 14 - pOH);
        color = pH > 11 ? 'Bazơ mạnh (Tím)' : 'Bazơ vừa (Xanh lam)';
      }

      return {
        'Chỉ số pH': `${pH.toFixed(2)}`,
        'Màu chỉ thị Phenolphthalein': pH >= 8.3 ? 'Hồng tím rõ nét' : 'Không màu',
        'Tổng thể tích V': `${Va + Vb} mL`,
        'Môi trường dung dịch': color,
        _raw: { pH, Va, Vb },
      };
    }

    if (diagram === 'cell') {
      const nst = p.chromosomeNum ?? 8;
      const phase = p.phaseIndex ?? 2;
      const cycles = p.cycles ?? 2;
      const cellCount = Math.pow(2, cycles);

      const phases = ['Kỳ đầu (Prophase)', 'Kỳ giữa (Metaphase)', 'Kỳ sau (Anaphase)', 'Kỳ cuối (Telophase)'];
      const phaseName = phases[Math.min(3, Math.max(0, Math.floor(phase) - 1))];

      return {
        'Kỳ đang khảo sát': phaseName,
        'Bộ NST loài 2n': `${nst} NST`,
        'Số tế bào con (2^k)': `${cellCount} tế bào`,
        _raw: { nst, phase, cellCount },
      };
    }

    // Default general metrics
    const p1 = Object.values(p)[0] ?? 20;
    const p2 = Object.values(p)[1] ?? 10;
    const rate = Math.round((p1 / (p2 || 1)) * 10) / 10;
    return {
      'Hệ số tương quan': `${rate}`,
      'Năng lượng quy đổi': `${(p1 * 1.5).toFixed(1)} đơn vị`,
      'Trạng thái hoạt động': isRunning ? 'Đang mô phỏng 60 FPS' : 'Tạm dừng',
      _raw: { rate, p1, p2 },
    };
  };

  const metrics = calculateLiveMetrics();

  // Kiểm tra trạng thái hoàn thành các nhiệm vụ (Quests)
  const evaluatedQuests = simulationData.quests.map((q, idx) => {
    let completed = false;
    const raw = metrics._raw as any;

    if (simulationData.diagramType === 'pendulum') {
      if (idx === 0 && paramValues.length === 1.0) completed = true;
      if (idx === 1 && raw?.T >= 1.95 && raw?.T <= 2.05) completed = true;
      if (idx === 2 && paramValues.gravity === 1.6) completed = true;
    } else if (simulationData.diagramType === 'circuit') {
      if (idx === 0 && paramValues.voltage === 12) completed = true;
      if (idx === 1 && raw?.I >= 1.4 && raw?.I <= 1.6) completed = true;
      if (idx === 2 && raw?.P >= 20) completed = true;
    } else if (simulationData.diagramType === 'reaction') {
      if (idx === 0 && raw?.pH <= 1.5) completed = true;
      if (idx === 1 && raw?.pH >= 6.0 && raw?.pH <= 8.5) completed = true;
      if (idx === 2 && raw?.pH >= 9.0) completed = true;
    } else {
      // General quests completed if parameters adjusted
      completed = (paramValues[simulationData.parameters[idx % simulationData.parameters.length]?.name] || 0) > 0;
    }

    return {
      ...q,
      completed,
    };
  });

  const completedCount = evaluatedQuests.filter(q => q.completed).length;

  // Render HTML5 Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localTime = timeRef.current;

    const render = () => {
      if (isRunning) {
        localTime += 0.03 * playbackSpeed;
        timeRef.current = localTime;
      }

      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid Background
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 25;
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

      const diagram = simulationData.diagramType || 'graph';

      // 1. VẼ CON LẮC ĐƠN
      if (diagram === 'pendulum') {
        const l = paramValues.length ?? 1.0;
        const g = paramValues.gravity ?? 9.8;
        const angleDeg = paramValues.angle ?? 15;
        const m = paramValues.mass ?? 0.2;

        const omega = Math.sqrt(g / l);
        const thetaRad = ((angleDeg * Math.PI) / 180) * Math.cos(omega * localTime);

        const originX = width / 2;
        const originY = 40;
        const pixelLength = Math.min(height - 100, Math.max(80, l * 120));

        const bobX = originX + pixelLength * Math.sin(thetaRad);
        const bobY = originY + pixelLength * Math.cos(thetaRad);

        // Giá treo
        ctx.fillStyle = '#475569';
        ctx.fillRect(originX - 40, originY - 6, 80, 6);

        // Vết quỹ đạo dao động
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.lineWidth = 2;
        const maxRad = (angleDeg * Math.PI) / 180;
        ctx.arc(originX, originY, pixelLength, Math.PI / 2 - maxRad, Math.PI / 2 + maxRad);
        ctx.stroke();

        // Dây treo
        ctx.beginPath();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.moveTo(originX, originY);
        ctx.lineTo(bobX, bobY);
        ctx.stroke();

        // Điểm treo
        ctx.beginPath();
        ctx.fillStyle = '#06b6d4';
        ctx.arc(originX, originY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Quả nặng m
        const bobRadius = Math.max(12, Math.min(26, 12 + m * 15));
        const gradient = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, bobRadius);
        gradient.addColorStop(0, '#38bdf8');
        gradient.addColorStop(0.7, '#0284c7');
        gradient.addColorStop(1, '#0369a1');

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Vector vận tốc v
        const v = -omega * pixelLength * Math.sin(thetaRad) * 0.15;
        ctx.beginPath();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2.5;
        ctx.moveTo(bobX, bobY);
        ctx.lineTo(bobX + v * Math.cos(thetaRad), bobY - v * Math.sin(thetaRad));
        ctx.stroke();

        // Nhãn khối lượng
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${m}kg`, bobX, bobY + 3);

        // Biểu đồ thanh năng lượng góc trái
        const maxW = m * g * l * (1 - Math.cos(maxRad)) || 0.001;
        const curAlpha = Math.abs(thetaRad);
        const curEp = m * g * l * (1 - Math.cos(curAlpha));
        const curEk = Math.max(0, maxW - curEp);

        const barW = 14;
        const barH = 70;
        const barX = 25;
        const barY = height - 90;

        // Thế năng Ep
        const epHeight = (curEp / maxW) * barH;
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(barX, barY + barH - epHeight, barW, epHeight);
        ctx.strokeStyle = '#1e3a8a';
        ctx.strokeRect(barX, barY, barW, barH);

        // Động năng Ek
        const ekHeight = (curEk / maxW) * barH;
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(barX + 22, barY + barH - ekHeight, barW, ekHeight);
        ctx.strokeStyle = '#14532d';
        ctx.strokeRect(barX + 22, barY, barW, barH);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px sans-serif';
        ctx.fillText('Wt', barX + barW / 2, barY + barH + 12);
        ctx.fillText('Wd', barX + 22 + barW / 2, barY + barH + 12);
      }
      // 2. VẼ MẠCH ĐIỆN VÀ ELECTRON CHUYỂN ĐỘNG
      else if (diagram === 'circuit') {
        const U = paramValues.voltage ?? 12;
        const R1 = paramValues.resistor1 ?? 10;
        const R2 = paramValues.resistor2 ?? 10;
        const mode = paramValues.circuitMode ?? 1;

        const left = 70;
        const right = width - 70;
        const top = 50;
        const bottom = height - 50;

        // Dây dẫn chính
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(left, top);
        ctx.lineTo(right, top);
        ctx.lineTo(right, bottom);
        ctx.lineTo(left, bottom);
        ctx.closePath();
        ctx.stroke();

        // Nguồn điện (Bên trái)
        const midY = (top + bottom) / 2;
        ctx.fillStyle = '#090d16';
        ctx.fillRect(left - 6, midY - 20, 12, 40);

        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        // Bản dương
        ctx.beginPath();
        ctx.moveTo(left - 16, midY - 12);
        ctx.lineTo(left + 16, midY - 12);
        ctx.stroke();
        // Bản âm
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(left - 10, midY + 12);
        ctx.lineTo(left + 10, midY + 12);
        ctx.stroke();

        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`+ ${U}V -`, left - 20, midY + 4);

        // Điện trở R1 (Cạnh trên)
        const midX = (left + right) / 2;
        ctx.fillStyle = '#090d16';
        ctx.fillRect(midX - 35, top - 12, 70, 24);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.strokeRect(midX - 35, top - 12, 70, 24);
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`R1 = ${R1}Ω`, midX, top + 4);

        // Đèn tải (Cạnh dưới)
        const lightY = bottom;
        ctx.beginPath();
        ctx.fillStyle = '#090d16';
        ctx.arc(midX, lightY, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ánh sáng phát quang bóng đèn tỉ lệ với U
        const glowRadius = Math.min(50, 15 + U * 1.5);
        const glow = ctx.createRadialGradient(midX, lightY, 4, midX, lightY, glowRadius);
        glow.addColorStop(0, 'rgba(253, 224, 71, 0.9)');
        glow.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(midX, lightY, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('💡 Tải', midX, lightY + 3);

        // Hạt electron chuyển động dọc theo mạch
        const I = U / (R1 + R2 || 1);
        const eSpeed = Math.min(8, Math.max(1, I * 2));
        const numElectrons = 16;
        const perimeter = (right - left) * 2 + (bottom - top) * 2;

        ctx.fillStyle = '#38bdf8';
        for (let i = 0; i < numElectrons; i++) {
          const dist = ((i * (perimeter / numElectrons) + localTime * eSpeed * 20) % perimeter);
          let ex = left;
          let ey = top;

          if (dist < (right - left)) {
            ex = left + dist;
            ey = top;
          } else if (dist < (right - left) + (bottom - top)) {
            ex = right;
            ey = top + (dist - (right - left));
          } else if (dist < 2 * (right - left) + (bottom - top)) {
            ex = right - (dist - (right - left) - (bottom - top));
            ey = bottom;
          } else {
            ex = left;
            ey = bottom - (dist - 2 * (right - left) - (bottom - top));
          }

          ctx.beginPath();
          ctx.arc(ex, ey, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // 3. VẼ BÌNH HÓA CHẤT & CHUẨN ĐỘ pH
      else if (diagram === 'reaction') {
        const Va = paramValues.volAcid ?? 25;
        const Vb = paramValues.volBase ?? 0;
        const totalV = Va + Vb;

        const raw = metrics._raw as any;
        const pH = raw?.pH ?? 7.0;

        // Buret xả phía trên
        const buretX = width / 2;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.strokeRect(buretX - 8, 20, 16, 70);

        // Dung dịch trong buret (NaOH)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
        const buretFill = Math.max(5, 60 - Vb);
        ctx.fillRect(buretX - 6, 20 + (65 - buretFill), 12, buretFill);

        // Giọt nhỏ xuống
        if (isRunning && Vb > 0) {
          const dropY = 95 + ((localTime * 40) % 45);
          ctx.beginPath();
          ctx.fillStyle = '#38bdf8';
          ctx.arc(buretX, dropY, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bình tam giác hứng bên dưới
        const flaskW = 120;
        const flaskH = 100;
        const flaskBottom = height - 25;
        const flaskTop = flaskBottom - flaskH;

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(buretX - 16, flaskTop);
        ctx.lineTo(buretX - 16, flaskTop + 20);
        ctx.lineTo(buretX - flaskW / 2, flaskBottom);
        ctx.lineTo(buretX + flaskW / 2, flaskBottom);
        ctx.lineTo(buretX + 16, flaskTop + 20);
        ctx.lineTo(buretX + 16, flaskTop);
        ctx.stroke();

        // Màu dung dịch trong bình theo pH
        let liquidColor = 'rgba(239, 68, 68, 0.7)'; // Axit đỏ
        if (pH >= 3 && pH < 6) liquidColor = 'rgba(245, 158, 11, 0.7)'; // Cam
        else if (pH >= 6 && pH <= 8) liquidColor = 'rgba(34, 197, 94, 0.7)'; // Xanh lá
        else if (pH > 8 && pH < 10) liquidColor = 'rgba(236, 72, 153, 0.75)'; // Hồng Phenolphthalein
        else if (pH >= 10) liquidColor = 'rgba(168, 85, 247, 0.8)'; // Tím Bazơ

        const liquidHeight = Math.min(flaskH - 25, 25 + (totalV / 100) * 45);

        ctx.fillStyle = liquidColor;
        ctx.beginPath();
        ctx.moveTo(buretX - (flaskW / 2 - 8), flaskBottom - 2);
        ctx.lineTo(buretX + (flaskW / 2 - 8), flaskBottom - 2);
        ctx.lineTo(buretX + 22, flaskBottom - liquidHeight);
        ctx.lineTo(buretX - 22, flaskBottom - liquidHeight);
        ctx.closePath();
        ctx.fill();

        // Đầu đo pH kỹ thuật số cắm vào bình
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(buretX + 35, flaskTop - 10);
        ctx.lineTo(buretX + 15, flaskBottom - liquidHeight / 2);
        ctx.stroke();

        // Màn hình hiển thị pH góc phải
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(width - 120, 25, 100, 50);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(width - 120, 25, 100, 50);

        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`pH: ${pH.toFixed(2)}`, width - 70, 56);
      }
      // 4. MẶC ĐỊNH / ĐỒ THỊ SÓNG ĐIỀU HÒA
      else {
        const midY = height / 2;
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x < width; x += 3) {
          const freq = (paramValues.sampleTime ?? 10) * 0.002 + 0.02;
          const amp = Math.min(80, (paramValues.inputParamA ?? 20) * 1.5);
          const y = midY + Math.sin(x * freq + localTime * 2) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Điểm đầu dò tín hiệu
        const probeX = ((localTime * 60) % width);
        const freq = (paramValues.sampleTime ?? 10) * 0.002 + 0.02;
        const amp = Math.min(80, (paramValues.inputParamA ?? 20) * 1.5);
        const probeY = midY + Math.sin(probeX * freq + localTime * 2) * amp;

        ctx.beginPath();
        ctx.fillStyle = '#f43f5e';
        ctx.arc(probeX, probeY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, playbackSpeed, paramValues, simulationData]);

  // Quiz evaluation
  const handleSelectQuizOption = (qId: string, optIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: optIdx,
    }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    quizzes.forEach(q => {
      if (q.type === 'multiple-choice' && selectedAnswers[q.id] === q.correctAnswer) {
        score += q.points;
      }
    });
    return score;
  };

  return (
    <div className="w-full bg-slate-900 border border-cyan-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Header Bar */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700 flex items-center justify-center text-cyan-400 shrink-0">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                Mô phỏng 60 FPS
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                {simulationData.engineType.toUpperCase()}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">{title}</h3>
          </div>
        </div>

        {/* Tab switcher: Thí nghiệm vs Lý thuyết vs Đề trắc nghiệm */}
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-900 p-1 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('sim')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'sim'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Phòng Lab</span>
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'theory'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Nguyên Lý</span>
          </button>
          {quizzes.length > 0 && (
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Bài Test ({quizzes.length})</span>
            </button>
          )}
          {onOpenInFullPlayer && (
            <button
              onClick={onOpenInFullPlayer}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-cyan-400 hover:text-white hover:bg-cyan-950 transition flex items-center gap-1 border border-cyan-800/60"
              title="Mở toàn màn hình trong trình phát chuyên sâu"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Toàn màn hình</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. TAB 1: PHÒNG LAB TƯƠNG TÁC */}
      {activeTab === 'sim' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Main Visual Canvas Area (7 Cols) */}
          <div className="lg:col-span-7 p-4 flex flex-col space-y-3 bg-slate-950/60">
            {/* Visual Screen with HUD */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 aspect-[16/10] sm:aspect-[16/9]">
              <canvas
                ref={canvasRef}
                width={640}
                height={360}
                className="w-full h-full object-contain block"
              />

              {/* HUD Telemetry Top Left */}
              <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 pointer-events-none max-w-xs">
                {Object.entries(metrics)
                  .filter(([key]) => key !== '_raw')
                  .slice(0, 3)
                  .map(([key, val]) => (
                    <div
                      key={key}
                      className="px-2 py-1 rounded-md bg-slate-900/90 border border-slate-700/80 text-[10px] text-slate-300 backdrop-blur"
                    >
                      <span className="text-slate-400">{key}:</span>{' '}
                      <span className="font-mono text-cyan-300 font-bold">{String(val)}</span>
                    </div>
                  ))}
              </div>

              {/* Control buttons overlay bottom */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg p-1 backdrop-blur">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="p-1.5 rounded-md hover:bg-slate-800 text-cyan-400 transition"
                    title={isRunning ? 'Tạm dừng' : 'Chạy tiếp'}
                  >
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition"
                    title="Đặt lại thông số mặc định"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-lg p-1 backdrop-blur text-[10px] font-bold">
                  {[0.5, 1, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-0.5 rounded transition ${
                        playbackSpeed === speed
                          ? 'bg-cyan-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {Object.entries(metrics)
                .filter(([key]) => key !== '_raw')
                .map(([key, val]) => (
                  <div
                    key={key}
                    className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5"
                  >
                    <div className="text-[10px] text-slate-400 truncate">{key}</div>
                    <div className="text-xs font-mono font-bold text-cyan-300 truncate">
                      {String(val)}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Interactive Parameters & Quests Panel (5 Cols) */}
          <div className="lg:col-span-5 p-4 flex flex-col space-y-5 bg-slate-900/40 overflow-y-auto max-h-[560px]">
            {/* 1. Thanh trượt điều khiển thông số (Sliders) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bảng điều khiển thông số ({simulationData.parameters.length}):</span>
              </h4>

              <div className="space-y-3">
                {simulationData.parameters.map(param => {
                  const currentVal = paramValues[param.name] ?? param.defaultValue;
                  return (
                    <div
                      key={param.id}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{param.label}</span>
                        <span className="font-mono text-cyan-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                          {currentVal} {param.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={currentVal}
                        onChange={e => handleParamChange(param.name, parseFloat(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>{param.min} {param.unit}</span>
                        {param.description && <span className="text-slate-400 italic truncate max-w-[140px]">{param.description}</span>}
                        <span>{param.max} {param.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Nhiệm vụ thực hành thí nghiệm (Quests) */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Nhiệm vụ Lab ({completedCount}/{evaluatedQuests.length}):</span>
                </h4>
                <span className="text-[11px] font-mono font-bold text-amber-300">
                  {evaluatedQuests.reduce((acc, q) => acc + (q.completed ? q.points : 0), 0)} pts
                </span>
              </div>

              <div className="space-y-2">
                {evaluatedQuests.map((quest, idx) => (
                  <div
                    key={quest.id}
                    className={`p-3 rounded-xl border transition flex items-start gap-2.5 text-xs ${
                      quest.completed
                        ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="mt-0.5">
                      {quest.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-600 shrink-0" />
                      )}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>
                          Nhiệm vụ {idx + 1}: {quest.title}
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono">+{quest.points}đ</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{quest.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB 2: NGUYÊN LÝ KHOA HỌC & CÔNG THỨC */}
      {activeTab === 'theory' && (
        <div className="p-6 space-y-5 bg-slate-950/40">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>Mục tiêu bài thực hành (Chuẩn GDPT 2018):</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {simulationData.objective}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Bản chất hiện tượng & Cơ chế phản ứng:</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {simulationData.phenomenon}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Công thức cốt lõi:</span>
            </h4>
            <div className="p-3 rounded-lg bg-slate-950 font-mono text-sm text-cyan-300 border border-slate-800 overflow-x-auto">
              {simulationData.formula}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 3: BỘ CÂU HỎI KIỂM TRA ĐÁNH GIÁ (QUIZ) */}
      {activeTab === 'quiz' && (
        <div className="p-6 space-y-5 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>📝 Đề Kiểm Tra Năng Lực Thực Hành</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                {quizzes.length} câu hỏi
              </span>
            </h4>

            {showQuizResults && (
              <div className="text-xs font-bold text-emerald-300 px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-800">
                Điểm trắc nghiệm: {calculateQuizScore()} / 10.0 điểm
              </div>
            )}
          </div>

          <div className="space-y-4">
            {quizzes.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-xs text-white">
                    Câu {idx + 1}: {q.question}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 shrink-0">
                    ({q.points} điểm)
                  </span>
                </div>

                {q.type === 'multiple-choice' && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      const isCorrect = q.correctAnswer === optIdx;

                      let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
                      if (showQuizResults) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/60 border-emerald-600 text-emerald-200 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-950/60 border-rose-600 text-rose-200';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-cyan-950 border-cyan-500 text-cyan-200 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectQuizOption(q.id, optIdx)}
                          className={`p-2.5 rounded-xl border text-xs text-left transition flex items-center gap-2 ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-[10px] shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.type === 'essay' && (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      placeholder="Học sinh nhập câu trả lời tự luận giải thích hiện tượng tại đây..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                )}

                {showQuizResults && q.explanation && (
                  <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-900/60 text-[11px] text-cyan-200">
                    💡 <strong>Giải thích đáp án:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setShowQuizResults(!showQuizResults)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition"
            >
              {showQuizResults ? 'Làm Lại Đề Kiểm Tra' : 'Chấm Điểm & Xem Lời Giải'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
