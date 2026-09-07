import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

/**
 * Campo de texto reutilizable con soporte para etiquetas y mensajes de error
 */
export const Input = forwardRef(function Input(
  { label, error, className = '', id, type = 'text', ...props },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        type={type}
        className={cn(
          'w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm transition-colors duration-150 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50',
          error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
    </div>
  );
});

export default Input;
