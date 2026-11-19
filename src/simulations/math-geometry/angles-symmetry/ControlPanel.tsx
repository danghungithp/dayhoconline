import React from 'react';
import { AnglesSymmetryState, Geometry6Mode, SymmetryShape } from './types';
import { classifyAngle } from './geometry6Engine';
import { Compass, SplitSquareVertical, RotateCw, Check, Eye } from 'lucide-react';

interface ControlPanelProps {
  state: AnglesSymmetryState;
  onChange: (patch: Partial<AnglesSymmetryState>) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange }) => {
  const angleInfo = classifyAngle(state.angleDeg);

  return (
    <div className="flex flex-col gap-4 p-4 text-sm select-none">
      {/* Tab Switcher */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium text-xs">
        <button
          onClick={() => onChange({ mode: 'angles' })}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            state.mode === 'angles'
              ? 'bg-white dark:bg-slate-700 text-sky-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Góc & Thước đo
        </button>
        <button
          onClick={() => onChange({ mode: 'axis-symmetry' })}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            state.mode === 'axis-symmetry'
              ? 'bg-white dark:bg-slate-700 text-pink-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Trục đối xứng
        </button>
        <button
          onClick={() => onChange({ mode: 'center-symmetry' })}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            state.mode === 'center-symmetry'
              ? 'bg-white dark:bg-slate-700 text-purple-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Tâm đối xứng
        </button>
      </div>

      {state.mode === 'angles' ? (
        /* ================= TAB GÓC ================= */
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Số đo góc (xOy):
              </span>
              <span className="font-mono text-sm font-bold text-sky-500">
                {state.angleDeg}°
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={state.angleDeg}
              onChange={e => onChange({ angleDeg: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />

            {/* Quick buttons */}
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {[
                { label: '0°', deg: 0 },
                { label: '45° (Nhọn)', deg: 45 },
                { label: '90° (Vuông)', deg: 90 },
                { label: '135° (Tù)', deg: 135 },
                { label: '180° (Bẹt)', deg: 180 },
                { label: '270° (Phản)', deg: 270 },
                { label: '360° (Đầy)', deg: 360 },
              ].map(item => (
                <button
                  key={item.deg}
                  onClick={() => onChange({ angleDeg: item.deg })}
                  className={`py-1 text-xs rounded-lg border font-mono transition-all ${
                    state.angleDeg === item.deg
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 pt-1 border-t border-slate-200 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={state.showProtractor}
                onChange={e => onChange({ showProtractor: e.target.checked })}
                className="rounded text-sky-500 focus:ring-sky-400"
              />
              <span>Thước đo độ tròn 360° (Protractor)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={state.showAngleArc}
                onChange={e => onChange({ showAngleArc: e.target.checked })}
                className="rounded text-sky-500 focus:ring-sky-400"
              />
              <span>Tô màu cung góc xOy</span>
            </label>
          </div>

          {/* Phân loại góc */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Phân loại:</span>
              <span className="font-bold text-sky-600 dark:text-sky-400">{angleInfo.nameVi}</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-200 dark:border-slate-700">
              {angleInfo.descriptionVi}
            </p>
          </div>
        </div>
      ) : state.mode === 'axis-symmetry' ? (
        /* ================= TAB TRỤC ĐỐI XỨNG ================= */
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Chọn hình mẫu đối xứng:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'heart', label: '❤️ Trái tim' },
                { id: 'butterfly', label: '🦋 Bướm' },
                { id: 'letter-A', label: '🅰️ Chữ A' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => onChange({ symmetryShape: item.id as SymmetryShape })}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold border text-center transition-all ${
                    state.symmetryShape === item.id
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Gấp hình theo trục d:
              </span>
              <span className="font-mono text-sm font-bold text-pink-500">
                {Math.round(state.foldProgress * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1.0"
              step="0.05"
              value={state.foldProgress}
              onChange={e => onChange({ foldProgress: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 text-xs text-pink-700 dark:text-pink-300 space-y-1">
            <span className="font-semibold block">Định nghĩa Hình có trục đối xứng:</span>
            <p className="text-[11px] leading-relaxed">
              Đường thẳng $d$ là trục đối xứng của một hình nếu khi gấp hình theo đường thẳng $d$, hai phần của hình đó <strong>trùng khít lên nhau</strong>.
            </p>
          </div>
        </div>
      ) : (
        /* ================= TAB TÂM ĐỐI XỨNG ================= */
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Góc xoay quanh tâm O:
              </span>
              <span className="font-mono text-sm font-bold text-purple-500">
                {state.rotationAngleDeg}°
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={state.rotationAngleDeg}
              onChange={e => onChange({ rotationAngleDeg: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <button
            onClick={() => onChange({ rotationAngleDeg: state.rotationAngleDeg === 180 ? 0 : 180 })}
            className="py-2.5 px-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20"
          >
            <RotateCw className="w-4 h-4" />
            <span>{state.rotationAngleDeg === 180 ? 'Xoay về 0°' : 'Xoay 180° trùng khít'}</span>
          </button>

          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs text-purple-700 dark:text-purple-300 space-y-1">
            <span className="font-semibold block">Định nghĩa Hình có tâm đối xứng:</span>
            <p className="text-[11px] leading-relaxed">
              Điểm $O$ là tâm đối xứng của một hình nếu khi quay hình đó <strong>xung quanh điểm O đúng 180°</strong> thì hình đó trùng khít với chính nó ban đầu.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
