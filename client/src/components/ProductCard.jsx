import React from 'react';

export function ProductCard({
  title = 'Lorem ipsum dolor sit',
  specs = 'Lorem material / specs',
  price = '$00.00',
  ctaText = 'Ver detalle',
  onAction,
}) {
  return (
    <article className="flex flex-col border border-gray-800 bg-gray-900/60 transition-colors hover:border-gray-700">
      {/* Contenedor de imagen placeholder neutro */}
      <div className="relative flex aspect-[3/4] w-full items-center justify-center border-b border-gray-800 bg-gray-800 text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-10 w-10 text-gray-600"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </div>

      {/* Contenido y metadatos */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-white uppercase line-clamp-2">
            {title}
          </h3>
          <p className="mt-1 text-xs text-gray-400">
            {specs}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-800/80 pt-3">
          <span className="text-sm font-semibold text-gray-200">
            {price}
          </span>
          <button
            type="button"
            onClick={onAction}
            className="rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
          >
            {ctaText}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
