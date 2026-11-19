import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { MatterCanvas } from './MatterCanvas';
import { ControlPanel } from './ControlPanel';
import { StatesOfMatterState } from './types';
import { STATES_QUESTS } from './quests';
import { STATES_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { useTheme } from '../../../core/theme/themeContext';

const METADATA: SimulationMetadata = {
  id: 'chem-states-of-matter',
  title: 'Các thể của chất & Sự chuyển thể',
  titleEn: 'States of Matter & Phase Transitions',
  subject: 'khtn',
  grade: 6,
  level: 'THCS',
  topic: 'Chất và sự biến đổi của chất (GDPT 2018)',
  description: 'Mô phỏng động học phân tử 3 thể rắn, lỏng, khí; đun nóng và làm lạnh quan sát sự nóng chảy, sôi, ngưng tụ và đo áp suất chất khí khi nén piston.',
  curriculumCode: 'GDPT2018-KHTN6-C1',
  difficulty: 'Cơ bản',
  estimatedMinutes: 25,
  tags: ['Thể rắn', 'Thể lỏng', 'Thể khí', 'Chuyển thể', 'Nhiệt độ sôi', 'Nóng chảy', 'Áp suất'],
  technology: 'canvas2d',
  isImplemented: true,
};

const DEFAULT_STATE: StatesOfMatterState = {
  substance: 'water',
  temperatureC: 25,
  pistonHeight: 0.8,
  isHeating: false,
  isCooling: false,
  showThermometer: true,
  showPressureGauge: true,
};

interface StatesOfMatterSimulationProps {
  initialPreset?: any;
}

export default function StatesOfMatterSimulation({
  initialPreset,
}: StatesOfMatterSimulationProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const resolvedInitialState = useMemo<StatesOfMatterState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<StatesOfMatterState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<StatesOfMatterState>(resolvedInitialState);
  const heatTimerRef = useRef<any>(null);

  // Hiệu ứng nhiệt độ tăng/giảm liên tục khi bật đèn đốt hoặc làm lạnh
  useEffect(() => {
    if (state.isHeating) {
      heatTimerRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          temperatureC: Math.min(250, prev.temperatureC + 5),
        }));
      }, 400);
    } else if (state.isCooling) {
      heatTimerRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          temperatureC: Math.max(-100, prev.temperatureC - 5),
        }));
      }, 400);
    } else {
      if (heatTimerRef.current) clearInterval(heatTimerRef.current);
    }

    return () => {
      if (heatTimerRef.current) clearInterval(heatTimerRef.current);
    };
  }, [state.isHeating, state.isCooling]);

  const handleStateChange = (patch: Partial<StatesOfMatterState>) => {
    setState(prev => ({ ...prev, ...patch }));
  };

  const handleHeatStep = () => {
    setState(prev => ({ ...prev, isHeating: true, isCooling: false }));
  };

  const handleCoolStep = () => {
    setState(prev => ({ ...prev, isHeating: false, isCooling: true }));
  };

  const handleStopHeat = () => {
    setState(prev => ({ ...prev, isHeating: false, isCooling: false }));
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
      quests={STATES_QUESTS}
      presets={STATES_PRESETS}
      currentState={state}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      controlPanel={
        <ControlPanel
          state={state}
          onChange={handleStateChange}
          onHeatStep={handleHeatStep}
          onCoolStep={handleCoolStep}
          onStopHeat={handleStopHeat}
        />
      }
    >
      <div className="w-full h-full flex flex-col justify-center items-center">
        <MatterCanvas
          substance={state.substance}
          temperatureC={state.temperatureC}
          pistonHeight={state.pistonHeight}
          isHeating={state.isHeating}
          isCooling={state.isCooling}
          showThermometer={state.showThermometer}
          showPressureGauge={state.showPressureGauge}
          isDark={isDark}
        />
      </div>
    </SandboxLayout>
  );
}
