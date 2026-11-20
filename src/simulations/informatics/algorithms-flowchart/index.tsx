import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { AlgorithmCanvas } from './AlgorithmCanvas';
import { ControlPanel } from './ControlPanel';
import { AlgorithmsState } from './types';
import { ALGORITHM_QUESTS } from './quests';
import { ALGORITHM_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { generateRandomArray, generateSortedArray } from './algorithmEngine';

const METADATA: SimulationMetadata = {
  id: 'cs-algorithms-flowchart',
  title: 'Thuật toán Tìm kiếm, Sắp xếp & Lưu đồ khối (Flowchart)',
  titleEn: 'Searching & Sorting Algorithms & Visual Flowcharts',
  subject: 'tin-hoc',
  grade: 10,
  level: 'THPT',
  topic: 'Thuật toán và Lập trình (GDPT 2018)',
  description: 'Mô phỏng trực quan các thuật toán kinh điển: Sắp xếp nổi bọt (Bubble Sort), Sắp xếp chọn (Selection Sort), Tìm kiếm nhị phân (Binary Search) kèm liên kết phát sáng lưu đồ khối theo thời gian thực.',
  curriculumCode: 'GDPT2018-TIN10-A1',
  difficulty: 'Khá',
  estimatedMinutes: 25,
  tags: ['Thuật toán', 'Bubble Sort', 'Selection Sort', 'Binary Search', 'Lưu đồ khối', 'Độ phức tạp O(n)'],
  technology: 'canvas2d',
  isImplemented: true,
};

const DEFAULT_STATE: AlgorithmsState = {
  mode: 'sorting',
  sortAlgorithm: 'bubble',
  array: generateRandomArray(14),
  isPlaying: false,
  speedMs: 250,
  stepCount: 0,
  comparisonsCount: 0,
  swapsCount: 0,
  isSorted: false,
  searchArray: generateSortedArray(15),
  targetValue: 42,
  leftIndex: 0,
  rightIndex: 14,
  midIndex: 7,
  searchFoundIndex: null,
  flowchartStep: 'calc-mid',
};

interface SimulationProps {
  initialPreset?: any;
}

export default function AlgorithmsFlowchartSimulation({ initialPreset }: SimulationProps) {
  const resolvedInitialState = useMemo<AlgorithmsState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<AlgorithmsState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<AlgorithmsState>(resolvedInitialState);

  const handleChange = (patch: Partial<AlgorithmsState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setState(DEFAULT_STATE);
  };

  const handleApplyPreset = (preset: PresetState) => {
    if (preset?.state) {
      setState((prev) => ({ ...prev, ...(preset.state as Partial<AlgorithmsState>) }));
    }
  };

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={ALGORITHM_QUESTS}
      presets={ALGORITHM_PRESETS}
      currentState={state}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      controlPanel={
        <ControlPanel
          state={state}
          onChange={handleChange}
          quests={ALGORITHM_QUESTS}
        />
      }
    >
      <AlgorithmCanvas
        state={state}
        onChange={handleChange}
      />
    </SandboxLayout>
  );
}
