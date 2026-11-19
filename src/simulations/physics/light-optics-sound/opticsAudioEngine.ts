import { OpticsCalculations, SoundCalculations, WaveformType } from './types';

/**
 * Tính toán các thông số quang học phản xạ & khúc xạ
 */
export function calculateOptics(
  incidentAngleDeg: number,
  mirrorType: 'plane' | 'concave' | 'convex' | 'refraction',
  n1: number = 1.0,
  n2: number = 1.33
): OpticsCalculations {
  const absI = Math.abs(incidentAngleDeg);
  const reflectionAngleDeg = absI;

  let refractionAngleDeg: number | null = null;
  let isTotalInternalReflection = false;
  let criticalAngleDeg: number | null = null;

  if (mirrorType === 'refraction') {
    const radI = (absI * Math.PI) / 180;
    const sinR = (n1 / n2) * Math.sin(radI);

    if (n1 > n2) {
      criticalAngleDeg = Number(((Math.asin(n2 / n1) * 180) / Math.PI).toFixed(1));
    }

    if (sinR > 1.0) {
      isTotalInternalReflection = true;
      refractionAngleDeg = null;
    } else {
      isTotalInternalReflection = false;
      const radR = Math.asin(sinR);
      refractionAngleDeg = Number(((radR * 180) / Math.PI).toFixed(1));
    }
  }

  const deviationAngleDeg =
    refractionAngleDeg !== null
      ? Number(Math.abs(absI - refractionAngleDeg).toFixed(1))
      : Number((180 - 2 * absI).toFixed(1));

  return {
    reflectionAngleDeg,
    refractionAngleDeg,
    isTotalInternalReflection,
    criticalAngleDeg,
    deviationAngleDeg,
  };
}

/**
 * Tính toán thông số vật lý của sóng âm
 */
export function calculateSound(
  frequency: number,
  amplitude: number
): SoundCalculations {
  const speedOfSound = 343; // m/s ở 20 độ C
  const periodMs = Number(((1 / frequency) * 1000).toFixed(2));
  const wavelengthM = Number((speedOfSound / frequency).toFixed(3));
  
  // Tính độ to xấp xỉ theo thang decibel (dB)
  const normAmp = Math.max(0.01, amplitude / 100);
  const estimatedDecibels = Math.round(20 * Math.log10(normAmp) + 75);

  let pitchCategory: 'bass' | 'mid' | 'treble' = 'mid';
  let pitchNameVi = 'Âm trung (Midtone)';
  let pitchNameEn = 'Midtone Pitch';

  if (frequency < 250) {
    pitchCategory = 'bass';
    pitchNameVi = 'Âm trầm (Bass / Độ cao thấp)';
    pitchNameEn = 'Bass (Low Pitch)';
  } else if (frequency > 1000) {
    pitchCategory = 'treble';
    pitchNameVi = 'Âm bổng (Treble / Độ cao lớn)';
    pitchNameEn = 'Treble (High Pitch)';
  }

  return {
    speedOfSound,
    periodMs,
    wavelengthM,
    estimatedDecibels,
    pitchCategory,
    pitchNameVi,
    pitchNameEn,
  };
}

/**
 * Trình quản lý Web Audio API để phát âm thanh thực tế trong trình duyệt
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private isRunning: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  start(frequency: number, amplitude: number, waveform: WaveformType = 'sine') {
    try {
      this.initContext();
      if (!this.ctx) return;

      this.stop();

      this.osc = this.ctx.createOscillator();
      this.gain = this.ctx.createGain();

      this.osc.type = waveform;
      this.osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      const targetGain = (amplitude / 100) * 0.25; // An toàn âm lượng, không bị rè loa
      this.gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.gain.gain.exponentialRampToValueAtTime(Math.max(0.001, targetGain), this.ctx.currentTime + 0.05);

      this.osc.connect(this.gain);
      this.gain.connect(this.ctx.destination);

      this.osc.start();
      this.isRunning = true;
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  update(frequency: number, amplitude: number, waveform: WaveformType = 'sine') {
    if (!this.isRunning || !this.ctx || !this.osc || !this.gain) return;
    try {
      this.osc.frequency.setTargetAtTime(frequency, this.ctx.currentTime, 0.03);
      this.osc.type = waveform;
      const targetGain = (amplitude / 100) * 0.25;
      this.gain.gain.setTargetAtTime(Math.max(0.0001, targetGain), this.ctx.currentTime, 0.03);
    } catch (e) {
      console.warn('Audio update error:', e);
    }
  }

  stop() {
    if (this.gain && this.ctx && this.isRunning) {
      try {
        this.gain.gain.setValueAtTime(this.gain.gain.value, this.ctx.currentTime);
        this.gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);
        setTimeout(() => {
          if (this.osc) {
            try { this.osc.stop(); } catch {}
            try { this.osc.disconnect(); } catch {}
            this.osc = null;
          }
          this.isRunning = false;
        }, 60);
      } catch {
        this.isRunning = false;
      }
    } else {
      this.isRunning = false;
    }
  }
}

export const soundEngine = new SoundEngine();
