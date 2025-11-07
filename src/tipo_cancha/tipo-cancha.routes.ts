import { Router } from 'express';
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from './tipo-cancha.controller';

const router = Router();

// Este router se monta en app.ts con base '/api/tipo-canchas'
router.post('/', crear);
router.get('/', obtenerTodos);
router.get('/:id', obtenerPorId);
router.put('/:id', actualizar);
router.patch('/:id', actualizar);
router.delete('/:id', eliminar);

export default router;