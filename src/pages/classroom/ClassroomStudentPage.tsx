import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../core/store/adminStore';
import { VirtualClassroom, ClassroomTest } from '../../types/admin.types';
import confetti from 'canvas-confetti';
import {
  Users,
  GraduationCap,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  ArrowLeft,
  FlaskConical,
  Sparkles,
  Send,
  Award,
  BookOpen,
} from 'lucide-react';

interface ClassroomStudentPageProps {
  initialCode?: string;
  onBackToHome: () => void;
  onOpenSimulation: (simId: string) => void;
}

export const ClassroomStudentPage: React.FC<ClassroomStudentPageProps> = ({
  initialCode = '',
  onBackToHome,
  onOpenSimulation,
}) => {
  const getClassroomByCode = useAdminStore(state => state.getClassroomByCode);
  const submitStudentTest = useAdminStore(state => state.submitStudentTest);

  // States
  const [classCode, setClassCode] = useState(initialCode || 'STEM-8A1-4821');
  const [studentName, setStudentName] = useState('Nguyễn Văn An');
  const [studentEmail, setStudentEmail] = useState('');
  const [joinedClassroom, setJoinedClassroom] = useState<VirtualClassroom | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Active Test taking
  const [activeTest, setActiveTest] = useState<ClassroomTest | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, any>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);

  // Auto-join if initialCode provided
  useEffect(() => {
    if (initialCode) {
      const cls = getClassroomByCode(initialCode);
      if (cls) {
        setJoinedClassroom(cls);
      }
    }
  }, [initialCode, getClassroomByCode]);

  // Timer countdown
  useEffect(() => {
    if (!activeTest || isTestSubmitted || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTest, isTestSubmitted, timeLeftSeconds]);

  // Tham gia lớp học
  const handleJoinClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!classCode.trim()) {
      setErrorMessage('Vui lòng nhập Mã Code lớp học.');
      return;
    }
    if (!studentName.trim()) {
      setErrorMessage('Vui lòng nhập Họ và tên của em.');
      return;
    }

    const found = getClassroomByCode(classCode.trim());
    if (found) {
      setJoinedClassroom(found);
    } else {
      setErrorMessage(`Không tìm thấy lớp học có mã "${classCode.trim().toUpperCase()}". Em hãy kiểm tra lại mã cô giáo gửi nhé!`);
    }
  };

  // Bắt đầu làm bài kiểm tra
  const handleStartTest = (test: ClassroomTest) => {
    setActiveTest(test);
    setTimeLeftSeconds(test.durationMinutes * 60);
    setStudentAnswers({});
    setIsTestSubmitted(false);
  };

  // Nộp bài kiểm tra
  const handleSubmitTest = () => {
    if (!activeTest || !joinedClassroom) return;

    submitStudentTest(joinedClassroom.id, activeTest.id, {
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim() || undefined,
      answers: studentAnswers,
    });

    setIsTestSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const handleAutoSubmit = () => {
    handleSubmitTest();
  };

  // Đổi câu trả lời
  const handleAnswerChange = (questionId: string, value: any) => {
    setStudentAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (activeTest) {
                  setActiveTest(null);
                } else if (joinedClassroom) {
                  setJoinedClassroom(null);
                } else {
                  onBackToHome();
                }
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-white leading-tight">
                  Lớp Học Ảo Trực Tuyến
                </h1>
                <p className="text-[11px] text-slate-400">
                  Phòng thi trực tuyến & Nộp bài cho Giáo viên
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onBackToHome}
            className="text-xs text-slate-400 hover:text-white transition"
          >
            Về Trang Chủ Thư Viện
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* MÀN HÌNH 1: NHẬP MÃ CODE THAM GIA LỚP */}
        {!joinedClassroom && (
          <div className="max-w-md mx-auto my-10 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-indigo-950/80 border border-indigo-700/60 rounded-2xl mx-auto flex items-center justify-center text-indigo-400">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Tham Gia Lớp Học Ảo</h2>
              <p className="text-xs text-slate-400">
                Nhập mã Code cô giáo cung cấp để vào lớp làm bài kiểm tra và nhận điểm số
              </p>
            </div>

            {/* Gợi ý mã mẫu */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-400">
                Mã lớp học mẫu có sẵn để thử nghiệm:
              </div>
              <button
                type="button"
                onClick={() => setClassCode('STEM-8A1-4821')}
                className="w-full text-left p-2 rounded bg-cyan-950/40 border border-cyan-800/80 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-900/50 transition flex justify-between items-center"
              >
                <span>STEM-8A1-4821</span>
                <span className="text-[10px] text-cyan-400/80 font-sans font-normal">
                  (Lớp 8A1 - KHTN)
                </span>
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleJoinClassroom} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1.5 font-semibold">
                  Mã Code lớp học (do cô giáo gửi):
                </label>
                <input
                  type="text"
                  required
                  value={classCode}
                  onChange={e => setClassCode(e.target.value.toUpperCase())}
                  placeholder="Ví dụ: STEM-8A1-4821"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-cyan-300 font-mono font-bold tracking-wider uppercase focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-semibold">
                  Họ và tên học sinh:
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-semibold">
                  Email học sinh (để nhận kết quả):
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={e => setStudentEmail(e.target.value)}
                  placeholder="an.nguyen@gmail.com (tùy chọn)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-cyan-950/50 transition active:scale-98"
              >
                Vào Lớp Học Ảo Ngay ➔
              </button>
            </form>
          </div>
        )}

        {/* MÀN HÌNH 2: BẢNG TIN LỚP HỌC & DANH SÁCH BÀI KIỂM TRA (KHI ĐÃ THAM GIA) */}
        {joinedClassroom && !activeTest && (
          <div className="space-y-6">
            {/* Banner lớp học */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                    Khối {joinedClassroom.grade} • {joinedClassroom.subject}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Mã lớp: {joinedClassroom.code}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1.5">{joinedClassroom.name}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Giáo viên: <strong className="text-slate-200">{joinedClassroom.teacherName}</strong> • {joinedClassroom.description}
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-right">
                <div className="text-[11px] text-slate-400">Học sinh đang tham gia:</div>
                <div className="font-bold text-sm text-cyan-400">{studentName}</div>
              </div>
            </div>

            {/* Danh sách các bài kiểm tra */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Danh sách Bài kiểm tra của lớp ({joinedClassroom.tests.length}):</span>
              </h3>

              {joinedClassroom.tests.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-500">
                  Lớp học hiện tại chưa có bài kiểm tra nào. Em hãy đợi cô giáo giao bài nhé!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {joinedClassroom.tests.map(test => {
                    // Kiểm tra xem học sinh này đã nộp bài chưa
                    const mySubmission = test.submissions.find(
                      s => s.studentName.toLowerCase() === studentName.toLowerCase()
                    );

                    return (
                      <div
                        key={test.id}
                        className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{test.durationMinutes} phút</span>
                            </span>
                            <span>{test.questions.length} câu hỏi</span>
                          </div>

                          <h4 className="font-bold text-base text-white">{test.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2">{test.description}</p>
                        </div>

                        {/* Lab liên kết */}
                        {test.associatedSimId && (
                          <div className="pt-2 border-t border-slate-800/80">
                            <button
                              onClick={() => onOpenSimulation(test.associatedSimId!)}
                              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5"
                            >
                              <FlaskConical className="w-3.5 h-3.5" />
                              <span>Mở phòng Lab mô phỏng thực hành trước khi làm bài</span>
                            </button>
                          </div>
                        )}

                        {/* Trạng thái bài làm của học sinh */}
                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                          {mySubmission ? (
                            <div className="w-full space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Đã nộp bài</span>
                                </span>
                                <span className="font-mono font-bold text-sm text-cyan-400">
                                  {mySubmission.isGraded
                                    ? `Điểm: ${mySubmission.totalScore} / ${mySubmission.maxScore}`
                                    : `Trắc nghiệm: ${mySubmission.autoScore}đ (Chờ cô chấm tự luận)`}
                                </span>
                              </div>

                              {/* Lời nhận xét của cô giáo nếu đã chấm */}
                              {mySubmission.teacherFeedback && (
                                <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-800/80 text-xs text-indigo-200">
                                  👩‍🏫 <strong>Lời phê của cô:</strong> "{mySubmission.teacherFeedback}"
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartTest(test)}
                              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-98"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Bắt Đầu Làm Bài Kiểm Tra</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MÀN HÌNH 3: GIAO DIỆN LÀM BÀI KIỂM TRA TRỰC TUYẾN */}
        {activeTest && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header bài thi & Đồng hồ đếm ngược */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex items-center justify-between sticky top-16 z-30 backdrop-blur">
              <div>
                <h3 className="font-bold text-base text-white">{activeTest.title}</h3>
                <p className="text-xs text-slate-400">
                  Học sinh: <strong className="text-cyan-400">{studentName}</strong> • {activeTest.questions.length} câu hỏi
                </p>
              </div>

              {/* Timer */}
              {!isTestSubmitted && (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 font-mono font-bold text-sm">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>
                    {Math.floor(timeLeftSeconds / 60)}:
                    {(timeLeftSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>

            {/* Khi đã nộp bài */}
            {isTestSubmitted ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-emerald-800/80 shadow-2xl text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-600 rounded-full mx-auto flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-white">Nộp Bài Kiểm Tra Thành Công!</h2>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Hệ thống đã ghi nhận bài làm của em <strong>{studentName}</strong>. Bài làm đã được chuyển đến giáo viên để chấm điểm.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => setActiveTest(null)}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow"
                  >
                    Quay về Bảng tin Lớp học
                  </button>
                </div>
              </div>
            ) : (
              /* Danh sách các câu hỏi để học sinh làm bài */
              <div className="space-y-5">
                {activeTest.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow space-y-3"
                  >
                    <div className="font-bold text-sm text-white">
                      Câu {idx + 1} ({q.points} điểm): {q.question}
                    </div>

                    {/* Câu hỏi trắc nghiệm */}
                    {q.type === 'multiple-choice' && q.options && (
                      <div className="space-y-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = studentAnswers[q.id] === optIdx;
                          return (
                            <label
                              key={optIdx}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${
                                isSelected
                                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 font-semibold'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q-${q.id}`}
                                checked={isSelected}
                                onChange={() => handleAnswerChange(q.id, optIdx)}
                                className="accent-cyan-500"
                              />
                              <span>
                                <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* Câu hỏi tự luận */}
                    {q.type === 'essay' && (
                      <div className="pt-1">
                        <textarea
                          rows={4}
                          value={studentAnswers[q.id] || ''}
                          onChange={e => handleAnswerChange(q.id, e.target.value)}
                          placeholder="Em hãy viết câu trả lời / lời giải thích chi tiết vào đây..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    )}
                  </div>
                ))}

                {/* Nút Nộp Bài */}
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSubmitTest}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-cyan-950/50 transition active:scale-95 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Nộp Bài Kiểm Tra Cho Cô Giáo</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
