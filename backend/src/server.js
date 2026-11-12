import dotenv from 'dotenv';
import app from './app.js';
import { initDB } from './db/init.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('--- Iniciando Servidor Backend Tienda de Celulares ---');
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);

    // Inicialización automática de la base de datos (DDL y semillas si aplica)
    await initDB();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Servidor escuchando en http://0.0.0.0:${PORT}`);
      console.log(`✓ Endpoint de salud: http://0.0.0.0:${PORT}/api/health`);
      console.log(`✓ Endpoint de catálogo: http://0.0.0.0:${PORT}/api/celulares`);
    });
  } catch (error) {
    console.error('✗ No se pudo iniciar el servidor debido a un fallo en la base de datos:', error.message);
    // En entornos como Railway, se puede reintentar o registrar el error
    process.exit(1);
  }
}

startServer();
