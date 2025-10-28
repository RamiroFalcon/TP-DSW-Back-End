import { Router } from 'express';
import { ReservaController } from './reserva.controller';
import { ReservaService } from './reserva';
import { ReservaRepository } from './reserva.repository';
import { CanchaRepository } from '../cancha/cancha.repository';
import { UsuarioRepository } from '../Usuario/usuario.repository';

const router = Router();

const canchaRepository = new CanchaRepository();
const usuarioRepository = new UsuarioRepository();
const repository = new ReservaRepository();
const service = new ReservaService(repository, canchaRepository, usuarioRepository);
const controller = new ReservaController(service);

router.post('/reservas', controller.crear);
router.get('/reservas', controller.obtenerTodas);
router.get('/reservas/:id', controller.obtenerPorId);
router.get('/reservas/cancha/:id_cancha', controller.obtenerPorCancha);
router.get('/reservas/cliente/:id_cliente', controller.obtenerPorCliente);
router.get('/reservas/fecha/:fecha', controller.obtenerPorFecha);
router.put('/reservas/:id', controller.actualizar);
router.delete('/reservas/:id', controller.eliminar);

export default router;