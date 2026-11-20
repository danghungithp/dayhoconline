import React, { useEffect, useState } from 'react';
import { DcCircuitState } from './types';
import { calculateCircuitMetrics } from './circuitEngine';
import { CustomQuestItem } from '../../../types/simulation.types';
import { Zap, Play, RotateCcw, CheckCircle, Circle, Gauge, Power, ShieldAlert, Sparkles } from 'lucide-react';

interface ControlPanelProps {
  state: DcCircuitState;
  onChange: (patch: Partial<DcCircuitState>) => void;
  quests: CustomQuestItem[];
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange, quests }) => {
  const metrics = calculateCircuitMetrics(state);
  const [autoOscillate, setAutoOscillate] = useState(false);

  // Auto oscillate magnet in induction mode
  useEffect(() => {
    if (!autoOscillate || state.mode !== 'electromagnetic-induction') return;

    let dir = 1;
    let pos = state.magnetPositionX;
    const interval = setInterval(() => {
      pos += dir * 12;
      if (pos > 160) {
        pos = 160;
        dir = -1;
      } else if (pos < -160) {
        pos = -160;
        dir = 1;
      }
      onChange({
        magnetPositionX: pos,
        magnetVelocity: dir * 60,
      });
    }, 40);

    return () => clearInterval(interval);
  }, [autoOscillate, state.mode, onChange]);

  return (
    <div className="flex flex-col gap-4 text-xs font-sans">
      {/* 1. Chọn chế độ thí nghiệm */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
        <button
          onClick={() => {
            setAutoOscillate(false);
            onChange({ mode: 'ohm-dc' });
          }}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-bold transition-all ${
            state.mode === 'ohm-dc'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Mạch DC & Định luật Ôm
        </button>

        <button
          onClick={() => onChange({ mode: 'electromagnetic-induction' })}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-bold transition-all ${
            state.mode === 'electromagnetic-induction'
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          Cảm ứng Điện từ
        </button>
      </div>

      {state.mode === 'ohm-dc' ? (
        /* ==================================================================== */
        /* CONTROLS CHO MẠCH ĐIỆN MỘT CHIỀU                                    */
        /* ==================================================================== */
        <div className="space-y-4">
          {/* Nút Đóng / Mở khóa K */}
          <button
            onClick={() => onChange({ switchClosed: !state.switchClosed })}
            className={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
              state.switchClosed
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/25 shadow-lg shadow-emerald-500/10'
                : 'bg-rose-500/15 border-rose-500/50 text-rose-400 hover:bg-rose-500/25'
            }`}
          >
            <Power className="w-4 h-4" />
            {state.switchClosed ? 'KHÓA K ĐANG ĐÓNG (MẠCH KÍN)' : 'KHÓA K ĐANG MỞ (NGẮT MẠCH)'}
          </button>

          {/* Chọn kiểu mắc mạch */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Kiểu mắc điện trở:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChange({ connection: 'series' })}
                className={`py-1.5 px-3 rounded-lg font-semibold border ${
                  state.connection === 'series'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Nối tiếp (Rtd = R1 + R2)
              </button>
              <button
                onClick={() => onChange({ connection: 'parallel' })}
                className={`py-1.5 px-3 rounded-lg font-semibold border ${
                  state.connection === 'parallel'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Song song (1/Rtd = 1/R1 + 1/R2)
              </button>
            </div>
          </div>

          {/* Thanh trượt điều chỉnh nguồn & điện trở */}
          <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Hiệu điện thế nguồn (U):</span>
                <span className="font-mono font-bold text-amber-400">{state.voltage} V</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="0.5"
                value={state.voltage}
                onChange={(e) => onChange({ voltage: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Điện trở R1:</span>
                <span className="font-mono font-bold text-cyan-400">{state.resistance1} Ω</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={state.resistance1}
                onChange={(e) => onChange({ resistance1: parseInt(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Điện trở R2 (Bóng đèn):</span>
                <span className="font-mono font-bold text-purple-400">{state.resistance2} Ω</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={state.resistance2}
                onChange={(e) => onChange({ resistance2: parseInt(e.target.value) })}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Bảng số liệu đo lường thời gian thực */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono">
            <div className="text-[11px] font-bold text-slate-400 border-b border-slate-800 pb-1 flex justify-between">
              <span>THÔNG SỐ ĐO THỜI GIAN THỰC</span>
              <span className="text-cyan-400">ĐỊNH LUẬT ÔM</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500">R tương đương:</span>
                <div className="text-white font-bold">{metrics.equivalentResistance} Ω</div>
              </div>
              <div>
                <span className="text-slate-500">Dòng điện tổng I:</span>
                <div className="text-emerald-400 font-bold">{metrics.totalCurrent} A</div>
              </div>
              <div>
                <span className="text-slate-500">U1 / U2:</span>
                <div className="text-cyan-300">{metrics.voltage1}V / {metrics.voltage2}V</div>
              </div>
              <div>
                <span className="text-slate-500">Công suất P = U*I:</span>
                <div className="text-amber-400 font-bold">{metrics.totalPower} W</div>
              </div>
            </div>

            {metrics.isBulbBlown && (
              <div className="p-2 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-lg flex items-center gap-1.5 text-[11px]">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Cảnh báo: Hiệu điện thế quá cao làm cháy bóng đèn! Hãy giảm U hoặc tăng R.</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ==================================================================== */
        /* CONTROLS CHO THÍ NGHIỆM CẢM ỨNG ĐIỆN TỪ                             */
        /* ==================================================================== */
        <div className="space-y-4">
          <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Số vòng dây cuộn cảm (N):</span>
                <span className="font-mono font-bold text-amber-400">{state.coilTurns} vòng</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[200, 500, 1000].map((turns) => (
                  <button
                    key={turns}
                    onClick={() => onChange({ coilTurns: turns })}
                    className={`py-1 rounded font-bold border ${
                      state.coilTurns === turns
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {turns}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Cường độ từ trường nam châm (B):</span>
                <span className="font-mono font-bold text-cyan-400">{state.magnetStrength} Tesla (rel)</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={state.magnetStrength}
                onChange={(e) => onChange({ magnetStrength: parseInt(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Vị trí nam châm X:</span>
                <span className="font-mono text-purple-400">{state.magnetPositionX} px</span>
              </div>
              <input
                type="range"
                min="-200"
                max="200"
                value={state.magnetPositionX}
                onChange={(e) => {
                  const newX = parseInt(e.target.value);
                  const v = (newX - state.magnetPositionX) * 10;
                  onChange({ magnetPositionX: newX, magnetVelocity: v });
                }}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <button
              onClick={() => setAutoOscillate(!autoOscillate)}
              className={`w-full py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                autoOscillate
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              {autoOscillate ? 'Dừng dao động tự động' : 'Tự động dịch chuyển nam châm liên tục'}
            </button>
          </div>

          {/* Bảng chỉ số cảm ứng */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono">
            <div className="text-[11px] font-bold text-slate-400 border-b border-slate-800 pb-1 flex justify-between">
              <span>ĐỊNH LUẬT FARADAY & LENZ</span>
              <span className="text-indigo-400">ec = -N·(dΦ/dt)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500">Từ thông Φ:</span>
                <div className="text-amber-400 font-bold">{metrics.flux} Wb</div>
              </div>
              <div>
                <span className="text-slate-500">Suất điện động ec:</span>
                <div className="text-cyan-400 font-bold">{metrics.inducedEmf} V</div>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">Dòng cảm ứng qua điện kế:</span>
                <div className={`text-base font-bold ${metrics.inducedCurrent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {metrics.inducedCurrent} mA ({metrics.inducedCurrent > 0 ? 'Lệch phải' : metrics.inducedCurrent < 0 ? 'Lệch trái' : 'Về 0'})
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Nhiệm vụ học tập (Quests) */}
      <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Nhiệm vụ Thí nghiệm ({quests.filter((q) => q.targetCondition(state)).length}/{quests.length})</span>
        </div>
        <div className="space-y-1.5">
          {quests.map((q) => {
            const completed = q.targetCondition(state);
            return (
              <div
                key={q.id}
                className={`p-2 rounded-lg border transition-all ${
                  completed
                    ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {completed ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span>{q.title}</span>
                  </div>
                  <span className="text-amber-400 font-mono">+{q.xpReward} XP</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 pl-5">{q.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
