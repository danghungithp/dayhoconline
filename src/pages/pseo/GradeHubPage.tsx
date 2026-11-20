import React, { useMemo, useEffect } from 'react';
import { SubjectId, GradeLevel } from '../../types/simulation.types';
import { SUBJECT_SEO_LIST, getLabsBySubjectAndGrade, getLabsBySubject } from '../../data/labsSeoData';
import { updateDocumentMeta, generateBreadcrumbSchema } from '../../utils/seoHelpers';
import {
  ChevronRight,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';

interface GradeHubPageProps {
  subject: SubjectId;
  grade: GradeLevel;
  onNavigate: (path: string) => void;
}

export const GradeHubPage: React.FC<GradeHubPageProps> = ({ subject, grade, onNavigate }) => {
  const subjectInfo = useMemo(
    () => SUBJECT_SEO_LIST.find(s => s.id === subject) || SUBJECT_SEO_LIST[0],
    [subject]
  );

  const labs = useMemo(() => getLabsBySubjectAndGrade(subject, grade), [subject, grade]);
  const otherLabsInSubject = useMemo(
    () => getLabsBySubject(subject).filter(l => l.grade !== grade),
    [subject, grade]
  );

  useEffect(() => {
    if (subjectInfo) {
      const breadcrumbs = generateBreadcrumbSchema([
        { name: 'Trang chủ', path: '/' },
        { name: subjectInfo.name, path: `/mon/${subjectInfo.id}` },
        { name: `Lớp ${grade}`, path: `/mon/${subjectInfo.id}/lop-${grade}` },
      ]);

      updateDocumentMeta({
        title: `Phòng Thí Nghiệm Ảo ${subjectInfo.name} Lớp ${grade} (GDPT 2018)`,
        description: `Danh sách các bài thực hành thí nghiệm ảo môn ${subjectInfo.name} Lớp ${grade} chuẩn chương trình GDPT 2018. Mô phỏng 60 FPS, bài tập trắc nghiệm và câu hỏi ôn tập.`,
        canonicalPath: `/mon/${subjectInfo.id}/lop-${grade}`,
        ogTitle: `Thí Nghiệm Ảo ${subjectInfo.name} Lớp ${grade} — GDPT 2018`,
        ogDescription: `Tổng hợp bài lab thực hành ${subjectInfo.name} Lớp ${grade}.`,
        jsonLd: breadcrumbs,
      });
    }
  }, [subjectInfo, grade]);

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
          <button
            type="button"
            onClick={() => onNavigate(`/mon/${subjectInfo.id}`)}
            className="hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition"
          >
            {subjectInfo.name}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900 dark:text-white">
            Lớp {grade}
          </span>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950 px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Chương trình GDPT 2018 • Khối Lớp {grade}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Phòng Thí Nghiệm Ảo Môn {subjectInfo.name} Lớp {grade}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Học tập và thực hành trực quan các bài thí nghiệm, mô phỏng khoa học môn {subjectInfo.name} Lớp {grade}. Đồng bộ mục tiêu cần đạt theo các bộ sách giáo khoa mới (Kết nối tri thức, Chân trời sáng tạo, Cánh diều).
          </p>

          {/* Chuyển nhanh giữa các lớp */}
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">
              Chuyển sang lớp khác:
            </span>
            {subjectInfo.grades.map(g => (
              <button
                key={g}
                type="button"
                onClick={() => onNavigate(`/mon/${subject}/lop-${g}`)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition shadow-sm ${
                  g === grade
                    ? 'bg-cyan-600 text-white border-cyan-600'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <span>Danh sách bài lab {subjectInfo.name} Lớp {grade} ({labs.length} bài)</span>
          </h2>

          {labs.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              Hiện chưa có bài lab riêng cho Lớp {grade}. Bạn có thể xem các bài học thuộc các khối lớp khác bên dưới.
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
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                        Lớp {lab.grade} • {lab.curriculumCode}
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
        </div>

        {/* Các bài lab ở khối lớp khác của cùng môn học */}
        {otherLabsInSubject.length > 0 && (
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Khám phá thêm các bài lab {subjectInfo.name} ở khối lớp khác:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherLabsInSubject.map(other => (
                <div
                  key={other.slug}
                  onClick={() => onNavigate(`/lab/${other.slug}`)}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 transition cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 block mb-1">
                      Lớp {other.grade} • {other.curriculumCode}
                    </span>
                    <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                      {other.title}
                    </h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
