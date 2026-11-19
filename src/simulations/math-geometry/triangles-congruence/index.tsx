import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { TriangleCanvas } from './TriangleCanvas';
import { ControlPanel } from './ControlPanel';
import { TriangleState, Point2D } from './types';
import { TRIANGLE_QUESTS } from './quests';
import { TRIANGLE_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { useTheme } from '../../../core/theme/themeContext';

const METADATA: SimulationMetadata = {
  id: 'geom-triangles-special-lines',
  title: 'Tam giác bằng nhau & 4 đường đồng quy (Trọng tâm, Trực tâm...)',
  titleEn: 'Triangle Congruence & Concurrent Lines (Centroid, Orthocenter)',
  subject: 'hinh-hoc',
  grade: 7,
  level: 'THCS',
  topic: 'Tam giác & Đường đồng quy (GDPT 2018)',
  description: 'Kéo thả các đỉnh tam giác kiểm chứng c-c-c, c-g-c, g-c-g; quan sát giao điểm 3 đường trung tuyến (trọng tâm G), 3 đường phân giác (tâm nội tiếp I), tâm ngoại tiếp O, trực tâm H và Định lý Pythagore.',
  curriculumCode: 'GDPT2018-TOAN7-G2',
  difficulty: 'Khá',
  estimatedMinutes: 30,
  tags: ['Tam giác', 'Trọng tâm', 'Trực tâm', 'Tâm nội tiếp', 'Tâm ngoại tiếp', 'Tam giác bằng nhau', 'Pythagore'],
  technology: 'canvas2d',
  isImplemented: true,
};

const DEFAULT_STATE: TriangleState = {
  activeTab: 'concurrence',
  A: { x: 380, y: 100 },
  B: { x: 180, y: 380 },
  C: { x: 580, y: 380 },
  showMedians: true,
  showAngleBisectors: false,
  showPerpendicularBisectors: false,
  showAltitudes: false,
  showIncircle: false,
  showCircumcircle: false,
  showEulerLine: false,
  A2: { x: 580, y: 100 },
  B2: { x: 380, y: 380 },
  C2: { x: 780, y: 380 },
  isSuperimposed: false,
  congruenceCase: 'sss',
  showPythagorasSquares: false,
};

interface TrianglesSimulationProps {
  initialPreset?: any;
}

export default function TrianglesCongruenceSimulation({
  initialPreset,
}: TrianglesSimulationProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const resolvedInitialState = useMemo<TriangleState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<TriangleState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<TriangleState>(resolvedInitialState);

  const handleStateChange = (patch: Partial<TriangleState>) => {
    setState(prev => ({ ...prev, ...patch }));
  };

  const handleVertexDrag = (vertex: 'A' | 'B' | 'C' | 'A2' | 'B2' | 'C2', point: Point2D) => {
    setState(prev => ({
      ...prev,
      [vertex]: point,
    }));
  };

  const handleSetRightTriangle = () => {
    setState(prev => ({
      ...prev,
      activeTab: 'pythagoras',
      A: { x: 260, y: 340 },
      B: { x: 260, y: 180 }, // Cạnh b đứng
      C: { x: 480, y: 340 }, // Cạnh c ngang
      showPythagorasSquares: true,
    }));
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
      quests={TRIANGLE_QUESTS}
      presets={TRIANGLE_PRESETS}
      currentState={state}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      controlPanel={
        <ControlPanel
          state={state}
          onChange={handleStateChange}
          onSetRightTriangle={handleSetRightTriangle}
        />
      }
    >
      <div className="w-full h-full flex flex-col justify-center items-center">
        <TriangleCanvas
          state={state}
          onVertexDrag={handleVertexDrag}
          isDark={isDark}
        />
      </div>
    </SandboxLayout>
  );
}
