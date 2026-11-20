import React, { useEffect } from 'react';
import { CellDivisionState, MitosisPhase } from './types';
import { MITOSIS_PHASES_INFO } from './cellEngine';
import { CustomQuestItem } from '../../../types/simulation.types';
import { Play, Pause, StepForward, RotateCcw, Sparkles, CheckCircle, Circle, Dna } from 'lucide-react';

interface ControlPanelProps {
  state: CellDivisionState;
  onChange: (patch: Partial<CellDivisionState>) => void;
  quests: CustomQuestItem[];
}

const PHASES_LIST: MitosisPhase[] = ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase'];

export const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange, quests }) => {
  // Auto loop through phases when Play is active
  useEffect(() => {
    if (!state.isPlaying) return;

    const interval = setInterval(() => {
      const curIdx = PHASES_LIST.indexOf(state.phase);
      const nextIdx = (curIdx + 1) % PHASES_LIST.length;
      onChange({ phase: PHASES_LIST[nextIdx] });
    }, 2500 / state.speed);

    return () => clearInterval(interval);
  }, [state.isPlaying, state.phase, state.speed, onChange]);

  const currentInfo = MITOSIS_PHASES_INFO[state.phase];

  return (
    <div className="flex flex-col gap-4 text-xs font-sans">
      {/* 1. Chọn các kỳ nguyên phân */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Chọn kỳ trong chu kỳ Nguyên phân:
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {PHASES_LIST.map((p) => {
            const pInfo = MITOSIS_PHASES_INFO[p];
            const isActive = state.phase === p;
            return (
              <button
                key={p}
                onClick={() => onChange({ phase: p, isPlaying: false })}
                className={`py-2 px-2.5 rounded-xl font-bold text-left border transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[11px]">{pInfo.nameVi.split(' ')[0]} {pInfo.nameVi.split(' ')[1]}</div>
                <div className="text-[10px] text-slate-500 font-normal">{pInfo.nameEn}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Điều khiển Play / Tạm dừng & Tốc độ */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onChange({ isPlaying: !state.isPlaying })}
          className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
            state.isPlaying
              ? 'bg-rose-500/20 border-rose-500 text-rose-300'
              : 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
          }`}
        >
          {state.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {state.isPlaying ? 'Tạm dừng chu kỳ' : 'Xem liên tục toàn bộ chu kỳ'}
        </button>

        <button
          onClick={() => {
            const curIdx = PHASES_LIST.indexOf(state.phase);
            const nextIdx = (curIdx + 1) % PHASES_LIST.length;
            onChange({ phase: PHASES_LIST[nextIdx], isPlaying: false });
          }}
          className="py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
        >
          <StepForward className="w-3.5 h-3.5" />
          Kỳ tiếp theo
        </button>
      </div>

      {/* 3. Tùy chọn cấu hình bộ NST */}
      <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span>Bộ nhiễm sắc thể lưỡng bội (2n):</span>
            <span className="font-mono font-bold text-amber-400">2n = {state.chromosomeCount}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[4, 6].map((count) => (
              <button
                key={count}
                onClick={() => onChange({ chromosomeCount: count as 4 | 6 })}
                className={`py-1.5 rounded-lg font-bold border ${
                  state.chromosomeCount === count
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                2n = {count} NST
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-slate-300">
          <span>Hiện thoi phân bào (tơ vô sắc):</span>
          <input
            type="checkbox"
            checked={state.showSpindleFibers}
            onChange={(e) => onChange({ showSpindleFibers: e.target.checked })}
            className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* 4. Bản chất sinh học chi tiết của kỳ hiện tại */}
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
        <div className="text-slate-400 border-b border-slate-800 pb-1 flex justify-between font-bold">
          <span>ĐẶC ĐIỂM HỌC THUẬT (GDPT 2018)</span>
          <span className="text-cyan-400">{currentInfo.nameVi}</span>
        </div>
        <p className="text-slate-300 font-sans leading-relaxed text-[11px]">{currentInfo.descriptionVi}</p>
        <div className="flex justify-between pt-1 text-[10px] text-amber-400 font-mono">
          <span>Số lượng ADN:</span>
          <span>{currentInfo.dnaStatus}</span>
        </div>
      </div>

      {/* 5. Nhiệm vụ học tập (Quests) */}
      <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Nhiệm vụ Thí nghiệm ({quests.filter((q) => q.targetCondition(state)).length}/{quests.length})</span>
        </div>
        <div className="space-y-1.5">
          {quests.map((q) => {
            const completed = q.targetCondition(state);
            return (
              <div
                key={q.id}
                className={`p-2 rounded-lg border transition-all ${
                  completed
                    ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {completed ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span>{q.title}</span>
                  </div>
                  <span className="text-amber-400 font-mono">+{q.xpReward} XP</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 pl-5">{q.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
