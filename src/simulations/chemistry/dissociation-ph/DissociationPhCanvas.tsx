import React, { useRef, useEffect } from 'react';
import { DissociationPhState } from './types';
import { calculatePhMetrics, SAMPLE_SOLUTIONS } from './chemistryEngine';

interface DissociationPhCanvasProps {
  state: DissociationPhState;
  onChange: (patch: Partial<DissociationPhState>) => void;
}

export const DissociationPhCanvas: React.FC<DissociationPhCanvasProps> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const dripOffsetRef = useRef<number>(0);

  const metrics = calculatePhMetrics(state);
  const currentSolution = SAMPLE_SOLUTIONS.find((s) => s.id === state.selectedSolutionId) || SAMPLE_SOLUTIONS[4];

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
      const textColor = isDark ? '#f8fafc' : '#0f172a';
      const glassBorder = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(15, 23, 42, 0.4)';

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      if (state.mode === 'ph-scale') {
        // =====================================================================
        // MODE 1: THANG ĐO pH & CỐC THÍ NGHIỆM ĐIỆN LI
        // =====================================================================
        // 1. Vẽ thang đo pH cầu vồng (pH 0 -> 14) ở đỉnh trên
        const barX = 60;
        const barY = 35;
        const barW = width - 120;
        const barH = 18;

        const phGradient = ctx.createLinearGradient(barX, 0, barX + barW, 0);
        phGradient.addColorStop(0, '#dc2626'); // pH 0 Đỏ
        phGradient.addColorStop(0.25, '#f97316'); // pH 3-4 Cam
        phGradient.addColorStop(0.5, '#22c55e'); // pH 7 Xanh lá / Nước
        phGradient.addColorStop(0.75, '#3b82f6'); // pH 10-11 Xanh lam
        phGradient.addColorStop(1, '#7e22ce'); // pH 14 Tím thẫm

        ctx.fillStyle = phGradient;
        ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(barX, barY, barW, barH);

        // Vạch số 0, 7, 14
        ctx.fillStyle = textColor;
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        for (let p = 0; p <= 14; p += 2) {
          const px = barX + (p / 14) * barW;
          ctx.fillText(`${p}`, px, barY + barH + 13);
        }

        // Kim chỉ vị trí pH hiện tại trên thang đo
        const pointerX = barX + (metrics.currentPh / 14) * barW;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(pointerX, barY - 4);
        ctx.lineTo(pointerX - 6, barY - 14);
        ctx.lineTo(pointerX + 6, barY - 14);
        ctx.closePath();
        ctx.fill();

        // 2. CỐC THỦY TINH CHIA ĐỘ (BEAKER)
        const beakerW = 200;
        const beakerH = 240;
        const beakerX = cx - beakerW / 2 - 40;
        const beakerY = cy - 60;

        const totalVol = state.solutionVolumeMl + state.waterAddedMl; // 100 đến 1800 mL
        const liquidH = Math.min(beakerH - 25, (totalVol / 1200) * (beakerH - 30));
        const liquidY = beakerY + beakerH - liquidH;

        // Chất lỏng trong cốc
        ctx.save();
        ctx.fillStyle = metrics.solutionColor;
        ctx.beginPath();
        ctx.roundRect(beakerX + 4, liquidY, beakerW - 8, liquidH - 4, [0, 0, 16, 16]);
        ctx.fill();
        ctx.restore();

        // Vạch chia độ trên thành cốc
        ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
        ctx.lineWidth = 1;
        for (let v = 200; v <= 1000; v += 200) {
          const vy = beakerY + beakerH - (v / 1200) * (beakerH - 30);
          ctx.beginPath();
          ctx.moveTo(beakerX + 8, vy);
          ctx.lineTo(beakerX + 22, vy);
          ctx.stroke();
          ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
          ctx.font = '9px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(`${v}ml`, beakerX + 26, vy + 3);
        }

        // Viền thủy tinh của cốc
        ctx.strokeStyle = glassBorder;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(beakerX, beakerY);
        ctx.lineTo(beakerX, beakerY + beakerH - 16);
        ctx.arcTo(beakerX, beakerY + beakerH, beakerX + 16, beakerY + beakerH, 16);
        ctx.lineTo(beakerX + beakerW - 16, beakerY + beakerH);
        ctx.arcTo(beakerX + beakerW, beakerY + beakerH, beakerX + beakerW, beakerY + beakerH - 16, 16);
        ctx.lineTo(beakerX + beakerW, beakerY);
        ctx.stroke();

        // Miệng cốc loe nhẹ
        ctx.beginPath();
        ctx.moveTo(beakerX - 8, beakerY);
        ctx.lineTo(beakerX + 6, beakerY);
        ctx.moveTo(beakerX + beakerW - 6, beakerY);
        ctx.lineTo(beakerX + beakerW + 8, beakerY);
        ctx.stroke();

        // 3. NHÚNG BÚT ĐO pH HOẶC GIẤY QUỲ TÍM
        if (state.dippedIndicator === 'ph-probe') {
          // Thân bút đo pH
          const probeX = beakerX + beakerW / 2;
          const probeY = beakerY - 10;
          ctx.fillStyle = isDark ? '#1e293b' : '#334155';
          ctx.fillRect(probeX - 16, probeY - 70, 32, 160);
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 2;
          ctx.strokeRect(probeX - 16, probeY - 70, 32, 160);

          // Đầu dò thủy tinh nhúng ngập trong dung dịch
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(probeX, probeY + 95, 8, 0, Math.PI * 2);
          ctx.fill();

          // Màn hình số LCD trên bút
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(probeX - 13, probeY - 60, 26, 32);
          ctx.fillStyle = '#22c55e';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('pH', probeX, probeY - 48);
          ctx.font = 'bold 13px monospace';
          ctx.fillText(`${metrics.currentPh}`, probeX, probeY - 33);
        } else if (state.dippedIndicator === 'litmus-paper') {
          // Giấy quỳ tím nhúng vào dung dịch
          const paperX = beakerX + beakerW / 2;
          const paperY = beakerY + 10;
          const paperW = 28;
          const paperH = 150;

          // Phần khô phía trên (màu tím nguyên bản)
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(paperX - paperW / 2, paperY - 50, paperW, 80);

          // Phần nhúng ngập đổi màu hóa học theo pH
          ctx.fillStyle = metrics.litmusPaperColor;
          ctx.fillRect(paperX - paperW / 2, paperY + 30, paperW, 70);

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.strokeRect(paperX - paperW / 2, paperY - 50, paperW, paperH);

          // Nhãn chỉ thị
          ctx.fillStyle = textColor;
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Giấy quỳ', paperX, paperY - 58);
        }

        // 4. BẢNG THÔNG TIN NỒNG ĐỘ ION [H+] VÀ [OH-] Ở CẠNH PHẢI
        const infoX = cx + 110;
        const infoY = cy - 50;
        ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
        ctx.strokeStyle = isDark ? '#1e293b' : '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.roundRect(infoX, infoY, 210, 190, 14);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = textColor;
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Dung dịch: ${currentSolution.nameVi.slice(0, 18)}...`, infoX + 12, infoY + 24);

        ctx.font = 'bold 22px monospace';
        ctx.fillStyle = metrics.currentPh < 7 ? '#ef4444' : metrics.currentPh > 7 ? '#3b82f6' : '#10b981';
        ctx.fillText(`pH = ${metrics.currentPh}`, infoX + 12, infoY + 54);

        ctx.font = '11px sans-serif';
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.fillText(
          metrics.currentPh < 7
            ? 'Môi trường: Axit (Vị chua, đỏ quỳ)'
            : metrics.currentPh > 7
            ? 'Môi trường: Bazơ / Kiềm (Xanh quỳ)'
            : 'Môi trường: Trung tính (pH = 7.0)',
          infoX + 12,
          infoY + 76
        );

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#ef4444';
        ctx.fillText(`[H+] = ${metrics.hPlusConcentration.toExponential(2)} M`, infoX + 12, infoY + 105);

        ctx.fillStyle = '#3b82f6';
        ctx.fillText(`[OH-] = ${metrics.ohMinusConcentration.toExponential(2)} M`, infoX + 12, infoY + 125);

        ctx.fillStyle = isDark ? '#cbd5e1' : '#475569';
        ctx.font = '10px monospace';
        ctx.fillText(`Kw = [H+][OH-] = 1.0×10⁻¹⁴`, infoX + 12, infoY + 150);
        ctx.fillText(`Tổng V = ${totalVol} mL`, infoX + 12, infoY + 170);
      } else {
        // =====================================================================
        // MODE 2: CHUẨN ĐỘ AXIT - BAZƠ & ĐỒ THỊ ĐƯỜNG CONG pH
        // =====================================================================
        // 1. VẼ BURET CHỨA NaOH Ở BÊN TRÁI
        const buretX = cx - 180;
        const buretY = 30;
        const buretW = 28;
        const buretH = 260;

        // Vạch thủy tinh buret
        ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc';
        ctx.fillRect(buretX - buretW / 2, buretY, buretW, buretH);
        ctx.strokeStyle = glassBorder;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(buretX - buretW / 2, buretY, buretW, buretH);

        // Mực dung dịch NaOH còn lại trong buret
        const maxBuretVol = 50;
        const remainBase = Math.max(0, maxBuretVol - state.buretBaseVolumeMl);
        const buretLiquidH = (remainBase / maxBuretVol) * (buretH - 20);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.fillRect(
          buretX - buretW / 2 + 2,
          buretY + buretH - 10 - buretLiquidH,
          buretW - 4,
          buretLiquidH
        );

        // Đầu van buret
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(buretX, buretY + buretH);
        ctx.lineTo(buretX, buretY + buretH + 20);
        ctx.stroke();

        // Giọt chất lỏng nhỏ xuống bình tam giác
        if (state.isDripping) {
          dripOffsetRef.current = (dripOffsetRef.current + 3) % 40;
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(buretX, buretY + buretH + 22 + dripOffsetRef.current, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. BÌNH TAM GIÁC (ERLENMEYER FLASK) ĐỰNG DUNG DỊCH HCl + CHỈ THỊ
        const erlenX = buretX;
        const erlenY = buretY + buretH + 55;
        const erlenTopW = 26;
        const erlenBottomW = 110;
        const erlenH = 120;

        // Vẽ dung dịch trong bình Erlen
        ctx.save();
        ctx.fillStyle = metrics.solutionColor;
        ctx.beginPath();
        ctx.moveTo(erlenX - erlenBottomW / 2 + 6, erlenY + erlenH - 6);
        ctx.lineTo(erlenX + erlenBottomW / 2 - 6, erlenY + erlenH - 6);
        ctx.lineTo(erlenX + erlenBottomW / 2 - 20, erlenY + erlenH - 45);
        ctx.lineTo(erlenX - erlenBottomW / 2 + 20, erlenY + erlenH - 45);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Viền bình Erlen
        ctx.strokeStyle = glassBorder;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(erlenX - erlenTopW / 2, erlenY);
        ctx.lineTo(erlenX - erlenTopW / 2, erlenY + 25);
        ctx.lineTo(erlenX - erlenBottomW / 2, erlenY + erlenH);
        ctx.lineTo(erlenX + erlenBottomW / 2, erlenY + erlenH);
        ctx.lineTo(erlenX + erlenTopW / 2, erlenY + 25);
        ctx.lineTo(erlenX + erlenTopW / 2, erlenY);
        ctx.stroke();

        ctx.fillStyle = textColor;
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`HCl 0.1M (25mL)`, erlenX, erlenY + erlenH + 18);
        ctx.fillText(`+ Phenolphthalein`, erlenX, erlenY + erlenH + 32);

        // 3. ĐỒ THỊ ĐƯỜNG CONG CHUẨN ĐỘ pH (TITRATION CURVE) Ở PHÍA BÊN PHẢI
        const chartX = cx + 10;
        const chartY = 40;
        const chartW = 320;
        const chartH = 260;

        ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
        ctx.strokeStyle = isDark ? '#1e293b' : '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.roundRect(chartX, chartY, chartW, chartH, 12);
        ctx.fill();
        ctx.stroke();

        // Tiêu đề đồ thị
        ctx.fillStyle = textColor;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ĐƯỜNG CONG CHUẨN ĐỘ AXIT - BAZƠ', chartX + chartW / 2, chartY + 22);

        // Trục tọa độ đồ thị
        const gx = chartX + 45;
        const gy = chartY + chartH - 45;
        const gw = chartW - 65;
        const gh = chartH - 75;

        ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(gx, gy - gh);
        ctx.lineTo(gx, gy);
        ctx.lineTo(gx + gw, gy);
        ctx.stroke();

        // Nhãn trục
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.font = '10px monospace';
        ctx.textAlign = 'right';
        ctx.fillText('pH 14', gx - 6, gy - gh + 5);
        ctx.fillText('pH 7', gx - 6, gy - gh / 2 + 4);
        ctx.fillText('pH 0', gx - 6, gy + 3);

        ctx.textAlign = 'center';
        ctx.fillText('V(NaOH) mL', gx + gw / 2, gy + 22);
        ctx.fillText('0', gx, gy + 14);
        ctx.fillText('25', gx + gw / 2, gy + 14);
        ctx.fillText('50', gx + gw, gy + 14);

        // Đường chuẩn pH = 7 nét đứt
        ctx.strokeStyle = '#10b98166';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(gx, gy - gh / 2);
        ctx.lineTo(gx + gw, gy - gh / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Vẽ đường cong chuẩn độ dạng chữ S
        if (metrics.titrationCurve.length > 0) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          metrics.titrationCurve.forEach((pt, idx) => {
            const px = gx + (pt.vAdded / 50) * gw;
            const py = gy - (pt.ph / 14) * gh;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();
        }

        // Chấm đỏ thể hiện vị trí chuẩn độ hiện tại
        const curPx = gx + (state.buretBaseVolumeMl / 50) * gw;
        const curPy = gy - (metrics.currentPh / 14) * gh;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(curPx, curPy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Chỉ số thời gian thực bên dưới đồ thị
        ctx.fillStyle = textColor;
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`V(NaOH) đã thêm: ${state.buretBaseVolumeMl.toFixed(1)} mL`, chartX + 15, chartY + chartH + 25);
        ctx.fillText(`pH hiện tại: ${metrics.currentPh}`, chartX + 15, chartY + chartH + 45);

        if (metrics.isEquivalencePoint) {
          ctx.fillStyle = '#ec4899';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(`✨ ĐẠT ĐIỂM TƯƠNG ĐƯƠNG! (Dung dịch đổi màu hồng nhạt)`, chartX + 15, chartY + chartH + 70);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [state, metrics, currentSolution]);

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
