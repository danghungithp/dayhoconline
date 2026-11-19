import React from 'react';
import { Minus, Plus, RotateCcw, CheckCircle2, Circle, Lightbulb, Atom, FlaskConical } from 'lucide-react';
import { AtomAnalysisResult } from './physicsEngine';
import { ELEMENTS_DATA, MOLECULE_PRESETS, MoleculePreset } from './elementsData';
import { CustomQuestItem, QuestEvaluationResult } from '../../../types/assignment.types';

interface ControlPanelProps {
  mode: 'atom' | 'molecule';
  onModeChange: (mode: 'atom' | 'molecule') => void;
  protons: number;
  neutrons: number;
  electrons: number;
  onChangeParticle: (type: 'protons' | 'neutrons' | 'electrons', delta: number) => void;
  onSelectElement: (z: number) => void;
  onReset: () => void;
  analysis: AtomAnalysisResult;
  atomCounts: Record<string, number>;
  activeMolecule: MoleculePreset | null;
  onSelectMoleculePreset: (preset: MoleculePreset) => void;
  onChangeMoleculeAtom: (symbol: string, delta: number) => void;
  quests: CustomQuestItem[];
  questResults: QuestEvaluationResult[];
  activeQuestId: string;
  onSelectQuest: (id: string) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  mode,
  onModeChange,
  protons,
  neutrons,
  electrons,
  onChangeParticle,
  onSelectElement,
  onReset,
  analysis,
  atomCounts,
  activeMolecule,
  onSelectMoleculePreset,
  onChangeMoleculeAtom,
  quests,
  questResults,
  activeQuestId,
  onSelectQuest,
}) => {
  const activeQuest = quests.find((q) => q.id === activeQuestId) ?? quests[0];
  const [showHint, setShowHint] = React.useState(false);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors duration-200">
      {/* Chuyển chế độ */}
      <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 p-1">
        <button
          type="button"
          onClick={() => onModeChange('atom')}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
            mode === 'atom' ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-cyan-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Atom className="h-3.5 w-3.5" />
          Nguyên tử & Ion
        </button>
        <button
          type="button"
          onClick={() => onModeChange('molecule')}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
            mode === 'molecule' ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-cyan-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <FlaskConical className="h-3.5 w-3.5" />
          Ghép phân tử
        </button>
      </div>

      {mode === 'atom' ? (
        <>
          {/* Thẻ thông số nguyên tử */}
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 text-center">
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Ký hiệu</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">{analysis.symbol}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Số khối A</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">{analysis.massNumber}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Điện tích</div>
              <div
                className={`text-sm font-bold leading-7 ${
                  analysis.charge > 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : analysis.charge < 0
                      ? 'text-sky-600 dark:text-sky-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                }`}
              >
                {analysis.chargeFormatted}
              </div>
            </div>
          </div>

          {/* Điều khiển hạt */}
          <div className="space-y-2.5">
            {(
              [
                { key: 'protons', label: 'Proton (+)', value: protons, dotColor: 'bg-red-500' },
                { key: 'neutrons', label: 'Neutron (0)', value: neutrons, dotColor: 'bg-slate-400' },
                { key: 'electrons', label: 'Electron (-)', value: electrons, dotColor: 'bg-sky-400' },
              ] as const
            ).map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${item.dotColor}`} />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onChangeParticle(item.key, -1)}
                    className="rounded-md border border-slate-300 dark:border-slate-700 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    aria-label={`Giảm ${item.label}`}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-7 text-center text-sm font-bold text-slate-900 dark:text-white">{item.value}</span>
                  <button
                    type="button"
                    onClick={() => onChangeParticle(item.key, 1)}
                    className="rounded-md border border-slate-300 dark:border-slate-700 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    aria-label={`Tăng ${item.label}`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Chọn nhanh nguyên tố & Reset */}
          <div className="flex items-center gap-2">
            <select
              value={analysis.element?.z ?? ''}
              onChange={(e) => {
                const z = Number(e.target.value);
                if (z > 0) onSelectElement(z);
              }}
              className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-200"
            >
              <option value="">-- Chọn nhanh nguyên tố trung hòa --</option>
              {ELEMENTS_DATA.map((el) => (
                <option key={el.z} value={el.z}>
                  {el.z}. {el.nameVi} ({el.symbol})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Chế độ ghép phân tử */}
          <div>
            <div className="mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">Phân tử mẫu</div>
            <div className="flex flex-wrap gap-1.5">
              {MOLECULE_PRESETS.map((preset) => (
                <button
                  key={preset.formula}
                  type="button"
                  onClick={() => onSelectMoleculePreset(preset)}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                    activeMolecule?.formula === preset.formula
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {preset.formula}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Đếm nguyên tử thành phần</div>
            {['H', 'C', 'N', 'O', 'Na', 'Cl'].map((sym) => (
              <div
                key={sym}
                className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 px-3 py-1.5 text-xs"
              >
                <span className="font-bold text-slate-800 dark:text-slate-200">{sym}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onChangeMoleculeAtom(sym, -1)}
                    className="rounded border border-slate-300 dark:border-slate-700 p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-5 text-center font-semibold text-slate-900 dark:text-white">{atomCounts[sym] ?? 0}</span>
                  <button
                    type="button"
                    onClick={() => onChangeMoleculeAtom(sym, 1)}
                    className="rounded border border-slate-300 dark:border-slate-700 p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Nhiệm vụ tự đánh giá */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
            Nhiệm vụ thực hành
          </span>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            {questResults.filter((r) => r.completed).length}/{quests.length} hoàn thành
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {quests.map((q, idx) => {
            const done = questResults.find((r) => r.questId === q.id)?.completed;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  onSelectQuest(q.id);
                  setShowHint(false);
                }}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition ${
                  activeQuest?.id === q.id
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                    : done
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Circle className="h-3.5 w-3.5" />
                )}
                Bài {idx + 1}
              </button>
            );
          })}
        </div>

        {activeQuest && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 text-xs space-y-2">
            <div className="font-bold text-slate-800 dark:text-white">{activeQuest.title}</div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{activeQuest.instruction}</p>
            {activeQuest.hint && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowHint((v) => !v)}
                  className="inline-flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400 hover:underline"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  {showHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}
                </button>
                {showHint && (
                  <p className="mt-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 p-2 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/60">
                    {activeQuest.hint}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
