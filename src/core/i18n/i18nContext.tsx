import React, { createContext, useContext, useState, useEffect } from 'react';
import { SimulationMetadata, SubjectId } from '../../types/simulation.types';

export type Language = 'vi' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getLocalizedTitle: (sim: SimulationMetadata) => string;
  getLocalizedDescription: (sim: SimulationMetadata) => string;
  getSubjectName: (subject: SubjectId) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'dayhoc_language';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  vi: {
    // Brand & Header
    'brand.title': 'STEM & English Interactive Lab',
    'brand.badge': 'Chương trình Giáo dục Phổ thông 2018 (Lớp 6 – Lớp 12)',
    'brand.heroTitlePrefix': 'STEM & English',
    'brand.heroTitleSuffix': 'Interactive Lab',
    'brand.heroDescription': 'Nền tảng thí nghiệm ảo tương tác trực quan 60 FPS, khám phá hình học không gian 3D, vật lý cơ năng, liên kết hóa học và ngữ pháp tiếng Anh kèm Gia sư AI sư phạm Socratic.',
    
    // Stats
    'stats.totalTopics': 'Chủ đề GDPT',
    'stats.readyLabs': 'Mô phỏng sẵn sàng',
    'stats.thcs': 'THCS (Lớp 6-9)',
    'stats.thpt': 'THPT (Lớp 10-12)',

    // Filters
    'search.placeholder': 'Tìm bài học, chủ đề, mã GDPT, nguyên tử, ném xiên...',
    'filter.level': 'Cấp học:',
    'filter.all': 'Tất cả',
    'filter.thcs': 'THCS (Lớp 6–9)',
    'filter.thpt': 'THPT (Lớp 10–12)',
    'filter.grade': 'Lớp:',
    'filter.gradePrefix': 'Lớp',
    'filter.subject': 'Môn:',
    'filter.readyOnly': 'Chỉ bài có mô phỏng',
    'filter.reset': 'Xóa bộ lọc tìm kiếm',
    'filter.resetAll': 'Xóa toàn bộ bộ lọc',
    'catalog.title': 'Danh Sách Bài Thí Nghiệm & Mô Phỏng',
    'catalog.count': '{n} bài học',
    'catalog.ministryBadge': 'Chuẩn GDPT 2018 • Bộ GD&ĐT Việt Nam',
    'catalog.emptyTitle': 'Không tìm thấy bài mô phỏng phù hợp',
    'catalog.emptyDesc': 'Không có bài học nào khớp với bộ lọc cấp lớp hoặc từ khóa "{query}". Hãy thử điều chỉnh lại bộ lọc tìm kiếm.',

    // Card
    'card.ready': 'Sẵn sàng',
    'card.roadmap': 'Lộ trình GDPT',
    'card.enterLab': 'Vào học ngay',
    'card.objectives': 'Mục tiêu GDPT',
    'card.minutes': '{n} phút',
    'card.grade': 'Lớp {g} ({level})',

    // Modal GDPT
    'modal.objectivesTitle': 'Mục tiêu cần đạt theo GDPT 2018:',
    'modal.duration': 'Thời lượng đề xuất:',
    'modal.difficulty': 'Mức độ nhận thức:',
    'modal.close': 'Đóng',

    // Player & Toolbar
    'player.backCatalog': 'Thư viện bài học',
    'player.shareLink': 'Chia sẻ liên kết',
    'player.shareToast': 'Đã sao chép liên kết chia sẻ an toàn vào bộ nhớ tạm!',
    'player.presetBanner': 'Đã khôi phục thành công thông số mô phỏng từ liên kết giáo viên chia sẻ!',
    'player.bannerClose': 'Đóng',
    'player.loading': 'Đang khởi tạo môi trường mô phỏng tương tác 60 FPS...',
    'player.notReadyTitle': 'Lộ trình GDPT 2018 đang cập nhật',
    'player.notReadyDesc': 'Bài học này đang được đội ngũ sư phạm và kỹ sư tối ưu thuật toán mô phỏng theo chuẩn GDPT 2018.',
    'player.suggestions': 'Gợi ý các bài mô phỏng hoàn chỉnh có thể học ngay:',
    'player.viewAll': 'Xem toàn bộ danh mục bài học',

    // Sandbox Layout
    'sandbox.quests': 'Nhiệm vụ:',
    'sandbox.askAi': 'Hỏi AI Gia sư',
    'sandbox.annotation': 'Bút vẽ ghi chú',
    'sandbox.share': 'Chia sẻ trạng thái mô phỏng qua URL',
    'sandbox.reset': 'Khôi phục trạng thái ban đầu',
    'sandbox.fullscreen': 'Toàn màn hình',
    'sandbox.minimize': 'Thu nhỏ',
    'sandbox.tabControls': 'Bảng điều khiển',
    'sandbox.tabQuests': 'Nhiệm vụ',
    'sandbox.tabPresets': 'Mẫu sẵn',
    'sandbox.completed': 'Hoàn thành',
    'sandbox.hint': 'Gợi ý tư duy:',

    // Theme & Lang
    'theme.dark': 'Chế độ tối',
    'theme.light': 'Chế độ sáng',
    'lang.switch': 'English',

    // Subjects
    'subject.toan': 'Toán học',
    'subject.hinh-hoc': 'Hình học 3D',
    'subject.khtn': 'KHTN',
    'subject.vat-ly': 'Vật lý',
    'subject.hoa-hoc': 'Hóa học',
    'subject.tieng-anh': 'Tiếng Anh',

    // Tech
    'tech.three3d': 'Không gian 3D (Three.js)',
    'tech.graph': 'Đồ thị động (Mafs/Math)',
    'tech.speech-ai': 'Speech & AI Voice',
    'tech.canvas2d': 'Canvas 2D 60 FPS',
  },

  en: {
    // Brand & Header
    'brand.title': 'STEM & English Interactive Lab',
    'brand.badge': 'Vietnam National K-12 Curriculum (Grades 6–12)',
    'brand.heroTitlePrefix': 'STEM & English',
    'brand.heroTitleSuffix': 'Interactive Lab',
    'brand.heroDescription': 'An interactive 60 FPS virtual lab exploring 3D solid geometry, projectile kinematics, chemical bonding, and visual English grammar with Socratic AI Tutoring.',
    
    // Stats
    'stats.totalTopics': 'Curriculum Topics',
    'stats.readyLabs': 'Ready-to-use Labs',
    'stats.thcs': 'Secondary (Grades 6-9)',
    'stats.thpt': 'High School (Grades 10-12)',

    // Filters
    'search.placeholder': 'Search lessons, GDPT code, atoms, projectiles, parabolas...',
    'filter.level': 'School Level:',
    'filter.all': 'All',
    'filter.thcs': 'Lower Secondary (6–9)',
    'filter.thpt': 'Upper Secondary (10–12)',
    'filter.grade': 'Grade:',
    'filter.gradePrefix': 'Grade',
    'filter.subject': 'Subject:',
    'filter.readyOnly': 'Ready Labs Only',
    'filter.reset': 'Reset Search Filter',
    'filter.resetAll': 'Reset All Filters',
    'catalog.title': 'Interactive Science & Math Laboratories',
    'catalog.count': '{n} lessons',
    'catalog.ministryBadge': 'GDPT 2018 Standards • Ministry of Education',
    'catalog.emptyTitle': 'No matching simulations found',
    'catalog.emptyDesc': 'No lessons match the selected filters or search query "{query}". Please try resetting your search.',

    // Card
    'card.ready': 'Ready to Explore',
    'card.roadmap': 'Curriculum Roadmap',
    'card.enterLab': 'Enter Lab Now',
    'card.objectives': 'Learning Goals',
    'card.minutes': '{n} mins',
    'card.grade': 'Grade {g} ({level})',

    // Modal GDPT
    'modal.objectivesTitle': 'Learning Objectives & Competencies (GDPT 2018):',
    'modal.duration': 'Estimated Duration:',
    'modal.difficulty': 'Cognitive Level:',
    'modal.close': 'Close',

    // Player & Toolbar
    'player.backCatalog': 'Lesson Catalog',
    'player.shareLink': 'Share Link',
    'player.shareToast': 'Secure share link copied to clipboard!',
    'player.presetBanner': 'Successfully restored simulation parameters from teacher’s shared link!',
    'player.bannerClose': 'Dismiss',
    'player.loading': 'Initializing 60 FPS interactive environment...',
    'player.notReadyTitle': 'GDPT Curriculum Roadmap (In Development)',
    'player.notReadyDesc': 'This simulation module is currently being optimized by our pedagogical and engineering team according to GDPT 2018 standards.',
    'player.suggestions': 'Explore ready-to-use interactive modules right now:',
    'player.viewAll': 'View Full Lesson Catalog',

    // Sandbox Layout
    'sandbox.quests': 'Quests:',
    'sandbox.askAi': 'Ask AI Tutor',
    'sandbox.annotation': 'Teacher Pen',
    'sandbox.share': 'Share simulation state via URL',
    'sandbox.reset': 'Reset to initial state',
    'sandbox.fullscreen': 'Fullscreen',
    'sandbox.minimize': 'Exit Fullscreen',
    'sandbox.tabControls': 'Controls',
    'sandbox.tabQuests': 'Quests',
    'sandbox.tabPresets': 'Presets',
    'sandbox.completed': 'Completed',
    'sandbox.hint': 'Socratic Hint:',

    // Theme & Lang
    'theme.dark': 'Dark Mode',
    'theme.light': 'Light Mode',
    'lang.switch': 'Tiếng Việt',

    // Subjects
    'subject.toan': 'Mathematics',
    'subject.hinh-hoc': '3D Geometry',
    'subject.khtn': 'Natural Sciences',
    'subject.vat-ly': 'Physics',
    'subject.hoa-hoc': 'Chemistry',
    'subject.tieng-anh': 'English',

    // Tech
    'tech.three3d': '3D Space (Three.js)',
    'tech.graph': 'Interactive Graphs (MathJS)',
    'tech.speech-ai': 'Speech & AI Voice',
    'tech.canvas2d': 'Canvas 2D 60 FPS',
  },
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'vi' || stored === 'en') return stored;
      return navigator.language.startsWith('en') ? 'en' : 'vi';
    }
    return 'vi';
  });

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'vi' ? 'en' : 'vi'));
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = TRANSLATIONS[language][key] || TRANSLATIONS['vi'][key] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }
    return text;
  };

  const getLocalizedTitle = (sim: SimulationMetadata): string => {
    return language === 'en' && sim.titleEn ? sim.titleEn : sim.title;
  };

  const getLocalizedDescription = (sim: SimulationMetadata): string => {
    if (language === 'en') {
      // Map to English curriculum descriptions for active modules
      switch (sim.id) {
        case 'chem-atom-builder':
          return 'Assemble subatomic protons, neutrons, and electrons; discover atomic number Z, mass number A, net ion charges, nuclear stability, electron configurations (Aufbau), and covalent/ionic molecular bonds (H2, O2, H2O, CO2, NH3, CH4, NaCl).';
        case 'geom-quadrilaterals-thales-pyramids':
          return 'Interactive 3D geometry with OrbitControls: calculate exact base area, lateral area, total area, volume, slant height, and altitude. Experiment with real-time 0% to 100% 2D Net Unfolding for pyramids, prisms, cylinders, and cones.';
        case 'phys-projectile-collision-energy':
          return 'Simulate 2D projectile kinematics in vacuum and with quadratic aerodynamic drag (RK4 integration); analyze max height H_max, flight range, velocity components, kinetic/potential energy HUD, and planetary gravity presets (Earth, Moon, Mars, Jupiter).';
        case 'eng-present-simple-continuous':
        case 'eng-past-cont-conditionals-passive':
          return 'Interactive SVG visual timeline for 8 core English tenses; Lego block Active-to-Passive voice transformer with irregular verb conjugation and native English speech synthesis (en-US / en-GB).';
        case 'math-linear-systems-quadratic':
          return 'Explore systems of 2 linear equations via geometric line intersections and Cramer determinants; analyze parabolic functions y = ax^2 + bx + c, vertex coordinates, axis of symmetry, discriminant Delta, and tangent slopes.';
        default:
          return sim.description;
      }
    }
    return sim.description;
  };

  const getSubjectName = (subject: SubjectId): string => {
    return t(`subject.${subject}`);
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        getLocalizedTitle,
        getLocalizedDescription,
        getSubjectName,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export function useLanguage(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useLanguage must be used within an I18nProvider');
  }
  return context;
}
