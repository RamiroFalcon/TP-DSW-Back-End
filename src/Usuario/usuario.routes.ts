import { Router } from 'express';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario';
import { UsuarioRepository } from '../Usuario/usuario.repository';
import { LocalidadRepository } from '../localidad/localidad.repository';

const router = Router();

const localidadRepository = new LocalidadRepository();
const repository = new UsuarioRepository();
const service = new UsuarioService(repository, localidadRepository);
const controller = new UsuarioController(service);

router.post('/usuarios', controller.crear);
router.get('/usuarios', controller.obtenerTodos);
router.get('/usuarios/:id', controller.obtenerPorId);
router.get('/usuarios/dni/:dni', controller.obtenerPorDni);
router.get('/usuarios/localidad/:id_localidad', controller.obtenerPorLocalidad);
router.get('/usuarios/rol/:rol', controller.obtenerPorRol);
router.put('/usuarios/:id', controller.actualizar);
router.delete('/usuarios/:id', controller.eliminar);

export default router;