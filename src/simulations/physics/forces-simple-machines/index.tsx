import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { ForcesCanvas } from './ForcesCanvas';
import { ControlPanel } from './ControlPanel';
import { ForcesMachineState } from './types';
import { FORCES_QUESTS } from './quests';
import { FORCES_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { useTheme } from '../../../core/theme/themeContext';

const METADATA: SimulationMetadata = {
  id: 'phys-forces-simple-machines',
  title: 'Lực, Biến dạng chuyển động, Đòn bẩy & Mặt phẳng nghiêng',
  titleEn: 'Forces, Hooke\'s Law, Levers & Inclined Planes',
  subject: 'khtn',
  grade: 6,
  level: 'THCS',
  topic: 'Lực và Chuyển động (GDPT 2018)',
  description: 'Khám phá độ biến dạng lò xo và định luật Hooke qua lực kế; cơ chế đòn bẩy có điểm tựa để nâng vật nặng và tính toán lực kéo trên mặt phẳng nghiêng.',
  curriculumCode: 'GDPT2018-KHTN6-P1',
  difficulty: 'Cơ bản',
  estimatedMinutes: 25,
  tags: ['Lực', 'Lực đàn hồi', 'Lực kế', 'Định luật Hooke', 'Đòn bẩy', 'Mặt phẳng nghiêng'],
  technology: 'canvas2d',
  isImplemented: true,
};

const DEFAULT_STATE: ForcesMachineState = {
  mode: 'spring',
  springConstant: 50,
  massGrams: 200,
  gravity: 9.8,
  loadForceN: 40,
  loadArmM: 1.0,
  effortArmM: 2.0,
  inclineAngleDeg: 30,
  inclineHeightM: 1.5,
  boxMassKg: 20,
};

interface ForcesSimulationProps {
  initialPreset?: any;
}

export default function ForcesSimpleMachinesSimulation({
  initialPreset,
}: ForcesSimulationProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const resolvedInitialState = useMemo<ForcesMachineState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<ForcesMachineState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<ForcesMachineState>(resolvedInitialState);

  const handleStateChange = (patch: Partial<ForcesMachineState>) => {
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

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={FORCES_QUESTS}
      presets={FORCES_PRESETS}
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
        <ForcesCanvas state={state} isDark={isDark} />
      </div>
    </SandboxLayout>
  );
}
