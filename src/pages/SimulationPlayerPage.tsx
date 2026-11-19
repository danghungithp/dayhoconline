import React, { useState, useEffect, Suspense } from 'react';
import { 
  getSimulationById, 
  SIMULATION_REGISTRY 
} from '../core/registry/simulationRegistry';
import { SimulationMetadata } from '../types/simulation.types';
import { 
  readSimulationUrlParams, 
  copyShareableUrl 
} from '../utils/presetCodec';
import { useTheme } from '../core/theme/themeContext';
import { useLanguage } from '../core/i18n/i18nContext';
import { 
  ArrowLeft, 
  Share2, 
  Bot, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Play, 
  BookOpen, 
  Loader2, 
  Layers,
  HelpCircle,
  Sun,
  Moon,
  Globe
} from 'lucide-react';

interface SimulationPlayerPageProps {
  simulationId: string;
  onBackToCatalog: () => void;
  onSelectSimulation?: (id: string) => void;
}

export const SimulationPlayerPage: React.FC<SimulationPlayerPageProps> = ({
  simulationId,
  onBackToCatalog,
  onSelectSimulation,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t, getLocalizedTitle, getLocalizedDescription, getSubjectName } = useLanguage();

  const [activeSimId, setActiveSimId] = useState<string>(simulationId);
  const [restoredPreset, setRestoredPreset] = useState<Record<string, unknown> | null>(null);
  const [showPresetBanner, setShowPresetBanner] = useState<boolean>(false);
  const [showShareToast, setShowShareToast] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<string>('');

  // Đồng bộ khi prop simulationId thay đổi
  useEffect(() => {
    setActiveSimId(simulationId);
  }, [simulationId]);

  // Đọc ?sim=... và ?preset=... từ URL khi mở trang
  useEffect(() => {
    const { simId: urlSimId, presetData } = readSimulationUrlParams();
    
    if (urlSimId && urlSimId !== activeSimId) {
      setActiveSimId(urlSimId);
    }

    if (presetData && Object.keys(presetData).length > 0) {
      setRestoredPreset(presetData);
      setShowPresetBanner(true);
      // Tự động ẩn banner thông báo sau 6 giây
      const timer = setTimeout(() => setShowPresetBanner(false), 6000);
      return () => clearTimeout(timer);
    }
  }, []);

  const simulation = getSimulationById(activeSimId);
  const ActiveComponent = simulation?.component;

  // Xử lý sao chép liên kết chia sẻ mô phỏng
  const handleCopyShareLink = async () => {
    try {
      // Sao chép liên kết kèm preset hiện tại (nếu có)
      const res = await copyShareableUrl(activeSimId, restoredPreset || undefined);
      if (res.success) {
        setCopiedUrl(res.url);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      }
    } catch (e) {
      console.error('Lỗi khi sao chép liên kết:', e);
    }
  };

  // Danh sách các mô phỏng đã hoàn thiện để gợi ý khi bài học đang phát triển
  const availableSimulations = SIMULATION_REGISTRY.filter(s => s.isImplemented);

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200">
      {/* 1. Floating Action Bar góc trên bên trái: Quay lại thư viện, Chia sẻ, Đổi Theme & Đổi Ngôn Ngữ */}
      <div className="absolute top-2.5 left-3 z-40 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={onBackToCatalog}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          title={t('player.backCatalog')}
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>{t('player.backCatalog')}</span>
        </button>

        <button
          onClick={handleCopyShareLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          title={t('player.shareLink')}
        >
          <Share2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span className="hidden sm:inline">{t('player.shareLink')}</span>
        </button>

        {/* Nút chuyển đổi ngôn ngữ EN / VI */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xl backdrop-blur-md transition-all active:scale-95"
          title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
        >
          <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>{language === 'vi' ? 'EN' : 'VI'}</span>
        </button>

        {/* Nút chuyển đổi Theme Dark / Light */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 shadow-xl backdrop-blur-md transition-all active:scale-95"
          title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>
      </div>

      {/* 2. Banner Thông Báo Đã Nạp Preset Thành Công (Khi người học mở link giáo viên gửi) */}
      {showPresetBanner && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-950/90 dark:to-teal-950/90 border border-emerald-300 dark:border-emerald-500/60 text-emerald-800 dark:text-emerald-200 text-xs font-semibold shadow-2xl backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t('player.presetBanner')}</span>
            <button
              onClick={() => setShowPresetBanner(false)}
              className="ml-2 text-emerald-700 dark:text-emerald-400/80 hover:underline text-xs"
            >
              {t('player.bannerClose')}
            </button>
          </div>
        </div>
      )}

      {/* 3. Toast Thông Báo Đã Sao Chép Liên Kết Chia Sẻ */}
      {showShareToast && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200 pointer-events-none">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-100 dark:bg-cyan-950 border border-cyan-400 dark:border-cyan-500 text-cyan-900 dark:text-cyan-200 text-xs font-semibold shadow-2xl backdrop-blur-md">
            <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{t('player.shareToast')}</span>
          </div>
        </div>
      )}

      {/* 4. Nội Dung Chính Của Trình Phát Mô Phỏng */}
      <div className="flex-1 w-full h-full relative flex flex-col overflow-hidden">
        {simulation && ActiveComponent ? (
          <Suspense
            fallback={
              <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-3 bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium font-mono">
                  {t('player.loading')}
                </p>
              </div>
            }
          >
            <ActiveComponent initialPreset={restoredPreset} />
          </Suspense>
        ) : (
          /* Fallback khi bài học chưa có module thực thi trực tiếp */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto space-y-5 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center text-amber-500 shadow-xl">
              <BookOpen className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-mono px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800/80 font-bold">
                {t('player.notReadyTitle')}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {simulation ? getLocalizedTitle(simulation) : 'No simulation selected'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
                {simulation ? getLocalizedDescription(simulation) : t('player.notReadyDesc')}
              </p>
            </div>

            {/* Gợi ý các bài học đã sẵn sàng học ngay */}
            <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-800/80 text-left space-y-3">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                {t('player.suggestions')}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableSimulations.slice(0, 4).map(avail => (
                  <button
                    key={avail.id}
                    onClick={() => {
                      if (onSelectSimulation) {
                        onSelectSimulation(avail.id);
                      } else {
                        setActiveSimId(avail.id);
                      }
                    }}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 text-left flex items-center justify-between group transition shadow-sm"
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 truncate">
                        {getLocalizedTitle(avail)}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {t('filter.gradePrefix')} {avail.grade} • {getSubjectName(avail.subject)}
                      </div>
                    </div>
                    <Play className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onBackToCatalog}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('player.viewAll')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
