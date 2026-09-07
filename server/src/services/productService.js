import { productModel } from '../models/productModel.js';

/**
 * Servicio de lógica de negocio para la gestión de productos
 */
export const productService = {
  /**
   * Obtiene todos los productos del catálogo
   */
  async getAllProducts() {
    return productModel.findAll();
  },

  /**
   * Obtiene un producto por su identificador
   */
  async getProductById(id) {
    const product = await productModel.findById(id);
    if (!product) {
      const error = new Error(`Producto con id ${id} no encontrado`);
      error.statusCode = 404;
      throw error;
    }
    return product;
  },

  /**
   * Valida y crea un nuevo producto
   */
  async createProduct({ name, description, price, category, stock }) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      const error = new Error('El nombre del producto es obligatorio');
      error.statusCode = 400;
      throw error;
    }

    if (price === undefined || Number(price) <= 0) {
      const error = new Error('El precio debe ser un número positivo');
      error.statusCode = 400;
      throw error;
    }

    return productModel.create({
      name: name.trim(),
      description: description?.trim() || '',
      price: Number(price),
      category: category?.trim() || 'General',
      stock: stock !== undefined ? Number(stock) : 0,
    });
  },

  /**
   * Actualiza un producto existente
   */
  async updateProduct(id, updateData) {
    await this.getProductById(id); // Valida que exista primero
    return productModel.update(id, updateData);
  },

  /**
   * Elimina un producto por su id
   */
  async deleteProduct(id) {
    await this.getProductById(id);
    return productModel.delete(id);
  },
};
