import { Router } from 'express';
import { PrecioController } from './precio.controller';

const router = Router();
const controller = new PrecioController();

router.post('/', (req, res) => controller.crear(req, res));
router.get('/cancha/:id_cancha', (req, res) => controller.obtenerPorCancha(req, res));
router.get('/actual/:id_cancha', (req, res) => controller.obtenerPrecioActual(req, res));
router.put('/:id_precio', (req, res) => controller.actualizar(req, res));
router.delete('/:id_precio', (req, res) => controller.eliminar(req, res));

export default router;
