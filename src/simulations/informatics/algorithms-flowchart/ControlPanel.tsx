import React, { useEffect } from 'react';
import { AlgorithmsState, SortAlgorithm } from './types';
import { generateRandomArray, stepSortAlgorithm, generateSortedArray } from './algorithmEngine';
import { CustomQuestItem } from '../../../types/simulation.types';
import { Play, Pause, StepForward, Shuffle, Sparkles, CheckCircle, Circle, BarChart3, Search } from 'lucide-react';

interface ControlPanelProps {
  state: AlgorithmsState;
  onChange: (patch: Partial<AlgorithmsState>) => void;
  quests: CustomQuestItem[];
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange, quests }) => {
  // Loop chạy tự động khi bấm Play
  useEffect(() => {
    if (!state.isPlaying || state.mode !== 'sorting' || state.isSorted) return;

    const timer = setTimeout(() => {
      const res = stepSortAlgorithm(
        state.array,
        state.sortAlgorithm,
        state.stepCount,
        state.comparisonsCount,
        state.swapsCount
      );

      onChange({
        array: res.array,
        comparisonsCount: res.comparisonsCount,
        swapsCount: res.swapsCount,
        isSorted: res.isSorted,
        stepCount: state.stepCount + 1,
        isPlaying: !res.isSorted,
      });
    }, state.speedMs);

    return () => clearTimeout(timer);
  }, [state.isPlaying, state.array, state.isSorted, state.speedMs, state.sortAlgorithm, state.mode, onChange]);

  // Bước tiếp theo thủ công
  const handleStepNext = () => {
    if (state.mode === 'sorting') {
      if (state.isSorted) return;
      const res = stepSortAlgorithm(
        state.array,
        state.sortAlgorithm,
        state.stepCount,
        state.comparisonsCount,
        state.swapsCount
      );
      onChange({
        array: res.array,
        comparisonsCount: res.comparisonsCount,
        swapsCount: res.swapsCount,
        isSorted: res.isSorted,
        stepCount: state.stepCount + 1,
      });
    } else {
      // Binary search next step
      let { leftIndex, rightIndex, targetValue, searchArray } = state;
      if (leftIndex > rightIndex) {
        onChange({ flowchartStep: 'not-found' });
        return;
      }
      const mid = Math.floor((leftIndex + rightIndex) / 2);
      if (searchArray[mid] === targetValue) {
        onChange({
          midIndex: mid,
          searchFoundIndex: mid,
          flowchartStep: 'found',
        });
      } else if (searchArray[mid] < targetValue) {
        onChange({
          midIndex: mid,
          leftIndex: mid + 1,
          flowchartStep: 'branch',
        });
      } else {
        onChange({
          midIndex: mid,
          rightIndex: mid - 1,
          flowchartStep: 'branch',
        });
      }
    }
  };

  // Tạo lại mảng ngẫu nhiên
  const handleShuffle = () => {
    if (state.mode === 'sorting') {
      onChange({
        array: generateRandomArray(14),
        comparisonsCount: 0,
        swapsCount: 0,
        stepCount: 0,
        isSorted: false,
        isPlaying: false,
      });
    } else {
      const newSorted = generateSortedArray(15);
      const randomTarget = newSorted[Math.floor(Math.random() * newSorted.length)];
      onChange({
        searchArray: newSorted,
        targetValue: randomTarget,
        leftIndex: 0,
        rightIndex: newSorted.length - 1,
        midIndex: Math.floor((newSorted.length - 1) / 2),
        searchFoundIndex: null,
        flowchartStep: 'calc-mid',
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 text-xs font-sans">
      {/* 1. Chọn chế độ */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
        <button
          onClick={() => onChange({ mode: 'sorting', isPlaying: false })}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-bold transition-all ${
            state.mode === 'sorting'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Sắp xếp mảng (Sorting)
        </button>

        <button
          onClick={() => onChange({ mode: 'binary-search', isPlaying: false })}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-bold transition-all ${
            state.mode === 'binary-search'
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          Tìm kiếm nhị phân & Lưu đồ
        </button>
      </div>

      {state.mode === 'sorting' ? (
        /* ==================================================================== */
        /* CONTROLS CHO THUẬT TOÁN SẮP XẾP                                     */
        /* ==================================================================== */
        <div className="space-y-4">
          {/* Lựa chọn thuật toán */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Chọn thuật toán:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'bubble', name: 'Nổi bọt (Bubble)' },
                { id: 'selection', name: 'Chọn (Selection)' },
                { id: 'insertion', name: 'Chèn (Insertion)' },
              ].map((algo) => (
                <button
                  key={algo.id}
                  onClick={() =>
                    onChange({
                      sortAlgorithm: algo.id as SortAlgorithm,
                      isPlaying: false,
                      isSorted: false,
                      comparisonsCount: 0,
                      swapsCount: 0,
                    })
                  }
                  className={`py-1.5 rounded-lg font-semibold border ${
                    state.sortAlgorithm === algo.id
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {algo.name}
                </button>
              ))}
            </div>
          </div>

          {/* Điều khiển Play / Pause / Step / Shuffle */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onChange({ isPlaying: !state.isPlaying })}
              disabled={state.isSorted}
              className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                state.isPlaying
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                  : 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
              }`}
            >
              {state.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {state.isPlaying ? 'Tạm dừng' : 'Chạy tự động'}
            </button>

            <button
              onClick={handleStepNext}
              disabled={state.isPlaying || state.isSorted}
              className="py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
            >
              <StepForward className="w-3.5 h-3.5" />
              Từng bước
            </button>

            <button
              onClick={handleShuffle}
              className="py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
            >
              <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
              Tạo mảng mới
            </button>
          </div>

          {/* Tốc độ thực thi */}
          <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Tốc độ thực thi:</span>
              <span className="font-mono text-cyan-400">{state.speedMs} ms / bước</span>
            </div>
            <input
              type="range"
              min="80"
              max="800"
              step="40"
              value={state.speedMs}
              onChange={(e) => onChange({ speedMs: parseInt(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      ) : (
        /* ==================================================================== */
        /* CONTROLS CHO TÌM KIẾM NHỊ PHÂN & FLOWCHART                          */
        /* ==================================================================== */
        <div className="space-y-4">
          <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Số X cần tìm kiếm:</span>
                <span className="font-mono font-bold text-amber-400">X = {state.targetValue}</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={state.targetValue}
                  onChange={(e) =>
                    onChange({
                      targetValue: parseInt(e.target.value) || 0,
                      leftIndex: 0,
                      rightIndex: state.searchArray.length - 1,
                      midIndex: Math.floor((state.searchArray.length - 1) / 2),
                      searchFoundIndex: null,
                      flowchartStep: 'calc-mid',
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 font-mono text-amber-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleStepNext}
                className="py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
              >
                <StepForward className="w-3.5 h-3.5" />
                Bước tiếp theo
              </button>

              <button
                onClick={handleShuffle}
                className="py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
              >
                <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                Đổi mảng mới
              </button>
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
