import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { CircuitCanvas } from './CircuitCanvas';
import { ControlPanel } from './ControlPanel';
import { DcCircuitState } from './types';
import { CIRCUIT_QUESTS } from './quests';
import { CIRCUIT_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';

const METADATA: SimulationMetadata = {
  id: 'phys-dc-circuits-induction',
  title: 'Mạch điện một chiều (Định luật Ôm) & Cảm ứng điện từ',
  titleEn: 'DC Circuits (Ohm Law, Series/Parallel) & Electromagnetic Induction',
  subject: 'khtn',
  grade: 9,
  level: 'THCS',
  topic: 'Điện từ học (GDPT 2018)',
  description: 'Thí nghiệm ảo lắp ráp mạch điện với pin, điện trở, bóng đèn, ampe kế, vôn kế; kiểm nghiệm định luật Ôm mạch nối tiếp và song song; khảo sát hiện tượng cảm ứng điện từ Faraday và định luật Lenz.',
  curriculumCode: 'GDPT2018-KHTN9-P4',
  difficulty: 'Khá',
  estimatedMinutes: 30,
  tags: ['Mạch điện', 'Định luật Ôm', 'Công suất', 'Cảm ứng điện từ', 'Faraday', 'Lenz', 'Ampe kế', 'Vôn kế'],
  technology: 'canvas2d',
  isImplemented: true,
};

const DEFAULT_STATE: DcCircuitState = {
  mode: 'ohm-dc',
  switchClosed: true,
  voltage: 12,
  resistance1: 10,
  resistance2: 20,
  connection: 'series',
  bulbRatedVoltage: 6,
  showElectrons: true,
  showMeters: true,
  magnetPositionX: -100,
  magnetVelocity: 0,
  coilTurns: 500,
  magnetStrength: 3,
  isDraggingMagnet: false,
};

interface SimulationProps {
  initialPreset?: any;
}

export default function DcCircuitsInductionSimulation({ initialPreset }: SimulationProps) {
  const resolvedInitialState = useMemo<DcCircuitState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<DcCircuitState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<DcCircuitState>(resolvedInitialState);

  const handleChange = (patch: Partial<DcCircuitState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setState(DEFAULT_STATE);
  };

  const handleApplyPreset = (preset: PresetState) => {
    if (preset?.state) {
      setState((prev) => ({ ...prev, ...(preset.state as Partial<DcCircuitState>) }));
    }
  };

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={CIRCUIT_QUESTS}
      presets={CIRCUIT_PRESETS}
      currentState={state}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      controlPanel={
        <ControlPanel
          state={state}
          onChange={handleChange}
          quests={CIRCUIT_QUESTS}
        />
      }
    >
      <CircuitCanvas
        state={state}
        onChange={handleChange}
      />
    </SandboxLayout>
  );
}
