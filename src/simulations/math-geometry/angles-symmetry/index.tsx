import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { AnglesSymmetryCanvas } from './AnglesSymmetryCanvas';
import { ControlPanel } from './ControlPanel';
import { AnglesSymmetryState } from './types';
import { ANGLES_QUESTS } from './quests';
import { ANGLES_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { useTheme } from '../../../core/theme/themeContext';

const METADATA: SimulationMetadata = {
  id: 'geom-angles-symmetry',
  title: 'Đoạn thẳng, Góc, Số đo góc & Tính đối xứng phẳng',
  titleEn: 'Segments, Angles & Plane Symmetry Explorer',
  subject: 'hinh-hoc',
  grade: 6,
  level: 'THCS',
  topic: 'Hình học trực quan & Đối xứng (GDPT 2018)',
  description: 'Thước đo độ 360° phân loại góc nhọn, vuông, tù, bẹt; mô phỏng gấp hình theo trục đối xứng và xoay 180° quanh tâm đối xứng.',
  curriculumCode: 'GDPT2018-TOAN6-G1',
  difficulty: 'Cơ bản',
  estimatedMinutes: 25,
  tags: ['Góc', 'Thước đo góc', 'Góc nhọn', 'Góc vuông', 'Góc tù', 'Trục đối xứng', 'Tâm đối xứng'],
  technology: 'canvas2d',
  isImplemented: true,
};

const DEFAULT_STATE: AnglesSymmetryState = {
  mode: 'angles',
  angleDeg: 45,
  showProtractor: true,
  showAngleArc: true,
  symmetryShape: 'heart',
  foldProgress: 0,
  rotationAngleDeg: 0,
};

interface AnglesSimulationProps {
  initialPreset?: any;
}

export default function AnglesSymmetrySimulation({
  initialPreset,
}: AnglesSimulationProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const resolvedInitialState = useMemo<AnglesSymmetryState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<AnglesSymmetryState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<AnglesSymmetryState>(resolvedInitialState);

  const handleStateChange = (patch: Partial<AnglesSymmetryState>) => {
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
      quests={ANGLES_QUESTS}
      presets={ANGLES_PRESETS}
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
        <AnglesSymmetryCanvas
          state={state}
          onAngleChange={deg => handleStateChange({ angleDeg: deg })}
          isDark={isDark}
        />
      </div>
    </SandboxLayout>
  );
}
