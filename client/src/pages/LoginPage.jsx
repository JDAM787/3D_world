import React from 'react';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Button } from '@/components/ui/Button';

export function LoginPage({ onBackToHome, onLoginSuccess }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight">Bienvenido de nuevo</h2>
          <p className="text-xs text-slate-400 mt-1">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>

        <LoginForm onSuccess={onLoginSuccess} />

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <Button variant="ghost" size="sm" onClick={onBackToHome}>
            ← Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
