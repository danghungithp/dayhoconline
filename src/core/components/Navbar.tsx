import React from 'react';
import { 
  FlaskConical, 
  Search, 
  BookOpen, 
  Compass, 
  Sparkles, 
  Key, 
  GraduationCap,
  Layers
} from 'lucide-react';
import { SchoolLevel, GradeLevel, SubjectId } from '../../types/simulation.types';

interface NavbarProps {
  currentView: 'sandbox' | 'catalog';
  onViewChange: (view: 'sandbox' | 'catalog') => void;
  selectedLevel: SchoolLevel | 'ALL';
  onLevelChange: (lvl: SchoolLevel | 'ALL') => void;
  selectedGrade: GradeLevel | 'ALL';
  onGradeChange: (g: GradeLevel | 'ALL') => void;
  selectedSubject: SubjectId | 'ALL';
  onSubjectChange: (s: SubjectId | 'ALL') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeSimTitle?: string;
  onOpenSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  selectedLevel,
  onLevelChange,
  selectedGrade,
  onGradeChange,
  selectedSubject,
  onSubjectChange,
  searchQuery,
  onSearchChange,
  activeSimTitle,
  onOpenSettings,
}) => {
  const subjects: { id: SubjectId | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'Tất cả môn' },
    { id: 'hoa-hoc', label: 'Hóa học' },
    { id: 'vat-ly', label: 'Vật lý' },
    { id: 'khtn', label: 'KHTN' },
    { id: 'toan', label: 'Toán học' },
    { id: 'hinh-hoc', label: 'Hình học' },
    { id: 'tieng-anh', label: 'Tiếng Anh' },
  ];

  const grades: (GradeLevel | 'ALL')[] = ['ALL', 6, 7, 8, 9, 10, 11, 12];

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-40">
      {/* Upper Main Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => onViewChange('catalog')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-white bg-clip-text text-transparent">
                STEM & English Lab
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                GDPT 2018
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Nền tảng Tương tác Trực quan Lớp 6 – 12
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo bài học, định luật, từ khóa (Z, pH, Newton, Parabol...)"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewChange('catalog')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              currentView === 'catalog'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="hidden sm:inline">Khám phá Danh mục</span>
          </button>

          <button
            onClick={() => onViewChange('sandbox')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              currentView === 'sandbox'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Vào Phòng Lab</span>
          </button>
        </div>
      </div>

      {/* Lower Filter Ribbon (Visible in Catalog mode) */}
      {currentView === 'catalog' && (
        <div className="border-t border-slate-800/80 bg-slate-950/50 py-2.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Level & Grades */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {/* Level switch */}
              <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5">
                <button
                  onClick={() => {
                    onLevelChange('ALL');
                    onGradeChange('ALL');
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                    selectedLevel === 'ALL' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => onLevelChange('THCS')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                    selectedLevel === 'THCS' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  THCS (Lớp 6-9)
                </button>
                <button
                  onClick={() => onLevelChange('THPT')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                    selectedLevel === 'THPT' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  THPT (Lớp 10-12)
                </button>
              </div>

              {/* Grade chips */}
              <div className="flex items-center gap-1">
                {grades.map(g => {
                  if (selectedLevel === 'THCS' && typeof g === 'number' && g > 9) return null;
                  if (selectedLevel === 'THPT' && typeof g === 'number' && g < 10) return null;

                  return (
                    <button
                      key={g}
                      onClick={() => onGradeChange(g)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition ${
                        selectedGrade === g
                          ? 'bg-slate-800 border border-cyan-500 text-cyan-300'
                          : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {g === 'ALL' ? 'Mọi lớp' : `Lớp ${g}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject Filter */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {subjects.map(s => (
                <button
                  key={s.id}
                  onClick={() => onSubjectChange(s.id)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium transition shrink-0 ${
                    selectedSubject === s.id
                      ? 'bg-slate-800 border border-cyan-500 text-cyan-300'
                      : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
