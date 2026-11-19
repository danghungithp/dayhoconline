import React, { useState, useMemo, useRef } from 'react';
import { SandboxLayout } from '../../../core/components/SandboxLayout';
import { ProportionsCanvas } from './ProportionsCanvas';
import { SquareRootCanvas } from './SquareRootCanvas';
import { ProbabilitySpinnerCanvas } from './ProbabilitySpinnerCanvas';
import { ControlPanel } from './ControlPanel';
import { ProportionsProbState, SpinnerSlice } from './types';
import { PROPORTIONS_QUESTS } from './quests';
import { PROPORTIONS_PRESETS } from './presets';
import { SimulationMetadata, PresetState } from '../../../types/simulation.types';
import { readSimulationUrlParams } from '../../../utils/presetCodec';
import { useTheme } from '../../../core/theme/themeContext';

const METADATA: SimulationMetadata = {
  id: 'math-real-numbers-proportions',
  title: 'Số thực, Đại lượng tỉ lệ & Biến cố xác suất cơ bản',
  titleEn: 'Real Numbers, Direct/Inverse Variation & Probability Spinner',
  subject: 'toan',
  grade: 7,
  level: 'THCS',
  topic: 'Đại số & Xác suất (GDPT 2018)',
  description: 'Khai căn bậc hai số học trên lưới hình học; mô phỏng tỉ lệ thuận y = kx và tỉ lệ nghịch y = a/x; vòng quay xác suất và kiểm nghiệm định luật số lớn.',
  curriculumCode: 'GDPT2018-TOAN7-A2',
  difficulty: 'Cơ bản',
  estimatedMinutes: 25,
  tags: ['Căn bậc hai', 'Tỉ lệ thuận', 'Tỉ lệ nghịch', 'Xác suất thực nghiệm', 'Luật số lớn'],
  technology: 'graph',
  isImplemented: true,
};

const DEFAULT_SLICES: SpinnerSlice[] = [
  { id: 'red', label: 'Đỏ', color: '#ef4444', weight: 1 },
  { id: 'blue', label: 'Xanh lam', color: '#3b82f6', weight: 1 },
  { id: 'green', label: 'Xanh lục', color: '#10b981', weight: 1 },
  { id: 'yellow', label: 'Vàng', color: '#f59e0b', weight: 1 },
];

const DEFAULT_STATE: ProportionsProbState = {
  mode: 'direct',
  k: 2,
  testDirectX: 3,
  a: 12,
  testInverseX: 3,
  squareArea: 49,
  slices: DEFAULT_SLICES,
  stats: {
    counts: {},
    totalSpins: 0,
  },
  currentSliceId: null,
  isSpinning: false,
};

interface ProportionsSimulationProps {
  initialPreset?: any;
}

export default function ProportionsProbabilitySimulation({
  initialPreset,
}: ProportionsSimulationProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const resolvedInitialState = useMemo<ProportionsProbState>(() => {
    if (initialPreset && Object.keys(initialPreset).length > 0) {
      return { ...DEFAULT_STATE, ...initialPreset };
    }
    const { presetData } = readSimulationUrlParams();
    if (presetData && typeof presetData === 'object') {
      return { ...DEFAULT_STATE, ...(presetData as Partial<ProportionsProbState>) };
    }
    return DEFAULT_STATE;
  }, [initialPreset]);

  const [state, setState] = useState<ProportionsProbState>(resolvedInitialState);
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  const handleStateChange = (patch: Partial<ProportionsProbState>) => {
    setState(prev => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setState(DEFAULT_STATE);
    setRotationDeg(0);
  };

  const handleApplyPreset = (preset: PresetState) => {
    if (preset.state) {
      setState(prev => ({ ...prev, ...preset.state }));
    }
  };

  // Logic quay vòng quay may mắn
  const handleSpin = (count: number) => {
    if (state.isSpinning) return;

    if (count === 1) {
      // Quay đơn có hiệu ứng vật lý xoay vòng quay
      setState(prev => ({ ...prev, isSpinning: true }));
      const totalWeight = state.slices.reduce((acc, s) => acc + s.weight, 0);

      // Random lát cắt trúng
      const rand = Math.random() * totalWeight;
      let cum = 0;
      let pickedSlice = state.slices[0];
      for (const s of state.slices) {
        cum += s.weight;
        if (rand <= cum) {
          pickedSlice = s;
          break;
        }
      }

      // Tính góc quay cần thiết (thêm 4-6 vòng quay = 1440 - 2160 deg)
      const extraSpins = 360 * 5;
      const targetDeg = rotationDeg + extraSpins + Math.floor(Math.random() * 360);

      const startTime = performance.now();
      const duration = 2000;
      const initialDeg = rotationDeg;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentDeg = initialDeg + (targetDeg - initialDeg) * easeOut;
        setRotationDeg(currentDeg);

        if (progress < 1) {
          animRef.current = requestAnimationFrame(animate);
        } else {
          // Kết thúc vòng quay
          setState(prev => {
            const newCounts = { ...prev.stats.counts };
            newCounts[pickedSlice.id] = (newCounts[pickedSlice.id] || 0) + 1;
            return {
              ...prev,
              isSpinning: false,
              currentSliceId: pickedSlice.id,
              stats: {
                counts: newCounts,
                totalSpins: prev.stats.totalSpins + 1,
              },
            };
          });
        }
      };

      animRef.current = requestAnimationFrame(animate);
    } else {
      // Quay nhiều lần liên tiếp (10 hoặc 50 lần) để quan sát luật số lớn
      const totalWeight = state.slices.reduce((acc, s) => acc + s.weight, 0);
      const newCounts = { ...state.stats.counts };

      for (let i = 0; i < count; i++) {
        const rand = Math.random() * totalWeight;
        let cum = 0;
        for (const s of state.slices) {
          cum += s.weight;
          if (rand <= cum) {
            newCounts[s.id] = (newCounts[s.id] || 0) + 1;
            break;
          }
        }
      }

      setRotationDeg(prev => (prev + 360 * 2 + Math.floor(Math.random() * 360)) % 360);
      setState(prev => ({
        ...prev,
        stats: {
          counts: newCounts,
          totalSpins: prev.stats.totalSpins + count,
        },
      }));
    }
  };

  const handleResetStats = () => {
    setState(prev => ({
      ...prev,
      stats: {
        counts: {},
        totalSpins: 0,
      },
      currentSliceId: null,
    }));
  };

  return (
    <SandboxLayout
      metadata={METADATA}
      quests={PROPORTIONS_QUESTS}
      presets={PROPORTIONS_PRESETS}
      currentState={state}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      controlPanel={
        <ControlPanel
          state={state}
          onChange={handleStateChange}
          onSpin={handleSpin}
          onResetStats={handleResetStats}
        />
      }
    >
      <div className="w-full h-full flex flex-col justify-center items-center">
        {state.mode === 'direct' || state.mode === 'inverse' ? (
          <ProportionsCanvas
            mode={state.mode}
            k={state.k}
            a={state.a}
            testX={state.mode === 'direct' ? state.testDirectX : state.testInverseX}
            isDark={isDark}
          />
        ) : state.mode === 'sqrt' ? (
          <SquareRootCanvas area={state.squareArea} isDark={isDark} />
        ) : (
          <ProbabilitySpinnerCanvas
            slices={state.slices}
            stats={state.stats}
            currentSliceId={state.currentSliceId}
            isSpinning={state.isSpinning}
            isDark={isDark}
            rotationDeg={rotationDeg}
          />
        )}
      </div>
    </SandboxLayout>
  );
}
