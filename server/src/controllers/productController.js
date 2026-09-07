import { productService } from '../services/productService.js';

/**
 * Controlador HTTP para operaciones del catálogo de productos
 */
export const productController = {
  /**
   * Retorna la lista de productos
   */
  async getAll(req, res, next) {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Retorna un producto específico por ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Crea un nuevo producto
   */
  async create(req, res, next) {
    try {
      const { name, description, price, category, stock } = req.body;
      const newProduct = await productService.createProduct({
        name,
        description,
        price,
        category,
        stock,
      });

      res.status(201).json({
        success: true,
        message: 'Producto creado correctamente',
        data: newProduct,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualiza un producto existente
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await productService.updateProduct(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Elimina un producto por ID
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      res.status(200).json({
        success: true,
        message: 'Producto eliminado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },
};
