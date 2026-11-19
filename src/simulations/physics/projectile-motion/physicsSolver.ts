export interface ProjectileParams {
  v0: number;          // Vận tốc ban đầu (m/s)
  angleDeg: number;    // Góc ném (độ, 0 - 90)
  y0: number;          // Độ cao ban đầu (m)
  g: number;           // Gia tốc trọng trường (m/s^2)
  m: number;           // Khối lượng vật (kg)
  dragCoeff: number;   // Hệ số lực cản không khí k (kg/m hoặc hệ số thực nghiệm, 0 = không cản)
}

export interface TrajectoryPoint {
  t: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  ke: number;          // Động năng Wd = 0.5 * m * v^2
  pe: number;          // Thế năng Wt = m * g * y
  te: number;          // Cơ năng W = Wd + Wt
}

export interface TrajectorySummary {
  maxHeight: number;       // H_max (m)
  maxRange: number;        // Tầm xa L_max (m)
  flightTime: number;      // Thời gian bay t_flight (s)
  apexTime: number;        // Thời gian đạt đỉnh (s)
  impactSpeed: number;     // Vận tốc khi chạm đất (m/s)
  impactAngleDeg: number;  // Góc chạm đất (độ)
  isIdeal: boolean;        // Không có lực cản
  path: TrajectoryPoint[]; // Danh sách các điểm trên quỹ đạo
}

export const GRAVITY_PRESETS = [
  { id: 'earth', name: 'Trái Đất (9.8 m/s²)', g: 9.80665, color: '#38bdf8' },
  { id: 'moon', name: 'Mặt Trăng (1.62 m/s²)', g: 1.62, color: '#cbd5e1' },
  { id: 'mars', name: 'Sao Hỏa (3.72 m/s²)', g: 3.72, color: '#f87171' },
  { id: 'jupiter', name: 'Sao Mộc (24.79 m/s²)', g: 24.79, color: '#fb923c' },
];

/**
 * Tính toán giải tích chính xác khi KHÔNG CÓ LỰC CẢN (Chân không)
 */
export function solveAnalyticalTrajectory(params: ProjectileParams): TrajectorySummary {
  const { v0, angleDeg, y0, g, m } = params;
  const rad = (angleDeg * Math.PI) / 180;
  const vx0 = v0 * Math.cos(rad);
  const vy0 = v0 * Math.sin(rad);

  // Thời gian lên đến đỉnh cao nhất: vy(t_apex) = 0 => t_apex = vy0 / g
  const apexTime = vy0 / g;
  // Tầm cao cực đại: H_max = y0 + vy0^2 / (2g)
  const maxHeight = y0 + (vy0 * vy0) / (2 * g);

  // Thời gian bay cho đến khi chạm đất y(t) = 0: y0 + vy0*t - 0.5*g*t^2 = 0
  // 0.5*g*t^2 - vy0*t - y0 = 0
  const discriminant = vy0 * vy0 + 2 * g * y0;
  const flightTime = (vy0 + Math.sqrt(Math.max(0, discriminant))) / g;

  // Tầm xa bay: L_max = vx0 * flightTime
  const maxRange = vx0 * flightTime;

  // Tạo mẫu các điểm trên quỹ đạo (120 bước mẫu đều đặn)
  const path: TrajectoryPoint[] = [];
  const steps = 140;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * flightTime;
    const x = vx0 * t;
    const y = Math.max(0, y0 + vy0 * t - 0.5 * g * t * t);
    const vx = vx0;
    const vy = vy0 - g * t;
    const speed = Math.sqrt(vx * vx + vy * vy);
    const ke = 0.5 * m * speed * speed;
    const pe = m * g * y;
    const te = ke + pe;

    path.push({ t, x, y, vx, vy, speed, ke, pe, te });
  }

  const vyImpact = vy0 - g * flightTime;
  const impactSpeed = Math.sqrt(vx0 * vx0 + vyImpact * vyImpact);
  const impactAngleDeg = (Math.atan2(Math.abs(vyImpact), Math.abs(vx0)) * 180) / Math.PI;

  return {
    maxHeight,
    maxRange,
    flightTime,
    apexTime,
    impactSpeed,
    impactAngleDeg,
    isIdeal: true,
    path,
  };
}

/**
 * Tích phân số RK4 (Runge-Kutta bậc 4) giải phương trình vi phân khi CÓ LỰC CẢN KHÔNG KHÍ
 * m * dvx/dt = -k * |v| * vx
 * m * dvy/dt = -m*g - k * |v| * vy
 */
