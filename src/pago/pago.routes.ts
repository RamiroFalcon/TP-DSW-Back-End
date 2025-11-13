import { Router } from 'express';
import { PagoController } from './pago.controller.js';
import { PagoService } from './pago.js';
import { PagoRepository } from './pago.repository.js';

const router = Router();

const repository = new PagoRepository();
const service = new PagoService(repository);
const controller = new PagoController(service);

// ✅ ENDPOINTS COMPLETOS PARA PAGOS

// CREATE - Crear un nuevo pago
router.post('/', controller.crearPago);

// READ - Obtener pago por ID
router.get('/:id', controller.obtenerPago);

// READ - Obtener pago por reserva
router.get('/reserva/:id_reserva', controller.obtenerPagoPorReserva);

// UPDATE - Procesar pago (confirmar)
router.put('/:id/procesar', controller.procesarPago);

// UPDATE - Simular proceso de pago
router.post('/:id/simular', controller.simularPago);

// READ - Obtener todos los pagos (si necesitas)
router.get('/', async (req, res) => {
  // Este endpoint lo puedes implementar después si lo necesitas
  res.status(200).json({ 
    success: true, 
    message: 'Endpoint para obtener todos los pagos' 
  });
});

// UPDATE - Actualizar estado de pago
router.put('/:id', async (req, res) => {
  // Este endpoint lo puedes implementar después si lo necesitas
  res.status(200).json({ 
    success: true, 
    message: 'Endpoint para actualizar pago' 
  });
});

// DELETE - Eliminar pago (solo para desarrollo)
router.delete('/:id', async (req, res) => {
  // Este endpoint lo puedes implementar después si lo necesitas
  res.status(200).json({ 
    success: true, 
    message: 'Endpoint para eliminar pago' 
  });
});

export default router;