import React from 'react';
import { IdentitiesState, IdentityType, SimulationTab } from './types';
import {
  calculateIdentityBreakdown,
  analyzeLinearFunction,
  analyzeTwoLines,
} from './algebraEngine';

interface ControlPanelProps {
  state: IdentitiesState;
  onChange: (patch: Partial<IdentitiesState>) => void;
  isDark?: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  onChange,
}) => {
  const breakdown = calculateIdentityBreakdown(
    state.identityType,
    state.paramA,
    state.paramB
  );
  const analysis1 = analyzeLinearFunction(state.slope1, state.intercept1);
  const analysis2 = analyzeLinearFunction(state.slope2, state.intercept2);
  const relation = analyzeTwoLines(
    state.slope1,
    state.intercept1,
    state.slope2,
    state.intercept2
  );

  return (
    <div className="space-y-5 text-sm">
      {/* Tab Switcher */}
      <div className="flex rounded-lg bg-slate-800/80 p-1 border border-slate-700">
        <button
          onClick={() => onChange({ activeTab: 'identities' })}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium text-xs transition-all ${
            state.activeTab === 'identities'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📐 Hằng đẳng thức
        </button>
        <button
          onClick={() => onChange({ activeTab: 'linear-func' })}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium text-xs transition-all ${
            state.activeTab === 'linear-func'
              ? 'bg-cyan-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📈 Đồ thị y = ax + b
        </button>
        <button
          onClick={() => onChange({ activeTab: 'two-lines' })}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium text-xs transition-all ${
            state.activeTab === 'two-lines'
              ? 'bg-pink-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ⚔️ Hai đường thẳng
        </button>
      </div>

      {/* Tab 1: Hằng đẳng thức */}
      {state.activeTab === 'identities' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Chọn Hằng đẳng thức:
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              <button
                onClick={() => onChange({ identityType: 'square-sum', unfoldProgress: 0 })}
                className={`text-left px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  state.identityType === 'square-sum'
                    ? 'bg-blue-900/40 border-blue-500 text-blue-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                1. (a + b)² = a² + 2ab + b²
              </button>
              <button
                onClick={() => onChange({ identityType: 'square-diff', unfoldProgress: 0 })}
                className={`text-left px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  state.identityType === 'square-diff'
                    ? 'bg-indigo-900/40 border-indigo-500 text-indigo-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                2. (a - b)² = a² - 2ab + b²
              </button>
              <button
                onClick={() => onChange({ identityType: 'diff-squares' })}
                className={`text-left px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  state.identityType === 'diff-squares'
                    ? 'bg-amber-900/40 border-amber-500 text-amber-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                3. a² - b² = (a - b)(a + b)
              </button>
            </div>
          </div>

          {/* Slider cạnh a */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Độ dài cạnh a:</span>
              <span className="font-mono font-bold text-blue-400">{state.paramA}</span>
            </div>
            <input
              type="range"
              min={3}
              max={8}
              step={1}
              value={state.paramA}
              onChange={e => {
                const newA = Number(e.target.value);
                const patch: Partial<IdentitiesState> = { paramA: newA };
                if (state.paramB >= newA) {
                  patch.paramB = newA - 1;
                }
                onChange(patch);
              }}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Slider cạnh b */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Độ dài cạnh b:</span>
              <span className="font-mono font-bold text-amber-400">{state.paramB}</span>
            </div>
            <input
              type="range"
              min={1}
              max={Math.max(1, state.paramA - 1)}
              step={1}
              value={state.paramB}
              onChange={e => onChange({ paramB: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Ghép hình chữ nhật cho a^2 - b^2 */}
          {state.identityType === 'diff-squares' && (
            <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-lg space-y-2">
              <div className="flex justify-between text-xs text-amber-200">
                <span>🔄 Ghép thành hình chữ nhật:</span>
                <span className="font-mono font-bold">{Math.round(state.unfoldProgress * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={state.unfoldProgress}
                onChange={e => onChange({ unfoldProgress: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between">
                <button
                  onClick={() => onChange({ unfoldProgress: 0 })}
                  className="text-xs px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Dạng chữ L
                </button>
                <button
                  onClick={() => onChange({ unfoldProgress: 1 })}
                  className="text-xs px-2 py-0.5 bg-amber-700 hover:bg-amber-600 text-white rounded font-medium"
                >
                  Ghép phẳng chữ nhật
                </button>
              </div>
            </div>
          )}

          {/* Toggle nhãn */}
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={state.showLabels}
              onChange={e => onChange({ showLabels: e.target.checked })}
              className="rounded accent-blue-500"
            />
            Hiện kích thước & nhãn diện tích từng phần
          </label>

          {/* Bảng phân rã diện tích */}
          <div className="p-3 bg-slate-900/70 border border-slate-700/60 rounded-lg space-y-2">
            <div className="text-xs font-semibold text-slate-300">
              📐 Phân rã diện tích các mảnh ghép:
            </div>
            <div className="space-y-1.5">
              {breakdown.components.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-sm inline-block"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-slate-300">{c.description}</span>
                  </div>
                  <span className="font-mono font-semibold text-slate-100">{c.area}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-700 flex justify-between text-xs font-bold text-sky-300">
                <span>Tổng diện tích:</span>
                <span className="font-mono">{breakdown.totalArea}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Đồ thị y = ax + b */}
      {state.activeTab === 'linear-func' && (
        <div className="space-y-4">
          <div className="p-3 bg-cyan-950/30 border border-cyan-800/50 rounded-lg">
            <div className="text-xs text-cyan-400 font-semibold mb-1">Phương trình đường thẳng d:</div>
            <div className="text-lg font-mono font-bold text-white tracking-wide">
              {analysis1.formulaText}
            </div>
          </div>

          {/* Slider hệ số góc a */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Hệ số góc (a):</span>
              <span className="font-mono font-bold text-cyan-400">{state.slope1}</span>
            </div>
            <input
              type="range"
              min={-4}
              max={4}
              step={0.5}
              value={state.slope1}
              onChange={e => onChange({ slope1: Number(e.target.value) })}
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>Nghịch biến (a &lt; 0)</span>
              <span>Nằm ngang (a = 0)</span>
              <span>Đồng biến (a &gt; 0)</span>
            </div>
          </div>

          {/* Slider tung độ gốc b */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Tung độ gốc (b):</span>
              <span className="font-mono font-bold text-emerald-400">{state.intercept1}</span>
            </div>
            <input
              type="range"
              min={-6}
              max={6}
              step={1}
              value={state.intercept1}
              onChange={e => onChange({ intercept1: Number(e.target.value) })}
              className="w-full accent-emerald-500"
            />
            <div className="text-[10px] text-slate-400 mt-0.5">
              Đường thẳng luôn đi qua điểm A(0, {state.intercept1}) trên trục tung Oy
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={state.showSlopeTriangle}
                onChange={e => onChange({ showSlopeTriangle: e.target.checked })}
                className="rounded accent-cyan-500"
              />
              Hiện tam giác hệ số góc (Δx, Δy)
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={state.showInterceptPoints}
                onChange={e => onChange({ showInterceptPoints: e.target.checked })}
                className="rounded accent-cyan-500"
              />
              Hiện các giao điểm với trục tọa độ
            </label>
          </div>

          {/* Phân tích tính chất */}
          <div className="p-3 bg-slate-900/70 border border-slate-700/60 rounded-lg space-y-1.5 text-xs">
            <div className="font-semibold text-slate-200">📊 Tính chất hình học & đại số:</div>
            <div className="text-slate-300">
              • Tính đơn điệu:{' '}
              <strong className={state.slope1 > 0 ? 'text-emerald-400' : state.slope1 < 0 ? 'text-rose-400' : 'text-slate-300'}>
                {analysis1.monotonicity === 'increasing'
                  ? 'Đồng biến trên R (dốc lên)'
                  : analysis1.monotonicity === 'decreasing'
                  ? 'Nghịch biến trên R (dốc xuống)'
                  : 'Hàm hằng (song song Ox)'}
              </strong>
            </div>
            <div className="text-slate-300">
              • Cắt trục tung Oy tại: <strong className="text-emerald-300 font-mono">(0, {state.intercept1})</strong>
            </div>
            <div className="text-slate-300">
              • Cắt trục hoành Ox tại:{' '}
              <strong className="text-rose-300 font-mono">
                {analysis1.rootX !== null ? `(${analysis1.rootX.toFixed(2)}, 0)` : 'Không cắt Ox (song song)'}
              </strong>
            </div>
            <div className="text-slate-300">
              • Góc tạo với tia Ox: <strong className="text-cyan-300 font-mono">{analysis1.angleDeg}°</strong> (tan α = a)
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Hai đường thẳng d1 & d2 */}
      {state.activeTab === 'two-lines' && (
        <div className="space-y-4">
          {/* Thông báo quan hệ */}
          <div
            className={`p-3 rounded-lg border text-xs ${
              relation.status === 'perpendicular'
                ? 'bg-emerald-950/40 border-emerald-600 text-emerald-200'
                : relation.status === 'parallel'
                ? 'bg-amber-950/40 border-amber-600 text-amber-200'
                : relation.status === 'coincident'
                ? 'bg-purple-950/40 border-purple-600 text-purple-200'
                : 'bg-blue-950/40 border-blue-600 text-blue-200'
            }`}
          >
            <div className="font-bold text-sm mb-1">{relation.statusVi}</div>
            <div className="text-slate-300">{relation.explanation}</div>
          </div>

          {/* Đường thẳng d1 */}
          <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg space-y-2">
            <div className="text-xs font-bold text-sky-400">
              (d₁): {analysis1.formulaText}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[11px] text-slate-400">a₁: {state.slope1}</span>
                <input
                  type="range"
                  min={-3}
                  max={3}
                  step={0.5}
                  value={state.slope1}
                  onChange={e => onChange({ slope1: Number(e.target.value) })}
                  className="w-full accent-sky-500"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400">b₁: {state.intercept1}</span>
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={1}
                  value={state.intercept1}
                  onChange={e => onChange({ intercept1: Number(e.target.value) })}
                  className="w-full accent-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Đường thẳng d2 */}
          <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg space-y-2">
            <div className="text-xs font-bold text-pink-400">
              (d₂): {analysis2.formulaText}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[11px] text-slate-400">a₂: {state.slope2}</span>
                <input
                  type="range"
                  min={-3}
                  max={3}
                  step={0.5}
                  value={state.slope2}
                  onChange={e => onChange({ slope2: Number(e.target.value) })}
                  className="w-full accent-pink-500"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400">b₂: {state.intercept2}</span>
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={1}
                  value={state.intercept2}
                  onChange={e => onChange({ intercept2: Number(e.target.value) })}
                  className="w-full accent-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Nút cài đặt nhanh quan hệ */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={() => onChange({ slope2: state.slope1, intercept2: state.intercept1 + 3 })}
              className="text-xs px-2.5 py-1 bg-amber-900/40 hover:bg-amber-900/60 text-amber-300 border border-amber-700 rounded-md font-medium"
            >
              Song song (a₂ = a₁)
            </button>
            <button
              onClick={() => {
                const perpSlope = state.slope1 !== 0 ? -1 / state.slope1 : 0;
                onChange({ slope2: Math.round(perpSlope * 10) / 10 });
              }}
              className="text-xs px-2.5 py-1 bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700 rounded-md font-medium"
            >
              Vuông góc (a₁·a₂ = -1)
            </button>
            <button
              onClick={() => onChange({ slope2: state.slope1, intercept2: state.intercept1 })}
              className="text-xs px-2.5 py-1 bg-purple-900/40 hover:bg-purple-900/60 text-purple-300 border border-purple-700 rounded-md font-medium"
            >
              Trùng nhau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
