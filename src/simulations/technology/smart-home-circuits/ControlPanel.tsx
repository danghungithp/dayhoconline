import React from 'react';
import { SmartHomeState } from './types';
import { calculateSmartHomeMetrics } from './smartHomeEngine';
import { CustomQuestItem } from '../../../types/simulation.types';
import { Home, Cpu, Sun, Moon, Thermometer, UserCheck, Zap, Sparkles, CheckCircle, Circle } from 'lucide-react';

interface ControlPanelProps {
  state: SmartHomeState;
  onChange: (patch: Partial<SmartHomeState>) => void;
  quests: CustomQuestItem[];
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange, quests }) => {
  const metrics = calculateSmartHomeMetrics(state);

  return (
    <div className="flex flex-col gap-4 text-xs font-sans">
      {/* 1. Chọn chế độ xem */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
        <button
          onClick={() => onChange({ viewMode: 'house-view' })}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-bold transition-all ${
            state.viewMode === 'house-view'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          Mô hình Nhà 2D
        </button>

        <button
          onClick={() => onChange({ viewMode: 'schematic-view' })}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-bold transition-all ${
            state.viewMode === 'schematic-view'
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          Sơ đồ mạch điện tử
        </button>
      </div>

      {/* 2. Điều khiển Môi trường thời gian thực */}
      <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="font-bold text-slate-300">Chế độ điều khiển tự động:</span>
          <button
            onClick={() => onChange({ isAutoMode: !state.isAutoMode })}
            className={`px-3 py-1 rounded-lg font-bold border transition-all ${
              state.isAutoMode
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {state.isAutoMode ? 'TỰ ĐỘNG (SMART)' : 'THỦ CÔNG'}
          </button>
        </div>

        {/* Thanh trượt Ánh sáng Lux (LDR) */}
        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              {state.ambientLightLux < 200 ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              Ánh sáng môi trường (Lux):
            </span>
            <span className="font-mono font-bold text-amber-400">{state.ambientLightLux} Lux</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="20"
            value={state.ambientLightLux}
            onChange={(e) => onChange({ ambientLightLux: parseInt(e.target.value) })}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>0 Lux (Đêm tối)</span>
            <span>200 Lux (Hoàng hôn)</span>
            <span>1000 Lux (Nắng gắt)</span>
          </div>
        </div>

        {/* Thanh trượt Nhiệt độ */}
        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
              Nhiệt độ phòng (°C):
            </span>
            <span className="font-mono font-bold text-rose-400">{state.temperatureC} °C</span>
          </div>
          <input
            type="range"
            min="20"
            max="45"
            value={state.temperatureC}
            onChange={(e) => onChange({ temperatureC: parseInt(e.target.value) })}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>20°C (Mát mẻ)</span>
            <span>32°C (Ngưỡng bật quạt)</span>
            <span>45°C (Rất nóng)</span>
          </div>
        </div>

        {/* Nút bấm Cảm biến PIR phát hiện người */}
        <div className="border-t border-slate-800 pt-2">
          <button
            onClick={() => onChange({ motionDetected: !state.motionDetected })}
            className={`w-full py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
              state.motionDetected
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            {state.motionDetected ? 'PIR: PHÁT HIỆN NGƯỜI (CỬA MỞ)' : 'PIR: KHÔNG CÓ CHUYỂN ĐỘNG'}
          </button>
        </div>
      </div>

      {/* 3. Bảng chỉ số kỹ thuật */}
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
        <div className="text-slate-400 border-b border-slate-800 pb-1 flex justify-between font-bold">
          <span>THÔNG SỐ MẠCH ĐIỀU KHIỂN</span>
          <span className="text-cyan-400">GDPT 2018</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div>
            <span className="text-slate-500">Điện trở LDR:</span>
            <div className="text-white font-bold">{metrics.ldrResistanceKohm} kΩ</div>
          </div>
          <div>
            <span className="text-slate-500">Điện áp V_out:</span>
            <div className="text-cyan-300 font-bold">{metrics.sensorVoltageV} V</div>
          </div>
          <div>
            <span className="text-slate-500">Trạng thái Rơ-le:</span>
            <div className={`font-bold ${metrics.relayState === 'CLOSED' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {metrics.relayState}
            </div>
          </div>
          <div>
            <span className="text-slate-500">Công suất:</span>
            <div className="text-amber-400 font-bold">{metrics.totalEnergyWatts} Watt</div>
          </div>
        </div>
      </div>

      {/* 4. Nhiệm vụ học tập (Quests) */}
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
