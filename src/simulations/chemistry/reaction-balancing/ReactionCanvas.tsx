import React, { useRef, useEffect } from 'react';
import { ReactionDefinition } from './types';
import { analyzeBalancing } from './reactionsEngine';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ReactionCanvasProps {
  reaction: ReactionDefinition;
  coeffs: number[];
  showAtomCounts: boolean;
  showMassBalance: boolean;
  isDark: boolean;
}

export const ReactionCanvas: React.FC<ReactionCanvasProps> = ({
  reaction,
  coeffs,
  showAtomCounts,
  showMassBalance,
  isDark,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analysis = analyzeBalancing(reaction, coeffs);

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

    // ================= 1. CÁN CÂN KHỐI LƯỢNG (BALANCE SCALE) =================
    const scaleCx = width / 2;
    const scaleBaseY = height * 0.72;
    const armLen = 160;

    // Góc nghiêng cán cân tỉ lệ với độ chênh lệch khối lượng (tối đa ±12 độ)
    const massDiff = analysis.rightMass - analysis.leftMass;
    const tiltRad = Math.max(-0.2, Math.min(0.2, (massDiff / Math.max(10, analysis.leftMass)) * 0.3));

    ctx.save();
    // Chân đế cán cân
    ctx.beginPath();
    ctx.moveTo(scaleCx, scaleBaseY);
    ctx.lineTo(scaleCx - 25, scaleBaseY + 60);
    ctx.lineTo(scaleCx + 25, scaleBaseY + 60);
    ctx.closePath();
    ctx.fillStyle = isDark ? '#334155' : '#94a3b8';
    ctx.fill();

    // Điểm tựa trục giữa
    ctx.beginPath();
    ctx.arc(scaleCx, scaleBaseY, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    // Thanh đòn cán cân nghiêng góc tiltRad
    ctx.translate(scaleCx, scaleBaseY);
    ctx.rotate(tiltRad);

    ctx.fillStyle = isDark ? '#64748b' : '#475569';
    ctx.fillRect(-armLen, -4, armLen * 2, 8);

    // Đĩa cân trái (Vế tham gia)
    const p1x = -armLen;
    const p1y = 0;
    ctx.restore();

    ctx.save();
    // Vị trí đĩa trái sau xoay
    const leftPlateX = scaleCx - armLen * Math.cos(tiltRad);
    const leftPlateY = scaleBaseY - armLen * Math.sin(tiltRad) + 55;

    // Dây treo đĩa trái
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(scaleCx - armLen * Math.cos(tiltRad), scaleBaseY - armLen * Math.sin(tiltRad));
    ctx.lineTo(leftPlateX - 35, leftPlateY);
    ctx.moveTo(scaleCx - armLen * Math.cos(tiltRad), scaleBaseY - armLen * Math.sin(tiltRad));
    ctx.lineTo(leftPlateX + 35, leftPlateY);
    ctx.stroke();

    // Đĩa cân trái
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(leftPlateX, leftPlateY, 45, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText(`m(trước) = ${analysis.leftMass}g`, leftPlateX, leftPlateY + 30);

    // Vị trí đĩa phải (Sản phẩm)
    const rightPlateX = scaleCx + armLen * Math.cos(tiltRad);
    const rightPlateY = scaleBaseY + armLen * Math.sin(tiltRad) + 55;

    // Dây treo đĩa phải
    ctx.beginPath();
    ctx.moveTo(scaleCx + armLen * Math.cos(tiltRad), scaleBaseY + armLen * Math.sin(tiltRad));
    ctx.lineTo(rightPlateX - 35, rightPlateY);
    ctx.moveTo(scaleCx + armLen * Math.cos(tiltRad), scaleBaseY + armLen * Math.sin(tiltRad));
    ctx.lineTo(rightPlateX + 35, rightPlateY);
    ctx.stroke();

    // Đĩa cân phải
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.ellipse(rightPlateX, rightPlateY, 45, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.fillText(`m(sau) = ${analysis.rightMass}g`, rightPlateX, rightPlateY + 30);
    ctx.restore();

    // ================= 2. HIỂN THỊ PHƯƠNG TRÌNH HÓA HỌC =================
    const eqY = height * 0.18;
    ctx.save();
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'center';

    let leftText = reaction.reactants
      .map((r, i) => `${coeffs[i]} ${r.formula}`)
      .join('  +  ');

    const numReactants = reaction.reactants.length;
    let rightText = reaction.products
      .map((p, i) => `${coeffs[numReactants + i]} ${p.formula}`)
      .join('  +  ');

    const fullEquation = `${leftText}   ➔   ${rightText}`;
    ctx.fillStyle = analysis.isBalanced ? '#10b981' : isDark ? '#ffffff' : '#0f172a';
    ctx.fillText(fullEquation, width / 2, eqY);

    // Trạng thái cân bằng
    ctx.font = 'bold 14px system-ui';
    ctx.fillStyle = analysis.isBalanced ? '#10b981' : '#f59e0b';
    ctx.fillText(
      analysis.isBalanced
        ? '✅ PHƯƠNG TRÌNH ĐÃ CÂN BẰNG — KHỐI LƯỢNG BẢO TOÀN TUYỆT ĐỐI'
        : '⚠️ PHƯƠNG TRÌNH CHƯA CÂN BẰNG (Hãy điều chỉnh hệ số ở bảng điều khiển)',
      width / 2,
      eqY + 32
    );
    ctx.restore();

    // ================= 3. BẢNG ĐẾM NGUYÊN TỬ TỪNG BÊN =================
    if (showAtomCounts) {
      const startAtomsY = height * 0.32;
      const elements = Object.keys(analysis.atomStatus);

      ctx.save();
      elements.forEach((el, idx) => {
        const itemY = startAtomsY + idx * 28;
        const isOk = analysis.atomStatus[el];

        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';

        // Bên trái
        ctx.fillStyle = isOk ? '#38bdf8' : '#ef4444';
        ctx.fillText(`${analysis.leftAtoms[el] || 0} nguyên tử ${el}`, scaleCx - 140, itemY);

        // Biểu tượng so sánh
        ctx.fillStyle = isOk ? '#10b981' : '#94a3b8';
        ctx.fillText(isOk ? '===' : '!=', scaleCx, itemY);

        // Bên phải
        ctx.fillStyle = isOk ? '#10b981' : '#ef4444';
        ctx.fillText(`${analysis.rightAtoms[el] || 0} nguyên tử ${el}`, scaleCx + 140, itemY);
      });
      ctx.restore();
    }
  }, [reaction, coeffs, showAtomCounts, showMassBalance, isDark, analysis]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 select-none">
      <canvas
        ref={canvasRef}
        width={760}
        height={500}
        className="w-full h-full max-h-[520px] rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800"
      />
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
        <span>⚖️ Định luật bảo toàn khối lượng: Tổng m(chất tham gia) = Tổng m(sản phẩm)</span>
      </div>
    </div>
  );
};
