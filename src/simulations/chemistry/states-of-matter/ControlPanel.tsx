import React from 'react';
import { StatesOfMatterState, SubstanceType } from './types';
import { calculateMatterState, SUBSTANCES } from './matterEngine';
import { Flame, Snowflake, Pause, Sliders, Eye, Thermometer, Gauge } from 'lucide-react';

interface ControlPanelProps {
  state: StatesOfMatterState;
  onChange: (patch: Partial<StatesOfMatterState>) => void;
  onHeatStep: () => void;
  onCoolStep: () => void;
  onStopHeat: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  onChange,
  onHeatStep,
  onCoolStep,
  onStopHeat,
}) => {
  const matter = calculateMatterState(state.substance, state.temperatureC, state.pistonHeight);
  const subInfo = SUBSTANCES[state.substance];

  return (
    <div className="flex flex-col gap-4 p-4 text-sm select-none">
      {/* Chọn chất */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Chọn chất khảo sát:
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(SUBSTANCES) as SubstanceType[]).map(key => {
            const sub = SUBSTANCES[key];
            return (
              <button
                key={key}
                onClick={() => onChange({ substance: key })}
                className={`py-2 px-1 rounded-xl text-xs font-semibold border text-center transition-all ${
                  state.substance === key
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                {sub.formula}
              </button>
            );
          })}
        </div>
      </div>

      {/* Điều chỉnh nhiệt độ */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Nhiệt độ (T):
          </span>
          <span className="font-mono text-sm font-bold text-sky-500">
            {state.temperatureC}°C ({matter.temperatureK} K)
          </span>
        </div>
        <input
          type="range"
          min="-100"
          max="250"
          step="5"
          value={state.temperatureC}
          onChange={e => onChange({ temperatureC: Number(e.target.value) })}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />

        {/* Nút bấm nhanh 3 thể */}
        <div className="flex gap-1.5 mt-2">
          <button
            onClick={() => onChange({ temperatureC: subInfo.meltingPointC - 15 })}
            className="flex-1 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
          >
            🧊 Thể rắn
          </button>
          <button
            onClick={() => onChange({ temperatureC: (subInfo.meltingPointC + subInfo.boilingPointC) / 2 })}
            className="flex-1 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
          >
            💧 Thể lỏng
          </button>
          <button
            onClick={() => onChange({ temperatureC: subInfo.boilingPointC + 30 })}
            className="flex-1 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
          >
            💨 Thể khí
          </button>
        </div>
      </div>

      {/* Điều khiển Đèn nhiệt (Burner) */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
          Tác động nhiệt độ:
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onHeatStep}
            className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition-all ${
              state.isHeating
                ? 'bg-rose-500 border-rose-600 text-white shadow-md shadow-rose-500/20 ring-2 ring-rose-400'
                : 'border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Đun nóng</span>
          </button>

          <button
            onClick={onStopHeat}
            className="py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 flex items-center justify-center gap-1"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Dừng</span>
          </button>

          <button
            onClick={onCoolStep}
            className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition-all ${
              state.isCooling
                ? 'bg-sky-500 border-sky-600 text-white shadow-md shadow-sky-500/20 ring-2 ring-sky-400'
                : 'border-slate-200 dark:border-slate-700 text-sky-500 hover:bg-sky-50'
            }`}
          >
            <Snowflake className="w-3.5 h-3.5" />
            <span>Làm lạnh</span>
          </button>
        </div>
      </div>

      {/* Piston nén thể tích */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Thể tích bình chứa (Piston):
          </span>
          <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
            {Math.round(state.pistonHeight * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.4"
          max="1.0"
          step="0.05"
          value={state.pistonHeight}
          onChange={e => onChange({ pistonHeight: Number(e.target.value) })}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      {/* Tùy chọn dụng cụ đo */}
      <div className="space-y-1.5 pt-1 border-t border-slate-200 dark:border-slate-800">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={state.showThermometer}
            onChange={e => onChange({ showThermometer: e.target.checked })}
            className="rounded text-sky-500 focus:ring-sky-400"
          />
          <Thermometer className="w-3.5 h-3.5 text-rose-500" />
          <span>Hiện nhiệt kế đo nhiệt độ</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={state.showPressureGauge}
            onChange={e => onChange({ showPressureGauge: e.target.checked })}
            className="rounded text-sky-500 focus:ring-sky-400"
          />
          <Gauge className="w-3.5 h-3.5 text-emerald-500" />
          <span>Hiện áp kế đo áp suất bình (atm)</span>
        </label>
      </div>

      {/* Thẻ trạng thái & Tính chất nhiệt */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-500">Trạng thái hiện tại:</span>
          <span className="font-bold text-sky-600 dark:text-sky-400">{matter.stateNameVi.split('(')[0]}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Áp suất trong bình:</span>
          <span className="font-mono font-bold text-emerald-500">{matter.pressureAtm} atm</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Điểm nóng chảy:</span>
          <span className="font-mono text-slate-700 dark:text-slate-300">{subInfo.meltingPointC}°C</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Điểm sôi:</span>
          <span className="font-mono text-slate-700 dark:text-slate-300">{subInfo.boilingPointC}°C</span>
        </div>
      </div>
    </div>
  );
};
