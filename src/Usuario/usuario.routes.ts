import { Router } from 'express';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from '../usuario/usuario';
import { UsuarioRepository } from './usuario.repository';

const router = Router();

const repository = new UsuarioRepository();
const service = new UsuarioService(repository);
const controller = new UsuarioController(service);

router.post('/', controller.crear);
router.get('/', controller.obtenerTodos);
router.get('/id/:id_usuario', controller.obtenerPorId);
router.get('/dni/:dni', controller.obtenerPorDni);
router.get('/rol/:rol', controller.obtenerPorRol);
router.put('/:id_usuario', controller.actualizar);
router.patch('/:id_usuario', controller.actualizar);
router.delete('/:id_usuario', controller.eliminar);


export default router;
