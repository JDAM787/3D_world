import React, { useState } from 'react';

const FORM_FIELDS = [
  { id: 'field-1', label: 'Email', type: 'email' },
  { id: 'field-2', label: 'Contraseña', type: 'password' },
  { id: 'field-3', label: 'Confirmar contraseña', type: 'password', registerOnly: true },
];

const SOCIAL_ITEMS = [
  { id: 'social-g', label: 'G' },
  { id: 'social-f', label: 'f' },
  { id: 'social-x', label: 'X' },
];

export function RegisterPage({
  mode: controlledMode,
  onNavigateMode,
  onNavigateHome,
}) {
  const [internalMode, setInternalMode] = useState('register');
  const mode = controlledMode || internalMode;
  const isLogin = mode === 'login';

  const [formData, setFormData] = useState({
    'field-1': '',
    'field-2': '',
    'field-3': '',
    terms: false,
    remember: false,
  });

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleSwitchMode = (newMode) => {
    if (onNavigateMode) {
      onNavigateMode(newMode);
    } else {
      setInternalMode(newMode);
    }
  };

  return (
    <section className="flex flex-1 items-center justify-center bg-gray-900 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-6">
        {onNavigateHome && (
          <div>
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs text-gray-400 transition-colors hover:text-white"
            >
              ← Volver
            </button>
          </div>
        )}

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-white">
            {isLogin ? 'Login' : 'Registro'}
          </h1>
          <p className="text-xs text-gray-400">
            {isLogin ? (
              <>
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('register')}
                  className="text-gray-300 underline transition-colors hover:text-white"
                >
                  Registro
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="text-gray-300 underline transition-colors hover:text-white"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {FORM_FIELDS.filter((field) => !isLogin || !field.registerOnly).map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="mb-1 block text-xs font-medium text-gray-400"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  value={formData[field.id]}
                  onChange={handleChange(field.id)}
                  className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-gray-500 focus:outline-none"
                />
              </div>
            ))}
          </div>

          {isLogin ? (
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange('remember')}
                  className="h-4 w-4 rounded border border-gray-700 bg-gray-800 text-gray-200 accent-gray-500"
                />
                <label htmlFor="remember" className="text-xs text-gray-400">
                  Recordar sesión
                </label>
              </div>
              <a
                href="#"
                className="text-xs text-gray-400 underline transition-colors hover:text-white"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-2 pt-1">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange('terms')}
                className="h-4 w-4 rounded border border-gray-700 bg-gray-800 text-gray-200 accent-gray-500"
              />
              <label htmlFor="terms" className="text-xs text-gray-400">
                Terminos y condiciones
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200"
          >
            {isLogin ? 'Iniciar sesión' : 'Registrarse'}
          </button>
        </form>

        <div className="space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-gray-800" />
            <span className="shrink-0 px-3 text-xs text-gray-500">
              {isLogin ? 'Inicia sesión también con:' : 'Registrate tambien con:'}
            </span>
            <div className="w-full border-t border-gray-800" />
          </div>

          <div className="flex items-center justify-center gap-3">
            {SOCIAL_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export const AuthPage = RegisterPage;
export default RegisterPage;
