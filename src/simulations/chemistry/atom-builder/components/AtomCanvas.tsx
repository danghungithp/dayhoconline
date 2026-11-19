import React, { useRef, useEffect } from 'react';
import { AtomBuilderState, MoleculeId } from '../types';
import { ELEMENTS, getElectronShells, checkNuclearStability } from '../data/elements';

interface AtomCanvasProps {
  state: AtomBuilderState;
  onStateChange: (updater: (prev: AtomBuilderState) => AtomBuilderState) => void;
}

interface Particle {
  id: string;
  type: 'proton' | 'neutron';
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetRadius: number;
  angle: number;
}

export const AtomCanvas: React.FC<AtomCanvasProps> = ({ state, onStateChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  const { protons, neutrons, electrons, activeMolecule, viewMode, showOrbits, showLabels, isAnimationPaused } = state;

  const currentElement = ELEMENTS.find(e => e.atomicNumber === protons) || {
    atomicNumber: protons,
    symbol: protons === 0 ? '?' : `Z=${protons}`,
    nameVi: protons === 0 ? 'Chưa có nguyên tố' : 'Nguyên tố lạ',
    nameEn: 'Unknown',
    category: 'Phi kim',
    color: '#38bdf8',
  };

  const isStable = checkNuclearStability(protons, neutrons);

  // Initialize or rebalance nucleus particles
  useEffect(() => {
    const totalNucleons = protons + neutrons;
    const newParticles: Particle[] = [];

    let pCount = 0;
    let nCount = 0;

    for (let i = 0; i < totalNucleons; i++) {
      const isProton = (i % 2 === 0 && pCount < protons) || nCount >= neutrons;
      if (isProton) pCount++;
      else nCount++;

      // Spiral distribution
      const goldenAngle = 2.39996;
      const r = Math.sqrt(i) * 9;
      const theta = i * goldenAngle;

      newParticles.push({
        id: `nucleon-${i}`,
        type: isProton ? 'proton' : 'neutron',
        x: r * Math.cos(theta),
        y: r * Math.sin(theta),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        targetRadius: r,
        angle: theta,
      });
    }

    particlesRef.current = newParticles;
  }, [protons, neutrons]);

  // Main 60 FPS Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!canvas) return;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      if (!isAnimationPaused) {
        timeRef.current += 0.016;
      }
      const t = timeRef.current;

      ctx.clearRect(0, 0, width, height);

      // Deep space laboratory background grid
      drawLabGrid(ctx, width, height, cx, cy);

      if (activeMolecule === 'atom') {
        renderSingleAtom(ctx, cx, cy, t);
      } else {
        renderMolecule(ctx, cx, cy, activeMolecule, t);
      }

      if (isRunning) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    // Auto-resize canvas buffer to match bounding client rect
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth * window.devicePixelRatio;
        canvas.height = parent.clientHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [protons, neutrons, electrons, activeMolecule, viewMode, showOrbits, showLabels, isAnimationPaused, isStable]);

  // Draw Subtle Lab Grid
  const drawLabGrid = (ctx: CanvasRenderingContext2D, w: number, h: number, cx: number, cy: number) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;
    const step = 40;

    for (let x = cx % step; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = cy % step; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Radial focus gradient
    const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.max(cx, cy));
    grad.addColorStop(0, 'rgba(14, 165, 233, 0.05)');
    grad.addColorStop(0.6, 'rgba(15, 23, 42, 0)');
    grad.addColorStop(1, 'rgba(2, 6, 23, 0.4)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  };

  // Render Single Atom (Nucleus + Bohr Shells or Quantum Cloud)
  const renderSingleAtom = (ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number) => {
    const shells = getElectronShells(electrons);
    const shellRadii = [80, 135, 190, 245];
    const shellNames = ['K (n=1)', 'L (n=2)', 'M (n=3)', 'N (n=4)'];

    // 1. Draw Orbits or Cloud
    if (viewMode === 'bohr') {
      shells.forEach((count, i) => {
        const r = shellRadii[i];
        if (!r) return;

        // Draw orbital circle
        if (showOrbits) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = count > 0 ? 'rgba(56, 189, 248, 0.35)' : 'rgba(51, 65, 85, 0.2)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();

          // Shell label
          if (showLabels && count > 0) {
            ctx.font = '10px JetBrains Mono, monospace';
            ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
            ctx.textAlign = 'left';
            ctx.fillText(`${shellNames[i]}: ${count}e⁻`, cx + r + 6, cy + 3);
          }
          ctx.restore();
        }

        // Draw Orbiting Electrons
        if (count > 0) {
          const speedMultiplier = (4 - i) * 0.6; // Inner shells orbit faster
          for (let j = 0; j < count; j++) {
            const baseAngle = (j / count) * Math.PI * 2;
            const currentAngle = baseAngle + t * speedMultiplier;
            const ex = cx + r * Math.cos(currentAngle);
            const ey = cy + r * Math.sin(currentAngle);

            drawElectron(ctx, ex, ey, t);
          }
        }
      });
    } else {
      // Quantum Electron Probability Cloud
      drawQuantumCloud(ctx, cx, cy, electrons, t);
    }

    // 2. Draw Nucleus
    drawNucleus(ctx, cx, cy, t);
  };

  // Draw glowing electron particle
  const drawElectron = (ctx: CanvasRenderingContext2D, x: number, y: number, t: number) => {
    ctx.save();
    // Glowing halo
    const glow = ctx.createRadialGradient(x, y, 1, x, y, 12);
    glow.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
    glow.addColorStop(0.4, 'rgba(14, 165, 233, 0.4)');
    glow.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Solid core
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Minus sign
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('-', x, y);

    ctx.restore();
  };

  // Draw Nucleus Cluster
  const drawNucleus = (ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number) => {
    const total = protons + neutrons;
    ctx.save();

    if (total === 0) {
      // Empty placeholder
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.5)';
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.font = '12px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Hạt nhân trống', cx, cy);
      ctx.restore();
      return;
    }

    // Unstable Nucleus Shaking Jitter
    let jitterX = 0;
    let jitterY = 0;
    if (!isStable) {
      jitterX = (Math.sin(t * 30) + Math.cos(t * 22)) * 3;
      jitterY = (Math.cos(t * 28) + Math.sin(t * 19)) * 3;

      // Unstable Warning Glow
      const warnGlow = ctx.createRadialGradient(cx, cy, 20, cx, cy, 65);
      warnGlow.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
      warnGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = warnGlow;
      ctx.beginPath();
      ctx.arc(cx + jitterX, cy + jitterY, 65, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Stable cohesive strong nuclear force glow
      const nucleusGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 45);
      nucleusGlow.addColorStop(0, 'rgba(244, 63, 94, 0.25)');
      nucleusGlow.addColorStop(1, 'rgba(244, 63, 94, 0)');
      ctx.fillStyle = nucleusGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 45, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render individual nucleons (Protons & Neutrons)
    particlesRef.current.forEach((p, idx) => {
      const thermalShake = Math.sin(t * 5 + idx) * 0.8;
      const px = cx + p.x + jitterX + thermalShake;
      const py = cy + p.y + jitterY + thermalShake;

      ctx.save();
      if (p.type === 'proton') {
        // Proton (Red gradient with +)
        const pGrad = ctx.createRadialGradient(px - 2, py - 2, 1, px, py, 9);
        pGrad.addColorStop(0, '#f87171');
        pGrad.addColorStop(1, '#b91c1c');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(px, py, 8.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('+', px, py);
      } else {
        // Neutron (Neutral slate gradient with 0)
        const nGrad = ctx.createRadialGradient(px - 2, py - 2, 1, px, py, 9);
        nGrad.addColorStop(0, '#94a3b8');
        nGrad.addColorStop(1, '#475569');
        ctx.fillStyle = nGrad;
        ctx.beginPath();
        ctx.arc(px, py, 8.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('0', px, py);
      }
      ctx.restore();
    });

    // Stability warning text
    if (!isStable && showLabels) {
      ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ Hạt nhân phóng xạ (Không bền)', cx, cy + 60);
    }

    ctx.restore();
  };

  // Draw Quantum Electron Cloud
  const drawQuantumCloud = (ctx: CanvasRenderingContext2D, cx: number, cy: number, totalE: number, t: number) => {
    ctx.save();
    const count = Math.min(totalE * 80, 1200);

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const r = -Math.log(u) * 60 + 20; // Exponential distribution
      const theta = Math.random() * Math.PI * 2 + t * 0.2;
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  // Render Molecule Mode (H2, O2, H2O, CO2, CH4)
  const renderMolecule = (ctx: CanvasRenderingContext2D, cx: number, cy: number, mol: MoleculeId, t: number) => {
    ctx.save();

    if (mol === 'H2') {
      // H2 Molecule (Single covalent bond H-H)
      const d = 80;
      drawBond(ctx, cx - d, cy, cx + d, cy, 'Đơn (1 cặp e⁻ dùng chung)');
      drawMoleculeAtom(ctx, cx - d, cy, 'H', 24, '#e2e8f0');
      drawMoleculeAtom(ctx, cx + d, cy, 'H', 24, '#e2e8f0');
      drawSharedElectrons(ctx, cx, cy, 2, t);

      drawMoleculeInfo(ctx, cx, cy + 140, 'Khí Hiđro (H₂)', 'Đơn chất • Liên kết cộng hóa trị không cực', 'H - H');
    } else if (mol === 'O2') {
      // O2 Molecule (Double covalent bond O=O)
      const d = 95;
      drawBond(ctx, cx - d, cy - 8, cx + d, cy - 8, '');
      drawBond(ctx, cx - d, cy + 8, cx + d, cy + 8, 'Đôi (2 cặp e⁻ dùng chung)');
      drawMoleculeAtom(ctx, cx - d, cy, 'O', 36, '#38bdf8');
      drawMoleculeAtom(ctx, cx + d, cy, 'O', 36, '#38bdf8');
      drawSharedElectrons(ctx, cx, cy - 8, 2, t);
      drawSharedElectrons(ctx, cx, cy + 8, 2, t + 1);

      drawMoleculeInfo(ctx, cx, cy + 140, 'Khí Oxi (O₂)', 'Đơn chất • Liên kết cộng hóa trị không cực (O = O)', 'O = O');
    } else if (mol === 'H2O') {
      // H2O Molecule (Bent shape 104.5°)
      const angle = (104.5 * Math.PI) / 180;
      const bondLen = 110;
      const h1x = cx - bondLen * Math.sin(angle / 2);
      const h1y = cy + bondLen * Math.cos(angle / 2);
      const h2x = cx + bondLen * Math.sin(angle / 2);
      const h2y = cy + bondLen * Math.cos(angle / 2);

      drawBond(ctx, cx, cy, h1x, h1y, '');
      drawBond(ctx, cx, cy, h2x, h2y, '');

      // Shared pairs
      drawSharedElectrons(ctx, (cx + h1x) / 2, (cy + h1y) / 2, 2, t);
      drawSharedElectrons(ctx, (cx + h2x) / 2, (cy + h2y) / 2, 2, t + 1.5);

      // Central Oxygen
      drawMoleculeAtom(ctx, cx, cy, 'O', 42, '#38bdf8');
      // 2 Hydrogens
      drawMoleculeAtom(ctx, h1x, h1y, 'H', 24, '#e2e8f0');
      drawMoleculeAtom(ctx, h2x, h2y, 'H', 24, '#e2e8f0');

      // Bond angle arc
      drawAngleArc(ctx, cx, cy, 38, angle);

      drawMoleculeInfo(
        ctx,
        cx,
        cy + 170,
        'Nước (H₂O)',
        'Hợp chất • Góc liên kết 104.5° • Phân cực mạnh',
        'H - O - H'
      );
    } else if (mol === 'CO2') {
      // CO2 Molecule (Linear 180° O=C=O)
      const d = 130;
      // Double bonds
      drawBond(ctx, cx - d, cy - 7, cx, cy - 7, '');
      drawBond(ctx, cx - d, cy + 7, cx, cy + 7, '');
      drawBond(ctx, cx, cy - 7, cx + d, cy - 7, '');
      drawBond(ctx, cx, cy + 7, cx + d, cy + 7, '');

      drawMoleculeAtom(ctx, cx - d, cy, 'O', 36, '#38bdf8');
      drawMoleculeAtom(ctx, cx, cy, 'C', 38, '#94a3b8');
      drawMoleculeAtom(ctx, cx + d, cy, 'O', 36, '#38bdf8');

      drawMoleculeInfo(
        ctx,
        cx,
        cy + 140,
        'Cacbon Đioxit (CO₂)',
        'Hợp chất • Dạng thẳng 180° • Không phân cực tổng thể',
        'O = C = O'
      );
    } else if (mol === 'CH4') {
      // CH4 Methane (Tetrahedral projection 109.5°)
      const len = 95;
      const hCoords = [
        { x: cx, y: cy - len, label: 'H' },
        { x: cx - len * 0.9, y: cy + len * 0.5, label: 'H' },
        { x: cx + len * 0.9, y: cy + len * 0.5, label: 'H' },
        { x: cx, y: cy + len * 0.8, label: 'H' },
      ];

      hCoords.forEach(h => {
        drawBond(ctx, cx, cy, h.x, h.y, '');
        drawMoleculeAtom(ctx, h.x, h.y, 'H', 22, '#e2e8f0');
      });
      drawMoleculeAtom(ctx, cx, cy, 'C', 38, '#94a3b8');

      drawMoleculeInfo(
        ctx,
        cx,
        cy + 160,
        'Metan (CH₄)',
        'Hợp chất hữu cơ • Tứ diện đều 109.5°',
        'CH₄'
      );
    }

    ctx.restore();
  };

  const drawBond = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, label: string) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 4;
    ctx.stroke();

    if (label) {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2 - 12;
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';
      ctx.fillText(label, mx, my);
    }
    ctx.restore();
  };

  const drawMoleculeAtom = (ctx: CanvasRenderingContext2D, x: number, y: number, sym: string, r: number, color: string) => {
    ctx.save();
    const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
    grad.addColorStop(0, color);
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(r * 0.8)}px Plus Jakarta Sans, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sym, x, y);
    ctx.restore();
  };

  const drawSharedElectrons = (ctx: CanvasRenderingContext2D, x: number, y: number, count: number, t: number) => {
    ctx.save();
    for (let i = 0; i < count; i++) {
      const offset = (i - (count - 1) / 2) * 12;
      const ex = x + offset;
      const ey = y + Math.sin(t * 4 + i) * 3;

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  const drawAngleArc = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, angle: number) => {
    ctx.save();
    const startAngle = Math.PI / 2 - angle / 2;
    const endAngle = Math.PI / 2 + angle / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.textAlign = 'center';
    ctx.fillText('104.5°', cx, cy + r + 14);
    ctx.restore();
  };

  const drawMoleculeInfo = (ctx: CanvasRenderingContext2D, cx: number, y: number, title: string, subtitle: string, structuralFormula: string) => {
    ctx.save();
    ctx.font = 'bold 15px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.fillText(title, cx, y);

    ctx.font = '12px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(subtitle, cx, y + 20);

    ctx.font = 'bold 13px JetBrains Mono, monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`CTCT: ${structuralFormula}`, cx, y + 40);
    ctx.restore();
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full block cursor-default" />
    </div>
  );
};
