import { Router } from 'express';
import { CanchaController } from '../cancha/cancha.controller';
import { CanchaService } from './cancha';
import { CanchaRepository } from './cancha.repository';
import { TipoCanchaRepository } from '../tipo-cancha/tipo-cancha.repository';

const router = Router();

const tipoCanchaRepository = new TipoCanchaRepository();
const repository = new CanchaRepository();
const service = new CanchaService(repository, tipoCanchaRepository);
const controller = new CanchaController(service);

router.post('/canchas', controller.crear);
router.get('/canchas', controller.obtenerTodas);
router.get('/canchas/:id', controller.obtenerPorId);
router.get('/canchas/tipo/:id_tipo', controller.obtenerPorTipo);
router.put('/canchas/:id', controller.actualizar);
router.delete('/canchas/:id', controller.eliminar);

export default router;