import React from 'react';
import { cn } from '@/utils/cn';

/**
 * Botón reutilizable estilizado con variantes Tailwind
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variants = {
    primary:
      'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/20 focus:ring-emerald-500',
    secondary:
      'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 focus:ring-slate-500',
    outline:
      'border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 focus:ring-emerald-500',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-lg shadow-rose-600/20',
    ghost:
      'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 focus:ring-slate-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
