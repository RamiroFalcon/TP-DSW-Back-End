import { Router } from 'express';
import { LocalidadController } from './localidad.controller.js';
import { LocalidadService } from './localidad.js';
import { LocalidadRepository } from './Localidad.repository.js';

const router = Router();

// Inyección de dependencias
const repository = new LocalidadRepository();
const service = new LocalidadService(repository);
const controller = new LocalidadController(service);

// ✅ Rutas sin el prefijo "/localidades"
router.post('/', controller.crear);
router.get('/', controller.obtenerTodas);
router.get('/:id', controller.obtenerPorId);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

export default router;
