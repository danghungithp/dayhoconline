export type MirrorType = 'plane' | 'concave' | 'convex' | 'refraction';
export type WaveformType = 'sine' | 'square' | 'triangle';

export interface OpticsAudioState {
  // Tab chế độ học
  activeTab: 'optics' | 'sound';

  // Thông số quang học
  mirrorType: MirrorType;
  incidentAngleDeg: number; // Góc tới i (-80° đến 80°)
  lightColor: string;       // Mã màu hex tia sáng
  laserPower: number;       // Công suất 10 - 100%
  showNormal: boolean;      // Hiển thị pháp tuyến
  showProtractor: boolean;  // Hiển thị thước đo độ
  showAngles: boolean;      // Hiển thị số đo góc
  n1: number;               // Chiết suất môi trường 1 (mặc định 1.00 không khí)
  n2: number;               // Chiết suất môi trường 2 (1.33 nước, 1.5 thủy tinh, 2.42 kim cương)

  // Thông số âm thanh
  frequency: number;        // Tần số f (100 - 2000 Hz)
  amplitude: number;        // Biên độ A (0 - 100%)
  waveform: WaveformType;   // Dạng sóng
  isPlaying: boolean;       // Đang phát âm thanh hay dừng
  showParticles: boolean;   // Hiển thị dao động hạt không khí
}

export interface OpticsCalculations {
  reflectionAngleDeg: number;
  refractionAngleDeg: number | null; // null nếu phản xạ toàn phần
  isTotalInternalReflection: boolean;
  criticalAngleDeg: number | null;
  deviationAngleDeg: number;
}

export interface SoundCalculations {
  speedOfSound: number; // m/s (343 m/s ở 20°C)
  periodMs: number;     // T = 1/f (ms)
  wavelengthM: number;  // λ = v/f (m)
  estimatedDecibels: number; // dB xấp xỉ
  pitchCategory: 'bass' | 'mid' | 'treble';
  pitchNameVi: string;
  pitchNameEn: string;
}
