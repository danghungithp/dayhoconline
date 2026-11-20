import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { LabSeoItem } from '../../types/pseo.types';
import { getLabBySlug, LABS_PSEO_DATA } from '../../data/labsSeoData';
import { SIMULATION_REGISTRY } from '../../core/registry/simulationRegistry';
import { updateDocumentMeta, generateLabStructuredData } from '../../utils/seoHelpers';
import { useTheme } from '../../core/theme/themeContext';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Share2,
  Maximize2,
  Check,
  RefreshCw,
  ExternalLink,
  Award,
  Layers,
  GraduationCap
} from 'lucide-react';

interface LabDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  onOpenPlayer?: (simId: string) => void;
}

export const LabDetailPage: React.FC<LabDetailPageProps> = ({
  slug,
  onNavigate,
  onOpenPlayer,
}) => {
  const { theme } = useTheme();
  const lab = useMemo(() => getLabBySlug(slug) || LABS_PSEO_DATA[0], [slug]);
  const simMetadata = useMemo(
    () => SIMULATION_REGISTRY.find(s => s.id === lab.id),
    [lab.id]
  );

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  // Update SEO Document Meta & JSON-LD
  useEffect(() => {
    if (lab) {
      const jsonLd = generateLabStructuredData(lab);
      updateDocumentMeta({
        title: `${lab.title} | STEM Interactive Lab`,
        description: lab.description,
        canonicalPath: `/lab/${lab.slug}`,
        ogTitle: lab.title,
        ogDescription: lab.description,
        jsonLd,
      });
    }
  }, [lab]);

  // Quizzes handlers
  const handleSelectOption = (qIdx: number, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: option }));
    setShowExplanations(prev => ({ ...prev, [qIdx]: true }));
  };

  const handleCopyShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Tính số câu làm đúng
  const correctCount = useMemo(() => {
    return lab.quizzes.reduce((acc, q, idx) => {
      return acc + (selectedAnswers[idx] === q.answer ? 1 : 0);
    }, 0);
  }, [lab.quizzes, selectedAnswers]);

  // Bài lab kế tiếp và các bài lab liên quan
  const nextLab = useMemo(() => {
    const currentIndex = LABS_PSEO_DATA.findIndex(l => l.slug === lab.slug);
    if (currentIndex >= 0 && currentIndex < LABS_PSEO_DATA.length - 1) {
      return LABS_PSEO_DATA[currentIndex + 1];
    }
    return LABS_PSEO_DATA[0];
  }, [lab.slug]);

  const relatedLabs = useMemo(() => {
    // Ưu tiên relatedSlugs, sau đó lọc cùng subject
    if (lab.relatedSlugs && lab.relatedSlugs.length > 0) {
      const fromSlugs = lab.relatedSlugs
        .map(s => getLabBySlug(s))
        .filter((l): l is LabSeoItem => !!l);
      if (fromSlugs.length > 0) return fromSlugs;
    }
    return LABS_PSEO_DATA.filter(l => l.slug !== lab.slug && l.subject === lab.subject).slice(0, 3);
  }, [lab]);

  const SimulationComponent = simMetadata?.component;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Header Bar & Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <ol className="flex items-center gap-1.5 flex-wrap text-slate-500 dark:text-slate-400">
            <li>
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition"
              >
                Trang chủ
              </button>
            </li>
            <li><ChevronRight className="w-3.5 h-3.5 text-slate-400" /></li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate(`/mon/${lab.subject}`)}
                className="hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition"
              >
                {lab.subjectName}
              </button>
            </li>
            <li><ChevronRight className="w-3.5 h-3.5 text-slate-400" /></li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate(`/mon/${lab.subject}/lop-${lab.grade}`)}
                className="hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition"
              >
                Lớp {lab.grade}
              </button>
            </li>
            <li><ChevronRight className="w-3.5 h-3.5 text-slate-400" /></li>
            <li className="font-semibold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
              {lab.title}
            </li>
          </ol>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyShare}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition text-xs shadow-sm"
              title="Sao chép liên kết bài lab chuẩn SEO"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Đã copy URL!' : 'Chia sẻ bài Lab'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Title Header (H1) & Badges */}
        <header className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
              {lab.subjectName}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
              Khối Lớp {lab.grade} ({lab.level})
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
              {lab.curriculumCode}
            </span>
            {lab.textbooks.map(tb => (
              <span
                key={tb}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
              >
                SGK {tb}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
            {lab.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
            {lab.description}
          </p>
        </header>

        {/* 3. KHU VỰC TƯƠNG TÁC (ABOVE THE FOLD) */}
        <section aria-label="Phòng Thí Nghiệm Ảo Trực Quan" className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-900 shadow-2xl">
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Phòng Thí Nghiệm Ảo Tương Tác 60 FPS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenPlayer ? onOpenPlayer(lab.id) : onNavigate(`/?sim=${lab.id}`)}
                className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] transition shadow"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Toàn màn hình Sandbox</span>
              </button>
            </div>
          </div>

          <div className="relative w-full min-h-[520px] bg-slate-950 flex flex-col justify-center items-center">
            {SimulationComponent ? (
              <Suspense
                fallback={
                  <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
                    <span>Đang khởi tạo môi trường thí nghiệm ảo 60 FPS...</span>
                  </div>
                }
              >
                <div className="w-full h-full min-h-[520px]">
                  <SimulationComponent />
                </div>
              </Suspense>
            ) : (
              <div className="p-12 text-center space-y-4 max-w-md">
                <GraduationCap className="w-12 h-12 text-cyan-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Bài lab đang cập nhật theo lộ trình GDPT 2018</h3>
                <p className="text-xs text-slate-400">
                  Hệ thống đang hoàn thiện mô hình thí nghiệm tương tác. Bạn có thể tham khảo mục tiêu, công thức và làm bài trắc nghiệm bên dưới.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 4. KHU VỰC NỘI DUNG HỌC THUẬT (BELOW THE FOLD - TRÁNH THIN CONTENT) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2 space-y-8 text-slate-700 dark:text-slate-300">
            {/* Mục tiêu bài học */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400">🎯</span>
                <span>1. Mục tiêu bài học & Chuẩn đầu ra GDPT 2018</span>
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {lab.seoContent.objective}
              </p>
            </div>

            {/* Các thông số tương tác trong Lab */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">⚙️</span>
                <span>2. Các thông số & Biến số tương tác trong Lab</span>
              </h2>
              <ul className="space-y-2 text-sm">
                {lab.seoContent.variables.map((v, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bản chất hiện tượng khoa học */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">🔬</span>
                <span>3. Bản chất khoa học & Giải thích hiện tượng</span>
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {lab.seoContent.phenomenon}
              </p>
            </div>

            {/* Công thức trọng tâm / Cấu trúc ngữ pháp */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">📐</span>
                <span>4. Công thức trọng tâm & Quy tắc ghi nhớ</span>
              </h2>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm text-cyan-800 dark:text-cyan-300 leading-relaxed overflow-x-auto">
                {lab.seoContent.formulaOrGrammar}
              </div>
            </div>

            {/* Lưu ý & Lỗi sai thường gặp */}
            <div className="p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 shadow-sm space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>5. Lưu ý & Những lỗi sai học sinh thường gặp</span>
              </h2>
              <p className="text-sm leading-relaxed text-amber-950 dark:text-amber-300/90">
                {lab.seoContent.commonMistakes}
              </p>
            </div>
          </article>

          {/* SIDEBAR: MINI QUIZ & INTERNAL LINKS */}
          <aside className="space-y-6">
            {/* MINI QUIZ ÔN TẬP */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Trắc nghiệm ôn tập ({lab.quizzes.length} câu)</span>
                </h3>
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {correctCount}/{lab.quizzes.length} Đúng
                </span>
              </div>

              <div className="space-y-5">
                {lab.quizzes.map((q, idx) => {
                  const userChoice = selectedAnswers[idx];
                  const hasAnswered = !!userChoice;
                  const isCorrect = userChoice === q.answer;

                  return (
                    <div key={idx} className="space-y-2.5 text-xs">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-start gap-1.5">
                        <span className="font-bold text-cyan-600 dark:text-cyan-400">Câu {idx + 1}:</span>
                        <span>{q.question}</span>
                      </div>

                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userChoice === opt;
                          let btnStyle = 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

                          if (hasAnswered) {
                            if (opt === q.answer) {
                              btnStyle = 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-400 font-bold';
                            } else if (isSelected && !isCorrect) {
                              btnStyle = 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-400 line-through';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectOption(idx, opt)}
                              className={`w-full text-left p-2.5 rounded-xl border transition text-xs flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {hasAnswered && opt === q.answer && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {showExplanations[idx] && (
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>Giải thích chi tiết:</span>
                          </span>
                          <p>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BÀI LAB KẾ TIẾP (INTERNAL LINKING) */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-900/30 to-indigo-900/30 border border-cyan-800/60 shadow-lg space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                Bài Thí Nghiệm Tiếp Theo Trong Lộ Trình:
              </span>
              <h4 className="font-bold text-sm text-white line-clamp-2">
                {nextLab.title}
              </h4>
              <p className="text-xs text-slate-300 line-clamp-2">
                {nextLab.description}
              </p>
              <button
                type="button"
                onClick={() => onNavigate(`/lab/${nextLab.slug}`)}
                className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow active:scale-95"
              >
                <span>Học tiếp bài này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* CÁC BÀI LAB CÙNG MÔN HỌC */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>Các bài Lab cùng môn {lab.subjectName}:</span>
              </h3>
              <div className="space-y-2.5">
                {relatedLabs.map(rel => (
                  <button
                    key={rel.slug}
                    type="button"
                    onClick={() => onNavigate(`/lab/${rel.slug}`)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition text-xs group"
                  >
                    <div className="font-semibold text-slate-900 dark:text-white group-hover:text-cyan-500 line-clamp-1">
                      {rel.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                      <span>Lớp {rel.grade}</span>
                      <span>•</span>
                      <span>{rel.curriculumCode}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};
