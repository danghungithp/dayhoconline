import React from 'react';
import { 
  ParabolaParams, 
  LineParams, 
  LinearEquation, 
  ParabolaAnalysis, 
  LinearSystemAnalysis,
  calculateTangent,
  calculateParabolaLineIntersection,
  formatQuadratic,
  formatLinearGeneral
} from './algebraSolver';
import { 
  Sliders, 
  Activity, 
  Compass, 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Sparkles,
  Info
} from 'lucide-react';

interface ControlPanelProps {
  activeTab: 'parabola' | 'linear-system';
  onTabChange: (tab: 'parabola' | 'linear-system') => void;
  parabola: ParabolaParams;
  onParabolaChange: (p: ParabolaParams) => void;
  line: LineParams;
  onLineChange: (l: LineParams) => void;
  showLine: boolean;
  onToggleShowLine: () => void;
  probeX: number;
  onProbeXChange: (x: number) => void;
  showTangent: boolean;
  onToggleShowTangent: () => void;
  showGrid: boolean;
  onToggleShowGrid: () => void;
  linearEq1: LinearEquation;
  onLinearEq1Change: (eq: LinearEquation) => void;
  linearEq2: LinearEquation;
  onLinearEq2Change: (eq: LinearEquation) => void;
  parabolaAnalysis: ParabolaAnalysis;
  linearAnalysis: LinearSystemAnalysis;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  activeTab,
  onTabChange,
  parabola,
  onParabolaChange,
  line,
  onLineChange,
  showLine,
  onToggleShowLine,
  probeX,
  onProbeXChange,
  showTangent,
  onToggleShowTangent,
  showGrid,
  onToggleShowGrid,
  linearEq1,
  onLinearEq1Change,
  linearEq2,
  onLinearEq2Change,
  parabolaAnalysis,
  linearAnalysis,
}) => {
  const { a, b, c } = parabola;
  const { vertex, axisOfSymmetry, delta, roots, concavity, extrema } = parabolaAnalysis;

  // Cập nhật từng hệ số Parabol (bảo đảm a != 0)
  const updateA = (newA: number) => {
    let safeA = Number(newA.toFixed(1));
    if (Math.abs(safeA) < 0.05) safeA = newA < 0 ? -0.1 : 0.1;
    onParabolaChange({ ...parabola, a: safeA });
  };

  const updateB = (newB: number) => {
    onParabolaChange({ ...parabola, b: Number(newB.toFixed(1)) });
  };

  const updateC = (newC: number) => {
    onParabolaChange({ ...parabola, c: Number(newC.toFixed(1)) });
  };

  const intersection = calculateParabolaLineIntersection(parabola, line);
  const tangent = calculateTangent(parabola, probeX);

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-200 select-none overflow-y-auto">
      {/* 1. Header Tabs: Chuyển đổi Khảo sát Parabol vs Hệ Phương Trình */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20 backdrop-blur-md">
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => onTabChange('parabola')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'parabola'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Hàm số Parabol</span>
          </button>
          <button
            onClick={() => onTabChange('linear-system')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'linear-system'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Hệ 2 Phương Trình</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* ================================================================= */}
        {/* NỘI DUNG TAB 1: PARABOL BẬC HAI                                   */}
        {/* ================================================================= */}
        {activeTab === 'parabola' ? (
          <>
            {/* Live Formula Card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/40 border border-sky-800/40 shadow-inner">
              <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block mb-1">
                Phương trình Parabol hiện tại
              </span>
              <div className="text-xl font-bold font-mono text-white tracking-wide">
                {parabolaAnalysis.equationStr}
              </div>
            </div>

            {/* Slider Điều Khiển Hệ Số a, b, c */}
            <div className="space-y-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-sky-400" />
                  Điều chỉnh hệ số (a ≠ 0)
                </span>
              </div>

              {/* Slider a */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Hệ số a:</span>
                  <span className={`font-bold ${a > 0 ? 'text-sky-400' : 'text-rose-400'}`}>
                    {a.toFixed(1)} {a > 0 ? '(quay lên)' : '(quay xuống)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="0.1"
                  value={a}
                  onChange={e => updateA(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex gap-1.5 pt-1">
                  {[1, -1, 0.5, -0.5, 2].map(presetA => (
                    <button
                      key={presetA}
                      onClick={() => updateA(presetA)}
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        a === presetA ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      a={presetA}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider b */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Hệ số b:</span>
                  <span className="font-bold text-slate-200">{b.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="0.5"
                  value={b}
                  onChange={e => updateB(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex gap-1.5 pt-1">
                  {[0, -4, 4, -2, 2].map(presetB => (
                    <button
                      key={presetB}
                      onClick={() => updateB(presetB)}
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        b === presetB ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      b={presetB}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider c */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Hệ số c (Tung độ gốc):</span>
                  <span className="font-bold text-slate-200">{c.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="0.5"
                  value={c}
                  onChange={e => updateC(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex gap-1.5 pt-1">
                  {[0, 3, 4, -3, 1].map(presetC => (
                    <button
                      key={presetC}
                      onClick={() => updateC(presetC)}
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        c === presetC ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      c={presetC}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bảng Đặc Tính Hình Học & Đại Số */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                Đặc tính toán học của Parabol
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Đỉnh Parabol I:</span>
                  <span className="text-sky-300 font-bold">
                    ({vertex.x}, {vertex.y})
                  </span>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Trục đối xứng:</span>
                  <span className="text-cyan-300 font-bold">x = {axisOfSymmetry}</span>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Biệt thức Δ:</span>
                  <span
                    className={`font-bold ${
                      delta > 0 ? 'text-emerald-400' : delta === 0 ? 'text-amber-400' : 'text-rose-400'
                    }`}
                  >
                    Δ = {delta.toFixed(2)}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Cắt trục Ox:</span>
                  <span className="font-bold text-slate-200">
                    {roots.length === 2
                      ? `2 điểm`
                      : roots.length === 1
                      ? `Tiếp xúc (1)`
                      : `Không cắt`}
                  </span>
                </div>
              </div>

              {/* Chi tiết nghiệm Ox nếu có */}
              {roots.length > 0 && (
                <div className="p-2 bg-emerald-950/40 rounded-lg border border-emerald-800/40 text-xs font-mono text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Giao điểm Ox:{' '}
                    {roots.map((r, i) => `x${i + 1} = ${r}`).join(', ')}
                  </span>
                </div>
              )}

              {/* Bảng Biến Thiên Thu Nhỏ Trực Quan */}
              <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">Bảng biến thiên:</span>
                <div className="text-xs font-mono text-slate-300 flex items-center justify-between">
                  <span>-∞</span>
                  <span className="text-sky-400 font-bold">x = {axisOfSymmetry}</span>
                  <span>+∞</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs font-mono">
                  {concavity === 'up' ? (
                    <>
                      <span className="text-slate-400">+∞</span>
                      <span className="text-amber-400 font-bold flex items-center">
                        ↘ y_min = {extrema.value} ↗
                      </span>
                      <span className="text-slate-400">+∞</span>
                    </>
                  ) : (
                    <>
                      <span className="text-slate-400">-∞</span>
                      <span className="text-rose-400 font-bold flex items-center">
                        ↗ y_max = {extrema.value} ↘
                      </span>
                      <span className="text-slate-400">-∞</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Công cụ nâng cao: Tiếp tuyến & Đường thẳng so sánh */}
            <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Công cụ khảo sát nâng cao
              </span>

              {/* Toggle Tiếp tuyến */}
              <div className="space-y-2 pt-1 border-t border-slate-800/60">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showTangent}
                      onChange={onToggleShowTangent}
                      className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                    />
                    <span>Tiếp tuyến tại P(x₀, y₀)</span>
                  </label>
                  {showTangent && (
                    <span className="text-[11px] font-mono text-emerald-400">
                      k = {tangent.slope}
                    </span>
                  )}
                </div>

                {showTangent && (
                  <div className="pl-6 space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Vị trí x₀: {probeX.toFixed(1)}</span>
                      <span>{tangent.equationStr}</span>
                    </div>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      step="0.2"
                      value={probeX}
                      onChange={e => onProbeXChange(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Toggle Đường thẳng y = mx + n */}
              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showLine}
                      onChange={onToggleShowLine}
                      className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                    />
                    <span>Đường thẳng y = mx + n</span>
                  </label>
                  {showLine && (
                    <span className="text-[11px] font-mono text-amber-400">
                      y = {line.m}x {line.n >= 0 ? `+ ${line.n}` : `- ${Math.abs(line.n)}`}
                    </span>
                  )}
                </div>

                {showLine && (
                  <div className="pl-6 space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>Hệ số m:</span>
                          <span className="text-amber-300">{line.m}</span>
                        </div>
                        <input
                          type="range"
                          min="-4"
                          max="4"
                          step="0.5"
                          value={line.m}
                          onChange={e => onLineChange({ ...line, m: parseFloat(e.target.value) })}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>Tung độ n:</span>
                          <span className="text-amber-300">{line.n}</span>
                        </div>
                        <input
                          type="range"
                          min="-6"
                          max="6"
                          step="0.5"
                          value={line.n}
                          onChange={e => onLineChange({ ...line, n: parseFloat(e.target.value) })}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                    </div>

                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono">
                      <span className="text-slate-400 block">Số điểm chung:</span>
                      <span
                        className={`font-bold ${
                          intersection.status === 'secant'
                            ? 'text-rose-400'
                            : intersection.status === 'tangent'
                            ? 'text-amber-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {intersection.status === 'secant'
                          ? `Cắt nhau tại 2 điểm (${intersection.points.map(p => `(${p.x}, ${p.y})`).join(', ')})`
                          : intersection.status === 'tangent'
                          ? `Tiếp xúc tại 1 điểm (${intersection.points[0]?.x}, ${intersection.points[0]?.y})`
                          : 'Không có điểm chung (Δ < 0)'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* ================================================================= */
          /* NỘI DUNG TAB 2: HỆ PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN                   */
          /* ================================================================= */
          <>
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/40 border border-emerald-800/40 shadow-inner">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                Hệ hai phương trình bậc nhất hai ẩn
              </span>
              <div className="space-y-0.5 font-mono text-sm font-bold text-white">
                <div>(1) {formatLinearGeneral(linearEq1.a, linearEq1.b, linearEq1.c)}</div>
                <div>(2) {formatLinearGeneral(linearEq2.a, linearEq2.b, linearEq2.c)}</div>
              </div>
            </div>

            {/* Điều khiển phương trình 1: a1*x + b1*y = c1 */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Phương trình d₁: a₁x + b₁y = c₁
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">a₁ = {linearEq1.a}</span>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="1"
                    value={linearEq1.a}
                    onChange={e => onLinearEq1Change({ ...linearEq1, a: parseInt(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">b₁ = {linearEq1.b}</span>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="1"
                    value={linearEq1.b}
                    onChange={e => onLinearEq1Change({ ...linearEq1, b: parseInt(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">c₁ = {linearEq1.c}</span>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="1"
                    value={linearEq1.c}
                    onChange={e => onLinearEq1Change({ ...linearEq1, c: parseInt(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Điều khiển phương trình 2: a2*x + b2*y = c2 */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Phương trình d₂: a₂x + b₂y = c₂
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">a₂ = {linearEq2.a}</span>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="1"
                    value={linearEq2.a}
                    onChange={e => onLinearEq2Change({ ...linearEq2, a: parseInt(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">b₂ = {linearEq2.b}</span>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="1"
                    value={linearEq2.b}
                    onChange={e => onLinearEq2Change({ ...linearEq2, b: parseInt(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">c₂ = {linearEq2.c}</span>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="1"
                    value={linearEq2.c}
                    onChange={e => onLinearEq2Change({ ...linearEq2, c: parseInt(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Bảng Định Thức Cramer & Trạng Thái Nghiệm */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                Định thức Cramer & Nghiệm hình học
              </span>

              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">D</span>
                  <span className={`font-bold ${linearAnalysis.D !== 0 ? 'text-teal-400' : 'text-rose-400'}`}>
                    {linearAnalysis.D}
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Dx</span>
                  <span className="font-bold text-slate-200">{linearAnalysis.Dx}</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Dy</span>
                  <span className="font-bold text-slate-200">{linearAnalysis.Dy}</span>
                </div>
              </div>

              {/* Trạng thái hình học kết luận */}
              <div
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
                  linearAnalysis.type === 'unique'
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                    : linearAnalysis.type === 'parallel'
                    ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                    : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                }`}
              >
                {linearAnalysis.type === 'unique' ? (
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                )}
                <span>{linearAnalysis.statusMessageVi}</span>
              </div>

              {/* Các bước giải chi tiết */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Các bước giải đại số:
                </span>
                {linearAnalysis.stepsVi.map((step, idx) => (
                  <div key={idx} className="leading-relaxed">
                    • {step}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tùy chọn hiển thị chung */}
        <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>Lưới tọa độ Descartes</span>
          <button
            onClick={onToggleShowGrid}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              showGrid ? 'bg-sky-600/30 text-sky-300 border border-sky-500/30' : 'bg-slate-800 text-slate-500'
            }`}
          >
            {showGrid ? 'Đang bật' : 'Đang tắt'}
          </button>
        </div>
      </div>
    </div>
  );
};
