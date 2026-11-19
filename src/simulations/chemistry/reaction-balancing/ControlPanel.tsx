import React from 'react';
import { ReactionBalancingState, ReactionDefinition } from './types';
import { REACTIONS_DATA, analyzeBalancing } from './reactionsEngine';
import { Scale, Plus, Minus, RotateCcw, Check, Eye } from 'lucide-react';

interface ControlPanelProps {
  state: ReactionBalancingState;
  onChange: (patch: Partial<ReactionBalancingState>) => void;
  onCoeffChange: (index: number, delta: number) => void;
  onResetCoeffs: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  onChange,
  onCoeffChange,
  onResetCoeffs,
}) => {
  const currentReaction = REACTIONS_DATA.find(r => r.id === state.reactionId) || REACTIONS_DATA[0];
  const analysis = analyzeBalancing(currentReaction, state.coeffs);

  const numReactants = currentReaction.reactants.length;

  return (
    <div className="flex flex-col gap-4 p-4 text-sm select-none">
      {/* Chọn phản ứng */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
          Chọn phương trình hóa học:
        </label>
        <select
          value={state.reactionId}
          onChange={e => {
            const r = REACTIONS_DATA.find(x => x.id === e.target.value) || REACTIONS_DATA[0];
            const defaultCoeffs = [...r.reactants.map(x => x.defaultCoeff), ...r.products.map(x => x.defaultCoeff)];
            onChange({ reactionId: r.id, coeffs: defaultCoeffs });
          }}
          className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-white"
        >
          {REACTIONS_DATA.map(r => (
            <option key={r.id} value={r.id}>
              {r.nameVi}
            </option>
          ))}
        </select>
      </div>

      {/* Điều khiển hệ số các chất tham gia */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
          Chất tham gia (Vế trái):
        </label>
        <div className="grid grid-cols-2 gap-2">
          {currentReaction.reactants.map((r, i) => (
            <div key={i} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
              <span className="font-bold text-sm text-sky-600 dark:text-sky-400">{r.formula}:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onCoeffChange(i, -1)}
                  disabled={state.coeffs[i] <= 1}
                  className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 disabled:opacity-40 flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="font-mono font-bold text-base w-5 text-center">
                  {state.coeffs[i] || 1}
                </span>
                <button
                  onClick={() => onCoeffChange(i, 1)}
                  disabled={state.coeffs[i] >= 8}
                  className="w-6 h-6 rounded-lg bg-sky-500 hover:bg-sky-600 text-white disabled:opacity-40 flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Điều khiển hệ số các sản phẩm */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
          Sản phẩm tạo thành (Vế phải):
        </label>
        <div className="grid grid-cols-2 gap-2">
          {currentReaction.products.map((p, i) => {
            const idx = numReactants + i;
            return (
              <div key={idx} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{p.formula}:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onCoeffChange(idx, -1)}
                    disabled={state.coeffs[idx] <= 1}
                    className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 disabled:opacity-40 flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-base w-5 text-center">
                    {state.coeffs[idx] || 1}
                  </span>
                  <button
                    onClick={() => onCoeffChange(idx, 1)}
                    disabled={state.coeffs[idx] >= 8}
                    className="w-6 h-6 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-40 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={onResetCoeffs}
        className="w-full py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Đặt lại các hệ số về 1</span>
      </button>

      {/* Tùy chọn hiển thị */}
      <div className="space-y-1.5 pt-1 border-t border-slate-200 dark:border-slate-800">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={state.showAtomCounts}
            onChange={e => onChange({ showAtomCounts: e.target.checked })}
            className="rounded text-sky-500 focus:ring-sky-400"
          />
          <span>Hiện bảng đếm số nguyên tử 2 vế</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={state.showMassBalance}
            onChange={e => onChange({ showMassBalance: e.target.checked })}
            className="rounded text-sky-500 focus:ring-sky-400"
          />
          <span>Hiện cán cân bảo toàn khối lượng</span>
        </label>
      </div>

      {/* Thông điệp định luật Lômônôxốp - Lavoisier */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
        <span className="font-semibold text-slate-700 dark:text-slate-300 block">
          Định luật bảo toàn khối lượng:
        </span>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          "Trong một phản ứng hóa học, tổng khối lượng của các chất sản phẩm bằng tổng khối lượng của các chất tham gia phản ứng."
        </p>
      </div>
    </div>
  );
};
