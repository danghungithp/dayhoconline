import React, { useState, useMemo } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { OrbitalCanvas } from './OrbitalCanvas';
import { ControlPanel } from './ControlPanel';
import { OrbitalsBondingState } from './types';
import { ORBITAL_QUESTS } from './quests';
import { ORBITAL_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';

const METADATA: SimulationMetadata = {
  id: 'chem-orbitals-bonding',
  title: 'Cấu trúc Orbital lượng tử & Liên kết Hóa học',
  titleEn: 'Quantum Orbitals (s,p,d,f), Hund/Pauli Rules & Chemical Bonding',
  subject: 'hoa-hoc',
  grade: 10,
  level: 'THPT',
  topic: 'Cấu tạo vỏ nguyên tử & Liên kết (GDPT 2018)',
  description: 'Mô phỏng đám mây electron 1s, 2s, 2px, 2py, 2pz, 3d 3D; điền electron vào ô lượng tử theo nguyên lý Aufbau, Pauli, Hund; khảo sát liên kết cộng hóa trị xen phủ trục σ, xen phủ bên π và liên kết ion NaCl.',
  curriculumCode: 'GDPT2018-HOA10-C1',
  difficulty: 'Nâng cao',
  estimatedMinutes: 35,
  tags: ['Orbital 3D', 'Aufbau', 'Hund', 'Pauli', 'Liên kết ion', 'Cộng hóa trị', 'Sigma', 'Pi'],
  technology: 'canvas2d',
  isImplemented: true,
};

const DEFAULT_STATE: OrbitalsBondingState = {
  viewMode: 'orbital-3d',
  selectedOrbital: '2pz',
  showAxes: true,
  cloudDensity: 1.0,
  rotationAngleX: 20,
  rotationAngleY: 35,
  atomicNumberZ: 6, // Cacbon
  autoFillAufbau: true,
  selectedBond: 'covalent-sigma',
  internuclearDistance: 74,
  showOverlapCloud: true,
};

interface SimulationProps {
  initialPreset?: any;
}

export default function OrbitalsBondingSimulation({ initialPreset }: SimulationProps) {
  const resolvedInitialState = useMemo<OrbitalsBondingState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<OrbitalsBondingState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<OrbitalsBondingState>(resolvedInitialState);

  const handleChange = (patch: Partial<OrbitalsBondingState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setState(DEFAULT_STATE);
  };

  const handleApplyPreset = (preset: PresetState) => {
    if (preset?.state) {
      setState((prev) => ({ ...prev, ...(preset.state as Partial<OrbitalsBondingState>) }));
    }
  };

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={ORBITAL_QUESTS}
      presets={ORBITAL_PRESETS}
      currentState={state}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      controlPanel={
        <ControlPanel
          state={state}
          onChange={handleChange}
          quests={ORBITAL_QUESTS}
        />
      }
    >
      <OrbitalCanvas
        state={state}
        onChange={handleChange}
      />
    </SandboxLayout>
  );
}
