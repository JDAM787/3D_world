import apiClient from '@/services/apiClient';

/**
 * Llamadas a la API correspondientes a la feature de autenticación
 */
export const authApi = {
  /**
   * Inicia sesión con credenciales
   * @param {{ email: string, password: string }} credentials 
   */
  async login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },

  /**
   * Obtiene la información del usuario autenticado
   */
  async getProfile() {
    return apiClient.get('/auth/profile');
  },

  /**
   * Cierra sesión
   */
  async logout() {
    return apiClient.post('/auth/logout');
  },
};