export function solveDragTrajectory(params: ProjectileParams): TrajectorySummary {
  const { v0, angleDeg, y0, g, m, dragCoeff } = params;

  if (dragCoeff <= 0.0001) {
    return solveAnalyticalTrajectory(params);
  }

  const rad = (angleDeg * Math.PI) / 180;
  let x = 0;
  let y = Math.max(0, y0);
  let vx = v0 * Math.cos(rad);
  let vy = v0 * Math.sin(rad);
  let t = 0;

  const dt = 0.004; // Bước thời gian vi phân 4ms đảm bảo độ chính xác cao
  let maxHeight = y;
  let apexTime = 0;
  let reachedApex = false;

  const path: TrajectoryPoint[] = [
    {
      t: 0,
      x,
      y,
      vx,
      vy,
      speed: v0,
      ke: 0.5 * m * v0 * v0,
      pe: m * g * y,
      te: 0.5 * m * v0 * v0 + m * g * y,
    },
  ];

  // Hàm tính gia tốc [ax, ay]
  const getAcc = (curVx: number, curVy: number) => {
    const v = Math.sqrt(curVx * curVx + curVy * curVy);
    const ax = -(dragCoeff / m) * v * curVx;
    const ay = -g - (dragCoeff / m) * v * curVy;
    return { ax, ay };
  };

  const maxSteps = 10000;
  let step = 0;

  while (y >= 0 && step < maxSteps) {
    step++;

    // RK4 step
    const k1_v = getAcc(vx, vy);
    const k1_x = vx;
    const k1_y = vy;

    const k2_vx = vx + 0.5 * dt * k1_v.ax;
    const k2_vy = vy + 0.5 * dt * k1_v.ay;
    const k2_v = getAcc(k2_vx, k2_vy);

    const k3_vx = vx + 0.5 * dt * k2_v.ax;
    const k3_vy = vy + 0.5 * dt * k2_v.ay;
    const k3_v = getAcc(k3_vx, k3_vy);

    const k4_vx = vx + dt * k3_v.ax;
    const k4_vy = vy + dt * k3_v.ay;
    const k4_v = getAcc(k4_vx, k4_vy);

    x += (dt / 6) * (k1_x + 2 * k2_vx + 2 * k3_vx + k4_vx);
    y += (dt / 6) * (k1_y + 2 * k2_vy + 2 * k3_vy + k4_vy);

    vx += (dt / 6) * (k1_v.ax + 2 * k2_v.ax + 2 * k3_v.ax + k4_v.ax);
    vy += (dt / 6) * (k1_v.ay + 2 * k2_v.ay + 2 * k3_v.ay + k4_v.ay);
    t += dt;

    if (y > maxHeight) {
      maxHeight = y;
    }

    if (!reachedApex && vy <= 0) {
      reachedApex = true;
      apexTime = t;
    }

    // Ghi lại điểm mẫu (mỗi 3 bước ghi 1 lần để tối ưu mảng)
    if (step % 3 === 0 || y <= 0) {
      const currentY = Math.max(0, y);
      const speed = Math.sqrt(vx * vx + vy * vy);
      const ke = 0.5 * m * speed * speed;
      const pe = m * g * currentY;
      const te = ke + pe;

      path.push({
        t,
        x,
        y: currentY,
        vx,
        vy,
        speed,
        ke,
        pe,
        te,
      });
    }

    if (y <= 0) break;
  }

  const lastPt = path[path.length - 1];
  const maxRange = lastPt.x;
  const flightTime = lastPt.t;
  const impactSpeed = lastPt.speed;
  const impactAngleDeg = (Math.atan2(Math.abs(lastPt.vy), Math.abs(lastPt.vx)) * 180) / Math.PI;

  return {
    maxHeight,
    maxRange,
    flightTime,
    apexTime: apexTime || flightTime / 2,
    impactSpeed,
    impactAngleDeg,
    isIdeal: false,
    path,
  };
}

/**
 * Lấy trạng thái tức thời tại thời điểm t
 */
export function sampleTrajectoryAtTime(summary: TrajectorySummary, t: number): TrajectoryPoint {
  const { path, flightTime } = summary;
  if (!path || path.length === 0) {
    return { t: 0, x: 0, y: 0, vx: 0, vy: 0, speed: 0, ke: 0, pe: 0, te: 0 };
  }

  if (t <= 0) return path[0];
  if (t >= flightTime) return path[path.length - 1];

  // Tìm kiếm nhị phân hoặc xấp xỉ tỉ lệ
  const ratio = t / flightTime;
  const approxIndex = Math.min(path.length - 1, Math.floor(ratio * (path.length - 1)));

  // Nội suy tuyến tính giữa 2 điểm lân cận
  for (let i = Math.max(0, approxIndex - 2); i < path.length - 1; i++) {
    if (path[i].t <= t && path[i + 1].t >= t) {
      const p1 = path[i];
      const p2 = path[i + 1];
      const factor = (t - p1.t) / (p2.t - p1.t || 1e-6);

      const x = p1.x + factor * (p2.x - p1.x);
      const y = Math.max(0, p1.y + factor * (p2.y - p1.y));
      const vx = p1.vx + factor * (p2.vx - p1.vx);
      const vy = p1.vy + factor * (p2.vy - p1.vy);
      const speed = Math.sqrt(vx * vx + vy * vy);
      const ke = p1.ke + factor * (p2.ke - p1.ke);
      const pe = p1.pe + factor * (p2.pe - p1.pe);
      const te = p1.te + factor * (p2.te - p1.te);

      return { t, x, y, vx, vy, speed, ke, pe, te };
    }
  }

  return path[approxIndex];
}
