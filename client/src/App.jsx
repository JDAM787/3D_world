import React, { useState } from 'react';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { Button } from '@/components/ui/Button';

export function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userSession, setUserSession] = useState(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUserSession(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Barra de navegación superior */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentPage('home')}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              FS
            </div>
            <span className="font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              FullStack<span className="text-emerald-400">Core</span>
            </span>
          </div>

          <nav className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('home')}
              className={`text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                currentPage === 'home'
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Inicio
            </button>

            {userSession ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-300 hidden sm:inline">
                  Hola, <strong className="text-white">{userSession.name || userSession.email}</strong>
                </span>
                <Button size="sm" variant="secondary" onClick={handleLogout}>
                  Salir
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant={currentPage === 'login' ? 'outline' : 'primary'}
                onClick={() => setCurrentPage('login')}
              >
                Acceder
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {currentPage === 'home' && (
          <HomePage onNavigateToLogin={() => setCurrentPage('login')} />
        )}
        {currentPage === 'login' && (
          <LoginPage
            onBackToHome={() => setCurrentPage('home')}
            onLoginSuccess={() => {
              const saved = localStorage.getItem('auth_user');
              if (saved) setUserSession(JSON.parse(saved));
              setCurrentPage('home');
            }}
          />
        )}
      </main>

      {/* Pie de página */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} FullStack Core • React + Tailwind CSS & Node.js Express</p>
      </footer>
    </div>
  );
}

export default App;
