import React from 'react';
import { OpticsAudioState, MirrorType, WaveformType } from './types';
import { calculateOptics, calculateSound } from './opticsAudioEngine';
import { 
  Sun, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Eye, 
  RotateCcw, 
  Radio, 
  Activity, 
  Zap, 
  Check 
} from 'lucide-react';

interface ControlPanelProps {
  state: OpticsAudioState;
  onChange: (patch: Partial<OpticsAudioState>) => void;
  onTogglePlaySound: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  onChange,
  onTogglePlaySound,
}) => {
  const optics = calculateOptics(state.incidentAngleDeg, state.mirrorType, state.n1, state.n2);
  const sound = calculateSound(state.frequency, state.amplitude);

  const colors = [
    { label: 'Đỏ', hex: '#ef4444' },
    { label: 'Lục', hex: '#22c55e' },
    { label: 'Lam', hex: '#3b82f6' },
    { label: 'Vàng', hex: '#eab308' },
    { label: 'Trắng', hex: '#ffffff' },
  ];

  return (
    <div className="flex flex-col gap-5 p-4 text-sm select-none">
      {/* Chọn Tab Chế độ học */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium text-xs">
        <button
          onClick={() => onChange({ activeTab: 'optics' })}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
            state.activeTab === 'optics'
              ? 'bg-white dark:bg-slate-700 text-sky-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Quang học phản xạ</span>
        </button>
        <button
          onClick={() => onChange({ activeTab: 'sound' })}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
            state.activeTab === 'sound'
              ? 'bg-white dark:bg-slate-700 text-sky-500 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Dao động âm thanh</span>
        </button>
      </div>

      {state.activeTab === 'optics' ? (
        /* ================= TAB QUANG HỌC ================= */
        <div className="flex flex-col gap-4">
          {/* Loại gương / Môi trường */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Dụng cụ quang học
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'plane', label: 'Gương phẳng' },
                { id: 'concave', label: 'Gương cầu lõm' },
                { id: 'convex', label: 'Gương cầu lồi' },
                { id: 'refraction', label: 'Mặt nước (Khúc xạ)' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => onChange({ mirrorType: item.id as MirrorType })}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    state.mirrorType === item.id
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-semibold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Slider Góc tới i */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Góc tới (i):
              </span>
              <span className="font-mono text-sm font-bold text-sky-500">
                {Math.abs(state.incidentAngleDeg)}° {state.incidentAngleDeg < 0 ? '(Trái)' : state.incidentAngleDeg > 0 ? '(Phải)' : '(Chính giữa)'}
              </span>
            </div>
            <input
              type="range"
              min="-80"
              max="80"
              step="1"
              value={state.incidentAngleDeg}
              onChange={e => onChange({ incidentAngleDeg: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            {/* Quick buttons */}
            <div className="flex gap-1.5 mt-2">
              {[0, 30, 45, 60].map(deg => (
                <button
                  key={deg}
                  onClick={() => onChange({ incidentAngleDeg: deg })}
                  className="flex-1 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-mono text-slate-600 dark:text-slate-300"
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>

          {/* Chọn màu tia sáng laser */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Màu tia sáng Laser
            </label>
            <div className="flex items-center gap-2">
              {colors.map(c => (
                <button
                  key={c.hex}
                  onClick={() => onChange({ lightColor: c.hex })}
                  style={{ backgroundColor: c.hex }}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    state.lightColor === c.hex ? 'scale-125 border-sky-500 ring-2 ring-sky-300' : 'border-slate-300 dark:border-slate-600'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Công suất Laser */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Cường độ sáng (Power):
              </span>
              <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                {state.laserPower}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={state.laserPower}
              onChange={e => onChange({ laserPower: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          {/* Tùy chọn hiển thị */}
          <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={state.showNormal}
                onChange={e => onChange({ showNormal: e.target.checked })}
                className="rounded text-sky-500 focus:ring-sky-400"
              />
              <span>Pháp tuyến vuông góc (N)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={state.showProtractor}
                onChange={e => onChange({ showProtractor: e.target.checked })}
                className="rounded text-sky-500 focus:ring-sky-400"
              />
              <span>Thước đo độ ảo (Protractor / Goniometer)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={state.showAngles}
                onChange={e => onChange({ showAngles: e.target.checked })}
                className="rounded text-sky-500 focus:ring-sky-400"
              />
              <span>Ghi nhãn và số đo góc i, i'</span>
            </label>
          </div>

          {/* Bảng kết quả tính toán quang học */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Góc tới i:</span>
              <span className="font-mono font-bold text-sky-500">{Math.abs(state.incidentAngleDeg)}°</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Góc phản xạ i':</span>
              <span className="font-mono font-bold text-emerald-500">{optics.reflectionAngleDeg}°</span>
            </div>
            {state.mirrorType === 'refraction' && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Góc khúc xạ r:</span>
                <span className="font-mono font-bold text-purple-500">
                  {optics.refractionAngleDeg !== null ? `${optics.refractionAngleDeg}°` : 'Phản xạ toàn phần'}
                </span>
              </div>
            )}
            <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-200 dark:border-slate-700">
              {state.mirrorType === 'plane'
                ? 'Định luật phản xạ: Góc phản xạ luôn bằng góc tới (i\' = i).'
                : state.mirrorType === 'concave'
                ? 'Gương cầu lõm làm chùm tia sáng song song hội tụ tại tiêu điểm.'
                : state.mirrorType === 'convex'
                ? 'Gương cầu lồi cho trường nhìn rộng hơn, tạo ảnh ảo nhỏ hơn vật.'
                : 'Định luật khúc xạ ánh sáng (Snell-Descartes): n₁·sin(i) = n₂·sin(r).'}
            </div>
          </div>
        </div>
      ) : (
        /* ================= TAB ÂM THANH ================= */
        <div className="flex flex-col gap-4">
          {/* Nút Play/Pause Audio */}
          <button
            onClick={onTogglePlaySound}
            className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all ${
              state.isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25 ring-2 ring-rose-400'
                : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow-sky-500/25'
            }`}
          >
            {state.isPlaying ? (
              <>
                <VolumeX className="w-5 h-5 animate-pulse" />
                <span>Dừng âm thanh</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                <span>Phát âm thanh (Web Audio API)</span>
              </>
            )}
          </button>

          {/* Tần số f (Hz) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tần số (Độ cao của âm):
              </span>
              <span className="font-mono text-sm font-bold text-sky-500">
                {state.frequency} Hz
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="10"
              value={state.frequency}
              onChange={e => onChange({ frequency: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            {/* Quick buttons */}
            <div className="flex gap-1.5 mt-2">
              <button
                onClick={() => onChange({ frequency: 120 })}
                className="flex-1 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                120Hz (Trầm)
              </button>
              <button
                onClick={() => onChange({ frequency: 440 })}
                className="flex-1 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                440Hz (A4)
              </button>
              <button
                onClick={() => onChange({ frequency: 1200 })}
                className="flex-1 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                1200Hz (Bổng)
              </button>
            </div>
          </div>

          {/* Biên độ A (%) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Biên độ (Độ to của âm):
              </span>
              <span className="font-mono text-sm font-bold text-indigo-500">
                {state.amplitude}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={state.amplitude}
              onChange={e => onChange({ amplitude: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Dạng sóng */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Dạng sóng âm (Âm sắc)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sine', label: 'Sin thuần' },
                { id: 'triangle', label: 'Tam giác' },
                { id: 'square', label: 'Sóng vuông' },
              ].map(w => (
                <button
                  key={w.id}
                  onClick={() => onChange({ waveform: w.id as WaveformType })}
                  className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-all ${
                    state.waveform === w.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle hạt không khí */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 pt-1">
            <input
              type="checkbox"
              checked={state.showParticles}
              onChange={e => onChange({ showParticles: e.target.checked })}
              className="rounded text-sky-500 focus:ring-sky-400"
            />
            <span>Mô phỏng dao động hạt không khí (Sóng dọc)</span>
          </label>

          {/* Thống kê đặc tính âm thanh */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Phân loại âm:</span>
              <span className="font-semibold text-emerald-500">{sound.pitchNameVi}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Chu kỳ dao động T:</span>
              <span className="font-mono font-medium text-slate-700 dark:text-slate-200">{sound.periodMs} ms</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Bước sóng λ (v = 343 m/s):</span>
              <span className="font-mono font-medium text-slate-700 dark:text-slate-200">{sound.wavelengthM} m</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Mức áp suất âm ước lượng:</span>
              <span className="font-mono font-medium text-slate-700 dark:text-slate-200">~{sound.estimatedDecibels} dB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
