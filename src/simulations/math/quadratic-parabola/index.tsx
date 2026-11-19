import React, { useState } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { MathPlotCanvas } from './MathPlotCanvas';
import { ControlPanel } from './ControlPanel';
import { MATH_QUESTS, MathSimulationState } from './quests';
import { MATH_PRESETS, MathPresetConfig } from './presets';
import { 
  ParabolaParams, 
  LineParams, 
  LinearEquation, 
  analyzeParabola, 
  solveLinearSystem,
  calculateParabolaLineIntersection
} from './algebraSolver';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { FunctionSquare, Layers } from 'lucide-react';

const METADATA: SimulationMetadata = {
  id: 'math-linear-systems-quadratic',
  title: 'Hệ PT bậc nhất hai ẩn & Parabol hàm bậc hai y = ax² + bx + c',
  titleEn: 'Systems of 2 Linear Equations & Quadratic Parabola Explorer',
  subject: 'toan',
  grade: 9,
  level: 'THCS',
  topic: 'Phương trình & Đồ thị bậc hai (GDPT 2018)',
  description: 'Khám phá nghiệm hệ phương trình qua giao điểm 2 đường thẳng (Cramer); khảo sát đỉnh Parabol, trục đối xứng, số giao điểm với trục hoành qua Delta, tiếp tuyến và giao điểm Parabol - đường thẳng.',
  curriculumCode: 'GDPT2018-TOAN9-A4',
  difficulty: 'Khá',
  estimatedMinutes: 30,
  tags: ['Hàm số bậc hai', 'Parabol', 'Đỉnh Parabol', 'Delta', 'Hệ phương trình', 'Cramer', 'Tiếp tuyến'],
  technology: 'graph',
  isImplemented: true,
};

interface QuadraticParabolaSimulationProps {
  initialPreset?: any;
}

