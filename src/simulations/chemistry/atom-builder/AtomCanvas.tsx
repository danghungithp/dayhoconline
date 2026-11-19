import React, { useEffect, useState } from 'react';
import { AtomAnalysisResult } from './physicsEngine';
import { MoleculePreset } from './elementsData';

interface AtomCanvasProps {
  mode: 'atom' | 'molecule';
  analysis: AtomAnalysisResult;
  activeMolecule: MoleculePreset | null;
  atomCounts: Record<string, number>;
}

export const AtomCanvas: React.FC<AtomCanvasProps> = ({
  mode,
  analysis,
  activeMolecule,
  atomCounts,
}) => {
  const [angleDeg, setAngleDeg] = useState(0);

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setAngleDeg((prev) => (prev + dt * 36) % 360);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (mode === 'molecule') {
    const entries = Object.entries(atomCounts).filter(([, q]) => q > 0);

    return (
      <div className="flex h-full min-h-[420px] flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 text-white shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              Mô hình ghép phân tử & liên kết hóa học
            </span>
            <h3 className="mt-1 text-base font-bold">
              {activeMolecule
                ? `${activeMolecule.formula} — ${activeMolecule.nameVi}`
                : entries.length > 0
                  ? `Tổ hợp hiện tại: ${entries.map(([s, q]) => `${s}${q > 1 ? q : ''}`).join(' + ')}`
                  : 'Chưa thêm nguyên tử nào'}
            </h3>
          </div>
          {activeMolecule && (
            <span className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
              {activeMolecule.bondType}
            </span>
          )}
        </div>

        <div className="my-2 flex flex-1 items-center justify-center">
          <svg viewBox="0 0 420 310" className="max-h-[300px] w-full max-w-[460px]">
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path
                  d="M 24 0 L 0 0 0 24"
                  fill="none"
                  stroke="rgba(148,163,184,0.12)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="420" height="310" rx="14" fill="url(#grid)" />

            {activeMolecule ? (
              <>
                {activeMolecule.bondsVisual.map((bond, i) => {
                  const a = activeMolecule.atomsVisual[bond.fromIndex];
                  const b = activeMolecule.atomsVisual[bond.toIndex];
                  if (!a || !b) return null;

                  const dx = b.x - a.x;
                  const dy = b.y - a.y;
                  const len = Math.hypot(dx, dy) || 1;
                  const nx = -dy / len;
                  const ny = dx / len;

                  const offsets =
                    bond.order === 1 ? [0] : bond.order === 2 ? [-4, 4] : [-7, 0, 7];

                  return (
                    <g key={i}>
                      {offsets.map((off, idx) => (
                        <line
                          key={idx}
                          x1={a.x + nx * off}
                          y1={a.y + ny * off}
                          x2={b.x + nx * off}
                          y2={b.y + ny * off}
                          stroke={
                            bond.sharedOrTransferred === 'transferred' ? '#f59e0b' : '#38bdf8'
                          }
                          strokeWidth={3}
                          strokeDasharray={
                            bond.sharedOrTransferred === 'transferred' ? '6,4' : undefined
                          }
                        />
                      ))}
                    </g>
                  );
                })}

                {activeMolecule.atomsVisual.map((atom, idx) => (
                  <g key={idx} transform={`translate(${atom.x}, ${atom.y})`}>
                    <circle
                      r={28}
                      fill={atom.color}
                      stroke="#f8fafc"
                      strokeWidth={2.5}
                      opacity={0.95}
                    />
                    <text
                      textAnchor="middle"
                      dy="6"
                      fill="#ffffff"
                      fontSize="16"
                      fontWeight="bold"
                    >
                      {atom.symbol}
                    </text>
                    <text
                      textAnchor="middle"
                      dy="42"
                      fill="#cbd5e1"
                      fontSize="11"
                    >
                      {atom.valenceElectrons}e lớp ngoài
                    </text>
                  </g>
                ))}
              </>
            ) : (
              <text
                x="210"
                y="155"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="13"
              >
                Chọn công thức mẫu (H2O, CO2, NH3, CH4, NaCl) hoặc thêm nguyên tử bên phải
              </text>
            )}
          </svg>
        </div>

        <p className="rounded-xl bg-slate-900/90 px-3.5 py-2.5 text-xs leading-relaxed text-slate-300">
          {activeMolecule
            ? activeMolecule.descriptionVi
            : 'Mẹo: Thử bấm chọn H2O hoặc CO2 để quan sát cách các nguyên tử liên kết với nhau.'}
        </p>
      </div>
    );
  }

  // Chế độ Nguyên tử & Ion
  const activeShells = analysis.shells.filter((s) => s.count > 0);
  const totalNucleons = Math.min(analysis.protons + analysis.neutrons, 40);

  return (
    <div className="flex h-full min-h-[420px] flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 text-white shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
            Mô hình cấu tạo nguyên tử & ion
          </span>
          <h3 className="mt-1 text-base font-bold">
            {analysis.nameVi} ({analysis.symbol}) — {analysis.ionLabel}
          </h3>
        </div>
        <span
          className={`rounded-lg px-3 py-1 text-xs font-semibold ${
            analysis.stability === 'radioactive'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          }`}
        >
          {analysis.stabilityLabel}
        </span>
      </div>

      <div className="my-2 flex flex-1 items-center justify-center">
        <svg viewBox="0 0 420 340" className="max-h-[330px] w-full max-w-[460px]">
          <circle cx="210" cy="170" r="158" fill="rgba(15, 23, 42, 0.8)" />

          {/* Các lớp vỏ electron */}
          {activeShells.map((shell, sIdx) => {
            const radius = 58 + sIdx * 28;
            const speedFactor = sIdx % 2 === 0 ? 1 : -1.25;
            const rot = angleDeg * speedFactor;

            return (
              <g key={shell.shellName}>
                <circle
                  cx="210"
                  cy="170"
                  r={radius}
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.28)"
                  strokeWidth="1.25"
                  strokeDasharray="4 4"
                />
                <text
                  x={210 + radius}
                  y="165"
                  fill="#64748b"
                  fontSize="10"
                  fontWeight="600"
                >
                  {shell.shellName}
                </text>

                {Array.from({ length: shell.count }).map((_, eIdx) => {
                  const baseTheta = (eIdx / Math.max(shell.count, 1)) * Math.PI * 2;
                  const theta = baseTheta + (rot * Math.PI) / 180;
                  const ex = 210 + radius * Math.cos(theta);
                  const ey = 170 + radius * Math.sin(theta);

                  return (
                    <g key={eIdx}>
                      <circle cx={ex} cy={ey} r={5.5} fill="#38bdf8" />
                      <text
                        x={ex}
                        y={ey + 2.5}
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="7.5"
                        fontWeight="bold"
                      >
                        -
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Hạt nhân (Proton đỏ, Neutron xám) */}
          {Array.from({ length: totalNucleons }).map((_, idx) => {
            const isProton = idx < Math.min(analysis.protons, totalNucleons);
            const goldenAngle = idx * 2.39996;
            const r = Math.min(24, 3.5 * Math.sqrt(idx + 1));
            const nx = 210 + r * Math.cos(goldenAngle);
            const ny = 170 + r * Math.sin(goldenAngle);

            return (
              <circle
                key={idx}
                cx={nx}
                cy={ny}
                r={4.8}
                fill={isProton ? '#ef4444' : '#94a3b8'}
                stroke="#0f172a"
                strokeWidth="0.7"
              />
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs text-slate-300">
        <span>Cấu hình lớp: {analysis.electronConfigText}</span>
        <span className="font-mono text-slate-400">
          p={analysis.protons} · n={analysis.neutrons} · e={analysis.electrons}
        </span>
      </div>
    </div>
  );
};
