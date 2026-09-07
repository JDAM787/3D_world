import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProductCard } from '@/features/products/components/ProductCard';
import { formatCurrency } from '@/utils/formatters';

// Datos de demostración iniciales mientras el backend se conecta
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Teclado Mecánico Custom 75%',
    description: 'Switches lubricados, keycaps PBT doble inyección y conectividad inalámbrica tri-modo.',
    price: 149.99,
    category: 'Periféricos',
    stock: 12,
  },
  {
    id: '2',
    name: 'Monitor Gaming 27" QHD 180Hz',
    description: 'Panel IPS con cobertura 99% sRGB, tiempo de respuesta 1ms y compatibilidad G-Sync.',
    price: 299.99,
    category: 'Monitores',
    stock: 8,
  },
  {
    id: '3',
    name: 'Mouse Ergonómico Ultraligero',
    description: 'Sensor óptico de 26,000 DPI, peso ultraligero de 54g y batería de hasta 90 horas.',
    price: 79.99,
    category: 'Periféricos',
    stock: 25,
  },
];

export function HomePage({ onNavigateToLogin }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/60 to-slate-950 border border-slate-800 p-8 sm:p-12 text-center shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Arquitectura Feature-Driven + Layered Express
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
          Ecosistema Full-Stack <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Desacoplado</span>
        </h1>
        <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Frontend impulsado por React y Tailwind CSS estructurado por features, con un backend modular basado en controladores y servicios.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" onClick={onNavigateToLogin}>
            Iniciar Sesión
          </Button>
          <Button variant="secondary" onClick={() => window.open('https://github.com', '_blank')}>
            Documentación
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Catálogo de Productos</h2>
            <p className="text-xs text-slate-400">Módulo de demostración conectado a la feature de productos</p>
          </div>
          <span className="text-xs text-emerald-400 font-medium">3 artículos cargados</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PRODUCTS.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelect={(product) => setSelectedProduct(product)}
            />
          ))}
        </div>
      </section>

      {/* Modal de Detalle */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name || 'Detalle del Producto'}
      >
        {selectedProduct && (
          <div className="space-y-4">
            <p className="text-sm text-slate-300">{selectedProduct.description}</p>
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Precio unitario</span>
              <span className="text-lg font-bold text-emerald-400">
                {formatCurrency(selectedProduct.price)}
              </span>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedProduct(null)}>
                Cerrar
              </Button>
              <Button variant="primary" size="sm" onClick={() => setSelectedProduct(null)}>
                Comprar Ahora
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default HomePage;
