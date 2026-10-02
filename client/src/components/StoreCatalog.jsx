import React, { useState } from 'react';
import { ProductCard } from './ProductCard';

const CATEGORIES = ['View All', 'Category 1', 'Category 2', 'Category 3'];

const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'Lorem Ipsum Product 1',
    specs: 'Lorem specs / material',
    price: '$19.99',
  },
  {
    id: 'prod-2',
    title: 'Lorem Ipsum Product 2',
    specs: 'Lorem specs / material',
    price: '$4.99',
  },
  {
    id: 'prod-3',
    title: 'Lorem Ipsum Product 3',
    specs: 'Lorem specs / material',
    price: '$28.99',
  },
  {
    id: 'prod-4',
    title: 'Lorem Ipsum Product 4',
    specs: 'Lorem specs / material',
    price: '$8.00',
  },
  {
    id: 'prod-5',
    title: 'Lorem Ipsum Product 5',
    specs: 'Lorem specs / material',
    price: '$500.00',
  },
  {
    id: 'prod-6',
    title: 'Lorem Ipsum Product 6',
    specs: 'Lorem specs / material',
    price: '$24.99',
  },
];

export function StoreCatalog({ onNavigateHome }) {
  const [activeCategory, setActiveCategory] = useState('View All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <section className="w-full border-t border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl">
        {onNavigateHome && (
          <div className="mb-4">
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs text-gray-400 transition-colors hover:text-white"
            >
              ← Volver
            </button>
          </div>
        )}

        {/* Encabezado */}
        <div className="mb-8 space-y-2 text-center">
          <h2 className="text-3xl font-extrabold tracking-widest text-white uppercase sm:text-4xl">
            Store
          </h2>
          <p className="text-xs tracking-wider text-gray-400 uppercase">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* Filtro horizontal de categorías */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-6 border-b border-gray-800 pb-4">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`pb-1 text-xs font-medium uppercase tracking-wider transition-colors ${
                activeCategory === category
                  ? 'border-b-2 border-white text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sub-encabezado y Barra de control */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              Lorem Ipsum
            </h3>
            <p className="text-xs text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Lorem ipsum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-44 rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none sm:w-56"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-white focus:border-gray-500 focus:outline-none"
            >
              <option value="default">Lorem ipsum (Default)</option>
              <option value="price-asc">Lorem: Low to High</option>
              <option value="price-desc">Lorem: High to Low</option>
            </select>
          </div>
        </div>

        {/* Cuadrícula responsiva de tarjetas */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              specs={product.specs}
              price={product.price}
              ctaText="Ver detalle"
            />
          ))}
        </div>

        {/* Paginación inferior */}
        <nav
          aria-label="Paginación"
          className="mt-12 flex items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            &lt; Anterior
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`h-8 w-8 rounded text-xs font-medium transition-colors ${
                currentPage === page
                  ? 'bg-gray-100 font-bold text-gray-900'
                  : 'border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, 3))}
            disabled={currentPage === 3}
            className="rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente &gt;
          </button>
        </nav>
      </div>
    </section>
  );
}

export default StoreCatalog;
