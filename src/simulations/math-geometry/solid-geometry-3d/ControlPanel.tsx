import React from 'react';
import { 
  Box, 
  Pyramid, 
  Cylinder as CylinderIcon, 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  Layers, 
  Grid, 
  Sparkles, 
  Calculator, 
  HelpCircle,
  Plus,
  Minus
} from 'lucide-react';
import { SolidType, SolidGeometryOutput } from './geometryMath';

interface ControlPanelProps {
  solidType: SolidType;
  baseDimension: number;
  height: number;
  unfoldProgress: number;
  outputs: SolidGeometryOutput;
  showLabels: boolean;
  showAltitude: boolean;
  showWireframe: boolean;
  showGrid: boolean;
  opacity: number;
  isAutoUnfolding: boolean;
  onSetSolidType: (type: SolidType) => void;
  onSetBaseDimension: (val: number) => void;
  onSetHeight: (val: number) => void;
  onSetUnfoldProgress: (val: number) => void;
  onToggleLabels: () => void;
  onToggleAltitude: () => void;
  onToggleWireframe: () => void;
  onToggleGrid: () => void;
  onSetOpacity: (val: number) => void;
  onToggleAutoUnfold: () => void;
  onReset: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  solidType,
  baseDimension,
  height,
  unfoldProgress,
  outputs,
  showLabels,
  showAltitude,
  showWireframe,
  showGrid,
  opacity,
  isAutoUnfolding,
  onSetSolidType,
  onSetBaseDimension,
  onSetHeight,
  onSetUnfoldProgress,
  onToggleLabels,
  onToggleAltitude,
  onToggleWireframe,
  onToggleGrid,
  onSetOpacity,
  onToggleAutoUnfold,
  onReset,
}) => {
  const isCircular = solidType === 'cylinder' || solidType === 'cone';
  const dimLabel = isCircular ? 'Bán kính đáy (r)' : 'Cạnh đáy (a)';

  const solidOptions: { id: SolidType; label: string; icon: string }[] = [
    { id: 'square-pyramid', label: 'Chóp tứ giác đều', icon: '▲' },
    { id: 'triangular-pyramid', label: 'Chóp tam giác đều', icon: '▲' },
    { id: 'triangular-prism', label: 'Lăng trụ tam giác', icon: '⬡' },
    { id: 'cylinder', label: 'Hình trụ', icon: '◎' },
    { id: 'cone', label: 'Hình nón', icon: '▽' },
  ];

  return (
    <div className="space-y-4 text-xs select-none">
      {/* 1. Chọn Khối Hình Học 3D */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-xs flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-cyan-400" />
            Chọn loại khối hình học (SGK GDPT):
          </span>
          <button
            onClick={onReset}
            title="Đặt lại kích thước chuẩn"
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đặt lại</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {solidOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => onSetSolidType(opt.id)}
              className={`p-2 rounded-xl text-left border text-[11px] font-semibold transition ${
                solidType === opt.id
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-md'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-cyan-400 font-mono">{opt.icon}</span>
                <span className="truncate">{opt.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Thanh trượt Trải phẳng (Net Unfolding) */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-800/60 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-indigo-300 text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Trải phẳng hình học (Net Unfolding):
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-indigo-300">
              {Math.round(unfoldProgress * 100)}%
            </span>
            <button
              onClick={onToggleAutoUnfold}
              className={`p-1.5 rounded-lg border transition ${
                isAutoUnfolding
                  ? 'bg-indigo-600 border-indigo-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isAutoUnfolding ? 'Dừng mở' : 'Tự động mở/đóng'}
            >
              {isAutoUnfolding ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={unfoldProgress}
          onChange={e => onSetUnfoldProgress(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>0% (Khối 3D kín)</span>
          <span>50% (Đang mở)</span>
          <span>100% (Mạng phẳng 2D)</span>
        </div>
      </div>

      {/* 3. Kích thước hình học (Cạnh đáy a / Bán kính r & Chiều cao h) */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="font-bold text-white text-xs">Kích thước hình học:</h4>

        {/* Cạnh a hoặc Bán kính r */}
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium text-[11px]">{dimLabel}:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSetBaseDimension(Math.max(1, baseDimension - 0.5))}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-10 text-center font-mono font-bold text-cyan-400 text-xs">
                {baseDimension.toFixed(1)}
              </span>
              <button
                onClick={() => onSetBaseDimension(Math.min(10, baseDimension + 0.5))}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={baseDimension}
            onChange={e => onSetBaseDimension(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        {/* Chiều cao h */}
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium text-[11px]">Chiều cao (h):</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSetHeight(Math.max(1, height - 0.5))}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-10 text-center font-mono font-bold text-amber-400 text-xs">
                {height.toFixed(1)}
              </span>
              <button
                onClick={() => onSetHeight(Math.min(15, height + 0.5))}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="0.1"
            value={height}
            onChange={e => onSetHeight(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>

      {/* 4. Tùy chọn Hiển thị 3D */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleLabels}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition ${
              showLabels
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
            title="Bật/Tắt nhãn đỉnh"
          >
            Nhãn A, B, S...
          </button>

          <button
            onClick={onToggleAltitude}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition ${
              showAltitude
                ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
            title="Bật/Tắt đường cao SO và trung đoạn"
          >
            Đường cao h
          </button>

          <button
            onClick={onToggleWireframe}
            className={`p-1.5 rounded-lg border transition ${
              showWireframe
                ? 'bg-indigo-950 border-indigo-500 text-indigo-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
            title="Bật/Tắt khung dây"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleGrid}
            className={`p-1.5 rounded-lg border transition ${
              showGrid
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
            title="Bật/Tắt lưới sàn"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Độ trong suốt */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <span>Độ mờ:</span>
          <button
            onClick={() => onSetOpacity(opacity > 0.6 ? 0.45 : 0.85)}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
          >
            {Math.round(opacity * 100)}%
          </button>
        </div>
      </div>

      {/* 5. Bảng Công thức SGK & Kết quả đo đạc tính toán thời gian thực */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700 shadow-xl space-y-3">
        <h4 className="font-extrabold text-white text-xs flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Calculator className="w-3.5 h-3.5" />
            Bảng giá trị & Công thức SGK:
          </span>
          <span className="text-[10px] font-mono text-slate-400">{outputs.nameVi}</span>
        </h4>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {/* Thể tích V */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-900/40">
            <span className="text-[10px] text-slate-400 block">Thể tích (V):</span>
            <span className="text-base font-mono font-bold text-amber-300">
              {outputs.volume.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 block truncate mt-0.5">
              {outputs.formulas.volume}
            </span>
          </div>

          {/* S xung quanh */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-cyan-900/40">
            <span className="text-[10px] text-slate-400 block">Diện tích xung quanh:</span>
            <span className="text-base font-mono font-bold text-cyan-300">
              {outputs.lateralArea.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 block truncate mt-0.5">
              {outputs.formulas.lateralArea}
            </span>
          </div>

          {/* S toàn phần */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Diện tích toàn phần:</span>
            <span className="text-sm font-mono font-bold text-emerald-300">
              {outputs.totalArea.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 block truncate mt-0.5">
              {outputs.formulas.totalArea}
            </span>
          </div>

          {/* S đáy */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Diện tích đáy:</span>
            <span className="text-sm font-mono font-bold text-indigo-300">
              {outputs.baseArea.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 block truncate mt-0.5">
              {outputs.formulas.baseArea}
            </span>
          </div>
        </div>

        {/* Trung đoạn hoặc Đường sinh */}
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">
            {isCircular ? 'Đường sinh (l):' : 'Trung đoạn (d):'}
          </span>
          <span className="font-mono font-bold text-pink-400">
            {outputs.slantHeightOrGenerator.toFixed(2)}
          </span>
        </div>

        {/* SGK Pedagogical Note */}
        <p className="text-[10px] text-slate-400 italic bg-slate-950/50 p-2 rounded-lg border border-slate-800/60 leading-relaxed">
          💡 {outputs.formulas.notes}
        </p>
      </div>
    </div>
  );
};
