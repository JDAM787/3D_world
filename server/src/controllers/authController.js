import { authService } from '../services/authService.js';

/**
 * Controlador HTTP para operaciones de autenticación
 */
export const authController = {
  /**
   * Procesa la solicitud de login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Debes proporcionar un correo electrónico y una contraseña',
        });
      }

      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Sesión iniciada con éxito',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtiene la información del usuario autenticado
   */
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await authService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Cierra sesión
   */
  async logout(req, res) {
    res.status(200).json({
      success: true,
      message: 'Sesión cerrada correctamente',
    });
  },
};
