import React from 'react';
import { GeneticsState, PlantTrait, BiologyMode } from './types';
import { CrossResult, CELL_ORGANELLES } from './geneticsEngine';
import { Quest } from '../../../types/simulation.types';
import { Dna, Flower2, Microscope, Sparkles, CheckCircle2 } from 'lucide-react';

interface ControlPanelProps {
  state: GeneticsState;
  onChange: (patch: Partial<GeneticsState>) => void;
  crossResult: CrossResult;
  quests?: Quest[];
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  onChange,
  crossResult,
  quests = [],
}) => {
  const isMendel = state.mode === 'mendel';

  const setP1Genotype = (g: string) => {
    onChange({ p1Alleles: [g[0], g[1]] as [string, string] });
  };

  const setP2Genotype = (g: string) => {
    onChange({ p2Alleles: [g[0], g[1]] as [string, string] });
  };

  const p1Str = state.p1Alleles.join('');
  const p2Str = state.p2Alleles.join('');

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 p-4 space-y-4 overflow-y-auto text-xs text-slate-200">
      {/* 1. Mode Switcher */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
          Chế độ bài học Sinh học:
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ mode: 'mendel' })}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl font-bold transition ${
              isMendel
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Flower2 className="w-3.5 h-3.5" />
            <span>Lai Men-đen (Punnett)</span>
          </button>
          <button
            type="button"
            onClick={() => onChange({ mode: 'cell', selectedOrganelle: 'nucleus' })}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl font-bold transition ${
              !isMendel
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Microscope className="w-3.5 h-3.5" />
            <span>Cấu tạo Tế bào</span>
          </button>
        </div>
      </div>

      {isMendel ? (
        <>
          {/* 2. Trait Selector */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <span className="font-semibold text-slate-300">Tính trạng thí nghiệm:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    trait: 'flower-color',
                    p1Alleles: ['A', 'a'],
                    p2Alleles: ['A', 'a'],
                  })
                }
                className={`py-1.5 px-2 rounded-lg text-center font-medium transition ${
                  state.trait === 'flower-color'
                    ? 'bg-pink-950 text-pink-300 border border-pink-700 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                Hoa Tím / Trắng (A/a)
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    trait: 'seed-shape',
                    p1Alleles: ['B', 'b'],
                    p2Alleles: ['B', 'b'],
                  })
                }
                className={`py-1.5 px-2 rounded-lg text-center font-medium transition ${
                  state.trait === 'seed-shape'
                    ? 'bg-yellow-950 text-yellow-300 border border-yellow-700 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                Hạt Vàng / Xanh (B/b)
              </button>
            </div>
          </div>

          {/* 3. Parent 1 & 2 Genotypes */}
          <div className="space-y-3 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-cyan-400">Kiểu gen P (Bố ♂):</span>
              <span className="font-mono font-bold text-white bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                {p1Str}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {state.trait === 'flower-color'
                ? ['AA', 'Aa', 'aa'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setP1Genotype(g)}
                      className={`py-1.5 rounded font-mono font-bold transition ${
                        p1Str === g
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))
                : ['BB', 'Bb', 'bb'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setP1Genotype(g)}
                      className={`py-1.5 rounded font-mono font-bold transition ${
                        p1Str === g
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="font-semibold text-rose-400">Kiểu gen P (Mẹ ♀):</span>
              <span className="font-mono font-bold text-white bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                {p2Str}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {state.trait === 'flower-color'
                ? ['AA', 'Aa', 'aa'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setP2Genotype(g)}
                      className={`py-1.5 rounded font-mono font-bold transition ${
                        p2Str === g
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))
                : ['BB', 'Bb', 'bb'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setP2Genotype(g)}
                      className={`py-1.5 rounded font-mono font-bold transition ${
                        p2Str === g
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
            </div>
          </div>

          {/* 4. Display Toggles */}
          <div className="flex items-center justify-between p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={state.showGenotypes}
                onChange={e => onChange({ showGenotypes: e.target.checked })}
                className="rounded accent-indigo-600"
              />
              <span>Hiện Kiểu gen</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={state.showPhenotypes}
                onChange={e => onChange({ showPhenotypes: e.target.checked })}
                className="rounded accent-indigo-600"
              />
              <span>Hiện Kiểu hình</span>
            </label>
          </div>
        </>
      ) : (
        /* Cell Anatomy Controls */
        <div className="space-y-3 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
          <span className="font-semibold text-emerald-400 block mb-1">Chọn nhanh bào quan để học:</span>
          <div className="space-y-1.5">
            {CELL_ORGANELLES.filter(o => o.id !== 'membrane').map(org => (
              <button
                key={org.id}
                type="button"
                onClick={() => onChange({ selectedOrganelle: org.id })}
                className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between transition ${
                  state.selectedOrganelle === org.id
                    ? 'bg-emerald-950 text-white border border-emerald-700 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{org.nameVi}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: org.color }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. Quest Tracker */}
      <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2 mt-auto">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Nhiệm vụ Sinh học</span>
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
