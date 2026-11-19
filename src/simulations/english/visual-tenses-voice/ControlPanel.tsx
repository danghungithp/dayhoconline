import React from 'react';
import { 
  Clock, 
  ArrowLeftRight, 
  BookOpen, 
  AlertCircle, 
  Sparkles, 
  Check, 
  HelpCircle,
  Filter
} from 'lucide-react';
import { 
  TenseId, 
  TENSES_DATA, 
  PASSIVE_TEMPLATES, 
  IRREGULAR_VERBS, 
  SchoolLevel 
} from './grammarEngine';

interface ControlPanelProps {
  mode: 'timeline' | 'transformer';
  selectedTense: TenseId;
  passiveTenseKey: string;
  isPassiveVoice: boolean;
  selectedVerbBase: string;
  selectedLevelFilter: SchoolLevel | 'ALL';
  onSetMode: (mode: 'timeline' | 'transformer') => void;
  onSelectTense: (tense: TenseId) => void;
  onSelectPassiveTenseKey: (key: string) => void;
  onTogglePassiveVoice: () => void;
  onSelectVerbBase: (verb: string) => void;
  onSetLevelFilter: (lvl: SchoolLevel | 'ALL') => void;
  onReset: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  mode,
  selectedTense,
  passiveTenseKey,
  isPassiveVoice,
  selectedVerbBase,
  selectedLevelFilter,
  onSetMode,
  onSelectTense,
  onSelectPassiveTenseKey,
  onTogglePassiveVoice,
  onSelectVerbBase,
  onSetLevelFilter,
  onReset,
}) => {
  const currentTense = TENSES_DATA[selectedTense];

  const tensesList = Object.values(TENSES_DATA).filter(t => {
    if (selectedLevelFilter === 'ALL') return true;
    return t.level === selectedLevelFilter;
  });

  return (
    <div className="space-y-4 text-xs select-none">
      {/* 1. Bộ chuyển đổi Chế Độ Học */}
      <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950 border border-slate-800">
        <button
          onClick={() => onSetMode('timeline')}
          className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
            mode === 'timeline'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Trục thời gian các thì</span>
        </button>

        <button
          onClick={() => onSetMode('transformer')}
          className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
            mode === 'transformer'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Chủ động ↔ Bị động</span>
        </button>
      </div>

      {mode === 'timeline' ? (
        /* =========================================================================
           PANEL CHO CHẾ ĐỘ 1: TRỤC THỜI GIAN
           ========================================================================= */
        <>
          {/* Bộ lọc Cấp học THCS / THPT */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px]">
              <Filter className="w-3 h-3 text-cyan-400" />
              Lọc cấp học:
            </span>
            <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
              <button
                onClick={() => onSetLevelFilter('ALL')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                  selectedLevelFilter === 'ALL' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => onSetLevelFilter('THCS')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                  selectedLevelFilter === 'THCS' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                THCS (Lớp 6-9)
              </button>
              <button
                onClick={() => onSetLevelFilter('THPT')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                  selectedLevelFilter === 'THPT' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                THPT (Lớp 10-12)
              </button>
            </div>
          </div>

          {/* Danh sách 8 thì cốt lõi */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-bold text-white text-xs block">
              Chọn thì cần khảo sát trên trục ({tensesList.length}):
            </span>

            <div className="grid grid-cols-1 gap-1.5 max-h-52 overflow-y-auto pr-1">
              {tensesList.map(t => (
                <button
                  key={t.id}
                  onClick={() => onSelectTense(t.id)}
                  className={`p-2.5 rounded-xl text-left border transition ${
                    selectedTense === t.id
                      ? 'bg-cyan-950/80 border-cyan-500 text-white font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{t.nameEn}</span>
                    <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-900">
                      {t.level}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5 font-normal">
                    {t.nameVi}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Công thức cấu trúc ngữ pháp */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <span className="font-bold text-white text-xs flex items-center gap-1.5 text-cyan-400">
              <BookOpen className="w-3.5 h-3.5" />
              Công thức ngữ pháp chuẩn ({currentTense.nameEn}):
            </span>

            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-emerald-400 font-bold">(+) Khẳng định:</span>
                <span className="text-white font-bold">{currentTense.formula.affirmative}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-rose-400 font-bold">(-) Phủ định:</span>
                <span className="text-white">{currentTense.formula.negative}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-amber-400 font-bold">(?) Nghi vấn:</span>
                <span className="text-white">{currentTense.formula.interrogative}</span>
              </div>
            </div>
          </div>

          {/* Lưu ý lỗi học sinh Việt Nam hay mắc phải */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/50 space-y-2">
            <span className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              Lưu ý lỗi học sinh Việt Nam hay gặp:
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed italic bg-slate-950/60 p-2.5 rounded-xl border border-amber-900/40">
              ⚠️ {currentTense.vietnamesePitfalls}
            </p>
          </div>
        </>
      ) : (
        /* =========================================================================
           PANEL CHO CHẾ ĐỘ 2: ACTIVE ↔ PASSIVE TRANSFORMER
           ========================================================================= */
        <>
          {/* Chọn thì để chuyển đổi Bị động */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">
                Chọn thì cần biến đổi:
              </span>
              <button
                onClick={onTogglePassiveVoice}
                className="text-[11px] text-purple-400 hover:underline font-bold"
              >
                {isPassiveVoice ? 'Xem Chủ động' : 'Xem Bị động'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {Object.entries(PASSIVE_TEMPLATES).map(([key, tpl]) => (
                <button
                  key={key}
                  onClick={() => onSelectPassiveTenseKey(key)}
                  className={`p-2.5 rounded-xl text-left border transition ${
                    passiveTenseKey === key
                      ? 'bg-purple-950/80 border-purple-500 text-white font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{tpl.tenseName}</span>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-1.5 py-0.2 rounded border border-purple-800">
                      be: {tpl.passiveBeForm(false)} / {tpl.passiveBeForm(true)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chọn Động từ bất quy tắc (V1 - V2 - V3) */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-bold text-white text-xs block">
              Bảng động từ bất quy tắc thực hành (V1 - V2 - V3):
            </span>

            <div className="grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto pr-1">
              {Object.values(IRREGULAR_VERBS).map(verb => (
                <button
                  key={verb.base}
                  onClick={() => onSelectVerbBase(verb.base)}
                  className={`p-2 rounded-lg text-center border font-mono text-[11px] transition ${
                    selectedVerbBase === verb.base
                      ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="block font-bold">{verb.base}</span>
                  <span className="text-[9px] text-slate-400 block font-sans truncate">
                    {verb.pastParticiple}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Ghi chú quy tắc vàng về câu Bị Động */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-[11px] text-slate-300">
            <span className="font-bold text-cyan-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Quy tắc vàng câu Bị động (Passive Voice):
            </span>
            <ul className="list-disc pl-4 space-y-1 text-slate-400 leading-relaxed">
              <li>Chủ ngữ mới lấy từ <strong>Tân ngữ</strong> câu chủ động.</li>
              <li>Động từ <strong>to be</strong> chia theo thì của câu gốc và số của chủ ngữ mới.</li>
              <li>Động từ chính <strong>luôn luôn</strong> ở dạng Quá khứ phân từ <strong>(V3/V-ed)</strong>.</li>
              <li>Nếu chủ ngữ cũ là đại từ chung (someone, people...), có thể <strong>lược bỏ</strong> "by...".</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
