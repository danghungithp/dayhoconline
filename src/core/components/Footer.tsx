import React from 'react';
import { Sparkles, ExternalLink, BookOpen, Layers, Award, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 text-xs transition-colors font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
                STEM & English Lab
              </span>
            </div>
            <p className="text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400">
              Phòng thí nghiệm ảo tương tác 60 FPS chuẩn Chương trình Giáo dục Phổ thông 2018 (Lớp 6 - 12). Mô phỏng trực quan bám sát 3 bộ sách giáo khoa: Kết nối tri thức, Chân trời sáng tạo và Cánh diều.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Chuẩn Khung GDPT 2018 Bộ GD&ĐT</span>
            </div>
          </div>

          {/* Cột 2: Môn học GDPT */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-500" />
              <span>Thư viện Môn Học</span>
            </h4>
            <ul className="space-y-1.5 text-[11.5px]">
              <li>
                <a href="/mon/khtn" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">
                  Khoa học Tự nhiên (KHTN 6 - 9)
                </a>
              </li>
              <li>
                <a href="/mon/vat-ly" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">
                  Vật lý (Lớp 10 - 12)
                </a>
              </li>
              <li>
                <a href="/mon/hoa-hoc" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">
                  Hóa học (Lớp 10 - 12)
                </a>
              </li>
              <li>
                <a href="/mon/sinh-hoc" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">
                  Sinh học (Lớp 10 - 12)
                </a>
              </li>
              <li>
                <a href="/mon/toan" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">
                  Toán học & Hình học 3D
                </a>
              </li>
              <li>
                <a href="/mon/tieng-anh" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">
                  Tiếng Anh trực quan (Visual Grammar)
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Khối lớp & Bộ sách */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>Khối Lớp & SGK</span>
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                <a
                  key={grade}
                  href={`/mon/khtn/lop-${grade}`}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition font-mono"
                >
                  Lớp {grade}
                </a>
              ))}
            </div>
            <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <div className="font-semibold text-slate-700 dark:text-slate-300">3 Bộ Sách Giáo Khoa:</div>
              <div>• Sách Kết nối tri thức với cuộc sống</div>
              <div>• Sách Chân trời sáng tạo</div>
              <div>• Sách Cánh diều</div>
            </div>
          </div>

          {/* Cột 4: Hệ sinh thái liên kết (Cross-Linking SEO) */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Hệ Sinh Thái Liên Kết</span>
            </h4>
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>☕ CoffeeStockVN</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  Fintech
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Nền tảng phân tích kỹ thuật, toán tài chính định lượng, VSA Wyckoff và lọc cổ phiếu Việt Nam tự động.
              </p>
              <a
                href="https://coffeestockvn.cafe/"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1 text-[11px] text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
              >
                <span>Khám phá CoffeeStockVN</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bản quyền & Tuyên bố SEO */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-700 dark:text-slate-300">STEM & English Interactive Lab</strong>. Bản quyền thuộc về đội ngũ EdTech GDPT 2018.
          </div>
          <div className="flex items-center gap-4">
            <a href="https://lab.coffeestockvn.cafe/sitemap.xml" className="hover:text-cyan-400 transition underline">
              Sitemap XML
            </a>
            <a href="https://lab.coffeestockvn.cafe/robots.txt" className="hover:text-cyan-400 transition underline">
              Robots.txt
            </a>
            <a href="https://coffeestockvn.cafe/" target="_blank" rel="noopener" className="hover:text-cyan-400 transition">
              coffeestockvn.cafe
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
