import React, { useState } from 'react';
import { VERBS_DATA, VerbTenseExample, speakSentence } from './comparativeEngine';
import { Volume2, Calendar, Clock, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';

interface PastFutureTimelineProps {
  selectedVerbBase: string;
  onSelectVerb: (verb: string) => void;
  isDark: boolean;
}

export const PastFutureTimeline: React.FC<PastFutureTimelineProps> = ({
  selectedVerbBase,
  onSelectVerb,
  isDark,
}) => {
  const [activeTenseTab, setActiveTenseTab] = useState<'past' | 'will' | 'going-to'>('past');

  const verb = VERBS_DATA.find(v => v.base === selectedVerbBase) || VERBS_DATA[0];

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 max-w-4xl mx-auto select-none">
      {/* 1. Header chọn động từ */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-500" />
          <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">
            Chọn động từ khảo sát:
          </span>
        </div>
        <div className="flex gap-2">
          {VERBS_DATA.map(v => (
            <button
              key={v.base}
              onClick={() => onSelectVerb(v.base)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedVerbBase === v.base
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {v.base}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Trục thời gian ngữ pháp 3 mốc (Quá khứ - Hiện tại - Tương lai) */}
      <div className="my-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="relative flex justify-between items-center mb-8">
          {/* Đường timeline nối */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-sky-400 to-emerald-400 -translate-y-1/2 z-0" />

          {/* Mốc Quá khứ */}
          <button
            onClick={() => setActiveTenseTab('past')}
            className={`relative z-10 flex flex-col items-center gap-1.5 transition-transform ${
              activeTenseTab === 'past' ? 'scale-110' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
              activeTenseTab === 'past' ? 'bg-rose-500 text-white ring-4 ring-rose-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
            }`}>
              -1
            </div>
            <span className="font-bold text-xs text-rose-500">PAST SIMPLE</span>
            <span className="text-[10px] text-slate-400">Yesterday / Last week</span>
          </button>

          {/* Mốc Hiện tại */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 opacity-80">
            <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
              NOW
            </div>
            <span className="font-semibold text-xs text-sky-500">HIỆN TẠI</span>
            <span className="text-[10px] text-slate-400">At the moment</span>
          </div>

          {/* Mốc Tương lai will */}
          <button
            onClick={() => setActiveTenseTab('will')}
            className={`relative z-10 flex flex-col items-center gap-1.5 transition-transform ${
              activeTenseTab === 'will' ? 'scale-110' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
              activeTenseTab === 'will' ? 'bg-indigo-500 text-white ring-4 ring-indigo-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
            }`}>
              +1
            </div>
            <span className="font-bold text-xs text-indigo-500">FUTURE (WILL)</span>
            <span className="text-[10px] text-slate-400">Prediction / Instant</span>
          </button>

          {/* Mốc Tương lai be going to */}
          <button
            onClick={() => setActiveTenseTab('going-to')}
            className={`relative z-10 flex flex-col items-center gap-1.5 transition-transform ${
              activeTenseTab === 'going-to' ? 'scale-110' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
              activeTenseTab === 'going-to' ? 'bg-emerald-500 text-white ring-4 ring-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
            }`}>
              +2
            </div>
            <span className="font-bold text-xs text-emerald-500">BE GOING TO</span>
            <span className="text-[10px] text-slate-400">Planned / Evidence</span>
          </button>
        </div>

        {/* Nội dung chi tiết của thì đang chọn */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {activeTenseTab === 'past'
                  ? 'Quá khứ đơn (Past Simple)'
                  : activeTenseTab === 'will'
                  ? 'Tương lai đơn (Future with Will)'
                  : 'Tương lai gần (Be going to)'}
              </span>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-0.5">
                {activeTenseTab === 'past'
                  ? verb.pastSentence
                  : activeTenseTab === 'will'
                  ? verb.futureWillSentence
                  : verb.futureGoingToSentence}
              </h3>
              <p className="text-xs text-slate-500">
                👉 {activeTenseTab === 'past'
                  ? verb.pastSentenceVi
                  : activeTenseTab === 'will'
                  ? verb.futureWillSentenceVi
                  : verb.futureGoingToSentenceVi}
              </p>
            </div>

            <button
              onClick={() => {
                const text =
                  activeTenseTab === 'past'
                    ? verb.pastSentence
                    : activeTenseTab === 'will'
                    ? verb.futureWillSentence
                    : verb.futureGoingToSentence;
                speakSentence(text);
              }}
              className="p-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20"
              title="Nghe câu"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Công thức và dấu hiệu nhận biết */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40">
              <span className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Công thức khẳng định:
              </span>
              <code className="text-sky-600 dark:text-sky-400 font-mono font-bold">
                {activeTenseTab === 'past'
                  ? 'S + V-ed / V2'
                  : activeTenseTab === 'will'
                  ? 'S + will + V-inf'
                  : 'S + am/is/are + going to + V-inf'}
              </code>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40">
              <span className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Dấu hiệu & Cách dùng:
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                {activeTenseTab === 'past'
                  ? 'Hành động đã hoàn tất trong quá khứ (yesterday, ago, last...)'
                  : activeTenseTab === 'will'
                  ? 'Quyết định ngay lúc nói, lời hứa, dự đoán chủ quan (think, believe...)'
                  : 'Kế hoạch đã sắp đặt từ trước, dự đoán có căn cứ ở hiện tại'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
