import { Router } from 'express';
import { UsuarioController } from '../Usuario/usuario.controller';
import { UsuarioService } from '../Usuario/usuario';
import { UsuarioRepository } from '../Usuario/usuario.repository';

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
