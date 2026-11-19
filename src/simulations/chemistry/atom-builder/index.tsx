import React, { useEffect } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { AtomCanvas } from './AtomCanvas';
import { ControlPanel } from './ControlPanel';
import { ATOM_BUILDER_QUESTS } from './quests';
import { ATOM_BUILDER_PRESETS, AtomBuilderPresetConfig } from './presets';
import { useAtomStore, SimulationStateSnapshot } from './atomStore';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { Activity, ShieldCheck, Zap, Scale, Layers } from 'lucide-react';

const METADATA: SimulationMetadata = {
  id: 'chem-atom-builder',
  title: 'Cấu tạo nguyên tử, Ion, Đồng vị & Ghép phân tử',
  titleEn: 'Atomic Structure, Ions, Isotopes & Molecular Bonding Builder',
  subject: 'hoa-hoc',
  grade: 10,
  level: 'THPT',
  topic: 'Cấu tạo vỏ nguyên tử & Liên kết hóa học (GDPT 2018)',
  description: 'Mô phỏng tương tác hạt p+, n0, e-; khảo sát số hiệu Z, số khối A, điện tích ion, độ bền hạt nhân, cấu hình electron phân lớp (Aufbau) và liên kết hóa học (cộng hóa trị H2, O2, H2O, CO2, NH3, CH4 & liên kết ion NaCl).',
  curriculumCode: 'GDPT2018-HOA10-B1',
  difficulty: 'Khá',
  estimatedMinutes: 30,
  tags: ['Proton', 'Neutron', 'Electron', 'Ion', 'Đồng vị', 'Liên kết hóa học', 'Bảng tuần hoàn'],
  technology: 'canvas2d',
  isImplemented: true,
};

interface AtomBuilderSimulationProps {
  initialPreset?: any;
}

