import React from 'react';
import { GeoEarthState, GeographyMode } from './types';
import { Quest } from '../../../types/simulation.types';
import { Globe, Sun, Clock, Play, Pause, Sparkles, CheckCircle2 } from 'lucide-react';

interface ControlPanelProps {
  state: GeoEarthState;
  onChange: (patch: Partial<GeoEarthState>) => void;
  quests?: Quest[];
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange, quests = [] }) => {
  const isOrbit = state.mode === 'seasons-orbit';

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 p-4 space-y-4 overflow-y-auto text-xs text-slate-200">
      {/* 1. Mode Switcher */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
          Chế độ bài học Địa lý:
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ mode: 'seasons-orbit' })}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl font-bold transition ${
              isOrbit
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>4 Mùa (Quỹ Đạo)</span>
          </button>
          <button
            type="button"
            onClick={() => onChange({ mode: 'day-night-rotation' })}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl font-bold transition ${
              !isOrbit
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Ngày Đêm & Múi Giờ</span>
          </button>
        </div>
      </div>

      {isOrbit ? (
        /* Seasons Orbit Controls */
        <>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-400">Góc Quỹ đạo quanh Mặt Trời:</span>
              <span className="font-mono font-bold text-white bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                {Math.round(state.orbitAngleDeg)}°
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={state.orbitAngleDeg}
              onChange={e => onChange({ orbitAngleDeg: parseFloat(e.target.value) })}
              className="w-full accent-blue-500"
            />

            <button
              type="button"
              onClick={() => onChange({ isOrbiting: !state.isOrbiting })}
              className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                state.isOrbiting
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow'
              }`}
            >
              {state.isOrbiting ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{state.isOrbiting ? 'Tạm dừng chuyển động' : 'Bắt đầu chuyển động quỹ đạo'}</span>
            </button>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <span className="font-semibold text-slate-300 block">Chuyển nhanh đến 4 Tiết khí chính:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onChange({ orbitAngleDeg: 0, isOrbiting: false })}
                className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-left"
              >
                🌱 Xuân Phân (21/3)
              </button>
              <button
                type="button"
                onClick={() => onChange({ orbitAngleDeg: 90, isOrbiting: false })}
                className="py-1.5 px-2 rounded-lg bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900 font-medium text-left"
              >
                ☀️ Hạ Chí (22/6)
              </button>
              <button
                type="button"
                onClick={() => onChange({ orbitAngleDeg: 180, isOrbiting: false })}
                className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-left"
              >
                🍁 Thu Phân (23/9)
              </button>
              <button
                type="button"
                onClick={() => onChange({ orbitAngleDeg: 270, isOrbiting: false })}
                className="py-1.5 px-2 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 font-medium text-left"
              >
                ❄️ Đông Chí (22/12)
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Day & Night Controls */
        <>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-teal-400">Trục tự quay Trái Đất (Giờ gốc):</span>
              <span className="font-mono font-bold text-white bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                {state.rotationHour.toFixed(1)}h
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={24}
              step={0.1}
              value={state.rotationHour}
              onChange={e => onChange({ rotationHour: parseFloat(e.target.value) })}
              className="w-full accent-teal-500"
            />

            <button
              type="button"
              onClick={() => onChange({ isRotating: !state.isRotating })}
              className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                state.isRotating
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-teal-600 hover:bg-teal-500 text-white shadow'
              }`}
            >
              {state.isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{state.isRotating ? 'Dừng tự quay' : 'Tự động quay quanh trục'}</span>
            </button>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <span className="font-semibold text-slate-300 block">Đường địa lý & Hiệu ứng:</span>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.showEquator}
                  onChange={e => onChange({ showEquator: e.target.checked })}
                  className="rounded accent-teal-600"
                />
                <span>Đường Xích Đạo (Vĩ tuyến 0°)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.showTropics}
                  onChange={e => onChange({ showTropics: e.target.checked })}
                  className="rounded accent-teal-600"
                />
                <span>Chí tuyến Bắc & Nam (23°27′)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.showTerminator}
                  onChange={e => onChange({ showTerminator: e.target.checked })}
                  className="rounded accent-teal-600"
                />
                <span>Bóng tối phân chia Ngày / Đêm</span>
              </label>
            </div>
          </div>
        </>
      )}

      {/* Quest Tracker */}
      <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2 mt-auto">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Nhiệm vụ Địa lý</span>
          </span>
        </div>
        <div className="space-y-1.5">
          {quests.map(q => {
            const isCompleted = q.targetCondition ? q.targetCondition(state) : false;
            return (
              <div
                key={q.id}
                className={`p-2 rounded-lg border text-[11px] flex items-start gap-2 ${
                  isCompleted
                    ? 'bg-emerald-950/50 border-emerald-800/80 text-emerald-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                    isCompleted ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <div>
                  <div className={`font-semibold ${isCompleted ? 'text-emerald-300' : 'text-slate-300'}`}>
                    {q.title}
                  </div>
                  <div className="text-[10px] text-slate-500">{q.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
