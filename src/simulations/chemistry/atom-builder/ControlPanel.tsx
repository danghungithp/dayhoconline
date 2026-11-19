import React from 'react';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Atom, 
  Share2, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  Link2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { CalculatedAtomOutputs } from './physicsEngine';
import { ELEMENTS_DATA, MOLECULE_SAMPLES, MoleculeSample } from './elementsData';

interface ControlPanelProps {
  protons: number;
  neutrons: number;
  electrons: number;
  outputs: CalculatedAtomOutputs;
  mode: 'atom' | 'molecule';
  selectedMoleculeId: string | null;
  onSetProtons: (val: number) => void;
  onSetNeutrons: (val: number) => void;
  onSetElectrons: (val: number) => void;
  onReset: () => void;
  onSelectElementPreset: (z: number) => void;
  onToggleMode: (mode: 'atom' | 'molecule') => void;
  onSelectMolecule: (id: string) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  protons,
  neutrons,
  electrons,
  outputs,
  mode,
  selectedMoleculeId,
  onSetProtons,
  onSetNeutrons,
  onSetElectrons,
  onReset,
  onSelectElementPreset,
  onToggleMode,
  onSelectMolecule,
}) => {
  const {
    z,
    massNumber,
    netCharge,
    ionStatus,
    ionSymbol,
    ionDescription,
    isStable,
    nuclearStability,
    stabilityDetail,
    electronShells,
    electronShellSummary,
    subshellNotation,
    matchedElement,
  } = outputs;

  // Quick preset shortcuts for common elements
  const commonPresets = [
    { z: 1, label: '¹H (Hiđro)' },
    { z: 2, label: '⁴He (Heli)' },
    { z: 6, label: '¹²C (Cacbon)' },
    { z: 7, label: '¹⁴N (Nitơ)' },
    { z: 8, label: '¹⁶O (Oxi)' },
    { z: 11, label: '²³Na (Natri)' },
    { z: 17, label: '³⁵Cl (Clo)' },
  ];

  const currentMolecule = MOLECULE_SAMPLES[selectedMoleculeId || 'H2O'] || MOLECULE_SAMPLES.H2O;

  return (
    <div className="space-y-4 text-xs select-none">
      {/* 1. Mode Switcher Tabs */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
        <button
          onClick={() => onToggleMode('atom')}
          className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition ${
            mode === 'atom'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Atom className="w-4 h-4" />
          <span>Nguyên tử & Ion</span>
        </button>

        <button
          onClick={() => onToggleMode('molecule')}
          className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition ${
            mode === 'molecule'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>Ghép phân tử & Liên kết</span>
        </button>
      </div>

      {mode === 'atom' ? (
        <>
          {/* 2. Periodic Table Chemical Identity Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 shadow-2xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              {/* Periodic Box */}
              <div className="w-16 h-16 rounded-xl bg-slate-950 border border-cyan-500/50 p-1.5 flex flex-col justify-between text-center shrink-0 shadow-inner">
                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                  <span>Z = {z}</span>
                  <span>A = {massNumber}</span>
                </div>
                <span className="text-2xl font-black text-cyan-400 tracking-tight leading-none">
                  {matchedElement ? matchedElement.symbol : (z === 0 ? 'Ø' : '?')}
                </span>
                <span className="text-[9px] font-bold text-slate-300 truncate">
                  {matchedElement ? matchedElement.nameVi : 'Trống'}
                </span>
              </div>

              {/* Title & Category Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white truncate">
                    {matchedElement ? `${matchedElement.nameVi} (${matchedElement.nameEn})` : 'Chưa có proton'}
                  </h3>
                </div>
                <p className="text-[11px] text-cyan-400 font-medium mt-0.5">
                  {matchedElement ? `${matchedElement.category} • Chu kỳ ${matchedElement.period} • Nhóm ${matchedElement.group}` : 'Thêm hạt để tạo nguyên tố'}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">
                    Độ âm điện: {matchedElement ? matchedElement.electronegativity || 'Khí hiếm' : '--'}
                  </span>
                </div>
              </div>
            </div>

            {/* Net Charge & Ion Status Strip */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Ký hiệu hạt & ion:</span>
                <span className="text-base font-mono font-black text-white">
                  {ionSymbol}
                </span>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${
                    netCharge === 0
                      ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
                      : netCharge > 0
                      ? 'bg-rose-950/70 border border-rose-500/40 text-rose-300'
                      : 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300'
                  }`}
                >
                  {netCharge === 0 ? 'Trung hòa (q = 0)' : netCharge > 0 ? `Cation (+${netCharge})` : `Anion (${netCharge})`}
                </span>
              </div>
            </div>

            {/* Nuclear Stability Indicator */}
            <div
              className={`p-2.5 rounded-xl border flex items-start gap-2 text-[11px] ${
                isStable
                  ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
              }`}
            >
              {isStable ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
              )}
              <div className="flex-1">
                <span className="font-bold">
                  {isStable ? 'Hạt nhân bền vững' : 'Đồng vị kém bền (Phóng xạ)'}:
                </span>{' '}
                <span className="text-slate-300">{stabilityDetail}</span>
              </div>
            </div>

            {/* Electron Shell Breakdown */}
            <div className="pt-1 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>Cấu hình lớp (K, L, M, N):</span>
                <span className="font-mono font-bold text-cyan-300">{electronShellSummary}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Cấu hình phân lớp Aufbau:</span>
                <span className="font-mono text-[10px] text-slate-200">{subshellNotation}</span>
              </div>
            </div>
          </div>

          {/* 3. Particle Sliders & Counters */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">Lắp ráp hạt hạ nguyên tử:</span>
              <button
                onClick={onReset}
                title="Khôi phục trạng thái ban đầu"
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại</span>
              </button>
            </div>

            {/* Proton Controls */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-rose-900/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
                    +
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs">Proton (p⁺)</span>
                    <span className="text-[10px] text-slate-400 block">Quyết định nguyên tố (Z)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSetProtons(Math.max(0, protons - 1))}
                    disabled={protons <= 0}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center font-mono font-bold text-sm text-rose-400">
                    {protons}
                  </span>
                  <button
                    onClick={() => onSetProtons(Math.min(20, protons + 1))}
                    disabled={protons >= 20}
                    className="w-7 h-7 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="20"
                value={protons}
                onChange={e => onSetProtons(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            {/* Neutron Controls */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-600 text-white font-bold text-xs flex items-center justify-center">
                    0
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs">Neutron (n⁰)</span>
                    <span className="text-[10px] text-slate-400 block">Ổn định hạt nhân & đồng vị</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSetNeutrons(Math.max(0, neutrons - 1))}
                    disabled={neutrons <= 0}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center font-mono font-bold text-sm text-slate-300">
                    {neutrons}
                  </span>
                  <button
                    onClick={() => onSetNeutrons(Math.min(30, neutrons + 1))}
                    disabled={neutrons >= 30}
                    className="w-7 h-7 rounded-lg bg-slate-600 hover:bg-slate-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="30"
                value={neutrons}
                onChange={e => onSetNeutrons(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
              />
            </div>

            {/* Electron Controls */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-cyan-900/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">
                    -
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs">Electron (e⁻)</span>
                    <span className="text-[10px] text-slate-400 block">Quyết định tính chất hóa học & ion</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSetElectrons(Math.max(0, electrons - 1))}
                    disabled={electrons <= 0}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center font-mono font-bold text-sm text-cyan-400">
                    {electrons}
                  </span>
                  <button
                    onClick={() => onSetElectrons(Math.min(20, electrons + 1))}
                    disabled={electrons >= 20}
                    className="w-7 h-7 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="20"
                value={electrons}
                onChange={e => onSetElectrons(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          {/* 4. Quick Element Presets */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block">Chọn nhanh nguyên tố chuẩn:</span>
            <div className="flex flex-wrap gap-1.5">
              {commonPresets.map(preset => (
                <button
                  key={preset.z}
                  onClick={() => onSelectElementPreset(preset.z)}
                  className={`px-2 py-1 rounded-lg border text-[11px] font-medium transition ${
                    z === preset.z
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Molecule & Bonding Mode Panel */
        <div className="space-y-3.5 animate-fade-in">
          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 space-y-2">
            <h4 className="font-bold text-indigo-300 text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Khám phá Liên kết Hóa học (GDPT Hóa học):</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Quan sát sự hình thành **Liên kết cộng hóa trị** qua các cặp electron dùng chung (đơn, đôi, ba) và **Liên kết ion** qua lực hút tĩnh điện giữa Cation và Anion.
            </p>
          </div>

          {/* Molecule Selection Cards */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block">
              Chọn phân tử mẫu cần khảo sát ({Object.keys(MOLECULE_SAMPLES).length}):
            </span>

            <div className="grid grid-cols-1 gap-2">
              {Object.values(MOLECULE_SAMPLES).map(mol => {
                const isSelected = (selectedMoleculeId || 'H2O') === mol.id;
                return (
                  <button
                    key={mol.id}
                    onClick={() => onSelectMolecule(mol.id)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-500 shadow-md shadow-indigo-950'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white font-mono">{mol.formula}</span>
                        <span className="text-xs text-slate-300 font-semibold">{mol.nameVi}</span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          mol.bondType === 'Liên kết ion'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : mol.bondType === 'Cộng hóa trị có cực'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : 'bg-purple-950 text-purple-300 border border-purple-800'
                        }`}
                      >
                        {mol.bondType}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">
                      {mol.bondDescription}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
