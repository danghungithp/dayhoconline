import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { DissociationPhCanvas } from './DissociationPhCanvas';
import { ControlPanel } from './ControlPanel';
import { DissociationPhState } from './types';
import { PH_QUESTS } from './quests';
import { PH_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';

const METADATA: SimulationMetadata = {
  id: 'chem-dissociation-organic-3d',
  title: 'Sự điện li, Thang đo pH & Chuẩn độ Axit - Bazơ',
  titleEn: 'Electrolytic Dissociation, pH Scale & Acid-Base Titration',
  subject: 'hoa-hoc',
  grade: 11,
  level: 'THPT',
  topic: 'Cân bằng hóa học & Dung dịch (GDPT 2018)',
  description: 'Thí nghiệm ảo đo pH các dung dịch quen thuộc với bút đo điện tử và giấy quỳ tím; khảo sát sự pha loãng axit - bazơ và thực hành chuẩn độ thể tích HCl bằng NaOH với chỉ thị Phenolphthalein.',
  curriculumCode: 'GDPT2018-HOA11-C2',
  difficulty: 'Khá',
  estimatedMinutes: 30,
  tags: ['pH', 'Điện li', 'Axit', 'Bazơ', 'Chuẩn độ', 'Phenolphthalein', 'Quỳ tím', 'Buret'],
  technology: 'canvas2d',
  isImplemented: true,
};

const DEFAULT_STATE: DissociationPhState = {
  mode: 'ph-scale',
  selectedSolutionId: 'sol-hcl',
  solutionVolumeMl: 200,
  waterAddedMl: 0,
  dippedIndicator: 'ph-probe',
  showIonParticles: true,
  acidConcentration: 0.1,
  acidVolumeMl: 25,
  baseConcentration: 0.1,
  buretBaseVolumeMl: 0,
  isDripping: false,
  indicatorType: 'phenolphthalein',
};

interface SimulationProps {
  initialPreset?: any;
}

export default function DissociationPhSimulation({ initialPreset }: SimulationProps) {
  const resolvedInitialState = useMemo<DissociationPhState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<DissociationPhState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<DissociationPhState>(resolvedInitialState);

  const handleChange = (patch: Partial<DissociationPhState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setState(DEFAULT_STATE);
  };

  const handleApplyPreset = (preset: PresetState) => {
    if (preset?.state) {
      setState((prev) => ({ ...prev, ...(preset.state as Partial<DissociationPhState>) }));
    }
  };

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={PH_QUESTS}
      presets={PH_PRESETS}
      currentState={state}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      controlPanel={
        <ControlPanel
          state={state}
          onChange={handleChange}
          quests={PH_QUESTS}
        />
      }
    >
      <DissociationPhCanvas
        state={state}
        onChange={handleChange}
      />
    </SandboxLayout>
  );
}
