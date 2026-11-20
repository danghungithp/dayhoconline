/**
 * STEM & English Interactive Lab
 * Core Type Definitions & Simulation Architecture
 * Aligned with Vietnam GDPT (General Education Program) Grades 6-12
 */

export type SchoolLevel = 'THCS' | 'THPT';

export type GradeLevel = 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type SubjectId = 
  | 'toan'       // Toán học (Đại số, Giải tích, Thống kê)
  | 'hinh-hoc'   // Hình học phẳng & Không gian 3D
  | 'khtn'       // Khoa học Tự nhiên (THCS: Lý - Hóa - Sinh tích hợp)
  | 'vat-ly'     // Vật lý (THPT)
  | 'hoa-hoc'    // Hóa học (THPT & Hóa chuyên sâu THCS)
  | 'sinh-hoc'   // Sinh học (Di truyền, Tế bào, Sinh thái)
  | 'tin-hoc'    // Tin học (Nhị phân, Thuật toán, Cổng Logic, Lập trình)
  | 'dia-ly'     // Địa lý (Trái Đất, Khí hậu, Bản đồ, Kinh tế - Xã hội)
  | 'lich-su'    // Lịch sử (Tiến trình lịch sử Việt Nam & Thế giới)
  | 'cong-nghe'  // Công nghệ & STEM Engineering
  | 'gdkt-pl'    // Giáo dục Kinh tế & Pháp luật
  | 'tieng-anh';  // Tiếng Anh (Ngữ pháp trực quan, Giao tiếp, Phát âm)

export type SimulationTechnology = 
  | 'canvas2d'   // Canvas 2D / 60 FPS requestAnimationFrame
  | 'three3d'    // Three.js / R3F / Không gian 3D / Phân tử
  | 'graph'      // Đồ thị hàm số, Mafs / JSXGraph / MathJS
  | 'speech-ai'; // Web Speech API & Phân tích ngôn ngữ AI

export interface Quest {
  id: string;
  title: string;
  description: string;
  hint?: string;
  targetCondition: (state: any) => boolean;
  completed?: boolean;
  xpReward: number;
}

export interface PresetState<T = any> {
  id: string;
  name: string;
  description: string;
  state: T;
}

export interface SimulationMetadata {
  id: string;
  title: string;
  titleEn: string;
  subject: SubjectId;
  grade: GradeLevel;
  level: SchoolLevel;
  topic: string;
  description: string;
  curriculumCode: string; // e.g. "GDPT2018-HOA10-B1"
  difficulty: 'Cơ bản' | 'Khá' | 'Nâng cao';
  estimatedMinutes: number;
  tags: string[];
  technology: SimulationTechnology;
  isImplemented: boolean;
  component?: React.LazyExoticComponent<React.ComponentType<any>>;
}

export interface AnnotationPoint {
  x: number;
  y: number;
}

export interface AnnotationPath {
  id: string;
  points: AnnotationPoint[];
  color: string;
  width: number;
}

export interface AISnapshotContext {
  simulationId: string;
  simulationTitle: string;
  subject: SubjectId;
  grade: GradeLevel;
  currentState: Record<string, any>;
  activeQuests: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  timestamp: number;
}

export interface UserStats {
  completedQuests: string[];
  totalXP: number;
  completedSimulations: string[];
}
