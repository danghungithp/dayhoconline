import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { IntegersFractionsCanvas } from './IntegersFractionsCanvas';
import { ControlPanel } from './ControlPanel';
import { IntegersFractionsState } from './types';
import { INTEGERS_QUESTS } from './quests';
import { INTEGERS_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { useTheme } from '../../../core/theme/themeContext';

const METADATA: SimulationMetadata = {
  id: 'math-integers-fractions',
  title: 'Số nguyên trên trục số, Quy tắc dấu ngoặc & Phân số trực quan',
  titleEn: 'Integers on Number Line & Visual Fraction Models',
  subject: 'toan',
  grade: 6,
  level: 'THCS',
  topic: 'Số học & Phân số (GDPT 2018)',
  description: 'Trục số nguyên âm - dương, bước nhảy phép cộng trừ số nguyên và quy tắc dấu ngoặc; mô hình đĩa tròn pizza và thanh phân số trực quan hóa tỉ lệ phần trăm.',
  curriculumCode: 'GDPT2018-TOAN6-A1',
  difficulty: 'Cơ bản',
  estimatedMinutes: 25,
  tags: ['Số nguyên', 'Trục số', 'Số đối', 'Dấu ngoặc', 'Phân số', 'Rút gọn phân số'],
  technology: 'canvas2d',
  isImplemented: true,
};

const DEFAULT_STATE: IntegersFractionsState = {
  mode: 'integers',
  firstNum: 3,
  operation: '+',
  secondNum: -5,
  showOpposite: false,
  numerator: 3,
  denominator: 4,
  displayModel: 'circle',
};

interface IntegersSimulationProps {
  initialPreset?: any;
}

export default function IntegersFractionsSimulation({
  initialPreset,
}: IntegersSimulationProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const resolvedInitialState = useMemo<IntegersFractionsState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<IntegersFractionsState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<IntegersFractionsState>(resolvedInitialState);

  const handleStateChange = (patch: Partial<IntegersFractionsState>) => {
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
      quests={INTEGERS_QUESTS}
      presets={INTEGERS_PRESETS}
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
        <IntegersFractionsCanvas state={state} isDark={isDark} />
      </div>
    </SandboxLayout>
  );
}
