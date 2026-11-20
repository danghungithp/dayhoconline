import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserAccount,
  CustomLesson,
  VirtualClassroom,
  ClassroomTest,
  StudentSubmission,
  EmailLog,
} from '../../types/admin.types';

export interface AdminStoreState {
  // Authentication
  currentUser: UserAccount | null;
  users: UserAccount[];

  // Lessons and labs
  customLessons: CustomLesson[];

  // Classrooms and tests
  classrooms: VirtualClassroom[];

  // Email logs
  emailLogs: EmailLog[];

  // Auth actions
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;

  // Teacher management actions
  createTeacher: (data: Omit<UserAccount, 'id' | 'role' | 'createdAt' | 'isActive'>) => boolean;
  toggleTeacherStatus: (teacherId: string) => void;

  // Lesson actions
  saveCustomLesson: (lesson: CustomLesson) => void;
  deleteCustomLesson: (lessonId: string) => void;

  // Classroom actions
  createClassroom: (data: {
    name: string;
    subject: string;
    grade: number;
    description: string;
    teacherId: string;
    teacherName: string;
  }) => VirtualClassroom;
  deleteClassroom: (classroomId: string) => void;
  getClassroomByCode: (code: string) => VirtualClassroom | undefined;

  // Test actions
  createTest: (
    classroomId: string,
    testData: Omit<ClassroomTest, 'id' | 'classroomId' | 'submissions'>
  ) => ClassroomTest;
  deleteTest: (classroomId: string, testId: string) => void;

  // Student submission & teacher grading actions
  submitStudentTest: (
    classroomId: string,
    testId: string,
    submission: {
      studentName: string;
      studentEmail?: string;
      answers: Record<string, any>;
    }
  ) => StudentSubmission;
  gradeStudentSubmission: (
    classroomId: string,
    testId: string,
    submissionId: string,
    manualScore: number,
    feedback: string
  ) => void;

  // Email actions
  logEmail: (log: Omit<EmailLog, 'id' | 'sentAt'>) => void;
}

// Initial pre-seeded data
const INITIAL_ADMIN: UserAccount = {
  id: 'user-admin-danghungit',
  username: 'danghungit',
  password: 'Danghungit@2025',
  fullName: 'Đặng Hùng (Quản trị viên Hệ thống)',
  role: 'admin',
  email: 'danghungit@stemlab.edu.vn',
  subject: 'Toàn quyền Quản trị STEM & Lab',
  createdAt: '2026-01-01T00:00:00.000Z',
  isActive: true,
};

const INITIAL_TEACHER: UserAccount = {
  id: 'user-teacher-nguyenmaianh',
  username: 'nguyenmaianh',
  password: 'Teacher@2025',
  fullName: 'Cô Nguyễn Mai Anh',
  role: 'teacher',
  email: 'maianh.nguyen@thcs-demo.edu.vn',
  subject: 'Khoa học tự nhiên & Hóa học',
  gradeLevels: [7, 8],
  createdAt: '2026-02-15T08:00:00.000Z',
  isActive: true,
};

