import React from 'react';
import { EntityItem, ComparisonAttribute } from './types';
import { generateComparisonSentence, speakSentence } from './comparativeEngine';
import { Volume2, Trophy, ArrowRight, Zap, Scale, Ruler } from 'lucide-react';

interface ComparativesVisualizerProps {
  items: EntityItem[];
  itemAId: string;
  itemBId: string;
  attribute: ComparisonAttribute;
  isDark: boolean;
}

export const ComparativesVisualizer: React.FC<ComparativesVisualizerProps> = ({
  items,
  itemAId,
  itemBId,
  attribute,
  isDark,
}) => {
  const itemA = items.find(i => i.id === itemAId) || items[0];
  const itemB = items.find(i => i.id === itemBId) || items[1];

  const sentence = generateComparisonSentence(items, itemAId, itemBId, attribute);

  // Lấy giá trị lớn nhất trong nhóm để tính % thanh bar
  const maxVal = Math.max(
    ...items.map(i =>
      attribute === 'speed' ? i.speedKmH : attribute === 'weight' ? i.weightKg : i.heightM
    )
  );

  const getVal = (item: EntityItem) =>
    attribute === 'speed' ? item.speedKmH : attribute === 'weight' ? item.weightKg : item.heightM;

  const getUnit = () =>
    attribute === 'speed' ? 'km/h' : attribute === 'weight' ? 'kg' : 'm';

  const valA = getVal(itemA);
  const valB = getVal(itemB);

  const pctA = Math.max(8, (valA / maxVal) * 100);
  const pctB = Math.max(8, (valB / maxVal) * 100);

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 max-w-4xl mx-auto select-none">
      {/* 1. Header Banner Câu so sánh tự động */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-500/20 backdrop-blur shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Generated Comparative Sentence (So sánh hơn)
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span>{sentence.comparativeEn}</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              👉 {sentence.comparativeVi}
            </p>
          </div>

          <button
            onClick={() => speakSentence(sentence.comparativeEn)}
            className="p-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/25 transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
            title="Nghe phát âm chuẩn (US)"
          >
            <Volume2 className="w-5 h-5" />
            <span className="text-xs font-semibold hidden sm:inline">Phát âm</span>
          </button>
        </div>

        {/* Thẻ công thức ngữ pháp */}
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-400">Quy tắc ngữ pháp:</span>
          <span className="px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-mono">
            S₁ + is/are + {sentence.targetAdjective.base}-er than + S₂
          </span>
          <span className="text-slate-400">({sentence.targetAdjective.base} ➔ {sentence.targetAdjective.comparative})</span>
        </div>
      </div>

      {/* 2. Hai thẻ so sánh Item A vs Item B */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
        {/* Card Item A */}
        <div className={`p-5 rounded-2xl border transition-all ${
          valA >= valB
            ? 'border-sky-500/50 bg-sky-50/50 dark:bg-sky-950/20 shadow-md ring-1 ring-sky-500/30'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-4xl">{itemA.emoji}</span>
            <div className="text-right">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{itemA.nameEn}</h3>
              <span className="text-xs text-slate-500">{itemA.nameVi}</span>
            </div>
          </div>

          {/* Thanh Bar đo chỉ số */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500 capitalize">{attribute}:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                {valA} {getUnit()}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-500"
                style={{ width: `${pctA}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card Item B */}
        <div className={`p-5 rounded-2xl border transition-all ${
          valB > valA
            ? 'border-indigo-500/50 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-md ring-1 ring-indigo-500/30'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-4xl">{itemB.emoji}</span>
            <div className="text-right">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{itemB.nameEn}</h3>
              <span className="text-xs text-slate-500">{itemB.nameVi}</span>
            </div>
          </div>

          {/* Thanh Bar đo chỉ số */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500 capitalize">{attribute}:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                {valB} {getUnit()}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${pctB}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Banner So sánh nhất (Superlative of all) */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-amber-600 dark:text-amber-400">
              Superlative (So sánh nhất trong cả nhóm)
            </span>
            <div className="font-bold text-slate-800 dark:text-white">
              {sentence.superlativeEn}
            </div>
            <div className="text-xs text-slate-500">
              👉 {sentence.superlativeVi}
            </div>
          </div>
        </div>

        <button
          onClick={() => speakSentence(sentence.superlativeEn)}
          className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/25 transition-transform hover:scale-105 active:scale-95"
          title="Nghe câu so sánh nhất"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
