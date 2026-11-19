import React, { useState, useEffect, useRef } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { SolidScene3D } from './SolidScene3D';
import { ControlPanel } from './ControlPanel';
import { SOLID_GEOMETRY_QUESTS } from './quests';
import { SOLID_GEOMETRY_PRESETS, SolidGeometryPresetConfig } from './presets';
import { SolidType, calculateSolidGeometry, SolidGeometryOutput } from './geometryMath';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { Box, Layers, Maximize2, Sparkles, Compass } from 'lucide-react';

const METADATA: SimulationMetadata = {
  id: 'geom-quadrilaterals-thales-pyramids',
  title: 'Hình học Không gian 3D & Trải phẳng (Net Unfolding)',
  titleEn: '3D Solid Geometry & Interactive Net Unfolding',
  subject: 'hinh-hoc',
  grade: 8,
  level: 'THCS',
  topic: 'Hình chóp, lăng trụ, nón, trụ & Diện tích/Thể tích (Toán 8, 9, 11, 12)',
  description: 'Tương tác xoay 3D, tính toán chính xác S_đáy, S_xq, S_tp, Thể tích V, trung đoạn d, đường sinh l và mô phỏng hiệu ứng trải phẳng (Net Unfolding) 0% - 100% của các khối hình học GDPT.',
  curriculumCode: 'GDPT2018-TOAN8-G3',
  difficulty: 'Khá',
  estimatedMinutes: 30,
  tags: ['Hình chóp 3D', 'Hình lăng trụ', 'Hình nón', 'Hình trụ', 'Trải phẳng', 'Thể tích', 'Diện tích'],
  technology: 'three3d',
  isImplemented: true,
};

interface SolidGeometry3DSimulationProps {
  initialPreset?: any;
}

