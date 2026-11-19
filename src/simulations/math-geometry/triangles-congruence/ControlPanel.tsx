import React from 'react';
import { TriangleState } from './types';
import { analyzeTriangle, checkCongruence } from './geometrySolver';
import { 
  GitCommit, 
  Layers, 
  Compass, 
  CircleDot, 
  Square, 
  CheckCircle2, 
  ChevronRight,
  Eye
} from 'lucide-react';

interface ControlPanelProps {
  state: TriangleState;
  onChange: (patch: Partial<TriangleState>) => void;
  onSetRightTriangle: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  onChange,
  onSetRightTriangle,
}) => {
  const t1 = analyzeTriangle(state.A, state.B, state.C);
  const t2 = analyzeTriangle(state.A2, state.B2, state.C2);
  const congResult = checkCongruence(t1, t2);

  return (
    <div className="flex flex-col gap-4 p-4 text-sm select-none">
      {/* Tab Switcher */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium text-xs">
        <button
          onClick={() => onChange({ activeTab: 'concurrence' })}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            state.activeTab === 'concurrence'
              ? 'bg-white dark:bg-slate-700 text-sky-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          4 Đường đồng quy
        </button>
        <button
          onClick={() => onChange({ activeTab: 'congruence' })}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            state.activeTab === 'congruence'
              ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Tam giác bằng nhau
        </button>
        <button
          onClick={() => onChange({ activeTab: 'pythagoras' })}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            state.activeTab === 'pythagoras'
              ? 'bg-white dark:bg-slate-700 text-rose-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          ĐL Pythagore
        </button>
      </div>

      {state.activeTab === 'concurrence' && (
        /* ================= TAB 4 ĐƯỜNG ĐỒNG QUY ================= */
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Hiển thị các đường đặc biệt:
          </label>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={state.showMedians}
                onChange={e => onChange({ showMedians: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-400"
              />
              <span className="font-medium text-amber-600 dark:text-amber-400">
                3 đường trung tuyến (Trọng tâm G)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={state.showAngleBisectors}
                onChange={e => onChange({ showAngleBisectors: e.target.checked })}
                className="rounded text-pink-500 focus:ring-pink-400"
              />
              <span className="font-medium text-pink-600 dark:text-pink-400">
                3 đường phân giác (Tâm nội tiếp I)
              </span>
            </label>

            {state.showAngleBisectors && (
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 pl-5">
                <input
                  type="checkbox"
                  checked={state.showIncircle}
                  onChange={e => onChange({ showIncircle: e.target.checked })}
                  className="rounded text-pink-500 focus:ring-pink-400"
                />
                <span>Đường tròn nội tiếp (I, r = {t1.inradius}px)</span>
              </label>
            )}

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={state.showPerpendicularBisectors}
                onChange={e => onChange({ showPerpendicularBisectors: e.target.checked })}
                className="rounded text-cyan-500 focus:ring-cyan-400"
              />
              <span className="font-medium text-cyan-600 dark:text-cyan-400">
                3 đường trung trực (Tâm ngoại tiếp O)
              </span>
            </label>

            {state.showPerpendicularBisectors && (
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 pl-5">
                <input
                  type="checkbox"
                  checked={state.showCircumcircle}
                  onChange={e => onChange({ showCircumcircle: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-cyan-400"
                />
                <span>Đường tròn ngoại tiếp (O, R = {t1.circumradius}px)</span>
              </label>
            )}

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={state.showAltitudes}
                onChange={e => onChange({ showAltitudes: e.target.checked })}
                className="rounded text-purple-500 focus:ring-purple-400"
              />
              <span className="font-medium text-purple-600 dark:text-purple-400">
                3 đường cao (Trực tâm H)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-800">
              <input
                type="checkbox"
                checked={state.showEulerLine}
                onChange={e => onChange({ showEulerLine: e.target.checked })}
                className="rounded text-rose-500 focus:ring-rose-400"
              />
              <span className="font-medium text-rose-500">
                Đường thẳng Euler (O - G - H thẳng hàng)
              </span>
            </label>
          </div>

          {/* Bảng số đo góc và cạnh */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1 text-xs">
            <div className="font-semibold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-200 dark:border-slate-700">
              Kích thước hình học ΔABC:
            </div>
            <div className="grid grid-cols-3 gap-1 font-mono text-center pt-1">
              <div>a = {t1.sideA}px</div>
              <div>b = {t1.sideB}px</div>
              <div>c = {t1.sideC}px</div>
            </div>
            <div className="grid grid-cols-3 gap-1 font-mono text-center text-sky-500">
              <div>Â = {t1.angleA}°</div>
              <div>B̂ = {t1.angleB}°</div>
              <div>Ĉ = {t1.angleC}°</div>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 text-slate-500">
              <span>Diện tích S:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{t1.area} px²</span>
            </div>
          </div>
        </div>
      )}

      {state.activeTab === 'congruence' && (
        /* ================= TAB TAM GIÁC BẰNG NHAU ================= */
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onChange({ isSuperimposed: !state.isSuperimposed })}
            className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
              state.isSuperimposed
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{state.isSuperimposed ? 'Tách rời 2 tam giác' : 'Chồng khít 2 tam giác'}</span>
          </button>

          {/* Trạng thái bằng nhau */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <CheckCircle2 className={`w-4 h-4 ${congResult.isCongruent ? 'text-emerald-500' : 'text-amber-500'}`} />
              <span>{congResult.isCongruent ? 'HAI TAM GIÁC BẰNG NHAU' : 'CHƯA BẰNG NHAU'}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              {congResult.reasonVi}
            </p>
          </div>

          <div className="space-y-1 text-xs">
            <div className="font-medium text-slate-500">Quy tắc tam giác bằng nhau cần nhớ:</div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400 text-[11px]">
              <li><strong>c-c-c:</strong> 3 cạnh bằng nhau từng đôi một.</li>
              <li><strong>c-g-c:</strong> 2 cạnh và góc xen giữa bằng nhau.</li>
              <li><strong>g-c-g:</strong> 1 cạnh và 2 góc kề bằng nhau.</li>
              <li><strong>Tam giác vuông:</strong> Cạnh huyền - góc nhọn, cạnh huyền - cạnh góc vuông.</li>
            </ul>
          </div>
        </div>
      )}

      {state.activeTab === 'pythagoras' && (
        /* ================= TAB ĐỊNH LÝ PYTHAGORE ================= */
        <div className="flex flex-col gap-4">
          <button
            onClick={onSetRightTriangle}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5"
          >
            <Square className="w-4 h-4" />
            <span>Tạo nhanh Tam giác vuông (Â = 90°)</span>
          </button>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={state.showPythagorasSquares}
              onChange={e => onChange({ showPythagorasSquares: e.target.checked })}
              className="rounded text-rose-500 focus:ring-rose-400"
            />
            <span>Dựng 3 hình vuông trên các cạnh tam giác</span>
          </label>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              Kiểm chứng Định lý Pythagore:
            </div>
            <div className="font-mono text-center space-y-1">
              <div>b² = {(t1.sideB * t1.sideB).toFixed(0)}</div>
              <div>c² = {(t1.sideC * t1.sideC).toFixed(0)}</div>
              <div className="text-emerald-500 font-bold">
                b² + c² = {(t1.sideB * t1.sideB + t1.sideC * t1.sideC).toFixed(0)}
              </div>
              <div className="text-rose-500 font-bold">
                a² (Cạnh huyền) = {(t1.sideA * t1.sideA).toFixed(0)}
              </div>
            </div>
            <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200 dark:border-slate-700">
              {t1.isRightTriangle
                ? '✅ Tam giác vuông! Diện tích hình vuông trên cạnh huyền bằng tổng diện tích hai hình vuông trên hai cạnh góc vuông.'
                : 'Tam giác chưa vuông. Hãy kéo đỉnh hoặc bấm "Tạo nhanh Tam giác vuông" để kiểm chứng.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
