import React, { useState } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { TimelineAndSentenceStage } from './TimelineAndSentenceStage';
import { ControlPanel } from './ControlPanel';
import { ENGLISH_QUESTS, EnglishSimulationState } from './quests';
import { ENGLISH_PRESETS, EnglishPresetConfig } from './presets';
import { 
  TenseId, 
  TENSES_DATA, 
  transformActiveToPassive, 
  PASSIVE_TEMPLATES, 
  SchoolLevel 
} from './grammarEngine';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { Volume2, BookOpen, Clock, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

const METADATA: SimulationMetadata = {
  id: 'eng-present-simple-continuous',
  title: 'Trực quan hóa 12 Thì & Biến đổi Bị động (Web Speech)',
  titleEn: 'Visual English Tenses Timeline & Active-Passive Voice Transformer',
  subject: 'tieng-anh',
  grade: 8,
  level: 'THCS',
  topic: 'Ngữ pháp trực quan & Nghe đọc AI (GDPT Tiếng Anh)',
  description: 'Trục thời gian tương tác 8 thì trọng tâm cấp 2 & 3; chuyển đổi câu chủ động sang bị động với khối từ Lego; phát âm chuẩn giọng bản xứ (en-US / en-GB) qua Web Speech API.',
  curriculumCode: 'GDPT2018-ENG8-U3',
  difficulty: 'Khá',
  estimatedMinutes: 30,
  tags: ['12 thì tiếng Anh', 'Câu bị động', 'Active Passive', 'Timeline', 'Web Speech API', 'Phát âm'],
  technology: 'speech-ai',
  isImplemented: true,
};

interface VisualTensesVoiceSimulationProps {
  initialPreset?: any;
}

export default function VisualTensesVoiceSimulation({ initialPreset }: VisualTensesVoiceSimulationProps) {
  const [mode, setMode] = useState<'timeline' | 'transformer'>('timeline');
  const [selectedTense, setSelectedTense] = useState<TenseId>('present-continuous');
  const [passiveTenseKey, setPassiveTenseKey] = useState<string>('past-simple');
  const [isPassiveVoice, setIsPassiveVoice] = useState<boolean>(false);
  const [selectedVerbBase, setSelectedVerbBase] = useState<string>('build');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<SchoolLevel | 'ALL'>('ALL');
  const [hasListenedAudio, setHasListenedAudio] = useState<boolean>(false);

  // Khôi phục preset từ URL hoặc prop
  React.useEffect(() => {
    try {
      if (initialPreset && typeof initialPreset === 'object') {
        if (initialPreset.mode) setMode(initialPreset.mode);
        if (initialPreset.selectedTense) setSelectedTense(initialPreset.selectedTense);
        if (initialPreset.passiveTenseKey) setPassiveTenseKey(initialPreset.passiveTenseKey);
        if (typeof initialPreset.isPassiveVoice === 'boolean') setIsPassiveVoice(initialPreset.isPassiveVoice);
        if (initialPreset.selectedVerbBase) setSelectedVerbBase(initialPreset.selectedVerbBase);
        return;
      }

      const { presetData, rawPreset } = readSimulationUrlParams();
      if (presetData) {
        if (presetData.mode) setMode(presetData.mode as any);
        if (presetData.selectedTense) setSelectedTense(presetData.selectedTense as TenseId);
        if (presetData.passiveTenseKey) setPassiveTenseKey(presetData.passiveTenseKey as string);
        if (typeof presetData.isPassiveVoice === 'boolean') setIsPassiveVoice(presetData.isPassiveVoice as boolean);
        if (presetData.selectedVerbBase) setSelectedVerbBase(presetData.selectedVerbBase as string);
        return;
      }

      if (rawPreset) {
        const found = ENGLISH_PRESETS.find(pr => pr.id === rawPreset);
        if (found) {
          setMode(found.state.mode);
          setSelectedTense(found.state.selectedTense);
          setPassiveTenseKey(found.state.passiveTenseKey);
          setIsPassiveVoice(found.state.isPassiveVoice);
          setSelectedVerbBase(found.state.selectedVerbBase);
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc preset Tiếng Anh:', e);
    }
  }, [initialPreset]);

  const currentTense = TENSES_DATA[selectedTense];
  const passiveData = transformActiveToPassive(passiveTenseKey, selectedVerbBase);

  const handleReset = () => {
    setMode('timeline');
    setSelectedTense('present-continuous');
    setPassiveTenseKey('past-simple');
    setIsPassiveVoice(false);
    setSelectedVerbBase('build');
    setSelectedLevelFilter('ALL');
    setHasListenedAudio(false);
  };

  const handleApplyPreset = (preset: PresetState<EnglishPresetConfig>) => {
    setMode(preset.state.mode);
    setSelectedTense(preset.state.selectedTense);
    setPassiveTenseKey(preset.state.passiveTenseKey);
    setIsPassiveVoice(preset.state.isPassiveVoice);
    setSelectedVerbBase(preset.state.selectedVerbBase);
  };

  // State snapshot cho Quests và AI Gia sư
  const currentSimulationState: EnglishSimulationState = {
    mode,
    selectedTense,
    passiveTenseKey,
    isPassiveVoice,
    selectedVerbBase,
    hasListenedAudio,
  };

  const snapshotState = {
    ...currentSimulationState,
    tenseNameVi: currentTense.nameVi,
    tenseNameEn: currentTense.nameEn,
    formula: currentTense.formula,
    passiveFullSentence: passiveData.fullPassiveSentence,
    summaryForAI: `
BÀI HỌC: Trực quan hóa 12 Thì & Biến đổi Câu Bị Động (GDPT Tiếng Anh)
- Chế độ: ${mode === 'timeline' ? 'Trục thời gian các thì' : 'Biến đổi Chủ động ↔ Bị động'}
- Thì đang khảo sát: ${currentTense.nameEn} (${currentTense.nameVi})
- Công thức: Khẳng định: ${currentTense.formula.affirmative} | Phủ định: ${currentTense.formula.negative}
- Dấu hiệu nhận biết: ${currentTense.signals.join(', ')}
- Câu bị động hiện thời: ${isPassiveVoice ? passiveData.fullPassiveSentence : 'Đang ở dạng chủ động'}
- Động từ bất quy tắc thực hành: ${selectedVerbBase} (V3: ${passiveData.pastParticiple})
`.trim(),
  };

  // Thanh trạng thái đo đạc thời gian thực ở đáy màn hình
  const extraStats = (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 font-mono">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">Thì hiện tại:</span>
          <span className="text-white font-bold">{currentTense.nameEn}</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400">Công thức:</span>
          <span className="text-amber-300 font-bold">{currentTense.formula.affirmative}</span>
        </div>

        {mode === 'transformer' && (
          <div className="flex items-center gap-1.5 font-mono">
            <ArrowLeftRight className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400">Thể:</span>
            <span className={`font-bold ${isPassiveVoice ? 'text-purple-300' : 'text-cyan-300'}`}>
              {isPassiveVoice ? 'BỊ ĐỘNG (Passive)' : 'CHỦ ĐỘNG (Active)'}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Web Speech API Ready</span>
        </span>
      </div>
    </div>
  );

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={ENGLISH_QUESTS}
      presets={ENGLISH_PRESETS}
      currentState={snapshotState}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      extraStats={extraStats}
      controlPanel={
        <ControlPanel
          mode={mode}
          selectedTense={selectedTense}
          passiveTenseKey={passiveTenseKey}
          isPassiveVoice={isPassiveVoice}
          selectedVerbBase={selectedVerbBase}
          selectedLevelFilter={selectedLevelFilter}
          onSetMode={setMode}
          onSelectTense={setSelectedTense}
          onSelectPassiveTenseKey={setPassiveTenseKey}
          onTogglePassiveVoice={() => setIsPassiveVoice(!isPassiveVoice)}
          onSelectVerbBase={setSelectedVerbBase}
          onSetLevelFilter={setSelectedLevelFilter}
          onReset={handleReset}
        />
      }
    >
      <TimelineAndSentenceStage
        mode={mode}
        selectedTense={selectedTense}
        passiveTenseKey={passiveTenseKey}
        isPassiveVoice={isPassiveVoice}
        selectedVerbBase={selectedVerbBase}
        onSelectTense={setSelectedTense}
        onTogglePassiveVoice={() => setIsPassiveVoice(!isPassiveVoice)}
        onAudioPlayed={() => setHasListenedAudio(true)}
      />
    </SandboxLayout>
  );
}
