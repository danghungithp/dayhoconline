import React, { useState, useEffect, useRef } from 'react';
import { 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  PenTool, 
  Share2, 
  Bot, 
  Award, 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  ChevronRight, 
  Sliders, 
  BookOpen, 
  Check, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Quest, PresetState, SimulationMetadata, AISnapshotContext } from '../../types/simulation.types';
import { AnnotationOverlay } from './AnnotationOverlay';
import { AITutorModal } from './AITutorModal';
import { copyShareableUrl } from '../../utils/presetCodec';

interface SandboxLayoutProps {
  metadata: SimulationMetadata;
  quests?: Quest[];
  presets?: PresetState[];
  currentState: Record<string, any>;
  onReset: () => void;
  onApplyPreset?: (preset: PresetState) => void;
  children: React.ReactNode;          // Khu vực canvas / đồ thị / 3D mô phỏng chính
  controlPanel: React.ReactNode;      // Bảng điều khiển tham số bên phải
  extraStats?: React.ReactNode;       // Khối hiển thị dữ liệu đo đạc (tuỳ chọn)
}

export const SandboxLayout: React.FC<SandboxLayoutProps> = ({
  metadata,
  quests = [],
  presets = [],
  currentState,
  onReset,
  onApplyPreset,
  children,
  controlPanel,
  extraStats,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAnnotationActive, setIsAnnotationActive] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'controls' | 'quests' | 'presets'>('controls');
  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>({});
  const [showShareToast, setShowShareToast] = useState(false);
  const [activeHintId, setActiveHintId] = useState<string | null>(null);

  // Monitor Quest Conditions
  useEffect(() => {
    let newlyCompleted = false;

    quests.forEach(quest => {
      if (!completedQuests[quest.id]) {
        try {
          if (quest.targetCondition(currentState)) {
            setCompletedQuests(prev => ({ ...prev, [quest.id]: true }));
            newlyCompleted = true;
          }
        } catch (e) {
          console.error(`Lỗi kiểm tra quest ${quest.id}:`, e);
        }
      }
    });

    if (newlyCompleted) {
      // Bắn pháo hoa tán thưởng
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [currentState, quests, completedQuests]);

  // Handle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error('Lỗi bật fullscreen:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Handle Share URL with preset / state
  const handleShare = async () => {
    try {
      const res = await copyShareableUrl(metadata.id, currentState);
      if (res.success) {
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2500);
      }
    } catch (e) {
      console.error('Không thể sao chép liên kết:', e);
    }
  };

  // Tính tổng điểm Quest
  const completedCount = quests.filter(q => completedQuests[q.id]).length;
  const totalXP = quests.reduce((acc, q) => acc + (completedQuests[q.id] ? q.xpReward : 0), 0);

  // Snapshot context for AI
  const aiSnapshot: AISnapshotContext = {
    simulationId: metadata.id,
    simulationTitle: metadata.title,
    subject: metadata.subject,
    grade: metadata.grade,
    currentState,
    activeQuests: quests.map(q => ({
      id: q.id,
      title: q.title,
      completed: !!completedQuests[q.id],
    })),
    timestamp: Date.now(),
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-hidden font-sans select-none"
    >
      {/* Top Navigation & Toolbar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0">
        {/* Left: Simulation Title & Tags */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono px-2.5 py-0.5 rounded-full font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              Lớp {metadata.grade} • {metadata.subject.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">|</span>
            <h1 className="font-bold text-sm sm:text-base text-white tracking-wide truncate max-w-xs sm:max-w-md">
              {metadata.title}
            </h1>
          </div>
          <span className="text-xs text-slate-400 hidden md:inline font-mono">
            [{metadata.curriculumCode}]
          </span>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quests Quick Badge */}
          {quests.length > 0 && (
            <button
              onClick={() => setActiveTab('quests')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                completedCount === quests.length
                  ? 'bg-amber-950/70 border-amber-500/50 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-300'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Nhiệm vụ: {completedCount}/{quests.length}
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">
                +{totalXP} XP
              </span>
            </button>
          )}

          {/* AI Tutor Button */}
          <button
            onClick={() => setIsAITutorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 transition"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hỏi AI Gia sư</span>
          </button>

          {/* Annotation Pen for Teachers */}
          <button
            onClick={() => setIsAnnotationActive(!isAnnotationActive)}
            title={isAnnotationActive ? 'Tắt chế độ bút vẽ' : 'Bật bút vẽ ghi chú lên màn hình'}
            className={`p-2 rounded-lg border transition ${
              isAnnotationActive
                ? 'bg-red-950 border-red-500 text-red-400 shadow-lg shadow-red-900/30'
                : 'bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-300'
            }`}
          >
            <PenTool className="w-4 h-4" />
          </button>

          {/* Share State */}
          <button
            onClick={handleShare}
            title="Chia sẻ trạng thái mô phỏng qua URL"
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            title="Khôi phục trạng thái ban đầu"
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Workspace Area (70-75% simulation / 25-30% control) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Main Simulation Viewport ( chiếm ~72% desktop ) */}
        <main className="flex-1 lg:w-[72%] relative flex flex-col bg-slate-950 overflow-hidden">
          {/* Annotation layer sits on top of simulation */}
          <AnnotationOverlay
            isActive={isAnnotationActive}
            onToggle={() => setIsAnnotationActive(!isAnnotationActive)}
          />

          {/* Simulation Content */}
          <div className="flex-1 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden">
            {children}
          </div>

          {/* Extra live sensor/stats display strip if provided */}
          {extraStats && (
            <div className="h-auto border-t border-slate-800/80 bg-slate-900/70 p-3 shrink-0 z-10">
              {extraStats}
            </div>
          )}
        </main>

        {/* Right Sidebar Control Panel ( chiếm ~28% desktop ) */}
        <aside className="w-full lg:w-[28%] min-w-[320px] max-w-md border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/95 flex flex-col h-[40vh] lg:h-full shrink-0 z-10 shadow-2xl">
          {/* Right Tab Selector */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-1">
            <button
              onClick={() => setActiveTab('controls')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                activeTab === 'controls'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Điều khiển</span>
            </button>

            <button
              onClick={() => setActiveTab('quests')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition relative ${
                activeTab === 'quests'
                  ? 'bg-slate-800 text-amber-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Nhiệm vụ ({completedCount}/{quests.length})</span>
              {completedCount === quests.length && (
                <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
              )}
            </button>

            {presets.length > 0 && (
              <button
                onClick={() => setActiveTab('presets')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'presets'
                    ? 'bg-slate-800 text-indigo-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Mẫu sẵn</span>
              </button>
            )}
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'controls' && (
              <div className="space-y-4 animate-fade-in">{controlPanel}</div>
            )}

            {activeTab === 'quests' && (
              <div className="space-y-3 animate-fade-in">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">Mục tiêu bài học</p>
                    <p className="text-slate-400">Thao tác để đạt các điều kiện sau:</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {totalXP} XP
                    </span>
                  </div>
                </div>

                {quests.map((quest, index) => {
                  const isDone = !!completedQuests[quest.id];
                  const isHintOpen = activeHintId === quest.id;

                  return (
                    <div
                      key={quest.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-amber-950/20 border-amber-500/40 text-slate-200 shadow-sm'
                          : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4
                              className={`text-xs font-bold ${
                                isDone ? 'text-amber-300 line-through' : 'text-white'
                              }`}
                            >
                              Nhiệm vụ {index + 1}: {quest.title}
                            </h4>
                            <span className="text-[11px] font-mono font-bold text-amber-400">
                              +{quest.xpReward} XP
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {quest.description}
                          </p>

                          {/* Hint toggle */}
                          {quest.hint && (
                            <div className="mt-2">
                              <button
                                onClick={() => setActiveHintId(isHintOpen ? null : quest.id)}
                                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                              >
                                <HelpCircle className="w-3 h-3" />
                                <span>{isHintOpen ? 'Ẩn gợi ý' : 'Xem gợi ý giải'}</span>
                              </button>
                              {isHintOpen && (
                                <p className="mt-1.5 p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-[11px] text-cyan-200 italic animate-fade-in">
                                  💡 {quest.hint}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'presets' && presets.length > 0 && (
              <div className="space-y-2.5 animate-fade-in">
                <p className="text-xs text-slate-400 mb-2">
                  Chọn một cấu hình mẫu để khám phá ngay:
                </p>
                {presets.map(p => (
                  <button
                    key={p.id}
                    onClick={() => onApplyPreset?.(p)}
                    className="w-full text-left p-3 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-cyan-500/60 hover:bg-slate-800 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition">
                        {p.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{p.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Notification Toast for Share URL */}
      {showShareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>Đã sao chép liên kết chia sẻ vào khay nhớ tạm!</span>
        </div>
      )}

      {/* AI Tutor Dialog */}
      <AITutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        context={aiSnapshot}
      />
    </div>
  );
};
