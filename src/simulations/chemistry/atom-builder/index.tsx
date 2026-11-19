import React, { useEffect, useMemo, useState } from 'react';
import { ELEMENTS_DATA, MoleculePreset } from './elementsData';
import { analyzeAtom, matchMoleculeFromCounts } from './physicsEngine';
import { DEFAULT_ATOM_QUESTS } from './quests';
import { AtomCanvas } from './AtomCanvas';
import { ControlPanel } from './ControlPanel';
import { evaluateAssignmentQuests } from '../../../core/utils/questEvaluator';
import { CustomQuestItem } from '../../../types/assignment.types';
import { SimulationAIContext } from '../../../services/geminiService';
import { readSimulationUrlParams } from '../../../utils/presetCodec';

interface AtomBuilderSimulationProps {
  initialPreset?: Record<string, unknown>;
  customQuests?: CustomQuestItem[];
  onStateSnapshotChange?: (snapshot: SimulationAIContext) => void;
}

export const AtomBuilderSimulation: React.FC<AtomBuilderSimulationProps> = ({
  initialPreset,
  customQuests,
  onStateSnapshotChange,
}) => {
  // Đọc từ prop hoặc URL params (?preset=...)
  const resolvedPreset = useMemo(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) return initialPreset;
    const { presetData } = readSimulationUrlParams();
    return (presetData as Record<string, unknown>) || {};
  }, [initialPreset]);

  const [mode, setMode] = useState<'atom' | 'molecule'>('atom');
  const [protons, setProtons] = useState<number>(
    typeof resolvedPreset?.protons === 'number' ? resolvedPreset.protons : 6
  );
  const [neutrons, setNeutrons] = useState<number>(
    typeof resolvedPreset?.neutrons === 'number' ? resolvedPreset.neutrons : 6
  );
  const [electrons, setElectrons] = useState<number>(
    typeof resolvedPreset?.electrons === 'number' ? resolvedPreset.electrons : 6
  );

  const [atomCounts, setAtomCounts] = useState<Record<string, number>>({
    H: 2,
    O: 1,
  });

  const quests = customQuests && customQuests.length > 0 ? customQuests : DEFAULT_ATOM_QUESTS;
  const [activeQuestId, setActiveQuestId] = useState<string>(quests[0]?.id ?? '');

  const analysis = useMemo(
    () => analyzeAtom(protons, neutrons, electrons),
    [protons, neutrons, electrons]
  );

  const activeMolecule = useMemo(
    () => matchMoleculeFromCounts(atomCounts),
    [atomCounts]
  );

  const evaluation = useMemo(
    () =>
      evaluateAssignmentQuests(quests, {
        parameters: { protons, neutrons, electrons, mode, atomCounts },
        calculatedOutputs: {
          symbol: analysis.symbol,
          nameVi: analysis.nameVi,
          massNumber: analysis.massNumber,
          charge: analysis.charge,
          ionType: analysis.ionType,
          isRadioactive: analysis.stability === 'radioactive',
          moleculeFormula: activeMolecule?.formula ?? null,
        },
      }),
    [quests, protons, neutrons, electrons, mode, atomCounts, analysis, activeMolecule]
  );

  const activeQuest = quests.find((q) => q.id === activeQuestId) ?? quests[0];
  const activeQuestCompleted =
    evaluation.results.find((r) => r.questId === activeQuest?.id)?.completed ?? false;

  useEffect(() => {
    if (!onStateSnapshotChange) return;

    const summaryForAI =
      mode === 'atom'
        ? `Đang ở mô hình nguyên tử/ion: ${analysis.nameVi} (${analysis.symbol}), Proton=${protons}, Neutron=${neutrons}, Electron=${electrons}, Số khối A=${analysis.massNumber}, Điện tích=${analysis.chargeFormatted}, Trạng thái hạt nhân=${analysis.stabilityLabel}.`
        : `Đang ở chế độ ghép phân tử với các nguyên tử ${JSON.stringify(atomCounts)}. Phân tử nhận diện: ${
            activeMolecule ? `${activeMolecule.formula} (${activeMolecule.bondType})` : 'Chưa khớp phân tử chuẩn'
          }.`;

    onStateSnapshotChange({
      simulationId: 'chem-atom-builder',
      title: 'Cấu tạo Nguyên tử, Ion, Đồng vị & Ghép Phân tử',
      subject: 'chemistry',
      grade: 8,
      parameters: { protons, neutrons, electrons, mode, atomCounts },
      calculatedOutputs: {
        symbol: analysis.symbol,
        massNumber: analysis.massNumber,
        charge: analysis.charge,
        ionType: analysis.ionType,
        stability: analysis.stability,
        moleculeFormula: activeMolecule?.formula ?? null,
      },
      activeQuest: activeQuest
        ? {
            id: activeQuest.id,
            prompt: activeQuest.instruction,
            isCompleted: activeQuestCompleted,
          }
        : undefined,
      summaryForAI,
    });
  }, [
    onStateSnapshotChange,
    mode,
    analysis,
    protons,
    neutrons,
    electrons,
    atomCounts,
    activeMolecule,
    activeQuest,
    activeQuestCompleted,
  ]);

  const handleChangeParticle = (
    type: 'protons' | 'neutrons' | 'electrons',
    delta: number
  ) => {
    if (type === 'protons') setProtons((v) => Math.max(0, Math.min(20, v + delta)));
    if (type === 'neutrons') setNeutrons((v) => Math.max(0, Math.min(28, v + delta)));
    if (type === 'electrons') setElectrons((v) => Math.max(0, Math.min(20, v + delta)));
  };

  const handleSelectElement = (z: number) => {
    const el = ELEMENTS_DATA.find((item) => item.z === z);
    if (!el) return;
    setProtons(el.z);
    setNeutrons(el.defaultNeutrons);
    setElectrons(el.z);
  };

  const handleReset = () => {
    setProtons(6);
    setNeutrons(6);
    setElectrons(6);
    setAtomCounts({ H: 2, O: 1 });
  };

  const handleSelectMoleculePreset = (preset: MoleculePreset) => {
    setAtomCounts({ ...preset.requiredAtoms });
  };

  const handleChangeMoleculeAtom = (symbol: string, delta: number) => {
    setAtomCounts((prev) => {
      const nextVal = Math.max(0, Math.min(8, (prev[symbol] ?? 0) + delta));
      return { ...prev, [symbol]: nextVal };
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 p-3 sm:p-5 h-full w-full max-w-7xl mx-auto overflow-y-auto">
      <div className="lg:col-span-8 flex flex-col justify-center">
        <AtomCanvas
          mode={mode}
          analysis={analysis}
          activeMolecule={activeMolecule}
          atomCounts={atomCounts}
        />
      </div>
      <div className="lg:col-span-4 flex flex-col justify-center">
        <ControlPanel
          mode={mode}
          onModeChange={setMode}
          protons={protons}
          neutrons={neutrons}
          electrons={electrons}
          onChangeParticle={handleChangeParticle}
          onSelectElement={handleSelectElement}
          onReset={handleReset}
          analysis={analysis}
          atomCounts={atomCounts}
          activeMolecule={activeMolecule}
          onSelectMoleculePreset={handleSelectMoleculePreset}
          onChangeMoleculeAtom={handleChangeMoleculeAtom}
          quests={quests}
          questResults={evaluation.results}
          activeQuestId={activeQuest?.id ?? ''}
          onSelectQuest={setActiveQuestId}
        />
      </div>
    </div>
  );
};

export default AtomBuilderSimulation;
