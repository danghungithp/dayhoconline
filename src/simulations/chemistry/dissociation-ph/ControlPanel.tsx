import React, { useEffect } from 'react';
import { DissociationPhState } from './types';
import { calculatePhMetrics, SAMPLE_SOLUTIONS } from './chemistryEngine';
import { CustomQuestItem } from '../../../types/simulation.types';
import { FlaskConical, Droplet, TestTube, CheckCircle, Circle, Sparkles, Play, Pause, RotateCcw } from 'lucide-react';

interface ControlPanelProps {
  state: DissociationPhState;
  onChange: (patch: Partial<DissociationPhState>) => void;
  quests: CustomQuestItem[];
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange, quests }) => {
  const metrics = calculatePhMetrics(state);

  // Auto dripping in titration mode
  useEffect(() => {
    if (!state.isDripping || state.mode !== 'titration') return;

    const interval = setInterval(() => {
      onChange({
        buretBaseVolumeMl: Math.min(50, state.buretBaseVolumeMl + 0.5),
      });
    }, 200);

    return () => clearInterval(interval);
  }, [state.isDripping, state.buretBaseVolumeMl, state.mode, onChange]);

  return (
    <div className="flex flex-col gap-4 text-xs font-sans">
      {/* 1. Chọn chế độ thí nghiệm */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
        <button
          onClick={() => {
            onChange({ mode: 'ph-scale', isDripping: false });
          }}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-bold transition-all ${
            state.mode === 'ph-scale'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          Thang đo pH & Chỉ thị
        </button>

        <button
          onClick={() => onChange({ mode: 'titration' })}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-bold transition-all ${
            state.mode === 'titration'
              ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <TestTube className="w-3.5 h-3.5" />
          Chuẩn độ Axit - Bazơ
        </button>
      </div>

      {state.mode === 'ph-scale' ? (
        /* ==================================================================== */
        /* CONTROLS CHO THANG ĐO pH & PHA LOÃNG                                 */
        /* ==================================================================== */
        <div className="space-y-4">
          {/* Lựa chọn dung dịch mẫu */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Chọn dung dịch cần đo:
            </label>
            <select
              value={state.selectedSolutionId}
              onChange={(e) => onChange({ selectedSolutionId: e.target.value, waterAddedMl: 0 })}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 py-2 px-3 rounded-xl font-semibold outline-none focus:border-cyan-500 cursor-pointer"
            >
              {SAMPLE_SOLUTIONS.map((sol) => (
                <option key={sol.id} value={sol.id}>
                  {sol.nameVi} (pH gốc {sol.basePh})
                </option>
              ))}
            </select>
          </div>

          {/* Dụng cụ nhúng vào cốc */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Dụng cụ kiểm tra độ pH:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  onChange({
                    dippedIndicator: state.dippedIndicator === 'ph-probe' ? 'none' : 'ph-probe',
                  })
                }
                className={`py-2 px-3 rounded-xl font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                  state.dippedIndicator === 'ph-probe'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span>Bút đo pH điện tử</span>
              </button>
              <button
                onClick={() =>
                  onChange({
                    dippedIndicator: state.dippedIndicator === 'litmus-paper' ? 'none' : 'litmus-paper',
                  })
                }
                className={`py-2 px-3 rounded-xl font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                  state.dippedIndicator === 'litmus-paper'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span>Giấy quỳ tím</span>
              </button>
            </div>
          </div>

          {/* Thêm nước cất pha loãng */}
          <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                  Thêm nước cất pha loãng:
                </span>
                <span className="font-mono font-bold text-cyan-400">+{state.waterAddedMl} mL</span>
              </div>
              <input
                type="range"
                min="0"
                max="800"
                step="50"
                value={state.waterAddedMl}
                onChange={(e) => onChange({ waterAddedMl: parseInt(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
              <span>Thể tích ban đầu: {state.solutionVolumeMl} mL</span>
              <span>Tổng thể tích: {state.solutionVolumeMl + state.waterAddedMl} mL</span>
            </div>
          </div>
        </div>
      ) : (
        /* ==================================================================== */
        /* CONTROLS CHO THÍ NGHIỆM CHUẨN ĐỘ AXIT - BAZƠ                        */
        /* ==================================================================== */
        <div className="space-y-4">
          <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Thể tích NaOH thêm từ Buret:</span>
                <span className="font-mono font-bold text-pink-400">{state.buretBaseVolumeMl.toFixed(1)} mL</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="0.5"
                value={state.buretBaseVolumeMl}
                onChange={(e) => onChange({ buretBaseVolumeMl: parseFloat(e.target.value) })}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChange({ isDripping: !state.isDripping })}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  state.isDripping
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                }`}
              >
                {state.isDripping ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {state.isDripping ? 'Dừng nhỏ giọt' : 'Tự động nhỏ giọt'}
              </button>

              <button
                onClick={() => onChange({ buretBaseVolumeMl: 0, isDripping: false })}
                className="py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Làm lại chuẩn độ
              </button>
            </div>
          </div>

          {/* Bảng trạng thái chuẩn độ */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
            <div className="text-slate-400 border-b border-slate-800 pb-1 flex justify-between font-bold">
              <span>TRẠNG THÁI CHUẨN ĐỘ</span>
              <span className="text-pink-400">HCl + NaOH → NaCl + H2O</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nồng độ HCl:</span>
              <span className="text-white">0.1 M (V = 25 mL)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nồng độ NaOH:</span>
              <span className="text-white">0.1 M (Buret)</span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-slate-500">Điểm tương đương lý thuyết:</span>
              <span className="text-amber-400">V(NaOH) = 25.0 mL</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Nhiệm vụ học tập (Quests) */}
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
