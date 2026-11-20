import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { GeoEarthCanvas } from './GeoEarthCanvas';
import { ControlPanel } from './ControlPanel';
import { GeoEarthState } from './types';
import { GEOGRAPHY_QUESTS } from './quests';
import { GEOGRAPHY_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';

const METADATA: SimulationMetadata = {
  id: 'geo-earth-rotation-seasons',
  title: 'Chuyển động Trái Đất, 4 Mùa & Ngày Đêm Luân Phiên',
  titleEn: 'Earth Orbit, Axial Tilt, Four Seasons & Day-Night Cycle',
  subject: 'dia-ly',
  grade: 6,
  level: 'THCS',
  topic: 'Trái Đất - Hành tinh của Hệ Mặt Trời (GDPT 2018)',
  description: 'Mô phỏng chuyển động tự quay quanh trục nghiêng 23°27′ sinh ra ngày đêm luân phiên và chênh lệch múi giờ quốc tế; chuyển động tịnh tiến quanh Mặt Trời sinh ra 4 Mùa (Xuân, Hạ, Thu, Đông) và hiện tượng ngày đêm dài ngắn theo mùa.',
  curriculumCode: 'GDPT2018-DIALY6-C1',
  difficulty: 'Cơ bản',
  estimatedMinutes: 20,
  tags: ['Địa lý', 'Hệ Mặt Trời', '4 Mùa', 'Hạ chí', 'Đông chí', 'Xuân phân', 'Thu phân', 'Ngày đêm', 'Múi giờ GMT'],
  technology: 'canvas2d',
  isImplemented: true,
};

const DEFAULT_STATE: GeoEarthState = {
  mode: 'seasons-orbit',
  orbitAngleDeg: 90, // Hạ chí
  isOrbiting: false,
  orbitSpeed: 1,
  rotationHour: 5, // London 05:00 => Hanoi 12:00
  isRotating: false,
  showTropics: true,
  showEquator: true,
  showTerminator: true,
};

interface GeographySimulationProps {
  initialPreset?: any;
}

export default function EarthSeasonsSimulation({ initialPreset }: GeographySimulationProps) {
  const resolvedInitialState = useMemo<GeoEarthState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<GeoEarthState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<GeoEarthState>(resolvedInitialState);

  const handleChange = (patch: Partial<GeoEarthState>) => {
    setState(prev => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setState(DEFAULT_STATE);
  };

  const handleApplyPreset = (preset: PresetState) => {
    if (preset?.state) {
      setState(prev => ({ ...prev, ...(preset.state as Partial<GeoEarthState>) }));
    }
  };

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={GEOGRAPHY_QUESTS}
      presets={GEOGRAPHY_PRESETS}
      currentState={state}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      controlPanel={
        <ControlPanel
          state={state}
          onChange={handleChange}
          quests={GEOGRAPHY_QUESTS}
        />
      }
    >
      <GeoEarthCanvas
        state={state}
        onChange={handleChange}
      />
    </SandboxLayout>
  );
}
