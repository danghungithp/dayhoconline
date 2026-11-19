import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  ArrowRight, 
  ArrowLeftRight, 
  Sparkles, 
  Check, 
  Clock, 
  HelpCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { 
  TenseId, 
  TENSES_DATA, 
  transformActiveToPassive, 
  TransformedPassiveResult, 
  PASSIVE_TEMPLATES 
} from './grammarEngine';

interface TimelineAndSentenceStageProps {
  mode: 'timeline' | 'transformer';
  selectedTense: TenseId;
  passiveTenseKey: string;
  isPassiveVoice: boolean;
  selectedVerbBase: string;
  onSelectTense: (tense: TenseId) => void;
  onTogglePassiveVoice: () => void;
  onAudioPlayed?: () => void;
}

export const TimelineAndSentenceStage: React.FC<TimelineAndSentenceStageProps> = ({
  mode,
  selectedTense,
  passiveTenseKey,
  isPassiveVoice,
  selectedVerbBase,
  onSelectTense,
  onTogglePassiveVoice,
  onAudioPlayed,
}) => {
  const [voiceRate, setVoiceRate] = useState<number>(1.0);
  const [voiceLang, setVoiceLang] = useState<'en-US' | 'en-GB'>('en-US');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeSentenceType, setActiveSentenceType] = useState<'positive' | 'negative' | 'question'>('positive');

  const currentTense = TENSES_DATA[selectedTense];
  const passiveData: TransformedPassiveResult = transformActiveToPassive(
    passiveTenseKey,
    selectedVerbBase
  );

  // Web Speech API: Đọc câu tiếng Anh chuẩn giọng bản xứ
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ Web Speech API.');
      return;
    }

    window.speechSynthesis.cancel(); // Dừng câu đang phát trước đó
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLang;
    utterance.rate = voiceRate;

    // Ưu tiên chọn giọng en-US hoặc en-GB nếu có trong hệ thống
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(voiceLang.slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onAudioPlayed?.();
    };
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const getSpokenSentence = (): string => {
    if (mode === 'timeline') {
      return currentTense.examples[activeSentenceType];
    } else {
      const template = PASSIVE_TEMPLATES[passiveTenseKey];
      if (isPassiveVoice) {
        return passiveData.fullPassiveSentence;
      } else {
        const ex = template.exampleActive;
        return `${ex.subject} ${ex.verb} ${ex.object} ${ex.adverb}.`;
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 select-none overflow-y-auto">
      {/* Speech Audio Bar at Top */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => speakText(getSpokenSentence())}
            disabled={isSpeaking}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition ${
              isSpeaking
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-600/25'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'Đang đọc...' : 'Nghe đọc câu chuẩn'}</span>
          </button>

          <span className="text-xs text-slate-300 font-medium italic hidden md:inline truncate max-w-sm">
            "{getSpokenSentence()}"
          </span>
        </div>

        {/* Voice Controls (Tốc độ & Ngôn ngữ) */}
        <div className="flex items-center gap-2 text-xs">
          {/* Tốc độ đọc */}
          <div className="flex rounded-lg bg-slate-950 border border-slate-800 p-0.5">
            <button
              onClick={() => setVoiceRate(0.8)}
              className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition ${
                voiceRate === 0.8 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              0.8x (Chậm)
            </button>
            <button
              onClick={() => setVoiceRate(1.0)}
              className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition ${
                voiceRate === 1.0 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              1.0x (Tự nhiên)
            </button>
          </div>

          {/* Giọng Anh - Mỹ / Anh - Anh */}
          <div className="flex rounded-lg bg-slate-950 border border-slate-800 p-0.5">
            <button
              onClick={() => setVoiceLang('en-US')}
              className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition ${
                voiceLang === 'en-US' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              en-US
            </button>
            <button
              onClick={() => setVoiceLang('en-GB')}
              className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition ${
                voiceLang === 'en-GB' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              en-GB
            </button>
          </div>
        </div>
      </div>

      {/* Main Center Stage */}
      <div className="flex-1 my-4 flex flex-col justify-center items-center">
        {mode === 'timeline' ? (
          /* =========================================================================
             CHẾ ĐỘ 1: TRỤC THỜI GIAN CÁC THÌ (INTERACTIVE SVG TIMELINE)
             ========================================================================= */
          <div className="w-full max-w-4xl space-y-6 animate-fade-in">
            {/* SVG Interactive Timeline */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white text-sm">
                    {currentTense.nameEn} ({currentTense.nameVi})
                  </span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {currentTense.level}
                </span>
              </div>

              {/* The Timeline Graphic SVG */}
              <div className="relative w-full h-36 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 800 140" fill="none">
                  {/* Trục chính thời gian */}
                  <line x1="50" y1="70" x2="750" y2="70" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
                  {/* Mũi tên chỉ tương lai */}
                  <polygon points="755,70 740,63 740,77" fill="#38bdf8" />

                  {/* Vùng Quá khứ (Past) */}
                  <text x="120" y="30" fill="#64748b" fontSize="12" fontWeight="bold" fontFamily="monospace">
                    PAST (Quá khứ)
                  </text>
                  <line x1="200" y1="60" x2="200" y2="80" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />

                  {/* Mốc Hiện Tại (NOW) */}
                  <line x1="420" y1="20" x2="420" y2="120" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5 5" />
                  <rect x="390" y="10" width="60" height="24" rx="12" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="420" y="26" fill="#fef3c7" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    NOW
                  </text>

                  {/* Vùng Tương lai (Future) */}
                  <text x="640" y="30" fill="#64748b" fontSize="12" fontWeight="bold" fontFamily="monospace">
                    FUTURE (Tương lai)
                  </text>
                  <line x1="620" y1="60" x2="620" y2="80" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />

                  {/* =========================================================================
                      HỌA TIẾT ĐẶC TRƯNG TỪNG THÌ TRÊN TRỤC
                      ========================================================================= */}
                  {/* 1. Present Simple: Các chấm lặp lại đều đặn */}
                  {currentTense.id === 'present-simple' && (
                    <g>
                      {[150, 230, 310, 390, 470, 550, 630].map((x, idx) => (
                        <circle key={idx} cx={x} cy="70" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2">
                          <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" begin={`${idx * 0.2}s`} />
                        </circle>
                      ))}
                      <text x="400" y="115" fill="#38bdf8" fontSize="12" textAnchor="middle" fontWeight="bold">
                        Hành động lặp đi lặp lại thành thói quen hoặc chân lý
                      </text>
                    </g>
                  )}

                  {/* 2. Present Continuous: Sóng lượn ngay tại mốc NOW */}
                  {currentTense.id === 'present-continuous' && (
                    <g>
                      <path
                        d="M 340 70 Q 380 40, 420 70 T 500 70"
                        stroke="#06b6d4"
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                      >
                        <animate attributeName="stroke-dashoffset" values="0;20" dur="1s" repeatCount="indefinite" />
                      </path>
                      <circle cx="420" cy="70" r="9" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                      <text x="420" y="115" fill="#06b6d4" fontSize="12" textAnchor="middle" fontWeight="bold">
                        Đang diễn ra xung quanh thời điểm nói (NOW)
                      </text>
                    </g>
                  )}

                  {/* 3. Past Simple: Điểm X dứt khoát trong quá khứ */}
                  {currentTense.id === 'past-simple' && (
                    <g>
                      <circle cx="240" cy="70" r="10" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                      <line x1="234" y1="64" x2="246" y2="76" stroke="#ffffff" strokeWidth="2" />
                      <line x1="246" y1="64" x2="234" y2="76" stroke="#ffffff" strokeWidth="2" />
                      <text x="240" y="115" fill="#f87171" fontSize="12" textAnchor="middle" fontWeight="bold">
                        Bắt đầu và kết thúc hoàn toàn tại một thời điểm quá khứ (Last year / Yesterday)
                      </text>
                    </g>
                  )}

                  {/* 4. Past Continuous: Đoạn sóng trong quá khứ */}
                  {currentTense.id === 'past-continuous' && (
                    <g>
                      <rect x="180" y="62" width="140" height="16" rx="8" fill="#fb923c" opacity="0.8" />
                      <circle cx="250" cy="70" r="10" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                      <text x="250" y="115" fill="#fb923c" fontSize="12" textAnchor="middle" fontWeight="bold">
                        Đang diễn ra tại thời điểm xác định quá khứ (At 8 PM yesterday)
                      </text>
                    </g>
                  )}

                  {/* 5. Present Perfect: Cầu nối quá khứ chạm vào NOW */}
                  {currentTense.id === 'present-perfect' && (
                    <g>
                      <path
                        d="M 200 70 C 260 20, 360 20, 420 70"
                        stroke="#10b981"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="6 3"
                      />
                      <circle cx="200" cy="70" r="8" fill="#10b981" />
                      <circle cx="420" cy="70" r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                      <text x="310" y="115" fill="#34d399" fontSize="12" textAnchor="middle" fontWeight="bold">
                        Bắt đầu ở quá khứ, kéo dài hoặc để lại kết quả ở HIỆN TẠI (Since / For)
                      </text>
                    </g>
                  )}

                  {/* 6. Past Perfect: Xảy ra trước một mốc quá khứ khác */}
                  {currentTense.id === 'past-perfect' && (
                    <g>
                      <circle cx="150" cy="70" r="9" fill="#a855f7" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="270" cy="70" r="7" fill="#64748b" />
                      <path d="M 150 70 Q 210 45, 265 67" stroke="#c084fc" strokeWidth="3" fill="none" markerEnd="url(#arrow)" />
                      <text x="150" y="50" fill="#c084fc" fontSize="11" textAnchor="middle" fontWeight="bold">
                        Hành động 1 (Had + V3)
                      </text>
                      <text x="270" y="95" fill="#94a3b8" fontSize="10" textAnchor="middle">
                        Hành động 2 (V2)
                      </text>
                      <text x="250" y="125" fill="#c084fc" fontSize="12" textAnchor="middle" fontWeight="bold">
                        Xảy ra và kết thúc TRƯỚC một hành động khác trong quá khứ
                      </text>
                    </g>
                  )}

                  {/* 7. Future Simple: Mốc tương lai */}
                  {currentTense.id === 'future-simple' && (
                    <g>
                      <circle cx="600" cy="70" r="10" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                      <text x="600" y="115" fill="#60a5fa" fontSize="12" textAnchor="middle" fontWeight="bold">
                        Hành động sẽ xảy ra trong tương lai (Tomorrow / Next week)
                      </text>
                    </g>
                  )}

                  {/* 8. Future Continuous: Đoạn sóng trong tương lai */}
                  {currentTense.id === 'future-continuous' && (
                    <g>
                      <rect x="540" y="62" width="130" height="16" rx="8" fill="#8b5cf6" opacity="0.8" />
                      <circle cx="600" cy="70" r="9" fill="#7c3aed" stroke="#ffffff" strokeWidth="2" />
                      <text x="600" y="115" fill="#a78bfa" fontSize="12" textAnchor="middle" fontWeight="bold">
                        Sẽ đang diễn ra tại một thời điểm xác định trong tương lai
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Dấu hiệu nhận biết */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-800 text-xs">
                <span className="font-bold text-slate-400">Từ nhận biết (Signals):</span>
                {currentTense.signals.map((sig, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-slate-950 text-cyan-300 font-mono text-[11px] border border-cyan-900/50"
                  >
                    {sig}
                  </span>
                ))}
              </div>
            </div>

            {/* Mẫu câu thực tế 3 thể (+, -, ?) */}
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Mẫu câu minh họa thực tế:</span>
                <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
                  <button
                    onClick={() => setActiveSentenceType('positive')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      activeSentenceType === 'positive' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Khẳng định (+)
                  </button>
                  <button
                    onClick={() => setActiveSentenceType('negative')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      activeSentenceType === 'negative' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Phủ định (-)
                  </button>
                  <button
                    onClick={() => setActiveSentenceType('question')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      activeSentenceType === 'question' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Nghi vấn (?)
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-base font-bold text-cyan-300 font-mono">
                    {currentTense.examples[activeSentenceType]}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 italic">
                    Dịch nghĩa: {currentTense.examples.translationVi}
                  </p>
                </div>

                <button
                  onClick={() => speakText(currentTense.examples[activeSentenceType])}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             CHẾ ĐỘ 2: ACTIVE ↔ PASSIVE TRANSFORMER (KHỐI TỪ LEGO CHUYỂN VỊ)
             ========================================================================= */
          <div className="w-full max-w-4xl space-y-6 animate-fade-in">
            {/* Thanh chuyển đổi Chủ động ↔ Bị động */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={onTogglePassiveVoice}
                className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 border shadow-lg transition-all ${
                  isPassiveVoice
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400 text-white shadow-purple-900/40'
                    : 'bg-slate-900 border-cyan-500 text-cyan-300 shadow-cyan-950'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>
                  {isPassiveVoice ? 'Đang ở dạng BỊ ĐỘNG (Passive Voice)' : 'Đang ở dạng CHỦ ĐỘNG (Active Voice)'}
                </span>
              </button>
            </div>

            {/* Khối từ Lego trực quan */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-white text-xs">
                  Cấu trúc câu {isPassiveVoice ? 'Bị động' : 'Chủ động'} ({PASSIVE_TEMPLATES[passiveTenseKey].tenseName}):
                </span>
                <span className="text-[11px] font-mono text-cyan-400">
                  {isPassiveVoice ? 'S_mới + be + V3/V-ed + by Agent' : 'S + V + O'}
                </span>
              </div>

              {/* Các khối từ Lego (Lego Sentence Blocks) */}
              <div className="flex flex-wrap items-center justify-center gap-3 py-6">
                {!isPassiveVoice ? (
                  /* Câu Chủ Động */
                  <>
                    <div className="p-4 rounded-2xl bg-cyan-950/80 border-2 border-cyan-500 text-center shadow-lg min-w-[120px]">
                      <span className="text-[10px] text-cyan-400 block font-mono font-bold uppercase mb-1">
                        Chủ ngữ (Subject)
                      </span>
                      <span className="text-base font-bold text-white font-mono">
                        {PASSIVE_TEMPLATES[passiveTenseKey].exampleActive.subject}
                      </span>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-500 shrink-0" />

                    <div className="p-4 rounded-2xl bg-amber-950/80 border-2 border-amber-500 text-center shadow-lg min-w-[130px]">
                      <span className="text-[10px] text-amber-400 block font-mono font-bold uppercase mb-1">
                        Động từ (Verb)
                      </span>
                      <span className="text-base font-bold text-white font-mono">
                        {PASSIVE_TEMPLATES[passiveTenseKey].exampleActive.verb}
                      </span>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-500 shrink-0" />

                    <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-center shadow-lg min-w-[130px]">
                      <span className="text-[10px] text-emerald-400 block font-mono font-bold uppercase mb-1">
                        Tân ngữ (Object)
                      </span>
                      <span className="text-base font-bold text-white font-mono">
                        {PASSIVE_TEMPLATES[passiveTenseKey].exampleActive.object}
                      </span>
                    </div>

                    {PASSIVE_TEMPLATES[passiveTenseKey].exampleActive.adverb && (
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-700 text-center shadow-md">
                        <span className="text-[10px] text-slate-400 block font-mono mb-1">Thời gian/Nơi chốn</span>
                        <span className="text-sm font-medium text-slate-300 font-mono">
                          {PASSIVE_TEMPLATES[passiveTenseKey].exampleActive.adverb}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  /* Câu Bị Động Hoán Vị */
                  <>
                    <div className="p-4 rounded-2xl bg-emerald-950/90 border-2 border-emerald-400 text-center shadow-lg min-w-[140px] animate-fade-in">
                      <span className="text-[10px] text-emerald-300 block font-mono font-bold uppercase mb-1">
                        Chủ ngữ bị động (S)
                      </span>
                      <span className="text-base font-bold text-white font-mono">
                        {passiveData.passiveSubject}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-950/90 border-2 border-purple-400 text-center shadow-lg min-w-[110px] animate-fade-in">
                      <span className="text-[10px] text-purple-300 block font-mono font-bold uppercase mb-1">
                        To Be
                      </span>
                      <span className="text-base font-bold text-purple-200 font-mono">
                        {passiveData.beForm}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-950/90 border-2 border-amber-400 text-center shadow-lg min-w-[130px] animate-fade-in">
                      <span className="text-[10px] text-amber-300 block font-mono font-bold uppercase mb-1">
                        Quá khứ phân từ (V3)
                      </span>
                      <span className="text-base font-bold text-amber-200 font-mono">
                        {passiveData.pastParticiple}
                      </span>
                    </div>

                    {passiveData.byAgent && (
                      <div className="p-4 rounded-2xl bg-cyan-950/90 border-2 border-cyan-400 text-center shadow-lg min-w-[120px] animate-fade-in">
                        <span className="text-[10px] text-cyan-300 block font-mono font-bold uppercase mb-1">
                          Tác nhân (by Agent)
                        </span>
                        <span className="text-base font-bold text-white font-mono">
                          {passiveData.byAgent}
                        </span>
                      </div>
                    )}

                    {passiveData.adverb && (
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-700 text-center shadow-md">
                        <span className="text-[10px] text-slate-400 block font-mono mb-1">Thời gian</span>
                        <span className="text-sm font-medium text-slate-300 font-mono">
                          {passiveData.adverb}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Câu hoàn chỉnh */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <p className="text-sm font-semibold text-slate-400">Câu hoàn chỉnh:</p>
                <p className="text-lg font-bold text-white font-mono mt-1 tracking-wide">
                  {isPassiveVoice
                    ? passiveData.fullPassiveSentence
                    : `${PASSIVE_TEMPLATES[passiveTenseKey].exampleActive.subject} ${PASSIVE_TEMPLATES[passiveTenseKey].exampleActive.verb} ${PASSIVE_TEMPLATES[passiveTenseKey].exampleActive.object} ${PASSIVE_TEMPLATES[passiveTenseKey].exampleActive.adverb}.`}
                </p>
              </div>

              {/* Các bước giải thích chuyển đổi sư phạm */}
              {isPassiveVoice && (
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-purple-900/40 text-xs space-y-2">
                  <span className="font-bold text-purple-300 block flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Các bước chuyển đổi ngữ pháp chuẩn GDPT:
                  </span>
                  <div className="space-y-1.5 text-slate-300">
                    {passiveData.explanationSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-purple-950 text-purple-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
