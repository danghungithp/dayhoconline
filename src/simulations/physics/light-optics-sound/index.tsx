import React, { useState, useEffect, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { LightOpticsCanvas } from './LightOpticsCanvas';
import { SoundWaveCanvas } from './SoundWaveCanvas';
import { ControlPanel } from './ControlPanel';
import { OpticsAudioState } from './types';
import { OPTICS_SOUND_QUESTS } from './quests';
import { OPTICS_SOUND_PRESETS } from './presets';
import { soundEngine } from './opticsAudioEngine';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { useTheme } from '../../../core/theme/themeContext';

const METADATA: SimulationMetadata = {
  id: 'phys-light-optics-sound',
  title: 'Quang học phản xạ, Gương phẳng & Dao động âm thanh',
  titleEn: 'Law of Reflection, Mirrors & Acoustic Sound Waves',
  subject: 'khtn',
  grade: 7,
  level: 'THCS',
  topic: 'Ánh sáng và Âm thanh (GDPT 2018)',
  description: 'Chiếu tia sáng laser đến gương phẳng, gương cầu lồi, gương cầu lõm đo góc tới i = góc phản xạ i\'; tạo sóng âm quan sát biên độ (độ to) và tần số (độ cao) với Web Audio API.',
  curriculumCode: 'GDPT2018-KHTN7-P2',
  difficulty: 'Cơ bản',
  estimatedMinutes: 25,
  tags: ['Tia sáng', 'Gương phẳng', 'Phản xạ ánh sáng', 'Sóng âm', 'Tần số', 'Biên độ', 'Web Audio API'],
  technology: 'canvas2d',
  isImplemented: true,
};

const DEFAULT_STATE: OpticsAudioState = {
  activeTab: 'optics',
  mirrorType: 'plane',
  incidentAngleDeg: 45,
  lightColor: '#ef4444',
  laserPower: 80,
  showNormal: true,
  showProtractor: true,
  showAngles: true,
  n1: 1.0,
  n2: 1.33,
  frequency: 440,
  amplitude: 60,
  waveform: 'sine',
  isPlaying: false,
  showParticles: true,
};

interface LightOpticsSoundSimulationProps {
  initialPreset?: any;
}

export default function LightOpticsSoundSimulation({
  initialPreset,
}: LightOpticsSoundSimulationProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const resolvedInitialState = useMemo<OpticsAudioState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<OpticsAudioState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<OpticsAudioState>(resolvedInitialState);

  // Cập nhật audio engine theo state
  useEffect(() => {
    if (state.activeTab === 'sound' && state.isPlaying) {
      soundEngine.update(state.frequency, state.amplitude, state.waveform);
    } else {
      soundEngine.stop();
    }
  }, [state.activeTab, state.isPlaying, state.frequency, state.amplitude, state.waveform]);

  // Dọn dẹp audio khi component unmount
  useEffect(() => {
    return () => {
      soundEngine.stop();
    };
  }, []);

  const handleStateChange = (patch: Partial<OpticsAudioState>) => {
    setState(prev => ({ ...prev, ...patch }));
  };

  const handleTogglePlaySound = () => {
    if (!state.isPlaying) {
      soundEngine.start(state.frequency, state.amplitude, state.waveform);
      setState(prev => ({ ...prev, isPlaying: true }));
    } else {
      soundEngine.stop();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const handleReset = () => {
    soundEngine.stop();
    setState(DEFAULT_STATE);
  };

  const handleApplyPreset = (preset: PresetState) => {
    soundEngine.stop();
    if (preset.state) {
      setState(prev => ({ ...prev, ...preset.state }));
      if (preset.state.activeTab === 'sound' && preset.state.isPlaying) {
        setTimeout(() => {
          soundEngine.start(preset.state.frequency, preset.state.amplitude, preset.state.waveform);
        }, 100);
      }
    }
  };

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={OPTICS_SOUND_QUESTS}
      presets={OPTICS_SOUND_PRESETS}
      currentState={state}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      controlPanel={
        <ControlPanel
          state={state}
          onChange={handleStateChange}
          onTogglePlaySound={handleTogglePlaySound}
        />
      }
    >
      <div className="w-full h-full flex flex-col justify-center items-center">
        {state.activeTab === 'optics' ? (
          <LightOpticsCanvas
            mirrorType={state.mirrorType}
            incidentAngleDeg={state.incidentAngleDeg}
            onAngleChange={angle => handleStateChange({ incidentAngleDeg: angle })}
            lightColor={state.lightColor}
            laserPower={state.laserPower}
            showNormal={state.showNormal}
            showProtractor={state.showProtractor}
            showAngles={state.showAngles}
            n1={state.n1}
            n2={state.n2}
            isDark={isDark}
          />
        ) : (
          <SoundWaveCanvas
            frequency={state.frequency}
            amplitude={state.amplitude}
            waveform={state.waveform}
            isPlaying={state.isPlaying}
            showParticles={state.showParticles}
            isDark={isDark}
          />
        )}
      </div>
    </SandboxLayout>
  );
}
