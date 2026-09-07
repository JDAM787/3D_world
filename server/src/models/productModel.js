/**
 * Modelo de Producto (Abstracción de capa de datos)
 */
let productsCollection = [
  {
    id: '1',
    name: 'Teclado Mecánico Custom 75%',
    description: 'Switches lubricados, keycaps PBT doble inyección y conectividad inalámbrica tri-modo.',
    price: 149.99,
    category: 'Periféricos',
    stock: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Monitor Gaming 27" QHD 180Hz',
    description: 'Panel IPS con cobertura 99% sRGB, tiempo de respuesta 1ms y compatibilidad G-Sync.',
    price: 299.99,
    category: 'Monitores',
    stock: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Mouse Ergonómico Ultraligero',
    description: 'Sensor óptico de 26,000 DPI, peso ultraligero de 54g y batería de hasta 90 horas.',
    price: 79.99,
    category: 'Periféricos',
    stock: 25,
    createdAt: new Date().toISOString(),
  },
];

export const productModel = {
  async findAll() {
    return [...productsCollection];
  },

  async findById(id) {
    return productsCollection.find((p) => p.id === String(id)) || null;
  },

  async create(productData) {
    const newProduct = {
      id: String(productsCollection.length + 1),
      ...productData,
      createdAt: new Date().toISOString(),
    };
    productsCollection.push(newProduct);
    return newProduct;
  },

  async update(id, updateData) {
    const index = productsCollection.findIndex((p) => p.id === String(id));
    if (index === -1) return null;
    productsCollection[index] = { ...productsCollection[index], ...updateData };
    return productsCollection[index];
  },

  async delete(id) {
    const index = productsCollection.findIndex((p) => p.id === String(id));
    if (index === -1) return false;
    productsCollection.splice(index, 1);
    return true;
  },
};
