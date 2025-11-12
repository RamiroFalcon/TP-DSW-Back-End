import { Router } from 'express';
import { buscarCanchas, buscarCanchasPorNombres } from './busqueda-cancha.controller.js';

const router = Router();

// GET /api/buscar-canchas?fecha=YYYY-MM-DD&id_tipo=1&id_localidad=2
router.get('/', buscarCanchas);

// POST /api/buscar-canchas (para el frontend)
router.post('/', buscarCanchasPorNombres);

export default router;