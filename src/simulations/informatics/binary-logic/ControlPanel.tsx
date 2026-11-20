import React from 'react';
import { BinaryLogicState, LogicGateType, InformaticsMode } from './types';
import { Quest } from '../../../types/simulation.types';
import { Cpu, Binary, Zap, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface ControlPanelProps {
  state: BinaryLogicState;
  onChange: (patch: Partial<BinaryLogicState>) => void;
  quests?: Quest[];
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange, quests = [] }) => {
  const isBinary = state.mode === 'binary-converter';

  const resetAllBits = () => {
    onChange({ bits: [false, false, false, false, false, false, false, false] });
  };

  const setAllBitsMax = () => {
    onChange({ bits: [true, true, true, true, true, true, true, true] });
  };

  const setRandomBits = () => {
    const randomBits = Array.from({ length: 8 }, () => Math.random() > 0.5) as [
      boolean,
      boolean,
      boolean,
      boolean,
      boolean,
      boolean,
      boolean,
      boolean
    ];
    onChange({ bits: randomBits });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 p-4 space-y-4 overflow-y-auto text-xs text-slate-200">
      {/* 1. Mode Switcher */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
          Chế độ bài học Tin học:
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ mode: 'binary-converter' })}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl font-bold transition ${
              isBinary
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>Chuyển Đổi Nhị Phân</span>
          </button>
          <button
            type="button"
            onClick={() => onChange({ mode: 'logic-gates' })}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl font-bold transition ${
              !isBinary
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Mạch Cổng Logic</span>
          </button>
        </div>
      </div>

      {isBinary ? (
        /* Binary Mode Controls */
        <>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5">
            <span className="font-semibold text-cyan-400 block">Thao tác nhanh 8-bit:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={resetAllBits}
                className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt về 0</span>
              </button>
              <button
                type="button"
                onClick={setAllBitsMax}
                className="py-1.5 px-2 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 font-medium"
              >
                Tối đa (255)
              </button>
              <button
                type="button"
                onClick={setRandomBits}
                className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium col-span-2"
              >
                🎲 Tạo ngẫu nhiên 1 Byte
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <span className="font-semibold text-slate-300 block">Chọn nhanh ký tự ASCII:</span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: 'A (65)', bits: [false, true, false, false, false, false, false, true] },
                { label: 'B (66)', bits: [false, true, false, false, false, false, true, false] },
                { label: '0 (48)', bits: [false, false, true, true, false, false, false, false] },
                { label: '! (33)', bits: [false, false, true, false, false, false, false, true] },
              ].map(item => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onChange({ bits: item.bits as any })}
                  className="py-1 px-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-center font-mono text-[11px]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Logic Gates Mode Controls */
        <>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <span className="font-semibold text-amber-400 block">Chọn loại cổng Logic:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['AND', 'OR', 'NOT', 'XOR', 'NAND'] as LogicGateType[]).map(gate => (
                <button
                  key={gate}
                  type="button"
                  onClick={() => onChange({ gateType: gate })}
                  className={`py-1.5 px-2 rounded-lg font-mono font-bold transition text-center ${
                    state.gateType === gate
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {gate}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
            <span className="font-semibold text-slate-300 block">Công tắc tín hiệu đầu vào:</span>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Tín hiệu A:</span>
              <button
                type="button"
                onClick={() => onChange({ inputA: !state.inputA })}
                className={`px-3 py-1.5 rounded-lg font-bold font-mono transition ${
                  state.inputA
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {state.inputA ? '1 (HIGH)' : '0 (LOW)'}
              </button>
            </div>

            {state.gateType !== 'NOT' && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400">Tín hiệu B:</span>
                <button
                  type="button"
                  onClick={() => onChange({ inputB: !state.inputB })}
                  className={`px-3 py-1.5 rounded-lg font-bold font-mono transition ${
                    state.inputB
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {state.inputB ? '1 (HIGH)' : '0 (LOW)'}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Quest Tracker */}
      <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2 mt-auto">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Nhiệm vụ Tin học</span>
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
