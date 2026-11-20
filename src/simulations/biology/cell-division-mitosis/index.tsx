import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { CellDivisionCanvas } from './CellDivisionCanvas';
import { ControlPanel } from './ControlPanel';
import { CellDivisionState } from './types';
import { CELL_QUESTS } from './quests';
import { CELL_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';

const METADATA: SimulationMetadata = {
  id: 'bio-cell-division-mitosis',
  title: 'Chu kỳ tế bào & Nguyên phân (Mitosis)',
  titleEn: 'Cell Cycle & Mitosis Chromosome Separation',
  subject: 'sinh-hoc',
  grade: 10,
  level: 'THPT',
  topic: 'Sinh học tế bào & Di truyền học (GDPT 2018)',
  description: 'Mô phỏng động học chu kỳ tế bào: Kỳ trung gian nhân đôi ADN, Kỳ đầu co xoắn NST, Kỳ giữa xếp 1 hàng xích đạo, Kỳ sau phân ly chromatid về 2 cực và Kỳ cuối phân chia tế bào chất.',
  curriculumCode: 'GDPT2018-SINH10-C3',
  difficulty: 'Khá',
  estimatedMinutes: 25,
  tags: ['Tế bào', 'Nguyên phân', 'Nhiễm sắc thể', 'Chromatid', 'Thoi phân bào', 'Kỳ giữa', 'Kỳ sau', '2n'],
  technology: 'canvas2d',
  isImplemented: true,
};

const DEFAULT_STATE: CellDivisionState = {
  phase: 'metaphase',
  phaseProgress: 0.5,
  chromosomeCount: 4,
  isPlaying: false,
  speed: 1,
  showSpindleFibers: true,
  showLabels: true,
};

interface SimulationProps {
  initialPreset?: any;
}

export default function CellDivisionMitosisSimulation({ initialPreset }: SimulationProps) {
  const resolvedInitialState = useMemo<CellDivisionState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<CellDivisionState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<CellDivisionState>(resolvedInitialState);

  const handleChange = (patch: Partial<CellDivisionState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setState(DEFAULT_STATE);
  };

  const handleApplyPreset = (preset: PresetState) => {
    if (preset?.state) {
      setState((prev) => ({ ...prev, ...(preset.state as Partial<CellDivisionState>) }));
    }
  };

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={CELL_QUESTS}
      presets={CELL_PRESETS}
      currentState={state}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      controlPanel={
        <ControlPanel
          state={state}
          onChange={handleChange}
          quests={CELL_QUESTS}
        />
      }
    >
      <CellDivisionCanvas
        state={state}
        onChange={handleChange}
      />
    </SandboxLayout>
  );
}
