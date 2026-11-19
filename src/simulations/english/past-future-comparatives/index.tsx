import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { ComparativesVisualizer } from './ComparativesVisualizer';
import { PastFutureTimeline } from './PastFutureTimeline';
import { ControlPanel } from './ControlPanel';
import { PastFutureState } from './types';
import { ANIMALS, VEHICLES } from './comparativeEngine';
import { COMPARATIVES_QUESTS } from './quests';
import { COMPARATIVES_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { useTheme } from '../../../core/theme/themeContext';

const METADATA: SimulationMetadata = {
  id: 'eng-past-future-comparatives',
  title: 'Past Simple vs. Future & So sánh hơn/nhất (Comparatives)',
  titleEn: 'Past Simple vs Future (will/going to) & Interactive Comparatives',
  subject: 'tieng-anh',
  grade: 7,
  level: 'THCS',
  topic: 'Grammar & Speech (GDPT 2018)',
  description: 'Trục thời gian quá khứ - tương lai; so sánh tốc độ/chiều cao/cân nặng động vật và phương tiện để tự động sinh câu so sánh hơn và so sánh nhất kèm phát âm chuẩn Web Speech API.',
  curriculumCode: 'GDPT2018-ENG7-U2',
  difficulty: 'Cơ bản',
  estimatedMinutes: 25,
  tags: ['Quá khứ đơn', 'Tương lai đơn', 'So sánh hơn', 'So sánh nhất', 'Web Speech API', 'Phát âm'],
  technology: 'speech-ai',
  isImplemented: true,
};

const DEFAULT_STATE: PastFutureState = {
  activeTab: 'comparatives',
  category: 'animals',
  itemAId: 'cheetah',
  itemBId: 'elephant',
  attribute: 'speed',
  showSuperlative: true,
  selectedTense: 'past-simple',
  verbBase: 'visit',
  speechFeedback: null,
  isListening: false,
  score: 100,
};

interface PastFutureSimulationProps {
  initialPreset?: any;
}

export default function PastFutureComparativesSimulation({
  initialPreset,
}: PastFutureSimulationProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const resolvedInitialState = useMemo<PastFutureState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<PastFutureState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<PastFutureState>(resolvedInitialState);

  const handleStateChange = (patch: Partial<PastFutureState>) => {
    setState(prev => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setState(DEFAULT_STATE);
  };

  const handleApplyPreset = (preset: PresetState) => {
    if (preset.state) {
      setState(prev => ({ ...prev, ...preset.state }));
    }
  };

  const currentItems = state.category === 'animals' ? ANIMALS : VEHICLES;

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={COMPARATIVES_QUESTS}
      presets={COMPARATIVES_PRESETS}
      currentState={state}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      controlPanel={
        <ControlPanel
          state={state}
          onChange={handleStateChange}
        />
      }
    >
      <div className="w-full h-full flex flex-col justify-center items-center">
        {state.activeTab === 'comparatives' ? (
          <ComparativesVisualizer
            items={currentItems}
            itemAId={state.itemAId}
            itemBId={state.itemBId}
            attribute={state.attribute}
            isDark={isDark}
          />
        ) : (
          <PastFutureTimeline
            selectedVerbBase={state.verbBase}
            onSelectVerb={verb => handleStateChange({ verbBase: verb })}
            isDark={isDark}
          />
        )}
      </div>
    </SandboxLayout>
  );
}