export default function SolidGeometry3DSimulation({ initialPreset }: SolidGeometry3DSimulationProps) {
  const [solidType, setSolidType] = useState<SolidType>('square-pyramid');
  const [baseDimension, setBaseDimension] = useState<number>(6);
  const [height, setHeight] = useState<number>(8);
  const [unfoldProgress, setUnfoldProgress] = useState<number>(0);

  // Khôi phục preset từ URL hoặc prop
  useEffect(() => {
    try {
      if (initialPreset && typeof initialPreset === 'object') {
        if (initialPreset.solidType) setSolidType(initialPreset.solidType);
        if (typeof initialPreset.baseDimension === 'number') setBaseDimension(initialPreset.baseDimension);
        if (typeof initialPreset.height === 'number') setHeight(initialPreset.height);
        if (typeof initialPreset.unfoldProgress === 'number') setUnfoldProgress(initialPreset.unfoldProgress);
        return;
      }

      const { presetData, rawPreset } = readSimulationUrlParams();
      if (presetData) {
        if (presetData.solidType) setSolidType(presetData.solidType as SolidType);
        if (typeof presetData.baseDimension === 'number') setBaseDimension(presetData.baseDimension as number);
        if (typeof presetData.height === 'number') setHeight(presetData.height as number);
        if (typeof presetData.unfoldProgress === 'number') setUnfoldProgress(presetData.unfoldProgress as number);
        return;
      }

      if (rawPreset) {
        const found = SOLID_GEOMETRY_PRESETS.find(pr => pr.id === rawPreset);
        if (found) {
          setSolidType(found.state.solidType);
          setBaseDimension(found.state.baseDimension);
          setHeight(found.state.height);
          setUnfoldProgress(found.state.unfoldProgress);
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc preset hình học 3D:', e);
    }
  }, [initialPreset]);

  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showAltitude, setShowAltitude] = useState<boolean>(true);
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [opacity, setOpacity] = useState<number>(0.85);

  const [isAutoUnfolding, setIsAutoUnfolding] = useState<boolean>(false);
  const autoUnfoldDir = useRef<number>(1);
  const animFrameId = useRef<number | null>(null);

  // Tính toán đầu ra hình học thời gian thực
  const outputs: SolidGeometryOutput = calculateSolidGeometry(solidType, baseDimension, height);

  // Hiệu ứng tự động mở và khép mạng phẳng khi bật nút Auto
  useEffect(() => {
    if (!isAutoUnfolding) {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      return;
    }

    const animate = () => {
      setUnfoldProgress(prev => {
        let next = prev + 0.008 * autoUnfoldDir.current;
        if (next >= 1) {
          next = 1;
          autoUnfoldDir.current = -1;
        } else if (next <= 0) {
          next = 0;
          autoUnfoldDir.current = 1;
        }
        return next;
      });
      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isAutoUnfolding]);

  const handleReset = () => {
    setSolidType('square-pyramid');
    setBaseDimension(6);
    setHeight(8);
    setUnfoldProgress(0);
    setIsAutoUnfolding(false);
  };

  const handleApplyPreset = (preset: PresetState<SolidGeometryPresetConfig>) => {
    const { state } = preset;
    setSolidType(state.solidType);
    setBaseDimension(state.baseDimension);
    setHeight(state.height);
    setUnfoldProgress(state.unfoldProgress);
    setIsAutoUnfolding(false);
  };

  // State snapshot cho AI Gia sư và Sandbox
  const currentStateSnapshot = {
    solidType,
    baseDimension,
    height,
    unfoldProgress,
    outputs,
    showLabels,
    showAltitude,
    showWireframe,
    showGrid,
    opacity,
    summaryForAI: `
BÀI THÍ NGHIỆM: Hình học Không gian 3D & Trải phẳng (Net Unfolding)
- Khối hình hiện tại: ${outputs.nameVi} (${outputs.nameEn})
- Kích thước: ${solidType === 'cylinder' || solidType === 'cone' ? 'Bán kính r' : 'Cạnh đáy a'} = ${baseDimension.toFixed(2)}, Chiều cao h = ${height.toFixed(2)}
- Tiến trình trải phẳng (Net): ${Math.round(unfoldProgress * 100)}%
- Diện tích đáy S_đáy: ${outputs.baseArea.toFixed(2)}
- Diện tích xung quanh S_xq: ${outputs.lateralArea.toFixed(2)}
- Diện tích toàn phần S_tp: ${outputs.totalArea.toFixed(2)}
- Thể tích khối V: ${outputs.volume.toFixed(2)}
- Trung đoạn d / Đường sinh l: ${outputs.slantHeightOrGenerator.toFixed(2)}
- Công thức SGK: ${outputs.formulas.volume} • ${outputs.formulas.lateralArea}
`.trim(),
  };

  // Live scientific telemetry strip for bottom bar
  const extraStats = (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 font-mono">
          <Box className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">Khối:</span>
          <span className="text-white font-bold">{outputs.nameVi}</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-slate-400">Thể tích V:</span>
          <span className="text-amber-400 font-bold">{outputs.volume.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-slate-400">S xung quanh:</span>
          <span className="text-cyan-300 font-bold">{outputs.lateralArea.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-slate-400">S toàn phần:</span>
          <span className="text-emerald-400 font-bold">{outputs.totalArea.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-600/40 text-indigo-300 text-[11px] font-mono flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Trải phẳng: {Math.round(unfoldProgress * 100)}%</span>
        </span>
      </div>
    </div>
  );

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={SOLID_GEOMETRY_QUESTS}
      presets={SOLID_GEOMETRY_PRESETS}
      currentState={currentStateSnapshot}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      extraStats={extraStats}
      controlPanel={
        <ControlPanel
          solidType={solidType}
          baseDimension={baseDimension}
          height={height}
          unfoldProgress={unfoldProgress}
          outputs={outputs}
          showLabels={showLabels}
          showAltitude={showAltitude}
          showWireframe={showWireframe}
          showGrid={showGrid}
          opacity={opacity}
          isAutoUnfolding={isAutoUnfolding}
          onSetSolidType={setSolidType}
          onSetBaseDimension={setBaseDimension}
          onSetHeight={setHeight}
          onSetUnfoldProgress={setUnfoldProgress}
          onToggleLabels={() => setShowLabels(!showLabels)}
          onToggleAltitude={() => setShowAltitude(!showAltitude)}
          onToggleWireframe={() => setShowWireframe(!showWireframe)}
          onToggleGrid={() => setShowGrid(!showGrid)}
          onSetOpacity={setOpacity}
          onToggleAutoUnfold={() => setIsAutoUnfolding(!isAutoUnfolding)}
          onReset={handleReset}
        />
      }
    >
      <SolidScene3D
        solidType={solidType}
        baseDimension={baseDimension}
        height={height}
        unfoldProgress={unfoldProgress}
        outputs={outputs}
        showLabels={showLabels}
        showAltitude={showAltitude}
        showWireframe={showWireframe}
        showGrid={showGrid}
        opacity={opacity}
      />
    </SandboxLayout>
  );
}
