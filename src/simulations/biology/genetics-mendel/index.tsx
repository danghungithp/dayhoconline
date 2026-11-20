import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { GeneticsCanvas } from './GeneticsCanvas';
import { ControlPanel } from './ControlPanel';
import { GeneticsState } from './types';
import { computeMonohybridCross } from './geneticsEngine';
import { BIOLOGY_QUESTS } from './quests';
import { BIOLOGY_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';

const METADATA: SimulationMetadata = {
  id: 'bio-genetics-mendel',
  title: 'Di truyền Men-đen, Phép lai Punnett & Cấu tạo Tế bào',
  titleEn: "Mendel's Laws of Inheritance, Punnett Square & Cell Anatomy",
  subject: 'sinh-hoc',
  grade: 9,
  level: 'THCS',
  topic: 'Di truyền & Tế bào học (GDPT 2018)',
  description: 'Mô phỏng phép lai phân li độc lập của Men-đen qua bảng Punnett, tính tỉ lệ kiểu gen và kiểu hình hoa tím/trắng, hạt vàng/xanh; khám phá cấu tạo vi thể của tế bào thực vật (Nhân ADN, Ty thể, Lục lạp).',
  curriculumCode: 'GDPT2018-SINH9-C1',
  difficulty: 'Khá',
  estimatedMinutes: 25,
  tags: ['Di truyền học', 'Men-đen', 'Punnett', 'Kiểu gen', 'Kiểu hình', 'Tế bào', 'Nhân ADN', 'Ty thể', 'Lục lạp'],
  technology: 'canvas2d',
  isImplemented: true,
};

const DEFAULT_STATE: GeneticsState = {
  mode: 'mendel',
  trait: 'flower-color',
  p1Alleles: ['A', 'a'],
  p2Alleles: ['A', 'a'],
  showGenotypes: true,
  showPhenotypes: true,
  cellZoom: 1,
  selectedOrganelle: 'nucleus',
};

interface BiologySimulationProps {
  initialPreset?: any;
}

export default function GeneticsMendelSimulation({ initialPreset }: BiologySimulationProps) {
  const resolvedInitialState = useMemo<GeneticsState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<GeneticsState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<GeneticsState>(resolvedInitialState);

  const handleChange = (patch: Partial<GeneticsState>) => {
    setState(prev => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setState(DEFAULT_STATE);
  };

  const handleApplyPreset = (preset: PresetState) => {
    if (preset?.state) {
      setState(prev => ({ ...prev, ...(preset.state as Partial<GeneticsState>) }));
    }
  };

  const crossResult = useMemo(() => {
    return computeMonohybridCross(state.p1Alleles, state.p2Alleles, state.trait);
  }, [state.p1Alleles, state.p2Alleles, state.trait]);

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={BIOLOGY_QUESTS}
      presets={BIOLOGY_PRESETS}
      currentState={state}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      controlPanel={
        <ControlPanel
          state={state}
          onChange={handleChange}
          crossResult={crossResult}
          quests={BIOLOGY_QUESTS}
        />
      }
    >
      <GeneticsCanvas
        state={state}
        onChange={handleChange}
        crossResult={crossResult}
      />
    </SandboxLayout>
  );
}
