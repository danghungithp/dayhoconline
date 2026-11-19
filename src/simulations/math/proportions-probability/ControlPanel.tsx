import React from 'react';
import { ProportionsProbState, ProportionMode } from './types';
import { 
  getDirectProportionTable, 
  getInverseProportionTable, 
  analyzeSquareRoot, 
  analyzeProbability 
} from './proportionsSolver';
import { 
  TrendingUp, 
  TrendingDown, 
  Square, 
  PieChart, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Layers 
} from 'lucide-react';

interface ControlPanelProps {
  state: ProportionsProbState;
  onChange: (patch: Partial<ProportionsProbState>) => void;
  onSpin: (count: number) => void;
  onResetStats: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  onChange,
  onSpin,
  onResetStats,
}) => {
  const sqrtInfo = analyzeSquareRoot(state.squareArea);
  const probData = analyzeProbability(state.slices, state.stats);

  return (
    <div className="flex flex-col gap-4 p-4 text-sm select-none">
      {/* Chọn Chế độ học */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium text-xs">
        <button
          onClick={() => onChange({ mode: 'direct' })}
          className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition-all ${
            state.mode === 'direct'
              ? 'bg-white dark:bg-slate-700 text-sky-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Tỉ lệ thuận</span>
        </button>
        <button
          onClick={() => onChange({ mode: 'inverse' })}
          className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition-all ${
            state.mode === 'inverse'
              ? 'bg-white dark:bg-slate-700 text-purple-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Tỉ lệ nghịch</span>
        </button>
        <button
          onClick={() => onChange({ mode: 'sqrt' })}
          className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition-all ${
            state.mode === 'sqrt'
              ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Square className="w-3.5 h-3.5" />
          <span>Căn bậc hai</span>
        </button>
        <button
          onClick={() => onChange({ mode: 'probability' })}
          className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition-all ${
            state.mode === 'probability'
              ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>Vòng quay xác suất</span>
        </button>
      </div>

      {state.mode === 'direct' && (
        /* ================= TỈ LỆ THUẬN ================= */
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Hệ số tỉ lệ k (y = kx):
              </span>
              <span className="font-mono text-sm font-bold text-sky-500">
                k = {state.k}
              </span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.5"
              value={state.k}
              onChange={e => {
                const val = Number(e.target.value);
                onChange({ k: val === 0 ? 1 : val });
              }}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Điểm kiểm tra x:
              </span>
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">
                x = {state.testDirectX} ➔ y = {(state.k * state.testDirectX).toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="1"
              value={state.testDirectX}
              onChange={e => onChange({ testDirectX: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          {/* Bảng giá trị mẫu */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-xs">
            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 font-semibold text-slate-600 dark:text-slate-300">
              Bảng giá trị tương ứng y / x = {state.k}
            </div>
            <table className="w-full text-center">
              <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-1">x</th>
                  <th>-2</th>
                  <th>-1</th>
                  <th>1</th>
                  <th>2</th>
                  <th>3</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                <tr>
                  <td className="py-1 font-semibold text-sky-500">y</td>
                  <td>{state.k * -2}</td>
                  <td>{state.k * -1}</td>
                  <td>{state.k * 1}</td>
                  <td>{state.k * 2}</td>
                  <td>{state.k * 3}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 text-xs text-sky-700 dark:text-sky-300">
            💡 <strong>Tính chất:</strong> Tỉ số giữa hai giá trị tương ứng của chúng luôn không đổi: <code>y₁/x₁ = y₂/x₂ = k</code>.
          </div>
        </div>
      )}

      {state.mode === 'inverse' && (
        /* ================= TỈ LỆ NGHỊCH ================= */
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Hệ số tỉ lệ a (x · y = a):
              </span>
              <span className="font-mono text-sm font-bold text-purple-500">
                a = {state.a}
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="36"
              step="1"
              value={state.a}
              onChange={e => onChange({ a: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tọa độ cạnh x (Chiều dài):
              </span>
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">
                x = {state.testInverseX} ➔ y = {(state.a / state.testInverseX).toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={state.testInverseX}
              onChange={e => onChange({ testInverseX: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-xs text-purple-700 dark:text-purple-300 space-y-1">
            <p>
              💡 <strong>Tính chất:</strong> Tích của hai giá trị tương ứng của chúng luôn không đổi: <code>x₁·y₁ = x₂·y₂ = a</code>.
            </p>
            <p>
              Hình chữ nhật tạo bởi điểm M và gốc tọa độ luôn có diện tích cố định <strong>S = {state.a}</strong>.
            </p>
          </div>
        </div>
      )}

      {state.mode === 'sqrt' && (
        /* ================= CĂN BẬC HAI ================= */
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Diện tích hình vuông S:
              </span>
              <span className="font-mono text-sm font-bold text-emerald-500">
                S = {state.squareArea}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={state.squareArea}
              onChange={e => onChange({ squareArea: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Chọn nhanh số chính phương */}
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">
              Chọn nhanh số chính phương:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[4, 9, 16, 25, 36, 49, 64, 81, 100].map(sq => (
                <button
                  key={sq}
                  onClick={() => onChange({ squareArea: sq })}
                  className={`py-1 text-xs rounded-lg border font-mono transition-all ${
                    state.squareArea === sq
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {sq} (√={Math.sqrt(sq)})
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Cạnh hình vuông a:</span>
              <span className="font-mono font-bold text-emerald-500">a = {sqrtInfo.side}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Chu vi hình vuông:</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{sqrtInfo.perimeter}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Loại số:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {sqrtInfo.isPerfectSquare ? 'Số chính phương (Căn nguyên)' : 'Số vô tỉ (Căn thập phân)'}
              </span>
            </div>
          </div>
        </div>
      )}

      {state.mode === 'probability' && (
        /* ================= VÒNG QUAY XÁC SUẤT ================= */
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onSpin(1)}
              disabled={state.isSpinning}
              className="py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-md shadow-sky-500/20"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Quay 1 lần</span>
            </button>
            <button
              onClick={() => onSpin(10)}
              disabled={state.isSpinning}
              className="py-2 px-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-md shadow-indigo-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quay 10 lần</span>
            </button>
            <button
              onClick={() => onSpin(50)}
              disabled={state.isSpinning}
              className="py-2 px-3 rounded-xl bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-md shadow-purple-500/20"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Quay 50 lần</span>
            </button>
          </div>

          <button
            onClick={onResetStats}
            className="w-full py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại thống kê</span>
          </button>

          {/* Bảng so sánh tần số thực nghiệm và xác suất */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
            <div className="font-semibold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-200 dark:border-slate-700">
              Định luật số lớn (Tổng: {state.stats.totalSpins} lượt):
            </div>
            {probData.map(d => (
              <div key={d.sliceId} className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 font-medium" style={{ color: d.color }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.label}:
                </span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {d.empiricalFreq}% <span className="text-slate-400">(LT: {d.theoreticalProb}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