const INITIAL_CLASSROOM: VirtualClassroom = {
  id: 'class-8a1-sample',
  code: 'STEM-8A1-4821',
  name: 'Lớp 8A1 - KHTN Hóa học & Vật lí',
  subject: 'Khoa học tự nhiên',
  grade: 8,
  teacherId: 'user-teacher-nguyenmaianh',
  teacherName: 'Cô Nguyễn Mai Anh',
  description: 'Lớp học thực hành thí nghiệm mô phỏng và kiểm tra kiến thức KHTN Lớp 8 - SGK GDPT 2018.',
  createdAt: '2026-02-20T08:30:00.000Z',
  tests: [
    {
      id: 'test-8a1-chem-01',
      classroomId: 'class-8a1-sample',
      title: 'Kiểm tra 15 phút: Cân bằng PTHH & Lực đẩy Ác-si-mét',
      description: 'Kiểm tra định luật bảo toàn khối lượng và điều kiện chìm nổi của vật liệu trong chất lỏng.',
      durationMinutes: 15,
      deadline: '2026-12-31',
      associatedSimId: 'chem-balancing-reactions',
      questions: [
        {
          id: 'q-sample-1',
          type: 'multiple-choice',
          question: 'Trong phản ứng hóa học: H₂ + O₂ ➔ H₂O, hệ số cân bằng đúng của các chất lần lượt là:',
          options: ['2, 1, 2', '1, 1, 1', '1, 2, 2', '2, 2, 1'],
          correctAnswer: 0,
          points: 3.0,
          explanation: 'Phương trình cân bằng: 2H₂ + O₂ ➔ 2H₂O (vế trái 4H, 2O = vế phải 4H, 2O).',
        },
        {
          id: 'q-sample-2',
          type: 'multiple-choice',
          question: 'Lực đẩy Ác-si-mét tác dụng lên vật nhúng trong chất lỏng có độ lớn bằng:',
          options: [
            'Trọng lượng của phần chất lỏng bị vật chiếm chỗ (FA = d.V)',
            'Trọng lượng toàn bộ bình chứa',
            'Thể tích của vật nhân với khối lượng vật',
            'Bằng 0 khi vật chìm xuống đáy',
          ],
          correctAnswer: 0,
          points: 3.0,
          explanation: 'FA = d_chất_lỏng × V_chìm, theo định luật Ác-si-mét.',
        },
        {
          id: 'q-sample-3',
          type: 'essay',
          question: 'Tại sao một khối sắt đặc nặng chìm ngay xuống nước, nhưng một con tàu khổng lồ bằng thép lại nổi được trên mặt biển?',
          points: 4.0,
          explanation: 'Gợi ý: Tàu thép được thiết kế rỗng, có khoang chứa không khí nên khối lượng riêng trung bình của cả con tàu nhỏ hơn khối lượng riêng của nước.',
        },
      ],
      submissions: [
        {
          id: 'sub-sample-01',
          testId: 'test-8a1-chem-01',
          studentName: 'Nguyễn Văn An',
          studentEmail: 'an.nguyen8a1@gmail.com',
          submittedAt: '2026-03-01T10:15:00.000Z',
          answers: {
            'q-sample-1': 0,
            'q-sample-2': 0,
            'q-sample-3': 'Vì tàu thủy có cấu tạo dạng vỏ rỗng bên trong chứa nhiều không khí, nên thể tích nước bị đẩy ra rất lớn làm cho lực đẩy Ác-si-mét lớn hơn trọng lượng tàu.',
          },
          autoScore: 6.0,
          manualScore: 0,
          totalScore: 6.0,
          maxScore: 10.0,
          isGraded: false, // Chờ cô giáo chấm câu tự luận
        },
        {
          id: 'sub-sample-02',
          testId: 'test-8a1-chem-01',
          studentName: 'Trần Thị Bích',
          studentEmail: 'bich.tran8a1@gmail.com',
          submittedAt: '2026-03-01T10:20:00.000Z',
          answers: {
            'q-sample-1': 0,
            'q-sample-2': 0,
            'q-sample-3': 'Tàu có khoang rỗng lớn giúp thể tích chiếm chỗ tăng lên rất nhiều, làm khối lượng riêng trung bình của tàu nhỏ hơn nước biển nên tàu nổi được.',
          },
          autoScore: 6.0,
          manualScore: 3.5,
          totalScore: 9.5,
          maxScore: 10.0,
          teacherFeedback: 'Bài làm rất tốt, câu tự luận giải thích chính xác bản chất khối lượng riêng trung bình. Điểm 9.5 xuất sắc!',
          isGraded: true, // Cô giáo đã chấm xong
        },
      ],
    },
  ],
};

