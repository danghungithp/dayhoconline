import React, { useState } from 'react';
import { useAdminStore } from '../../core/store/adminStore';
import { useTheme } from '../../core/theme/themeContext';
import {
  sendTeacherRegistrationEmail,
  getMailtoUrlForAdminNotification,
} from '../../services/emailService';
import {
  ShieldCheck,
  Lock,
  User,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Phone,
  Mail,
  BookOpen,
  UserPlus,
  Send,
  ExternalLink,
} from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToHome,
}) => {
  const { theme } = useTheme();
  const login = useAdminStore(state => state.login);
  const registerTeacher = useAdminStore(state => state.registerTeacher);

  // Tab: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSubject, setRegSubject] = useState('Khoa học tự nhiên');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regSubmittedSuccess, setRegSubmittedSuccess] = useState(false);

  // Xử lý đăng nhập
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim() || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    const res = login(username.trim(), password);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onLoginSuccess();
      }, 400);
    } else {
      setErrorMsg(res.message);
    }
  };

  // Xử lý đăng ký giáo viên
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regFullName.trim() || !regEmail.trim() || !regPhone.trim() || !regUsername.trim() || !regPassword) {
      setErrorMsg('Vui lòng điền đầy đủ tất cả các trường thông tin.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp với mật khẩu đã nhập.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Mật khẩu phải có độ dài ít nhất 6 ký tự.');
      return;
    }

    setIsSubmittingRegister(true);

    try {
      // 1. Gửi email thông báo thực tế tới mcpsoftware@gmail.com
      await sendTeacherRegistrationEmail({
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        subject: regSubject,
        username: regUsername.trim(),
      });

      // 2. Lưu giáo viên vào store ở trạng thái pending
      const res = registerTeacher({
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        subject: regSubject,
        username: regUsername.trim(),
        password: regPassword,
      });

      if (res.success) {
        setRegSubmittedSuccess(true);
        setSuccessMsg(res.message);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      console.warn('Lỗi khi đăng ký:', err);
      // Vẫn đăng ký vào store nếu lỗi mạng
      const res = registerTeacher({
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        subject: regSubject,
        username: regUsername.trim(),
        password: regPassword,
      });
      if (res.success) {
        setRegSubmittedSuccess(true);
      } else {
        setErrorMsg(res.message);
      }
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top back button */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition py-1 px-2.5 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </button>
        <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Hệ Thống Quản Trị & Giáo Viên
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative z-10 space-y-5">
        <div className="text-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-cyan-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-cyan-950/50 mb-3">
            {activeTab === 'login' ? (
              <ShieldCheck className="w-8 h-8 text-white" />
            ) : (
              <UserPlus className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {activeTab === 'login' ? 'Đăng Nhập Quản Trị' : 'Đăng Ký Tài Khoản Giáo Viên'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {activeTab === 'login'
              ? 'Dành cho Quản trị viên và Giáo viên phụ trách biên soạn & chấm bài'
              : 'Tạo tài khoản giáo viên mới. Hồ sơ sẽ được gửi đến Ban Quản Trị để xét duyệt'}
          </p>
        </div>

        {/* Tab Switcher: Đăng Nhập vs Đăng Ký */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'login'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Đăng Ký Giáo Viên Mới
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ================================================================= */}
        {/* FORM 1: ĐĂNG NHẬP */}
        {/* ================================================================= */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tên đăng nhập (Username):
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoComplete="off"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập của bạn"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mật khẩu:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-950/50 transition active:scale-98"
            >
              Đăng nhập vào Hệ Thống
            </button>
          </form>
        )}

        {/* ================================================================= */}
        {/* FORM 2: ĐĂNG KÝ TÀI KHOẢN GIÁO VIÊN */}
        {/* ================================================================= */}
        {activeTab === 'register' && (
          <div>
            {regSubmittedSuccess ? (
              <div className="p-5 bg-slate-950/90 rounded-2xl border border-emerald-700/80 text-center space-y-4 shadow-xl">
                <div className="w-14 h-14 bg-emerald-950 border border-emerald-500 rounded-full mx-auto flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/50">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Hồ Sơ Đã Được Gửi Phê Duyệt!</h3>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-bold inline-block mt-1">
                    Trạng thái: Chờ duyệt kích hoạt
                  </span>
                </div>
                
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-left text-xs space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Giáo viên:</span>
                    <span className="font-bold text-white">{regFullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-cyan-300 font-mono">{regEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Số điện thoại:</span>
                    <span className="text-emerald-300 font-mono">{regPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Môn giảng dạy:</span>
                    <span className="text-amber-200">{regSubject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Username đăng nhập:</span>
                    <span className="text-white font-mono font-bold">{regUsername}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">Hòm thư nhận thông báo:</span>
                    <span className="text-cyan-400 font-mono font-bold">mcpsoftware@gmail.com</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Thông tin đăng ký của thầy/cô đã được chuyển tiếp đến Ban Quản Trị tại hộp thư: <strong className="text-cyan-400 font-mono">mcpsoftware@gmail.com</strong>. Quản trị viên hệ thống sẽ duyệt kích hoạt tài khoản trong mục Quản trị Users.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <a
                    href={getMailtoUrlForAdminNotification({
                      fullName: regFullName,
                      email: regEmail,
                      phone: regPhone,
                      subject: regSubject,
                      username: regUsername,
                    })}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Mở ứng dụng Email gửi Admin</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setRegSubmittedSuccess(false);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow transition"
                  >
                    Về Màn Hình Đăng Nhập
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">
                      Họ và tên giáo viên:
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regFullName}
                        onChange={e => setRegFullName(e.target.value)}
                        placeholder="Cô Nguyễn Hoàng Yến"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">
                      Số điện thoại (SĐT):
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={e => setRegPhone(e.target.value)}
                        placeholder="0987654321"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">
                      Email liên hệ:
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="giaovien@truong.edu.vn"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">
                      Môn giảng dạy:
                    </label>
                    <div className="relative">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={regSubject}
                        onChange={e => setRegSubject(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Khoa học tự nhiên">Khoa học tự nhiên (KHTN)</option>
                        <option value="Toán học">Toán học</option>
                        <option value="Vật lí">Vật lí</option>
                        <option value="Hóa học">Hóa học</option>
                        <option value="Sinh học">Sinh học</option>
                        <option value="Tin học">Tin học</option>
                        <option value="Địa lý">Địa lý</option>
                        <option value="Lịch sử">Lịch sử</option>
                        <option value="Công nghệ">Công nghệ</option>
                        <option value="Tiếng Anh">Tiếng Anh</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    Tên đăng nhập (Username):
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={e => setRegUsername(e.target.value.toLowerCase())}
                      placeholder="nguyenhoangyen (viết liền không dấu)"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">
                      Mật khẩu:
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={regShowPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder="Ít nhất 6 ký tự"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-8 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => setRegShowPassword(!regShowPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
                      >
                        {regShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">
                      Xác nhận mật khẩu:
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={regShowPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={e => setRegConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                  ℹ️ Sau khi nhấn đăng ký, hệ thống sẽ tự động gửi email thông báo tới <strong className="text-cyan-300">mcpsoftware@gmail.com</strong> để kích hoạt tài khoản của thầy/cô.
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRegister}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-950/50 transition active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmittingRegister ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang gửi hồ sơ & email thông báo...</span>
                    </>
                  ) : (
                    <span>Gửi Hồ Sơ Đăng Ký Giáo Viên</span>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
