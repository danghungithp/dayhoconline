import React, { useRef, useEffect, useState } from 'react';
import { OrbitalsBondingState } from './types';
import {
  ELEMENTS_CONFIG,
  generateElectronBoxes,
  getOrbitalDescription,
} from './orbitalPhysicsEngine';

interface OrbitalCanvasProps {
  state: OrbitalsBondingState;
  onChange: (patch: Partial<OrbitalsBondingState>) => void;
}

export const OrbitalCanvas: React.FC<OrbitalCanvasProps> = ({ state, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animTimeRef = useRef<number>(0);

  const currentElement =
    ELEMENTS_CONFIG.find((e) => e.z === state.atomicNumberZ) || ELEMENTS_CONFIG[5]; // Default C (Z = 6)
  const orbitalDesc = getOrbitalDescription(state.selectedOrbital);

  // Xử lý kéo xoay góc nhìn 3D
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (state.viewMode !== 'orbital-3d') return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging || state.viewMode !== 'orbital-3d') return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    onChange({
      rotationAngleY: (state.rotationAngleY + dx * 0.8) % 360,
      rotationAngleX: Math.max(-80, Math.min(80, state.rotationAngleX + dy * 0.8)),
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
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;
    let animId: number;

    const render = () => {
      if (!running) return;
      animTimeRef.current += 0.02;

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

      if (state.viewMode === 'orbital-3d') {
        // =====================================================================
        // VIEW 1: ĐÁM MÂY ORBITAL NGUYÊN TỬ 3D TƯƠNG TÁC
        // =====================================================================
        const radX = (state.rotationAngleX * Math.PI) / 180;
        const radY = (state.rotationAngleY * Math.PI) / 180;

        // Hàm chiếu 3D sang 2D
        const project3D = (x: number, y: number, z: number) => {
          // Xoay quanh trục Y
          const x1 = x * Math.cos(radY) + z * Math.sin(radY);
          const z1 = -x * Math.sin(radY) + z * Math.cos(radY);
          // Xoay quanh trục X
          const y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
          return { px: cx + x1, py: cy - y2 };
        };

        // 1. Vẽ trục tọa độ Oxyz 3D
        if (state.showAxes) {
          const axisLen = 170;
          const o = project3D(0, 0, 0);
          const xEnd = project3D(axisLen, 0, 0);
          const yEnd = project3D(0, axisLen, 0);
          const zEnd = project3D(0, 0, axisLen);

          // Trục X (Đỏ)
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(o.px, o.py);
          ctx.lineTo(xEnd.px, xEnd.py);
          ctx.stroke();
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('+x', xEnd.px + 5, xEnd.py + 4);

          // Trục Y (Xanh lục)
          ctx.strokeStyle = '#10b981';
          ctx.beginPath();
          ctx.moveTo(o.px, o.py);
          ctx.lineTo(yEnd.px, yEnd.py);
          ctx.stroke();
          ctx.fillStyle = '#10b981';
          ctx.fillText('+y', yEnd.px + 5, yEnd.py + 4);

          // Trục Z (Xanh lam)
          ctx.strokeStyle = '#3b82f6';
          ctx.beginPath();
          ctx.moveTo(o.px, o.py);
          ctx.lineTo(zEnd.px, zEnd.py);
          ctx.stroke();
          ctx.fillStyle = '#3b82f6';
          ctx.fillText('+z', zEnd.px + 5, zEnd.py + 4);
        }

        // 2. Vẽ hình dạng Orbital được chọn
        const orb = state.selectedOrbital;
        const scale = 110;

        if (orb === '1s') {
          // Orbital 1s: Hình cầu đối xứng
          const r = scale * 0.7;
          const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, r);
          grad.addColorStop(0, 'rgba(56, 189, 248, 0.85)');
          grad.addColorStop(0.6, 'rgba(14, 165, 233, 0.45)');
          grad.addColorStop(1, 'rgba(2, 132, 199, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        } else if (orb === '2s') {
          // Orbital 2s: 2 lớp hình cầu có mặt nút ở giữa
          const rInner = scale * 0.35;
          const rOuter = scale * 0.85;

          // Lớp ngoài
          const gradOuter = ctx.createRadialGradient(cx, cy, rInner, cx, cy, rOuter);
          gradOuter.addColorStop(0, 'rgba(56, 189, 248, 0)');
          gradOuter.addColorStop(0.5, 'rgba(56, 189, 248, 0.45)');
          gradOuter.addColorStop(1, 'rgba(2, 132, 199, 0)');
          ctx.fillStyle = gradOuter;
          ctx.beginPath();
          ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
          ctx.fill();

          // Mặt nút cầu (Nodal surface)
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // Lớp trong
          const gradInner = ctx.createRadialGradient(cx, cy, 2, cx, cy, rInner);
          gradInner.addColorStop(0, 'rgba(56, 189, 248, 0.8)');
          gradInner.addColorStop(1, 'rgba(56, 189, 248, 0.1)');
          ctx.fillStyle = gradInner;
          ctx.fill();
        } else if (orb === '2px' || orb === '2py' || orb === '2pz') {
          // Orbital p: Hình quả tạ đôi (2 thùy đối xứng)
          const lobeLen = scale * 0.85;
          const lobeRadius = scale * 0.45;

          // Hướng vector của thùy
          const dir =
            orb === '2px' ? { x: 1, y: 0, z: 0 } : orb === '2py' ? { x: 0, y: 1, z: 0 } : { x: 0, y: 0, z: 1 };

          // Thùy dương (+ψ, màu đỏ hồng)
          const pPos = project3D(dir.x * lobeLen, dir.y * lobeLen, dir.z * lobeLen);
          const pNeg = project3D(-dir.x * lobeLen, -dir.y * lobeLen, -dir.z * lobeLen);

          // Vẽ thùy dương
          const gradPos = ctx.createRadialGradient(pPos.px, pPos.py, 5, pPos.px, pPos.py, lobeRadius);
          gradPos.addColorStop(0, 'rgba(239, 68, 68, 0.85)');
          gradPos.addColorStop(1, 'rgba(239, 68, 68, 0)');
          ctx.fillStyle = gradPos;
          ctx.beginPath();
          ctx.arc(pPos.px, pPos.py, lobeRadius, 0, Math.PI * 2);
          ctx.fill();

          // Vẽ thùy âm (-ψ, màu xanh lam)
          const gradNeg = ctx.createRadialGradient(pNeg.px, pNeg.py, 5, pNeg.px, pNeg.py, lobeRadius);
          gradNeg.addColorStop(0, 'rgba(59, 130, 246, 0.85)');
          gradNeg.addColorStop(1, 'rgba(59, 130, 246, 0)');
          ctx.fillStyle = gradNeg;
          ctx.beginPath();
          ctx.arc(pNeg.px, pNeg.py, lobeRadius, 0, Math.PI * 2);
          ctx.fill();

          // Dấu hàm sóng + và -
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('+', pPos.px, pPos.py);
          ctx.fillText('−', pNeg.px, pNeg.py);
        } else if (orb === '3d') {
          // Orbital 3d: Dạng hoa 4 cánh (d_xy)
          const dist = scale * 0.6;
          const rLobe = scale * 0.35;
          const lobes = [
            { x: dist, y: dist, z: 0, sign: '+' },
            { x: -dist, y: dist, z: 0, sign: '−' },
            { x: -dist, y: -dist, z: 0, sign: '+' },
            { x: dist, y: -dist, z: 0, sign: '−' },
          ];

          lobes.forEach((l) => {
            const p = project3D(l.x, l.y, l.z);
            const color = l.sign === '+' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(59, 130, 246, 0.8)';
            const grad = ctx.createRadialGradient(p.px, p.py, 5, p.px, p.py, rLobe);
            grad.addColorStop(0, color);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.px, p.py, rLobe, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(l.sign, p.px, p.py);
          });
        }

        // Hạt nhân nguyên tử ở tâm (Nucleus)
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();

        // 3. Khung thông tin học thuật góc trên
        ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)';
        ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.roundRect(20, 20, 320, 100, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = textColor;
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${orbitalDesc.name} (${orbitalDesc.quantumNumbers})`, 32, 42);

        ctx.font = '11px sans-serif';
        ctx.fillStyle = subTextColor;
        ctx.fillText(`Hình dạng: ${orbitalDesc.shape}`, 32, 62);
        ctx.fillText(`Số mặt nút: ${orbitalDesc.nodes} mặt nút`, 32, 80);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`Góc xoay 3D: X=${Math.round(state.rotationAngleX)}° | Y=${Math.round(state.rotationAngleY)}° (Kéo chuột xoay)`, 32, 100);
      } else if (state.viewMode === 'electron-boxes') {
        // =====================================================================
        // VIEW 2: Ô LƯỢNG TỬ & CẤU HÌNH ELECTRON THEO AUFBAU, HUND, PAULI
        // =====================================================================
        // 1. Banner nguyên tố được chọn
        ctx.fillStyle = textColor;
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(
          `${currentElement.nameVi} (${currentElement.symbol}, Z = ${currentElement.z}) — Cấu hình: ${currentElement.configStr}`,
          35,
          35
        );

        ctx.font = '11px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(
          `Chu kỳ ${currentElement.period} • Nhóm ${currentElement.group} • Số e hóa trị: ${currentElement.valenceElectrons} • Số e độc thân: ${currentElement.unpairedElectrons}`,
          35,
          55
        );

        // 2. Thang năng lượng thẳng đứng (Energy Level Axis)
        const axisX = 65;
        const axisTopY = 85;
        const axisBottomY = height - 40;

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(axisX, axisBottomY);
        ctx.lineTo(axisX, axisTopY);
        ctx.stroke();

        // Mũi tên năng lượng E tăng dần
        ctx.beginPath();
        ctx.moveTo(axisX, axisTopY);
        ctx.lineTo(axisX - 5, axisTopY + 10);
        ctx.lineTo(axisX + 5, axisTopY + 10);
        ctx.closePath();
        ctx.fillStyle = '#ef4444';
        ctx.fill();

        ctx.font = 'bold 12px monospace';
        ctx.fillText('Năng lượng (E) ↑', axisX - 35, axisTopY - 8);

        // 3. Vẽ các ô lượng tử (Orbital Boxes)
        const boxes = generateElectronBoxes(state.atomicNumberZ);
        const boxSize = 36;
        const startY = height - 60;
        const levelStep = 48;

        boxes.forEach((subshell, subIdx) => {
          const y = startY - subIdx * levelStep;
          const startX = 110 + (subIdx % 2 === 0 ? 0 : 35); // So le nhẹ

          // Tên phân lớp (1s, 2s, 2p...)
          ctx.fillStyle = textColor;
          ctx.font = 'bold 13px monospace';
          ctx.textAlign = 'right';
          ctx.fillText(subshell.subshell, startX - 12, y + boxSize / 2 + 5);

          // Vẽ từng ô vuông trong phân lớp
          for (let b = 0; b < subshell.capacity; b++) {
            const bx = startX + b * (boxSize + 4);

            ctx.fillStyle = isDark ? '#1e293b' : '#f1f5f9';
            ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1';
            ctx.lineWidth = 2;
            ctx.fillRect(bx, y, boxSize, boxSize);
            ctx.strokeRect(bx, y, boxSize, boxSize);

            // Vẽ electron spin up / spin down
            const electrons = subshell.electrons[b] || [];
            if (electrons.includes('up')) {
              // Mũi tên lên (Spin +1/2, đỏ)
              ctx.strokeStyle = '#ef4444';
              ctx.fillStyle = '#ef4444';
              ctx.lineWidth = 2.5;
              const ax = bx + (electrons.length === 2 ? 11 : boxSize / 2);
              ctx.beginPath();
              ctx.moveTo(ax, y + boxSize - 6);
              ctx.lineTo(ax, y + 8);
              ctx.stroke();
              // Ngạnh mũi tên
              ctx.beginPath();
              ctx.moveTo(ax, y + 8);
              ctx.lineTo(ax - 4, y + 14);
              ctx.stroke();
            }

            if (electrons.includes('down')) {
              // Mũi tên xuống (Spin -1/2, xanh)
              ctx.strokeStyle = '#3b82f6';
              ctx.fillStyle = '#3b82f6';
              ctx.lineWidth = 2.5;
              const ax = bx + 24;
              ctx.beginPath();
              ctx.moveTo(ax, y + 8);
              ctx.lineTo(ax, y + boxSize - 6);
              ctx.stroke();
              // Ngạnh mũi tên
              ctx.beginPath();
              ctx.moveTo(ax, y + boxSize - 6);
              ctx.lineTo(ax + 4, y + boxSize - 12);
              ctx.stroke();
            }
          }
        });

        // Chú giải quy tắc
        ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)';
        ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.roundRect(width - 250, 80, 230, 160, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = textColor;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('3 QUY TẮC CỐT LÕI:', width - 235, 105);

        ctx.font = '10px sans-serif';
        ctx.fillStyle = subTextColor;
        ctx.fillText('1. Nguyên lý vững bền (Aufbau):', width - 235, 125);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('   1s → 2s → 2p → 3s → 3p → 4s → 3d', width - 235, 140);

        ctx.fillStyle = subTextColor;
        ctx.fillText('2. Nguyên lý Pauli: Mỗi ô tối đa 2e', width - 235, 160);
        ctx.fillStyle = '#10b981';
        ctx.fillText('   có chiều tự quay (spin) đối nhau (↑↓)', width - 235, 175);

        ctx.fillStyle = subTextColor;
        ctx.fillText('3. Quy tắc Hund: Electron phân bố', width - 235, 195);
        ctx.fillStyle = '#f59e0b';
        ctx.fillText('   sao cho số e độc thân (↑) là cực đại', width - 235, 210);
      } else {
        // =====================================================================
        // VIEW 3: LIÊN KẾT HÓA HỌC (XEN PHỦ CỘNG HÓA TRỊ & LIÊN KẾT ION)
        // =====================================================================
        if (state.selectedBond === 'covalent-sigma') {
          // LIÊN KẾT CỘNG HÓA TRỊ SIGMA (σ) - Xen phủ trục s-s hoặc p-p
          ctx.fillStyle = textColor;
          ctx.font = 'bold 15px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('LIÊN KẾT CỘNG HÓA TRỊ: XEN PHỦ ĐỒNG TRỤC SIGMA (σ)', cx, 35);

          ctx.font = '12px monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(`Khoảng cách liên kết: d = ${state.internuclearDistance} pm (Phân tử H₂ / Cl₂)`, cx, 58);

          // Hai hạt nhân cách nhau d
          const dPx = (state.internuclearDistance / 100) * 110;
          const atom1X = cx - dPx / 2;
          const atom2X = cx + dPx / 2;
          const rCloud = 65;

          // Đám mây orbital nguyên tử 1
          const g1 = ctx.createRadialGradient(atom1X, cy, 5, atom1X, cy, rCloud);
          g1.addColorStop(0, 'rgba(56, 189, 248, 0.7)');
          g1.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = g1;
          ctx.beginPath();
          ctx.arc(atom1X, cy, rCloud, 0, Math.PI * 2);
          ctx.fill();

          // Đám mây orbital nguyên tử 2
          const g2 = ctx.createRadialGradient(atom2X, cy, 5, atom2X, cy, rCloud);
          g2.addColorStop(0, 'rgba(56, 189, 248, 0.7)');
          g2.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = g2;
          ctx.beginPath();
          ctx.arc(atom2X, cy, rCloud, 0, Math.PI * 2);
          ctx.fill();

          // Vùng xen phủ tập trung electron ở giữa (Bonding orbital)
          if (state.showOverlapCloud && dPx < rCloud * 1.8) {
            const overlapGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, rCloud * 0.5);
            overlapGrad.addColorStop(0, 'rgba(234, 179, 8, 0.9)'); // Vàng sáng
            overlapGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
            ctx.fillStyle = overlapGrad;
            ctx.beginPath();
            ctx.ellipse(cx, cy, (rCloud * 1.5 - dPx) * 0.8, rCloud * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Nhãn vùng xen phủ
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText('Vùng xen phủ σ (cặp e dùng chung)', cx, cy + rCloud + 25);
          }

          // Hạt nhân nguyên tử
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(atom1X, cy, 7, 0, Math.PI * 2);
          ctx.arc(atom2X, cy, 7, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.fillText('H⁺', atom1X, cy + 3);
          ctx.fillText('H⁺', atom2X, cy + 3);
        } else if (state.selectedBond === 'covalent-pi') {
          // LIÊN KẾT CỘNG HÓA TRỊ PI (π) - Xen phủ bên song song
          ctx.fillStyle = textColor;
          ctx.font = 'bold 15px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('LIÊN KẾT CỘNG HÓA TRỊ: XEN PHỦ BÊN PI (π)', cx, 35);

          ctx.font = '12px monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText('Xen phủ bên giữa 2 orbital p song song (ở trên và dưới mặt phẳng liên kết)', cx, 58);

          const dPx = 100;
          const atom1X = cx - dPx / 2;
          const atom2X = cx + dPx / 2;

          // Thùy trên (+ψ)
          drawPiLobe(ctx, atom1X, cy - 45, '#ef4444');
          drawPiLobe(ctx, atom2X, cy - 45, '#ef4444');
          // Vùng xen phủ trên
          ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
          ctx.beginPath();
          ctx.ellipse(cx, cy - 45, 30, 20, 0, 0, Math.PI * 2);
          ctx.fill();

          // Thùy dưới (-ψ)
          drawPiLobe(ctx, atom1X, cy + 45, '#3b82f6');
          drawPiLobe(ctx, atom2X, cy + 45, '#3b82f6');
          // Vùng xen phủ dưới
          ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 45, 30, 20, 0, 0, Math.PI * 2);
          ctx.fill();

          // Trục liên kết & Hạt nhân
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(atom1X - 30, cy);
          ctx.lineTo(atom2X + 30, cy);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(atom1X, cy, 6, 0, Math.PI * 2);
          ctx.arc(atom2X, cy, 6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // LIÊN KẾT ION: Na⁺ + Cl⁻ → NaCl
          ctx.fillStyle = textColor;
          ctx.font = 'bold 15px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('LIÊN KẾT ION: SỰ CHUYỂN GIAO ELECTRON & LỰC HÚT TĨNH ĐIỆN', cx, 35);

          ctx.font = '12px monospace';
          ctx.fillStyle = '#10b981';
          ctx.fillText('Na (1s² 2s² 2p⁶ 3s¹) + Cl (1s² 2s² 2p⁶ 3s² 3p⁵) → Na⁺ + Cl⁻', cx, 58);

          const naX = cx - 110;
          const clX = cx + 110;

          // Cation Na⁺ (bán kính nhỏ hơn do mất 1e lớp ngoài)
          ctx.fillStyle = 'rgba(248, 113, 113, 0.4)';
          ctx.beginPath();
          ctx.arc(naX, cy, 38, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.fillStyle = textColor;
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText('Na⁺', naX, cy - 4);
          ctx.font = '10px monospace';
          ctx.fillText('r = 102 pm', naX, cy + 16);

          // Anion Cl⁻ (bán kính lớn hơn do nhận thêm 1e)
          ctx.fillStyle = 'rgba(96, 165, 250, 0.4)';
          ctx.beginPath();
          ctx.arc(clX, cy, 62, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.fillStyle = textColor;
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText('Cl⁻', clX, cy - 4);
          ctx.font = '10px monospace';
          ctx.fillText('r = 181 pm', clX, cy + 16);

          // Mũi tên lực hút Coulomb tĩnh điện giữa 2 ion trái dấu
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(naX + 45, cy);
          ctx.lineTo(clX - 68, cy);
          ctx.stroke();

          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText('Lực hút tĩnh điện Coulomb F = k·|q₁q₂| / r²', cx, cy - 14);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
    };
  }, [state, currentElement, orbitalDesc]);

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

function drawPiLobe(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save();
  const grad = ctx.createRadialGradient(x, y, 4, x, y, 32);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
