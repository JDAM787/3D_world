import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '../hooks/useAuth';

/**
 * Formulario de inicio de sesión de la feature Auth
 */
export function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      if (onSuccess) onSuccess();
    } catch (err) {
      // El error ya queda registrado en el hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm w-full mx-auto">
      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs">
          {error}
        </div>
      )}

      <Input
        label="Correo Electrónico"
        type="email"
        placeholder="tu@ejemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" variant="primary" className="w-full mt-2" disabled={isLoading}>
        {isLoading ? 'Iniciando sesión...' : 'Entrar'}
      </Button>
    </form>
  );
}

export default LoginForm;
