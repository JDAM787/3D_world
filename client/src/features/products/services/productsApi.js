import apiClient from '@/services/apiClient';

/**
 * Llamadas a la API correspondientes a la feature de productos
 */
export const productsApi = {
  /**
   * Obtiene la lista completa de productos
   */
  async getAll() {
    return apiClient.get('/products');
  },

  /**
   * Obtiene el detalle de un producto por ID
   * @param {string|number} id 
   */
  async getById(id) {
    return apiClient.get(`/products/${id}`);
  },

  /**
   * Crea un nuevo producto
   * @param {Object} productData 
   */
  async create(productData) {
    return apiClient.post('/products', productData);
  },
};
