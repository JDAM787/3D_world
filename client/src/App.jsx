import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { RegisterPage } from '@/pages/RegisterPage';
import { StoreCatalog } from '@/components/StoreCatalog';

export function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar
        currentView={currentView}
        onHomeClick={() => setCurrentView('home')}
        onLoginClick={() => setCurrentView('login')}
        onRegisterClick={() => setCurrentView('register')}
      />
      <main className="flex flex-1 flex-col bg-gray-900">
        {currentView === 'home' && <Hero />}
        {(currentView === 'register' || currentView === 'login') && (
          <RegisterPage
            mode={currentView}
            onNavigateMode={(newMode) => setCurrentView(newMode)}
            onNavigateHome={() => setCurrentView('home')}
            onLoginSuccess={() => setCurrentView('store')}
          />
        )}
        {currentView === 'store' && (
          <StoreCatalog onNavigateHome={() => setCurrentView('home')} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
