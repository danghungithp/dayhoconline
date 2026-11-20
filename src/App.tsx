import React, { useState, useEffect, useCallback } from 'react';
import { HomePage } from './pages/HomePage';
import { SimulationPlayerPage } from './pages/SimulationPlayerPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ClassroomStudentPage } from './pages/classroom/ClassroomStudentPage';
import { LabDetailPage } from './pages/pseo/LabDetailPage';
import { SubjectHubPage } from './pages/pseo/SubjectHubPage';
import { GradeHubPage } from './pages/pseo/GradeHubPage';
import { readSimulationUrlParams } from './utils/presetCodec';
import { useAdminStore } from './core/store/adminStore';
import { SubjectId, GradeLevel } from './types/simulation.types';

export type AppView =
  | 'home'
  | 'player'
  | 'admin'
  | 'classroom'
  | 'pseo-lab'
  | 'pseo-subject'
  | 'pseo-grade';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeSimId, setActiveSimId] = useState<string>('chem-atom-builder');
  const [activeClassroomCode, setActiveClassroomCode] = useState<string>('STEM-8A1-4821');

  // pSEO State
  const [pseoSlug, setPseoSlug] = useState<string>('mo-phong-cau-tao-nguyen-tu-hoa-hoc-7');
  const [pseoSubject, setPseoSubject] = useState<SubjectId>('khtn');
  const [pseoGrade, setPseoGrade] = useState<GradeLevel>(7);

  const currentUser = useAdminStore(state => state.currentUser);

  // Parse path & searchParams từ URL
  const parseUrl = useCallback(() => {
    const pathname = window.location.pathname;
    const url = new URL(window.location.href);

    // 1. Programmatic SEO: /lab/[slug]
    if (pathname.startsWith('/lab/')) {
      const slug = pathname.replace('/lab/', '').replace(/\/$/, '');
      if (slug) {
        setPseoSlug(slug);
        setCurrentView('pseo-lab');
        return;
      }
    }

    // 2. Programmatic SEO: /mon/[subject]/lop-[grade]
    const gradeMatch = pathname.match(/^\/mon\/([^/]+)\/lop-(\d+)\/?$/);
    if (gradeMatch) {
      const sub = gradeMatch[1] as SubjectId;
      const grd = parseInt(gradeMatch[2], 10) as GradeLevel;
      setPseoSubject(sub);
      setPseoGrade(grd);
      setCurrentView('pseo-grade');
      return;
    }

    // 3. Programmatic SEO: /mon/[subject]
    const subjectMatch = pathname.match(/^\/mon\/([^/]+)\/?$/);
    if (subjectMatch) {
      const sub = subjectMatch[1] as SubjectId;
      setPseoSubject(sub);
      setCurrentView('pseo-subject');
      return;
    }

    // 4. Các view truyền thống qua Search Params (?sim=... / ?class=... / ?view=admin)
    const viewParam = url.searchParams.get('view');
    const classParam = url.searchParams.get('class');
    const adminParam = url.searchParams.get('admin');
    const { simId } = readSimulationUrlParams();

    if (classParam) {
      setActiveClassroomCode(classParam);
      setCurrentView('classroom');
    } else if (viewParam === 'classroom') {
      setCurrentView('classroom');
    } else if (viewParam === 'admin' || adminParam === '1') {
      setCurrentView('admin');
    } else if (simId) {
      setActiveSimId(simId);
      setCurrentView('player');
    } else {
      setCurrentView('home');
    }
  }, []);

  // Khởi tạo và lắng nghe nút Back/Forward
  useEffect(() => {
    parseUrl();
    const handlePopState = () => parseUrl();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parseUrl]);

  // Điều hướng nội bộ không reload trang (Client-side Router)
  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    parseUrl();
  };

  // Điều hướng vào bài mô phỏng
  const handleSelectSimulation = (simId: string) => {
    setActiveSimId(simId);
    setCurrentView('player');

    const url = new URL(window.location.href);
    url.searchParams.set('sim', simId);
    url.searchParams.delete('view');
    url.searchParams.delete('class');
    window.history.pushState({}, '', url.toString());
  };

  // Quay về Trang chủ
  const handleBackToCatalog = () => {
    setCurrentView('home');
    window.history.pushState({}, '', '/');
  };

  // Mở trang Admin
  const handleOpenAdmin = () => {
    setCurrentView('admin');
    window.history.pushState({}, '', '/?view=admin');
  };

  // Mở trang Lớp học ảo (học sinh)
  const handleOpenClassroom = (classroomCode?: string) => {
    if (classroomCode) {
      setActiveClassroomCode(classroomCode);
    }
    setCurrentView('classroom');
    const path = classroomCode ? `/?view=classroom&class=${classroomCode}` : '/?view=classroom';
    window.history.pushState({}, '', path);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {currentView === 'home' && (
        <HomePage
          onSelectSimulation={handleSelectSimulation}
          onOpenAdmin={handleOpenAdmin}
          onOpenClassroom={handleOpenClassroom}
        />
      )}

      {currentView === 'player' && (
        <SimulationPlayerPage
          simulationId={activeSimId}
          onBackToCatalog={handleBackToCatalog}
          onSelectSimulation={handleSelectSimulation}
        />
      )}

      {/* pSEO 1: Trang chi tiết bài Lab (/lab/[slug]) */}
      {currentView === 'pseo-lab' && (
        <LabDetailPage
          slug={pseoSlug}
          onNavigate={handleNavigate}
          onOpenPlayer={handleSelectSimulation}
        />
      )}

      {/* pSEO 2: Trang tổng hợp theo Môn (/mon/[subject]) */}
      {currentView === 'pseo-subject' && (
        <SubjectHubPage
          subject={pseoSubject}
          onNavigate={handleNavigate}
        />
      )}

      {/* pSEO 3: Trang tổng hợp theo Lớp (/mon/[subject]/lop-[grade]) */}
      {currentView === 'pseo-grade' && (
        <GradeHubPage
          subject={pseoSubject}
          grade={pseoGrade}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'admin' &&
        (currentUser ? (
          <AdminDashboardPage
            onBackToHome={handleBackToCatalog}
            onOpenClassroomStudent={handleOpenClassroom}
            onOpenSimulation={handleSelectSimulation}
          />
        ) : (
          <AdminLoginPage
            onLoginSuccess={() => setCurrentView('admin')}
            onBackToHome={handleBackToCatalog}
          />
        ))}

      {currentView === 'classroom' && (
        <ClassroomStudentPage
          initialCode={activeClassroomCode}
          onBackToHome={handleBackToCatalog}
          onOpenSimulation={handleSelectSimulation}
        />
      )}
    </div>
  );
}
