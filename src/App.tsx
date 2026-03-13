import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { useAuth } from './contexts/AuthContext';

type Page = 'landing' | 'auth' | 'dashboard';

function App() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  useEffect(() => {
    if (!loading) {
      if (user) {
        setCurrentPage('dashboard');
      } else if (currentPage === 'dashboard') {
        setCurrentPage('landing');
      }
    }
  }, [user, loading]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === 'auth' && <AuthPage onNavigate={handleNavigate} />}
      {currentPage === 'dashboard' && user && <Dashboard onNavigate={handleNavigate} />}
    </>
  );
}

export default App;
