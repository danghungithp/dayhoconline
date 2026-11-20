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
import { useTheme } from '../core/theme/themeContext';
import { useLanguage } from '../core/i18n/i18nContext';
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
  Award,
  Sun,
  Moon,
  Globe,
  Users,
  ShieldCheck
} from 'lucide-react';

interface HomePageProps {
  onSelectSimulation: (simId: string) => void;
  onOpenAdmin?: () => void;
  onOpenClassroom?: (code?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onSelectSimulation,
  onOpenAdmin,
  onOpenClassroom
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t, getLocalizedTitle, getLocalizedDescription, getSubjectName } = useLanguage();

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
    return t(`tech.${tech}`);
  };

  // Helper render màu môn học
  const getSubjectBadgeStyle = (subject: SubjectId) => {
    switch (subject) {
      case 'toan':
      case 'hinh-hoc':
        return 'bg-blue-950/80 text-blue-400 border-blue-800/60 dark:bg-blue-950/80 dark:text-blue-400 dark:border-blue-800/60 light:bg-blue-50 light:text-blue-700 light:border-blue-200';
      case 'vat-ly':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/60 dark:bg-amber-950/80 dark:text-amber-400 dark:border-amber-800/60 light:bg-amber-50 light:text-amber-700 light:border-amber-200';
      case 'hoa-hoc':
      case 'khtn':
        return 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60 dark:bg-cyan-950/80 dark:text-cyan-400 dark:border-cyan-800/60 light:bg-cyan-50 light:text-cyan-700 light:border-cyan-200';
      case 'sinh-hoc':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-800/60 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-200';
      case 'tin-hoc':
        return 'bg-purple-950/80 text-purple-400 border-purple-800/60 dark:bg-purple-950/80 dark:text-purple-400 dark:border-purple-800/60 light:bg-purple-50 light:text-purple-700 light:border-purple-200';
      case 'dia-ly':
        return 'bg-teal-950/80 text-teal-400 border-teal-800/60 dark:bg-teal-950/80 dark:text-teal-400 dark:border-teal-800/60 light:bg-teal-50 light:text-teal-700 light:border-teal-200';
      case 'lich-su':
        return 'bg-orange-950/80 text-orange-400 border-orange-800/60 dark:bg-orange-950/80 dark:text-orange-400 dark:border-orange-800/60 light:bg-orange-50 light:text-orange-700 light:border-orange-200';
      case 'cong-nghe':
        return 'bg-sky-950/80 text-sky-400 border-sky-800/60 dark:bg-sky-950/80 dark:text-sky-400 dark:border-sky-800/60 light:bg-sky-50 light:text-sky-700 light:border-sky-200';
      case 'gdkt-pl':
        return 'bg-fuchsia-950/80 text-fuchsia-400 border-fuchsia-800/60 dark:bg-fuchsia-950/80 dark:text-fuchsia-400 dark:border-fuchsia-800/60 light:bg-fuchsia-50 light:text-fuchsia-700 light:border-fuchsia-200';
      case 'tieng-anh':
        return 'bg-rose-950/80 text-rose-400 border-rose-800/60 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-800/60 light:bg-rose-50 light:text-rose-700 light:border-rose-200';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200">
      {/* 1. Hero Header & Thống Kê Tổng Quan */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Glow hiệu ứng nền */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Bar: Controls (Theme Toggle & Language Switcher) */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-800/80 text-cyan-800 dark:text-cyan-300 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{t('brand.badge')}</span>
            </div>

            {/* Language & Theme Controls & Admin / Classroom links */}
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {/* Virtual Classroom Button (For Students) */}
              <button
                onClick={() => onOpenClassroom?.()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-xs font-bold text-indigo-700 dark:text-indigo-300 shadow-sm transition-all active:scale-95"
                title="Vào lớp học ảo làm bài kiểm tra"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Lớp Học Ảo</span>
              </button>

              {/* Admin & Teacher Login */}
              <button
                onClick={() => onOpenAdmin?.()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-300 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-950/80 hover:bg-cyan-100 dark:hover:bg-cyan-900 text-xs font-bold text-cyan-700 dark:text-cyan-300 shadow-sm transition-all active:scale-95"
                title="Quản trị nội dung & Giáo viên"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Quản Trị & GV</span>
              </button>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm transition-all active:scale-95"
                title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
              >
                <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>{language === 'vi' ? 'English (EN)' : 'Tiếng Việt (VI)'}</span>
              </button>

              {/* Theme Toggle (Dark / Light) */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm transition-all active:scale-95"
                title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('brand.heroTitlePrefix')}{' '}
                <span className="bg-gradient-to-r from-cyan-600 via-sky-500 to-indigo-600 dark:from-cyan-400 dark:via-sky-300 dark:to-indigo-400 bg-clip-text text-transparent">
                  {t('brand.heroTitleSuffix')}
                </span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {t('brand.heroDescription')}
              </p>
            </div>

            {/* Thẻ thống kê nhanh */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl text-center shadow-md dark:shadow-lg">
                <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400 block">{stats.total}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t('stats.totalTopics')}</span>
              </div>
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl text-center shadow-md dark:shadow-lg">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">{stats.implementedCount}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t('stats.readyLabs')}</span>
              </div>
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl text-center shadow-md dark:shadow-lg">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400 block">{stats.thcsCount}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t('stats.thcs')}</span>
              </div>
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl text-center shadow-md dark:shadow-lg">
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400 block">{stats.thptCount}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t('stats.thpt')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Thanh Công Cụ Lọc Nhanh Đa Tầng */}
      <section className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          {/* Hàng 1: Ô tìm kiếm + Cấp học + Lọc bài sẵn sàng */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Ô tìm kiếm từ khóa */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Chọn Cấp học */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400 px-2 font-medium hidden md:inline">{t('filter.level')}</span>
              <button
                onClick={() => handleLevelChange('ALL')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedLevel === 'ALL'
                    ? 'bg-cyan-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {t('filter.all')}
              </button>
              <button
                onClick={() => handleLevelChange('THCS')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedLevel === 'THCS'
                    ? 'bg-cyan-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {t('filter.thcs')}
              </button>
              <button
                onClick={() => handleLevelChange('THPT')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedLevel === 'THPT'
                    ? 'bg-cyan-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {t('filter.thpt')}
              </button>
            </div>

            {/* Toggle chỉ hiển thị bài đã sẵn sàng */}
            <button
              onClick={() => setFilterImplementedOnly(!filterImplementedOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                filterImplementedOnly
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('filter.readyOnly')}</span>
            </button>
          </div>

          {/* Hàng 2: Chọn Lớp học & Môn học */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200 dark:border-slate-800/60">
            {/* Lớp */}
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-1 font-semibold uppercase tracking-wider">{t('filter.grade')}</span>
              <button
                onClick={() => setSelectedGrade('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                  selectedGrade === 'ALL'
                    ? 'bg-slate-800 dark:bg-slate-700 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {t('filter.all')}
              </button>
              {gradeOptions.map(gr => (
                <button
                  key={gr}
                  onClick={() => setSelectedGrade(gr)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                    selectedGrade === gr
                      ? 'bg-cyan-600 text-white font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {t('filter.gradePrefix')} {gr}
                </button>
              ))}
            </div>

            {/* Môn học */}
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-1 font-semibold uppercase tracking-wider">{t('filter.subject')}</span>
              <button
                onClick={() => setSelectedSubject('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs transition ${
                  selectedSubject === 'ALL'
                    ? 'bg-slate-800 dark:bg-slate-700 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {t('filter.all')}
              </button>
              {[
                { id: 'toan', nameKey: 'subject.toan' },
                { id: 'hinh-hoc', nameKey: 'subject.hinh-hoc' },
                { id: 'khtn', nameKey: 'subject.khtn' },
                { id: 'vat-ly', nameKey: 'subject.vat-ly' },
                { id: 'hoa-hoc', nameKey: 'subject.hoa-hoc' },
                { id: 'sinh-hoc', nameKey: 'subject.sinh-hoc' },
                { id: 'tin-hoc', nameKey: 'subject.tin-hoc' },
                { id: 'dia-ly', nameKey: 'subject.dia-ly' },
                { id: 'lich-su', nameKey: 'subject.lich-su' },
                { id: 'cong-nghe', nameKey: 'subject.cong-nghe' },
                { id: 'gdkt-pl', nameKey: 'subject.gdkt-pl' },
                { id: 'tieng-anh', nameKey: 'subject.tieng-anh' },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub.id as SubjectId)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition ${
                    selectedSubject === sub.id
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {t(sub.nameKey)}
                </button>
              ))}

              {/* Nút Reset */}
              {(selectedLevel !== 'ALL' || selectedGrade !== 'ALL' || selectedSubject !== 'ALL' || searchQuery || filterImplementedOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                  title={t('filter.resetAll')}
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
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">
              {t('catalog.title')}
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
              {t('catalog.count', { n: filteredSimulations.length })}
            </span>
          </div>

          <span className="text-xs text-slate-500 hidden sm:inline">
            {t('catalog.ministryBadge')}
          </span>
        </div>

        {filteredSimulations.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 my-8 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('catalog.emptyTitle')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                {t('catalog.emptyDesc', { query: searchQuery })}
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('filter.reset')}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSimulations.map(sim => (
              <div
                key={sim.id}
                className={`group flex flex-col justify-between rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden ${
                  sim.isImplemented
                    ? 'bg-white dark:bg-slate-900/90 hover:shadow-xl hover:shadow-cyan-950/10 dark:hover:shadow-cyan-950/30 border-slate-200 dark:border-slate-800 hover:border-cyan-500/60'
                    : 'bg-slate-50/70 dark:bg-slate-950/70 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Viền màu trên đỉnh card */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 transition-all ${
                    sim.isImplemented
                      ? 'bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500'
                      : 'bg-slate-300 dark:bg-slate-800'
                  }`}
                />

                {/* Phần trên Card: Badges + Tiêu đề */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${getSubjectBadgeStyle(sim.subject)}`}>
                        {getSubjectName(sim.subject)}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {t('card.grade', { g: sim.grade, level: sim.level })}
                      </span>
                    </div>

                    {/* Trạng thái mô phỏng */}
                    {sim.isImplemented ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700/60">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{t('card.ready')}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700/60">
                        {t('card.roadmap')}
                      </span>
                    )}
                  </div>

                  {/* Tiêu đề bài học */}
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                      {getLocalizedTitle(sim)}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
                      {language === 'vi' ? sim.titleEn : sim.title}
                    </p>
                  </div>

                  {/* Tóm tắt tương tác sư phạm */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {getLocalizedDescription(sim)}
                  </p>

                  {/* Chủ đề & Công nghệ */}
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                      {renderTechIcon(sim.technology)}
                      <span>{renderTechLabel(sim.technology)}</span>
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{t('card.minutes', { n: sim.estimatedMinutes })}</span>
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {sim.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800/50 px-1.5 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    {sim.tags.length > 3 && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        +{sim.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Phần dưới Card: Nút hành động */}
                <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    {sim.curriculumCode}
                  </span>

                  {sim.isImplemented ? (
                    <button
                      onClick={() => onSelectSimulation(sim.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md shadow-cyan-950/20 hover:shadow-cyan-600/30 transition group-hover:scale-105 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{t('card.enterLab')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setModalSim(sim)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>{t('card.objectives')}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setModalSim(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs uppercase font-mono px-2.5 py-0.5 rounded-full font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800/60 inline-block">
                {t('filter.gradePrefix')} {modalSim.grade} • {getSubjectName(modalSim.subject)} • {modalSim.curriculumCode}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-1">{getLocalizedTitle(modalSim)}</h3>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">{modalSim.titleEn}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
                {t('modal.objectivesTitle')}
              </span>
              <p className="leading-relaxed">{getLocalizedDescription(modalSim)}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{t('modal.duration')}</span>
                <span className="text-slate-900 dark:text-slate-200 font-bold">{modalSim.estimatedMinutes} {t('card.minutes', { n: '' })}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{t('modal.difficulty')}</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">{modalSim.difficulty}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalSim(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-white transition"
              >
                {t('modal.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
