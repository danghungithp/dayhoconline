export type UserRole = 'admin' | 'teacher';

export type UserStatus = 'pending' | 'active' | 'locked';

export interface UserAccount {
  id: string;
  username: string;
  password: string; // Plaintext for demo/local storage purposes
  fullName: string;
  role: UserRole;
  email: string;
  phone?: string;
  subject?: string;
  gradeLevels?: number[];
  createdAt: string;
  isActive: boolean;
  status: UserStatus;
}

export interface TeacherRegistrationForm {
  fullName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  subject: string;
  gradeLevels?: number[];
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'essay';
  question: string;
  options?: string[]; // 4 lựa chọn A, B, C, D
  correctAnswer?: number; // Index 0..3 cho trắc nghiệm
  points: number; // Điểm số câu này (VD: 2.0)
  explanation?: string;
}

export interface CustomLesson {
  id: string;
  title: string;
  sourceUrl?: string;
  subject: string;
  grade: number;
  type: 'lesson' | 'lab' | 'both';
  theoryContent: string;
  labSteps: {
    step: number;
    title: string;
    instruction: string;
    targetSimId?: string;
  }[];
  quizQuestions: QuizQuestion[];
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface StudentSubmission {
  id: string;
  testId: string;
  studentName: string;
  studentEmail?: string;
  submittedAt: string;
  answers: Record<string, string | number>; // questionId -> answer
  autoScore: number; // Điểm trắc nghiệm tự động tính
  manualScore: number; // Điểm tự luận do giáo viên chấm
  totalScore: number; // Tổng điểm
  maxScore: number;
  teacherFeedback?: string; // Nhận xét của cô giáo
  isGraded: boolean; // Đã chấm xong chưa
}

export interface ClassroomTest {
  id: string;
  classroomId: string;
  title: string;
  description: string;
  durationMinutes: number;
  deadline?: string;
  associatedSimId?: string; // Link bài lab thực hành liên quan (nếu có)
  questions: QuizQuestion[];
  submissions: StudentSubmission[];
}

export interface VirtualClassroom {
  id: string;
  code: string; // Unique join code: e.g. STEM-8A1-4821
  name: string; // e.g. "Lớp 8A1 - KHTN Hóa học"
  subject: string;
  grade: number;
  teacherId: string;
  teacherName: string;
  description: string;
  createdAt: string;
  tests: ClassroomTest[];
}

export interface EmailLog {
  id: string;
  sentAt: string;
  senderName: string;
  recipients: string[];
  subject: string;
  content: string;
  itemType: 'lesson' | 'lab' | 'test' | 'classroom';
  itemTitle: string;
}