export default function AtomBuilderSimulation({ initialPreset }: AtomBuilderSimulationProps) {
  const {
    protons,
    neutrons,
    electrons,
    mode,
    selectedMoleculeId,
    outputs,
    isAnimationPaused,
    setProtons,
    setNeutrons,
    setElectrons,
    setParticles,
    setMode,
    setSelectedMoleculeId,
    selectElementPreset,
    reset,
    getSnapshot,
  } = useAtomStore();

  // Khôi phục trạng thái mô phỏng từ URL (?preset=...) hoặc prop
  useEffect(() => {
    try {
      if (initialPreset && typeof initialPreset === 'object') {
        const p = initialPreset.protons ?? initialPreset.parameters?.protons;
        if (typeof p === 'number') {
          const n = initialPreset.neutrons ?? initialPreset.parameters?.neutrons ?? 0;
          const e = initialPreset.electrons ?? initialPreset.parameters?.electrons ?? 0;
          setParticles(p, n, e);
          if (initialPreset.mode || initialPreset.parameters?.mode) {
            setMode(initialPreset.mode || initialPreset.parameters?.mode);
          }
          if (initialPreset.selectedMoleculeId || initialPreset.parameters?.selectedMoleculeId) {
            setSelectedMoleculeId(initialPreset.selectedMoleculeId || initialPreset.parameters?.selectedMoleculeId);
          }
          return;
        }
      }

      const { presetData, rawPreset } = readSimulationUrlParams();
      if (presetData) {
        const p = presetData.protons ?? (presetData.parameters as any)?.protons;
        if (typeof p === 'number') {
          const n = (presetData.neutrons ?? (presetData.parameters as any)?.neutrons ?? 0) as number;
          const e = (presetData.electrons ?? (presetData.parameters as any)?.electrons ?? 0) as number;
          setParticles(p, n, e);
          if (presetData.mode || (presetData.parameters as any)?.mode) {
            setMode((presetData.mode || (presetData.parameters as any)?.mode) as any);
          }
          return;
        }
      }

      if (rawPreset) {
        const found = ATOM_BUILDER_PRESETS.find(pr => pr.id === rawPreset);
        if (found) {
          setParticles(found.state.protons, found.state.neutrons, found.state.electrons);
          setMode(found.state.mode);
          setSelectedMoleculeId(found.state.selectedMoleculeId);
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc preset URL:', e);
    }
  }, [initialPreset]);

  const handleApplyPreset = (preset: PresetState<AtomBuilderPresetConfig>) => {
    const { state } = preset;
    setParticles(state.protons, state.neutrons, state.electrons);
    setMode(state.mode);
    setSelectedMoleculeId(state.selectedMoleculeId);
  };

  const snapshot: SimulationStateSnapshot = getSnapshot();

  // Dữ liệu trạng thái tổng hợp cho Sandbox & AI Tutor
  const combinedCurrentState = {
    protons,
    neutrons,
    electrons,
    mode,
    selectedMoleculeId,
    z: outputs.z,
    massNumber: outputs.massNumber,
    netCharge: outputs.netCharge,
    ionStatus: outputs.ionStatus,
    ionSymbol: outputs.ionSymbol,
    isStable: outputs.isStable,
    nuclearStability: outputs.nuclearStability,
    stabilityDetail: outputs.stabilityDetail,
    electronShells: outputs.electronShells,
    electronShellSummary: outputs.electronShellSummary,
    subshellNotation: outputs.subshellNotation,
    elementName: outputs.matchedElement?.nameVi || 'Chưa xác định',
    symbol: outputs.matchedElement?.symbol || '?',
    outputs,
    summaryForAI: snapshot.summaryForAI,
  };

  // Live scientific telemetry strip for bottom bar
  const extraStats = (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 font-mono">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">Trạng thái:</span>
          <span className="text-white font-bold">{outputs.ionSymbol}</span>
          <span className="text-slate-500">({outputs.ionStatus})</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <Scale className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400">Số khối A:</span>
          <span className="text-amber-300 font-bold">{outputs.massNumber} amu</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">Điện tích ròng:</span>
          <span
            className={`font-bold ${
              outputs.netCharge === 0 ? 'text-emerald-400' : outputs.netCharge > 0 ? 'text-rose-400' : 'text-cyan-400'
            }`}
          >
            {outputs.netCharge > 0 ? `+${outputs.netCharge}` : outputs.netCharge}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-400">Tỉ lệ N/Z:</span>
          <span className="text-indigo-300 font-bold">
            {outputs.z > 0 ? (outputs.massNumber - outputs.z > 0 ? (neutrons / protons).toFixed(2) : '0.00') : 'N/A'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 ${
            outputs.isStable
              ? 'bg-emerald-950/80 border border-emerald-600/40 text-emerald-300'
              : 'bg-rose-950/80 border border-rose-600/40 text-rose-300 animate-pulse'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{outputs.nuclearStability}</span>
        </span>
      </div>
    </div>
  );

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={ATOM_BUILDER_QUESTS}
      presets={ATOM_BUILDER_PRESETS}
      currentState={combinedCurrentState}
      onReset={reset}
      onApplyPreset={handleApplyPreset}
      extraStats={extraStats}
      controlPanel={
        <ControlPanel
          protons={protons}
          neutrons={neutrons}
          electrons={electrons}
          outputs={outputs}
          mode={mode}
          selectedMoleculeId={selectedMoleculeId}
          onSetProtons={setProtons}
          onSetNeutrons={setNeutrons}
          onSetElectrons={setElectrons}
          onReset={reset}
          onSelectElementPreset={selectElementPreset}
          onToggleMode={setMode}
          onSelectMolecule={setSelectedMoleculeId}
        />
      }
    >
      <AtomCanvas
        protons={protons}
        neutrons={neutrons}
        electrons={electrons}
        outputs={outputs}
        mode={mode}
        selectedMoleculeId={selectedMoleculeId}
        onSelectMolecule={setSelectedMoleculeId}
        isAnimationPaused={isAnimationPaused}
      />
    </SandboxLayout>
  );
}
