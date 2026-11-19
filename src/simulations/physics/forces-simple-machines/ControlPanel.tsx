import React from 'react';
import { ForcesMachineState, MachineMode } from './types';
import { calculateForcesAndMachines } from './physicsEngine';
import { Anchor, Scaling, Sliders, TrendingDown, Check, Zap } from 'lucide-react';

interface ControlPanelProps {
  state: ForcesMachineState;
  onChange: (patch: Partial<ForcesMachineState>) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange }) => {
  const calc = calculateForcesAndMachines(state);

  return (
    <div className="flex flex-col gap-4 p-4 text-sm select-none">
      {/* Tab Switcher */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium text-xs">
        <button
          onClick={() => onChange({ mode: 'spring' })}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            state.mode === 'spring'
              ? 'bg-white dark:bg-slate-700 text-sky-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Lò xo & Hooke
        </button>
        <button
          onClick={() => onChange({ mode: 'lever' })}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            state.mode === 'lever'
              ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Đòn bẩy
        </button>
        <button
          onClick={() => onChange({ mode: 'incline' })}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            state.mode === 'incline'
              ? 'bg-white dark:bg-slate-700 text-indigo-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Mặt phẳng nghiêng
        </button>
      </div>

      {state.mode === 'spring' && (
        /* ================= TAB LÒ XO ================= */
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Khối lượng quả nặng (m):
              </span>
              <span className="font-mono text-sm font-bold text-sky-500">
                {state.massGrams} g
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="25"
              value={state.massGrams}
              onChange={e => onChange({ massGrams: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex gap-1.5 mt-2">
              {[100, 200, 300, 500].map(g => (
                <button
                  key={g}
                  onClick={() => onChange({ massGrams: g })}
                  className="flex-1 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono hover:bg-slate-200"
                >
                  {g}g
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Độ cứng lò xo (k):
              </span>
              <span className="font-mono text-sm font-bold text-indigo-500">
                {state.springConstant} N/m
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={state.springConstant}
              onChange={e => onChange({ springConstant: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Bảng kết quả tính toán */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Trọng lượng quả nặng (P = m·g):</span>
              <span className="font-mono font-bold text-rose-500">{calc.springForceN} N</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Lực đàn hồi của lò xo (Fđh):</span>
              <span className="font-mono font-bold text-emerald-500">{calc.springForceN} N</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Độ biến dạng dãn (Δl = P/k):</span>
              <span className="font-mono font-bold text-sky-500">{calc.elongationCm} cm</span>
            </div>
          </div>
        </div>
      )}

      {state.mode === 'lever' && (
        /* ================= TAB ĐÒN BẨY ================= */
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Trọng lượng vật nâng (F₁):
              </span>
              <span className="font-mono text-sm font-bold text-rose-500">
                {state.loadForceN} N
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={state.loadForceN}
              onChange={e => onChange({ loadForceN: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Cánh tay đòn tải (d₁):
              </span>
              <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
                {state.loadArmM} m
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={state.loadArmM}
              onChange={e => onChange({ loadArmM: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Cánh tay đòn lực nâng (d₂):
              </span>
              <span className="font-mono text-sm font-bold text-emerald-500">
                {state.effortArmM} m
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={state.effortArmM}
              onChange={e => onChange({ effortArmM: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 space-y-1">
            <div className="flex justify-between">
              <span>Lực nâng cần thiết (F₂):</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{calc.requiredEffortN} N</span>
            </div>
            <div className="flex justify-between">
              <span>Hiệu quả cơ học:</span>
              <span className="font-mono font-bold">Lợi {calc.mechanicalAdvantage} lần về lực</span>
            </div>
            <p className="text-[11px] pt-1 border-t border-amber-200 dark:border-amber-700">
              💡 Quy tắc đòn bẩy: Muốn lực nâng nhỏ hơn tải trọng, điểm đặt lực phải cách điểm tựa xa hơn vật nâng (d₂ &gt; d₁).
            </p>
          </div>
        </div>
      )}

      {state.mode === 'incline' && (
        /* ================= TAB MẶT PHẲNG NGHIÊNG ================= */
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Góc dốc nghiêng (α):
              </span>
              <span className="font-mono text-sm font-bold text-indigo-500">
                {state.inclineAngleDeg}°
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="60"
              step="5"
              value={state.inclineAngleDeg}
              onChange={e => onChange({ inclineAngleDeg: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex gap-1.5 mt-2">
              {[15, 30, 45, 60].map(deg => (
                <button
                  key={deg}
                  onClick={() => onChange({ inclineAngleDeg: deg })}
                  className="flex-1 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono hover:bg-slate-200"
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Khối lượng vật (m):
              </span>
              <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
                {state.boxMassKg} kg
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={state.boxMassKg}
              onChange={e => onChange({ boxMassKg: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Trọng lực nâng thẳng đứng (P):</span>
              <span className="font-mono font-bold text-rose-500">{calc.gravityForceN} N</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Lực kéo dọc theo mặt dốc (Fkéo):</span>
              <span className="font-mono font-bold text-emerald-500">{calc.pullForceN} N</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Chiều dài dốc (l = h / sin α):</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{calc.inclineLengthM} m</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
