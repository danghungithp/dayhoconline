import React from 'react';
import { UnitCircleState } from './types';
import {
  calculateTrigValues,
  computeFeasibleVertices,
  checkPointInFeasibleRegion,
  SPECIAL_ANGLES,
} from './trigInequalitiesEngine';

interface ControlPanelProps {
  state: UnitCircleState;
  onChange: (patch: Partial<UnitCircleState>) => void;
  isDark?: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  onChange,
}) => {
  const trig = calculateTrigValues(state.angleDeg);
  const vertices = computeFeasibleVertices(
    state.inequalities,
    state.objectiveA,
    state.objectiveB
  );
  const isInside = checkPointInFeasibleRegion(
    state.testPoint,
    state.inequalities
  ) && state.testPoint.x >= 0 && state.testPoint.y >= 0;

  return (
    <div className="space-y-5 text-sm">
      {/* Mode Switcher */}
      <div className="flex rounded-lg bg-slate-800/80 p-1 border border-slate-700">
        <button
          onClick={() => onChange({ activeTab: 'unit-circle' })}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium text-xs transition-all ${
            state.activeTab === 'unit-circle'
              ? 'bg-amber-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ⭕ Vòng tròn lượng giác
        </button>
        <button
          onClick={() => onChange({ activeTab: 'inequalities' })}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium text-xs transition-all ${
            state.activeTab === 'inequalities'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📊 Miền nghiệm BPT 2 ẩn
        </button>
      </div>

      {/* Tab 1: Vòng tròn lượng giác */}
      {state.activeTab === 'unit-circle' && (
        <div className="space-y-4">
          {/* Góc α Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Số đo góc α:</span>
              <span className="font-mono font-bold text-amber-400">
                {trig.angleDeg}° ({trig.radLabel})
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={state.snapToSpecial ? 15 : 1}
              value={state.angleDeg}
              onChange={e => onChange({ angleDeg: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Quick Special Angles */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Chọn nhanh góc đặc biệt:
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[0, 30, 45, 60, 90, 120, 135, 150, 180, 270, 360].map(deg => (
                <button
                  key={deg}
                  onClick={() => onChange({ angleDeg: deg })}
                  className={`px-2 py-1 text-xs rounded border transition-all ${
                    Math.abs(state.angleDeg - deg) < 0.5
                      ? 'bg-amber-600 border-amber-400 text-white font-bold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {state.angleMode === 'radians'
                    ? SPECIAL_ANGLES.find(s => s.deg === deg)?.rad || `${deg}°`
                    : `${deg}°`}
                </button>
              ))}
            </div>
          </div>

          {/* Options: Angle mode & Snapping */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() =>
                onChange({
                  angleMode: state.angleMode === 'degrees' ? 'radians' : 'degrees',
                })
              }
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-md text-xs font-medium"
            >
              Đơn vị: {state.angleMode === 'degrees' ? 'Độ (°)' : 'Radian (π)'}
            </button>
            <button
              onClick={() => onChange({ snapToSpecial: !state.snapToSpecial })}
              className={`px-2.5 py-1.5 border rounded-md text-xs font-medium transition-all ${
                state.snapToSpecial
                  ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Hút góc đặc biệt: {state.snapToSpecial ? 'BẬT' : 'TẮT'}
            </button>
          </div>

          {/* Projection Toggles */}
          <div className="space-y-1.5 pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={state.showCosine}
                onChange={e => onChange({ showCosine: e.target.checked })}
                className="rounded accent-emerald-500"
              />
              Trục Cosin (Hình chiếu xuống Ox: màu xanh lá)
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={state.showSine}
                onChange={e => onChange({ showSine: e.target.checked })}
                className="rounded accent-sky-500"
              />
              Trục Sin (Hình chiếu lên Oy: màu xanh dương)
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={state.showTangent}
                onChange={e => onChange({ showTangent: e.target.checked })}
                className="rounded accent-purple-500"
              />
              Trục Tangent (Tiếp tuyến x = 1: màu tím)
            </label>
          </div>

          {/* Bảng giá trị lượng giác chi tiết */}
          <div className="p-3 bg-slate-900/80 border border-slate-700/60 rounded-lg space-y-1.5 text-xs">
            <div className="font-semibold text-slate-200">
              📐 Giá trị lượng giác góc {trig.angleDeg}°:
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
              <div>
                • <strong>sin({trig.angleDeg}°)</strong> ={' '}
                <span className="font-mono text-sky-400 font-bold">{trig.sinExact}</span>
              </div>
              <div>
                • <strong>cos({trig.angleDeg}°)</strong> ={' '}
                <span className="font-mono text-emerald-400 font-bold">{trig.cosExact}</span>
              </div>
              <div>
                • <strong>tan({trig.angleDeg}°)</strong> ={' '}
                <span className="font-mono text-purple-400 font-bold">{trig.tanExact}</span>
              </div>
              <div>
                • Góc phần tư:{' '}
                <span className="font-mono text-amber-400 font-bold">
                  {trig.quadrant === 'axis' ? 'Trên trục' : `Phần tư ${trig.quadrant}`}
                </span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              💡 Công thức cơ bản: sin²α + cos²α = 1 ({trig.sin.toFixed(3)}² + {trig.cos.toFixed(3)}² = 1.000)
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Miền nghiệm BPT bậc nhất 2 ẩn */}
      {state.activeTab === 'inequalities' && (
        <div className="space-y-4">
          {/* Hệ các bất phương trình */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Hệ bất phương trình (với x ≥ 0, y ≥ 0):
            </div>
            <div className="space-y-2">
              {state.inequalities.map((ineq, idx) => (
                <div
                  key={ineq.id}
                  className="p-2.5 bg-slate-900/70 border border-slate-700/70 rounded-lg space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold" style={{ color: ineq.color }}>
                      (d{idx + 1}): {ineq.label}
                    </span>
                    <span className="text-[11px] text-slate-400">c = {ineq.c}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Hệ số c:</span>
                    <input
                      type="range"
                      min={4}
                      max={18}
                      step={1}
                      value={ineq.c}
                      onChange={e => {
                        const newC = Number(e.target.value);
                        const updated = state.inequalities.map(i =>
                          i.id === ineq.id
                            ? { ...i, c: newC, label: `${i.a !== 1 ? i.a : ''}x + ${i.b !== 1 ? i.b : ''}y ≤ ${newC}` }
                            : i
                        );
                        onChange({ inequalities: updated });
                      }}
                      className="flex-1 accent-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tọa độ điểm thử nghiệm M(x, y) */}
          <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-300">Điểm thử nghiệm M(x, y):</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  isInside ? 'bg-green-900/60 text-green-300' : 'bg-red-900/60 text-red-300'
                }`}
              >
                {isInside ? 'THUỘC MIỀN NGHIỆM' : 'NGOÀI MIỀN'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 text-[11px]">x: {state.testPoint.x}</span>
                <input
                  type="range"
                  min={0}
                  max={8}
                  step={0.5}
                  value={state.testPoint.x}
                  onChange={e =>
                    onChange({
                      testPoint: { ...state.testPoint, x: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-emerald-500"
                />
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">y: {state.testPoint.y}</span>
                <input
                  type="range"
                  min={0}
                  max={8}
                  step={0.5}
                  value={state.testPoint.y}
                  onChange={e =>
                    onChange({
                      testPoint: { ...state.testPoint, y: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Hàm mục tiêu F(x, y) = ax + by */}
          <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-lg space-y-2 text-xs">
            <div className="font-semibold text-amber-300">
              🎯 Hàm mục tiêu: F(x, y) = {state.objectiveA}x + {state.objectiveB}y
            </div>
            <div className="text-slate-300">
              Giá trị F tại điểm M({state.testPoint.x}, {state.testPoint.y}):{' '}
              <strong className="font-mono text-amber-400 text-sm">
                {(state.objectiveA * state.testPoint.x + state.objectiveB * state.testPoint.y).toFixed(1)}
              </strong>
            </div>

            {/* Bảng giá trị tại các đỉnh đa giác */}
            {vertices.length > 0 && (
              <div className="pt-2 border-t border-amber-900/50 space-y-1">
                <div className="text-[11px] font-semibold text-slate-300">
                  Giá trị F(x, y) tại các đỉnh đa giác:
                </div>
                <div className="space-y-1">
                  {vertices.map((v, i) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center px-2 py-1 rounded text-[11px] ${
                        v.isMax
                          ? 'bg-amber-900/50 text-amber-200 font-bold border border-amber-600'
                          : 'bg-slate-800/50 text-slate-300'
                      }`}
                    >
                      <span>
                        Đỉnh ({v.x}, {v.y})
                      </span>
                      <span>
                        F = {v.fValue} {v.isMax ? '🏆 [MAX]' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
