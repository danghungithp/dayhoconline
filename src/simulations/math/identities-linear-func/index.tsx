import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { IdentitiesCanvas } from './IdentitiesCanvas';
import { LinearFuncCanvas } from './LinearFuncCanvas';
import { ControlPanel } from './ControlPanel';
import { IdentitiesState } from './types';
import { IDENTITIES_QUESTS } from './quests';
import { IDENTITIES_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { useTheme } from '../../../core/theme/themeContext';

const METADATA: SimulationMetadata = {
  id: 'math-identities-linear-func',
  title: 'Hằng đẳng thức diện tích & Hàm số bậc nhất y = ax + b',
  titleEn: 'Visual Algebraic Identities & Linear Function Graphing',
  subject: 'toan',
  grade: 8,
  level: 'THCS',
  topic: 'Đại số & Hàm số (GDPT 2018)',
  description: 'Chứng minh (a+b)², (a-b)², a² - b² bằng ghép các mảnh diện tích hình vuông/chữ nhật; tương tác hệ số góc a và tung độ gốc b để thấy hướng đường thẳng và quan hệ 2 đường thẳng.',
  curriculumCode: 'GDPT2018-TOAN8-A3',
  difficulty: 'Cơ bản',
  estimatedMinutes: 25,
  tags: ['Hằng đẳng thức', 'Diện tích', 'Đồ thị bậc nhất', 'Hệ số góc', 'Song song', 'Vuông góc'],
  technology: 'graph',
  isImplemented: true,
};

const DEFAULT_STATE: IdentitiesState = {
  activeTab: 'identities',
  identityType: 'square-sum',
  paramA: 4,
  paramB: 3,
  showLabels: true,
  unfoldProgress: 0,
  slope1: 1,
  intercept1: 0,
  showSlopeTriangle: true,
  showInterceptPoints: true,
  slope2: -1,
  intercept2: 2,
};

interface IdentitiesSimulationProps {
  initialPreset?: any;
}

export default function IdentitiesLinearFuncSimulation({
  initialPreset,
}: IdentitiesSimulationProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const resolvedInitialState = useMemo<IdentitiesState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<IdentitiesState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<IdentitiesState>(resolvedInitialState);

  const handleStateChange = (patch: Partial<IdentitiesState>) => {
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
      presets={IDENTITIES_PRESETS}
      quests={IDENTITIES_QUESTS}
      currentState={state}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      controlPanel={
        <ControlPanel
          state={state}
          onChange={handleStateChange}
          isDark={isDark}
        />
      }
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        {state.activeTab === 'identities' ? (
          <IdentitiesCanvas
            state={state}
            onUpdateState={handleStateChange}
            isDark={isDark}
          />
        ) : (
          <LinearFuncCanvas
            state={state}
            isDark={isDark}
          />
        )}
      </div>
    </SandboxLayout>
  );
}
