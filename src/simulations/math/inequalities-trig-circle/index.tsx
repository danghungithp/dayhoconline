import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { UnitCircleCanvas } from './UnitCircleCanvas';
import { InequalitiesCanvas } from './InequalitiesCanvas';
import { ControlPanel } from './ControlPanel';
import { UnitCircleState } from './types';
import { TRIG_INEQUALITIES_QUESTS } from './quests';
import { TRIG_INEQUALITIES_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { useTheme } from '../../../core/theme/themeContext';

const METADATA: SimulationMetadata = {
  id: 'math-inequalities-trig-circle',
  title: 'Miền nghiệm BPT bậc nhất 2 ẩn & Vòng tròn lượng giác',
  titleEn: '2D Linear Inequalities Feasible Region & Unit Circle Trigonometry',
  subject: 'toan',
  grade: 10,
  level: 'THPT',
  topic: 'Toán học 10 (GDPT 2018)',
  description: 'Tô màu miền nghiệm của hệ bất phương trình bậc nhất hai ẩn tìm giá trị lớn nhất/nhỏ nhất; xoay góc alpha trên vòng tròn đơn vị theo dõi giá trị sin, cos, tan, cot.',
  curriculumCode: 'GDPT2018-TOAN10-A1',
  difficulty: 'Khá',
  estimatedMinutes: 35,
  tags: ['Miền nghiệm', 'Quy hoạch tuyến tính', 'Vòng tròn lượng giác', 'Sin-Cos', 'Tan', 'Hàm mục tiêu'],
  technology: 'graph',
  isImplemented: true,
};

const DEFAULT_STATE: UnitCircleState = {
  activeTab: 'unit-circle',
  angleDeg: 45,
  angleMode: 'degrees',
  snapToSpecial: true,
  showSine: true,
  showCosine: true,
  showTangent: true,
  showCotangent: false,
  inequalities: [
    { id: 'l1', a: 1, b: 2, c: 8, label: 'x + 2y ≤ 8', color: '#38bdf8' },
    { id: 'l2', a: 3, b: 1, c: 9, label: '3x + y ≤ 9', color: '#f43f5e' },
  ],
  testPoint: { x: 2, y: 2 },
  objectiveA: 4,
  objectiveB: 3,
  showLevelLines: true,
};

interface TrigCircleSimulationProps {
  initialPreset?: any;
}

export default function InequalitiesTrigCircleSimulation({
  initialPreset,
}: TrigCircleSimulationProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const resolvedInitialState = useMemo<UnitCircleState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<UnitCircleState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<UnitCircleState>(resolvedInitialState);

  const handleStateChange = (patch: Partial<UnitCircleState>) => {
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
      presets={TRIG_INEQUALITIES_PRESETS}
      quests={TRIG_INEQUALITIES_QUESTS}
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
        {state.activeTab === 'unit-circle' ? (
          <UnitCircleCanvas
            state={state}
            onChangeAngle={angleDeg => handleStateChange({ angleDeg })}
            isDark={isDark}
          />
        ) : (
          <InequalitiesCanvas
            state={state}
            onUpdateTestPoint={testPoint => handleStateChange({ testPoint })}
            isDark={isDark}
          />
        )}
      </div>
    </SandboxLayout>
  );
}
