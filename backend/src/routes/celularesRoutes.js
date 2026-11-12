import { Router } from 'express';
import {
  getCelulares,
  getCelularById,
  createCelular,
  updateCelular,
  deleteCelular,
  getMarcas,
  getEstadisticas
} from '../controllers/celularesController.js';
import { validateCelular } from '../middleware/validateCelular.js';

const router = Router();

// Rutas auxiliares
router.get('/marcas', getMarcas);
router.get('/estadisticas', getEstadisticas);

// Rutas principales del CRUD
router.get('/', getCelulares);
router.get('/:id', getCelularById);
router.post('/', validateCelular, createCelular);
router.put('/:id', validateCelular, updateCelular);
router.delete('/:id', deleteCelular);

export default router;
