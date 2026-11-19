import React, { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { SimulationPlayerPage } from './pages/SimulationPlayerPage';
import { readSimulationUrlParams } from './utils/presetCodec';
import { getSimulationById } from './core/registry/simulationRegistry';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'player'>('home');
  const [activeSimId, setActiveSimId] = useState<string>('chem-atom-builder');

  // Khởi tạo trạng thái ban đầu từ URL (?sim=...&preset=...)
  useEffect(() => {
    const { simId } = readSimulationUrlParams();
    if (simId) {
      setActiveSimId(simId);
      setCurrentView('player');
    } else {
      setCurrentView('home');
    }

    // Lắng nghe sự kiện nút Back/Forward của trình duyệt
    const handlePopState = () => {
      const { simId: popSimId } = readSimulationUrlParams();
      if (popSimId) {
        setActiveSimId(popSimId);
        setCurrentView('player');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Điều hướng vào bài mô phỏng
  const handleSelectSimulation = (simId: string) => {
    setActiveSimId(simId);
    setCurrentView('player');

    // Cập nhật URL trình duyệt không làm reload trang
    const url = new URL(window.location.href);
    url.searchParams.set('sim', simId);
    window.history.pushState({}, '', url.toString());
  };

  // Quay về Thư viện danh mục bài học
  const handleBackToCatalog = () => {
    setCurrentView('home');

    // Xóa param ?sim= và ?preset= trên thanh địa chỉ
    const url = new URL(window.location.href);
    url.searchParams.delete('sim');
    url.searchParams.delete('preset');
    window.history.pushState({}, '', url.pathname);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {currentView === 'home' ? (
        <HomePage onSelectSimulation={handleSelectSimulation} />
      ) : (
        <SimulationPlayerPage
          simulationId={activeSimId}
          onBackToCatalog={handleBackToCatalog}
          onSelectSimulation={handleSelectSimulation}
        />
      )}
    </div>
  );
}