export default function QuadraticParabolaSimulation({ initialPreset }: QuadraticParabolaSimulationProps) {
  const [activeTab, setActiveTab] = useState<'parabola' | 'linear-system'>('parabola');

  // Trạng thái Parabol
  const [parabola, setParabola] = useState<ParabolaParams>({
    a: 1,
    b: -4,
    c: 3,
  });

  // Trạng thái Đường thẳng so sánh
  const [line, setLine] = useState<LineParams>({
    m: 1,
    n: 0,
  });
  const [showLine, setShowLine] = useState<boolean>(false);

  // Điểm thăm dò tiếp tuyến
  const [probeX, setProbeX] = useState<number>(2);
  const [showTangent, setShowTangent] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Trạng thái Hệ phương trình bậc nhất hai ẩn
  const [linearEq1, setLinearEq1] = useState<LinearEquation>({
    a: 2,
    b: 1,
    c: 4,
  });
  const [linearEq2, setLinearEq2] = useState<LinearEquation>({
    a: 1,
    b: -1,
    c: -1,
  });

  // Khôi phục preset từ URL hoặc prop
  React.useEffect(() => {
    try {
      if (initialPreset && typeof initialPreset === 'object') {
        if (initialPreset.parabola) setParabola(initialPreset.parabola);
        if (initialPreset.activeTab) setActiveTab(initialPreset.activeTab);
        if (initialPreset.linearEq1) setLinearEq1(initialPreset.linearEq1);
        if (initialPreset.linearEq2) setLinearEq2(initialPreset.linearEq2);
        if (initialPreset.line) setLine(initialPreset.line);
        if (typeof initialPreset.showLine === 'boolean') setShowLine(initialPreset.showLine);
        return;
      }

      const { presetData, rawPreset } = readSimulationUrlParams();
      if (presetData) {
        if (presetData.parabola) setParabola(presetData.parabola as any);
        if (presetData.activeTab) setActiveTab(presetData.activeTab as any);
        if (presetData.linearEq1) setLinearEq1(presetData.linearEq1 as any);
        if (presetData.linearEq2) setLinearEq2(presetData.linearEq2 as any);
        if (presetData.line) setLine(presetData.line as any);
        if (typeof presetData.showLine === 'boolean') setShowLine(presetData.showLine as boolean);
        return;
      }

      if (rawPreset) {
        const found = MATH_PRESETS.find(pr => pr.id === rawPreset);
        if (found) {
          handleApplyPreset(found);
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc preset Parabol:', e);
    }
  }, [initialPreset]);

  // Tính toán thuần túy
  const parabolaAnalysis = analyzeParabola(parabola);
  const linearAnalysis = solveLinearSystem(linearEq1, linearEq2);
  const intersection = calculateParabolaLineIntersection(parabola, line);

  // Trạng thái dùng cho Quests và AI Tutor
  const simulationState: MathSimulationState = {
    activeTab,
    parabola,
    line,
    showLine,
    probeX,
    linearEq1,
    linearEq2,
    parabolaAnalysis,
    linearAnalysis,
    parabolaLineDelta: intersection.delta,
    intersectionCount: intersection.points.length,
  };

  // Áp dụng Preset
  const handleApplyPreset = (preset: PresetState<MathPresetConfig>) => {
    const { state } = preset;
    if (!state) return;
    setActiveTab(state.activeTab);
    setParabola(state.parabola);
    setLine(state.line);
    setShowLine(state.showLine);
    setProbeX(state.probeX);
    setLinearEq1(state.linearEq1);
    setLinearEq2(state.linearEq2);
  };

  // Reset về trạng thái chuẩn
  const handleReset = () => {
    setActiveTab('parabola');
    setParabola({ a: 1, b: -4, c: 3 });
    setLine({ m: 1, n: 0 });
    setShowLine(false);
    setProbeX(2);
    setShowTangent(true);
    setShowGrid(true);
    setLinearEq1({ a: 2, b: 1, c: 4 });
    setLinearEq2({ a: 1, b: -1, c: -1 });
  };

  // Telemetry strip hiển thị nhanh ở footer
  const telemetryContent = (
    <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-300 w-full px-2">
      {activeTab === 'parabola' ? (
        <>
          <div className="flex items-center gap-2">
            <FunctionSquare className="w-4 h-4 text-sky-400" />
            <span className="text-slate-400">Parabol:</span>
            <span className="text-white font-bold">{parabolaAnalysis.equationStr}</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-400">Đỉnh I: </span>
              <span className="text-sky-300 font-bold">({parabolaAnalysis.vertex.x}, {parabolaAnalysis.vertex.y})</span>
            </div>
            <div>
              <span className="text-slate-400">Trục: </span>
              <span className="text-cyan-300 font-bold">x = {parabolaAnalysis.axisOfSymmetry}</span>
            </div>
            <div>
              <span className="text-slate-400">Δ: </span>
              <span className={`font-bold ${parabolaAnalysis.delta > 0 ? 'text-emerald-400' : parabolaAnalysis.delta === 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                {parabolaAnalysis.delta}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Giao Ox: </span>
              <span className="text-white font-bold">{parabolaAnalysis.roots.length} điểm</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Định thức Cramer:</span>
            <span className="text-teal-300 font-bold">D = {linearAnalysis.D}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Dx = {linearAnalysis.Dx}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Dy = {linearAnalysis.Dy}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Kết luận: </span>
            <span className="text-emerald-400 font-bold">{linearAnalysis.statusMessageVi}</span>
          </div>
        </>
      )}
    </div>
  );

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={MATH_QUESTS}
      currentState={simulationState}
      presets={MATH_PRESETS}
      onApplyPreset={(p) => handleApplyPreset(p as PresetState<MathPresetConfig>)}
      onReset={handleReset}
      extraStats={telemetryContent}
      controlPanel={
        <ControlPanel
          activeTab={activeTab}
          onTabChange={setActiveTab}
          parabola={parabola}
          onParabolaChange={setParabola}
          line={line}
          onLineChange={setLine}
          showLine={showLine}
          onToggleShowLine={() => setShowLine(!showLine)}
          probeX={probeX}
          onProbeXChange={setProbeX}
          showTangent={showTangent}
          onToggleShowTangent={() => setShowTangent(!showTangent)}
          showGrid={showGrid}
          onToggleShowGrid={() => setShowGrid(!showGrid)}
          linearEq1={linearEq1}
          onLinearEq1Change={setLinearEq1}
          linearEq2={linearEq2}
          onLinearEq2Change={setLinearEq2}
          parabolaAnalysis={parabolaAnalysis}
          linearAnalysis={linearAnalysis}
        />
      }
    >
      <MathPlotCanvas
        activeTab={activeTab}
        parabola={parabola}
        line={line}
        showLine={showLine}
        probeX={probeX}
        onProbeXChange={setProbeX}
        parabolaAnalysis={parabolaAnalysis}
        linearAnalysis={linearAnalysis}
        showTangent={showTangent}
        showGrid={showGrid}
      />
    </SandboxLayout>
  );
}