export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [INITIAL_ADMIN, INITIAL_TEACHER],
      customLessons: [],
      classrooms: [INITIAL_CLASSROOM],
      emailLogs: [],

      // Đăng nhập
      login: (username, password) => {
        const user = get().users.find(
          u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
        );
        if (!user) {
          return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu.' };
        }
        if (!user.isActive) {
          return { success: false, message: 'Tài khoản này hiện đang bị khóa. Vui lòng liên hệ Admin.' };
        }
        set({ currentUser: user });
        return { success: true, message: `Xin chào ${user.fullName}!` };
      },

      // Đăng xuất
      logout: () => {
        set({ currentUser: null });
      },

      // Quản lý giáo viên
      createTeacher: data => {
        const existing = get().users.find(
          u => u.username.toLowerCase() === data.username.toLowerCase() || u.email.toLowerCase() === data.email.toLowerCase()
        );
        if (existing) {
          return false;
        }
        const newTeacher: UserAccount = {
          ...data,
          id: `user-teacher-${Date.now()}`,
          role: 'teacher',
          createdAt: new Date().toISOString(),
          isActive: true,
        };
        set(state => ({ users: [...state.users, newTeacher] }));
        return true;
      },

      toggleTeacherStatus: teacherId => {
        set(state => ({
          users: state.users.map(u => (u.id === teacherId ? { ...u, isActive: !u.isActive } : u)),
        }));
      },

      // Quản lý bài học tùy biến
      saveCustomLesson: lesson => {
        set(state => {
          const index = state.customLessons.findIndex(l => l.id === lesson.id);
          if (index >= 0) {
            const updated = [...state.customLessons];
            updated[index] = lesson;
            return { customLessons: updated };
          }
          return { customLessons: [lesson, ...state.customLessons] };
        });
      },

      deleteCustomLesson: lessonId => {
        set(state => ({
          customLessons: state.customLessons.filter(l => l.id !== lessonId),
        }));
      },

      // Quản lý lớp học ảo
      createClassroom: data => {
        // Sinh mã code duy nhất: STEM-GRADE-XXXX
        const randDigits = Math.floor(1000 + Math.random() * 9000);
        const code = `STEM-${data.grade}A-${randDigits}`;

        const newClassroom: VirtualClassroom = {
          id: `class-${Date.now()}`,
          code,
          name: data.name,
          subject: data.subject,
          grade: data.grade,
          teacherId: data.teacherId,
          teacherName: data.teacherName,
          description: data.description,
          createdAt: new Date().toISOString(),
          tests: [],
        };

        set(state => ({ classrooms: [newClassroom, ...state.classrooms] }));
        return newClassroom;
      },

      deleteClassroom: classroomId => {
        set(state => ({
          classrooms: state.classrooms.filter(c => c.id !== classroomId),
        }));
      },

      getClassroomByCode: code => {
        const cleanCode = code.trim().toUpperCase();
        return get().classrooms.find(c => c.code.toUpperCase() === cleanCode);
      },

      // Quản lý bài kiểm tra
      createTest: (classroomId, testData) => {
        const newTest: ClassroomTest = {
          ...testData,
          id: `test-${Date.now()}`,
          classroomId,
          submissions: [],
        };

        set(state => ({
          classrooms: state.classrooms.map(c =>
            c.id === classroomId ? { ...c, tests: [newTest, ...c.tests] } : c
          ),
        }));
        return newTest;
      },

      deleteTest: (classroomId, testId) => {
        set(state => ({
          classrooms: state.classrooms.map(c =>
            c.id === classroomId
              ? { ...c, tests: c.tests.filter(t => t.id !== testId) }
              : c
          ),
        }));
      },

      // Học sinh nộp bài kiểm tra
      submitStudentTest: (classroomId, testId, submissionData) => {
        const classroom = get().classrooms.find(c => c.id === classroomId);
        const test = classroom?.tests.find(t => t.id === testId);

        // Tự động tính điểm trắc nghiệm
        let autoScore = 0;
        let maxScore = 0;

        test?.questions.forEach(q => {
          maxScore += q.points;
          if (q.type === 'multiple-choice') {
            const studentAns = submissionData.answers[q.id];
            if (studentAns !== undefined && Number(studentAns) === q.correctAnswer) {
              autoScore += q.points;
            }
          }
        });

        // Kiểm tra xem bài có câu hỏi tự luận không
        const hasEssay = test?.questions.some(q => q.type === 'essay');

        const newSubmission: StudentSubmission = {
          ...submissionData,
          id: `sub-${Date.now()}`,
          testId,
          submittedAt: new Date().toISOString(),
          autoScore,
          manualScore: 0,
          totalScore: autoScore,
          maxScore: maxScore || 10,
          isGraded: !hasEssay, // Nếu chỉ toàn trắc nghiệm thì tự động tính là đã chấm xong
        };

        set(state => ({
          classrooms: state.classrooms.map(c =>
            c.id === classroomId
              ? {
                  ...c,
                  tests: c.tests.map(t =>
                    t.id === testId
                      ? { ...t, submissions: [newSubmission, ...t.submissions] }
                      : t
                  ),
                }
              : c
          ),
        }));

        return newSubmission;
      },

      // Giáo viên chấm bài tự luận & ghi nhận xét
      gradeStudentSubmission: (classroomId, testId, submissionId, manualScore, feedback) => {
        set(state => ({
          classrooms: state.classrooms.map(c => {
            if (c.id !== classroomId) return c;
            return {
              ...c,
              tests: c.tests.map(t => {
                if (t.id !== testId) return t;
                return {
                  ...t,
                  submissions: t.submissions.map(sub => {
                    if (sub.id !== submissionId) return sub;
                    const total = Math.min(sub.maxScore, sub.autoScore + manualScore);
                    return {
                      ...sub,
                      manualScore,
                      totalScore: Math.round(total * 10) / 10,
                      teacherFeedback: feedback,
                      isGraded: true,
                    };
                  }),
                };
              }),
            };
          }),
        }));
      },

      // Ghi nhật ký gửi email
      logEmail: log => {
        const newLog: EmailLog = {
          ...log,
          id: `email-${Date.now()}`,
          sentAt: new Date().toISOString(),
        };
        set(state => ({ emailLogs: [newLog, ...state.emailLogs] }));
      },
    }),
    {
      name: 'STEM_LAB_ADMIN_STORE_V1',
    }
  )
);
