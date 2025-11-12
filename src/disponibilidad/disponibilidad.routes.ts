import { Router } from 'express';
import { obtenerDisponibilidad, verificarDisponibilidad } from './disponibilidad.controller';

const router = Router();

router.get('/:id_cancha/:fecha', obtenerDisponibilidad);
router.post('/verificar', verificarDisponibilidad);

export default router;