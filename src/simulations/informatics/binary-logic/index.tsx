import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { LogicCanvas } from './LogicCanvas';
import { ControlPanel } from './ControlPanel';
import { BinaryLogicState } from './types';
import { INFORMATICS_QUESTS } from './quests';
import { INFORMATICS_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';

const METADATA: SimulationMetadata = {
  id: 'cs-binary-logic-gates',
  title: 'Hệ nhị phân 8-Bit & Mạch cổng Logic (AND, OR, NOT, XOR)',
  titleEn: '8-Bit Binary System & Digital Logic Gates (AND, OR, NOT, XOR)',
  subject: 'tin-hoc',
  grade: 8,
  level: 'THCS',
  topic: 'Biểu diễn dữ liệu & Mạch điện tử số (GDPT 2018)',
  description: 'Mô phỏng chuyển đổi qua lại giữa hệ Nhị phân (Binary 8-bit), Thập phân (Decimal), Thập lục phân (Hexadecimal) và mã chuẩn ASCII; thực hành đấu nối mạch logic số với bảng chân lý thời gian thực.',
  curriculumCode: 'GDPT2018-TIN8-C1',
  difficulty: 'Cơ bản',
  estimatedMinutes: 20,
  tags: ['Hệ nhị phân', 'Byte', 'Bit', 'ASCII', 'Cổng Logic', 'Bảng chân lý', 'AND', 'OR', 'XOR', 'NOT'],
  technology: 'canvas2d',
  isImplemented: true,
};

const DEFAULT_STATE: BinaryLogicState = {
  mode: 'binary-converter',
  bits: [false, true, false, false, false, false, false, true], // 65 = 'A'
  gateType: 'AND',
  inputA: true,
  inputB: true,
  showTruthTable: true,
};

interface InformaticsSimulationProps {
  initialPreset?: any;
}

export default function BinaryLogicSimulation({ initialPreset }: InformaticsSimulationProps) {
  const resolvedInitialState = useMemo<BinaryLogicState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<BinaryLogicState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<BinaryLogicState>(resolvedInitialState);

  const handleChange = (patch: Partial<BinaryLogicState>) => {
    setState(prev => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setState(DEFAULT_STATE);
  };

  const handleApplyPreset = (preset: PresetState) => {
    if (preset?.state) {
      setState(prev => ({ ...prev, ...(preset.state as Partial<BinaryLogicState>) }));
    }
  };

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={INFORMATICS_QUESTS}
      presets={INFORMATICS_PRESETS}
      currentState={state}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      controlPanel={
        <ControlPanel
          state={state}
          onChange={handleChange}
          quests={INFORMATICS_QUESTS}
        />
      }
    >
      <LogicCanvas
        state={state}
        onChange={handleChange}
      />
    </SandboxLayout>
  );
}
