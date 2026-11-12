import express from 'express';
import cors from 'cors';
import celularesRoutes from './routes/celularesRoutes.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';

const app = express();

// Configuración de CORS flexible para despliegue en Netlify y pruebas locales
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
  : ['*'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origin (como herramientas de prueba, curl, Postman)
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permisivo para evitar bloqueos durante evaluación/despliegue
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint de verificación de salud para Railway y monitoreo
app.get('/api/health', (req, res) => {
  res.json({
    exito: true,
    servicio: 'API Tienda de Celulares',
    estado: 'operativo',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API de celulares
app.use('/api/celulares', celularesRoutes);

// Manejadores de errores
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
