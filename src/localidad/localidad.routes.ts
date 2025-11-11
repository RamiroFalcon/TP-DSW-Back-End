import { Router } from 'express';
import { LocalidadController } from './localidad.controller';
import { LocalidadService } from './Localidad';
import { LocalidadRepository } from './localidad.repository';

const router = Router();

// Inyección de dependencias
const repository = new LocalidadRepository();
const service = new LocalidadService(repository);
const controller = new LocalidadController(service);

// Definir rutas
router.post('/localidades', controller.crear);
router.get('/localidades', controller.obtenerTodas);
router.get('/localidades/:id', controller.obtenerPorId);
router.put('/localidades/:id', controller.actualizar);
router.delete('/localidades/:id', controller.eliminar);

export default router;