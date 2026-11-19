import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { ReactionCanvas } from './ReactionCanvas';
import { ControlPanel } from './ControlPanel';
import { ReactionBalancingState } from './types';
import { REACTIONS_DATA } from './reactionsEngine';
import { REACTION_QUESTS } from './quests';
import { REACTION_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { useTheme } from '../../../core/theme/themeContext';

const METADATA: SimulationMetadata = {
  id: 'chem-balancing-reactions',
  title: 'Định luật bảo toàn khối lượng & Cân bằng PTHH',
  titleEn: 'Conservation of Mass & Visual Chemical Equation Balancing',
  subject: 'khtn',
  grade: 8,
  level: 'THCS',
  topic: 'Phản ứng Hóa học (GDPT 2018)',
  description: 'Mô phỏng cân đĩa hai bên đối chiếu khối lượng các chất trước và sau phản ứng; đếm nguyên tử thời gian thực để cân bằng phương trình hóa học trực quan.',
  curriculumCode: 'GDPT2018-KHTN8-C1',
  difficulty: 'Cơ bản',
  estimatedMinutes: 25,
  tags: ['Bảo toàn khối lượng', 'Phương trình hóa học', 'Cân bằng PTHH', 'Nguyên tử', 'Phân tử'],
  technology: 'canvas2d',
  isImplemented: true,
};

const DEFAULT_STATE: ReactionBalancingState = {
  reactionId: 'h2-o2-water',
  coeffs: [1, 1, 1],
  showAtomCounts: true,
  showMassBalance: true,
};

interface ReactionBalancingSimulationProps {
  initialPreset?: any;
}

export default function ReactionBalancingSimulation({
  initialPreset,
}: ReactionBalancingSimulationProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const resolvedInitialState = useMemo<ReactionBalancingState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<ReactionBalancingState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<ReactionBalancingState>(resolvedInitialState);

  const currentReaction = useMemo(
    () => REACTIONS_DATA.find(r => r.id === state.reactionId) || REACTIONS_DATA[0],
    [state.reactionId]
  );

  const handleStateChange = (patch: Partial<ReactionBalancingState>) => {
    setState(prev => ({ ...prev, ...patch }));
  };

  const handleCoeffChange = (index: number, delta: number) => {
    setState(prev => {
      const newCoeffs = [...prev.coeffs];
      newCoeffs[index] = Math.max(1, Math.min(8, (newCoeffs[index] || 1) + delta));
      return { ...prev, coeffs: newCoeffs };
    });
  };

  const handleResetCoeffs = () => {
    const totalCount = currentReaction.reactants.length + currentReaction.products.length;
    setState(prev => ({ ...prev, coeffs: Array(totalCount).fill(1) }));
  };

  const handleReset = () => {
    setState(DEFAULT_STATE);
  };

  const handleApplyPreset = (preset: PresetState) => {
    if (preset.state) {
      setState(prev => ({ ...prev, ...preset.state }));
    }
  };

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={REACTION_QUESTS}
      presets={REACTION_PRESETS}
      currentState={state}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      controlPanel={
        <ControlPanel
          state={state}
          onChange={handleStateChange}
          onCoeffChange={handleCoeffChange}
          onResetCoeffs={handleResetCoeffs}
        />
      }
    >
      <div className="w-full h-full flex flex-col justify-center items-center">
        <ReactionCanvas
          reaction={currentReaction}
          coeffs={state.coeffs}
          showAtomCounts={state.showAtomCounts}
          showMassBalance={state.showMassBalance}
          isDark={isDark}
        />
      </div>
    </SandboxLayout>
  );
}
