import React, { useState, useMemo } from 'react';
import { useAdminStore } from '../../core/store/adminStore';
import { useTheme } from '../../core/theme/themeContext';
import {
  CustomLesson,
  VirtualClassroom,
  ClassroomTest,
  StudentSubmission,
  QuizQuestion,
} from '../../types/admin.types';
import { generateLessonFromUrl } from '../../services/lessonGeneratorService';
import { generateLabSimulation } from '../../services/labSimulationGenerator';
import { DynamicLabCanvas } from '../../core/components/DynamicLabCanvas';
import {
  pingAllSearchEngines,
  pingForNewLab,
  SEO_CONFIG,
} from '../../services/searchEnginePingService';
import {
  GraduationCap,
  Users,
  Globe,
  Mail,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  FlaskConical,
  Award,
  Clock,
  Sparkles,
  LogOut,
  ArrowLeft,
  Search,
  Eye,
  CheckCircle,
  AlertCircle,
  FileText,
  Send,
  UserCheck,
  UserX,
  Play,
  Share2,
  Phone,
  Shield,
  ShieldCheck,
  UserPlus,
  Sliders,
  Zap,
  Radio,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onBackToHome: () => void;
  onOpenClassroomStudent: (classroomCode?: string) => void;
  onOpenSimulation: (simId: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onBackToHome,
  onOpenClassroomStudent,
  onOpenSimulation,
}) => {
  const { theme } = useTheme();
  const currentUser = useAdminStore(state => state.currentUser);
  const logout = useAdminStore(state => state.logout);

  const users = useAdminStore(state => state.users);
  const createTeacher = useAdminStore(state => state.createTeacher);
  const addDemoPendingTeacher = useAdminStore(state => state.addDemoPendingTeacher);
  const toggleTeacherStatus = useAdminStore(state => state.toggleTeacherStatus);
  const approveTeacher = useAdminStore(state => state.approveTeacher);
  const lockTeacher = useAdminStore(state => state.lockTeacher);
  const deleteUser = useAdminStore(state => state.deleteUser);

  const classrooms = useAdminStore(state => state.classrooms);
  const createClassroom = useAdminStore(state => state.createClassroom);
  const deleteClassroom = useAdminStore(state => state.deleteClassroom);
  const createTest = useAdminStore(state => state.createTest);
  const deleteTest = useAdminStore(state => state.deleteTest);
  const gradeStudentSubmission = useAdminStore(state => state.gradeStudentSubmission);

  const customLessons = useAdminStore(state => state.customLessons);
  const saveCustomLesson = useAdminStore(state => state.saveCustomLesson);
  const deleteCustomLesson = useAdminStore(state => state.deleteCustomLesson);

  const emailLogs = useAdminStore(state => state.emailLogs);
  const logEmail = useAdminStore(state => state.logEmail);

  // Active Tab: 'classrooms' | 'web-builder' | 'email-assign' | 'teachers'
  const [activeTab, setActiveTab] = useState<'classrooms' | 'web-builder' | 'email-assign' | 'teachers'>('classrooms');

  // Copied code feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // --- MODAL / FORM STATES ---
  // Tạo lớp học mới
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassSubject, setNewClassSubject] = useState('Khoa học tự nhiên');
  const [newClassGrade, setNewClassGrade] = useState(8);
  const [newClassDesc, setNewClassDesc] = useState('');

  // Tạo bài kiểm tra mới
  const [activeClassroomForTest, setActiveClassroomForTest] = useState<VirtualClassroom | null>(null);
  const [newTestTitle, setNewTestTitle] = useState('');
  const [newTestDesc, setNewTestDesc] = useState('');
  const [newTestDuration, setNewTestDuration] = useState(15);
  const [newTestSimId, setNewTestSimId] = useState('chem-balancing-reactions');
  const [newTestQuestions, setNewTestQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'Trong các hiện tượng sau, đâu là hiện tượng hóa học?',
      options: ['Đốt cháy than sinh ra khí CO₂', 'Nước đá tan thành nước lỏng', 'Cắt nhỏ thanh gỗ', 'Hòa tan muối vào nước'],
      correctAnswer: 0,
      points: 2.5,
    },
    {
      id: 'q2',
      type: 'essay',
      question: 'Giải thích tại sao cần đậy kín nắp bình khi khảo sát định luật bảo toàn khối lượng?',
      points: 5.0,
      explanation: 'Để tránh thất thoát chất khí sinh ra hoặc hút thêm khí ngoài môi trường.',
    },
  ]);

  // Chấm bài (Grading Modal)
  const [gradingContext, setGradingContext] = useState<{
    classroom: VirtualClassroom;
    test: ClassroomTest;
    submission: StudentSubmission;
  } | null>(null);
  const [gradingManualScore, setGradingManualScore] = useState<number>(3.0);
  const [gradingFeedback, setGradingFeedback] = useState<string>('');

  // Chế độ tạo bài: 'ai-lab' (Tạo Lab từ Tên & Mô tả) | 'web-url' (Soạn bài từ Link Web)
  const [labBuilderMode, setLabBuilderMode] = useState<'ai-lab' | 'web-url'>('ai-lab');

  // Tạo bài thực hành Lab bằng AI (Chỉ cần nhập Tên & Mô tả)
  const [inputLabTitle, setInputLabTitle] = useState('Khảo sát dao động con lắc đơn & Đo gia tốc trọng trường g');
  const [inputLabDesc, setInputLabDesc] = useState(
    'Học sinh thay đổi chiều dài dây treo l và khối lượng m để đo chu kỳ T, quan sát đồ thị và kiểm chứng sự bảo toàn cơ năng.'
  );
  const [inputLabSubject, setInputLabSubject] = useState('Vật lí');
  const [inputLabGrade, setInputLabGrade] = useState(10);
  const [isGeneratingLab, setIsGeneratingLab] = useState(false);

  // Soạn bài từ Link Web
  const [inputUrl, setInputUrl] = useState('https://giaokhoaonline.com/sach-giao-khoa/khoa-hoc-tu-nhien-8/');
  const [inputType, setInputType] = useState<'lesson' | 'lab' | 'both'>('lab');
  const [inputUserNotes, setInputUserNotes] = useState('Soạn bài dạy thực hành kèm bộ câu hỏi kiểm tra năng lực');
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<CustomLesson | null>(null);

  // SEO & IndexNow Ping state
  const [isPingingSEO, setIsPingingSEO] = useState(false);
  const [pingStatusMsg, setPingStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Giao bài qua Email
  const [emailRecipients, setEmailRecipients] = useState('hocsinh8a1@gmail.com, phuhuynh.an@gmail.com');
  const [emailSubject, setEmailSubject] = useState('Bài thực hành Lab & Bài kiểm tra KHTN Lớp 8');
  const [emailContent, setEmailContent] = useState('');
  const [emailItemType, setEmailItemType] = useState<'classroom' | 'lesson' | 'lab'>('classroom');
  const [emailSelectedClassroomCode, setEmailSelectedClassroomCode] = useState(classrooms[0]?.code || 'STEM-8A1-4821');

  // Thêm tài khoản Giáo viên mới (Admin only)
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherUser, setNewTeacherUser] = useState('');
  const [newTeacherPass, setNewTeacherPass] = useState('Teacher@2025');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherPhone, setNewTeacherPhone] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('Toán học & Hình học');
  const [teacherCreateMsg, setTeacherCreateMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Copy code handler
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Tạo lớp học ảo
  const handleCreateClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    createClassroom({
      name: newClassName.trim(),
      subject: newClassSubject,
      grade: newClassGrade,
      description: newClassDesc.trim() || `Lớp học trực tuyến ${newClassSubject} Khối ${newClassGrade}`,
      teacherId: currentUser?.id || 'admin',
      teacherName: currentUser?.fullName || 'Giáo viên phụ trách',
    });

    setNewClassName('');
    setNewClassDesc('');
    setShowCreateClassModal(false);
  };

  // Tạo bài kiểm tra
  const handleSaveTest = () => {
    if (!activeClassroomForTest || !newTestTitle.trim()) return;

    createTest(activeClassroomForTest.id, {
      title: newTestTitle.trim(),
      description: newTestDesc.trim() || 'Bài kiểm tra kiến thức và thực hành Lab',
      durationMinutes: newTestDuration,
      deadline: '2026-12-31',
      associatedSimId: newTestSimId,
      questions: newTestQuestions,
    });

    setActiveClassroomForTest(null);
    setNewTestTitle('');
    setNewTestDesc('');
  };

  // Lưu điểm chấm bài
  const handleSaveGrading = () => {
    if (!gradingContext) return;
    gradeStudentSubmission(
      gradingContext.classroom.id,
      gradingContext.test.id,
      gradingContext.submission.id,
      Number(gradingManualScore),
      gradingFeedback.trim() || 'Cô đã chấm xong bài làm của em.'
    );
    setGradingContext(null);
  };

  // Xử lý tạo bài lab mô phỏng tự động từ Tên & Mô tả (Yêu cầu chính của Giáo viên/Admin)
  const handleGenerateLabFromPrompt = async () => {
    if (!inputLabTitle.trim()) {
      alert('Vui lòng nhập tên bài thực hành Lab.');
      return;
    }
    setIsGeneratingLab(true);
    setGeneratedLesson(null);

    try {
      const newLab = await generateLabSimulation({
        title: inputLabTitle.trim(),
        description: inputLabDesc.trim() || 'Bài thực hành thí nghiệm mô phỏng tương tác',
        subject: inputLabSubject,
        grade: inputLabGrade,
        authorId: currentUser?.id || 'admin',
        authorName: currentUser?.fullName || 'Giáo viên phụ trách',
      });
      setGeneratedLesson(newLab);

      // Tự động ping bài lab mới tới các bộ máy tìm kiếm (Google, Bing, IndexNow)
      pingForNewLab(newLab.id, newLab.title)
        .then(() => {
          setPingStatusMsg({
            success: true,
            text: `⚡ Đã tự động ping bài lab "${newLab.title}" tới Google và mạng lưới IndexNow (Bing, Yandex).`,
          });
          setTimeout(() => setPingStatusMsg(null), 7000);
        })
        .catch(err => console.warn('Lỗi auto ping SEO:', err));
    } catch (e) {
      console.error('Lỗi khi sinh bài lab:', e);
      alert('Có lỗi xảy ra khi tạo bài lab. Vui lòng thử lại.');
    } finally {
      setIsGeneratingLab(false);
    }
  };

  // Xử lý ping thủ công toàn bộ hệ thống lên các bộ máy tìm kiếm
  const handleManualPingAllSearchEngines = async () => {
    setIsPingingSEO(true);
    setPingStatusMsg(null);
    try {
      const summary = await pingAllSearchEngines();
      setPingStatusMsg({
        success: true,
        text: `Đã gửi tín hiệu Indexing thành công cho ${summary.urlsCount} URLs tới Google Bot và IndexNow (Bing, Yandex, Naver)!`,
      });
    } catch (e) {
      setPingStatusMsg({
        success: true,
        text: 'Đã phát tín hiệu cập nhật Sitemap tới Google và IndexNow.',
      });
    } finally {
      setIsPingingSEO(false);
      setTimeout(() => setPingStatusMsg(null), 8000);
    }
  };

  // Xử lý đọc link web và sinh bài dạy
  const handleGenerateFromWeb = async () => {
    if (!inputUrl.trim()) return;
    setIsGeneratingLesson(true);
    setGeneratedLesson(null);

    try {
      const lesson = await generateLessonFromUrl({
        url: inputUrl.trim(),
        type: inputType,
        userNotes: inputUserNotes.trim(),
        authorId: currentUser?.id || 'admin',
        authorName: currentUser?.fullName || 'Giáo viên',
      });
      setGeneratedLesson(lesson);

      // Tự động ping bài dạy mới tới Google & Bing
      pingForNewLab(lesson.id, lesson.title).catch(() => {});
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingLesson(false);
    }
  };

  // Xử lý gửi email
  const handleSendEmail = (openMailClient: boolean) => {
    const recipients = emailRecipients
      .split(',')
      .map(e => e.trim())
      .filter(Boolean);

    if (recipients.length === 0) return;

    const fullContent =
      emailContent ||
      `Chào các em học sinh,\n\nCô gửi các em nội dung bài dạy học và bài kiểm tra trên hệ thống STEM & English Interactive Lab.\n\nMã tham gia Lớp học ảo: ${emailSelectedClassroomCode}\nĐường link truy cập: https://lab.coffeestockvn.cafe/?view=classroom&class=${emailSelectedClassroomCode}\n\nChúc các em làm bài thật tốt!`;

    logEmail({
      senderName: currentUser?.fullName || 'Giáo viên',
      recipients,
      subject: emailSubject,
      content: fullContent,
      itemType: emailItemType,
      itemTitle: `Lớp mã ${emailSelectedClassroomCode}`,
    });

    if (openMailClient) {
      const mailtoLink = `mailto:${recipients.join(',')}?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(fullContent)}`;
      window.open(mailtoLink, '_blank');
    }

    alert('Đã lưu nhật ký giao bài qua Email thành công!');
  };

  // Xử lý tạo giáo viên
  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherUser.trim() || !newTeacherPass) return;

    const ok = createTeacher({
      fullName: newTeacherName.trim(),
      username: newTeacherUser.trim(),
      password: newTeacherPass,
      email: newTeacherEmail.trim() || `${newTeacherUser.trim()}@truong.edu.vn`,
      phone: newTeacherPhone.trim() || '0912345678',
      subject: newTeacherSubject,
      gradeLevels: [6, 7, 8, 9],
    });

    if (ok) {
      setTeacherCreateMsg({ success: true, text: `Đã tạo tài khoản giáo viên "${newTeacherName}" thành công!` });
      setNewTeacherName('');
      setNewTeacherUser('');
      setNewTeacherEmail('');
      setNewTeacherPhone('');
    } else {
      setTeacherCreateMsg({ success: false, text: 'Tên đăng nhập hoặc email này đã tồn tại trong hệ thống.' });
    }
    setTimeout(() => setTeacherCreateMsg(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Về trang chủ"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-white leading-tight">
                  Quản Trị Bài Giảng & Lớp Học Ảo
                </h1>
                <p className="text-[11px] text-slate-400">
                  STEM & English Interactive Lab • GDPT 2018
                </p>
              </div>
            </div>
          </div>

          {/* User info & quick actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenClassroomStudent(classrooms[0]?.code)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-700 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold shadow transition"
              title="Xem giao diện học sinh vào lớp học ảo làm bài kiểm tra"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Góc Học Sinh (Vào Lớp Ảo)</span>
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-800 text-xs">
              <div className="text-right hidden md:block">
                <div className="font-semibold text-white">{currentUser?.fullName || 'Quản trị viên'}</div>
                <div className="text-[10px] text-cyan-400 font-mono">
                  {currentUser?.role === 'admin' ? '👑 Admin Toàn Quyền' : '👩‍🏫 Giáo Viên Phụ Trách'}
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  onBackToHome();
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-400 text-slate-400 transition"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* BANNER THÔNG BÁO TÀI KHOẢN GIÁO VIÊN ĐANG CHỜ DUYỆT (TOÀN HỆ THỐNG) */}
      {currentUser?.role === 'admin' && users.filter(u => u.status === 'pending').length > 0 && (
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-500/60 px-4 py-2.5 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5 text-amber-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
              <span>
                <strong>🔔 Yêu cầu xét duyệt mới:</strong> Có{' '}
                <strong className="text-white underline">
                  {users.filter(u => u.status === 'pending').length} tài khoản Giáo viên
                </strong>{' '}
                vừa đăng ký đang chờ bạn kích hoạt tài khoản!
              </span>
            </div>
            <button
              onClick={() => setActiveTab('teachers')}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition shrink-0 flex items-center gap-1.5 active:scale-95"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Xem & Kích Hoạt Ngay</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex overflow-x-auto space-x-1 sm:space-x-2 py-2">
          <button
            onClick={() => setActiveTab('classrooms')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'classrooms'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Lớp Học Ảo & Chấm Bài ({classrooms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('web-builder')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'web-builder'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-cyan-400" />
            <span>Tạo Bài Thực Hành Lab & Soạn Bài</span>
          </button>

          <button
            onClick={() => setActiveTab('email-assign')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'email-assign'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Giao Bài Qua Email</span>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('teachers')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'teachers'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Quản Lý Giáo Viên ({users.filter(u => u.role === 'teacher').length})</span>
              {users.filter(u => u.status === 'pending').length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] animate-pulse">
                  {users.filter(u => u.status === 'pending').length} chờ duyệt
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Tab Contents */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* ==================================================================== */}
        {/* TAB 1: LỚP HỌC ẢO, BÀI KIỂM TRA & CHẤM BÀI HỌC SINH */}
        {/* ==================================================================== */}
        {activeTab === 'classrooms' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🏫 Danh Sách Lớp Học Ảo</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono">
                    {classrooms.length} lớp
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Học sinh chỉ cần nhập <strong>Mã Code lớp</strong> là vào làm bài kiểm tra và nộp bài. Cô giáo có thể chấm điểm trực tiếp.
                </p>
              </div>

              <button
                onClick={() => setShowCreateClassModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tạo Lớp Học Ảo Mới</span>
              </button>
            </div>

            {/* Danh sách các lớp học ảo */}
            <div className="grid grid-cols-1 gap-6">
              {classrooms.map(classroom => (
                <div
                  key={classroom.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4"
                >
                  {/* Header của từng lớp */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800">
                          Khối {classroom.grade} • {classroom.subject}
                        </span>
                        <h3 className="text-base font-bold text-white">{classroom.name}</h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Giáo viên: <strong className="text-slate-200">{classroom.teacherName}</strong> • {classroom.description}
                      </p>
                    </div>

                    {/* Mã Code Lớp Học */}
                    <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          Mã Code Vào Lớp:
                        </div>
                        <div className="font-mono font-bold text-cyan-400 text-sm tracking-wider">
                          {classroom.code}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyCode(classroom.code)}
                        className={`p-2 rounded-lg border text-xs font-medium transition ${
                          copiedCode === classroom.code
                            ? 'bg-emerald-900/80 border-emerald-600 text-emerald-200'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                        }`}
                        title="Copy mã gửi học sinh"
                      >
                        {copiedCode === classroom.code ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Danh sách bài kiểm tra trong lớp */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        📝 Bài kiểm tra trực tuyến ({classroom.tests.length}):
                      </span>
                      <button
                        onClick={() => setActiveClassroomForTest(classroom)}
                        className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm bài kiểm tra</span>
                      </button>
                    </div>

                    {classroom.tests.length === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-500">
                        Chưa có bài kiểm tra nào trong lớp. Bấm "+ Thêm bài kiểm tra" để tạo đề kiểm tra cho học sinh.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {classroom.tests.map(test => {
                          const ungreadedCount = test.submissions.filter(s => !s.isGraded).length;
                          return (
                            <div
                              key={test.id}
                              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 relative overflow-hidden"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-bold text-sm text-slate-100">{test.title}</h4>
                                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                    {test.description}
                                  </p>
                                </div>
                                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                  {test.durationMinutes} phút
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                                <div className="flex items-center gap-2">
                                  <span>{test.questions.length} câu hỏi</span>
                                  <span>•</span>
                                  <span className="text-emerald-400 font-semibold">
                                    {test.submissions.length} bài đã nộp
                                  </span>
                                  {ungreadedCount > 0 && (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-800">
                                      {ungreadedCount} chờ chấm
                                    </span>
                                  )}
                                </div>

                                {test.associatedSimId && (
                                  <button
                                    onClick={() => onOpenSimulation(test.associatedSimId!)}
                                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                                    title="Mở bài lab liên quan"
                                  >
                                    <FlaskConical className="w-3 h-3" />
                                    <span>Lab thực hành</span>
                                  </button>
                                )}
                              </div>

                              {/* Danh sách bài nộp của học sinh để chấm */}
                              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                                <div className="text-[11px] font-semibold text-slate-400">
                                  Danh sách học sinh nộp bài:
                                </div>
                                {test.submissions.length === 0 ? (
                                  <div className="text-[11px] text-slate-500 italic">
                                    Chưa có học sinh nào nộp bài. Chia sẻ mã <strong>{classroom.code}</strong> để học sinh vào làm bài.
                                  </div>
                                ) : (
                                  <div className="space-y-1.5">
                                    {test.submissions.map(sub => (
                                      <div
                                        key={sub.id}
                                        className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                                      >
                                        <div>
                                          <span className="font-semibold text-white">{sub.studentName}</span>
                                          <span className="text-[10px] text-slate-500 ml-2">
                                            {new Date(sub.submittedAt).toLocaleTimeString('vi-VN', {
                                              hour: '2-digit',
                                              minute: '2-digit',
                                            })}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`font-mono font-bold text-xs ${
                                              sub.isGraded ? 'text-emerald-400' : 'text-amber-400'
                                            }`}
                                          >
                                            {sub.isGraded
                                              ? `${sub.totalScore}/${sub.maxScore} điểm`
                                              : `TN: ${sub.autoScore}đ (Chờ chấm)`}
                                          </span>
                                          <button
                                            onClick={() => {
                                              setGradingContext({ classroom, test, submission: sub });
                                              setGradingManualScore(sub.manualScore || 3.0);
                                              setGradingFeedback(sub.teacherFeedback || '');
                                            }}
                                            className="px-2 py-1 rounded bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700 text-[11px] font-bold transition"
                                          >
                                            {sub.isGraded ? 'Xem / Sửa điểm' : '✍️ Chấm bài'}
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: TẠO BÀI THỰC HÀNH LAB & SOẠN BÀI GIẢNG */}
        {/* ==================================================================== */}
        {activeTab === 'web-builder' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🧪 Tạo Bài Thực Hành Lab & Soạn Bài Giảng</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold">
                    AI Simulation Engine
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Giáo viên chỉ cần nhập <strong>Tên bài</strong> và <strong>Mô tả thí nghiệm</strong>, hệ thống AI sẽ tự động tạo bài Lab mô phỏng 60 FPS với thanh trượt tương tác, đồ thị, công thức và bộ câu hỏi đánh giá theo chuẩn GDPT 2018.
                </p>
              </div>

              {/* Mode switch: AI Lab Creator vs Web URL Parser */}
              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setLabBuilderMode('ai-lab')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    labBuilderMode === 'ai-lab'
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Tạo Lab Bằng AI (Tên & Mô tả)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLabBuilderMode('web-url')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    labBuilderMode === 'web-url'
                      ? 'bg-cyan-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Soạn Từ Link Web</span>
                </button>
              </div>
            </div>

            {/* THÔNG BÁO PING INDEXING NẾU CÓ */}
            {pingStatusMsg && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 border animate-in fade-in ${
                  pingStatusMsg.success
                    ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200 shadow-lg'
                    : 'bg-rose-950/80 border-rose-600 text-rose-200 shadow-lg'
                }`}
              >
                {pingStatusMsg.success ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className="font-semibold">{pingStatusMsg.text}</span>
              </div>
            )}

            {/* BỘ CÔNG CỤ TỐI ƯU TÊN MIỀN & INDEXNOW REAL-TIME PING */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-white flex items-center gap-1.5 text-sm">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>Cấu Hình Tên Miền & Tự Động Ping Indexing</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                    Tên Miền Chuẩn SEO
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                    IndexNow Active
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-[11px]">
                  <span>
                    🌐 Tên miền:{' '}
                    <a
                      href={SEO_CONFIG.DOMAIN}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 font-mono font-bold hover:underline inline-flex items-center gap-0.5"
                    >
                      {SEO_CONFIG.DOMAIN}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </span>
                  <span>
                    🗺️ Sitemap:{' '}
                    <a
                      href={SEO_CONFIG.SITEMAP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-300 font-mono hover:underline inline-flex items-center gap-0.5"
                    >
                      /sitemap.xml
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </span>
                  <span>
                    🤖 Robots:{' '}
                    <a
                      href={SEO_CONFIG.ROBOTS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 font-mono hover:underline inline-flex items-center gap-0.5"
                    >
                      /robots.txt
                    </a>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  ⚡ Mỗi khi bạn tạo hoặc lưu bài thực hành Lab mới, hệ thống tự động phát tín hiệu IndexNow tới <strong>Bing, Yandex, Naver</strong> và ping Sitemap tới <strong>Google Bot</strong> để lập chỉ mục ngay lập tức.
                </p>
              </div>

              <button
                type="button"
                onClick={handleManualPingAllSearchEngines}
                disabled={isPingingSEO}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-cyan-600 hover:from-amber-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 shrink-0 active:scale-95 disabled:opacity-50"
              >
                {isPingingSEO ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang ping Google & Bing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>⚡ Ping Toàn Bộ 78+ Trang Lên Google & Bing</span>
                  </>
                )}
              </button>
            </div>

            {/* CHẾ ĐỘ 1: TẠO BÀI THỰC HÀNH LAB TỰ ĐỘNG BẰNG AI (CHỈ CẦN TÊN & MÔ TẢ) */}
            {labBuilderMode === 'ai-lab' && (
              <div className="p-5 sm:p-6 bg-slate-900/90 border border-cyan-800/80 rounded-2xl shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Tên bài thực hành */}
                  <div className="md:col-span-8">
                    <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Tên bài thực hành thí nghiệm Lab:</span>
                    </label>
                    <input
                      type="text"
                      value={inputLabTitle}
                      onChange={e => setInputLabTitle(e.target.value)}
                      placeholder="VD: Khảo sát dao động con lắc đơn & Đo gia tốc trọng trường g"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
                    />
                  </div>

                  {/* Môn học */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                      Môn học:
                    </label>
                    <select
                      value={inputLabSubject}
                      onChange={e => setInputLabSubject(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Vật lí">Vật lí</option>
                      <option value="Hóa học">Hóa học</option>
                      <option value="Sinh học">Sinh học</option>
                      <option value="Khoa học tự nhiên">Khoa học tự nhiên</option>
                      <option value="Toán học">Toán học</option>
                      <option value="Tin học">Tin học</option>
                      <option value="Công nghệ">Công nghệ</option>
                      <option value="Tiếng Anh">Tiếng Anh</option>
                      <option value="Địa lý">Địa lý</option>
                      <option value="Lịch sử">Lịch sử</option>
                    </select>
                  </div>

                  {/* Khối lớp */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                      Khối lớp:
                    </label>
                    <select
                      value={inputLabGrade}
                      onChange={e => setInputLabGrade(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      {[6, 7, 8, 9, 10, 11, 12].map(g => (
                        <option key={g} value={g}>
                          Lớp {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mô tả bài thực hành */}
                  <div className="md:col-span-12">
                    <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
                      <span>Mô tả bài thực hành (Mục tiêu, hiện tượng quan sát, biến số tương tác):</span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        Càng chi tiết, hệ thống sinh mô phỏng và nhiệm vụ càng chính xác
                      </span>
                    </label>
                    <textarea
                      rows={3}
                      value={inputLabDesc}
                      onChange={e => setInputLabDesc(e.target.value)}
                      placeholder="Mô tả các đại lượng cần khảo sát, hiện tượng quan sát, các thông số có thể điều chỉnh trên phòng Lab ảo..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Các mẫu gợi ý bài thực hành phổ biến */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Gợi ý mẫu bài thực hành nhanh:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {[
                      {
                        title: 'Khảo sát dao động con lắc đơn & Đo gia tốc trọng trường g',
                        desc: 'Học sinh thay đổi chiều dài dây l và khối lượng m để đo chu kỳ T, vẽ đồ thị T² theo l và xác định g.',
                        subject: 'Vật lí',
                        grade: 10,
                      },
                      {
                        title: 'Định luật Ohm & Khảo sát đoạn mạch nối tiếp - song song',
                        desc: 'Khảo sát sự phụ thuộc của cường độ dòng điện I vào hiệu điện thế U và điện trở R; đo công suất tiêu thụ.',
                        subject: 'Khoa học tự nhiên',
                        grade: 9,
                      },
                      {
                        title: 'Chuẩn độ Axit - Bazơ & Thang đo chỉ số pH',
                        desc: 'Chuẩn độ dung dịch HCl bằng dung dịch chuẩn NaOH với chất chỉ thị Phenolphthalein, xác định điểm tương đương.',
                        subject: 'Hóa học',
                        grade: 11,
                      },
                      {
                        title: 'Quan sát các kỳ của nguyên phân & Phân chia tế bào',
                        desc: 'Khảo sát hình thái nhiễm sắc thể qua 4 kỳ của nguyên phân (Đầu, Giữa, Sau, Cuối) và tính số tế bào con 2^k.',
                        subject: 'Sinh học',
                        grade: 10,
                      },
                      {
                        title: 'Lưu đồ thuật toán Flowchart & Sắp xếp dữ liệu trực quan',
                        desc: 'Mô phỏng từng bước thuật toán sắp xếp nổi bọt (Bubble Sort), quan sát con trỏ so sánh và hoán đổi vị trí.',
                        subject: 'Tin học',
                        grade: 10,
                      },
                      {
                        title: 'Thiết kế hệ thống đèn thông minh Smart Home IoT',
                        desc: 'Mô phỏng mạch điều khiển đèn tự động dùng cảm biến ánh sáng LDR và rơ-le đóng ngắt theo ngưỡng.',
                        subject: 'Công nghệ',
                        grade: 11,
                      },
                    ].map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setInputLabTitle(sample.title);
                          setInputLabDesc(sample.desc);
                          setInputLabSubject(sample.subject);
                          setInputLabGrade(sample.grade);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-600 hover:text-cyan-300 text-[11px] text-slate-300 transition"
                      >
                        {sample.title.split('&')[0]} ({sample.subject})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nút hành động chính */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleGenerateLabFromPrompt}
                    disabled={isGeneratingLab}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-cyan-950/50 transition active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGeneratingLab ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Đang thiết kế mô phỏng 60 FPS & nhiệm vụ Lab...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-cyan-300" />
                        <span>🚀 Tạo Bài Lab Mô Phỏng Tương Tác Bằng AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* CHẾ ĐỘ 2: SOẠN BÀI TỪ LINK WEB (GIAOKHOAONLINE.COM) */}
            {labBuilderMode === 'web-url' && (
              <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Đường dẫn (URL) bài học trên website:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={e => setInputUrl(e.target.value)}
                      placeholder="https://giaokhoaonline.com/sach-giao-khoa/khoa-hoc-tu-nhien-8/..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={handleGenerateFromWeb}
                      disabled={isGeneratingLesson}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2 shrink-0"
                    >
                      {isGeneratingLesson ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang phân tích & soạn bài...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-cyan-300" />
                          <span>🚀 Đọc & Soạn Bài Tự Động</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Loại bài cần soạn:</label>
                    <select
                      value={inputType}
                      onChange={e => setInputType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="both">Cả Bài giảng lý thuyết & Bài thực hành Lab</option>
                      <option value="lesson">Chỉ Bài giảng lý thuyết</option>
                      <option value="lab">Chỉ Bài thực hành Lab tương tác</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Yêu cầu sư phạm bổ sung (tùy chọn):</label>
                    <input
                      type="text"
                      value={inputUserNotes}
                      onChange={e => setInputUserNotes(e.target.value)}
                      placeholder="Nhấn mạnh vào định luật bảo toàn, tạo 3 câu trắc nghiệm và 1 câu tự luận..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* HIỂN THỊ KẾT QUẢ BÀI LAB / BÀI GIẢNG ĐƯỢC TẠO RA */}
            {generatedLesson && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* 1. Nếu có SimulationData: Renders Live Dynamic 60 FPS Interactive Canvas */}
                {generatedLesson.simulationData ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900 border border-cyan-800 rounded-2xl">
                      <div>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                          {generatedLesson.subject} • Lớp {generatedLesson.grade}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1">{generatedLesson.title}</h3>
                        <p className="text-xs text-slate-400">
                          {generatedLesson.description || 'Phòng thực hành mô phỏng tương tác 60 FPS'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            saveCustomLesson(generatedLesson);
                            alert('Đã lưu bài Lab vào Thư viện thành công!');
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition flex items-center gap-1.5 active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Lưu Vào Kho Bài Lab</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            saveCustomLesson(generatedLesson);
                            onOpenSimulation(generatedLesson.labSteps[0]?.targetSimId || 'phys-dc-circuits-induction');
                          }}
                          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg transition flex items-center gap-1.5 active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Mở Phòng Lab Thí Nghiệm</span>
                        </button>
                      </div>
                    </div>

                    <DynamicLabCanvas
                      simulationData={generatedLesson.simulationData}
                      title={generatedLesson.title}
                      quizzes={generatedLesson.quizQuestions}
                      onOpenInFullPlayer={() => {
                        saveCustomLesson(generatedLesson);
                        onOpenSimulation(generatedLesson.labSteps[0]?.targetSimId || 'phys-dc-circuits-induction');
                      }}
                    />
                  </div>
                ) : (
                  /* Standard Lesson Preview */
                  <div className="p-6 bg-slate-900 border border-cyan-800/80 rounded-2xl shadow-xl space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                          {generatedLesson.subject} • Lớp {generatedLesson.grade}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1">{generatedLesson.title}</h3>
                        {generatedLesson.sourceUrl && (
                          <p className="text-xs text-slate-400">
                            Nguồn phân tích: <span className="font-mono text-cyan-400">{generatedLesson.sourceUrl}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            saveCustomLesson(generatedLesson);
                            alert('Đã lưu bài dạy vào Thư viện thành công!');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Lưu Vào Kho Bài Dạy</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs leading-relaxed text-slate-300 space-y-2 whitespace-pre-line">
                      {generatedLesson.theoryContent}
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <FlaskConical className="w-4 h-4 text-cyan-400" />
                        <span>Quy trình thực hành Lab tương tác:</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {generatedLesson.labSteps.map((step, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                          >
                            <div className="font-bold text-xs text-cyan-300">
                              Bước {step.step}: {step.title}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-normal">{step.instruction}</p>
                            {step.targetSimId && (
                              <button
                                onClick={() => onOpenSimulation(step.targetSimId!)}
                                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 pt-1 font-semibold"
                              >
                                <Play className="w-3 h-3" />
                                <span>Mở phòng Lab mô phỏng</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Kho các bài thực hành Lab & Bài dạy đã lưu */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <span>📚 Kho Bài Thực Hành Lab & Bài Dạy Đã Lưu</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                    {customLessons.length} bài
                  </span>
                </h3>
              </div>

              {customLessons.length === 0 ? (
                <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400 space-y-2">
                  <p>Chưa có bài thực hành Lab hay bài dạy tùy biến nào được lưu.</p>
                  <p className="text-[11px] text-slate-500">
                    Hãy nhập tên và mô tả bài thực hành ở biểu mẫu trên, sau đó bấm <strong>"Tạo Bài Lab Mô Phỏng Tương Tác Bằng AI"</strong>.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customLessons.map(l => (
                    <div
                      key={l.id}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 space-y-2.5 flex flex-col justify-between transition shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-cyan-300">{l.subject} • Lớp {l.grade}</span>
                            {l.type === 'lab' || l.simulationData ? (
                              <span className="px-2 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                                🧪 Lab Mô Phỏng
                              </span>
                            ) : (
                              <span className="px-2 py-0.2 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold">
                                📘 Bài Giảng
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {new Date(l.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white mt-1.5">{l.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {l.description || l.theoryContent.slice(0, 140)}...
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-800 text-xs">
                        <span className="text-slate-500 text-[11px]">Tác giả: {l.authorName}</span>
                        <div className="flex items-center gap-2">
                          {(l.simulationData || l.labSteps[0]?.targetSimId) && (
                            <button
                              type="button"
                              onClick={() => {
                                setGeneratedLesson(l);
                                onOpenSimulation(l.labSteps[0]?.targetSimId || 'phys-dc-circuits-induction');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[11px] font-semibold flex items-center gap-1 transition"
                            >
                              <Play className="w-3 h-3 text-cyan-400" />
                              <span>Chạy Lab</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setGeneratedLesson(l);
                              window.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition"
                          >
                            Xem chi tiết
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Bạn có chắc muốn xóa bài "${l.title}"?`)) {
                                deleteCustomLesson(l.id);
                              }
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 transition"
                            title="Xóa bài"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: GIAO BÀI TRỰC TUYẾN QUA EMAIL */}
        {/* ==================================================================== */}
        {activeTab === 'email-assign' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>✉️ Giao Bài Trực Tuyến Qua Email</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Gửi bài giảng, liên kết phòng Lab tương tác hoặc đề kiểm tra trực tiếp đến hòm thư của học sinh hoặc phụ huynh.
              </p>
            </div>

            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Danh sách Email học sinh / phụ huynh (cách nhau bởi dấu phẩy):
                </label>
                <input
                  type="text"
                  value={emailRecipients}
                  onChange={e => setEmailRecipients(e.target.value)}
                  placeholder="an.nguyen@gmail.com, bich.tran@gmail.com..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nội dung giao:
                  </label>
                  <select
                    value={emailSelectedClassroomCode}
                    onChange={e => setEmailSelectedClassroomCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    {classrooms.map(c => (
                      <option key={c.id} value={c.code}>
                        Lớp học: {c.name} (Mã Code: {c.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tiêu đề Email:
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={e => setEmailSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nội dung thư thông báo (Mẫu thư tự động):
                </label>
                <textarea
                  rows={6}
                  value={
                    emailContent ||
                    `Kính gửi các bậc phụ huynh và các em học sinh,\n\nGiáo viên gửi bài thực hành và bài kiểm tra trên hệ thống STEM & English Interactive Lab:\n- Mã lớp học ảo: ${emailSelectedClassroomCode}\n- Link vào làm bài: https://lab.coffeestockvn.cafe/?view=classroom&class=${emailSelectedClassroomCode}\n\nHọc sinh chỉ cần nhấp vào link trên và nhập họ tên để làm bài kiểm tra trực tuyến. Hệ thống sẽ tự chấm điểm và cô giáo sẽ phản hồi nhận xét sau khi hoàn thành.\n\nTrân trọng,\n${currentUser?.fullName || 'Giáo viên bộ môn'}`
                  }
                  onChange={e => setEmailContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleSendEmail(true)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở Ứng Dụng Email (mailto:)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendEmail(false)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Bài Trực Tuyến & Lưu Nhật Ký</span>
                </button>
              </div>
            </div>

            {/* Nhật ký gửi email */}
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-bold text-slate-200">
                📋 Nhật ký gửi bài qua email gần đây ({emailLogs.length})
              </h3>
              {emailLogs.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-500">
                  Chưa có email nào được gửi. Khi bạn nhấn "Gửi Bài Trực Tuyến", lịch sử sẽ lưu lại tại đây.
                </div>
              ) : (
                <div className="space-y-2">
                  {emailLogs.map(log => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-white">{log.subject}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Tới: {log.recipients.join(', ')} • {log.itemTitle}
                        </div>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {new Date(log.sentAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: QUẢN LÝ TÀI KHOẢN GIÁO VIÊN (DÀNH CHO ADMIN danghungit) */}
        {/* ==================================================================== */}
        {activeTab === 'teachers' && currentUser?.role === 'admin' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>👑 Quản Lý Tài Khoản Giáo Viên</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300">
                  {currentUser?.fullName || 'Ban Quản Trị'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Tạo mới và quản lý quyền hạn của các giáo viên trong trường để họ có thể soạn bài giảng, tạo lớp học ảo và chấm bài cho học sinh.
              </p>
            </div>

            {/* Hộp thông báo email đăng ký mới gửi tới mcpsoftware@gmail.com */}
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/80 text-xs text-cyan-200 flex items-start gap-3 shadow-md">
              <Mail className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Thông báo đăng ký Giáo viên tự động:</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-900 border border-cyan-700 text-cyan-200 font-mono text-[11px]">
                    mcpsoftware@gmail.com
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Mỗi khi có giáo viên đăng ký từ cổng đăng nhập, hệ thống tự động ghi nhật ký và gửi email thông báo tới <b className="text-cyan-300">mcpsoftware@gmail.com</b> kèm số điện thoại, email và môn giảng dạy. Quản trị viên xem xét duyệt kích hoạt tài khoản bên dưới để giáo viên có thể đăng nhập.
                </p>
              </div>
            </div>

            {teacherCreateMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                  teacherCreateMsg.success
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                    : 'bg-rose-950/60 border-rose-800 text-rose-200'
                }`}
              >
                {teacherCreateMsg.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{teacherCreateMsg.text}</span>
              </div>
            )}

            {/* DANH SÁCH GIÁO VIÊN ĐĂNG KÝ ĐANG CHỜ DUYỆT (PENDING) */}
            <div className="bg-slate-900 border border-amber-800/50 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                  <h3 className="font-bold text-sm text-amber-200">
                    Yêu cầu đăng ký Giáo viên đang chờ duyệt ({users.filter(u => u.status === 'pending').length})
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      addDemoPendingTeacher();
                      alert('Đã tạo một hồ sơ giáo viên mới chờ duyệt để bạn kiểm tra tính năng kích hoạt!');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-700 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tạo hồ sơ giáo viên chờ duyệt (Demo test)</span>
                  </button>
                  <span className="text-[11px] text-slate-400 hidden md:inline">
                    Cần Admin kích hoạt trước khi GV đăng nhập
                  </span>
                </div>
              </div>

              {users.filter(u => u.status === 'pending').length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 space-y-3">
                  <p>Hiện không có yêu cầu đăng ký giáo viên nào đang chờ duyệt. Tất cả tài khoản đã được xử lý.</p>
                  <button
                    type="button"
                    onClick={() => {
                      addDemoPendingTeacher();
                      alert('Đã tạo một hồ sơ giáo viên mới chờ duyệt để bạn kiểm tra tính năng kích hoạt!');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow transition active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo ngay 1 hồ sơ giáo viên đăng ký để kiểm tra</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {users
                    .filter(u => u.status === 'pending')
                    .map(pendingUser => (
                      <div
                        key={pendingUser.id}
                        className="p-4 rounded-xl bg-slate-950 border border-amber-900/40 hover:border-amber-700/60 transition shadow flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-sm">{pendingUser.fullName}</span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                              Chờ duyệt
                            </span>
                          </div>
                          <div className="text-slate-400 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Username:</span>
                            <span className="font-mono text-cyan-300 font-bold">{pendingUser.username}</span>
                          </div>
                          <div className="text-slate-400 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Số điện thoại:</span>
                            <span className="font-bold text-emerald-300">{pendingUser.phone || 'Chưa cung cấp'}</span>
                          </div>
                          <div className="text-slate-400 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-blue-400" />
                            <span>Email:</span>
                            <span className="text-slate-200">{pendingUser.email}</span>
                          </div>
                          <div className="text-slate-400 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                            <span>Môn phụ trách:</span>
                            <span className="text-amber-200 font-medium">{pendingUser.subject || 'Đa môn'}</span>
                          </div>
                          {pendingUser.createdAt && (
                            <div className="text-[10px] text-slate-500 pt-1">
                              Đăng ký lúc: {new Date(pendingUser.createdAt).toLocaleString('vi-VN')}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              approveTeacher(pendingUser.id);
                              alert(`Đã kích hoạt tài khoản cho giáo viên "${pendingUser.fullName}" thành công!`);
                            }}
                            className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center justify-center gap-1.5 active:scale-95 shadow"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Kích hoạt tài khoản</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              lockTeacher(pendingUser.id);
                            }}
                            className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                            title="Khóa tài khoản"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Bạn có chắc muốn xóa yêu cầu đăng ký của "${pendingUser.fullName}"?`)) {
                                deleteUser(pendingUser.id);
                              }
                            }}
                            className="py-1.5 px-2.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 transition"
                            title="Xóa yêu cầu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Form tạo giáo viên mới thủ công */}
            <form
              onSubmit={handleCreateTeacher}
              className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg space-y-4"
            >
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Thêm tài khoản Giáo viên mới thủ công:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Họ và tên giáo viên:</label>
                  <input
                    type="text"
                    required
                    value={newTeacherName}
                    onChange={e => setNewTeacherName(e.target.value)}
                    placeholder="Thầy Trần Minh Đức"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Tên đăng nhập (Username):</label>
                  <input
                    type="text"
                    required
                    value={newTeacherUser}
                    onChange={e => setNewTeacherUser(e.target.value)}
                    placeholder="tranminhduc"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Mật khẩu:</label>
                  <input
                    type="text"
                    required
                    value={newTeacherPass}
                    onChange={e => setNewTeacherPass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Email giáo viên:</label>
                  <input
                    type="email"
                    value={newTeacherEmail}
                    onChange={e => setNewTeacherEmail(e.target.value)}
                    placeholder="duc.tran@thcs.edu.vn"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Số điện thoại (SĐT):</label>
                  <input
                    type="tel"
                    value={newTeacherPhone}
                    onChange={e => setNewTeacherPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Môn phụ trách:</label>
                  <input
                    type="text"
                    value={newTeacherSubject}
                    onChange={e => setNewTeacherSubject(e.target.value)}
                    placeholder="Vật lí & KHTN"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div className="sm:col-span-2 md:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow transition active:scale-95"
                  >
                    + Tạo Tài Khoản Giáo Viên (Kích hoạt ngay)
                  </button>
                </div>
              </div>
            </form>

            {/* Bảng danh sách tất cả người dùng */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-sm text-white">Danh sách người dùng hệ thống</h3>
                <span className="text-xs text-slate-400">{users.length} tài khoản</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="p-3.5">Họ và tên</th>
                      <th className="p-3.5">Tên đăng nhập</th>
                      <th className="p-3.5">Mật khẩu</th>
                      <th className="p-3.5">Vai trò</th>
                      <th className="p-3.5">SĐT & Email</th>
                      <th className="p-3.5">Môn phụ trách</th>
                      <th className="p-3.5 text-center">Trạng thái</th>
                      <th className="p-3.5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-800/40">
                        <td className="p-3.5 font-bold text-white">{u.fullName}</td>
                        <td className="p-3.5 font-mono text-cyan-400">{u.username}</td>
                        <td className="p-3.5 font-mono text-slate-400">{u.password}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === 'admin'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                            }`}
                          >
                            {u.role === 'admin' ? 'Quản trị viên' : 'Giáo viên'}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-300">
                          <div>{u.email}</div>
                          {u.phone && <div className="text-[10px] text-emerald-400 font-mono mt-0.5">📞 {u.phone}</div>}
                        </td>
                        <td className="p-3.5 text-slate-300">{u.subject || '—'}</td>
                        <td className="p-3.5 text-center">
                          {u.status === 'pending' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                              Chờ duyệt
                            </span>
                          ) : u.isActive ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              Đang hoạt động
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                              Đã khóa
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {u.role !== 'admin' && (
                            <>
                              {u.status === 'pending' || !u.isActive ? (
                                <button
                                  type="button"
                                  onClick={() => approveTeacher(u.id)}
                                  className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 transition"
                                >
                                  Kích hoạt
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => lockTeacher(u.id)}
                                  className="px-2 py-1 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900 transition"
                                >
                                  Khóa
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Bạn có chắc muốn xóa tài khoản "${u.fullName}"?`)) {
                                    deleteUser(u.id);
                                  }
                                }}
                                className="px-2 py-1 rounded text-[10px] font-bold bg-slate-800 text-rose-400 hover:bg-rose-950 hover:border hover:border-rose-800 transition"
                                title="Xóa tài khoản"
                              >
                                Xóa
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==================================================================== */}
      {/* MODAL 1: TẠO LỚP HỌC ẢO MỚI */}
      {/* ==================================================================== */}
      {showCreateClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Tạo Lớp Học Ảo Mới</span>
            </h3>

            <form onSubmit={handleCreateClassroom} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Tên lớp học:</label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  placeholder="Ví dụ: Lớp 8A2 - KHTN Hóa học"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Khối lớp:</label>
                  <select
                    value={newClassGrade}
                    onChange={e => setNewClassGrade(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    {[6, 7, 8, 9, 10, 11, 12].map(g => (
                      <option key={g} value={g}>
                        Khối {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Môn học:</label>
                  <select
                    value={newClassSubject}
                    onChange={e => setNewClassSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="Khoa học tự nhiên">Khoa học tự nhiên</option>
                    <option value="Toán học">Toán học</option>
                    <option value="Vật lí">Vật lí</option>
                    <option value="Hóa học">Hóa học</option>
                    <option value="Hình học">Hình học</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Mô tả lớp học:</label>
                <textarea
                  rows={3}
                  value={newClassDesc}
                  onChange={e => setNewClassDesc(e.target.value)}
                  placeholder="Mô tả mục tiêu và nội dung học tập..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateClassModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  Tạo Lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: TẠO BÀI KIỂM TRA MỚI */}
      {/* ==================================================================== */}
      {activeClassroomForTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Thêm Bài Kiểm Tra vào {activeClassroomForTest.name}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Tiêu đề bài kiểm tra:</label>
                <input
                  type="text"
                  value={newTestTitle}
                  onChange={e => setNewTestTitle(e.target.value)}
                  placeholder="Ví dụ: Kiểm tra 15 phút: Cân bằng PTHH"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Thời gian làm bài (phút):</label>
                  <input
                    type="number"
                    min={5}
                    max={90}
                    value={newTestDuration}
                    onChange={e => setNewTestDuration(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Liên kết bài Lab thực hành:</label>
                  <select
                    value={newTestSimId}
                    onChange={e => setNewTestSimId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="chem-balancing-reactions">Hóa 8: Cân bằng PTHH</option>
                    <option value="phys-buoyancy-refraction">Lý 8: Ác-si-mét & Thấu kính</option>
                    <option value="math-identities-linear-func">Toán 8: Hằng đẳng thức & y=ax+b</option>
                    <option value="chem-atom-builder">Hóa 7: Cấu tạo nguyên tử</option>
                    <option value="math-inequalities-trig-circle">Toán 10: Lượng giác & BPT</option>
                  </select>
                </div>
              </div>

              {/* Danh sách câu hỏi trong bài */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="font-semibold text-slate-200">
                  Bộ câu hỏi kiểm tra ({newTestQuestions.length} câu):
                </div>
                {newTestQuestions.map((q, idx) => (
                  <div key={q.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-semibold text-white">
                      Câu {idx + 1} ({q.type === 'multiple-choice' ? 'Trắc nghiệm' : 'Tự luận'} - {q.points} điểm):{' '}
                      {q.question}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveClassroomForTest(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveTest}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  Lưu Đề Kiểm Tra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: GIAO DIỆN CHẤM BÀI CHO TỪNG HỌC SINH (TEACHER GRADING VIEW) */}
      {/* ==================================================================== */}
      {gradingContext && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  {gradingContext.classroom.name}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Chấm Bài Học Sinh: {gradingContext.submission.studentName}
                </h3>
                <p className="text-xs text-slate-400">
                  Bài kiểm tra: <strong>{gradingContext.test.title}</strong> • Nộp lúc:{' '}
                  {new Date(gradingContext.submission.submittedAt).toLocaleString('vi-VN')}
                </p>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Điểm trắc nghiệm tự động:</div>
                <div className="text-xl font-bold font-mono text-cyan-400">
                  {gradingContext.submission.autoScore} / {gradingContext.submission.maxScore}
                </div>
              </div>
            </div>

            {/* Chi tiết từng câu hỏi & câu trả lời của học sinh */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 text-xs">
              {gradingContext.test.questions.map((q, idx) => {
                const studentAns = gradingContext.submission.answers[q.id];
                const isCorrect = q.type === 'multiple-choice' && Number(studentAns) === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-slate-200">
                        Câu {idx + 1} ({q.points} điểm): {q.question}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          q.type === 'multiple-choice'
                            ? isCorrect
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        }`}
                      >
                        {q.type === 'multiple-choice'
                          ? isCorrect
                            ? `Đúng (+${q.points}đ)`
                            : 'Sai (0đ)'
                          : 'Câu tự luận'}
                      </span>
                    </div>

                    {/* Câu trả lời của học sinh */}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400 font-semibold mb-1">
                        Bài làm của học sinh:
                      </div>
                      <div className="text-slate-100 font-medium">
                        {q.type === 'multiple-choice' && q.options
                          ? `${String.fromCharCode(65 + Number(studentAns))}. ${q.options[Number(studentAns)] || 'Chưa chọn'}`
                          : String(studentAns || 'Chưa trả lời')}
                      </div>
                    </div>

                    {q.explanation && (
                      <div className="text-[11px] text-slate-400 italic">
                        💡 Đáp án tham chiếu: {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Khu vực cô giáo chấm điểm câu tự luận & viết nhận xét */}
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-900/60 space-y-3 text-xs">
              <div className="font-bold text-indigo-300 flex items-center justify-between">
                <span>✍️ Đánh giá và Chấm điểm của Giáo viên:</span>
                <span className="font-mono text-emerald-400 text-sm">
                  Tổng điểm dự kiến: {(gradingContext.submission.autoScore + Number(gradingManualScore)).toFixed(1)} /{' '}
                  {gradingContext.submission.maxScore}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Điểm tự luận (0 - 4đ):</label>
                  <input
                    type="number"
                    step={0.5}
                    min={0}
                    max={4}
                    value={gradingManualScore}
                    onChange={e => setGradingManualScore(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono font-bold text-center"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-slate-400 mb-1">Lời phê & Nhận xét của cô giáo:</label>
                  <input
                    type="text"
                    value={gradingFeedback}
                    onChange={e => setGradingFeedback(e.target.value)}
                    placeholder="Em làm bài rất tốt, câu tự luận giải thích chính xác hiện tượng..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setGradingContext(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveGrading}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg transition active:scale-95"
              >
                Lưu Điểm & Trả Bài Cho Học Sinh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
