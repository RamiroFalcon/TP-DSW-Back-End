import { Router } from 'express';
import { obtenerDisponibilidad, verificarDisponibilidad, obtenerDisponibilidadQuery } from './disponibilidad.controller.js';

const router = Router();

// Ruta con query params (para el frontend): /api/disponibilidad?id_cancha=1&fecha=2024-12-15
router.get('/', obtenerDisponibilidadQuery);

// Ruta con path params: /api/disponibilidad/1/2024-12-15
router.get('/:id_cancha/:fecha', obtenerDisponibilidad);

// Verificar disponibilidad específica
router.post('/verificar', verificarDisponibilidad);

export default router;