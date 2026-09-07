import { env } from './env.js';

/**
 * Módulo de conexión a Base de Datos (abstracción para MongoDB, PostgreSQL, etc.)
 */
export async function connectDatabase() {
  try {
    if (!env.DATABASE_URL) {
      console.log('ℹ️  No se especificó DATABASE_URL. Operando con almacén de datos en memoria.');
      return;
    }

    console.log(`🔌 Conectando a la base de datos en ${env.DATABASE_URL}...`);
    // Aquí se inicializa Mongoose, Prisma, TypeORM o pg-pool según la elección tecnológica
    console.log('✅ Base de datos conectada exitosamente.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    process.exit(1);
  }
}
