import React, { useState, useMemo } from 'react';
import { 
  SchoolLevel, 
  GradeLevel, 
  SubjectId, 
  SimulationMetadata 
} from '../types/simulation.types';
import { 
  SIMULATION_REGISTRY, 
  getFilteredSimulations, 
  getCurriculumStats 
} from '../core/registry/simulationRegistry';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Layers, 
  GraduationCap, 
  Play, 
  Clock, 
  Tag, 
  CheckCircle2, 
  Compass, 
  Box, 
  LineChart, 
  Mic, 
  FlaskConical, 
  ArrowRight, 
  X, 
  Filter, 
  RotateCcw,
  Info,
  Award
} from 'lucide-react';

interface HomePageProps {
  onSelectSimulation: (simId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectSimulation }) => {
  // Bộ lọc
  const [selectedLevel, setSelectedLevel] = useState<SchoolLevel | 'ALL'>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'ALL'>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterImplementedOnly, setFilterImplementedOnly] = useState<boolean>(false);

  // Modal xem mục tiêu GDPT
  const [modalSim, setModalSim] = useState<SimulationMetadata | null>(null);

  // Thống kê tổng quan
  const stats = useMemo(() => getCurriculumStats(), []);

  // Lọc danh sách bài học
  const filteredSimulations = useMemo(() => {
    let list = getFilteredSimulations({
      level: selectedLevel,
      grade: selectedGrade,
      subject: selectedSubject,
      searchTerm: searchQuery,
    });

    if (filterImplementedOnly) {
      list = list.filter(s => s.isImplemented);
    }

    return list;
  }, [selectedLevel, selectedGrade, selectedSubject, searchQuery, filterImplementedOnly]);

  // Danh sách các lớp phù hợp theo cấp học
  const gradeOptions = useMemo(() => {
    if (selectedLevel === 'THCS') return [6, 7, 8, 9] as GradeLevel[];
    if (selectedLevel === 'THPT') return [10, 11, 12] as GradeLevel[];
    return [6, 7, 8, 9, 10, 11, 12] as GradeLevel[];
  }, [selectedLevel]);

  // Xử lý đổi cấp học
  const handleLevelChange = (lvl: SchoolLevel | 'ALL') => {
    setSelectedLevel(lvl);
    if (lvl === 'THCS' && typeof selectedGrade === 'number' && selectedGrade > 9) {
      setSelectedGrade('ALL');
    } else if (lvl === 'THPT' && typeof selectedGrade === 'number' && selectedGrade < 10) {
      setSelectedGrade('ALL');
    }
  };

  // Reset bộ lọc
  const handleResetFilters = () => {
    setSelectedLevel('ALL');
    setSelectedGrade('ALL');
    setSelectedSubject('ALL');
    setSearchQuery('');
    setFilterImplementedOnly(false);
  };

  // Helper render icon công nghệ
  const renderTechIcon = (tech: SimulationMetadata['technology']) => {
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

  // Helper render label công nghệ
  const renderTechLabel = (tech: SimulationMetadata['technology']) => {
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

  // Helper render màu môn học
  const getSubjectBadgeStyle = (subject: SubjectId) => {
    switch (subject) {
      case 'toan':
      case 'hinh-hoc':
        return 'bg-blue-950/80 text-blue-400 border-blue-800/60';
      case 'vat-ly':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/60';
      case 'hoa-hoc':
      case 'khtn':
        return 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60';
      case 'tieng-anh':
        return 'bg-rose-950/80 text-rose-400 border-rose-800/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getSubjectNameVi = (subject: SubjectId) => {
    switch (subject) {
      case 'toan': return 'Toán học';
      case 'hinh-hoc': return 'Hình học 3D';
      case 'khtn': return 'KHTN';
      case 'vat-ly': return 'Vật lý';
      case 'hoa-hoc': return 'Hóa học';
      case 'tieng-anh': return 'Tiếng Anh';
      default: return subject;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Hero Header & Thống Kê Tổng Quan */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Glow hiệu ứng nền */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chương trình Giáo dục Phổ thông 2018 (Lớp 6 – Lớp 12)</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                STEM & English <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Interactive Lab</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
                Nền tảng thí nghiệm ảo tương tác trực quan 60 FPS, khám phá hình học không gian 3D, vật lý cơ năng, liên kết hóa học và ngữ pháp tiếng Anh kèm Gia sư AI sư phạm Socratic.
              </p>
            </div>

            {/* Thẻ thống kê nhanh */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-center shadow-lg">
                <span className="text-2xl font-black text-cyan-400 block">{stats.total}</span>
                <span className="text-[11px] text-slate-400 font-medium">Chủ đề GDPT</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-center shadow-lg">
                <span className="text-2xl font-black text-emerald-400 block">{stats.implementedCount}</span>
                <span className="text-[11px] text-slate-400 font-medium">Mô phỏng sẵn sàng</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-center shadow-lg">
                <span className="text-2xl font-black text-blue-400 block">{stats.thcsCount}</span>
                <span className="text-[11px] text-slate-400 font-medium">THCS (Lớp 6-9)</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-center shadow-lg">
                <span className="text-2xl font-black text-purple-400 block">{stats.thptCount}</span>
                <span className="text-[11px] text-slate-400 font-medium">THPT (Lớp 10-12)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Thanh Công Cụ Lọc Nhanh Đa Tầng */}
      <section className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          {/* Hàng 1: Ô tìm kiếm + Cấp học + Lọc bài sẵn sàng */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Ô tìm kiếm từ khóa */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm bài học, chủ đề, mã GDPT, nguyên tử, ném xiên..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Chọn Cấp học */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 px-2 font-medium hidden md:inline">Cấp học:</span>
              <button
                onClick={() => handleLevelChange('ALL')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedLevel === 'ALL'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => handleLevelChange('THCS')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedLevel === 'THCS'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                THCS (Lớp 6–9)
              </button>
              <button
                onClick={() => handleLevelChange('THPT')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedLevel === 'THPT'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                THPT (Lớp 10–12)
              </button>
            </div>

            {/* Toggle chỉ hiển thị bài đã sẵn sàng */}
            <button
              onClick={() => setFilterImplementedOnly(!filterImplementedOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                filterImplementedOnly
                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Chỉ bài có mô phỏng</span>
            </button>
          </div>

          {/* Hàng 2: Chọn Lớp học & Môn học */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
            {/* Lớp */}
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              <span className="text-[11px] text-slate-400 mr-1 font-semibold uppercase tracking-wider">Lớp:</span>
              <button
                onClick={() => setSelectedGrade('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                  selectedGrade === 'ALL'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                Tất cả
              </button>
              {gradeOptions.map(gr => (
                <button
                  key={gr}
                  onClick={() => setSelectedGrade(gr)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                    selectedGrade === gr
                      ? 'bg-cyan-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Lớp {gr}
                </button>
              ))}
            </div>

            {/* Môn học */}
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              <span className="text-[11px] text-slate-400 mr-1 font-semibold uppercase tracking-wider">Môn:</span>
              <button
                onClick={() => setSelectedSubject('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs transition ${
                  selectedSubject === 'ALL'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                Tất cả
              </button>
              {[
                { id: 'toan', name: 'Toán học' },
                { id: 'hinh-hoc', name: 'Hình học 3D' },
                { id: 'khtn', name: 'KHTN' },
                { id: 'vat-ly', name: 'Vật lý' },
                { id: 'hoa-hoc', name: 'Hóa học' },
                { id: 'tieng-anh', name: 'Tiếng Anh' },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub.id as SubjectId)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition ${
                    selectedSubject === sub.id
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {sub.name}
                </button>
              ))}

              {/* Nút Reset */}
              {(selectedLevel !== 'ALL' || selectedGrade !== 'ALL' || selectedSubject !== 'ALL' || searchQuery || filterImplementedOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  title="Xóa toàn bộ bộ lọc"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Danh Sách Thẻ Bài Học (Card Grid) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-wide">
              Danh Sách Bài Thí Nghiệm & Mô Phỏng
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {filteredSimulations.length} bài học
            </span>
          </div>

          <span className="text-xs text-slate-500 hidden sm:inline">
            Chuẩn GDPT 2018 • Bộ GD&ĐT Việt Nam
          </span>
        </div>

        {filteredSimulations.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 my-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Không tìm thấy bài mô phỏng phù hợp</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Không có bài học nào khớp với bộ lọc cấp lớp hoặc từ khóa "{searchQuery}". Hãy thử điều chỉnh lại bộ lọc tìm kiếm.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa bộ lọc tìm kiếm</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSimulations.map(sim => (
              <div
                key={sim.id}
                className={`group flex flex-col justify-between rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden ${
                  sim.isImplemented
                    ? 'bg-slate-900/90 hover:bg-slate-900 border-slate-800 hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-950/20'
                    : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Viền màu trên đỉnh card */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 transition-all ${
                    sim.isImplemented
                      ? 'bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500'
                      : 'bg-slate-800'
                  }`}
                />

                {/* Phần trên Card: Badges + Tiêu đề */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${getSubjectBadgeStyle(sim.subject)}`}>
                        {getSubjectNameVi(sim.subject)}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        Lớp {sim.grade} ({sim.level})
                      </span>
                    </div>

                    {/* Trạng thái mô phỏng */}
                    {sim.isImplemented ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/60">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Sẵn sàng</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/60">
                        Lộ trình GDPT
                      </span>
                    )}
                  </div>

                  {/* Tiêu đề bài học */}
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                      {sim.title}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
                      {sim.titleEn}
                    </p>
                  </div>

                  {/* Tóm tắt tương tác sư phạm */}
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {sim.description}
                  </p>

                  {/* Chủ đề & Công nghệ */}
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                      {renderTechIcon(sim.technology)}
                      <span>{renderTechLabel(sim.technology)}</span>
                    </span>
                    <span className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{sim.estimatedMinutes} phút</span>
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {sim.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-slate-400 bg-slate-800/50 px-1.5 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    {sim.tags.length > 3 && (
                      <span className="text-[10px] text-slate-500">
                        +{sim.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Phần dưới Card: Nút hành động */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    {sim.curriculumCode}
                  </span>

                  {sim.isImplemented ? (
                    <button
                      onClick={() => onSelectSimulation(sim.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md shadow-cyan-950/40 hover:shadow-cyan-600/30 transition group-hover:scale-105 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Vào học ngay</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setModalSim(sim)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      <span>Mục tiêu GDPT</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 4. Modal Chi Tiết Mục Tiêu Học Tập GDPT (Đối với các bài đang cập nhật) */}
      {modalSim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setModalSim(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs uppercase font-mono px-2.5 py-0.5 rounded-full font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60 inline-block">
                Lớp {modalSim.grade} • {getSubjectNameVi(modalSim.subject)} • {modalSim.curriculumCode}
              </span>
              <h3 className="text-lg font-bold text-white pt-1">{modalSim.title}</h3>
              <p className="text-xs font-mono text-slate-400">{modalSim.titleEn}</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Mục tiêu cần đạt theo GDPT 2018:
              </span>
              <p className="leading-relaxed">{modalSim.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Thời lượng đề xuất:</span>
                <span className="text-slate-200 font-bold">{modalSim.estimatedMinutes} phút</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Mức độ nhận thức:</span>
                <span className="text-cyan-400 font-bold">{modalSim.difficulty}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalSim(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
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
