export type GeographyMode = 'seasons-orbit' | 'day-night-rotation';

export interface GeoEarthState {
  mode: GeographyMode;
  // Orbit around Sun (0 to 360 degrees)
  orbitAngleDeg: number; // 0 = Xuân phân (21/3), 90 = Hạ chí (22/6), 180 = Thu phân (23/9), 270 = Đông chí (22/12)
  isOrbiting: boolean;
  orbitSpeed: number; // multiplier
  // Day & Night axial rotation (0 to 24 hours)
  rotationHour: number; // 0 to 24
  isRotating: boolean;
  // Overlays
  showTropics: boolean; // Chí tuyến Bắc (23.5°N) & Nam (23.5°S)
  showEquator: boolean; // Xích đạo 0°
  showTerminator: boolean; // Vạch sáng - tối
}
