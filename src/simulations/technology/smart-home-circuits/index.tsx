import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { SmartHomeCanvas } from './SmartHomeCanvas';
import { ControlPanel } from './ControlPanel';
import { SmartHomeState } from './types';
import { SMART_HOME_QUESTS } from './quests';
import { SMART_HOME_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';

const METADATA: SimulationMetadata = {
  id: 'tech-circuits-smart-home',
  title: 'Mạch điện điều khiển, Cảm biến ánh sáng & Nhà thông minh',
  titleEn: 'Control Circuits, Light Sensors (LDR) & Smart Home IoT',
  subject: 'cong-nghe',
  grade: 8,
  level: 'THCS',
  topic: 'Kỹ thuật điện & Nhà thông minh (GDPT 2018)',
  description: 'Mô phỏng ngôi nhà thông minh ứng dụng công nghệ cảm biến: Quang trở LDR tự động bật đèn khi trời tối, cảm biến chuyển động PIR chống trộm và cảm biến nhiệt độ tự động bật quạt làm mát.',
  curriculumCode: 'GDPT2018-CN8-E1',
  difficulty: 'Khá',
  estimatedMinutes: 25,
  tags: ['Smart Home', 'Cảm biến LDR', 'Cảm biến PIR', 'Rơ-le', 'Cầu phân áp', 'Transistor', 'Tự động hóa'],
  technology: 'canvas2d',
  isImplemented: true,
};

const DEFAULT_STATE: SmartHomeState = {
  viewMode: 'house-view',
  ambientLightLux: 600,
  temperatureC: 28,
  motionDetected: false,
  lightThresholdLux: 200,
  tempThresholdC: 32,
  isAutoMode: true,
  isBalconyLightOn: false,
  isLivingRoomLightOn: false,
  isCoolingFanOn: false,
  alarmBuzzerActive: false,
};

interface SimulationProps {
  initialPreset?: any;
}

export default function SmartHomeCircuitsSimulation({ initialPreset }: SimulationProps) {
  const resolvedInitialState = useMemo<SmartHomeState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<SmartHomeState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<SmartHomeState>(resolvedInitialState);

  const handleChange = (patch: Partial<SmartHomeState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setState(DEFAULT_STATE);
  };

  const handleApplyPreset = (preset: PresetState) => {
    if (preset?.state) {
      setState((prev) => ({ ...prev, ...(preset.state as Partial<SmartHomeState>) }));
    }
  };

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={SMART_HOME_QUESTS}
      presets={SMART_HOME_PRESETS}
      currentState={state}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      controlPanel={
        <ControlPanel
          state={state}
          onChange={handleChange}
          quests={SMART_HOME_QUESTS}
        />
      }
    >
      <SmartHomeCanvas
        state={state}
        onChange={handleChange}
      />
    </SandboxLayout>
  );
}
