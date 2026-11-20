import React, { useState } from 'react';
import { useAdminStore } from '../../core/store/adminStore';
import { useTheme } from '../../core/theme/themeContext';
import { ShieldCheck, Lock, User, ArrowLeft, Sparkles, KeyRound, AlertCircle, CheckCircle } from 'lucide-react';

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

  const [username, setUsername] = useState('danghungit');
  const [password, setPassword] = useState('Danghungit@2025');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
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
      }, 500);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleQuickLogin = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    const res = login(user, pass);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onLoginSuccess();
      }, 400);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top back button */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
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

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative z-10">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-cyan-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-cyan-950/50 mb-3">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Đăng Nhập Quản Trị</h1>
          <p className="text-xs text-slate-400 mt-1">
            Dành cho Quản trị viên và Giáo viên phụ trách biên soạn & chấm bài
          </p>
        </div>

        {/* Quick test login buttons */}
        <div className="mb-5 p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5 text-cyan-400" /> Đăng nhập nhanh tài khoản mẫu:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('danghungit', 'Danghungit@2025')}
              className="px-2.5 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/80 rounded-lg text-xs font-semibold text-left transition active:scale-95"
            >
              👑 <strong>danghungit</strong>
              <div className="text-[10px] text-cyan-400/80 font-normal">Quản trị viên (Admin)</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('nguyenmaianh', 'Teacher@2025')}
              className="px-2.5 py-1.5 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/80 rounded-lg text-xs font-semibold text-left transition active:scale-95"
            >
              👩‍🏫 <strong>nguyenmaianh</strong>
              <div className="text-[10px] text-indigo-400/80 font-normal">Giáo viên KHTN</div>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/50 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg} Đang mở bảng điều khiển...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tên đăng nhập (Username):
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="danghungit hoặc tên đăng nhập GV"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
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
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mật khẩu của bạn"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-950/50 transition active:scale-98"
          >
            Đăng nhập vào Hệ Thống
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
          Tài khoản Admin được cấu hình sẵn: <br />
          User: <span className="text-cyan-400 font-mono">danghungit</span> | Mật khẩu: <span className="text-cyan-400 font-mono">Danghungit@2025</span>
        </div>
      </div>
    </div>
  );
};
