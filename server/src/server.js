import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

async function bootstrap() {
  try {
    // 1. Conexión a la base de datos
    await connectDatabase();

    // 2. Inicio del servidor HTTP
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Servidor backend escuchando en: http://localhost:${env.PORT}`);
      console.log(`📡 Entorno: ${env.NODE_ENV}`);
      console.log(`🔗 Origen permitido CORS: ${env.CLIENT_ORIGIN}`);
    });

    // Manejo de apagado elegante (Graceful Shutdown)
    const handleShutdown = (signal) => {
      console.log(`\n🛑 Recibida señal ${signal}. Cerrando servidor de forma ordenada...`);
      server.close(() => {
        console.log('✅ Servidor HTTP cerrado.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    console.error('💥 Error crítico al arrancar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();
