import React, { useMemo, useEffect } from 'react';
import { SubjectId, GradeLevel } from '../../types/simulation.types';
import { SUBJECT_SEO_LIST, getLabsBySubject } from '../../data/labsSeoData';
import { updateDocumentMeta, generateBreadcrumbSchema } from '../../utils/seoHelpers';
import {
  ChevronRight,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  GraduationCap,
  FlaskConical
} from 'lucide-react';

interface SubjectHubPageProps {
  subject: SubjectId;
  onNavigate: (path: string) => void;
}

export const SubjectHubPage: React.FC<SubjectHubPageProps> = ({ subject, onNavigate }) => {
  const subjectInfo = useMemo(
    () => SUBJECT_SEO_LIST.find(s => s.id === subject) || SUBJECT_SEO_LIST[0],
    [subject]
  );

  const labs = useMemo(() => getLabsBySubject(subject), [subject]);

  useEffect(() => {
    if (subjectInfo) {
      const breadcrumbs = generateBreadcrumbSchema([
        { name: 'Trang chủ', path: '/' },
        { name: subjectInfo.name, path: `/mon/${subjectInfo.id}` },
      ]);

      updateDocumentMeta({
        title: `Thư viện Thí Nghiệm Ảo ${subjectInfo.name} Lớp 6 - 12 (GDPT 2018)`,
        description: `${subjectInfo.description} Danh sách bài thực hành ảo tương tác 60 FPS theo sách Kết nối tri thức, Cánh diều, Chân trời sáng tạo.`,
        canonicalPath: `/mon/${subjectInfo.id}`,
        ogTitle: `Thư viện Thí nghiệm ảo ${subjectInfo.name} — GDPT 2018`,
        ogDescription: subjectInfo.description,
        jsonLd: breadcrumbs,
      });
    }
  }, [subjectInfo]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition"
          >
            Trang chủ
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900 dark:text-white">
            {subjectInfo.name}
          </span>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950 px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 text-xs font-semibold">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Môn học GDPT 2018</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Thư Viện Thí Nghiệm Ảo Môn {subjectInfo.name} (Lớp 6 - 12)
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {subjectInfo.description}
          </p>

          {/* Khối lớp trực thuộc */}
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">
              Xem theo khối lớp:
            </span>
            {subjectInfo.grades.map(g => (
              <button
                key={g}
                type="button"
                onClick={() => onNavigate(`/mon/${subject}/lop-${g}`)}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-cyan-600 hover:text-white dark:hover:bg-cyan-600 dark:hover:text-white border border-slate-200 dark:border-slate-700 font-semibold transition shadow-sm"
              >
                Lớp {g}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Danh sách bài lab */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-500" />
            <span>Tất cả bài thực hành ảo môn {subjectInfo.name} ({labs.length} bài)</span>
          </h2>
        </div>

        {labs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            Đang cập nhật các bài lab tiếp theo theo lộ trình GDPT 2018.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labs.map(lab => (
              <article
                key={lab.slug}
                onClick={() => onNavigate(`/lab/${lab.slug}`)}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 transition shadow hover:shadow-lg cursor-pointer flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                      Lớp {lab.grade} • {lab.level}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {lab.curriculumCode}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-cyan-500 transition line-clamp-2">
                    {lab.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {lab.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400">
                  <span>Vào phòng Lab ảo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
