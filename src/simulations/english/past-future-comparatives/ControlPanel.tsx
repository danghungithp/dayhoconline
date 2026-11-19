import React from 'react';
import { PastFutureState, ComparativeCategory, ComparisonAttribute } from './types';
import { ANIMALS, VEHICLES, speakSentence } from './comparativeEngine';
import { 
  Sparkles, 
  Clock, 
  Volume2, 
  Zap, 
  Scale, 
  Ruler, 
  Check, 
  HelpCircle,
  Mic
} from 'lucide-react';

interface ControlPanelProps {
  state: PastFutureState;
  onChange: (patch: Partial<PastFutureState>) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  onChange,
}) => {
  const items = state.category === 'animals' ? ANIMALS : VEHICLES;

  return (
    <div className="flex flex-col gap-4 p-4 text-sm select-none">
      {/* Tab Switcher */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium text-xs">
        <button
          onClick={() => onChange({ activeTab: 'comparatives' })}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
            state.activeTab === 'comparatives'
              ? 'bg-white dark:bg-slate-700 text-sky-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>So sánh hơn & nhất</span>
        </button>
        <button
          onClick={() => onChange({ activeTab: 'past-future' })}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
            state.activeTab === 'past-future'
              ? 'bg-white dark:bg-slate-700 text-indigo-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Quá khứ & Tương lai</span>
        </button>
      </div>

      {state.activeTab === 'comparatives' ? (
        /* ================= TAB SO SÁNH ================= */
        <div className="flex flex-col gap-4">
          {/* Nhóm đối tượng */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Chủ đề khảo sát:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onChange({
                    category: 'animals',
                    itemAId: 'cheetah',
                    itemBId: 'elephant',
                  });
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  state.category === 'animals'
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                🐾 Thế giới Động vật
              </button>
              <button
                onClick={() => {
                  onChange({
                    category: 'vehicles',
                    itemAId: 'airplane',
                    itemBId: 'train',
                  });
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  state.category === 'vehicles'
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                🚄 Phương tiện Giao thông
              </button>
            </div>
          </div>

          {/* Tiêu chí so sánh */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Tiêu chí so sánh (Attribute):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'speed', label: 'Tốc độ (Speed)', icon: Zap },
                { id: 'weight', label: 'Cân nặng (Weight)', icon: Scale },
                { id: 'height', label: 'Chiều cao (Height)', icon: Ruler },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onChange({ attribute: item.id as ComparisonAttribute })}
                    className={`py-2 px-2 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                      state.attribute === item.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chọn Item A và Item B */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Đối tượng A (Chủ ngữ 1):
              </span>
              <select
                value={state.itemAId}
                onChange={e => onChange({ itemAId: e.target.value })}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-white"
              >
                {items.map(it => (
                  <option key={it.id} value={it.id}>
                    {it.emoji} {it.nameEn} ({it.nameVi})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Đối tượng B (Chủ ngữ 2):
              </span>
              <select
                value={state.itemBId}
                onChange={e => onChange({ itemBId: e.target.value })}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-white"
              >
                {items.map(it => (
                  <option key={it.id} value={it.id}>
                    {it.emoji} {it.nameEn} ({it.nameVi})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ghi chú ngữ pháp lớp 7 */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300 block">
              Bí kíp so sánh tiếng Anh 7:
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              - <strong>Tính từ ngắn (1 âm tiết):</strong> thêm đuôi <code>-er</code> (so sánh hơn) hoặc <code>-est</code> (so sánh nhất). Ví dụ: <em>fast ➔ faster ➔ the fastest</em>.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              - <strong>Tận cùng bằng "y":</strong> đổi thành <code>-ier</code>. Ví dụ: <em>heavy ➔ heavier ➔ the heaviest</em>.
            </p>
          </div>
        </div>
      ) : (
        /* ================= TAB QUÁ KHỨ & TƯƠNG LAI ================= */
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Chọn thì ngữ pháp:
            </label>
            <div className="space-y-2">
              {[
                { id: 'past-simple', label: 'Quá khứ đơn (Past Simple)' },
                { id: 'future-will', label: 'Tương lai với Will (Quyết định tức thì)' },
                { id: 'future-going-to', label: 'Tương lai gần (Be going to - Kế hoạch)' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => onChange({ selectedTense: t.id as any })}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-medium text-left transition-all ${
                    state.selectedTense === t.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
            <span className="font-semibold block">Gợi ý phân biệt Will vs Be going to:</span>
            <p className="text-[11px] leading-relaxed">
              - <strong>Will:</strong> dùng khi đưa ra quyết định ngay tại thời điểm nói hoặc dự đoán không có bằng chứng rõ ràng (<em>"I think it will rain."</em>).
            </p>
            <p className="text-[11px] leading-relaxed">
              - <strong>Be going to:</strong> dùng cho kế hoạch, dự định đã lên lịch trước hoặc dự đoán có dấu hiệu hiển nhiên (<em>"Look at those dark clouds! It is going to rain."</em>).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
