import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Tag, 
  CheckCircle2, 
  Layers, 
  Compass, 
  Box, 
  LineChart, 
  Mic, 
  FlaskConical,
  X,
  Target
} from 'lucide-react';
import { SimulationMetadata, SubjectId } from '../../types/simulation.types';

interface CatalogExplorerProps {
  simulations: SimulationMetadata[];
  onSelectSimulation: (sim: SimulationMetadata) => void;
  stats: {
    total: number;
    thcsCount: number;
    thptCount: number;
    implementedCount: number;
  };
}

export const CatalogExplorer: React.FC<CatalogExplorerProps> = ({
  simulations,
  onSelectSimulation,
  stats,
}) => {
  const [previewSim, setPreviewSim] = useState<SimulationMetadata | null>(null);

  const getTechIcon = (tech: SimulationMetadata['technology']) => {
    switch (tech) {
      case 'three3d':
        return <Box className="w-3.5 h-3.5 text-purple-400" />;
      case 'graph':
        return <LineChart className="w-3.5 h-3.5 text-emerald-400" />;
      case 'speech-ai':
        return <Mic className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const getTechLabel = (tech: SimulationMetadata['technology']) => {
    switch (tech) {
      case 'three3d':
        return 'Không gian 3D (Three.js)';
      case 'graph':
        return 'Đồ thị động (Mafs/Math)';
      case 'speech-ai':
        return 'Speech & AI Voice';
      default:
        return 'Canvas 2D 60 FPS';
    }
  };

  const getSubjectColor = (sub: SubjectId) => {
    switch (sub) {
      case 'hoa-hoc':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/60';
      case 'vat-ly':
        return 'text-blue-400 bg-blue-950/60 border-blue-800/60';
      case 'khtn':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';
      case 'toan':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      case 'hinh-hoc':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
      case 'tieng-anh':
        return 'text-purple-400 bg-purple-950/60 border-purple-800/60';
    }
  };

  return (
    <div className="min-h-full bg-slate-950 p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chương trình Giáo dục Phổ thông 2018 Toàn diện</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Phòng Thí Nghiệm & Mô Phỏng Tương Tác{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              STEM & Tiếng Anh
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Học tập qua khám phá thực nghiệm ảo: Từ mô hình hạt, liên kết hóa học, cấu trúc tinh thể 3D, 
            dao động cơ - điện - quang, khảo sát hàm số cho tới luyện ngữ pháp và tranh biện phản xạ AI.
          </p>

          {/* Quick Metrics */}
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
            <div className="px-4 py-2 rounded-xl bg-slate-800/70 border border-slate-700/80">
              <span className="text-slate-400">Tổng bài thí nghiệm: </span>
              <span className="text-cyan-400 font-bold text-sm">{stats.total} bài</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-800/70 border border-slate-700/80">
              <span className="text-slate-400">THCS (Lớp 6-9): </span>
              <span className="text-white font-bold">{stats.thcsCount} bài</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-800/70 border border-slate-700/80">
              <span className="text-slate-400">THPT (Lớp 10-12): </span>
              <span className="text-white font-bold">{stats.thptCount} bài</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-cyan-950/60 border border-cyan-800/60">
              <span className="text-cyan-300 font-medium">Đã kích hoạt chạy ngay: </span>
              <span className="text-cyan-400 font-bold">1 bài mẫu hoàn chỉnh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Simulation Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Danh mục bài học ({simulations.length})</span>
          </h3>
          <span className="text-xs text-slate-400">
            Nhấp vào bài học để mở không gian Sandbox
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {simulations.map(sim => {
            const isReady = sim.isImplemented;

            return (
              <div
                key={sim.id}
                onClick={() => (isReady ? onSelectSimulation(sim) : setPreviewSim(sim))}
                className={`group rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                  isReady
                    ? 'bg-gradient-to-b from-slate-900 to-slate-900/90 border-cyan-500/50 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/10'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${getSubjectColor(sim.subject)}`}>
                        Lớp {sim.grade} • {sim.subject.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                        {sim.curriculumCode}
                      </span>
                    </div>

                    {isReady ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-600/50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Chạy ngay
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
                        Lộ trình GDPT
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h4 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {sim.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium italic mt-0.5 line-clamp-1">
                      {sim.titleEn}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {sim.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {sim.tags.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 border border-slate-800"
                      >
                        #{t}
                      </span>
                    ))}
                    {sim.tags.length > 3 && (
                      <span className="text-[10px] text-slate-500 py-0.5">
                        +{sim.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer specs */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    {getTechIcon(sim.technology)}
                    <span>{getTechLabel(sim.technology)}</span>
                  </div>

                  <div className="flex items-center gap-1 font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>{isReady ? 'Mở bài lab' : 'Xem mục tiêu'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Modal for non-active simulations */}
      {previewSim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${getSubjectColor(previewSim.subject)}`}>
                  Lớp {previewSim.grade} • {previewSim.subject.toUpperCase()}
                </span>
                <h3 className="text-lg font-bold text-white mt-1.5">{previewSim.title}</h3>
                <p className="text-xs text-slate-400 italic">{previewSim.titleEn}</p>
              </div>
              <button
                onClick={() => setPreviewSim(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 text-slate-300">
              <p className="font-semibold text-cyan-400 flex items-center gap-1.5">
                <Target className="w-4 h-4" /> Mục tiêu kiến thức GDPT Việt Nam:
              </p>
              <p className="leading-relaxed">{previewSim.description}</p>
              <div className="pt-2 flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                <span>Mã bài: {previewSim.curriculumCode}</span>
                <span>Thời lượng dự kiến: {previewSim.estimatedMinutes} phút</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400">
              <span className="font-medium text-slate-300">Công nghệ chuyên biệt thiết kế:</span>
              <p className="text-slate-400">{getTechLabel(previewSim.technology)}</p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setPreviewSim(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
