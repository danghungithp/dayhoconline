import React from 'react';
import { IntegersFractionsState, Math6Mode } from './types';
import { calculateIntegers, calculateFraction } from './math6Engine';
import { ArrowLeftRight, PieChart, Plus, Minus, Sliders } from 'lucide-react';

interface ControlPanelProps {
  state: IntegersFractionsState;
  onChange: (patch: Partial<IntegersFractionsState>) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange }) => {
  const intCalc = calculateIntegers(state.firstNum, state.operation, state.secondNum);
  const fracCalc = calculateFraction(state.numerator, state.denominator);

  return (
    <div className="flex flex-col gap-4 p-4 text-sm select-none">
      {/* Tab Switcher */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium text-xs">
        <button
          onClick={() => onChange({ mode: 'integers' })}
          className={`py-2 px-1 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 ${
            state.mode === 'integers'
              ? 'bg-white dark:bg-slate-700 text-sky-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Số nguyên trên trục số</span>
        </button>
        <button
          onClick={() => onChange({ mode: 'fractions' })}
          className={`py-2 px-1 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 ${
            state.mode === 'fractions'
              ? 'bg-white dark:bg-slate-700 text-indigo-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>Phân số trực quan</span>
        </button>
      </div>

      {state.mode === 'integers' ? (
        /* ================= TAB SỐ NGUYÊN ================= */
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Số thứ nhất (Điểm bắt đầu):
              </span>
              <span className="font-mono text-sm font-bold text-sky-500">
                {state.firstNum}
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={state.firstNum}
              onChange={e => onChange({ firstNum: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          {/* Phép tính (+ hoặc -) */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Phép toán:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChange({ operation: '+' })}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                  state.operation === '+'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Phép cộng (+)</span>
              </button>
              <button
                onClick={() => onChange({ operation: '-' })}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                  state.operation === '-'
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Minus className="w-4 h-4" />
                <span>Phép trừ (-)</span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Số thứ hai (Bước nhảy):
              </span>
              <span className="font-mono text-sm font-bold text-indigo-500">
                {state.secondNum < 0 ? `(${state.secondNum})` : state.secondNum}
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={state.secondNum}
              onChange={e => onChange({ secondNum: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Hộp quy tắc toán học */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              Quy tắc dấu ngoặc lớp 6:
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              - Cộng với số âm: <code>a + (-b) = a - b</code> (nhảy lùi về phía bên trái).
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              - Trừ đi số âm: <code>a - (-b) = a + b</code> (hai dấu trừ biến thành dấu cộng).
            </p>
          </div>
        </div>
      ) : (
        /* ================= TAB PHÂN SỐ ================= */
        <div className="flex flex-col gap-4">
          {/* Kiểu hiển thị đĩa tròn hoặc thanh */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Mô hình trực quan:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChange({ displayModel: 'circle' })}
                className={`py-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                  state.displayModel === 'circle'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                🍕 Đĩa tròn (Pizza)
              </button>
              <button
                onClick={() => onChange({ displayModel: 'bar' })}
                className={`py-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                  state.displayModel === 'bar'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                📊 Thanh chữ nhật (Bar)
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tử số (Số phần tô màu):
              </span>
              <span className="font-mono text-sm font-bold text-sky-500">
                {state.numerator}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={state.numerator}
              onChange={e => onChange({ numerator: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Mẫu số (Số phần chia đều):
              </span>
              <span className="font-mono text-sm font-bold text-indigo-500">
                {state.denominator}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={state.denominator}
              onChange={e => onChange({ denominator: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Thẻ phân số bằng nhau */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Phân số tối giản:</span>
              <span className="font-mono font-bold text-emerald-500">
                {fracCalc.simplifiedNumerator} / {fracCalc.simplifiedDenominator}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Giá trị thập phân:</span>
              <span className="font-mono font-bold text-sky-500">{fracCalc.decimalValue} ({fracCalc.percentage}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Phân loại:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {fracCalc.isProper ? 'Phân số nhỏ hơn 1' : 'Phân số lớn hơn hoặc bằng 1'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
