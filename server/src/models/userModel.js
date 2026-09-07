/**
 * Modelo de Usuario (Abstracción de capa de datos)
 */
const usersCollection = [
  {
    id: '1',
    name: 'Usuario Demo',
    email: 'admin@demo.com',
    passwordHash: '$2a$10$wN3Hq8w09ZqWz7X5dYz9Me7R0hUj4oFmS6zKx9G2lH1yP3m4Q5v8q', // demo123
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];

export const userModel = {
  async findByEmail(email) {
    return usersCollection.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findById(id) {
    const user = usersCollection.find((u) => u.id === id);
    if (!user) return null;
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  },

  async create({ name, email, passwordHash, role = 'user' }) {
    const newUser = {
      id: String(usersCollection.length + 1),
      name,
      email,
      passwordHash,
      role,
      createdAt: new Date().toISOString(),
    };
    usersCollection.push(newUser);
    const { passwordHash: _, ...sanitized } = newUser;
    return sanitized;
  },
};
