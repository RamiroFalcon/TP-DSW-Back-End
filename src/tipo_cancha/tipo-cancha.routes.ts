import { Router } from 'express';
import { TipoCanchaController } from './tipo-cancha.controller';
import { TipoCanchaService } from './tipo-cancha';
import { TipoCanchaRepository } from '../tipo_cancha/tipo-cancha.repository';

const router = Router();

const repository = new TipoCanchaRepository();
const service = new TipoCanchaService(repository);
const controller = new TipoCanchaController(service);

router.post('/tipos-cancha', controller.crear);
router.get('/tipos-cancha', controller.obtenerTodos);
router.get('/tipos-cancha/:id', controller.obtenerPorId);
router.put('/tipos-cancha/:id', controller.actualizar);
router.delete('/tipos-cancha/:id', controller.eliminar);

export default router;