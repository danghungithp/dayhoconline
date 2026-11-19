import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Target, 
  Activity, 
  Zap, 
  Wind, 
  Globe2, 
  Eye, 
  Plus, 
  Minus,
  Sparkles
} from 'lucide-react';
import { ProjectileParams, TrajectorySummary, GRAVITY_PRESETS } from './physicsSolver';

interface ControlPanelProps {
  params: ProjectileParams;
  summary: TrajectorySummary;
  currentTime: number;
  isRunning: boolean;
  hasFired: boolean;
  targetX: number;
  showVectors: boolean;
  showComponents: boolean;
  showEnergyHUD: boolean;
  showPreviousTrajectory: boolean;
  onSetParams: (updater: (prev: ProjectileParams) => ProjectileParams) => void;
  onSetTargetX: (val: number) => void;
  onLaunch: () => void;
  onTogglePause: () => void;
  onReset: () => void;
  onToggleVectors: () => void;
  onToggleComponents: () => void;
  onToggleEnergyHUD: () => void;
  onTogglePreviousTrajectory: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  params,
  summary,
  currentTime,
  isRunning,
  hasFired,
  targetX,
  showVectors,
  showComponents,
  showEnergyHUD,
  showPreviousTrajectory,
  onSetParams,
  onSetTargetX,
  onLaunch,
  onTogglePause,
  onReset,
  onToggleVectors,
  onToggleComponents,
  onToggleEnergyHUD,
  onTogglePreviousTrajectory,
}) => {
  const { v0, angleDeg, y0, g, m, dragCoeff } = params;

  const updateParam = <K extends keyof ProjectileParams>(key: K, val: ProjectileParams[K]) => {
    onSetParams(prev => ({ ...prev, [key]: val }));
  };

  const isHit = Math.abs(summary.maxRange - targetX) <= 1.5;

  return (
    <div className="space-y-4 text-xs select-none">
      {/* 1. Nút Hành Động Chính (Phóng / Tạm dừng / Đặt lại) */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onLaunch}
          className="col-span-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 active:scale-95 transition"
        >
          <Flame className="w-4 h-4 text-amber-300" />
          <span>PHÓNG ĐẠN!</span>
        </button>

        <button
          onClick={onTogglePause}
          disabled={!hasFired}
          className={`py-3 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition ${
            !hasFired
              ? 'opacity-40 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500'
              : isRunning
              ? 'bg-amber-950/70 border-amber-600 text-amber-300'
              : 'bg-emerald-950/70 border-emerald-600 text-emerald-300'
          }`}
          title={isRunning ? 'Tạm dừng chuyển động' : 'Tiếp tục bay'}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Dừng' : 'Tiếp'}</span>
        </button>
      </div>

      {/* 2. Bảng Tóm Tắt & Kết Quả Lần Phóng (Telemetry Summary) */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 shadow-2xl space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="font-extrabold text-white text-xs flex items-center gap-1.5 text-cyan-400">
            <Activity className="w-3.5 h-3.5" />
            Thông số động học (Kinematics):
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              isHit
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/50'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isHit ? '🎯 TRÚNG MỤC TIÊU' : 'CHƯA TRÚNG BIA'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center font-mono">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Tầm xa (L)</span>
            <span className="text-sm font-bold text-cyan-300">
              {summary.maxRange.toFixed(1)}m
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Tầm cao (H)</span>
            <span className="text-sm font-bold text-amber-300">
              {summary.maxHeight.toFixed(1)}m
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Thời gian bay</span>
            <span className="text-sm font-bold text-emerald-300">
              {summary.flightTime.toFixed(2)}s
            </span>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Vận tốc chạm đất:</span>
          <span className="font-bold text-white">
            {summary.impactSpeed.toFixed(1)} m/s ({summary.impactAngleDeg.toFixed(0)}°)
          </span>
        </div>
      </div>

      {/* 3. Thanh trượt Biến Số Phóng (v0, Góc α, Độ cao y0, Khối lượng m) */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="font-bold text-white text-xs flex items-center justify-between">
          <span>Điều chỉnh biến số phóng:</span>
          <button
            onClick={onReset}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đặt lại</span>
          </button>
        </h4>

        {/* Vận tốc đầu v0 */}
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Vận tốc ban đầu (v₀):</span>
            <div className="flex items-center gap-1 font-mono">
              <span className="text-cyan-400 font-bold text-sm w-16 text-right">
                {v0.toFixed(1)} m/s
              </span>
            </div>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="0.5"
            value={v0}
            onChange={e => updateParam('v0', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        {/* Góc ném alpha */}
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Góc bắn (α):</span>
            <span className="text-amber-400 font-bold font-mono text-sm">
              {angleDeg}°
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            step="1"
            value={angleDeg}
            onChange={e => updateParam('angleDeg', parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Độ cao ban đầu y0 */}
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Độ cao ban đầu (y₀):</span>
            <span className="text-indigo-400 font-bold font-mono text-sm">
              {y0.toFixed(1)} m
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={y0}
            onChange={e => updateParam('y0', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Khối lượng vật m */}
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Khối lượng vật (m):</span>
            <span className="text-slate-200 font-bold font-mono text-sm">
              {m.toFixed(1)} kg
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={m}
            onChange={e => updateParam('m', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-slate-400"
          />
        </div>

        {/* Lực cản không khí dragCoeff */}
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hệ số cản không khí (k):</span>
            </div>
            <span className="font-mono font-bold text-xs text-cyan-300">
              {dragCoeff === 0 ? '0 (Chân không)' : dragCoeff.toFixed(3)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="0.1"
            step="0.005"
            value={dragCoeff}
            onChange={e => updateParam('dragCoeff', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        {/* Vị trí bia ngắm targetX */}
        <div className="p-2 rounded-xl bg-slate-950 border border-rose-900/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-rose-300 font-medium">
              <Target className="w-3.5 h-3.5" />
              <span>Khoảng cách bia ngắm:</span>
            </div>
            <span className="font-mono font-bold text-rose-400 text-sm">
              {targetX} m
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            step="2"
            value={targetX}
            onChange={e => onSetTargetX(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
          />
        </div>
      </div>

      {/* 4. Chọn Môi Trường Trọng Lực (g) */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <span className="font-bold text-white text-xs flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
          Môi trường trọng lực (g):
        </span>

        <div className="grid grid-cols-2 gap-1.5">
          {GRAVITY_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => updateParam('g', preset.g)}
              className={`p-2 rounded-xl text-left border text-[11px] font-semibold transition ${
                Math.abs(g - preset.g) < 0.05
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Tùy Chọn Hiển Thị Trực Quan */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap gap-1.5">
        <button
          onClick={onToggleVectors}
          className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition ${
            showVectors
              ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
              : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}
        >
          Vector vận tốc v
        </button>

        <button
          onClick={onToggleComponents}
          className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition ${
            showComponents
              ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold'
              : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}
        >
          Thành phần vx, vy
        </button>

        <button
          onClick={onToggleEnergyHUD}
          className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition ${
            showEnergyHUD
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
              : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}
        >
          Cột cơ năng W
        </button>

        <button
          onClick={onTogglePreviousTrajectory}
          className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition ${
            showPreviousTrajectory
              ? 'bg-indigo-950 border-indigo-500 text-indigo-300 font-bold'
              : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}
        >
          Giữ vết cũ
        </button>
      </div>
    </div>
  );
};
