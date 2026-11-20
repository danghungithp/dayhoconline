import React from 'react';
import { OrbitalsBondingState, OrbitalType, BondType } from './types';
import { ELEMENTS_CONFIG, getOrbitalDescription } from './orbitalPhysicsEngine';
import { Quest } from '../../../types/simulation.types';
import { Atom, Boxes, Link2, Sparkles, CheckCircle, Circle, Rotate3d, Compass } from 'lucide-react';

interface ControlPanelProps {
  state: OrbitalsBondingState;
  onChange: (patch: Partial<OrbitalsBondingState>) => void;
  quests: Quest[];
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange, quests }) => {
  const currentElement =
    ELEMENTS_CONFIG.find((e) => e.z === state.atomicNumberZ) || ELEMENTS_CONFIG[5];
  const orbitalDesc = getOrbitalDescription(state.selectedOrbital);

  return (
    <div className="flex flex-col gap-4 text-xs font-sans">
      {/* 1. Chọn chế độ nghiên cứu */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
        <button
          onClick={() => onChange({ viewMode: 'orbital-3d' })}
          className={`flex items-center justify-center gap-1 py-2 px-1.5 rounded-lg font-bold transition-all ${
            state.viewMode === 'orbital-3d'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Atom className="w-3.5 h-3.5" />
          Orbital 3D
        </button>

        <button
          onClick={() => onChange({ viewMode: 'electron-boxes' })}
          className={`flex items-center justify-center gap-1 py-2 px-1.5 rounded-lg font-bold transition-all ${
            state.viewMode === 'electron-boxes'
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          Ô lượng tử
        </button>

        <button
          onClick={() => onChange({ viewMode: 'chemical-bonding' })}
          className={`flex items-center justify-center gap-1 py-2 px-1.5 rounded-lg font-bold transition-all ${
            state.viewMode === 'chemical-bonding'
              ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          Liên kết hóa học
        </button>
      </div>

      {state.viewMode === 'orbital-3d' && (
        /* ================================================================== */
        /* CONTROLS CHO ĐÁM MÂY ORBITAL 3D                                    */
        /* ================================================================== */
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Chọn loại Orbital nguyên tử:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['1s', '2s', '2px', '2py', '2pz', '3d'] as OrbitalType[]).map((orb) => (
                <button
                  key={orb}
                  onClick={() => onChange({ selectedOrbital: orb })}
                  className={`py-1.5 rounded-lg font-bold border transition-all ${
                    state.selectedOrbital === orb
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {orb}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                Hiện hệ trục tọa độ Oxyz:
              </span>
              <input
                type="checkbox"
                checked={state.showAxes}
                onChange={(e) => onChange({ showAxes: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <button
              onClick={() => onChange({ rotationAngleX: 0, rotationAngleY: 0 })}
              className="w-full py-1.5 px-3 rounded-lg font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 flex items-center justify-center gap-1.5"
            >
              <Rotate3d className="w-3.5 h-3.5" />
              Đặt lại góc quay 3D ban đầu
            </button>
          </div>

          {/* Hộp thuyết minh học thuật */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
            <div className="text-cyan-400 font-bold">{orbitalDesc.name}</div>
            <div className="text-slate-400">Số lượng tử: {orbitalDesc.quantumNumbers}</div>
            <p className="text-slate-300 font-sans leading-relaxed pt-1">{orbitalDesc.descriptionVi}</p>
          </div>
        </div>
      )}

      {state.viewMode === 'electron-boxes' && (
        /* ================================================================== */
        /* CONTROLS CHO Ô LƯỢNG TỬ & CẤU HÌNH E                               */
        /* ================================================================== */
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Chọn nguyên tố (Số hiệu nguyên tử Z):
            </label>
            <div className="flex justify-between items-center text-slate-300 mb-1">
              <span>Số electron (Z):</span>
              <span className="font-mono font-bold text-amber-400">
                {currentElement.nameVi} (Z = {state.atomicNumberZ})
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="26"
              value={state.atomicNumberZ}
              onChange={(e) => onChange({ atomicNumberZ: parseInt(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Chọn nhanh các nguyên tố tiêu biểu */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 uppercase">Chọn nhanh nguyên tố tiêu biểu:</label>
            <div className="grid grid-cols-5 gap-1 text-[11px]">
              {[
                { z: 1, s: 'H' },
                { z: 6, s: 'C' },
                { z: 7, s: 'N' },
                { z: 8, s: 'O' },
                { z: 10, s: 'Ne' },
                { z: 11, s: 'Na' },
                { z: 15, s: 'P' },
                { z: 17, s: 'Cl' },
                { z: 24, s: 'Cr' },
                { z: 26, s: 'Fe' },
              ].map((item) => (
                <button
                  key={item.z}
                  onClick={() => onChange({ atomicNumberZ: item.z })}
                  className={`py-1 rounded font-bold border ${
                    state.atomicNumberZ === item.z
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {item.s} ({item.z})
                </button>
              ))}
            </div>
          </div>

          {/* Bảng chi tiết cấu hình */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
            <div className="text-slate-400 border-b border-slate-800 pb-1 flex justify-between font-bold">
              <span>CẤU HÌNH ELECTRON</span>
              <span className="text-indigo-400">{currentElement.symbol}</span>
            </div>
            <div className="text-amber-400 font-bold">{currentElement.configStr}</div>
            <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 pt-1">
              <div>Chu kỳ: <span className="text-white">{currentElement.period}</span></div>
              <div>Nhóm: <span className="text-white">{currentElement.group}</span></div>
              <div>e hóa trị: <span className="text-white">{currentElement.valenceElectrons}</span></div>
              <div>e độc thân (Hund): <span className="text-emerald-400 font-bold">{currentElement.unpairedElectrons}</span></div>
            </div>
          </div>
        </div>
      )}

      {state.viewMode === 'chemical-bonding' && (
        /* ================================================================== */
        /* CONTROLS CHO LIÊN KẾT HÓA HỌC                                      */
        /* ================================================================== */
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Chọn dạng liên kết hóa học:
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'covalent-sigma', name: 'Cộng hóa trị: Xen phủ trục Sigma (σ)' },
                { id: 'covalent-pi', name: 'Cộng hóa trị: Xen phủ bên Pi (π)' },
                { id: 'ionic-nacl', name: 'Liên kết Ion: Na⁺ + Cl⁻ (NaCl)' },
              ].map((bond) => (
                <button
                  key={bond.id}
                  onClick={() => onChange({ selectedBond: bond.id as BondType })}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-left border transition-all ${
                    state.selectedBond === bond.id
                      ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-md shadow-pink-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {bond.name}
                </button>
              ))}
            </div>
          </div>

          {state.selectedBond === 'covalent-sigma' && (
            <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Khoảng cách hai hạt nhân (d):</span>
                  <span className="font-mono font-bold text-pink-400">{state.internuclearDistance} pm</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="160"
                  value={state.internuclearDistance}
                  onChange={(e) => onChange({ internuclearDistance: parseInt(e.target.value) })}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-slate-300 border-t border-slate-800 pt-2">
                <span>Hiện vùng xen phủ electron:</span>
                <input
                  type="checkbox"
                  checked={state.showOverlapCloud}
                  onChange={(e) => onChange({ showOverlapCloud: e.target.checked })}
                  className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Nhiệm vụ học tập (Quests) */}
      <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Nhiệm vụ Thí nghiệm ({quests.filter((q) => q.targetCondition(state)).length}/{quests.length})</span>
        </div>
        <div className="space-y-1.5">
          {quests.map((q) => {
            const completed = q.targetCondition(state);
            return (
              <div
                key={q.id}
                className={`p-2 rounded-lg border transition-all ${
                  completed
                    ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {completed ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span>{q.title}</span>
                  </div>
                  <span className="text-amber-400 font-mono">+{q.xpReward} XP</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 pl-5">{q.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
