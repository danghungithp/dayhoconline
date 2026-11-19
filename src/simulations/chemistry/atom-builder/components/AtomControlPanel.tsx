import React from 'react';
import { 
  Plus, 
  Minus, 
  Atom, 
  Sparkles, 
  Layers, 
  Eye, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle,
  Flame,
  Droplets
} from 'lucide-react';
import { AtomBuilderState, MoleculeId } from '../types';
import { ELEMENTS, getElectronShells, checkNuclearStability } from '../data/elements';

interface AtomControlPanelProps {
  state: AtomBuilderState;
  onChange: (updater: (prev: AtomBuilderState) => AtomBuilderState) => void;
}

export const AtomControlPanel: React.FC<AtomControlPanelProps> = ({ state, onChange }) => {
  const { protons, neutrons, electrons, activeMolecule, viewMode, showOrbits, showLabels, isAnimationPaused } = state;

  const currentElement = ELEMENTS.find(e => e.atomicNumber === protons);
  const massNumber = protons + neutrons;
  const netCharge = protons - electrons;
  const isStable = checkNuclearStability(protons, neutrons);
  const shells = getElectronShells(electrons);

  const updateParticles = (type: 'protons' | 'neutrons' | 'electrons', delta: number) => {
    onChange(prev => {
      const current = prev[type];
      const maxVal = type === 'protons' ? 20 : 30;
      const next = Math.max(0, Math.min(maxVal, current + delta));
      return { ...prev, [type]: next, activeMolecule: 'atom' };
    });
  };

  const setMolecule = (mol: MoleculeId) => {
    onChange(prev => ({ ...prev, activeMolecule: mol }));
  };

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Element Chemical Identity Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Element Box like in Periodic Table */}
            <div className="w-14 h-14 rounded-xl bg-slate-950 border border-cyan-500/40 p-1 flex flex-col justify-between text-center shadow-inner">
              <div className="flex justify-between text-[9px] font-mono text-slate-400 px-0.5">
                <span>{protons}</span>
                <span>{massNumber}</span>
              </div>
              <span className="text-xl font-black text-cyan-400 leading-none">
                {currentElement ? currentElement.symbol : (protons === 0 ? 'Ø' : '?')}
              </span>
              <span className="text-[8px] text-slate-400 truncate">
                {currentElement ? currentElement.nameVi : 'Trống'}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                {currentElement ? `${currentElement.nameVi} (${currentElement.nameEn})` : 'Nguyên tử chưa xác định'}
              </h3>
              <p className="text-[11px] text-cyan-400 font-medium">
                {currentElement ? `${currentElement.category} • Chu kỳ ${currentElement.period} • Nhóm ${currentElement.group}` : 'Thêm hạt để tạo nguyên tố'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Z = {protons}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  A = {massNumber} amu
                </span>
              </div>
            </div>
          </div>

          {/* Net Charge Badge */}
          <div className="text-right">
            <span
              className={`inline-block px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${
                netCharge === 0
                  ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-400'
                  : netCharge > 0
                  ? 'bg-rose-950/70 border border-rose-500/40 text-rose-400'
                  : 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-400'
              }`}
            >
              {netCharge === 0 ? 'Trung hòa (0)' : netCharge > 0 ? `+${netCharge} (Cation)` : `${netCharge} (Anion)`}
            </span>
            <div className="mt-1.5 flex items-center justify-end gap-1 text-[11px]">
              {isStable ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Hạt nhân bền
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3 h-3" /> Kém bền (Phóng xạ)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Electron Shells summary */}
        {electrons > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Cấu hình lớp electron:</span>
            <div className="flex gap-1.5 font-mono">
              {shells.map((count, idx) => {
                const names = ['K', 'L', 'M', 'N'];
                const max = [2, 8, 8, 2];
                if (count === 0 && idx > 0 && shells[idx - 1] === 0) return null;
                return (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-bold"
                  >
                    {names[idx]}:{count}/{max[idx]}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Particle Builder Controls */}
      <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
        <h4 className="font-bold text-white text-xs flex items-center justify-between">
          <span>Lắp ráp hạt hạ nguyên tử:</span>
          <span className="text-[10px] text-slate-400 font-normal">Tối đa Z = 20 (Canxi)</span>
        </h4>

        {/* Protons Control */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-rose-900/30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold text-sm shadow">
              +
            </div>
            <div>
              <p className="font-bold text-white text-xs">Proton (p⁺)</p>
              <p className="text-[10px] text-slate-400">Điện tích +1 • Khối lượng ~1 amu</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateParticles('protons', -1)}
              disabled={protons <= 0}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-mono font-bold text-base text-rose-400">
              {protons}
            </span>
            <button
              onClick={() => updateParticles('protons', 1)}
              disabled={protons >= 20}
              className="w-7 h-7 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Neutrons Control */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-700/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-600 flex items-center justify-center text-white font-bold text-sm shadow">
              0
            </div>
            <div>
              <p className="font-bold text-white text-xs">Neutron (n⁰)</p>
              <p className="text-[10px] text-slate-400">Điện tích 0 • Khối lượng ~1 amu</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateParticles('neutrons', -1)}
              disabled={neutrons <= 0}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-mono font-bold text-base text-slate-300">
              {neutrons}
            </span>
            <button
              onClick={() => updateParticles('neutrons', 1)}
              disabled={neutrons >= 30}
              className="w-7 h-7 rounded-lg bg-slate-600 hover:bg-slate-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Electrons Control */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-cyan-900/30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow">
              -
            </div>
            <div>
              <p className="font-bold text-white text-xs">Electron (e⁻)</p>
              <p className="text-[10px] text-slate-400">Điện tích -1 • Lớp vỏ K, L, M, N</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateParticles('electrons', -1)}
              disabled={electrons <= 0}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-mono font-bold text-base text-cyan-400">
              {electrons}
            </span>
            <button
              onClick={() => updateParticles('electrons', 1)}
              disabled={electrons >= 20}
              className="w-7 h-7 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Molecule Mode Switcher (KHTN Lớp 7) */}
      <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-xs flex items-center gap-1.5">
            <Atom className="w-3.5 h-3.5 text-cyan-400" />
            Chế độ quan sát:
          </span>
          {activeMolecule !== 'atom' && (
            <button
              onClick={() => setMolecule('atom')}
              className="text-[11px] text-cyan-400 hover:underline"
            >
              Quay lại nguyên tử
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => setMolecule('atom')}
            className={`py-1.5 px-2 rounded-lg font-medium text-[11px] border transition ${
              activeMolecule === 'atom'
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Nguyên tử đơn
          </button>
          <button
            onClick={() => setMolecule('H2')}
            className={`py-1.5 px-2 rounded-lg font-medium text-[11px] border transition ${
              activeMolecule === 'H2'
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Khí H₂
          </button>
          <button
            onClick={() => setMolecule('O2')}
            className={`py-1.5 px-2 rounded-lg font-medium text-[11px] border transition ${
              activeMolecule === 'O2'
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Khí O₂
          </button>
          <button
            onClick={() => setMolecule('H2O')}
            className={`py-1.5 px-2 rounded-lg font-medium text-[11px] border transition ${
              activeMolecule === 'H2O'
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Nước (H₂O)
          </button>
          <button
            onClick={() => setMolecule('CO2')}
            className={`py-1.5 px-2 rounded-lg font-medium text-[11px] border transition ${
              activeMolecule === 'CO2'
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            CO₂
          </button>
          <button
            onClick={() => setMolecule('CH4')}
            className={`py-1.5 px-2 rounded-lg font-medium text-[11px] border transition ${
              activeMolecule === 'CH4'
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Metan (CH₄)
          </button>
        </div>
      </div>

      {/* 4. Visual Display Options */}
      <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() =>
              onChange(prev => ({ ...prev, viewMode: prev.viewMode === 'bohr' ? 'cloud' : 'bohr' }))
            }
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition ${
              viewMode === 'cloud'
                ? 'bg-indigo-950 border-indigo-500 text-indigo-300'
                : 'bg-slate-900 border-slate-700 text-slate-300'
            }`}
          >
            {viewMode === 'bohr' ? 'Mô hình Bohr' : 'Đám mây e⁻'}
          </button>

          <button
            onClick={() => onChange(prev => ({ ...prev, showOrbits: !prev.showOrbits }))}
            className={`p-1.5 rounded-lg border transition ${
              showOrbits
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title="Bật/Tắt quỹ đạo vòng tròn"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onChange(prev => ({ ...prev, showLabels: !prev.showLabels }))}
            className={`p-1.5 rounded-lg border transition ${
              showLabels
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title="Bật/Tắt nhãn thông số"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={() => onChange(prev => ({ ...prev, isAnimationPaused: !prev.isAnimationPaused }))}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:text-white text-slate-300 transition"
          title={isAnimationPaused ? 'Tiếp tục quay' : 'Tạm dừng chuyển động'}
        >
          {isAnimationPaused ? <Play className="w-3.5 h-3.5 text-green-400" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
