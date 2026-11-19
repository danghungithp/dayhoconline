import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { BuoyancyOpticsCanvas } from './BuoyancyOpticsCanvas';
import { ControlPanel } from './ControlPanel';
import { BuoyancyOpticsState } from './types';
import { BUOYANCY_QUESTS } from './quests';
import { BUOYANCY_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { useTheme } from '../../../core/theme/themeContext';

const METADATA: SimulationMetadata = {
  id: 'phys-buoyancy-refraction',
  title: 'Áp suất chất lỏng, Lực đẩy Ác-si-mét & Thấu kính hội tụ',
  titleEn: 'Fluid Pressure, Archimedes Principle & Converging Lens Optics',
  subject: 'khtn',
  grade: 8,
  level: 'THCS',
  topic: 'Vật lí thực nghiệm (GDPT 2018)',
  description: 'Thí nghiệm thả chìm/nổi các khối vật thể trong nước để kiểm chứng lực đẩy Ác-si-mét FA; vẽ đường truyền tia sáng tạo ảnh thật và ảnh ảo qua thấu kính hội tụ.',
  curriculumCode: 'GDPT2018-KHTN8-P1',
  difficulty: 'Cơ bản',
  estimatedMinutes: 25,
  tags: ['Ác-si-mét', 'Lực đẩy', 'Sự nổi', 'Thấu kính hội tụ', 'Tiêu cự', 'Ảnh thật', 'Ảnh ảo'],
  technology: 'canvas2d',
  isImplemented: true,
};

const DEFAULT_STATE: BuoyancyOpticsState = {
  activeTab: 'buoyancy',
  liquidType: 'water',
  material: 'wood',
  blockVolumeLiters: 2.0,
  focalLengthCm: 15,
  objectDistanceCm: 30,
  objectHeightCm: 4,
  showSpecialRays: true,
};

interface BuoyancySimulationProps {
  initialPreset?: any;
}

export default function BuoyancyOpticsSimulation({
  initialPreset,
}: BuoyancySimulationProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const resolvedInitialState = useMemo<BuoyancyOpticsState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<BuoyancyOpticsState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<BuoyancyOpticsState>(resolvedInitialState);

  const handleStateChange = (patch: Partial<BuoyancyOpticsState>) => {
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
      quests={BUOYANCY_QUESTS}
      presets={BUOYANCY_PRESETS}
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
        <BuoyancyOpticsCanvas state={state} isDark={isDark} />
      </div>
    </SandboxLayout>
  );
}
