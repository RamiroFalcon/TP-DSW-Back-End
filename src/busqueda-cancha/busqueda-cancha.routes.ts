import { Router } from 'express';
import { buscarCanchas } from './busqueda-cancha.controller';

const router = Router();

// GET /api/buscar-canchas?fecha=YYYY-MM-DD&id_tipo=1&id_localidad=2
router.get('/', buscarCanchas);

export default router;