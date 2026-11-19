import React, { useState, useEffect, useRef } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { ProjectileCanvas } from './ProjectileCanvas';
import { ControlPanel } from './ControlPanel';
import { PROJECTILE_QUESTS, ProjectileSimulationState } from './quests';
import { PROJECTILE_PRESETS, ProjectilePresetConfig } from './presets';
import { 
  ProjectileParams, 
  TrajectorySummary, 
  solveDragTrajectory, 
  solveAnalyticalTrajectory,
  sampleTrajectoryAtTime 
} from './physicsSolver';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { Activity, Flame, Target, Zap, Gauge, Wind } from 'lucide-react';

const METADATA: SimulationMetadata = {
  id: 'phys-projectile-collision-energy',
  title: 'Chuyển động ném xiên & Bảo toàn cơ năng (Vật lý 10)',
  titleEn: '2D Projectile Motion, Aerodynamic Drag & Mechanical Energy',
  subject: 'vat-ly',
  grade: 10,
  level: 'THPT',
  topic: 'Động học & Động lực học chất điểm (GDPT 2018)',
  description: 'Mô phỏng ném xiên trong chân không và có lực cản không khí (RK4); khảo sát tầm cao H_max, tầm xa L_max, thời gian bay, vector vận tốc (v, vx, vy) và trao đổi động năng - thế năng.',
  curriculumCode: 'GDPT2018-LY10-P1',
  difficulty: 'Khá',
  estimatedMinutes: 30,
  tags: ['Ném xiên', 'Vận tốc', 'Tầm xa', 'Cơ năng', 'Động năng', 'Thế năng', 'Lực cản không khí'],
  technology: 'canvas2d',
  isImplemented: true,
};

interface ProjectileMotionSimulationProps {
  initialPreset?: any;
}

