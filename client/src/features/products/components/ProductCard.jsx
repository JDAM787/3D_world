import React from 'react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatters';

/**
 * Tarjeta de presentación para un producto individual
 */
export function ProductCard({ product, onSelect }) {
  return (
    <div className="group relative flex flex-col justify-between rounded-xl bg-slate-900 border border-slate-800 p-5 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {product.category || 'General'}
          </span>
          <span className="text-xs text-slate-400">Stock: {product.stock ?? 0}</span>
        </div>

        <h3 className="mt-3 text-base font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">
          {product.name}
        </h3>

        <p className="mt-2 text-xs text-slate-400 line-clamp-2">
          {product.description || 'Sin descripción disponible.'}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-lg font-bold text-slate-100">
          {formatCurrency(product.price || 0)}
        </span>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onSelect && onSelect(product)}
        >
          Ver Detalle
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;
