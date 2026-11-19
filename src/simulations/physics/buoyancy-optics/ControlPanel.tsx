import React from 'react';
import { BuoyancyOpticsState, BuoyancyOpticsTab, LiquidType, BlockMaterial } from './types';
import { calculateBuoyancy, calculateLens, LIQUIDS, MATERIALS } from './physics8Engine';
import { Waves, Eye, Sliders, Check } from 'lucide-react';

interface ControlPanelProps {
  state: BuoyancyOpticsState;
  onChange: (patch: Partial<BuoyancyOpticsState>) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange }) => {
  const buoy = calculateBuoyancy(state.liquidType, state.material, state.blockVolumeLiters);
  const lens = calculateLens(state.focalLengthCm, state.objectDistanceCm, state.objectHeightCm);

  return (
    <div className="flex flex-col gap-4 p-4 text-sm select-none">
      {/* Tab Switcher */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium text-xs">
        <button
          onClick={() => onChange({ activeTab: 'buoyancy' })}
          className={`py-2 px-1 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 ${
            state.activeTab === 'buoyancy'
              ? 'bg-white dark:bg-slate-700 text-sky-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Waves className="w-3.5 h-3.5" />
          <span>Lực đẩy Ác-si-mét</span>
        </button>
        <button
          onClick={() => onChange({ activeTab: 'lens' })}
          className={`py-2 px-1 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 ${
            state.activeTab === 'lens'
              ? 'bg-white dark:bg-slate-700 text-indigo-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Thấu kính hội tụ</span>
        </button>
      </div>

      {state.activeTab === 'buoyancy' ? (
        /* ================= TAB ÁC-SI-MÉT ================= */
        <div className="flex flex-col gap-4">
          {/* Chọn chất lỏng */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Chất lỏng trong bể:
            </label>
            <div className="space-y-1.5">
              {(Object.keys(LIQUIDS) as LiquidType[]).map(key => {
                const liq = LIQUIDS[key];
                return (
                  <button
                    key={key}
                    onClick={() => onChange({ liquidType: key })}
                    className={`w-full py-1.5 px-3 rounded-xl border text-xs font-medium text-left transition-all ${
                      state.liquidType === key
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {liq.nameVi}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chọn vật liệu khối vật */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Vật liệu khối vật:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(MATERIALS) as BlockMaterial[]).map(key => {
                const mat = MATERIALS[key];
                return (
                  <button
                    key={key}
                    onClick={() => onChange({ material: key })}
                    className={`py-2 px-2 rounded-xl border text-xs font-medium text-center transition-all ${
                      state.material === key
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {mat.nameVi.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thể tích vật */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Thể tích khối vật (V):
              </span>
              <span className="font-mono text-sm font-bold text-sky-500">
                {state.blockVolumeLiters} Lít
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.5"
              value={state.blockVolumeLiters}
              onChange={e => onChange({ blockVolumeLiters: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          {/* Bảng phân tích lực */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Trọng lượng vật (P = m·g):</span>
              <span className="font-mono font-bold text-rose-500">{buoy.weightN} N</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Lực đẩy Ác-si-mét (FA):</span>
              <span className="font-mono font-bold text-emerald-500">{buoy.buoyantForceN} N</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Thể tích phần bị chìm:</span>
              <span className="font-mono font-bold text-sky-500">
                {buoy.submergedVolumeLiters} L ({(buoy.submergedVolumeLiters / state.blockVolumeLiters * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ================= TAB THẤU KÍNH ================= */
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tiêu cự thấu kính (f):
              </span>
              <span className="font-mono text-sm font-bold text-rose-500">
                f = {state.focalLengthCm} cm
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="25"
              step="1"
              value={state.focalLengthCm}
              onChange={e => onChange({ focalLengthCm: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Khoảng cách vật đến thấu kính (d):
              </span>
              <span className="font-mono text-sm font-bold text-emerald-500">
                d = {state.objectDistanceCm} cm
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={state.objectDistanceCm}
              onChange={e => onChange({ objectDistanceCm: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex gap-1.5 mt-2">
              <button
                onClick={() => onChange({ objectDistanceCm: state.focalLengthCm * 2 })}
                className="flex-1 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono hover:bg-slate-200"
              >
                d = 2f ({state.focalLengthCm * 2}cm)
              </button>
              <button
                onClick={() => onChange({ objectDistanceCm: Math.round(state.focalLengthCm * 0.6) })}
                className="flex-1 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono hover:bg-slate-200"
              >
                d &lt; f (Kính lúp)
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Chiều cao vật sáng (h):
              </span>
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                h = {state.objectHeightCm} cm
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              step="0.5"
              value={state.objectHeightCm}
              onChange={e => onChange({ objectHeightCm: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 pt-1">
            <input
              type="checkbox"
              checked={state.showSpecialRays}
              onChange={e => onChange({ showSpecialRays: e.target.checked })}
              className="rounded text-indigo-500 focus:ring-indigo-400"
            />
            <span>Hiện 2 tia sáng đặc biệt từ đỉnh vật B</span>
          </label>

          {/* Kết quả thấu kính */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Khoảng cách ảnh (d'):</span>
              <span className="font-mono font-bold text-rose-500">{lens.imageDistanceCm} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Chiều cao ảnh (h'):</span>
              <span className="font-mono font-bold text-indigo-500">{lens.imageHeightCm} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Độ phóng đại (k = h'/h):</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{lens.magnification}x</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
