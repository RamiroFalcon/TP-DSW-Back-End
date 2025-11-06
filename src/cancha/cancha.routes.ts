import { Router } from 'express';
import { CanchaController } from './cancha.controller';
import { CanchaService } from '../cancha/cancha';
import { CanchaRepository } from './cancha.repository';

const router = Router();

const repository = new CanchaRepository();
const service = new CanchaService(repository);
const controller = new CanchaController(service);

router.post('/api/canchas', controller.crear);
router.get('/api/canchas', controller.obtenerTodas);
router.get('/api/canchas/:id', controller.obtenerPorId);
router.get('/tipo/:id_tipo', (req, res) => controller.obtenerPorTipo(req, res));
router.put('/api/canchas/:id', controller.actualizar);
router.delete('/api/canchas/:id', controller.eliminar);

export default router;
