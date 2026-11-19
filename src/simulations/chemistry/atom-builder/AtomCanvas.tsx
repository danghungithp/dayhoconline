import React, { useRef, useEffect } from 'react';
import { CalculatedAtomOutputs } from './physicsEngine';
import { MOLECULE_SAMPLES, MoleculeSample } from './elementsData';

interface AtomCanvasProps {
  protons: number;
  neutrons: number;
  electrons: number;
  outputs: CalculatedAtomOutputs;
  mode: 'atom' | 'molecule';
  selectedMoleculeId: string | null;
  onSelectMolecule: (id: string) => void;
  viewMode?: 'bohr' | 'cloud';
  isAnimationPaused?: boolean;
}

interface NucleonParticle {
  id: string;
  type: 'proton' | 'neutron';
  baseX: number;
  baseY: number;
  radius: number;
  color: string;
}

export const AtomCanvas: React.FC<AtomCanvasProps> = ({
  protons,
  neutrons,
  electrons,
  outputs,
  mode,
  selectedMoleculeId,
  onSelectMolecule,
  viewMode = 'bohr',
  isAnimationPaused = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const nucleonsRef = useRef<NucleonParticle[]>([]);

  // Re-cluster nucleons compactly when protons or neutrons change
  useEffect(() => {
    const total = protons + neutrons;
    const particles: NucleonParticle[] = [];
    let pLeft = protons;
    let nLeft = neutrons;

    const goldenAngle = 2.39996; // Golden ratio spiral distribution
    for (let i = 0; i < total; i++) {
      // Alternate protons and neutrons for realistic nuclear charge dispersal
      const wantProton = (i % 2 === 0 && pLeft > 0) || nLeft <= 0;
      const isP = wantProton && pLeft > 0;
      if (isP) pLeft--;
      else nLeft--;

      const r = Math.sqrt(i) * 9.2;
      const theta = i * goldenAngle;

      particles.push({
        id: `nucleon-${i}`,
        type: isP ? 'proton' : 'neutron',
        baseX: r * Math.cos(theta),
        baseY: r * Math.sin(theta),
        radius: 8.5,
        color: isP ? '#ef4444' : '#94a3b8',
      });
    }

    nucleonsRef.current = particles;
  }, [protons, neutrons]);

  // Main 60 FPS animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      if (!isAnimationPaused) {
        timeRef.current += 0.016;
      }
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      // 1. Draw Lab Background with dark quantum radial gradient and grid
      drawLabBackground(ctx, w, h, cx, cy);

      // 2. Render depending on Mode (Atom vs Molecule)
      if (mode === 'atom') {
        renderAtomMode(ctx, cx, cy, t);
      } else {
        const mol = MOLECULE_SAMPLES[selectedMoleculeId || 'H2O'] || MOLECULE_SAMPLES.H2O;
        renderMoleculeMode(ctx, cx, cy, mol, t);
      }

      if (isRunning) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        ctx.scale(dpr, dpr);
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
  }, [protons, neutrons, electrons, outputs, mode, selectedMoleculeId, viewMode, isAnimationPaused]);

  // Background Grid and Vignette
  const drawLabBackground = (ctx: CanvasRenderingContext2D, w: number, h: number, cx: number, cy: number) => {
    ctx.save();
    // Grid lines
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
    ctx.lineWidth = 1;
    const gridSize = 42;
    for (let x = cx % gridSize; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = cy % gridSize; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Radial focus glow
    const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, Math.max(cx, cy));
    grad.addColorStop(0, 'rgba(14, 165, 233, 0.08)');
    grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.2)');
    grad.addColorStop(1, 'rgba(2, 6, 23, 0.85)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  };

  // Atom Mode: Nucleus + K/L/M/N shells + Orbiting electrons
  const renderAtomMode = (ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number) => {
    const { electronShells, isStable } = outputs;
    const radii = [80, 135, 190, 245];
    const shellNames = ['K (n=1)', 'L (n=2)', 'M (n=3)', 'N (n=4)'];
    const maxCapacities = [2, 8, 8, 2];

    // Draw Shell Orbits
    radii.forEach((r, idx) => {
      const count = electronShells[idx];
      const maxC = maxCapacities[idx];

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = count > 0 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(51, 65, 85, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.stroke();

      // Shell Capacity Label
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillStyle = count > 0 ? 'rgba(56, 189, 248, 0.8)' : 'rgba(100, 116, 139, 0.6)';
      ctx.textAlign = 'left';
      ctx.fillText(`${shellNames[idx]}: ${count}/${maxC}e⁻`, cx + r + 8, cy + 4);
      ctx.restore();

      // Orbiting Electrons
      if (count > 0) {
        const speed = (4 - idx) * 0.55; // Inner electrons orbit faster
        for (let j = 0; j < count; j++) {
          const angle = (j / count) * Math.PI * 2 + t * speed;
          const ex = cx + r * Math.cos(angle);
          const ey = cy + r * Math.sin(angle);
          drawElectronParticle(ctx, ex, ey);
        }
      }
    });

    // Draw Nucleus
    drawNucleus(ctx, cx, cy, t, isStable);
  };

  // Draw Glowing Electron Particle (-)
  const drawElectronParticle = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.save();
    // Glowing aura
    const glow = ctx.createRadialGradient(x, y, 1, x, y, 14);
    glow.addColorStop(0, 'rgba(56, 189, 248, 0.95)');
    glow.addColorStop(0.4, 'rgba(14, 165, 233, 0.4)');
    glow.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();

    // Solid core orb
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(x, y, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // White '-' sign
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('-', x, y);
    ctx.restore();
  };

  // Draw Nucleus Particles with physical vibrations and strong force glow
  const drawNucleus = (ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number, isStable: boolean) => {
    const total = protons + neutrons;
    ctx.save();

    if (total === 0) {
      // Empty nucleus guide
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.5)';
      ctx.setLineDash([4, 4]);
      ctx.stroke();

      ctx.font = '12px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Hạt nhân trống (0 nucleon)', cx, cy);
      ctx.restore();
      return;
    }

    // Unstable nuclear vibration
    let jx = 0;
    let jy = 0;
    if (!isStable) {
      jx = (Math.sin(t * 32) + Math.cos(t * 24)) * 3.5;
      jy = (Math.cos(t * 30) + Math.sin(t * 18)) * 3.5;

      // Radiation alert glow
      const warnGlow = ctx.createRadialGradient(cx, cy, 20, cx, cy, 75);
      warnGlow.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
      warnGlow.addColorStop(0.6, 'rgba(245, 158, 11, 0.2)');
      warnGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = warnGlow;
      ctx.beginPath();
      ctx.arc(cx + jx, cy + jy, 75, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Cohesive strong nuclear force glow
      const cohesiveGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 50);
      cohesiveGlow.addColorStop(0, 'rgba(244, 63, 94, 0.3)');
      cohesiveGlow.addColorStop(1, 'rgba(244, 63, 94, 0)');
      ctx.fillStyle = cohesiveGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 50, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw individual Protons and Neutrons
    nucleonsRef.current.forEach((n, idx) => {
      const thermal = Math.sin(t * 6 + idx) * 0.8;
      const px = cx + n.baseX + jx + thermal;
      const py = cy + n.baseY + jy + thermal;

      ctx.save();
      if (n.type === 'proton') {
        // Proton (Red gradient with +)
        const pGrad = ctx.createRadialGradient(px - 2, py - 2, 1, px, py, n.radius);
        pGrad.addColorStop(0, '#f87171');
        pGrad.addColorStop(1, '#b91c1c');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(px, py, n.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('+', px, py);
      } else {
        // Neutron (Neutral gray gradient with 0)
        const nGrad = ctx.createRadialGradient(px - 2, py - 2, 1, px, py, n.radius);
        nGrad.addColorStop(0, '#cbd5e1');
        nGrad.addColorStop(1, '#475569');
        ctx.fillStyle = nGrad;
        ctx.beginPath();
        ctx.arc(px, py, n.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#f1f5f9';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('0', px, py);
      }
      ctx.restore();
    });

    // Warning Banner if unstable
    if (!isStable) {
      ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ HẠT NHÂN KHÔNG BỀN (PHÓNG XẠ)', cx, cy + 62);
    }

    ctx.restore();
  };

  // Molecule & Chemical Bonding Mode
  const renderMoleculeMode = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    mol: MoleculeSample,
    t: number
  ) => {
    ctx.save();

    switch (mol.id) {
      case 'H2': {
        const d = 85;
        drawCovalentBond(ctx, cx - d, cy, cx + d, cy, 1, '1 cặp e⁻ dùng chung (Liên kết đơn)');
        drawMoleculeAtom(ctx, cx - d, cy, 'H', 26, '#e2e8f0');
        drawMoleculeAtom(ctx, cx + d, cy, 'H', 26, '#e2e8f0');
        drawSharedElectronsPair(ctx, cx, cy, 1, t);
        break;
      }

      case 'O2': {
        const d = 100;
        drawCovalentBond(ctx, cx - d, cy, cx + d, cy, 2, '2 cặp e⁻ dùng chung (Liên kết đôi O = O)');
        drawMoleculeAtom(ctx, cx - d, cy, 'O', 38, '#38bdf8');
        drawMoleculeAtom(ctx, cx + d, cy, 'O', 38, '#38bdf8');
        drawSharedElectronsPair(ctx, cx, cy - 8, 1, t);
        drawSharedElectronsPair(ctx, cx, cy + 8, 1, t + 1.2);
        break;
      }

      case 'H2O': {
        const angle = (104.5 * Math.PI) / 180;
        const bondLen = 115;
        const h1x = cx - bondLen * Math.sin(angle / 2);
        const h1y = cy + bondLen * Math.cos(angle / 2);
        const h2x = cx + bondLen * Math.sin(angle / 2);
        const h2y = cy + bondLen * Math.cos(angle / 2);

        drawCovalentBond(ctx, cx, cy, h1x, h1y, 1, '');
        drawCovalentBond(ctx, cx, cy, h2x, h2y, 1, '');

        drawSharedElectronsPair(ctx, (cx + h1x) / 2, (cy + h1y) / 2, 1, t);
        drawSharedElectronsPair(ctx, (cx + h2x) / 2, (cy + h2y) / 2, 1, t + 1.5);

        // Central Oxygen with 2 lone pairs on top
        drawMoleculeAtom(ctx, cx, cy, 'O', 44, '#38bdf8');
        drawLonePair(ctx, cx - 18, cy - 35, t);
        drawLonePair(ctx, cx + 18, cy - 35, t + 1);

        // 2 Ligand Hydrogens
        drawMoleculeAtom(ctx, h1x, h1y, 'H', 26, '#e2e8f0');
        drawMoleculeAtom(ctx, h2x, h2y, 'H', 26, '#e2e8f0');

        // Angle arc
        drawBondAngleArc(ctx, cx, cy, 40, angle, '104.5°');
        break;
      }

      case 'CO2': {
        const d = 140;
        drawCovalentBond(ctx, cx - d, cy, cx, cy, 2, 'O = C');
        drawCovalentBond(ctx, cx, cy, cx + d, cy, 2, 'C = O');

        drawSharedElectronsPair(ctx, (cx - d + cx) / 2, cy - 8, 1, t);
        drawSharedElectronsPair(ctx, (cx - d + cx) / 2, cy + 8, 1, t + 1);
        drawSharedElectronsPair(ctx, (cx + d + cx) / 2, cy - 8, 1, t + 1.5);
        drawSharedElectronsPair(ctx, (cx + d + cx) / 2, cy + 8, 1, t + 2.5);

        drawMoleculeAtom(ctx, cx - d, cy, 'O', 38, '#38bdf8');
        drawMoleculeAtom(ctx, cx, cy, 'C', 40, '#94a3b8');
        drawMoleculeAtom(ctx, cx + d, cy, 'O', 38, '#38bdf8');

        drawBondAngleArc(ctx, cx, cy, 50, Math.PI, '180°');
        break;
      }

      case 'NH3': {
        // Trigonal Pyramidal 107°
        const r = 100;
        const hCoords = [
          { x: cx - r * 0.85, y: cy + r * 0.5 },
          { x: cx, y: cy + r * 0.85 },
          { x: cx + r * 0.85, y: cy + r * 0.5 },
        ];

        hCoords.forEach((h, i) => {
          drawCovalentBond(ctx, cx, cy, h.x, h.y, 1, '');
          drawSharedElectronsPair(ctx, (cx + h.x) / 2, (cy + h.y) / 2, 1, t + i);
          drawMoleculeAtom(ctx, h.x, h.y, 'H', 24, '#e2e8f0');
        });

        // Central Nitrogen with 1 top lone pair
        drawMoleculeAtom(ctx, cx, cy, 'N', 42, '#60a5fa');
        drawLonePair(ctx, cx, cy - 35, t);
        break;
      }

      case 'CH4': {
        // Tetrahedral 109.5° projection
        const r = 100;
        const hCoords = [
          { x: cx, y: cy - r },
          { x: cx - r * 0.9, y: cy + r * 0.45 },
          { x: cx + r * 0.9, y: cy + r * 0.45 },
          { x: cx, y: cy + r * 0.85 },
        ];

        hCoords.forEach((h, i) => {
          drawCovalentBond(ctx, cx, cy, h.x, h.y, 1, '');
          drawSharedElectronsPair(ctx, (cx + h.x) / 2, (cy + h.y) / 2, 1, t + i);
          drawMoleculeAtom(ctx, h.x, h.y, 'H', 24, '#e2e8f0');
        });

        drawMoleculeAtom(ctx, cx, cy, 'C', 40, '#94a3b8');
        break;
      }

      case 'NaCl': {
        // Ionic bond: Na+ and Cl- with electron transfer arrow
        const d = 110;
        const naX = cx - d;
        const clX = cx + d;

        // Electrostatic attraction waves
        ctx.save();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(naX + 38, cy);
        ctx.lineTo(clX - 48, cy);
        ctx.stroke();
        ctx.restore();

        // Transfer arrow for 1 electron
        drawElectronTransferArrow(ctx, naX + 30, cy - 25, clX - 40, cy - 25, t);

        // Na+ (smaller cation, losing shell M)
        drawMoleculeAtom(ctx, naX, cy, 'Na⁺', 36, '#ef4444');
        // Cl- (larger anion with complete octet 2,8,8)
        drawMoleculeAtom(ctx, clX, cy, 'Cl⁻', 48, '#22c55e');

        // Electrostatic force label
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillStyle = '#f59e0b';
        ctx.textAlign = 'center';
        ctx.fillText('Lực hút tĩnh điện: F = k·|q₁·q₂| / r²', cx, cy + 40);
        break;
      }
    }

    // Bottom Detailed Educational Molecule Banner
    drawMoleculeDetailsBanner(ctx, cx, cy + 160, mol);
    ctx.restore();
  };

  // Helper: Draw Bond Line
  const drawCovalentBond = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    order: 1 | 2 | 3,
    label: string
  ) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.lineWidth = order === 2 ? 3 : 4;

    if (order === 1) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    } else if (order === 2) {
      const dx = y2 - y1;
      const dy = -(x2 - x1);
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const ox = (dx / len) * 4.5;
      const oy = (dy / len) * 4.5;

      ctx.beginPath();
      ctx.moveTo(x1 + ox, y1 + oy);
      ctx.lineTo(x2 + ox, y2 + oy);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x1 - ox, y1 - oy);
      ctx.lineTo(x2 - ox, y2 - oy);
      ctx.stroke();
    }

    if (label) {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2 - 14;
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';
      ctx.fillText(label, mx, my);
    }
    ctx.restore();
  };

  // Helper: Shared Electron Pair
  const drawSharedElectronsPair = (ctx: CanvasRenderingContext2D, x: number, y: number, pairs: number, t: number) => {
    ctx.save();
    for (let p = 0; p < pairs; p++) {
      const offset = 6;
      [-offset, offset].forEach(dx => {
        const ex = x + dx;
        const ey = y + Math.sin(t * 5 + dx) * 2;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    ctx.restore();
  };

  // Helper: Lone Pair (Cặp electron tự do)
  const drawLonePair = (ctx: CanvasRenderingContext2D, x: number, y: number, t: number) => {
    ctx.save();
    ctx.fillStyle = '#facc15';
    [-4, 4].forEach(dx => {
      ctx.beginPath();
      ctx.arc(x + dx, y + Math.sin(t * 3 + dx) * 1.5, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  };

  // Helper: Electron Transfer Arrow (for NaCl)
  const drawElectronTransferArrow = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    t: number
  ) => {
    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.fillStyle = '#f59e0b';
    ctx.lineWidth = 2;

    // Curved trajectory
    const cx = (x1 + x2) / 2;
    const cy = y1 - 40;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cx, cy, x2, y2);
    ctx.stroke();

    // Moving electron along curve
    const progress = (t * 0.8) % 1;
    const px = (1 - progress) * (1 - progress) * x1 + 2 * (1 - progress) * progress * cx + progress * progress * x2;
    const py = (1 - progress) * (1 - progress) * y1 + 2 * (1 - progress) * progress * cy + progress * progress * y2;

    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('1e⁻ nhường/nhận', cx, cy - 6);
    ctx.restore();
  };

  // Helper: Molecule Atom Sphere
  const drawMoleculeAtom = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    sym: string,
    r: number,
    color: string
  ) => {
    ctx.save();
    const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
    grad.addColorStop(0, color);
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(r * 0.75)}px Plus Jakarta Sans, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sym, x, y);
    ctx.restore();
  };

  // Helper: Angle Arc
  const drawBondAngleArc = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    angle: number,
    label: string
  ) => {
    ctx.save();
    const start = Math.PI / 2 - angle / 2;
    const end = Math.PI / 2 + angle / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, end);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.textAlign = 'center';
    ctx.fillText(label, cx, cy + r + 13);
    ctx.restore();
  };

  // Helper: Bottom Details Banner for Current Molecule
  const drawMoleculeDetailsBanner = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    y: number,
    mol: MoleculeSample
  ) => {
    ctx.save();
    ctx.font = 'bold 16px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`${mol.formula} - ${mol.nameVi} (${mol.nameEn})`, cx, y);

    ctx.font = '12px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`Kiểu liên kết: ${mol.bondType} • Hình học: ${mol.geometry}`, cx, y + 22);

    ctx.font = '11px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`CTCT: ${mol.structuralFormula} • Ứng dụng: ${mol.realWorldApplication}`, cx, y + 42);
    ctx.restore();
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