export default function ProjectileMotionSimulation({ initialPreset }: ProjectileMotionSimulationProps) {
  const [params, setParams] = useState<ProjectileParams>({
    v0: 20,
    angleDeg: 45,
    y0: 0,
    g: 9.80665,
    m: 1.0,
    dragCoeff: 0,
  });

  const [targetX, setTargetX] = useState<number>(40);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasFired, setHasFired] = useState<boolean>(false);

  // Khôi phục thông số mô phỏng khi có link chia sẻ (?preset=...)
  useEffect(() => {
    try {
      if (initialPreset && typeof initialPreset === 'object') {
        const p = initialPreset.params || initialPreset;
        if (typeof p.v0 === 'number') {
          setParams(prev => ({ ...prev, ...p }));
          if (typeof initialPreset.targetX === 'number') setTargetX(initialPreset.targetX);
          return;
        }
      }

      const { presetData, rawPreset } = readSimulationUrlParams();
      if (presetData) {
        const p = (presetData.params || presetData) as any;
        if (typeof p.v0 === 'number') {
          setParams(prev => ({ ...prev, ...p }));
          if (typeof (presetData as any).targetX === 'number') {
            setTargetX((presetData as any).targetX);
          }
          return;
        }
      }

      if (rawPreset) {
        const found = PROJECTILE_PRESETS.find(pr => pr.id === rawPreset);
        if (found) {
          setParams(found.state.params);
          setTargetX(found.state.targetX);
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc preset ném xiên:', e);
    }
  }, [initialPreset]);

  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showComponents, setShowComponents] = useState<boolean>(true);
  const [showEnergyHUD, setShowEnergyHUD] = useState<boolean>(true);
  const [showPreviousTrajectory, setShowPreviousTrajectory] = useState<boolean>(true);

  const [previousSummary, setPreviousSummary] = useState<TrajectorySummary | null>(null);

  // Tính toán trước toàn bộ quỹ đạo thực tế và lý tưởng
  const summary: TrajectorySummary = solveDragTrajectory(params);
  const idealSummary: TrajectorySummary = solveAnalyticalTrajectory(params);

  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Vòng lặp Animation mượt mà và an toàn
  useEffect(() => {
    if (!isRunning) {
      lastTimestampRef.current = null;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaSec = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      setCurrentTime(prevTime => {
        const nextTime = prevTime + deltaSec * 1.0; // Tốc độ thời gian thực 1.0x

        // Dừng sạch sẽ khi chạm đất
        if (nextTime >= summary.flightTime) {
          setIsRunning(false);
          return summary.flightTime;
        }

        return nextTime;
      });

      if (isRunning) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, summary.flightTime]);

  const handleLaunch = () => {
    // Lưu lại quỹ đạo vừa bắn làm vệt cũ
    if (hasFired) {
      setPreviousSummary(summary);
    }
    setCurrentTime(0);
    setIsRunning(true);
    setHasFired(true);
  };

  const handleTogglePause = () => {
    if (!hasFired) return;
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setHasFired(false);
    setPreviousSummary(null);
    setParams({
      v0: 20,
      angleDeg: 45,
      y0: 0,
      g: 9.80665,
      m: 1.0,
      dragCoeff: 0,
    });
    setTargetX(40);
  };

  const handleApplyPreset = (preset: PresetState<ProjectilePresetConfig>) => {
    setIsRunning(false);
    setCurrentTime(0);
    setHasFired(false);
    setParams(preset.state.params);
    setTargetX(preset.state.targetX);
  };

  // Trạng thái tức thời hiện tại
  const currentPt = sampleTrajectoryAtTime(summary, currentTime);
  const hitTarget = Math.abs(summary.maxRange - targetX) <= 1.5;

  // Snapshot cho SandboxLayout và AI Gia sư
  const currentSimulationState: ProjectileSimulationState = {
    params,
    summary,
    currentTime,
    isRunning,
    hasFired,
    targetX,
    hitTarget,
  };

  const snapshotState = {
    ...currentSimulationState,
    instantaneous: currentPt,
    summaryForAI: `
BÀI THÍ NGHIỆM: Chuyển động ném xiên & Bảo toàn cơ năng (Vật lý 10 GDPT)
- Thông số phóng: Vận tốc đầu v0 = ${params.v0} m/s, Góc ném α = ${params.angleDeg}°, Độ cao ban đầu y0 = ${params.y0} m
- Môi trường: Gia tốc trọng trường g = ${params.g.toFixed(2)} m/s², Hệ số cản không khí k = ${params.dragCoeff}
- Tầm bay cao cực đại H_max = ${summary.maxHeight.toFixed(2)} m (đạt lúc t = ${summary.apexTime.toFixed(2)} s)
- Tầm bay xa rơi xuống đất L_max = ${summary.maxRange.toFixed(2)} m (thời gian bay t = ${summary.flightTime.toFixed(2)} s)
- Bia mục tiêu tại x = ${targetX} m (Độ lệch: ${(summary.maxRange - targetX).toFixed(2)} m - ${hitTarget ? 'TRÚNG HỒNG TÂM' : 'CHƯA TRÚNG'})
- Trạng thái năng lượng tức thời tại t = ${currentTime.toFixed(2)} s: Động năng Wd = ${currentPt.ke.toFixed(1)} J, Thế năng Wt = ${currentPt.pe.toFixed(1)} J, Tổng cơ năng W = ${currentPt.te.toFixed(1)} J
`.trim(),
  };

  // Thanh trạng thái đo đạc thời gian thực ở đáy màn hình
  const extraStats = (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 font-mono">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">Vị trí:</span>
          <span className="text-white font-bold">x = {currentPt.x.toFixed(1)}m, y = {currentPt.y.toFixed(1)}m</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <Activity className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400">Vận tốc v:</span>
          <span className="text-amber-300 font-bold">{currentPt.speed.toFixed(1)} m/s</span>
          <span className="text-slate-500">(vx={currentPt.vx.toFixed(1)}, vy={currentPt.vy.toFixed(1)})</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">Cơ năng W:</span>
          <span className="text-emerald-400 font-bold">{currentPt.te.toFixed(0)} J</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <Target className="w-4 h-4 text-rose-400" />
          <span className="text-slate-400">Mục tiêu:</span>
          <span className={`font-bold ${hitTarget ? 'text-emerald-400' : 'text-slate-300'}`}>
            {hitTarget ? 'TRÚNG BIA (±1.5m)' : `${targetX}m`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">
          t = {currentTime.toFixed(2)}s / {summary.flightTime.toFixed(2)}s
        </span>
      </div>
    </div>
  );

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={PROJECTILE_QUESTS}
      presets={PROJECTILE_PRESETS}
      currentState={snapshotState}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      extraStats={extraStats}
      controlPanel={
        <ControlPanel
          params={params}
          summary={summary}
          currentTime={currentTime}
          isRunning={isRunning}
          hasFired={hasFired}
          targetX={targetX}
          showVectors={showVectors}
          showComponents={showComponents}
          showEnergyHUD={showEnergyHUD}
          showPreviousTrajectory={showPreviousTrajectory}
          onSetParams={setParams}
          onSetTargetX={setTargetX}
          onLaunch={handleLaunch}
          onTogglePause={handleTogglePause}
          onReset={handleReset}
          onToggleVectors={() => setShowVectors(!showVectors)}
          onToggleComponents={() => setShowComponents(!showComponents)}
          onToggleEnergyHUD={() => setShowEnergyHUD(!showEnergyHUD)}
          onTogglePreviousTrajectory={() => setShowPreviousTrajectory(!showPreviousTrajectory)}
        />
      }
    >
      <ProjectileCanvas
        params={params}
        summary={summary}
        idealSummary={idealSummary}
        previousSummary={previousSummary}
        currentTime={currentTime}
        isRunning={isRunning}
        hasFired={hasFired}
        targetX={targetX}
        showVectors={showVectors}
        showComponents={showComponents}
        showEnergyHUD={showEnergyHUD}
        showPreviousTrajectory={showPreviousTrajectory}
      />
    </SandboxLayout>
  );
}
