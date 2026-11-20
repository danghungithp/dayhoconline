import React, { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { SimulationPlayerPage } from './pages/SimulationPlayerPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ClassroomStudentPage } from './pages/classroom/ClassroomStudentPage';
import { readSimulationUrlParams } from './utils/presetCodec';
import { useAdminStore } from './core/store/adminStore';

export type AppView = 'home' | 'player' | 'admin' | 'classroom';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeSimId, setActiveSimId] = useState<string>('chem-atom-builder');
  const [activeClassroomCode, setActiveClassroomCode] = useState<string>('STEM-8A1-4821');

  const currentUser = useAdminStore(state => state.currentUser);

  // Khởi tạo trạng thái ban đầu từ URL (?sim=... & ?view=... & ?class=...)
  useEffect(() => {
    const parseUrlView = () => {
      const url = new URL(window.location.href);
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
    };

    parseUrlView();

    // Lắng nghe sự kiện nút Back/Forward của trình duyệt
    const handlePopState = () => {
      parseUrlView();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  // Quay về Thư viện danh mục bài học
  const handleBackToCatalog = () => {
    setCurrentView('home');

    const url = new URL(window.location.href);
    url.searchParams.delete('sim');
    url.searchParams.delete('preset');
    url.searchParams.delete('view');
    url.searchParams.delete('class');
    window.history.pushState({}, '', url.pathname);
  };

  // Mở trang Admin
  const handleOpenAdmin = () => {
    setCurrentView('admin');
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'admin');
    url.searchParams.delete('sim');
    url.searchParams.delete('class');
    window.history.pushState({}, '', url.toString());
  };

  // Mở trang Lớp học ảo (học sinh)
  const handleOpenClassroom = (classroomCode?: string) => {
    if (classroomCode) {
      setActiveClassroomCode(classroomCode);
    }
    setCurrentView('classroom');
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'classroom');
    if (classroomCode) {
      url.searchParams.set('class', classroomCode);
    }
    url.searchParams.delete('sim');
    window.history.pushState({}, '', url.toString());
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
