import { useState, useEffect, useCallback } from 'react';
import { productsApi } from '../services/productsApi';

/**
 * Custom hook para gestionar listado, carga y mutaciones de productos
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await productsApi.getAll();
      setProducts(response.data || []);
    } catch (err) {
      setError(err.message || 'Error al obtener productos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  };
}
